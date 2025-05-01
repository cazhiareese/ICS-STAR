import React from 'react'
import { MoveLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function AdminBack({label='Back'}) {
    const navigate = useNavigate()
  return (
    <button className="flex gap-2 mb-3 flex-row items-center cursor-pointer text-primary hover:text-hover" onClick={() => navigate(-1)}>
        <MoveLeft className=''/> 
        <p className=' font-satoshi-medium text-lg'>{label}</p>
    </button>
  )
}

export default AdminBack
