import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { MoveLeft } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

function AdminBatchInformation() {
    const navigate = useNavigate()

    const [years, setYears] = useState([
      "2022", "2021", "2020"
    ])

    const [employmentData, setEmploymentData]  = useState([
      { name: 'Employed', value: 78 },
      { name: 'Self-Employed', value: 25 },
      { name: 'Unemployed', value: 10 },
      { name: 'Unemployed with no previous work experience', value: 5 },
    ])

    const [unemploymentData, setUnemploymentData]  = useState([
      { name: 'Cannot Work at Present', value: 25 },
      { name: 'Pursuing Studies', value: 25 },
      { name: 'Undergoing training', value: 25 },
      { name: 'Still looking for work', value: 25 },
    ])

    const [selectedYear, setSelectedYear] = useState()
    const [batchTotalCount, setBatchTotalCount] = useState(100)
    const [batchActiveCount, setBatchActiveCount] = useState(80)
    const [batchActivePercentage, setBatchActivePercentage] = useState(80)
    const [batchInactiveCount, setBatchInactiveCount] = useState(20)
    const [batchInactivePercentage, setBatchInactivePercentage] = useState(20)

    const [statsOrUser, setStatsOrUser] = useState('stats')

    const COLORS = ['#0a3d91', '#5a78c8', '#a3b9ec', '#d8e4fa'];

    return (
    <div className='py-6 px-25 overflow-auto max-h-screen'>
      {/* Back */}
        <button className="flex gap-2 mb-3 flex-row items-center cursor-pointer" onClick={() => navigate(-1)}>
        <MoveLeft className='text-primary'/> 
        <p className='text-primary font-satoshi-medium text-lg'>Back</p>
      </button>
      <div className='flex flex-col'>
        <h2 className='font-satoshi-bold text-2xl text-primary'> Batch Information </h2>
        {/* Batch and count */}
        <div className='flex flex-row justify-between'>
          {/* Batch selector */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="block w-fit px-4 py-2 text-2xl border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black font-satoshi-bold"
          >
            <option value="" disabled>Select a year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                Batch {year}
              </option>
            ))}
          </select>
          {/* Count, active, inactive */}
          <div className='flex flex-row gap-15'>
            {/* Total count */}
            <div className='flex flex-col items-center'>
              <p className='font-satoshi-bold text-3xl'> {batchTotalCount} </p>
              <p className='font-satoshi-light text-sm text-primary'> Total Count</p>
            </div>
            <div className='flex flex-col items-center'>
              <p className='font-satoshi-bold text-3xl'> {batchActiveCount} <span className='text-xl text-gray-400'> ({batchActivePercentage}%) </span> </p>
              <p className='font-satoshi-light text-sm text-primary'> Active </p>
            </div>
            <div className='flex flex-col items-center'>
              <p className='font-satoshi-bold text-3xl'> {batchInactiveCount} <span className='text-xl text-gray-400'>({batchInactivePercentage}%)</span> </p>
              <p className='font-satoshi-light text-sm text-primary'> Inactive </p>
            </div>
          </div>
        </div>
        {/* Selector */}
        <div>
          <div className='w-full lg:w-auto  min-w-xs'>
            {/* Alumni button */}
            <button className={`px-12 py-3 cursor-pointer border-b-3 w-1/2 lg:w-auto ${statsOrUser === 'stats' ? 'border-primary' : 'border-transparent'}`} onClick={() => setStatsOrUser('stats')}>
              <p className={`text-black font-satoshi-light text-md ${statsOrUser === 'stats' ? 'text-primary font-satoshi-medium' : ''}`}> Statistics </p>
            </button>
            {/* Student button */}
            <button className={`px-12 py-3 cursor-pointer border-b-3 w-1/2 lg:w-auto ${statsOrUser === 'users' ? 'border-primary' : 'border-transparent'}`} onClick={() => setStatsOrUser('users')}>
            <p className={`text-black font-satoshi-light text-md ${statsOrUser === 'users' ? 'text-primary font-satoshi-medium' : ''}`}> User List </p>
            </button>
            {/* For the underline */}
            <div className='border-b-1 border-gray-300 flex-1'></div>
          </div>
        </div>
        {/* Statistics */}
        <div className='flex flex-col gap-2 mt-2'>
          {/* Employment Status */}
          <div className='border border-gray-300 w-full h-80 shadow-lg rounded-xl p-6'>
            <h2 className='font-satoshi-bold text-xl'> Employment Status </h2>
            <div className='flex flex-row h-full'>
              {/* Pie chart */}
              <div className="h-full flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={employmentData}
                      cx="50%"
                      cy="50%"
                      outerRadius="80%"
                      dataKey="value"
                      stroke="none"
                      >
                      {employmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Legend */}
              <div className="flex flex-col flex-1 text-xl gap-2 justify-center">
                {employmentData.map((entry, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index] }}
                      ></span>
                    <span>
                      {entry.name}
                      <span className="text-[#0a3d91] ml-1">({entry.value}%)</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Reason for unemployment */}
          <div className='border border-gray-300 w-full h-80 shadow-lg rounded-xl p-6'>
            <h2 className='font-satoshi-bold text-xl'> Employment Status </h2>
            <div className='flex flex-row h-full'>
              {/* Pie chart */}
              <div className="h-full flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={unemploymentData}
                      cx="50%"
                      cy="50%"
                      outerRadius="80%"
                      dataKey="value"
                      stroke="none"
                      >
                      {unemploymentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Legend */}
              <div className="flex flex-col flex-1 text-xl gap-2 justify-center">
                {unemploymentData.map((entry, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index] }}
                      ></span>
                    <span>
                      {entry.name}
                      <span className="text-[#0a3d91] ml-1">({entry.value}%)</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Brief statistics divider */}
          <div className='w-full flex flex-row items-center'>
            <h3 className='font-satoshi-medium text-xl'> Brief Statistics </h3>
            <div className='border-t-1 flex-1 ml-2 border-gray-300'></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminBatchInformation
