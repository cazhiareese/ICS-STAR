import React from 'react'
import {ArrowLeft} from'lucide-react'
import DonationType from '../../../components/AlumniComponents/DonationComponents/donationtype';

function Donationform() {
  return (
    <div className='flex flex-row mx-48 my-16'>
        {/* Make a Donation Part */}
        <div className='flex flex-col'>
            {/* Back button */}
            <button className='text-primary flex gap-5'>
                <ArrowLeft size={30}/>
                <span className='font-satoshi-medium text-primary text-2xl'>Back</span>
            </button>

            {/* Make a donation title */}
            <h1 className='font-satoshi-bold text-black text-5xl pt-10'>Make a donation</h1>

            {/* Donation Type Picker */}
            <h1 className='font-satoshi-bold text-black text-xl pt-10 pb-10'>Donation Type</h1>
            {/* Buttons for Donation Types */}
            {/* Monetary Donation */}
            <div className='flex flex-row gap-5'>
                <DonationType donationType={"monetary"}/>
                <DonationType donationType={"inKind"}/>
            </div>
            
        </div>
    </div>
  )
}

export default Donationform;