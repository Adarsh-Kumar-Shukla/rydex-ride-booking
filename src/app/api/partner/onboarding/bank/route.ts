import PartnersBank from "@/app/models/partnerBank.model";
import User from "@/app/models/user.model";
import { auth } from "@/auth";
import connectDb from "@/lib/db";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    if (!session || !session.user?.email) {
      return Response.json({ message: "unauthorized" }, { status: 400 });
    }
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return Response.json({ message: "user not found" }, { status: 400 });
    }
    
    const {accountHolder, accountNumber, ifsc, upi, mobileNumber} = await req.json()

    if(!accountHolder || !accountNumber || !ifsc || !mobileNumber){
      return Response.json(
      {message:`send all bank details`},
      { status: 400 },
    );
    }

    const partnerBank=await PartnersBank.findOneAndUpdate(
      {owner:user._id},
      {
        accountHolder,
        accountNumber,
        ifsc,
        upi,
        status:"added"
      },
      {upsert:true, new:true}
    )

    user.mobileNumber=mobileNumber

    user.partnerOnBoardingSteps = 3

    user.partnerStatus="pending"


    await user.save()

    return Response.json(
      partnerBank,
      { status: 201 },
    );
    
  } catch (error) {
    return Response.json(
      {message:`partnerBank error ${error}`},
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    if (!session || !session.user?.email) {
      return Response.json({ message: "unauthorized" }, { status: 400 });
    }
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return Response.json({ message: "user not found" }, { status: 400 });
    }
    
    const partnerBank=await PartnersBank.findOne({owner:user._id})

    if(partnerBank){
      return Response.json(
        {
          partnerBank,
          mobileNumber:user.mobileNumber 
        },
        {status:201}
      )
    }else{
      return null
    }
  } catch (error) {
    return Response.json(
      {message:`get partnerBank error ${error}`},
      { status: 500 },
    );
  }
}