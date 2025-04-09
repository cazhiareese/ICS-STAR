import {React, useState, useEffect} from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Search, MoveLeft, MoveRight, Filter, List, LayoutGrid } from 'lucide-react'
import axios from 'axios'
import CircularLoading from '../../../components/LoadingComponents/circularloading';

function AdminPendingVerifications() {
    const navigate = useNavigate()

    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(48)
    const [viewStyle, setViewStye] = useState('List')
    const [maxRows, setMaxRows] = useState(12)
    const [loading, setLoading] = useState(false)

    const [query, setQuery] = useState('')
    const [focused, setFocused] = useState(false)

    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
    const [userType, setUserType] = useState('alum')
    const [pendingUsers, setPendingUsers] = useState([])
    const [studentUserCount, setStudentUserCount] = useState(0)
    const [alumniUserCount, setAlumniUserCount] = useState(0)

    const fetchUnverifiedUsers = async (type) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/admin/filter/unverified/${type}`);
        console.log(response.data);
        setPendingUsers(response.data);
      } catch (error) {
        console.log('Error getting users');
        setPendingUsers([]);
      }
    };
    

    const fetchUsersCount = async () => {
      // Fetch unverified alumni count
      await axios.get(`${API_BASE_URL}/admin/unverified/alumni/count`)
      .then(response => {
        console.log(response.data);
        setAlumniUserCount(response.data.unverified_alumni_count);
      })
      .catch(error => {
        console.log(error)
      })

      // Fetch unverified students count
      await axios.get(`${API_BASE_URL}/admin/unverified/students/count`)
      .then(response => {
        console.log(response.data);
        setStudentUserCount(response.data.unverified_students_count);
      })
      .catch(error => {
        console.log(error)
      })
    };
    
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true)
        try {
          await Promise.all([
            fetchUnverifiedUsers(userType),
            fetchUsersCount()
          ])
        } catch (error) {
          console.log(error)
        } finally {
          setLoading(false)
        }
      }
    
      fetchData()
    }, [userType])
    
    // Initial fetch
    useEffect(() => {
      setUserType('alum') // this will automatically trigger the above effect
    }, [])


  return (
    loading ? (
      <div className="flex justify-center items-center h-screen">
        <CircularLoading size={90}/>
      </div>
    ) : 
    <div className='flex flex-col lg:p-6 h-screen max-w-7xl mx-auto'>
      <div className='flex gap-2 mb-3'>
      <button className="flex flex-row gap-4 items-center cursor-pointer" onClick={() => navigate(-1)}>
          <MoveLeft className='text-primary'/> 
          <p className='text-primary font-satoshi-medium text-lg'>Back</p>
        </button>
      </div>
      {/* Records header */}
      <div className='justify-between mt-2 lg:mb-8 flex relative'>
        {/* Records header */}
        <div className="items-baseline gap-2 hidden lg:flex">
          <h1 className='text-primary font-satoshi-bold text-5xl '> Records </h1>
          <p className='font-satoshi-light text-lg text-gray-500'>/ Pending Verifications</p>
        </div>
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
        </div>
      </div>

      {/* Alumni or student */}
      <div className='flex items-center justify-between lg:ml-5 lg:flex-row flex-col gap-2 lg:gap-0'>
        <div className='lg:w-auto w-full'>
          {/* Alumni button */}
          <button className={`px-12 py-3 cursor-pointer border-b-3 lg:w-auto w-1/2 ${userType === 'alum' ? 'border-primary' : 'border-transparent'}`} onClick={() => setUserType('alum')}>
            <p className='text-black font-satoshi-medium text-md'> Alumni ({alumniUserCount}) </p>
          </button>
          {/* Student button */}
          <button className={`px-12 py-3 cursor-pointer border-b-3 lg:w-auto w-1/2 ${userType === 'student' ? ' border-primary' : 'border-transparent'}`} onClick={() => setUserType('student')}>
            <p className='text-black font-satoshi-medium text-md'> Student ({studentUserCount}) </p>
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
      {/* Table for desktop */}
      <div className='border border-gray-400 rounded-xl p-6 flex-1 lg:block hidden overflow-auto'>
          <table className="w-full">
            {/* Table Header */}
            <thead>
              <tr className="text-left text-xs text-primary font-satoshi-regular">
                <th className="py-2 px-4"></th>
                <th className="py-2 px-4">NAME</th>
                <th className="py-2 px-4">EMAIL</th>
                <th className="py-2 px-4">STUDENT NUMBER</th>
                <th className="py-2 px-4">GRADUATING CLASS</th>
                <th className="py-2 px-4">DATE OF REGISTRATION</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className='font-satoshi-regular text-md'>
              {pendingUsers.map((user, index) => (
                <tr 
                key={index} 
                className="hover:bg-gray-100 cursor-pointer" 
                onClick={() => {navigate(`/admin/records/verification-confirmation/${user.user_id}`)}}
                >
                  {/* User image */}
                  <td>
                    {/* <div className="w-8 h-8 bg-gray-300 rounded-full"></div> */}
                  </td>
                  {/* User Name */}
                  <td className="py-3 px-4 flex items-center gap-2 font-satoshi-bold"> {user.name} </td>
                  {/* User Email*/}
                  <td className="py-3 px-4">{user.email}</td>
                  {/* User Student Number */}
                  <td className="py-3 px-4">{user.student_number}</td>
                  {/* User Graduating Class*/}
                  <td className="py-3 px-4">{user.grad_class}</td>
                  {/* User Date Registration */}
                  <td className="py-3 px-4">{user.date_of_reg}</td>
                  {/* User Status */}
                </tr>
              ))}
            </tbody>
          </table>
      </div>
      {/* Table for mobile */}
      <div className='flex flex-col lg:hidden'>
        {/* User Card */}
        {pendingUsers.map((user) => (
            <div key={user.user_id} 
            className='flex w-full p-3 hover:bg-gray-100 cursor-pointer'
            onClick={() => {navigate(`/admin/records/verification-confirmation/${user.user_id}`)}}>
            {/* Image placeholder */}
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              <div className='flex justify-between flex-1'>
                <div className='flex flex-col ml-3'>
                  <h2 className='font-satoshi-bold text-md'> {user.name} </h2>
                  <p className='font-satoshi-light text-sm'> {user.email} </p>
                </div>
                <div className='flex flex-col text-right'>
                  <p className='font-satoshi-regular text-md '> Date of Registration</p>
                  <p className='font-satoshi-bold'> {user.registration_date}</p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default AdminPendingVerifications
