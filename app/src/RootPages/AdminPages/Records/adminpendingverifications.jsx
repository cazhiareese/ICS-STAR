import {React, useState, useEffect} from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Search, MoveLeft, MoveRight, Filter, List, LayoutGrid } from 'lucide-react'
import axios from 'axios'
import CircularLoading from '../../../components/LoadingComponents/circularloading';
import SortModal from '../../../components/AdminComponents/sortmodal';
import OrderToggle from '../../../components/AdminComponents/ordertoggle';
import FilterModal from '../../../components/AdminComponents/UserFilter';
import PaginationComponent from "../../../components/AdminComponents/PaginationComponent"
import PendingUsersTable from '../../../components/AdminComponents/PendingUsersTable';
import SearchComponent from '../../../components/AdminComponents/SearchComponent';

function AdminPendingVerifications() {
    const navigate = useNavigate()

    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [viewStyle, setViewStye] = useState('List')
    const [loading, setLoading] = useState(false)

    const [query, setQuery] = useState('')
    const [focused, setFocused] = useState(false)

    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
    const [userType, setUserType] = useState('alum')
    const [pendingUsers, setPendingUsers] = useState([])
    const [studentUserCount, setStudentUserCount] = useState(null)
    const [alumniUserCount, setAlumniUserCount] = useState(null)

    const sorters = [
      { label: 'Name', value: 'name' },
      { label: 'Batch', value: 'batch' },
      { label: 'Registration Date', value: 'regisdate' },
    ];

    const alumniFilters = [
      { label: 'Alumni Batch', value: 'batch' },
      { label: 'Alumni Graduation Year', value: 'graduation_year' },
    ]

    const studentFilters = [
      {label: 'Student Batch', value: 'batch'},
      {label: 'Student Standing', value: 'standing'}
    ]


    const [sortBy, setSortBy] = useState(sorters[2].value);
    const [sortDirection, setSortDirection] = useState('desc');
    const [orderBy, setOrderBy] = useState('');

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
    const [selectedFilters, setSelectedFilters] = useState([]);

    const fetchUnverifiedUsers = async (type, token) => {
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

        params.append('page', page)
        
        const queryString = params.toString();        
        const url = `${API_BASE_URL}/admin/filter/unverified/${type}?${queryString}`
        const response = await axios.get(url, {headers: {Authorization: `Bearer ${token}`}}); 
        setTotalPages(response.data.total_pages)
        setPendingUsers(response.data.items);
      } catch (error) {
        console.log(error);
        setPendingUsers([]);
      }
    };
    
    const fetchUsersCount = async (token) => {
      try {
        const [alumniResponse, studentsResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/admin/unverified/alumni/count`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/admin/unverified/students/count`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
    
        console.log('Alumni count response:', alumniResponse.data);
        setAlumniUserCount(alumniResponse.data.unverified_alumni_count);
    
        console.log('Students count response:', studentsResponse.data);
        setStudentUserCount(studentsResponse.data.unverified_students_count);
      } catch (error) {
        console.log('Error fetching user counts:', error);
        setAlumniUserCount(0);
        setStudentUserCount(0);
      }
    };
    
    useEffect(() => {
      const token = localStorage.getItem("token");
      const fetchData = async () => {
        setLoading(true);
        try {
          await Promise.all([
            fetchUnverifiedUsers(userType, token),
            fetchUsersCount(token),
          ]);
        } catch (error) {
          console.log('Error in fetchData:', error);
        } finally {
          setLoading(false);
        }
      };
    
      fetchData();
    }, [userType]);

    useEffect(() => {
      const token = localStorage.getItem("token")
      const fetchData = async () => {
        setLoading(true)
        try {
          await Promise.all([
            fetchUnverifiedUsers(userType, token),
          ])
        } catch (error) {
          console.log(error)
        } finally {
          setLoading(false)
        }
      }
    
      fetchData()
    }, [sortBy, sortDirection, query, selectedFilters])
    
    // Initial fetch
    useEffect(() => {
      setUserType('alum') // this will automatically trigger the above effect
    }, [])


  return (
    
    <div className='flex flex-col lg:p-6 h-screen max-w-7xl mx-auto bg-gray-100'>
      <div className='flex gap-2 mb-0'>
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
            <SearchComponent
              query={query}
              setQuery={setQuery}
              focused={focused}
              setFocused={setFocused}
            />
          </div>
        </div>
      </div>

      {/* Alumni or student */}
      <div className='flex items-center justify-between lg:ml-5 lg:flex-row flex-col gap-2 lg:gap-0'>
        <div className='lg:w-auto w-full'>
          {/* Alumni button */}
          <button className={`px-12 py-3 cursor-pointer border-b-3 lg:w-auto w-1/2 ${userType === 'alum' ? 'border-primary' : 'border-transparent'}`} onClick={() => setUserType('alum')}>
            <p className='text-black font-satoshi-medium text-md'> Alumni {loading ? '' : `(${alumniUserCount})`} </p>          </button>
          {/* Student button */}
          <button className={`px-12 py-3 cursor-pointer border-b-3 lg:w-auto w-1/2 ${userType === 'student' ? ' border-primary' : 'border-transparent'}`} onClick={() => setUserType('student')}>
            <p className='text-black font-satoshi-medium text-md'> Student {loading ? '' : `(${studentUserCount})`} </p>
          </button>
        </div>
        {/* Sort by */}
        <div className='flex gap-2'>
          <SortModal filters={sorters} selectedFilter={sortBy} onSelect={handleSortFieldChange}/>
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
          <PaginationComponent
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        </div>
      </div>
      {/* Table for desktop */}
      <div className='border border-gray-300 rounded-xl p-6 h-fit lg:block hidden overflow-auto bg-white'>
        <PendingUsersTable
          pendingUsers={pendingUsers}
          loading={loading}
        />
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
