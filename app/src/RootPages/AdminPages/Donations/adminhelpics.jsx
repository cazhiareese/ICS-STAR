import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MoveLeft, MoveRight } from 'lucide-react'
import PendingDonationsTable from '../../../components/AdminComponents/pendingdonationstable'
import VerifiedDonationsTable from '../../../components/AdminComponents/verifieddonationstable'
import axios from 'axios'
import CircularLoading from '../../../components/LoadingComponents/circularloading'

function AdminHelpIcs() {
    const navigate = useNavigate()

    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL

    const [pendingDonations, setPendingDonations] = useState([])
    const [verifiedDonations, setVerifiedDonations] = useState([])
    const [driveData, setDriveData] = useState({})
    const [loading, setLoading] = useState(false)
    const [driveid, setDriveid] = useState('')

  async function fetchData () {
    setLoading(true)

    try {
      const genDriveRes = await axios.get(`${API_BASE_URL}/admin/donations/view/generic-drive`)
      console.log(genDriveRes.data)
      setDriveData(genDriveRes.data)
      setPendingDonations(genDriveRes.data.pending_list)
      setVerifiedDonations(genDriveRes.data.verified_list)
      setDriveid(genDriveRes.data.drive_id)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  };
    
  useEffect(() => {  
    fetchData();
  }, []);
  return (
    loading ? (
      <div className='flex flex-row items-center justify-center h-screen'>
        <CircularLoading/>
      </div>
    ) : (
    <div className='flex flex-col lg:p-6 h-screen overflow-hidden max-w-7xl mx-auto'>
        <button className="flex gap-2 mb-3 flex-row items-center cursor-pointer" onClick={() => navigate(-1)}>
            <MoveLeft className='text-primary'/> 
            <p className='text-primary font-satoshi-medium text-lg'>Back to Donations List</p>
        </button>
        <h1 className='font-satoshi-bold text-5xl text-primary'>Help ICS Out</h1>
        <div className='h-1/3 f flex flex-row gap-2 mt-3'>
            <div className='flex-1/3 border border-gray-300 rounded-2xl flex flex-col items-center gap-4 justify-center'>
                <div className='flex flex-col items-center'>
                    <h2 className='font-satoshi-bold text-primary text-5xl'>P {driveData.grand_total}</h2>
                    <p className='font-satoshi-light text-black'>{`Total Raised (Verified)`}</p>
                </div>
                <div className='flex flex-col items-center'>
                    <h2 className='font-satoshi-bold text-primary text-5xl'>P {driveData.verified_total}</h2>
                    <p className='font-satoshi-light text-black'>{`Total Raised (Including Unverified)`}</p>
                </div>
            </div>
            <div className='flex-2/3 border border-gray-300 rounded-2xl p-6 flex flex-col'>
                <h2 className='font-satoshi-medium text-black text-2xl'>Pending Verifications</h2>
                <div className='overflow-auto flex-1'>
                    <PendingDonationsTable data={pendingDonations}/>
                </div>
                <button className='flex gap-2 w-full justify-end text-primary cursor-pointer' onClick={() => {
                  navigate(`/admin/donations/pending-donations/${driveid}`, 
                  {state: {pendingDonations, driveName: driveData.title}})                 
                }}> 
                    {/* TODO: Add HELP ICS Donation id navigation */}
                  <p className='font-satoshi-light'> View all pending verifications </p>
                  <MoveRight/>
              </button>
          </div>
        </div>
        <div className='flex flex-row justify-between items-center'>
          <h2 className='font-satoshi-medium text-black text-4xl my-5'>List of Donations</h2>
          <button className='bg-primary rounded-3xl text-white px-4 py-3 h-fit cursor-pointer' onClick={() => {
            navigate(`/admin/donations/donation-drive-demographics/${driveid}`)
          }}> View Statistics </button>
        </div>
        <div className=' h-3/5 w-full border border-gray-300 rounded-2xl overflow-auto'>
            <VerifiedDonationsTable data={verifiedDonations}/>
        </div>
    </div>
    )
  )
}

export default AdminHelpIcs
