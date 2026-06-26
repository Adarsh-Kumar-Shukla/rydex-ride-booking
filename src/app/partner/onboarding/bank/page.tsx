"use client";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle,
  CreditCard,
  Landmark,
  Loader,
  Phone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

const IFSC_REGEX=/^[A-Z]{4}0[A-Z0-9]{6}$/

const page = () => {
  const router = useRouter();
  const [accountHolder, setAccountHolder]=useState("")
  const [accountNumber, setAccountNumber]=useState("")
  const [ifsc, setIfsc]=useState("")
  const [mobileNumber, setMobileNumber]=useState("")
  const [upi, setUpi]=useState("")
  const [loading, setLoading]=useState(false)
  const [error, setError]=useState("")

  const sanitizedIfsc=ifsc.trim().toUpperCase()
  const isNameValid=accountHolder.trim().length>=3
  const isAccountvalid=accountNumber.trim().length>=9
  const isIfscValid=IFSC_REGEX.test(sanitizedIfsc)
  const isMobileValid=mobileNumber.length==10

  const canSubmit=isNameValid && isAccountvalid && isIfscValid && isMobileValid

  const handleBank= async()=>{
    setLoading(true)
    setError("")
    try {
      const {data}=await axios.post("/api/partner/onboarding/bank",
        {accountHolder, accountNumber, ifsc:sanitizedIfsc, upi, mobileNumber}
      )
      console.log(data)
      setLoading(false)
    } catch (error:any) {
      setError(error?.response?.data?.message || "something went wrong")
      setLoading(false)
      console.log(error)
    }
  }

  useEffect(()=>{
    const handleGetBank= async()=>{
    try {
      const {data}=await axios.get("/api/partner/onboarding/bank")
      setAccountHolder(data.partnerBank.accountHolder)
      setAccountNumber(data.partnerBank.accountNumber)
      setIfsc(data.partnerBank.ifsc)
      setUpi(data.partnerBank.upi)
      setMobileNumber(data.mobileNumber)
      console.log(data)
    } catch (error:any) {
      console.log(error)
    }
  }
  handleGetBank()
  },[])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl bg-white rounded-3xl border border-gray-200 shadow-[0_25px_70px_rgba(0,0,0,0.15)] p-6 sm:p-8"
      >
        <div className="relative text-center">
          <button
            onClick={() => router.back()}
            className="absolute left-0 top-0 w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
          >
            <ArrowLeft size={18} />{" "}
          </button>
          <p className="text-xs text-gray-500 font-medium">step 3 of 3</p>
          <h1 className="text-2xl font-bold mt-1">Bank & Payout Setup</h1>
          <p className="text-sm text-gray-500 mt-2">Used for Partner Payouts</p>
        </div>
        <div className="mt-8 space-y-6">
          <div>
            <label htmlFor="ahn">Account holder name</label>
            <div className="flex items-center gap-2 mt-2">
              <div className="text-gray-400">
                <BadgeCheck />
              </div>
              <input
                type="text"
                id="ahn"
                onChange={(e)=>setAccountHolder(e.target.value)}
                value={accountHolder}
                placeholder="As per bank records"
                className={`flex-1 border-b pb-2 text-sm focus:outline-none ${!isNameValid && accountHolder.length>0 ? "border-red-300 focus:border-red-500"  : "border-gray-300 focus:border-black" } `}
              />
            </div>
            {!isNameValid && accountHolder.length>0  && <p className="mt-1 text-xs text-red-500">*Minimum 3 character required.</p> }
          </div>
          <div>
            <label htmlFor="ban">Bank Account Number</label>
            <div className="flex items-center gap-2 mt-2">
              <div className="text-gray-400">
                <CreditCard />
              </div>
              <input
                type="number"
                id="ban"
                placeholder="Enter Account Number"
                onChange={(e)=>setAccountNumber(e.target.value)}
                value={accountNumber}
                className={`flex-1 border-b pb-2 text-sm focus:outline-none ${!isAccountvalid && accountNumber.length>0 ? "border-red-300 focus:border-red-500"  : "border-gray-300 focus:border-black" } `}
              />
            </div>
            {!isAccountvalid && accountNumber.length>0  && <p className="mt-1 text-xs text-red-500">*Account number must be at least 9 digits.</p> }
          </div>
          <div>
            <label htmlFor="ifsc">IFSC Code</label>
            <div className="flex items-center gap-2 mt-2">
              <div className="text-gray-400">
                <Landmark />
              </div>
              <input
                type="text"
                id="ifsc"
                placeholder="SBI002026"
                onChange={(e)=>setIfsc(e.target.value)}
                value={ifsc}
                className={`flex-1 border-b pb-2 text-sm focus:outline-none ${!isIfscValid && ifsc.length>0 ? "border-red-300 focus:border-red-500"  : "border-gray-300 focus:border-black" } `}
              />
            </div>
            {!isIfscValid && ifsc.length>0  && <p className="mt-1 text-xs text-red-500">*Invalid IFSC code</p> }
          </div>
          <div>
            <label htmlFor="mobile">Mobile Number</label>
            <div className="flex items-center gap-2 mt-2">
              <div className="text-gray-400">
                <Phone />
              </div>
              <input
                type="number"
                id="mobile"
                placeholder="10 digits mobile number"
                onChange={(e)=>setMobileNumber(e.target.value)}
                value={mobileNumber}
                className={`flex-1 border-b pb-2 text-sm focus:outline-none ${!isMobileValid && mobileNumber.length>0 ? "border-red-300 focus:border-red-500"  : "border-gray-300 focus:border-black" } `}
              />
            </div>
            {!isMobileValid && mobileNumber.length>0  && <p className="mt-1 text-xs text-red-500">*Mobile number should be 10 digits.</p> }
          </div>
          <div>
            <label htmlFor="upi">UPI ID (optional)</label>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                id="upi"
                placeholder="name@upi"
                onChange={(e)=>setUpi(e.target.value)}
                value={upi}
                className="flex-1 border-b pb-2 text-sm focus:outline-none border-gray-300 focus:border-black"
              />
            </div>
          </div>
        </div>
        {error && <p className='text-red-500 mt-4'>*{error}</p> }
        <div className='mt-6 flex items-start gap-3 text-xs text-gray-500'>
          <CheckCircle size={18} className='mt-0.5'/>
          <p>Bank details are verified before first payout. This usually takes 24-28 hours.</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleBank}
          disabled={!canSubmit || loading}
          className="mt-8 w-full h-14 rounded-2xl bg-black text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-40 transition"
        >
          {loading ? <Loader size={18} className="text-white animate-spin" /> : "Continue"}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default page;
