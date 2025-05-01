import React from 'react'
import { Outlet } from 'react-router-dom'

function AdminCareerLayout() {
  return (
    <div className="bg-gray-100">
      <Outlet />
    </div>
  )
}

export default AdminCareerLayout
