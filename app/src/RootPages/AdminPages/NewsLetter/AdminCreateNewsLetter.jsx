import React from 'react'
import { MoveLeft } from 'lucide-react'

function AdminCreateNewsletter() {
  return (
    <div className='p-6'>
        {/* Back */}
      <button className="flex gap-2 mb-3 flex-row items-center cursor-pointer" onClick={() => navigate(-1)}>
        <MoveLeft className='text-primary'/> 
        <p className='text-primary font-satoshi-medium text-lg'>Back</p>
      </button>
      {/* Create an Event */}
      <h1 className='font-satoshi-bold text-5xl mb-6'>Create a Newsletter</h1>
    </div>
  )
}

export default AdminCreateNewsletter