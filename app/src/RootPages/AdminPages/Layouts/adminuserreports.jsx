import axios from 'axios';
import { MoveLeft, CalendarDays, Users, User } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line } from 'recharts'
import CircularLoading from '../../../components/LoadingComponents/circularloading';

// Full data
// const fullEngagementReport = [
//   { date: '1 Oct', visits: 20 },
//   { date: '3 Oct', visits: 120 },
//   { date: '7 Oct', visits: 160 },
//   { date: '10 Oct', visits: 80 },
//   { date: '14 Oct', visits: 240 },
//   { date: '20 Oct', visits: 320 },
//   { date: '23 Oct', visits: 280 },
//   { date: '27 Oct', visits: 340 },
//   { date: '30 Oct', visits: 200 },
// ];

// Sample newsletter data
const newsletters = [
  { id: 1, title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", date: "01/01/25" },
  { id: 2, title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", date: "01/01/25" },
  { id: 3, title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", date: "01/01/25" },
];

// Sample job offers data
const jobOffers = [
  { id: 1, title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", date: "01/01/25", person: 1 },
  { id: 2, title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", date: "01/01/25", person: 1 },
  { id: 3, title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", date: "01/01/25", person: 1 },
];

const donation = {name: "Hey bro", currentRaised: 70000, maxAmount: 100000, date: "01/01/25", people: 1800}




function AdminEngagementReports() {
  const navigate = useNavigate();
  const [daysFilter, setDaysFilter] = useState("30days");
  const [batchFilter, setBatchFilter] = useState("2022");
  const [selectedTab, setSelectedTab] = useState(null);

  const [fullEngagementReport, setFullEngagementReport] = useState(null);
  const [fullEngagementReportLoading, setFullEngagementReportLoading] = useState(false);

  const [mostDonations, setMostDonations] = useState([]);
  // TODO: Add loading

  const [mostInterested, setMostInterested] = useState([]);
  const [mostInterestedLoading, setMostInterestedLoading] = useState(false);

  const [donationHighlights, setDonationHighlights] = useState({});
  const [donorHighlights, setDonorHighlights] = useState({});
  const [donationtLoading, setDonationLoading] = useState(false);
  const [donorLoadinhg, setDonorLoading] = useState(false);

  const [recentNewsLetters, setRecentLetters] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);

  // BASE URL ENV
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      setFullEngagementReportLoading(true);
  
      try {
        // First request: Engagement Statistics
        let response = await axios.get(`${API_BASE_URL}/admin/engagement-statistics/visits?time_range=${daysFilter}${batchFilter !== 0 ? `&batch=${batchFilter}` : ''}`);
        console.log(response.data);
        setFullEngagementReport(response.data);
  
        // Second request: Most Donations
        response = await axios.get(`${API_BASE_URL}/admin/engagement-statistics/donation-drives/top-3-donors?time_range=${daysFilter}`);
        console.log(response.data);
        setMostDonations(response.data);
  
        // Third request: Most Interested (Jobs)
        setMostInterestedLoading(true);
        response = await axios.get(`${API_BASE_URL}/admin/engagement-statistics/jobs/top-3-interested?time_range=${daysFilter}`);
        console.log(response.data);
        setMostInterested(response.data);
        setMostInterestedLoading(false);
  
        // Fourth request: Recent Newsletters
        setNewsLoading(true);
        response = await axios.get(`${API_BASE_URL}/admin/engagement-statistics/newsletters/top-3?time_range=${daysFilter}`);
        console.log(response.data);
        setRecentLetters(response.data);
        setNewsLoading(false);
  
        // Fifth request: Donation Highlights
        setDonationLoading(true);
        response = await axios.get(`${API_BASE_URL}/admin/engagement-statistics/donation-drives/most-donations?time_range=${daysFilter}`);
        if (response.status !== 404) {
          console.log("donation", response.data);
          setDonationHighlights(response.data);
        }
        setDonationLoading(false);
  
        // Sixth request: Donor Highlights
        setDonorLoading(true);
        response = await axios.get(`${API_BASE_URL}/admin/engagement-statistics/donation-drives/most-donors?time_range=${daysFilter}`);
        if (response.status !== 404) {
          console.log(response.data);
          setDonorHighlights(response.data);
        }
        setDonorLoading(false);
  
        setFullEngagementReportLoading(false);
      } catch (err) {
        console.log(err.message || 'Something went wrong');
        setFullEngagementReportLoading(false);
        setMostInterestedLoading(false);
        setNewsLoading(false);
        setDonationLoading(false);
        setDonorLoading(false);
      }
    };
  
    fetchData();
  }, [daysFilter, batchFilter]);
  

  // Filtered chart data
  // const filteredData = fullEngagementReport.slice(-daysFilter);
  const goToMostEngagedJob = () =>{
    navigate('most-engaged-job-offers', { relative: 'path' });
  }
  return (
    <div className="bg-[rgb(243,241,244)] p-6 min-h-screen">
      {/* Back Link */}
      <div className="flex items-center mb-6 cursor-pointer" onClick={() => navigate(-1)}>
        <MoveLeft className="text-primary" />
        <p className="text-primary font-satoshi-medium text-lg ml-2 ">Back to Dashboard</p>
      </div>

      {/* Filters Row */}
      <div className="flex justify-between items-center mb-4">
        <div></div> {/* Empty div to push filters to the right */}
        <div className="flex items-center gap-4">
          {/* Date filter */}
          <div>
            <select
              className="rounded-md px-2 py-1 shadow-sm font-satoshi-medium w-40"
              value={daysFilter}
              onChange={(e) => setDaysFilter(e.target.value)}
            >
              <option value={"7days"}>Last 7 days</option>
              <option value={"30days"}>Last 30 days</option>
              <option value={"year"}>Last year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Chart Card */}
      <div className="bg-white rounded-2xl shadow p-6 mb-8">
        <div className='flex flex-row'>
          <div className='flex flex-col pb-5'>
            <h1 className="text-3xl font-satoshi-bold text-black">Site Visits</h1>
              <p className="text-gray-500 text-sm font-satoshi-light">
                User visit for the last {daysFilter === "7days" ? "7 days" : daysFilter === "year" ? "365 days" : daysFilter === "30days" ? "30 days" : daysFilter}
              </p>
          </div>

          {/* Batch filter */}
          <div className="flex items-center gap-2 ml-auto">
            <label className="text-sm text-gray-700 font-satoshi-bold">Batch:</label>
            <select className="w-36 rounded-md px-2 py-1 shadow-md" onChange={(e) => setBatchFilter(e.target.value)}>
              <option value={0}>All</option>
              {/* <option>All</option> */}
              {Array.from({ length: 51 }, (_, i) => 1975 + i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

          </div>
        </div>
        {fullEngagementReportLoading ? (
          <CircularLoading />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={fullEngagementReport}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fontFamily: 'Satoshi-Light, sans-serif' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fontFamily: 'Satoshi-Light, sans-serif' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E1B39',
                  borderRadius: '8px',
                  color: 'white',
                  border: 'none',
                }}
                labelStyle={{ color: 'white', fontSize: 12 }}
                itemStyle={{ color: 'white', fontSize: 14 }}
              />
              <Line type="linear" dataKey="visits" stroke="#0B2B6F" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        )}

      </div>
      <div className='flex md:flex-row flex-col gap-5'>
          {/* Most Donations */}
          <div className="bg-white rounded-2xl shadow p-6 md:w-1/2">
              <div className="flex flex-col justify-between  mb-6">
              <div>
                  <h1 className="text-3xl font-satoshi-bold text-black">Most Recent Newsletters</h1>
                  <p className="text-gray-500 text-sm font-satoshi-light pb-3"> Last {daysFilter === "7days" ? "7 days" : daysFilter === "year" ? "365 days" : daysFilter === "30days" ? "30 days" : daysFilter}</p>
              </div>
                  
              </div>

              {/* List of Newsletters */}
              <div className="flex flex-col gap-6">
                {newsLoading ? (
                  <CircularLoading />
                ) : (
                recentNewsLetters.map((item, idx) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <p className="text-primary font-satoshi-medium text-lg">#{idx+1}</p>
                      <img src={item.image} className="w-14 h-14 rounded-md bg-gray-300" />
                      <div className="flex flex-col">
                          <h1 className="text-black font-satoshi-bold text-lg">{item.title}</h1>
                          <div className="flex gap-2 items-center text-black text-sm mt-1 font-satoshi-medium">
                                <div className="flex gap-2 items-center text-black text-sm mt-1 font-satoshi-medium">
                                    <CalendarDays size={20} />
                                    <span>{item.date}</span>
                                </div>
                          </div>
                          
                      </div>
                    </div>
                )))}
              </div>

             
          </div>

          {/* Most Job offers */}
          <div className="bg-white rounded-2xl shadow p-6 md:w-1/2">
              <div className="flex flex-col justify-between  mb-6">
                <div>
                    <h1 className="text-3xl font-satoshi-bold text-black">Job Offers Highlight</h1>
                    <p className="text-gray-500 text-sm font-satoshi-light pb-3">Last {daysFilter === "7days" ? "7 days" : daysFilter === "year" ? "365 days" : daysFilter === "30days" ? "30 days" : daysFilter}</p>
                </div>
              </div>

              {/* List of Job offers */}
              <div className="flex flex-col gap-6">
                {mostInterestedLoading ? (
                  <CircularLoading />
                ) : (
                mostInterested.map((item, idx) => (
                    <div key={item.id} className="flex gap-4 items-center">
                    <p className="text-primary font-satoshi-medium text-lg">#{idx+1}</p>
                    <img src={item.image} className="w-14 h-14 rounded-md bg-gray-300" />
                    <div className="flex flex-col">
                        <h1 className="text-black font-satoshi-bold text-lg">{item.title}</h1>
                        <h1 className="text-black font-satoshi-regular text-md">{item.company}</h1>
                        <div className='flex flex-row gap-5'>
                            <div className="flex gap-2 items-center text-black text-sm mt-1 font-satoshi-medium">
                                <CalendarDays size={20} />
                                <span>{item.date_posted}</span>
                            </div>

                            <div className="flex gap-2 items-center text-black text-sm mt-1 font-satoshi-medium">
                                <Users size={20} />
                                <span>{item.interested_count}</span>
                                <span>person</span>
                            </div>
                        </div>
                    </div>
                    </div>
                )))}
              </div>

              {/* Footer Link */}
              <div className="text-right mt-6">
              <button onClick={goToMostEngagedJob} className="text-primary font-satoshi-medium cursor-pointer">See Full Report →</button>
              </div>
          </div>
          
      </div>
      {/* Donations Highlights */}
  <div className="bg-white rounded-2xl shadow p-6 mt-8">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col">
        <h1 className="text-3xl font-satoshi-bold text-black">Donations Highlights</h1>
        <p className="text-gray-500 text-sm font-satoshi-light">
          User donations for the last {daysFilter === "7days" ? "7 days" : daysFilter === "year" ? "365 days" : daysFilter === "30days" ? "30 days" : daysFilter}
        </p>
      </div>
      <div className="mt-4 md:mt-0">
        <button className="text-primary font-satoshi-medium cursor-pointer">
          See Full Report →
        </button>
      </div>
    </div>

    {/* Two Donation Cards */}
    <div className="flex flex-col md:flex-row gap-6 mt-8">
      {/* Highest Amount Donated */}
      
      <div className="flex flex-col items-center justify-center  rounded-2xl p-6 w-full md:w-1/2">
        {donationtLoading ? (
          <CircularLoading />
        ) : (
        <div className='flex flex-row gap-5'>
          <div className="relative w-40 h-40 mb-4">
            <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 36 36">
              <path
                className="text-gray-200 stroke-current"
                strokeWidth="8"  
                fill="none"
                d="M18 5
                  a 13 13 0 0 1 0 26
                  a 13 13 0 0 1 0 -26"
              />
              <path
                className="text-primary stroke-current"
                strokeWidth="8"  
                fill="none"
                strokeDasharray={`${donationHighlights.percentage_progress}, 100`}
                d="M18 5
                  a 13 13 0 0 1 0 26
                  a 13 13 0 0 1 0 -26"

              />

              
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className='flex flex-col items-center'>
                <span className="text-lg font-satoshi-bold">{Math.ceil(donationHighlights.percentage_progress)} %</span>
                <h1 className='font-satoshi-regular text-xs'>Reached</h1>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm text-black mb-2 font-satoshi-medium">Highest Amount of Donators</p>
            <h2 className="text-3xl font-satoshi-bold text-black mb-2">{donationHighlights.title}</h2>
              <div className="flex items-center gap-2 text-sm text-black">
                <Users size={16} />
                <span>{donationHighlights.donor_count} people donated</span>
              </div>
            <p className="text-primary font-satoshi-bold mt-2">₱ {donationHighlights.amount_gathered} / ₱ {donationHighlights.target_cost} raised</p>
          </div>
        </div>)}
      </div> 

      {/* Highest Amount of Donators */}
      <div className="flex flex-col items-center justify-center rounded-2xl p-6 w-full md:w-1/2">
        {donorLoadinhg ? (
          <CircularLoading />
        ) : (
        <div className='flex flex-row gap-5'>
          <div className="relative w-40 h-40 mb-4">
          <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 36 36">
            {/* Gray unfilled circle */}
            <path
                className="text-gray-200 stroke-current"
                strokeWidth="8"  
                fill="none"
                d="M18 5
                  a 13 13 0 0 1 0 26
                  a 13 13 0 0 1 0 -26"
              />
              <path
                className="text-primary stroke-current"
                strokeWidth="8"  
                fill="none"
                strokeDasharray={`${donorHighlights.percentage_progress}, 100`}
                d="M18 5
                  a 13 13 0 0 1 0 26
                  a 13 13 0 0 1 0 -26"

              />
          </svg>


            <div className="absolute inset-0 flex items-center justify-center">
              <div className='flex flex-col items-center'>
                <span className="text-lg font-satoshi-bold">{Math.ceil(donorHighlights.percentage_progress)} %</span>
                <h1 className='font-satoshi-regular text-xs'>Reached</h1>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm text-black mb-2 font-satoshi-medium">Highest Amount of Donators</p>
            <h2 className="text-3xl font-satoshi-bold text-black mb-2">{donorHighlights.title}</h2>
              <div className="flex items-center gap-2 text-sm text-black">
                <Users size={16} />
                <span>{donorHighlights.donor_count} people donated</span>
              </div>
            <p className="text-primary font-satoshi-bold mt-2">₱{donorHighlights.amount_gathered} / ₱{donorHighlights.target_cost} raised</p>
          </div>
        </div>)}
      </div>
    </div>
  </div>
        
      
    </div>
  )
}

export default AdminEngagementReports
