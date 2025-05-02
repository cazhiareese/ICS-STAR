import React, {useState, useEffect} from 'react'
import { Plus, HandCoins, MoveLeft, MoveRight, List, LayoutGrid, Filter, Search } from 'lucide-react'
import DonationsTable from '../../../components/AdminComponents/donationstable'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import CircularLoading from '../../../components/LoadingComponents/circularloading'
import SortModal from '../../../components/AdminComponents/sortmodal'
import OrderToggle from '../../../components/AdminComponents/ordertoggle'
import PaginationComponent from "../../../components/AdminComponents/PaginationComponent"
import SearchComponent from "../../../components/AdminComponents/SearchComponent"

function AdminDonations() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [donationType, setDonationType] = useState('open')
  const [viewStyle, setViewStyle] = useState('List')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(false)
  const [genericDriveDetails, setGenericDriveDetails] = useState({})

  const filters = [
    {label: 'Amount Raised', value: 'by-amount-raised' },
    {label: 'Percent Funded', value: 'by-percent-funded'},
    {label: 'Donation Count', value: 'by-donation-count'},
    {label: 'Date Created', value: 'by-date-created'}
  ]
  const [sortBy, setSortBy] = useState('by-amount-raised');
  const [sortDirection, setSortDirection] = useState('desc');


  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  async function fetchData (token) {
    setLoading(true)
    try {
      let endpointBase = '/admin/donations/open-drives'; // default
    
      if (donationType === 'closed') {
        endpointBase = '/admin/donations/closed-drives'; 
      }
    
      let endpoint = endpointBase; // start with base
    
      console.log(sortBy);
      console.log(sortDirection);
    
      if (sortBy && sortDirection) {
        let sortSuffix = sortDirection === 'asc' ? 'ascending' : 'descending';
        if (sortBy === 'by-date-created') {
          sortSuffix = sortDirection === 'asc' ? 'newest' : 'oldest';
        }
    
        endpoint = `${endpointBase}-${sortBy}${sortSuffix ? `-${sortSuffix}` : ''}`;
      }


    
      let pageUrl = `${endpoint}?page=${page}`;

      if (query){
        pageUrl += `&title=${query}`
      }

      console.log(pageUrl)
      try{
       const response = await axios.get(`${API_BASE_URL}${pageUrl}`, {headers: {Authorization: `Bearer ${token}`}});
       console.log(response)
       setDonations(response.data.data);
       setTotalPages(response.data.total_pages)

      }catch(error){
        console.log(error)
        setDonations([])
      }

      const genDriveResponse = await axios.get(`${API_BASE_URL}/admin/donations/update-generic-drive`, {headers: {Authorization: `Bearer ${token}`}})
      console.log(genDriveResponse.data)
      setGenericDriveDetails(genDriveResponse.data)

    } catch (error) {
      console.error("Error fetching donations:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() =>{
    const token = localStorage.getItem("token")
    fetchData(token)
  }, [sortBy, sortDirection, page, donationType, query])
  
    
    return (
      <div className='flex flex-col lg:p-6 h-screen overflow-hidden max-w-7xl mx-auto bg-gray-100'>
      {/* Header and add donation button */}
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-primary text-5xl font-satoshi-bold'>Donations</h1>
        <button className='flex bg-primary font-satoshi-regular px-6 py-3 text-white rounded-2xl gap-2 cursor-pointer hover:bg-hover' onClick={() => {navigate("/admin/donations/create-donation-drive")}}> 
          <Plus/>
          <p className='font-satoshi-bold'> New Donation</p>
        </button>
      </div>
      {/* HELP ICS */}
      <div className='border border-gray-300 rounded-xl flex py-4 cursor-pointer hover:border-primary bg-white' onClick={() => {navigate("/admin/donations/help-ics")}}>
        {/* Help ICS */}
        <div className='flex flex-row text-2xl items-center justify-center flex-1 gap-2'> 
          <HandCoins/>
          <h2 className='font-satoshi-medium'>Help ICS</h2>
        </div>
        {/* Divider */}
        <div className='border-l border-gray-300 '></div>
        {/* Monetary Donations and In-kind donations */}
        <div className='flex flex-1'>
          {/* Monetary Donations */}
          <div className='flex flex-col items-center justify-center flex-1'>
            <h3 className='font-satoshi-bold text-2xl text-primary'> Php {genericDriveDetails.total_amount}</h3>
            <p className='font-satoshi-light '>Monetary Donations</p>
          </div>
          {/* In-kind Donations */}
          <div className='flex flex-col items-center justify-center flex-1'>
            <h3 className='font-satoshi-bold text-2xl text-primary'> {genericDriveDetails.total_in_kind} </h3>
            <p className='font-satoshi-light '>In-kind Donations</p>
          </div>
        </div>
        {/* Divider */}
        <div className='border-l border-gray-300 '></div>
        <div className='flex flex-col items-center justify-center flex-1'>
          <h3 className='font-satoshi-bold text-2xl text-primary'> {genericDriveDetails.number_of_unverified} </h3>
          <p className='font-satoshi-medium '>Unverified Donations</p>
        </div>
      </div>
      <div className='flex flex-col w-full lg:w-auto lg:flex-row items-center lg:justify-between lg:ml-5 gap-2 lg:gap-0 mt-8 mb-1'>
          <div className='w-full lg:w-auto  min-w-48'>
            {/* Open button */}
            <button className={`px-3 py-3 cursor-pointer border-b-3 w-1/4 lg:w-auto ${donationType === 'open' ? 'border-primary font-satoshi-medium' : 'border-transparent font-satoshi-light'}`} onClick={() => setDonationType('open')}>
              <p className='text-black font-satoshi-medium text-sm'> Open </p>
            </button>
            {/* Close button */}
            <button className={`px-3 py-3 cursor-pointer border-b-3 w-1/4 lg:w-auto ${donationType === 'closed' ? ' border-primary font-satoshi-medium' : 'border-transparent font-satoshi-light'}`} onClick={() => setDonationType('closed')}>
              <p className='text-black font-satoshi-medium text-sm'> Closed </p>
            </button>
          </div>
          {/* Sort by */}
          <div className='flex gap-2 flex-row items-center'>
            {/* <button className='border border-disabled rounded-3xl px-5 py-2 cursor-pointer flex items-center gap-1'>
              <p className='text-black font-satoshi-light text-sm hidden lg:block'> Sort by </p>
                <p className='font-satoshi-medium text-primary block'>Name</p>
            </button> */}
            
            <SearchComponent
              query={query}
              setQuery={setQuery}
              focused={focused}
              setFocused={setFocused}
            />
            <SortModal filters={filters} selectedFilter={sortBy} onSelect={setSortBy}/>
            {/* Order Toggle */}
            <OrderToggle direction={sortDirection} onToggle={setSortDirection}/>
            {/* Filter */}
            {/* <button className='border border-disabled rounded-3xl px-5 py-2 flex gap-2 items-center cursor-pointer'>
              <Filter className='text-primary'/>
              <p className='text-primary fsont-satoshi-medium text-sm'> Filter</p>
            </button> */}
            {/* Page */}
            <PaginationComponent
              page={page}
              setPage={setPage}
              totalPages={totalPages}
            />
          </div>
        </div>
        <div className='border border-gray-400 rounded-xl h-fit hidden lg:block overflow-auto bg-white'>
          <DonationsTable data={donations} loading={loading}/>
        </div>
    </div>
    )
}

export default AdminDonations
