import React from 'react'
import { Plus, HandCoins } from 'lucide-react'

function AdminDonations() {
  return (
    <div className='h-screen p-6'>
      {/* Header and add donation button */}
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-primary text-5xl font-satoshi-bold'>Donations</h1>
        <button className='flex bg-primary font-satoshi-regular px-6 py-3 text-white rounded-2xl gap-2'> 
          <Plus/>
          <p> New Donation</p>
        </button>
      </div>
      {/* Basic stats */}
      <div className='border border-gray-300 rounded-xl flex py-4'>
        {/* Help ICS */}
        <div className='flex flex-row text-2xl items-center justify-center flex-1'> 
          <HandCoins/>
          <h2 className='font-satoshi-medium'>Help ICS</h2>
        </div>
        {/* Divider */}
        <div className='border-l border-gray-300 '></div>
        {/* Monetary Donations and In-kind donations */}
        <div className='flex flex-1'>
          {/* Monetary Donations */}
          <div className='flex flex-col items-center justify-center flex-1'>
            <h3 className='font-satoshi-bold text-2xl text-primary'> P123,456</h3>
            <p className='font-satoshi-light '>Monetary Donations</p>
          </div>
          {/* In-kind Donations */}
          <div className='flex flex-col items-center justify-center flex-1'>
            <h3 className='font-satoshi-bold text-2xl text-primary'> 12 </h3>
            <p className='font-satoshi-light '>In-kind Donations</p>
          </div>
        </div>
        {/* Divider */}
        <div className='border-l border-gray-300 '></div>
        <div className='flex flex-col items-center justify-center flex-1'>
          <h3 className='font-satoshi-bold text-2xl text-primary'> 10 </h3>
          <p className='font-satoshi-medium '>Unverified Donations</p>
        </div>
      </div>
    </div>
  )
}

export default AdminDonations
