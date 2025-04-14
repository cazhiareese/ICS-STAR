import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {MoveLeft} from 'lucide-react'
import { PieChart, ResponsiveContainer, Pie, Cell, Tooltip } from 'recharts'

function AdminDonationDriveDemographics() {
  const navigate = useNavigate()
  const [donorsByBatch, setDonorsByBatch] = useState([])
  const [amountByBatch, setAmountByBatch] = useState([])
  const [donationTypeData, setDonationTypeData] = useState([])
  
  useEffect(() => {
    setDonorsByBatch([
      { batch: "2022", donors: 60 },
      { batch: "2010", donors: 20 },
      { batch: "2011", donors: 10 },
      { batch: "Others", donors: 10 }
    ])
    setAmountByBatch([
      { batch: "2022", amount: 60000 },
      { batch: "2010", amount: 20000 },
      { batch: "2011", amount: 10000 },
      { batch: "Others", amount: 10000 }
    ])
    setDonationTypeData([
      { type: "Monetary", amount: 50 },
      { type: "In-Kind", amount: 50 },
    ])
  }, [])
  
  const COLORS = ['#0a3d91', '#5a78c8', '#a3b9ec', '#d8e4fa'];

  return (
    <div className='p-6 flex flex-col h-screen overflow-hidden'>
      <button className="flex gap-2 mb-3 flex-row items-center cursor-pointer" onClick={() => navigate(-1)}>
        <MoveLeft className='text-primary'/> 
        <p className='text-primary font-satoshi-medium text-lg'>Back to Donations List</p>
      </button>
      {/* Donor Demographics */}
      <h1 className='text-4xl font-satoshi-bold mb-3'>Donor Demographics</h1>
      <div className='flex flex-row border border-gray-300 rounded-2xl p-4 flex-1 w-full'>
      {/* Donors' Batch Breakdown */}
        <div className='flex-1 h-full w-full flex flex-col'>
          <h2 className='font-satoshi-medium text-lg '>Donors' Batch Breakdown</h2>
          <div className='h-full w-full flex flex-row'>
            <div className='flex-1'>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donorsByBatch}
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    dataKey="donors"
                    stroke="none"
                    >
                    {donorsByBatch.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [`${value} Donors`, `Batch ${props.payload.batch}`]}
                    cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className='flex justify-center flex-col'>
              {donorsByBatch.map((entry, index) => (
                <div key={index} className="flex items-center gap-2 text-sm font-satoshi-regular">
                  <div className="w-4 h-4" style={{ backgroundColor: COLORS[index] }} />
                  <p className="">
                      Batch {entry.batch}: {entry.donors} Donors
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Divider */}
        <div className='border-l border-gray-300 mx-4'></div>
        {/* Monetary Amount Donated per Batch */}
        <div className='flex-1 h-full w-full flex flex-col'>
          <h2 className='font-satoshi-medium text-lg '>Monetary Amount Donated per Batch</h2>
          <div className='h-full w-full flex flex-row'>
            <div className='flex-1'>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={amountByBatch}
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    dataKey="amount"
                    stroke="none"
                    >
                    {amountByBatch.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [`${value}`, `Batch ${props.payload.batch}`]}
                    cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className='flex justify-center flex-col'>
              {amountByBatch.map((entry, index) => (
                <div key={index} className="flex items-center gap-2 text-sm font-satoshi-regular">
                  <div className="w-4 h-4" style={{ backgroundColor: COLORS[index] }} />
                  <p className="">
                      Batch {entry.batch}: {entry.amount}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Donation Statistics */}
      <h1 className='font-satoshi-bold text-4xl'>Donation Statistics</h1>
      {/* In-Kind vs Monetary Donation Count and Amount Generated over time */}
      <div className='flex flex-row border border-gray-300 rounded-2xl p-4 flex-1 w-full'>
        {/* In kind vs monetary */}
        <div className='flex flex-col flex-1'>
          <h2 className='font-satoshi-medium text-lg '>In-Kind vs Monetary Donation Count</h2>
          <div className='h-full w-full flex flex-row'>
          <div className='flex-1'>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donationTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    dataKey="amount"
                    stroke="none"
                    >
                    {donationTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [`${value}%`, props.payload.type]}
                    cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className='flex justify-center flex-col'>
              {donationTypeData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2 text-sm font-satoshi-regular">
                  <div className="w-4 h-4" style={{ backgroundColor: COLORS[index] }} />
                  <p className=""> {entry.type}: {entry.amount} </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='flex-1 border'></div>
      </div>
    </div>
  )
}

export default AdminDonationDriveDemographics
