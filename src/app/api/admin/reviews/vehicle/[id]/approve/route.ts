import User from "@/app/models/user.model";
import Vehicle from "@/app/models/vehicle.model";
import { auth } from "@/auth";
import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req:NextRequest,
  context:{params:Promise<{id:string}>}
){
  try {
    await connectDb();
    const session = await auth();
    if (!session || !session.user?.email || session.user.role!=="admin") {
      return Response.json({ message: "unauthorized" }, { status: 400 });
    }
    const vehicleId=(await (context.params)).id
    const vehicle=await Vehicle.findById(vehicleId)

    if(!vehicle){
      return NextResponse.json(
        {message:"vehicle not found"},
        {status:400}
      )
    }

    vehicle.status="approved"
    vehicle.rejectionReason=undefined
    await vehicle.save()
    
    const partner=await User.findById(vehicle.owner)
    if(!partner){
      return NextResponse.json(
        {message:"partner not found"},
        {status:400}
      )
    }

    partner.partnerOnBoardingSteps=7
    await partner.save()

    return Response.json(vehicle, { status: 200 });
  } catch (error:any) {
    return Response.json({ message: `vehicle approved error ${error}` }, { status: 500 });
  }
}