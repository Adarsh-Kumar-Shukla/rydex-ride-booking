import User from "@/app/models/user.model";
import Vehicle from "@/app/models/vehicle.model";
import { auth } from "@/auth";
import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
  try {
    await connectDb();
    const session = await auth();
    if (!session || !session.user?.email || session.user.role!=="admin") {
      return Response.json({ message: "unauthorized" }, { status: 400 });
    }
    const totalPartners=await User.countDocuments({role:"partner"})
    const totalApprovedPartner=await User.countDocuments({role:"partner", partnerStatus:"approved"})
    const totalPendingPartner=await User.countDocuments({role:"partner", partnerStatus:"pending"})
    const totalRejectedPartner=await User.countDocuments({role:"partner", partnerStatus:"rejected"})

    const pendingPartnerUsers=await User.find({
      role:"partner",
      partnerStatus:"pending",
      partnerOnBoardingSteps:3
    })

    const partnerIds=pendingPartnerUsers.map((p)=>p._id)
    const partnersVehicles=await Vehicle.find({
      owner:{$in:partnerIds}
    })
    const vehicleTypeMap=new Map(
      partnersVehicles.map((v)=>[v.owner, v.type])
    )

    const pendingPartnerReviews=pendingPartnerUsers.map((p)=>({
      _id:p._id,
      name:p.name,
      email:p.email,
      vehicleType:vehicleTypeMap.get(String(p._id))
    }))

    return NextResponse.json(
      {
        stats:{
          totalPartners,
          totalApprovedPartner,
          totalPendingPartner,
          totalRejectedPartner
        },
        pendingPartnerReviews
      },
      {status:201}
    )
  } catch (error) {
    return NextResponse.json(
      {message:`admin dashboard error ${error}`},
      {status:500}
    )
  }
}