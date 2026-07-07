import PartnersBank from "@/app/models/partnerBank.model";
import PartnersDocs from "@/app/models/partnerDocs.model";
import User from "@/app/models/user.model";
import { auth } from "@/auth";
import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req:NextRequest,
  context:{params:Promise<{id:string}>}
) {
  try {
    await connectDb();
    const {rejectionReason} = await req.json()
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

    partner.partnerStatus="rejected"
    partner.rejectionReason=rejectionReason
    await partner.save()

    return NextResponse.json(
      {message:"partner rejected successfully"},
      {status:200}
    )

  } catch (error) {
    return NextResponse.json(
      {message:`partner rejected get error ${error}`},
      {status:500}
    )
  }
}