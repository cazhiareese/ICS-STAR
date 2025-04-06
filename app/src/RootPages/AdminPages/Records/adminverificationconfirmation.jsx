import React from 'react'
import { MoveLeft, Check, IdCard, GraduationCap } from 'lucide-react'
import { Navigate, useNavigate } from 'react-router-dom'

function AdminVerificationConfirmation() {
  const navigate = useNavigate()

  function verifyUser() {
    alert('Confirmed verification!')
  }

  return (
    <div className='p-6'>
      <div className='flex gap-2 mb-3'>
        <button className="flex flex-row gap-4 items-center cursor-pointer" onClick={() => navigate(-1)}>
          <MoveLeft className='text-primary'/> 
          <p className='text-primary font-satoshi-medium text-lg'>Back</p>
        </button>
      </div>
      <div className='flex justify-between mt-2'>
        {/* Records header */}
        <div className="items-baseline gap-2 hidden lg:flex">
          <h1 className='text-primary font-satoshi-bold text-5xl '> Records </h1>
          <p className='font-satoshi-light text-lg text-gray-500'>/ Pending Verifications</p>
        </div>
        <button className='flex items-center bg-success text-white text-md font-satoshi-regular gap-2 rounded-3xl px-4 py-1 cursor-pointer' onClick={() => {verifyUser()}}>
          <Check className=''/>
          <p> Confirm Verification</p>
        </button>
      </div>
      {/* Information */}
      <div className='w-full p-6 mt-10'>
        {/* Basic information */}
        <div className='flex'>
          {/* Image placeholder */}
          <div className='bg-primary rounded-full h-30 w-30'></div>
            <div className='flex flex-col justify-between ml-6'>
              <div>
                <p className='font-satoshi-bold text-3xl'> Kiefer Tayawa </p>
                <p className='font-satoshi-light'> kltayawa@up.edu.ph</p>
              </div>
            {/* Student number and graduating class */}
            <div className='flex flex-row'>
              {/* Student number */}
              <div className='flex flex-col'>
                <div className='flex flex-row gap-2'>
                  <IdCard/> 
                  <p className='font-satoshi-regular'>Student Number</p>
                </div>
                <p className='ml-8 font-satoshi-bold'>1234-56789</p>
              </div>
              <div className='flex flex-col ml-20'>
                <div className='flex flex-row gap-2'>
                  <GraduationCap/> 
                  <p className='font-satoshi-regular'>Graduating Class</p>
                </div>
                <p className='ml-8 font-satoshi-bold'>2022 - 1st Semester</p>
              </div>
            </div>
          </div>
        </div>
        {/* Verification File */}
        <div className='mt-10'>
          <h2 className='font-satoshi-bold text-xl'>VERIFICATION FILE</h2>
          <div className='border border-disabled'></div>
        </div>
      </div>
    </div>
  )
}

export default AdminVerificationConfirmation
