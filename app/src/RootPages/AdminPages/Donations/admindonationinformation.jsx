import React, {useState, useEffect} from 'react'
import { MoveLeft, X, Link, MoveRight, Pencil } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import VerifiedDonationsTable from "../../../components/AdminComponents/verifieddonationstable"
import PendingDonationsTable from '../../../components/AdminComponents/pendingdonationstable';
import axios from 'axios';
import CircularLoading from '../../../components/LoadingComponents/circularloading';
import PaginationComponent from '../../../components/AdminComponents/PaginationComponent'

function AdminDonationInformation() {
  const navigate = useNavigate()
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const {driveid} = useParams();

  const [progressData, setProgressData] = useState([]);

  const [pendingDonations, setPendingDonations] = useState([])
  const [verifiedDonations, setVerifiedDonations] = useState([])
  const [isClosed, setIsClosed] = useState(false)
  const [viewDetailsModal, setViewDetailsModal] = useState(false) 
  const [editing, setEditing] = useState(false)
  const [closeDonation, setCloseDonation] = useState(false)
  const [closeDonationLoading, setCloseDonationLoading] = useState(false)
  const [transitionComplete, setTransitionComplete] = useState(false)
  const [noPendingDonations, setNoPendingDonations] = useState()
  const [donation, setDonation] = useState()
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState('donations')
  const [pendingPages, setPendingPages] = useState(1)
  const [totalPendingPages, setTotalPendingPages] = useState(1)

  async function handleCloseDrive() {
    setCloseDonationLoading(true)
  
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/donations/close-drive/${driveid}`)
      console.log(response)
  
      // Show success message
      setCloseDonationLoading(false)
      setTransitionComplete(true)
      window.location.reload()
    } catch (error) {
      console.error("Failed to close donation drive", error)
    }
  }

  async function fetchData() {
    setLoading(true)

    try {
      const donationResponse = await axios.get(`${API_BASE_URL}/admin/donations/view/${driveid}`)
      console.log(donationResponse.data)   
      setDonation(donationResponse.data)

      // Set pending donations first before checking its length
      const pendingList = donationResponse.data.pending_list
      setPendingDonations(pendingList)
      setNoPendingDonations(Object.keys(pendingList).length === 0)

      const verifiedList = donationResponse.data.verified_list
      // console.log(verifiedList)
      setVerifiedDonations(verifiedList)

      const percentResponse = await axios.get(`${API_BASE_URL}/admin/donations/percent-funded/${driveid}`)
      console.log(percentResponse.data)

      const driveStatus = donationResponse.data.is_closed
      setIsClosed(driveStatus)

      setProgressData([
        { name: "progress", value: percentResponse.data.percent_funded },
        { name: "remaining", value: percentResponse.data.remaining_percent }
      ])

    } catch (error) {
      console.error("Failed to fetch donation data", error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
  
    fetchData()
  }, [])
  

  const COLORS = ["#0B2B8C", "#F4F4F4"];

  return (
    <div className='flex flex-col lg:p-6 overflow-auto max-w-7xl mx-auto bg-gray-100'>
      {loading ? (
        <div className='flex h-screen w-full items-center justify-center'>
          <CircularLoading/>
        </div>
      ) : (
        <>
        {/* Back */}
          <button className="flex gap-2 mb-3 flex-row items-center cursor-pointer" onClick={() => navigate(-1)}>
            <MoveLeft className='text-primary'/> 
            <p className='text-primary font-satoshi-medium text-lg'>Back to Donations List</p>
          </button>
          {/* Donation name and tag */}
          <div className='flex flex-row justify-between mb-5'>
            <div className='flex flex-row gap-2'>
              <h1 className='font-satoshi-bold text-primary text-4xl'>{donation.title}</h1>
              {/* Open or closed button */}
              {isClosed ? (
                <div className='bg-red-100 px-7 py-1 rounded-3xl flex items-center h-fit place-self-end'> 
                <p className='text-error font-satoshi-medium text-sm'>Closed</p>
              </div>          ) : (
                <div className='bg-green-100 px-7 py-1 rounded-3xl flex items-center h-fit place-self-end'> 
                  <p className='text-success font-satoshi-medium text-sm'>Open</p>
                </div>
              )}
            </div>
            {/* Generate Report or close drive */}
            <div className='h-fit gap-5 flex flex-row'>
              {isClosed ? (
                // For closed
                <>
                  {/* View Details */}
                  <button className='bg-primary text-white px-7 py-2 shadow-lg rounded-2xl hover:bg-hover cursor-pointer' onClick={() => {setViewDetailsModal(true)}}>
                    <p className='font-satoshi-light'>View Details</p>
                  </button>
                  {/* Export Donor List */}
                  <button className='bg-primary hover:bg-hover text-white px-7 py-2 shadow-lg rounded-2xl cursor-pointer'>
                    <p className='font-satoshi-light'>Export Donor List</p>
                  </button>
                </>          
              ) : (
                // For open
                <>
                  {/* View Statistics */}
                  <button className='bg-primary text-white px-7 py-2 shadow-lg rounded-2xl cursor-pointer hover:bg-hover' onClick={() => {navigate(`/admin/donations/donation-drive-demographics/${driveid}`)}}>
                    <p className='font-satoshi-light'>View Statistics</p>
                  </button>
                  {/* Close Drive */}
                  <button
                    className='bg-error hover:bg-red-400 text-white px-7 py-2 shadow-lg rounded-2xl cursor-pointer'
                    onClick={() => {setCloseDonation(true)}}
                  >
                    <p className='font-satoshi-light'>Close Drive</p>
                  </button>
                </>
              )}
            </div>
          </div>
          {/* Goal progress and recent transactions */}
          <div className='flex flex-row gap-2 mb-4 h-60'>
            {/* Goal Progress */}
            <div className='flex flex-col items-center justify-center flex-1/3 pb-10 border border-gray-300 rounded-xl h-full bg-white'>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={progressData}
                      startAngle={180}
                      endAngle={0}
                      cx="50%"
                      cy="100%"
                      innerRadius="120%"
                      outerRadius="150%"
                      dataKey="value"
                    >
                    {progressData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

              <div className="text-center -mt-22">
                <p className="text-sm text-gray-500 font-satoshi-medium">Goal Progress</p>
                <p className="text-6xl font-bold text-[#1F2A63] font-satoshi-bold">{donation.percent_funded}%</p>
              </div>
            </div>
            {/* Pending donations table */}
              <div className='flex-2/3 border border-gray-300 rounded-xl p-6 w-full flex flex-col h-full bg-white'>
                <div className='flex flex-row justify-between'>
                  <h2 className='font-satoshi-medium text-black text-2xl'>Pending Verification</h2>
                  <PaginationComponent
                    page={pendingPages}
                    setPage={setPendingPages}
                    totalPages={totalPendingPages}
                  />
                </div>
                <div className='w-full h-full flex-1 overflow-auto'>
                  {noPendingDonations ? (
                    <p className='text-center text-gray-500'>No donations to verify</p>
                ) : (
                  <>
                  <PendingDonationsTable data={pendingDonations} />
                  </>
                )} 
              </div>
              {noPendingDonations ? (
                <></>
              ) : (
                <div className='flex flex-row justify-between'>
                  <div className='flex flex-row gap-5 flex-1'>
                    <h3 className='font-satoshi-light'>Monetary Total: <span className='text-primary'></span></h3>
                    <h3 className='font-satoshi-light'>In-Kind Total: <span classname='text-primary'></span></h3>
                  </div>
                  <button className='flex gap-2 w-full flex-1 text-primary hover:text-hover transition-colors cursor-pointer justify-end items-center' onClick={() => {
                    navigate(`/admin/donations/pending-donations/${driveid}`, 
                      {state: {pendingDonations, driveName: donation.title}})
                    }}>
                    <p className='font-satoshi-light'> View all pending verifications </p>
                    <MoveRight className='stroke-1'/>
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className='border border-gray-300 rounded-xl p-4 mb-3 bg-white'>
            <div className='flex flex-row justify-between'>
              <h2 className='text-2xl font-satoshi-medium mb-2'>Description</h2>
              <button onClick={() => {}}>
                <Pencil/>
              </button>
            </div>
            <p className='font-satoshi-light'>{donation.description}</p>
            <h2 className='text-lg font-satoshi-medium mt-2'>Relevant Links</h2>
            <div className='border-b border-gray-300 mb-1' />
            {donation.links.map((link) => (
              <div
                key={link}
                className="flex flex-row gap-2 items-center text-primary hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              >
                <Link size={16} />
                <a 
                  className="font-satoshi-light hover:text-hover" 
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer">
                  {link}
                </a>
              </div>
            ))}
          </div>
          {/* Donations and filters */}
          <div className='mb-3'>
            <div className='flex items-end'>
              <h2 className='text-4xl font-satoshi-bold'>Donations</h2>
              <p className='text-lg font-satoshi-light'>/Verified</p>
            </div>
          </div>
          {/* Verified Donations Table */}
          <div className='border border-gray-300 rounded-xl p-6 hidden h-fit lg:block bg-white'>
            <VerifiedDonationsTable data={verifiedDonations}/>
          </div>
          {/* View Details Modal */}
          {viewDetailsModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
                <div className="flex flex-col items-center bg-white p-6 rounded-3xl shadow-lg min-w-md max-w-lg h-4/5">
                  {/* Modal Header */}
                  <div className="flex justify-between w-full items-center pb-2">
                    <h2 className="text-2xl font-satoshi-medium">Donation Details</h2>
                    <button className='rounded-full h-fit bg-error p-1 cursor-pointer' onClick={() => {setViewDetailsModal(false)}}>
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>
                  {/* Image */}
                  <div className="bg-primary h-1/3 w-full rounded-xl overflow-hidden">
                    <img
                      src={donation.image}
                      alt="Donation image"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className='mb-5 flex flex-col w-full'>
                    <h1 className='font-satoshi-bold text-2xl'>{donation.title}</h1>
                    <p className='font-satoshi-light '>Date Started: {donation.created_at}</p>
                  </div>
                  <div className='flex flex-col w-full'>
                    <h2 className='font-satoshi-light text-sm'>Description</h2>
                    <p className='font-satoshi-regular text-sm'>
                      {donation.description}
                    </p>
                  </div>

                  {/* Links */}
                  <div className='w-full mt-2'>
                    <h2>Relevant Links</h2>
                    <div className='border border-t-gray-300'></div>
                    {/* Iterate over links */}
                    <div className="ml-6 flex gap-2 overflow-auto flex-col">
                      {donation.relevant_links?.map((link, index) => (
                        <a
                          key={index}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className='text-primary text-sm break-all'
                        >
                          {link}
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  {/* <button className="mt-4 bg-primary text-white px-4 py-2 rounded-3xl w-full cursor-pointer" onClick={() => {}}>
                    Limit Account Access
                  </button> */}
                </div>
              </div>
            )}
            {/* Close Donation Confirmatino Modal */}
            {closeDonation && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
                <div className="flex flex-col justify-center items-center bg-white p-6 rounded-3xl shadow-lg w-[400px] min-h-[250px]">
                  {closeDonationLoading ? (
                    <div className="h-full">
                      <CircularLoading />
                    </div>
                  ) : transitionComplete ? (
                    <>
                      <div className="text-success">
                        <CheckCircle size={48} />
                      </div>
                      <p className="text-xl font-satoshi-medium mt-4 text-center">
                        Transition to Alumni Successful!
                      </p>
                      <button
                        className="bg-success text-white px-4 py-2 rounded-3xl w-full mt-6 cursor-pointer"
                        onClick={() => {
                          setCloseDonation(false)
                          setTransitionComplete(false)
                        }}
                      >
                        Close
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-xl font-satoshi-medium text-center mt-4">
                        Are you sure you want to close this donation drive?
                      </p>
                      <div className="flex gap-3 mt-6 w-full h-full justify-center">
                        <button
                          className="border border-gray-300 px-4 py-2 rounded-3xl w-full cursor-pointer text-gray-400"
                          onClick={() => setCloseDonation(false)}
                        >
                          Cancel
                        </button>
                        <button
                          className="bg-error text-white px-4 py-2 rounded-3xl w-full cursor-pointer"
                          onClick={() => handleCloseDrive()}
                        >
                          Confirm
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
        </>
      )}
    </div>
  )
}

export default AdminDonationInformation