import mongoose from "mongoose";

export interface IPartnerBank {
  owner: mongoose.Types.ObjectId;
  accountHolder: string;
  accountNumber: string;
  ifsc: string;
  upi: string;
  status: "not_added" | "added" | "verified";
  createdAt: Date;
  updatedAt: Date;
}

const partnerBankSchema = new mongoose.Schema<IPartnerBank>(
  {
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    accountHolder:{
      type:String,
      required:true
    },
    accountNumber: {
      type:String,
      required:true,
      unique:true
    },
    ifsc: {
      type:String,
      required:true,
      uppercase:true
    },
    upi: {
      type:String,
      required:true
    },
    status: {
      type: String,
      emun: ["not_added", "added", "verified"],
      default: "not_added",
    },
  },
  { timestamps: true },
);

const PartnersBank =
  mongoose.models.PartnersBank || mongoose.model("PartnersBank", partnerBankSchema);
export default PartnersBank;
