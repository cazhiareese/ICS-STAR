import React, { useState, useEffect } from 'react'
import { BadgeCheck, Filter, List, LayoutGrid, MoveLeft, MoveRight, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import CircularLoading from '../../../components/LoadingComponents/circularloading';

function AdminRecords() {
  const navigate = useNavigate()

  const [userType, setUserType] = useState('alum')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(48)
  const [viewStyle, setViewStye] = useState('List')
  const [maxRows, setMaxRows] = useState(12)
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false)
  const [userLoading, setUserLoading] = useState(false)
  const [openFilter, setOpenFilter] = useState(false)

  // For the search
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const [sortOptions, setSortOptions] = useState([
    { label: "Name", value: "name", selected: false, order: "asc" },
    { label: "Batch", value: "batch", selected: false, order: "asc" },
    { label: "Base Location", value: "city", selected: false, order: "asc" },
    { label: "Job Title", value: "job_title", selected: false, order: "asc" },
    { label: "Last Update", value: "last_update", selected: false, order: "asc" },
  ]);
  
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/admin/filter/${userType}`);
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
    setUserType('alum')
  }, []);

  const applySort = async () => {
    const selected = sortOptions
    .filter(opt => opt.selected)
    .map(opt => `order_by=${opt.value}_${opt.order}`)
    .join("&");
    console.log(selected)
    
    setUserLoading(true);
    setOpenFilter(false);
      try {
        const response = await axios.get(`${API_BASE_URL}/admin/filter/${userType}?${selected}`);
        console.log(response.data);
        setUsers(response.data);
      } catch (error) {
        console.log(error);
        setUsers([]);
      } finally {
        setUserLoading(false);
      }
    
  };
  
  
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
            <button className={`px-12 py-3 cursor-pointer border-b-3 w-1/2 lg:w-auto ${userType === 'alum' ? 'border-primary' : 'border-transparent'}`} onClick={() => setUserType('alum')}>
              <p className='text-black font-satoshi-medium text-md'> Alumni </p>
            </button>
            {/* Student button */}
            <button className={`px-12 py-3 cursor-pointer border-b-3 w-1/2 lg:w-auto ${userType === 'students' ? ' border-primary' : 'border-transparent'}`} onClick={() => setUserType('students')}>
              <p className='text-black font-satoshi-medium text-md'> Student </p>
            </button>
          </div>
          {/* Sort by */}
          <div className='flex gap-2'>
            <div className='relative inline-block'>
              <button className='border border-disabled rounded-3xl px-5 py-2 cursor-pointer flex items-center gap-1' onClick={() => {setOpenFilter(!openFilter)}}>
                <p className='text-black font-satoshi-light text-sm hidden lg:block'> Sort by </p>
                <p className='font-satoshi-medium text-primary block'>Name</p>
              </button>
{/* SORTING */}
              <div className={`absolute mt-2 bg-white rounded-lg shadow-lg p-4 w-64 z-10 ${openFilter ? '' : 'hidden'}`}>
                <h4 className="font-semibold mb-2">Sort by:</h4>
                {sortOptions.map((option, idx) => (
                  <div key={option.value} className="flex justify-between items-center mb-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={option.selected}
                        onChange={() => {
                          const newOptions = [...sortOptions];
                          newOptions[idx].selected = !newOptions[idx].selected;
                          setSortOptions(newOptions);
                        }}
                        className="appearance-none w-4 h-4 mr-2 border-2 border-gray-400 rounded-full checked:bg-primary checked:border-primary focus:outline-none relative transition-all cursor-pointer"
                      />
                      {option.label}
                    </label>
                    {option.selected && (
                      <button
                        onClick={() => {
                          const newOptions = [...sortOptions];
                          newOptions[idx].order = newOptions[idx].order === "asc" ? "desc" : "asc";
                          setSortOptions(newOptions);
                        }}
                        className="text-sm text-blue-600 underline"
                      >
                        {option.order === "asc" ? "Asc" : "Desc"}
                      </button>
                    )}
                  </div>
                ))}
                <button
                  className="mt-4 bg-primary text-white px-3 py-1 rounded cursor-pointer w-full"
                  onClick={applySort}
                >
                  Apply
                </button>
              </div>
            </div>
{/* SORTING */}
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
          {userLoading ? (
            <div className='flex justify-center items-center w-full h-full'>
              <CircularLoading/>
            </div>
          ) :(
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
                    <td className="py-3 px-4">{user.location_base}</td>
                    {/* User Job */}
                    <td className="py-3 px-4">{user.job_title}</td>
                    {/* User last update */}
                    <td className="py-3 px-4">{user.last_updated}</td>
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
          )}
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
