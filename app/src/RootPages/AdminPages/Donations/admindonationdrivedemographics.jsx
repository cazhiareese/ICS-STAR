import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {MoveLeft} from 'lucide-react'
import { PieChart, ResponsiveContainer, Pie, Cell, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid} from 'recharts'
import axios  from 'axios'
function AdminDonationDriveDemographics() {
  const {driveid} = useParams()
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate()
  const [donorsByBatch, setDonorsByBatch] = useState([])
  const [amountByBatch, setAmountByBatch] = useState([])
  const [donationTypeData, setDonationTypeData] = useState([])
  const [amountTimeData, setAmountTimeData] = useState([])
  
  useEffect(() => {
    setDonorsByBatch([
      // { batch: "2022", donors: 60 },
      // { batch: "2010", donors: 20 },
      // { batch: "2011", donors: 10 },
      // { batch: "Others", donors: 10 }
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
    setAmountTimeData([
      { date: '01/01', amount: 84 },
      { date: '01/07', amount: 67 },
      { date: '01/14', amount: 25 },
      { date: '01/21', amount: 87 },
      { date: '01/28', amount: 44 },
      { date: '2/04', amount: 12 },
      { date: '2/11', amount: 12 },
      { date: '2/14', amount: 10 },
      { date: '2/21', amount: 27 },
      { date: '2/28', amount: 77 },
      { date: '3/07', amount: 88 },
    ])
  }, [])

  useEffect(()=>{

    const fetchData = async () => {
      try{
        const getDonorsbyBatch = await axios.get(`${API_BASE_URL}/admin/donations/drive-donor-counts?drive_id=${driveid}`);
        console.log(getDonorsbyBatch.data.top_3)
        setDonorsByBatch(getDonorsbyBatch.data.top_3)
    }catch (error){
      console.log(error)
      setDonorsByBatch([])
    }

    try{
        const getAmountByBatch = await axios.get(`${API_BASE_URL}/admin/donations/top-monetary-donors?drive_id=${driveid}`)
        setAmountByBatch(getAmountByBatch.data.top_3)

    }catch(error){
      setAmountByBatch([])
    }

    try{
      const getDonationTypeData = await axios.get(`${API_BASE_URL}/admin/donations/donation-totals?drive_id=${driveid}`)
      // console.log(getDonationTypeData.data)
      setDonationTypeData(getDonationTypeData.data.slice(0,2))
    }catch (error){

    }

    try{
      const getAmountTimeData = await axios.get(`${API_BASE_URL}/admin/donations/weekly-amounts?drive_id=${driveid}`)
      setAmountTimeData(getAmountTimeData.data)

  }catch(error){
    setAmountTimeData([])
  }
    }
    fetchData();
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
                    dataKey="total_donors"
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
                      Batch {entry.batch}: {entry.total_donors} Donors
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
                    dataKey="total_amount"
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
                      Batch {entry.batch}: {entry.total_amount}
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
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donationTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    dataKey="count"
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
              <div className='flex justify-center flex-col w-1/2'>
              {donationTypeData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2 text-sm font-satoshi-regular">
                  <div className="w-4 h-4" style={{ backgroundColor: COLORS[index] }} />
                  <p className=""> {entry.name}: {entry.percentage} </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='flex-1 flex flex-col'>
          <h2 className='font-satoshi-medium text-lg'>Amount Generated over Time</h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={amountTimeData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip></Tooltip>
              <Line
                type="monotone"
                dataKey="amount_in_thousands"
                stroke="#007bff"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default AdminDonationDriveDemographics
