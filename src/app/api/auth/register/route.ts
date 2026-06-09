import User from "@/app/models/user.model";
import connectDb from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
  try {
    await connectDb()
    const {name, email, password} = await req.json()
    let user=await User.findOne({email})
    if(user){
      return NextResponse.json(
        {message:"user already exits."},
        {status:200}
      )
    }

    if(password.length < 6){
      return NextResponse.json(
        {message:"password must be 6 character"},
        {status:400}
      )
    }
    const hashedPassword=await bcrypt.hash(password, 10)

    user=await User.create({
      name, email, password:hashedPassword
    })

    return NextResponse.json(
      user,
      {status:201}
    )

  } catch (error) {
    return NextResponse.json(
        {message:`register error ${error}`},
        {status:500}
      )
  }
}