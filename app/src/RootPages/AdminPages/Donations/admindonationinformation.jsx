import React, {useState, useEffect} from 'react'
import { MoveLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import VerifiedDonationsTable from "../../../components/AdminComponents/verifieddonationstable"
import PendingDonationsTable from '../../../components/AdminComponents/pendingdonationstable';

function AdminDonationInformation() {
  const navigate = useNavigate()

  const [progressData, setProgressData] = useState([
    { name: "progress", value: 20 },
    { name: "remaining", value: 80 },
  ]);

  const [pendingDonations, setPendingDonations] = useState([])
  const [verifiedDonations, setverifiedDonations] = useState([])

  useEffect(() => {
    const fetchData = () => {
        setProgressData([
          { name: "progress", value: 20 },
          { name: "remaining", value: 80 },
        ]);
        setPendingDonations([
          { date: "1/23/25 1:00 PM", donor: "Lorem Ipsum", details: "₱1,000.00" },
          { date: "1/23/25 1:00 PM", donor: "Lorem Ipsum", details: "Donation details here..." },
          { date: "1/23/25 1:00 PM", donor: "Lorem Ipsum", details: "Donation details here..." },
          { date: "1/23/25 1:00 PM", donor: "Lorem Ipsum", details: "₱1,000.00" },
          { date: "1/23/25 1:00 PM", donor: "Lorem Ipsum", details: "₱1,000.00" },
          { date: "1/23/25 1:00 PM", donor: "Lorem Ipsum", details: "₱1,000.00" },
          { date: "1/23/25 1:00 PM", donor: "Lorem Ipsum", details: "₱1,000.00" },
          { date: "1/23/25 1:00 PM", donor: "Lorem Ipsum", details: "Donation details here..." },
        ]);
        setverifiedDonations([
          {
            "date_donated": "2025-04-01",
            "name": "Alice Reyes",
            "donation_type": "Cash",
            "donation_details": 5000
          },
          {
            "date_donated": "2025-04-03",
            "name": "Carlos Dela Cruz",
            "donation_type": "Cash",
            "donation_details": 2000
          },
          {
            "date_donated": "2025-04-05",
            "name": "Bea Santos",
            "donation_type": "Cash",
            "donation_details": 4500
          },
          {
            "date_donated": "2025-04-07",
            "name": "Daniel Ong",
            "donation_type": "Cash",
            "donation_details": 1000
          },
          {
            "date_donated": "2025-04-08",
            "name": "Janelle Lim",
            "donation_type": "Cash",
            "donation_details": 1500
          },
          {
            "date_donated": "2025-04-08",
            "name": "Janelle Lim",
            "donation_type": "Cash",
            "donation_details": 1500
          },
          {
            "date_donated": "2025-04-08",
            "name": "Janelle Lim",
            "donation_type": "Cash",
            "donation_details": 1500
          },
          {
            "date_donated": "2025-04-08",
            "name": "Janelle Lim",
            "donation_type": "Cash",
            "donation_details": 1500
          },
          {
            "date_donated": "2025-04-08",
            "name": "Janelle Lim",
            "donation_type": "Cash",
            "donation_details": 1500
          },
          {
            "date_donated": "2025-04-08",
            "name": "Janelle Lim",
            "donation_type": "Cash",
            "donation_details": 1500
          },
          {
            "date_donated": "2025-04-08",
            "name": "Janelle Lim",
            "donation_type": "Cash",
            "donation_details": 1500
          },
        ]
        )
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
        <h1 className='font-satoshi-bold text-primary text-4xl'>ICS New Aircon</h1>
        {/* Generate Report or close drive */}
        <button className='bg-error text-white px-7 shadow-lg rounded-2xl'>
          <p className='font-satoshi-light'>Close Drive</p>
        </button>
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