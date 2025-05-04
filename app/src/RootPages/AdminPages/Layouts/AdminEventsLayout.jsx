import React from 'react'
import { Outlet } from 'react-router-dom'

function AdminEventsLayout() {
  return (
    <div className="bg-gray-100">
        <Outlet/>
    </div>
  )
}

export default AdminEventsLayout
