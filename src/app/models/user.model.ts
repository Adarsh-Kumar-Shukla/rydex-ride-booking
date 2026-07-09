import mongoose, { Document } from "mongoose";

type VideoKycStatus= "not_required" | "pending" | "in_progress" | "approved" | "rejected"

export interface IUser extends Document{
  name:string;
  email:string;
  password?:string;
  role:"user" | "partner" | "admin";
  isEmailVerified?:boolean;
  otp?:string;
  otpExpiresAt?:Date;
  partnerOnBoardingSteps?:number;
  partnerStatus:"pending" | "approved" | "rejected"
  rejectionReason?:string,
  videoKycStatus:VideoKycStatus,
  videoKycRoomId:string,
  videoKycRejectionReason:string,
  mobileNumber?:string,
  createdAt:Date;
  updatedAt:Date
}

const userSchema=new mongoose.Schema<IUser>({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
  },
  role:{
    type:String,
    default:"user",
    enum:["user", "partner", "admin"]
  },
  isEmailVerified:{
    type:Boolean,
    default:false
  },
  otp:{
    type:String,
  },
  otpExpiresAt:{
    type:Date
  },
  partnerOnBoardingSteps:{
    type:Number,
    min:0,
    max:8,
    default:0
  },
  partnerStatus:{
    type:String,
    default:"pending",
    enum:["pending" , "approved" , "rejected"]
  },
  rejectionReason:{
    type:String,
  },
  videoKycStatus:{
    type:String,
    enum:["not_required" , "pending" , "in_progress" , "approved" , "rejected"],
    default:"not_required"
  },
  videoKycRoomId:{
    type:String,
  },
  videoKycRejectionReason:{
    type:String,
  },
  mobileNumber:{
    type:String
  }
},{timestamps:true})

const User= mongoose.models.User || mongoose.model("User", userSchema)
export default User