'use client'
import React, { useEffect, useState } from 'react'
import { motion, scale } from 'motion/react'
import { ArrowLeft, Bike, Car, Loader, Package, Truck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

const VEHICLE=[
  {id:"bike", label:"Bike", desc:"2 wheeler", icon:Bike},
  {id:"auto", label:"Auto", desc:"3 wheeler ride", icon:Car},
  {id:"car", label:"Car", desc:"4 wheeler ride", icon:Car},
  {id:"loading", label:"Loading", desc:"Small goods", icon:Package},
  {id:"truck", label:"Truck", desc:"Heavy transport", icon:Truck},
]

const page = () => {
  const router=useRouter()
  const [vehicleType, setVehicleType]=useState("")
  const [vehicleNumber, setVehicleNumber]=useState("")
  const [vehicleModel, setVehicleModel]=useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handlevehicle=async()=>{
    setError("")
    try {
      setLoading(true)
      const data = await axios.post("/api/partner/onboarding/vehicle",
        {
          type:vehicleType,
          number:vehicleNumber,
          vehicleModel:vehicleModel
        }
      )
      setLoading(false)
      console.log(data)
    } catch (error:any) {
      setError(error?.response?.data?.message ?? "something went wrong")
      console.log(error)
      setLoading(false)
    }
  }

  useEffect(()=>{
    const handleGetVehicle=async()=>{
    try {
      const {data} = await axios.get("/api/partner/onboarding/vehicle")
      setVehicleType(data.type)
      setVehicleNumber(data.number)
      setVehicleModel(data.vehicleModel)
    } catch (error:any) {
      console.log(error)
    }
  }
  handleGetVehicle()
  },[])

  return (
    <div className='min-h-screen bg-white flex items-center justify-center px-4'>
      <motion.div
      initial={{opacity:0, y:30}}
      animate={{opacity:1, y:0}}
      transition={{duration: 0.4}}
      className='w-full max-w-xl bg-white rounded-3xl border border-gray-200 shadow-[0_25px_70px_rgba(0,0,0,0.15)] p-6 sm:p-8'
      >
        <div className='relative text-center'>
          <button 
          onClick={()=>router.back()}
          className='absolute left-0 top-0 w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition'><ArrowLeft size={18}/> </button>
          <p className='text-xs text-gray-500 font-medium'>
            step 1 of 3 
          </p>
          <h1 className='text-2xl font-bold mt-1'>Vehicle Details</h1>
          <p className='text-sm text-gray-500 mt-2'>
            Add your Vehicle information
          </p>
        </div>
        <div className='mt-8 space-y-6'>
          <div>
            <p className='text-xs font-semibold text-gray-500 mb-3'>Vehicle Types</p>
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
              {VEHICLE.map((v, i)=>{
                const Icon=v.icon
                const active=vehicleType==v.id
                return (
                  <motion.div
                  key={v.id}
                  whileHover={{scale:1.05}}
                  whileTap={{scale:0.95}}
                  onClick={()=>setVehicleType(v.id)}
                  className={`rounded-2xl border p-4 flex flex-col items-center gap-2 transition
                    ${active
                    ? "bg-black text-white border-black"
                    : "border-gray-200 hover:border-black"}`}
                  >
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center ${active
                    ? "bg-white text-black"
                    : "bg-black text-white"}`}>
                      <Icon/>
                    </div>
                    <div className='text-sm font-semibold'>
                      {v.label}
                    </div>
                    <p className={`text-xs ${active
                      ? "text-gray-300"
                      : "text-gray-500"}`}>
                      {v.desc}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </div>
          <div>
            <label htmlFor='vn' className='text-xs font-semibold text-gray-500'>Vehicle Number</label>
            <input 
            type="text" 
            id='vn' 
            className='mt-2 w-full border-b border-gray-300 pb-2 text-sm focus:outline-none focus:border-black transition' 
            placeholder='UP78FG2026'
            value={vehicleNumber}
            onChange={(e)=>setVehicleNumber(e.target.value.toUpperCase())}
             />
          </div>
          <div>
            <label htmlFor='vm' className='text-xs font-semibold text-gray-500'>Vehicle Model</label>
            <input 
            type="text" 
            id='vm' 
            className='mt-2 w-full border-b border-gray-300 pb-2 text-sm focus:outline-none focus:border-black transition' 
            placeholder='Tata Ace'
            value={vehicleModel}
            onChange={(e)=>setVehicleModel(e.target.value)}
             />
          </div>
          {error && <p className='text-red-500 mt-4'>*{error}</p> }
          <motion.button
          onClick={handlevehicle}
          whileTap={{scale: 0.97}}
          whileHover={{scale: 1.02}}
          disabled={loading}
          className='mt-8 w-full h-14 rounded-2xl bg-black text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-40 transition'
          >
            {loading ? <Loader size={18} className="text-white animate-spin" /> : "Continue"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

export default page
