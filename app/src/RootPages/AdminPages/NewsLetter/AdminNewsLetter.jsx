import React, {useEffect, useState} from 'react'
import { Plus, MoveLeft, MoveRight, Dot } from 'lucide-react'
import AdminEventCard from '../../../components/AdminComponents/AdminEventCard'
import axios from 'axios'
import EventsTable from '../../../components/AdminComponents/EventsTable'
import CircularLoading from "../../../components/LoadingComponents/circularloading" 
import { Navigate, useNavigate } from 'react-router-dom'


function AdminNewsletter() {
  return (
    <div className='h-screen w-full p-6 flex flex-col'>
      {/* Events header and new event button */}
      <div className='flex flex-row justify-between mb-10'>
        <h1 className='font-satoshi-bold text-5xl text-black'>Newsletter</h1>
        <button className='flex flex-row items-center justify-center gap-2 font-satoshi-regular text-white bg-primary px-6 py-3 rounded-2xl hover:bg-hover cursor-pointer' onClick={() => {}}> 
          <Plus/> New Newsletter
        </button>
      </div>
      </div>  
  )
}

export default AdminNewsletter