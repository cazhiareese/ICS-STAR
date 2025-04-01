import React from 'react'
import { MoveLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

function AdminUserInformationReport() {
  const navigate = useNavigate();

  const cardDesign = "bg-white drop-shadow-sm rounded-2xl p-4 w-full";

  return (
    <div className='bg-[rgb(243,241,244)] p-6 h-screen flex flex-col '>
      <div className='flex gap-2 mb-8'>
        <button className="flex flex-row gap-4 items-center cursor-pointer" onClick={() => navigate(-1)}>
            <MoveLeft className='text-primary'/> 
            <p className='text-primary font-satoshi-medium text-lg'>Back</p>
        </button>
      </div>
      <div className={`grid grid-cols-2 grid-rows-3 gap-8 flex-1`}>
        {/* Site Visits */}
        <div className={`${cardDesign} row-start-1 col-span-2`}> </div>
        {/* Most Viewed Newsletter */}
        <div className={`${cardDesign} row-start-2 col-start-1`}> </div>
        {/* Job Offer Highlights */}
        <div className={`${cardDesign} row-start-2 col-start-2`}> </div>
        {/* Donation Highlights */}
        <div className={`${cardDesign} row-start-3 col-span-2`}> </div>
      </div>
    </div>
  )
}

export default AdminUserInformationReport
