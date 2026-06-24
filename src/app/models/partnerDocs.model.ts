import mongoose from "mongoose";

interface IPartnerDocs {
  owner: mongoose.Types.ObjectId;
  aadharUrl: string;
  licenseUrl: string;
  rcUrl: string;
  status: "approved" | "pending" | "rejected";
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const partnerDocsSchema = new mongoose.Schema<IPartnerDocs>(
  {
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      emun: ["approved", "pending", "rejected"],
      default: "pending",
    },
    rejectionReason: String,
    aadharUrl: String,
    licenseUrl: String,
    rcUrl: String,
  },
  { timestamps: true },
);

const PartnersDocs =
  mongoose.models.PartnersDocs || mongoose.model("PartnersDocs", partnerDocsSchema);
export default PartnersDocs;
