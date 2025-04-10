import React, {useState} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MoveLeft, X } from 'lucide-react'
import ExpandedPendingDonations from '../../../components/AdminComponents/expandedpendingdonations'

function AdminPendingDonations() {
  const navigate = useNavigate()
  const {driveid} = useParams()
  const [pendingDonations, setPendingDonations] = useState([
    {
      date_donated: "2025-04-21",
      time_donated: "16:30:00",
      donor: "John Doe",
      donation_type: "In-kind",
      donation_description: "Solar Panel",
      proof_of_payment: "proof_john_doe.png"
    },
    {
      date_donated: "2025-04-09",
      time_donated: "11:41:00",
      donor: "Juan Dela Cruz",
      donation_type: "Monetary",
      donation_amount: "₱5,000",
      proof_of_payment: "proof_juan_dela_cruz.png"
    }
  ]);
  const [reviewDetailsModal, setReviewDetailsModal] = useState(false)
  const [selectedDonation, setSelectedDonation] = useState(null)
  
  return (
    <div className='flex flex-col lg:p-6 h-screen overflow-hidden max-w-7xl mx-auto'>
      <button className="flex gap-2 mb-3 flex-row items-center cursor-pointer" onClick={() => navigate(-1)}>
        <MoveLeft className='text-primary'/> 
        <p className='text-primary font-satoshi-medium text-lg'>Back to Donations List</p>
      </button>
      <h1 className='text-primary text-5xl font-satoshi-bold'>New ICS Aircon</h1>
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
            <h2 className="text-2xl font-satoshi-medium">Donation Details</h2>
            <button className='rounded-full h-fit bg-error p-1 cursor-pointer' onClick={() => {setReviewDetailsModal(false)}}>
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Proof of Payment (placeholder bg for now) */}
          <div className='bg-primary h-1/3 w-full rounded-xl flex justify-center items-center text-white'>
            {selectedDonation.proof_of_payment}
          </div> 

          <div className='mb-5 flex flex-col w-full'>
            <h1 className='font-satoshi-bold text-2xl'>{selectedDonation.donor}</h1>
            <p className='font-satoshi-light'>
              Date: {selectedDonation.date_donated} <br />
              Time: {selectedDonation.time_donated}
            </p>
          </div>

          <div className='flex flex-col w-full flex-1'>
            <h2 className='font-satoshi-light text-sm'>Donation Type</h2>
            <p className='font-satoshi-regular text-sm'>{selectedDonation.donation_type}</p>
            <h2 className='font-satoshi-light text-sm mt-2'>Details</h2>
            <p className='font-satoshi-regular text-sm'>
              {selectedDonation.donation_type === "Monetary"
                ? selectedDonation.donation_amount
                : selectedDonation.donation_description}
            </p>
          </div>
          {/* Buttons */}
          <div className='flex flex-row w-full gap-2 text-white font-satoshi-regular'>
            <button className='bg-error rounded-3xl w-1/2 py-3'><p>Disapprove</p></button>
            <button className='bg-primary rounded-3xl w-1/2 py-3'><p>Approve</p></button>
          </div>
        </div>
      </div>
    )}
    </div> 
  )
}

export default AdminPendingDonations
