import User from "@/app/models/user.model";
import Vehicle from "@/app/models/vehicle.model";
import { auth } from "@/auth";
import connectDb from "@/lib/db";

const VEHICLE_REGEX=/^[A-Z]{2}[0-9]{0-2}[A-Z]{0,2}[0-9]{4}$/

export async function POST(req:Request){
  try {
    await connectDb()
    const session=await auth()
    if(!session || !session.user?.email){
      return Response.json(
        {messge:"unauthorized"},
        {status:400}
      )
    }
    const user=await User.find({email:session.user.email})
    if(!user){
      return Response.json(
        {messge:"user not found"},
        {status:400}
      )
    }
    const {type, number, vehicleModel}=await req.json()
    if(!type || !number || !vehicleModel){
      return Response.json(
        {messge:"missing required details"},
        {status:400}
      )
    }
    if(!VEHICLE_REGEX.test(number)){
      return Response.json(
        {messge:"Invalid Vehicle Number Format"},
        {status:400}
      )
    }
    
    const vehicleNumber=number.toUpperCase()
    const duplicateVehicle=await Vehicle.findOne({number:vehicleNumber})
    if(duplicateVehicle){
      return Response.json(
        {messge:"Vehicle already registered"},
        {status:400}
      )
    }
    let vehicle=await Vehicle.findOne({owner:session.user.id})
    if(vehicle){
      vehicle.type=type,
      vehicle.number=vehicleNumber,
      vehicle.vehicleModel=vehicleModel
      vehicle.status="pending"
      await vehicle.save()
      return Response.json(
        vehicle,
        {status:200}
      )
    }else{
      vehicle=await Vehicle.create({
        type,
        number:vehicleNumber,
        vehicleModel
      })
      return Response.json(
        vehicle,
        {status:201}
      )
    }
    
  } catch (error) {
    console.log(error)
  }
}