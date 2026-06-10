'use client'
import React, { useState } from 'react'
import HeroSection from './HeroSection'
import VehicleSlider from './VehicleSlider'
import AuthModel from './AuthModel'

const PublicHome = () => {
  const [authOpen, steAuthOpen]=useState(false)
  return (
    <>
      <HeroSection/>
      <VehicleSlider/>
      <AuthModel open={authOpen} onClose={()=>steAuthOpen(false)} />
    </>
  )
}

export default PublicHome
