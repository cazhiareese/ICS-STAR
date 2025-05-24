import React, {useEffect, useState} from 'react'
import { Plus, MoveLeft, MoveRight, Dot, Search } from 'lucide-react'
import AdminEventCard from '../../../components/AdminComponents/AdminEventCard'
import axios from 'axios'
import EventsTable from '../../../components/AdminComponents/EventsTable'
import CircularLoading from "../../../components/LoadingComponents/circularloading" 
import { Navigate, useNavigate } from 'react-router-dom'
import SortModal from '../../../components/AdminComponents/sortmodal'
import OrderToggle from '../../../components/AdminComponents/ordertoggle'
import PaginationComponent from '../../../components/AdminComponents/PaginationComponent'
import SearchComponent from '../../../components/AdminComponents/SearchComponent'
import TabSwitcher from '../../../components/AdminComponents/TabSwitcher'

function AdminEvents() {
  const navigate = useNavigate()
  const [eventType, setEventType] = useState('active')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [events, setEvents] = useState([])
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL


  const sorters = [
    {label: 'Date Concluded', value: 'concluded'},
    {label: 'RSVP Count', value: 'count'}
  ]

  const eventTabs = [
    { label: 'Active', value: 'active' },
    { label: 'Finished', value: 'finished' },
  ];

  const [sortBy, setSortBy] = useState(sorters[0].value);
  const [sortDirection, setSortDirection] = useState('desc');
  const [orderBy, setOrderBy] = useState('concluded_desc');

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


  async function fetchEvents(type, token) {
    setLoading(true)
    try {
      console.log(query)
      const params = new URLSearchParams();
      if (query && query.length > 0) {
        params.append('title', query);
      }else{
        params.delete('title');
      }

      if (orderBy && type==='finished') {
        params.append('order_by', orderBy);
      }

      const queryString = params.toString();
      let endpoint = "";
      if (type === "active") {
        endpoint = `/api/admin/events/all-open-events/?${queryString}`;
      } else if (type === "finished") {
        endpoint = `/api/admin/events/all-concluded-events/?${queryString}`;
      }
      
      endpoint = queryString
        ? `${endpoint}&page=${page}`
        : `${endpoint}page=${page}`;

      // console.log(endpoint)

  
      const response = await axios.get(`${API_BASE_URL}${endpoint}`,
        {headers: {
          Authorization: `Bearer ${token}`,
      }});
      console.log(response)
      setEvents(response.data.data);
      setTotalPages(response.data.total_pages)
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    fetchEvents(eventType, token)

  }, [eventType, query, sortBy, sortDirection, page])



  return (
    <div className='h-screen w-full p-6 flex flex-col bg-gray-100'>
      {/* Events header and new event button */}
      <div className='flex flex-row justify-between mb-10'>
        <h1 className='font-satoshi-bold text-5xl text-primary'>Events</h1>
        <button className='flex flex-row items-center justify-center gap-2 font-satoshi-bold text-white bg-primary px-6 py-3 rounded-2xl hover:bg-hover cursor-pointer' onClick={() => {navigate("/admin/events/create-event")}}> 
          <Plus/> New Event
        </button>
      </div>
      {/* Alumni or student */}
      <div className='flex flex-col w-full lg:w-auto lg:flex-row items-center lg:justify-between lg:ml-5 gap-2 lg:gap-4'>
        <TabSwitcher
          currentTab={eventType}
          setTab={setEventType}
          tabs={eventTabs}
        />

        <div className='relative flex gap-2 justify-end flex-1 '>
          {/* Search */}
    
          <SearchComponent
            query={query}
            setQuery={setQuery}
            focused={focused}
            setFocused={setFocused}
          />
    
          {eventType === 'finished'?  <>
            <SortModal filters={sorters} selectedFilter={sortBy} onSelect={handleSortFieldChange}/>
          
            {/* Order by */}
            <OrderToggle direction={sortDirection} onToggle={handleDirectionToggle}/>
            </>: null }
          </div>

          {/* Page */}
          <PaginationComponent
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        </div>
          {eventType === 'active' ? (
            <div className="pt-4 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-auto mx-auto">
              {loading ? (
                // Skeleton Cards
                Array.from({ length: 8 }).map((_, index) => (
                  <AdminEventCard key={`skeleton-${index}`} loading={true} />
                ))
              ) : (
                // Actual Data
                events.map((event, index) => (
                  <AdminEventCard key={index} event={event} />
                ))
              )}
            </div>
          ) : eventType === 'finished' ? (
            <div className="border border-neutral-300 rounded-xl p-6 flex-1 hidden lg:block overflow-auto bg-white h-fit">
              {events.length == 0 ? (
                <div className='min-h-90 w-full flex flex-row items-center justify-center'>
                  <h1 className='font-satoshi-regular text-3xl text-primary'>No events to show</h1>
                </div>
              ) : (
                <EventsTable data={events} loading = {loading}/>
              )}
            </div>
          ) : null
        }
    </div>
  )
}

export default AdminEvents
