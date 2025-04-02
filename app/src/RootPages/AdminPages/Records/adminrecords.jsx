import React, { useState } from 'react'
import { BadgeCheck, Filter, List, LayoutGrid, MoveLeft, MoveRight, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function AdminRecords() {
  const navigate = useNavigate()

  const [userType, setUserType] = useState('Alumni')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(48)
  const [viewStyle, setViewStye] = useState('List')
  const [maxRows, setMaxRows] = useState(12)

  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)

  const users = [
    { id: "1", name: "Kiefer Tayawa", batch: "2022", location: "Manila, PH", job: "Full-Stack Developer", lastUpdate: "1/4/10", status: "Inactive" },
    { id: "2", name: "Alan Turing", batch: "2021", location: "Wilmslow, Cheshire", job: "Data Science", lastUpdate: "5/6/25", status: "" },
    { id: "3", name: "Ada Lovelace", batch: "2022", location: "London, England", job: "Web Development", lastUpdate: "1/9/09", status: "" },
    { id: "4", name: "Alan Turing", batch: "2021", location: "Wilmslow, Cheshire", job: "Data Science", lastUpdate: "1/2/34", status: "Inactive" },
    { id: "5", name: "Ada Lovelace", batch: "2022", location: "London, England", job: "Web Development", lastUpdate: "1/24/34", status: "" },
    { id: "6", name: "Ada Lovelace", batch: "2022", location: "London, England", job: "Web Development", lastUpdate: "1/24/34", status: "" },
    { id: "7", name: "Ada Lovelace", batch: "2022", location: "London, England", job: "Web Development", lastUpdate: "1/24/34", status: "" },
    { id: "8", name: "Ada Lovelace", batch: "2022", location: "London, England", job: "Web Development", lastUpdate: "1/24/34", status: "" },
    { id: "9", name: "Ada Lovelace", batch: "2022", location: "London, England", job: "Web Development", lastUpdate: "1/24/34", status: "" },
    { id: "10", name: "Ada Lovelace", batch: "2022", location: "London, England", job: "Web Development", lastUpdate: "1/24/34", status: "" },
    { id: "11", name: "Ada Lovelace", batch: "2022", location: "London, England", job: "Web Development", lastUpdate: "1/24/34", status: "" },
    { id: "12", name: "Ada Lovelace", batch: "2022", location: "London, England", job: "Web Development", lastUpdate: "1/24/34", status: "" }
  ];
  
  return (
    <div className='flex flex-col lg:p-6 h-screen'>
      {/* Records, search, view pending */}
      <div className='justify-between mt-2 lg:mb-8 flex relative'>
        {/* Records header */}
        <h1 className='text-primary font-satoshi-bold text-5xl hidden lg:block'> Records </h1>
        {/* Search and view pending */}
        <div className='flex flex-row gap-5 lg:w-auto w-full px-3 lg:px-0'>
          {/* Search */}
          <div className='relative flex items-center justify-end flex-1'>
            <input
              type="text"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className={`w-full lg:w-xs px-4 py-2 border rounded-3xl focus:outline-none ${focused ? 'border-primary border-2': 'border-gray-400'}`}
            />
            <Search className={`absolute mr-2 ${focused ? 'text-primary' : 'text-gray-400'}`} size={20} />
          </div>
          {/* View Pending Verifications */}
          <button className='bg-primary h-11 w-11 lg:h-auto lg:w-auto rounded-full lg:rounded-3xl lg:px-5 lg:py-1 flex items-center justify-center gap-2 text-sm cursor-pointer' onClick={() => {navigate('/admin/records/pending-verifications')}}> 
            <BadgeCheck className='text-white'/>
            <p className='text-white lg:block hidden'>View Pending Verifications </p>
          </button>
        </div>
      </div>
      {/* Alumni or student */}
      <div className='flex flex-col w-full lg:w-auto lg:flex-row items-center lg:justify-between lg:ml-5 gap-2 lg:gap-0'>
        <div className='w-full lg:w-auto  min-w-xs'>
          {/* Alumni button */}
          <button className={`px-12 py-3 cursor-pointer border-b-3 w-1/2 lg:w-auto ${userType === 'Alumni' ? 'border-primary' : 'border-transparent'}`} onClick={() => setUserType('Alumni')}>
            <p className='text-black font-satoshi-medium text-md'> Alumni </p>
          </button>
          {/* Student button */}
          <button className={`px-12 py-3 cursor-pointer border-b-3 w-1/2 lg:w-auto ${userType === 'Student' ? ' border-primary' : 'border-transparent'}`} onClick={() => setUserType('Student')}>
            <p className='text-black font-satoshi-medium text-md'> Student </p>
          </button>
        </div>
        {/* Sort by */}
        <div className='flex gap-2'>
          <button className='border border-disabled rounded-3xl px-5 py-2 cursor-pointer flex items-center gap-1'>
            <p className='text-black font-satoshi-light text-sm hidden lg:block'> Sort by </p>
              <p className='font-satoshi-medium text-primary block'>Name</p>
          </button>
          {/* Filter */}
          <button className='border border-disabled rounded-3xl px-5 py-2 flex gap-2 items-center cursor-pointer'>
            <Filter className='text-primary'/>
            <p className='text-primary fsont-satoshi-medium text-sm'> Filter</p>
          </button>
          {/* View changer */}
          <div className="flex items-center border border-disabled rounded-3xl overflow-hidden">
            {/* List View Button */}
            <button className="px-5 py-2 flex gap-2 cursor-pointer text-primary" onClick={() => {setViewStye('List')}}>
              <List className={`${viewStyle === 'List' ? 'text-primary' : 'text-disabled'}`} />
            </button>
            <div className="h-6 w-px bg-disabled"></div>
            {/* Grid View Button */}
            <button className="px-5 py-2 flex gap-2 cursor-pointer text-disabled" onClick={() => {setViewStye('Grid')}}>
              <LayoutGrid className={`${viewStyle === 'Grid' ? 'text-primary' : 'text-disabled'}`} />
            </button>
          </div>
          {/* Page */}
          <div className='items-center gap-2 text-md font-satoshi-regular hidden lg:flex'>
            <MoveLeft className='cursor-pointer' onClick={() => {}}/>
              <p> Page </p>
              <input
                type="text"
                value={page}
                onChange={() => {}}
                className="w-9 text-center border border-disabled rounded-md outline-none text-primary font-satoshi-bold"
              />
            <p>of {totalPages}</p>
            <MoveRight className='cursor-pointer' onClick={() => {}}/>
          </div>
        </div>
      </div>
      {/* Table for desktop*/}
      <div className='border border-gray-400 rounded-xl p-6 flex-1 hidden lg:block'>
        <table className="w-full">
          {/* Table Header */}
          <thead>
            <tr className="text-left text-xs text-primary font-satoshi-regular">
              <th className="py-2 px-4"></th>
              <th className="py-2 px-4">NAME</th>
              <th className="py-2 px-4">BATCH</th>
              <th className="py-2 px-4">BASE LOCATION</th>
              <th className="py-2 px-4">JOB TITLE</th>
              <th className="py-2 px-4">LAST UPDATE</th>
              <th className="py-2 px-4"></th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className='font-satoshi-regular text-md'>
            {users.map((user, index) => (
              <tr 
                key={index} 
                className="hover:bg-gray-100 cursor-pointer" 
                onClick={() => {navigate(`/admin/records/${user.id}`)}}
              >
                {/* Name Column */}
                <td>
                  {/* <div className="w-8 h-8 bg-gray-300 rounded-full"></div> */}
                </td>
                {/* User Name */}
                <td className="py-3 px-4 flex items-center gap-2 font-satoshi-bold"> {user.name} </td>
                {/* User Batch*/}
                <td className="py-3 px-4">{user.batch}</td>
                {/* User Location */}
                <td className="py-3 px-4">{user.location}</td>
                {/* User Job */}
                <td className="py-3 px-4">{user.job}</td>
                {/* User last update */}
                <td className="py-3 px-4">{user.lastUpdate}</td>
                {/* User Status */}
                <td>
                  {user.status && (
                    <span className="bg-gray-200 px-4 py-1 rounded-2xl text-black font-satoshi-bold text-sm">
                      {user.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Table for mobile */}
      <div className='flex flex-col lg:hidden'>
        {/* User Card */}
        {users.map((user) => (
          <div key={user.id} 
          className='flex w-full p-3 hover:bg-gray-100 cursor-pointer'
          onClick={() => {navigate(`/admin/records/${user.id}`)}}>
            {/* Image placeholder */}
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            <div className='flex flex-col ml-6'>
              <h2 className='font-satoshi-bold text-md'> {user.name} </h2>
              <p className='font-satoshi-light text-sm'> {user.batch} </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminRecords
