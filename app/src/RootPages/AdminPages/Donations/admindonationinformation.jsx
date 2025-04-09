import React, {useState, useEffect} from 'react'
import { MoveLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import VerifiedDonationsTable from "../../../components/AdminComponents/verifieddonationstable"
import PendingDonationsTable from '../../../components/AdminComponents/pendingdonationstable';
import axios from 'axios';

function AdminDonationInformation() {
  const navigate = useNavigate()
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const {driveid} = useParams();

  const [progressData, setProgressData] = useState([
    { name: "progress", value: 20 },
    { name: "remaining", value: 80 },
  ]);

  const [pendingDonations, setPendingDonations] = useState([])
  const [verifiedDonations, setverifiedDonations] = useState([])
  const [isClosed, setIsClosed] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
    //  const response = await axios.get(`${API_BASE_URL}/admin/donations/${driveid}`)
    //  console.log(response.data)   

        setProgressData([
          { name: "progress", value: 20 },
          { name: "remaining", value: 80 },
        ]);
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
          }
        ]);
        setverifiedDonations([
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
          }
        ])
    };

    fetchData();
  }, []);

  const percent = 20;

  const COLORS = ["#0B2B8C", "#F4F4F4"];

  return (
    <div className='flex flex-col lg:p-6 h-screen overflow-hidden max-w-7xl mx-auto'>
      {/* Back */}
      <button className="flex gap-2 mb-3 flex-row items-center cursor-pointer" onClick={() => navigate(-1)}>
        <MoveLeft className='text-primary'/> 
        <p className='text-primary font-satoshi-medium text-lg'>Back to Donations List</p>
      </button>
      {/* Donation name and tag */}
      <div className='flex flex-row justify-between mb-5'>
        <div className='flex flex-row gap-2'>
          <h1 className='font-satoshi-bold text-primary text-4xl'>ICS New Aircon</h1>
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
        <div className='h-full gap-5 flex flex-row'>
          {/* View Details */}
          <button className='bg-primary text-white px-7 py-2 shadow-lg rounded-2xl hover:bg-hover cursor-pointer'>
            <p className='font-satoshi-light'>View Details</p>
          </button>
          {isClosed ? (
            <>
              {/* Export Donor List */}
              <button className='bg-primary text-white px-7 py-2 shadow-lg rounded-2xl cursor-pointer'>
                <p className='font-satoshi-light'>Export Donor List</p>
              </button>
            </>          
          ) : (
            <>
              {/* Close Drive */}
              <button className='bg-error text-white px-7 py-2 shadow-lg rounded-2xl cursor-pointer'>
                <p className='font-satoshi-light'>Close Drive</p>
              </button>
            </>
          )}
        </div>
      </div>
      {/* Goal progress and recent transactions */}
      <div className='flex flex-row gap-2 h-1/3 mb-9'>
        {/* Goal Progress */}
        <div className='flex flex-col items-center justify-center flex-1/3 pb-10 border border-gray-300 rounded-xl'>
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
            <p className="text-6xl font-bold text-[#1F2A63] font-satoshi-bold">{percent}%</p>
          </div>

          {/* <div className="flex  border justify-between w-full text-sm text-[#1F2A63] mt-2 px-4">
            <span>₱0</span>
            <span>₱{goal.toLocaleString()}</span>
          </div> */}

          {/* <div className="flex items-center gap-2 mt-2 text-sm text-[#1F2A63]">
            <div className="w-3 h-3 rounded-full bg-[#4F75FF]" />
            <span>
              Final Amount: <strong>₱{actual.toLocaleString()}</strong>
            </span>
          </div> */}
        </div>
        {/* Pending donations table */}
        <div className='flex-2/3 border border-gray-300 rounded-xl p-6 w-full flex flex-col'>
          <h2 className='font-satoshi-medium text-black text-2xl'>Pending Verification</h2>
          <div className='w-full flex-1 overflow-auto'>
            <PendingDonationsTable data={pendingDonations} />
          </div>
        </div>
      </div>
      {/* Donations and filters */}
      <div className='mb-3'>
        <div className='flex items-end'>
          <h2 className='text-4xl font-satoshi-bold'>Donations</h2>
          <p className='text-lg font-satoshi-light'>/Verified</p>
        </div>
      </div>
      {/* Verified Donations Table */}
      <div className='border border-gray-300 rounded-xl p-6 flex-1 hidden lg:block overflow-auto'>
        <VerifiedDonationsTable data={verifiedDonations}/>
      </div>
    </div>
  )
}

export default AdminDonationInformation