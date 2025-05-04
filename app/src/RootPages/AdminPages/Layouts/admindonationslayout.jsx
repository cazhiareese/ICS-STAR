import React from 'react'
import { Outlet } from 'react-router-dom'

function AdminDonationsLayout() {
  return (
    <div className="bg-gray-100">
      <Outlet />
    </div>
  )
}

export default AdminDonationsLayout
