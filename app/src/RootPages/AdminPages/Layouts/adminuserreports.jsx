import { MoveLeft, CalendarDays, Users, User } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line } from 'recharts'

// Full data
const fullEngagementReport = [
  { date: '1 Oct', visits: 20 },
  { date: '3 Oct', visits: 120 },
  { date: '7 Oct', visits: 160 },
  { date: '10 Oct', visits: 80 },
  { date: '14 Oct', visits: 240 },
  { date: '20 Oct', visits: 320 },
  { date: '23 Oct', visits: 280 },
  { date: '27 Oct', visits: 340 },
  { date: '30 Oct', visits: 200 },
];

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




function AdminEngagementReports() {
  const navigate = useNavigate();
  const [daysFilter, setDaysFilter] = useState(30);
  const [selectedTab, setSelectedTab] = useState(null);

  // Filtered chart data
  const filteredData = fullEngagementReport.slice(-daysFilter);
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
              onChange={(e) => setDaysFilter(Number(e.target.value))}
            >
              <option value={7}>Last 7 days</option>
              <option value={15}>Last 15 days</option>
              <option value={30}>Last 30 days</option>
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
              User visit for the last {daysFilter} days
            </p>
          </div>

          {/* Batch filter */}
          <div className="flex items-center gap-2 ml-auto">
            <label className="text-sm text-gray-700 font-satoshi-bold">Batch:</label>
            <select className="w-36 rounded-md px-2 py-1 shadow-md">
              <option>All</option>
              <option>2022</option>
              <option>2023</option>
              <option>2024</option>
            </select>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={filteredData}>
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
      </div>
        <div className='flex flex-row gap-5'>
            {/* Most Viewed Newsletters */}
            <div className="bg-white rounded-2xl shadow p-6 w-1/2">
                <div className="flex flex-col justify-between  mb-6">
                <div>
                    <h1 className="text-3xl font-satoshi-bold text-black">Most Viewed Newsletters</h1>
                    <p className="text-gray-500 text-sm font-satoshi-light pb-3">Last {daysFilter} Days</p>
                </div>
                    
                </div>

                {/* List of Newsletters */}
                <div className="flex flex-col gap-6">
                {newsletters.map((item, idx) => (
                    <div key={item.id} className="flex gap-4 items-center">
                    <p className="text-primary font-satoshi-medium text-lg">#{item.id}</p>
                    <img className="w-14 h-14 rounded-md bg-gray-300" />
                    <div className="flex flex-col">
                        <p className="text-black font-satoshi-medium">{item.title}</p>
                        <div className="flex gap-2 items-center text-black text-sm mt-1 font-satoshi-medium">
                        <CalendarDays size={20} />
                        <span>{item.date}</span>
                        </div>
                    </div>
                    </div>
                ))}
                </div>

                {/* Footer Link */}
                <div className="text-right mt-6">
                <button className="text-primary font-satoshi-medium cursor-pointer">See Full Report →</button>
                </div>
            </div>

            {/* Most Job offers */}
            <div className="bg-white rounded-2xl shadow p-6 w-1/2">
                <div className="flex flex-col justify-between  mb-6">
                  <div>
                      <h1 className="text-3xl font-satoshi-bold text-black">Job Offers Highlight</h1>
                      <p className="text-gray-500 text-sm font-satoshi-light pb-3">Last {daysFilter} Days</p>
                  </div>
                </div>

                {/* List of Job offers */}
                <div className="flex flex-col gap-6">
                {jobOffers.map((item, idx) => (
                    <div key={item.id} className="flex gap-4 items-center">
                    <p className="text-primary font-satoshi-medium text-lg">#{item.id}</p>
                    <img className="w-14 h-14 rounded-md bg-gray-300" />
                    <div className="flex flex-col">
                        <p className="text-black font-satoshi-medium">{item.title}</p>
                        <div className='flex flex-row gap-5'>
                            <div className="flex gap-2 items-center text-black text-sm mt-1 font-satoshi-medium">
                                <CalendarDays size={20} />
                                <span>{item.date}</span>
                            </div>

                            <div className="flex gap-2 items-center text-black text-sm mt-1 font-satoshi-medium">
                                <Users size={20} />
                                <span>{item.person}</span>
                                <span>person</span>
                            </div>
                        </div>
                    </div>
                    </div>
                ))}
                </div>

                {/* Footer Link */}
                <div className="text-right mt-6">
                <button onClick={goToMostEngagedJob} className="text-primary font-satoshi-medium cursor-pointer">See Full Report →</button>
                </div>
            </div>
        </div>

      
    </div>
  )
}

export default AdminEngagementReports
