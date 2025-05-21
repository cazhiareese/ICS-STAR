import React from 'react'
import { Outlet } from 'react-router-dom'

function AdminCareerLayout() {
  return (
    <div className="bg-gray-100 max-w-7xl flex-items-center justify-center mx-auto">
      <Outlet />
    </div>
  )
}

export default AdminCareerLayout
