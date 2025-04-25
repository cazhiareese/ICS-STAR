import React, {useEffect, useState} from 'react'
import { Plus, MoveLeft, MoveRight, Dot } from 'lucide-react'
import AdminEventCard from '../../../components/AdminComponents/AdminEventCard'
import axios from 'axios'
import EventsTable from '../../../components/AdminComponents/EventsTable'
import CircularLoading from "../../../components/LoadingComponents/circularloading" 
import { Navigate, useNavigate } from 'react-router-dom'


function AdminNewsletter() {
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(48)
  const [newsletter, setNewsletter] = useState([])

  useEffect(() => {
    const dummy = {
      title: "Sample Title",
      image: "https://via.placeholder.com/150",
      date_posted: "2025-04-26",
      context: "This is a sample context description for the dummy data."
    };

    // Duplicate the dummy data 5 times
    const duplicatedData = Array(8).fill(dummy);
    
    setNewsletter(duplicatedData);
  }, []);

  return (
    <div className='h-screen w-full p-6 flex flex-col'>
      {/* Events header and new event button */}
      <div className='flex flex-row justify-between mb-10'>
        <h1 className='font-satoshi-bold text-5xl text-black'>Newsletter</h1>
        <button className='flex flex-row items-center justify-center gap-2 font-satoshi-regular text-white bg-primary px-6 py-3 rounded-2xl hover:bg-hover cursor-pointer' onClick={() => {}}> 
          <Plus/> New Newsletter
        </button>
      </div>
      <div className='flex flex-col w-full lg:w-auto lg:flex-row items-center lg:justify-between lg:ml-5 gap-2 lg:gap-0'>

        {/* Dito Search Bar implementation */}
        <div className='w-full lg:w-auto  min-w-xs'></div>
        <div className='items-center gap-2 text-md font-satoshi-regular hidden lg:flex'>
          <MoveLeft className='cursor-pointer' onClick={() => {}}/>
            <p> Page </p>
            <input
              type="text"
              value={page}
              onChange={() => {}}
              className="w-9 text-center border border-disabled rounded-md outline-none text-primary font-satoshi-bold"
            />
            <p>of {totalPages}</p>
            <MoveRight className='cursor-pointer' onClick={() => {}}/>
          </div>
        </div>
      </div>  
  )
}

export default AdminNewsletter