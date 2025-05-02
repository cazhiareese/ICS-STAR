import React from 'react'
import { Outlet } from 'react-router-dom'

function AdminNewsletterLayout() {
  return (
    <div className="bg-gray-100">
        <Outlet/>
    </div>
  )
}

export default AdminNewsletterLayout
