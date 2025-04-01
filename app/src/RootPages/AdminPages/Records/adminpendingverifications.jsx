import {React, useState} from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Search, MoveLeft } from 'lucide-react'

function AdminPendingVerifications() {
    const navigate = useNavigate()

    const [userType, setUserType] = useState('Alumni')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(48)
    const [viewStyle, setViewStye] = useState('List')
    const [maxRows, setMaxRows] = useState(12)

    const [query, setQuery] = useState('')
    const [focused, setFocused] = useState(false)

    const pendingUsers = [
        {
          name: "Kiefer Tzyawa",
          email: "a@gmail.com",
          student_number: "1234-56789",
          graduating_class: "2022 - 1st Semester",
          registration_date: "12/25",
          avatar: "https://randomuser.me/api/portraits/men/1.jpg"
        },
        {
          name: "Alan Turing",
          email: "a@gmail.com",
          student_number: "1234-56789",
          graduating_class: "2022 - 1st Semester",
          registration_date: "12/25",
          avatar: "https://randomuser.me/api/portraits/men/2.jpg"
        },
        {
          name: "Ada Lovelace",
          email: "a@gmail.com",
          student_number: "1234-56789",
          graduating_class: "2022 - 1st Semester",
          registration_date: "12/25",
          avatar: "https://randomuser.me/api/portraits/women/1.jpg"
        }
      ];

  return (
    <div className='flex flex-col p-6 h-screen'>
        <div className='flex gap-2 mb-3'>
            <button className="flex flex-row gap-4 items-center cursor-pointer" onClick={() => navigate(-1)}>
                <MoveLeft className='text-primary'/> 
                <p className='text-primary font-satoshi-medium text-lg'>Back</p>
            </button>
        </div>
        <div className='flex justify-between mb-8'>
        {/* Records header */}
            <div className="flex items-baseline gap-2">
                <h1 className='text-primary font-satoshi-bold text-5xl '> Records </h1>
                <p className='font-satoshi-light text-lg text-gray-500'>/ Pending Verifications</p>
            </div>
            <div className='relative flex items-center justify-end'>
                <input
                    type="text"
                    placeholder="Search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    className={`w-xs px-4 py-2 border rounded-3xl focus:outline-none ${focused ? 'border-primary border-2': 'border-gray-400'}`}
                />
                <Search className={`absolute mr-2 ${focused ? 'text-primary' : 'text-gray-400'}`} size={20} />
            </div>

        </div>
      {/* Table */}

    </div>
  )
}

export default AdminPendingVerifications
