import React, {useEffect, useState} from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { MoveLeft, X } from 'lucide-react'
import ExpandedPendingDonations from '../../../components/AdminComponents/expandedpendingdonations'

function AdminPendingDonations() {
  const navigate = useNavigate()
  const location = useLocation()
  const {driveid} = useParams()
  const { pendingDonations, driveName } = location.state
  const [reviewDetailsModal, setReviewDetailsModal] = useState(false)
  const [selectedDonation, setSelectedDonation] = useState(null)

  useEffect(() => {
    console.log(pendingDonations)
  })
  
  return (
    <div className='flex flex-col lg:p-6 h-screen overflow-hidden max-w-7xl mx-auto'>
      <button className="flex gap-2 mb-3 flex-row items-center cursor-pointer" onClick={() => navigate(-1)}>
        <MoveLeft className='text-primary'/> 
        <p className='text-primary font-satoshi-medium text-lg'>Back to Donations List</p>
      </button>
      <h1 className='text-primary text-5xl font-satoshi-bold'>{driveName}</h1>
      <h2 className='text-black text-3xl font-satoshi-medium mb-10'>Pending Verifications</h2>
      <div className='border border-gray-300 rounded-2xl h-full overflow-auto'>
      <ExpandedPendingDonations 
        data={pendingDonations} 
        onReview={(donation) => {
          setSelectedDonation(donation)
          setReviewDetailsModal(true)
        }}
      />
      </div>
      {/* Review Details Modal */}
      {reviewDetailsModal && selectedDonation && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
        <div className="flex flex-col items-center bg-white p-6 rounded-3xl shadow-lg min-w-md max-w-lg h-4/5">
          {/* Header */}
          <div className="flex justify-between w-full items-center pb-2">
            <h2 className="text-2xl font-satoshi-medium text-primary">Review Donation</h2>
            <button className='rounded-full h-fit bg-error p-1 cursor-pointer' onClick={() => {setReviewDetailsModal(false)}}>
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Proof of Payment (placeholder bg for now) */}
          <div className='bg-primary h-1/3 w-full rounded-xl flex justify-center items-center text-white'>
            {selectedDonation.proof_of_payment}
          </div>
           {/* Donation information */}
          <div className='w-full h-full flex flex-col flex-1 px-10 text-xl items-center justify-center'>
            {/* Donor */}
            <div className='flex justify-between w-full'>
              <p className='font-satoshi-light'>Donor: </p>
              <p className='font-satoshi-medium'>{selectedDonation.name}</p>
            </div>
            {/* Donation Type */}
            <div className='flex justify-between w-full'>
              <p className='font-satoshi-light'>Donation Type: </p>
              <p className='font-satoshi-medium'>{selectedDonation.donation_type}</p>
            </div>
            {/* Donation Amount */}
            <div className='flex justify-between w-full'>
              <p className='font-satoshi-light'>Donation Description: </p>
              <p className='font-satoshi-medium'>{selectedDonation.donation_details}</p>
            </div>
            {/* Date Donated */}
            <div className='flex justify-between w-full'>
              <p className='font-satoshi-light'>Date Donated: </p>
              <p className='font-satoshi-medium'>{selectedDonation.date_donated}</p>
            </div>
            {/* Time Donated */}
            <div className='flex justify-between w-full'>
              <p className='font-satoshi-light'>Time Donated: </p>
              <p className='font-satoshi-medium'>{selectedDonation.time_donated}</p>
            </div>
          </div>
          {/* Buttons */}
          <div className='flex flex-row w-full gap-2 text-white font-satoshi-regular'>
            {/* TODO: Disapprove donation */}
            <button className='bg-error rounded-3xl w-1/2 py-3 cursor-pointer hover:bg-red-400'><p>Disapprove</p></button>
            {/* TODO: Approve donation */}
            <button className='bg-primary rounded-3xl w-1/2 py-3 cursor-pointer hover:bg-hover'><p>Approve</p></button>
          </div>
        </div>
      </div>
    )}
    </div> 
  )
}

export default AdminPendingDonations
