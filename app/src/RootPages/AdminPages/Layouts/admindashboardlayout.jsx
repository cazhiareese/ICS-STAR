import React from 'react'
import { Outlet } from 'react-router-dom'

function AdminDashboardLayout() {
  return (
    <div className="bg-gray-100">
      <Outlet />
    </div>
  )
}

export default AdminDashboardLayout
