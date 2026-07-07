import PartnersBank from "@/app/models/partnerBank.model";
import PartnersDocs from "@/app/models/partnerDocs.model";
import User from "@/app/models/user.model";
import Vehicle from "@/app/models/vehicle.model";
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

    const vehicle = await Vehicle.findOne({owner:partnerId})
    const document = await PartnersDocs.findOne({owner:partnerId})
    const bank = await PartnersBank.findOne({owner:partnerId})

    return NextResponse.json(
      {
        partner,
        vehicle:vehicle || null,
        document:document || null,
        bank:bank || null
      },
      {status:200}
  )
  } catch (error) {
    return NextResponse.json(
      {message:`partner get error ${error}`},
      {status:500}
    )
  }
}