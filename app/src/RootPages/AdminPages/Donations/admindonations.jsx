import React, {useState, useEffect} from 'react'
import { Plus, HandCoins, MoveLeft, MoveRight, List, LayoutGrid, Filter } from 'lucide-react'
import DonationsTable from '../../../components/AdminComponents/donationstable'
import { useNavigate } from 'react-router-dom'
function AdminDonations() {
  const navigate = useNavigate()

  const [donationType, setDonationType] = useState('open')
  const [viewStyle, setViewStyle] = useState('List')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(10)
  const [donations, setDonations] = useState([])

  useEffect(() => {
      setDonations([
        {
          donation_id: '98ba9554-28e1-4ad8-a199-7ecd3a57b384',
          title: "ICS PalCISihan",
          dateCreated: "2025-04-01",
          donationCount: 100,
          percentFunded: "None",
          amountRaised: "₱10,000",
        },
        {
          donation_id: '204eab7c-8c62-4669-b8d5-08d68c1fbb3b',
          title: "ICS Quizcon Tokens",
          dateCreated: "2025-03-20",
          donationCount: 88,
          percentFunded: "None",
          amountRaised: "None",
        },
        {
          title: "Library Drive",
          dateCreated: "2025-04-08",
          donationCount: 6,
          percentFunded: "100%",
          amountRaised: "₱3,000",
        },
        {
          title: "STEM Equipment",
          dateCreated: "2025-03-15",
          donationCount: 45,
          percentFunded: "34%",
          amountRaised: "₱15,500",
        },
        {
          title: "Food Drive",
          dateCreated: "2024-12-10",
          donationCount: 120,
          percentFunded: "70%",
          amountRaised: "₱25,000",
        },
        {
          title: "Scholarship Fund",
          dateCreated: "2024-10-05",
          donationCount: 200,
          percentFunded: "85%",
          amountRaised: "₱50,000",
        },
        {
          title: "Cultural Night Raffle",
          dateCreated: "2024-06-15",
          donationCount: 73,
          percentFunded: "58%",
          amountRaised: "₱8,750",
        },
        {
          title: "Cultural Night Raffle",
          dateCreated: "2024-06-15",
          donationCount: 73,
          percentFunded: "58%",
          amountRaised: "₱8,750",
        },
        {
          title: "Cultural Night Raffle",
          dateCreated: "2024-06-15",
          donationCount: 73,
          percentFunded: "58%",
          amountRaised: "₱8,750",
        },
        {
          title: "Cultural Night Raffle",
          dateCreated: "2024-06-15",
          donationCount: 73,
          percentFunded: "58%",
          amountRaised: "₱8,750",
        },
        {
          title: "Cultural Night Raffle",
          dateCreated: "2024-06-15",
          donationCount: 73,
          percentFunded: "58%",
          amountRaised: "₱8,750",
        },
        {
          title: "Cultural Night Raffle",
          dateCreated: "2024-06-15",
          donationCount: 73,
          percentFunded: "58%",
          amountRaised: "₱8,750",
        },
      ])
  }, []);

  return (
    <div className='flex flex-col lg:p-6 h-screen overflow-hidden max-w-7xl mx-auto'>
      {/* Header and add donation button */}
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-primary text-5xl font-satoshi-bold'>Donations</h1>
        <button className='flex bg-primary font-satoshi-regular px-6 py-3 text-white rounded-2xl gap-2' onClick={() => {navigate("/admin/donations/create-donation-drive")}}> 
          <Plus/>
          <p> New Donation</p>
        </button>
      </div>
      {/* HELP ICS */}
      <div className='border border-gray-300 rounded-xl flex py-4 cursor-pointer hover:border-primary' onClick={() => {navigate("/admin/donations/help-ics")}}>
        {/* Help ICS */}
        <div className='flex flex-row text-2xl items-center justify-center flex-1'> 
          <HandCoins/>
          <h2 className='font-satoshi-medium'>Help ICS</h2>
        </div>
        {/* Divider */}
        <div className='border-l border-gray-300 '></div>
        {/* Monetary Donations and In-kind donations */}
        <div className='flex flex-1'>
          {/* Monetary Donations */}
          <div className='flex flex-col items-center justify-center flex-1'>
            <h3 className='font-satoshi-bold text-2xl text-primary'> P123,456</h3>
            <p className='font-satoshi-light '>Monetary Donations</p>
          </div>
          {/* In-kind Donations */}
          <div className='flex flex-col items-center justify-center flex-1'>
            <h3 className='font-satoshi-bold text-2xl text-primary'> 12 </h3>
            <p className='font-satoshi-light '>In-kind Donations</p>
          </div>
        </div>
        {/* Divider */}
        <div className='border-l border-gray-300 '></div>
        <div className='flex flex-col items-center justify-center flex-1'>
          <h3 className='font-satoshi-bold text-2xl text-primary'> 10 </h3>
          <p className='font-satoshi-medium '>Unverified Donations</p>
        </div>
      </div>
      <div className='flex flex-col w-full lg:w-auto lg:flex-row items-center lg:justify-between lg:ml-5 gap-2 lg:gap-0'>
          <div className='w-full lg:w-auto  min-w-xs'>
            {/* Alumni button */}
            <button className={`px-12 py-3 cursor-pointer border-b-3 w-1/2 lg:w-auto ${donationType === 'open' ? 'border-primary' : 'border-transparent'}`} onClick={() => setDonationType('open')}>
              <p className='text-black font-satoshi-medium text-md'> Open </p>
            </button>
            {/* Student button */}
            <button className={`px-12 py-3 cursor-pointer border-b-3 w-1/2 lg:w-auto ${donationType === 'closed' ? ' border-primary' : 'border-transparent'}`} onClick={() => setDonationType('closed')}>
              <p className='text-black font-satoshi-medium text-md'> Closed </p>
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
        <div className='border border-gray-400 rounded-xl p-6 flex-1 hidden lg:block overflow-auto'>
          <DonationsTable data={donations}/>
        </div>
    </div>
  )
}

export default AdminDonations
