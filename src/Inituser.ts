'use client'
import { useSession } from 'next-auth/react'
import React from 'react'
import useGetMe from './hooks/useGetMe'

const Inituser = () => {
  const {status}=useSession()
  useGetMe(status=="authenticated")
  return null
}

export default Inituser
