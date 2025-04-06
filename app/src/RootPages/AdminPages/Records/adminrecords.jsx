import React, { useState, useEffect } from 'react'
import { BadgeCheck, Filter, List, LayoutGrid, MoveLeft, MoveRight, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import CircularLoading from '../../../components/LoadingComponents/circularloading';
import UsersTable from '../../../components/AdminComponents/userstable';

function AdminRecords() {
  const navigate = useNavigate()

  const [userType, setUserType] = useState('alumni')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(48)
  const [viewStyle, setViewStye] = useState('List')
  const [maxRows, setMaxRows] = useState(12)
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false)

  // For the search
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/admin/verified-${userType}`);
        console.log(response.data);
        setUsers(response.data);
      } catch (error) {
        console.log('Error getting users');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [userType]);
  
  // Initial fetch
  useEffect(() => {
    // fetchUsers('alum');
    setUserType('alumni')
  }, []);
  
  return (
    loading ? (
      <div className='flex justify-center items-center h-screen'>
        <CircularLoading size={90} />
      </div>
    ) : 
      <div className='flex flex-col lg:p-6 h-screen overflow-hidden max-w-7xl mx-auto'>
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
            <button className={`px-12 py-3 cursor-pointer border-b-3 w-1/2 lg:w-auto ${userType === 'alumni' ? 'border-primary' : 'border-transparent'}`} onClick={() => setUserType('alumni')}>
              <p className='text-black font-satoshi-medium text-md'> Alumni </p>
            </button>
            {/* Student button */}
            <button className={`px-12 py-3 cursor-pointer border-b-3 w-1/2 lg:w-auto ${userType === 'students' ? ' border-primary' : 'border-transparent'}`} onClick={() => setUserType('students')}>
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
        <div className='border border-gray-400 rounded-xl p-6 flex-1 hidden lg:block overflow-auto'>
          <UsersTable data={users}/>
        </div>
      {/* Table for mobile */}
      <div className='flex flex-col lg:hidden overflow-auto'>
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
