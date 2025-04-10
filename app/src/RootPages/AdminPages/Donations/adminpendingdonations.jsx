import React from 'react'
import { useParams } from 'react-router-dom'

function AdminPendingDonations() {
  const {driveid} = useParams()

  return (
    <div className='flex flex-col lg:p-6 h-screen overflow-hidden max-w-7xl mx-auto'>
      PendingDonations
      {driveid}
    </div>
  )
}

export default AdminPendingDonations
