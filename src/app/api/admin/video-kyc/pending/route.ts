import User from "@/app/models/user.model";
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
    const partner= await User.find({
      role:"partner",
      partnerOnBoardingSteps:4,
      videoKycStatus:{$in:["pending", "in_progress"]}
    })
    return Response.json(
      partner,
      {status:200}
    )
  } catch (error) {
    return Response.json(
      {message:`partner kyc error ${error}`},
      {status:500}
    )
  }
}