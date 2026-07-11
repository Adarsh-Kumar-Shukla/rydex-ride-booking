import User from "@/app/models/user.model";
import Vehicle from "@/app/models/vehicle.model";
import { auth } from "@/auth";
import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req:NextRequest,
  context:{params:Promise<{id:string}>}
){
  try {
    const {reason}=await req.json()
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

    vehicle.status="rejected"
    vehicle.rejectionReason=reason
    await vehicle.save()

    return Response.json(vehicle, { status: 200 });
  } catch (error:any) {
    return Response.json({ message: `vehicle rejected error ${error}` }, { status: 500 });
  }
}