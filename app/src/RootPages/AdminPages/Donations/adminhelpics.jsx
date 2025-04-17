import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MoveLeft, MoveRight } from 'lucide-react'
import PendingDonationsTable from '../../../components/AdminComponents/pendingdonationstable'
import VerifiedDonationsTable from '../../../components/AdminComponents/verifieddonationstable'

function AdminHelpIcs() {
    const navigate = useNavigate()

    const [pendingDonations, setPendingDonations] = useState([])
    const [verifiedDonations, setVerifiedDonations] = useState([])

    useEffect(() => {
        const fetchData = async () => {
        //  const response = await axios.get(`${API_BASE_URL}/admin/donations/${driveid}`)
        //  console.log(response.data)   
            setPendingDonations([
              {
                "donation_id": "f2518831-8819-458d-aaa4-b0680ba3f5c2",
                "name": "Benjamin Ramirez",
                "donation_details": "₱8912.51",
                "date_donated": "2025-04-02T13:50:59.152511Z"
              },
              {
                "donation_id": "8c860069-21b4-4e95-895e-d6c98bb42e59",
                "name": "Charliee Garcia",
                "donation_details": "₱5000.00",
                "date_donated": "2025-04-09T13:38:36.449972Z"
              },
              {
                "donation_id": "8c860069-21b4-4e95-895e-d6c98bb42e59",
                "name": "Charliee Garcia",
                "donation_details": "₱5000.00",
                "date_donated": "2025-04-09T13:38:36.449972Z"
              },
              {
                "donation_id": "8c860069-21b4-4e95-895e-d6c98bb42e59",
                "name": "Charliee Garcia",
                "donation_details": "₱5000.00",
                "date_donated": "2025-04-09T13:38:36.449972Z"
              },
              {
                "donation_id": "8c860069-21b4-4e95-895e-d6c98bb42e59",
                "name": "Charliee Garcia",
                "donation_details": "₱5000.00",
                "date_donated": "2025-04-09T13:38:36.449972Z"
              },
              {
                "donation_id": "8c860069-21b4-4e95-895e-d6c98bb42e59",
                "name": "Charliee Garcia",
                "donation_details": "₱5000.00",
                "date_donated": "2025-04-09T13:38:36.449972Z"
              },
            ]);
            setVerifiedDonations([
              {
                "donation_id": "3cf6a1a3-933c-4642-8f46-7a73c8344107",
                "date_donated": "2025-04-01T13:50:59.152176Z",
                "name": "Juan Lleva",
                "donation_type": "Monetary",
                "donation_details": "₱8,058.72"
              },
              {
                "donation_id": "a58e857a-71e9-435c-8c70-d576b0aa33fb",
                "date_donated": "2025-03-13T13:50:59.152808Z",
                "name": "Lucas Fernandez",
                "donation_type": "Monetary",
                "donation_details": "₱5,716.75"
              },
              {
                "donation_id": "537f62bc-1b96-4352-a13e-294a6636627e",
                "date_donated": "2025-03-18T13:50:59.152931Z",
                "name": "porting totoy",
                "donation_type": "Monetary",
                "donation_details": "₱9,866.51"
              },
              {
                "donation_id": "544609dc-1951-4e81-b4db-645aebbe07dc",
                "date_donated": "2025-03-12T13:50:59.153022Z",
                "name": "Ethan Cruz",
                "donation_type": "Monetary",
                "donation_details": "₱3,190.92"
              },
              {
                "donation_id": "a5993dc0-9e82-4e04-8829-6ec04ea3b9f6",
                "date_donated": "2025-03-18T13:50:59.152931Z",
                "name": "porting totoy",
                "donation_type": "In-kind",
                "donation_details": "Boxes of canned goods and clothes"
              },
              {
                "donation_id": "bfa9896e-f188-48df-9c60-c29129ce2e53",
                "date_donated": "2025-04-01T13:50:59.152176Z",
                "name": "Juan Lleva",
                "donation_type": "In-kind",
                "donation_details": "Boxes of canned goods and clothes"
              },
              {
                "donation_id": "ecd4a8d5-81b7-43d3-ac08-3e37e307ea3f",
                "date_donated": "2025-03-13T13:50:59.152808Z",
                "name": "Lucas Fernandez",
                "donation_type": "In-kind",
                "donation_details": "Boxes of canned goods and clothes"
              },
              {
                "donation_id": "bdabd07b-9801-4f15-afe2-3ef0d2d5061c",
                "date_donated": "2025-03-12T13:50:59.153022Z",
                "name": "Ethan Cruz",
                "donation_type": "In-kind",
                "donation_details": "Boxes of canned goods and clothes"
              },
              {
                "donation_id": "f40902d6-c7ca-4a7d-b046-57f12179637f",
                "date_donated": "2025-04-02T13:50:59.152511Z",
                "name": "Benjamin Ramirez",
                "donation_type": "In-kind",
                "donation_details": "Boxes of canned goods and clothes"
              },
              {
                "donation_id": "f40902d6-c7ca-4a7d-b046-57f12179637f",
                "date_donated": "2025-04-02T13:50:59.152511Z",
                "name": "Benjamin Ramirez",
                "donation_type": "In-kind",
                "donation_details": "Boxes of canned goods and clothes"
              },
              {
                "donation_id": "f40902d6-c7ca-4a7d-b046-57f12179637f",
                "date_donated": "2025-04-02T13:50:59.152511Z",
                "name": "Benjamin Ramirez",
                "donation_type": "In-kind",
                "donation_details": "Boxes of canned goods and clothes"
              },
              {
                "donation_id": "f40902d6-c7ca-4a7d-b046-57f12179637f",
                "date_donated": "2025-04-02T13:50:59.152511Z",
                "name": "Benjamin Ramirez",
                "donation_type": "In-kind",
                "donation_details": "Boxes of canned goods and clothes"
              },
              {
                "donation_id": "f40902d6-c7ca-4a7d-b046-57f12179637f",
                "date_donated": "2025-04-02T13:50:59.152511Z",
                "name": "Benjamin Ramirez",
                "donation_type": "In-kind",
                "donation_details": "Boxes of canned goods and clothes"
              },
              {
                "donation_id": "f40902d6-c7ca-4a7d-b046-57f12179637f",
                "date_donated": "2025-04-02T13:50:59.152511Z",
                "name": "Benjamin Ramirez",
                "donation_type": "In-kind",
                "donation_details": "Boxes of canned goods and clothes"
              },
              {
                "donation_id": "f40902d6-c7ca-4a7d-b046-57f12179637f",
                "date_donated": "2025-04-02T13:50:59.152511Z",
                "name": "Benjamin Ramirez",
                "donation_type": "In-kind",
                "donation_details": "Boxes of canned goods and clothes"
              },
            ])
        };
    
        fetchData();
      }, []);
  return (
    <div className='flex flex-col lg:p-6 h-screen overflow-hidden max-w-7xl mx-auto'>
        <button className="flex gap-2 mb-3 flex-row items-center cursor-pointer" onClick={() => navigate(-1)}>
            <MoveLeft className='text-primary'/> 
            <p className='text-primary font-satoshi-medium text-lg'>Back to Donations List</p>
        </button>
        <h1 className='font-satoshi-bold text-5xl text-primary'>Help ICS Out</h1>
        <div className='h-1/3 f flex flex-row gap-2 mt-3'>
            <div className='flex-1/3 border border-gray-300 rounded-2xl flex flex-col items-center gap-4 justify-center'>
                <div className='flex flex-col items-center'>
                    <h2 className='font-satoshi-bold text-primary text-5xl'>P 123,456</h2>
                    <p className='font-satoshi-light text-black'>{`Total Raised (Verified)`}</p>
                </div>
                <div className='flex flex-col items-center'>
                    <h2 className='font-satoshi-bold text-primary text-5xl'>P 223,456</h2>
                    <p className='font-satoshi-light text-black'>{`Total Raised (Including Unverified)`}</p>
                </div>
            </div>
            <div className='flex-2/3 border border-gray-300 rounded-2xl p-6 flex flex-col'>
                <h2 className='font-satoshi-medium text-black text-2xl'>Pending Verifications</h2>
                <div className='overflow-auto flex-1'>
                    <PendingDonationsTable data={pendingDonations}/>
                </div>
                <button className='flex gap-2 w-full justify-end text-primary cursor-pointer' onClick={() => {}}> 
                    {/* TODO: Add HELP ICS Donation id navigation */}
                    <p className='font-satoshi-light'> View all pending verifications </p>
                    <MoveRight/>
                </button>
            </div>
        </div>
        <h2 className='font-satoshi-medium text-black text-4xl my-5'>List of Donations</h2>
        <div className=' h-3/5 w-full border border-gray-300 rounded-2xl overflow-auto'>
            <VerifiedDonationsTable data={verifiedDonations}/>
        </div>
    </div>
  )
}

export default AdminHelpIcs
