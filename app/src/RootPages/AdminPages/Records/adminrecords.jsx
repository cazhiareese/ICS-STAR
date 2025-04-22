import React, { useState, useEffect } from 'react'
import { BadgeCheck, Filter, List, LayoutGrid, MoveLeft, MoveRight, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import CircularLoading from '../../../components/LoadingComponents/circularloading';
import UsersTable from '../../../components/AdminComponents/userstable';
import SortModal from '../../../components/AdminComponents/sortmodal';
import OrderToggle from '../../../components/AdminComponents/ordertoggle';
import FilterModal from '../../../components/AdminComponents/UserFilter';

function AdminRecords() {
  const navigate = useNavigate()
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const [userType, setUserType] = useState('alum')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(48)
  const [viewStyle, setViewStye] = useState('List')
  const [maxRows, setMaxRows] = useState(12)
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false)
 
  // For the search and filtering
  const sorters = [
    { label: 'Name', value: 'name' },
    { label: 'Batch', value: 'batch' },
    { label: 'Last Update', value: 'updated' },
  ];
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [sortBy, setSortBy] = useState(sorters[0].value);
  const [sortDirection, setSortDirection] = useState('asc');
  const [orderBy, setOrderBy] = useState('name_asc');
  
  const alumniFilters = [
    { label: 'Alumni Batch', value: 'batch' },
    { label: 'Alumni Graduation Year', value: 'graduation_year' },
    { label: 'Alumni Career', value: 'job_title' },
    { label: 'Alumni Location', value: 'city' }
  ]
  const studentFilters = [
    {label: 'Student Batch', value: 'batch'},
    {label: 'Student Standing', value: 'standing'}
  ]

  const [selectedFilters, setSelectedFilters] = useState([])


  const handleSortFieldChange = (field) => {
    setSortBy(field);
    const newParam = `${field}_${sortDirection}`;
    setOrderBy(newParam);
  };

  const handleDirectionToggle = (newDirection) => {
    setSortDirection(newDirection);
    const newParam = `${sortBy}_${newDirection}`;
    setOrderBy(newParam);
  };

  const handleFilterChange = (filterList) => {
    setSelectedFilters(filterList);
  };


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        selectedFilters.forEach(({ field, value }) => {
            params.append(field, value);
        });
        if (query) {
          params.append('name', query);
        }else{
          params.delete('name');
        }
        if (orderBy) {
          params.append('order_by', orderBy);
        }
        const queryString = params.toString();
        const url = `${API_BASE_URL}/admin/filter/${userType}?${queryString}`
        const response = await axios.get(url);
        setUsers(response.data);

      } catch (error) {
        console.log('Error getting users');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [userType, sortBy, sortDirection, query, selectedFilters]);
  
  // Initial fetch
  useEffect(() => {
    // fetchUsers('alum');
    setUserType('alum')
  }, []);
  
  return ( 
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
            <button className={`px-12 py-3 cursor-pointer border-b-3 w-1/2 lg:w-auto ${userType === 'student' ? ' border-primary' : 'border-transparent'}`} onClick={() => setUserType('student')}>
              <p className='text-black font-satoshi-medium text-md'> Student </p>
            </button>
          </div>
          {/* Sort by */}
          <div className='flex gap-2'>
            
            <SortModal filters={sorters} selectedFilter={sortBy} onSelect={handleSortFieldChange}/>
          
            {/* Order by */}
            <OrderToggle direction={sortDirection} onToggle={handleDirectionToggle}/>

            {/* Filter */}
           { userType === 'alum' ? <FilterModal filters={alumniFilters} setterFunction={handleFilterChange}/>:
              <FilterModal filters={studentFilters} setterFunction={handleFilterChange}/>
           }
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
        {
          loading ? (
            <div className="flex justify-center items-center h-screen">
              <CircularLoading size={90} />
            </div>
          ) : (
            <div className="border border-gray-400 rounded-xl p-6 flex-1 hidden lg:block overflow-auto">
              <UsersTable data={users} />
            </div>
          )
        }
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
