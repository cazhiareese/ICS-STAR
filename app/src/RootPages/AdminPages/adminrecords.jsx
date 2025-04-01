import React, { useState } from 'react'
import { BadgeCheck, Filter, List, LayoutGrid, MoveLeft, MoveRight } from 'lucide-react'

function AdminRecords() {

  const [userType, setUserType] = useState('Alumni')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(48)
  const [viewStyle, setViewStye] = useState('List')
  const [maxRows, setMaxRows] = useState(12)

  const users = [
    { name: "Kiefer Tayawa", batch: "2022", location: "Manila, PH", job: "Full-Stack Developer", lastUpdate: "1/4/10", status: "Inactive" },
    { name: "Alan Turing", batch: "2021", location: "Wilmslow, Cheshire", job: "Data Science", lastUpdate: "5/6/25", status: "" },
    { name: "Ada Lovelace", batch: "2022", location: "London, England", job: "Web Development", lastUpdate: "1/9/09", status: "" },
    { name: "Alan Turing", batch: "2021", location: "Wilmslow, Cheshire", job: "Data Science", lastUpdate: "1/2/34", status: "Inactive" },
    { name: "Ada Lovelace", batch: "2022", location: "London, England", job: "Web Development", lastUpdate: "1/24/34", status: "" },
    { name: "Ada Lovelace", batch: "2022", location: "London, England", job: "Web Development", lastUpdate: "1/24/34", status: "" },
    { name: "Ada Lovelace", batch: "2022", location: "London, England", job: "Web Development", lastUpdate: "1/24/34", status: "" },
    { name: "Ada Lovelace", batch: "2022", location: "London, England", job: "Web Development", lastUpdate: "1/24/34", status: "" },
    { name: "Ada Lovelace", batch: "2022", location: "London, England", job: "Web Development", lastUpdate: "1/24/34", status: "" },
    { name: "Ada Lovelace", batch: "2022", location: "London, England", job: "Web Development", lastUpdate: "1/24/34", status: "" },
    { name: "Ada Lovelace", batch: "2022", location: "London, England", job: "Web Development", lastUpdate: "1/24/34", status: "" },
    { name: "Ada Lovelace", batch: "2022", location: "London, England", job: "Web Development", lastUpdate: "1/24/34", status: "" },
  ];
  return (
    <div className='flex flex-col p-6 h-screen'>
      {/* Records, search, view pending */}
      <div className='flex justify-between mb-8'>
        {/* Records header */}
        <h1 className='text-primary font-satoshi-bold text-5xl '> Records </h1>
        {/* Search and view pending */}
        <div className='flex flex-row gap-5'>
          {/* Search */}
          <div className='border-2 border-primary w-xs h-full'></div>
          {/* View Pending Verifications */}
          <button className='bg-primary rounded-3xl px-5 py-1 flex items-center gap-2 text-sm'> 
            <BadgeCheck className='text-white'/>
            <p className='text-white'>View Pending Verifications </p>
          </button>
        </div>
      </div>
      {/* Alumni or student */}
      <div className='flex items-center justify-between ml-5'>
        <div>
          {/* Alumni button */}
          <button className={`px-12 py-3 cursor-pointer border-b-3  ${userType === 'Alumni' ? 'border-primary' : 'border-transparent'}`} onClick={() => setUserType('Alumni')}>
            <p className='text-black font-satoshi-medium text-md'> Alumni </p>
          </button>
          {/* Student button */}
          <button className={`px-12 py-3 cursor-pointer border-b-3 ${userType === 'Student' ? ' border-primary' : 'border-transparent'}`} onClick={() => setUserType('Student')}>
            <p className='text-black font-satoshi-medium text-md'> Student </p>
          </button>
        </div>
        {/* Sort by */}
        <div className='flex gap-2'>
          <button className='border border-disabled rounded-3xl px-5 py-2 cursor-pointer'>
            <p className='text-black font-satoshi-light text-sm'> Sort by <span className='font-satoshi-medium text-primary'>Name</span></p>
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
          <button className='flex items-center gap-2 cursor-pointer text-md font-satoshi-regular'>
            <MoveLeft/>
              <p> Page </p>
              <input
                type="text"
                value={page}
                onChange={() => {}}
                className="w-9 text-center border border-disabled rounded-md outline-none text-primary font-satoshi-bold"
              />
            <p>of {totalPages}</p>
            <MoveRight/>
          </button>
        </div>
      </div>
      {/* Table */}
      <div className='border border-gray-400 rounded-xl p-6 flex-1'>

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
            <tr key={index} className="hover:bg-gray-100 cursor-pointer" onClick={() => {}}>
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
    </div>
  )
}

export default AdminRecords
