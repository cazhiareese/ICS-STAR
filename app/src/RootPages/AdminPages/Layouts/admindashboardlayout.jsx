import React from 'react'
import { Outlet } from 'react-router-dom'

function AdminDashboardLayout() {
  return (
    <div>
      <Outlet />
    </div>
  )
}

export default AdminDashboardLayout
