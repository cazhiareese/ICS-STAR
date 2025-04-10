import React, {useState} from 'react'
import { useParams } from 'react-router-dom'
import { MoveLeft } from 'lucide-react'
import ExpandedPendingDonations from '../../../components/AdminComponents/expandedpendingdonations'

function AdminPendingDonations() {
  const {driveid} = useParams()
  const [pendingDonations, setPendingDonations] = useState([
    {
      "date_time_donated": "2025-04-21T16:30:00",
      "donor": "John Doe",
      "donation_type": "In-kind",
      "donation_amount": "Solar Panel"
    },
    {
      "date_donated": "2025-04-09T11:41:00",
      "name": "Juan Dela Cruz",
      "donation_type": "Monetary",
      "donation_amount": "₱5,000"
    }
  ])

  return (
    <div className='flex flex-col lg:p-6 h-screen overflow-hidden max-w-7xl mx-auto'>
      <button className="flex gap-2 mb-3 flex-row items-center cursor-pointer" onClick={() => navigate(-1)}>
        <MoveLeft className='text-primary'/> 
        <p className='text-primary font-satoshi-medium text-lg'>Back to Donations List</p>
      </button>
      <h1 className='text-primary text-5xl font-satoshi-bold'>New ICS Aircon</h1>
      <h2 className='text-black text-3xl font-satoshi-medium'>Pending Verifications</h2>
      <div className='border border-gray-300 rounded-2xl h-full overflow-auto'>
        <ExpandedPendingDonations data={pendingDonations}/>
      </div>
    </div> 
  )
}

export default AdminPendingDonations
