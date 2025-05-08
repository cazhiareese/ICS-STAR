import React from 'react'
import { Outlet } from 'react-router-dom'

function AdminDonationsLayout() {
  return (
    <div className="bg-gray-100 max-w-7xl flex-items-center justify-center mx-auto">
      <Outlet />
    </div>
  )
}

export default AdminDonationsLayout
