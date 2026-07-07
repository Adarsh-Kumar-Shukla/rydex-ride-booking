import PartnersBank from "@/app/models/partnerBank.model";
import PartnersDocs from "@/app/models/partnerDocs.model";
import User from "@/app/models/user.model";
import { auth } from "@/auth";
import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req:NextRequest,
  context:{params:Promise<{id:string}>}
) {
  try {
    await connectDb();
    const session = await auth();
    if (!session || !session.user?.email || session.user.role!=="admin") {
      return Response.json({ message: "unauthorized" }, { status: 400 });
    }
    const partnerId=(await (context.params)).id
    const partner=await User.findById(partnerId)

    if(!partner || partner.role!=="partner"){
      return NextResponse.json(
        {message:"partner not found"},
        {status:400}
      )
    }

    if(partner.partnerStatus==="approved"){
      return NextResponse.json(
        {message:"partner already exits"},
        {status:400}
      )
    }

    const partnerDocs= await PartnersDocs.findOne({owner:partner._id})
    const partnerBank= await PartnersBank.findOne({owner:partner._id})

    if(!partnerDocs || !partnerBank){
      return NextResponse.json(
        {message:"partner did not completed on boarding steps"},
        {status:400}
      )
    }

    partner.partnerStatus="approved"
    partner.partnerOnBoardingSteps=4
    await partner.save()
    partnerDocs.status="approved"
    await partnerDocs.save()
    partnerBank.status="verified"
    await partnerBank.save()

    return NextResponse.json(
      {message:"partner approved successfully"},
      {status:200}
    )

  } catch (error) {
    return NextResponse.json(
      {message:`partner approved get error ${error}`},
      {status:500}
    )
  }
}