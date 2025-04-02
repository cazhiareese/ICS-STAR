import React, { useState } from 'react'
import { MoveLeft, MoveRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import {PieChart, Pie, Cell, ResponsiveContainer} from 'recharts'

function AdminUserInformationReport() {
  const navigate = useNavigate();

  const cardDesign = "bg-white drop-shadow-sm rounded-2xl p-4 w-full";
  const totalAlumni = 1375;
  const activePercentage = 23;
  const inactivePercentage = 77;
  const [batchPage, setBatchPage] = useState(1)
  const [totalBatchPages, setTotalBatchPages] = useState(20)

  const alumniData = [
    { name: "Active", value: activePercentage },
    { name: "Inactive", value: inactivePercentage },
  ];

  const batchData = [
    { batch: 2022, count: 172, active: 80, inactive: 22 },
    { batch: 2019, count: 102, active: 80, inactive: 22 },
    { batch: 2018, count: 101, active: 80, inactive: 22 },
    { batch: 2022, count: 99, active: 80, inactive: 22 },
    { batch: 2022, count: 99, active: 80, inactive: 22 },
  ];

  const COLORS = ["#1E3A8A", "#F3F4F6"]; // Blue for Active, Grey for Inactive

  return (
    <div className='bg-[rgb(243,241,244)] p-6 max-h-screen flex flex-col overflow-auto'>
      <div className='flex gap-2 mb-5'>
        <button className="flex flex-row gap-4 items-center cursor-pointer" onClick={() => navigate(-1)}>
            <MoveLeft className='text-primary'/> 
            <p className='text-primary font-satoshi-medium text-lg'>Back to dashboard</p>
        </button>
      </div>
      <h1 className='font-satoshi-bold text-black text-3xl mb-4'>User Information Reports</h1>
      <div className={`grid grid-cols-2 grid-rows-[17rem_2rem_15rem_15rem] gap-8 flex-1`}>
        {/* Total Alumni */}
        <div className={`${cardDesign} row-start-1 col-start-1 flex items-center justify-center`}> 
          <div className="relative w-full max-w-[300px] h-[150px] mx-auto">
            {/* Pie Chart */}
            <ResponsiveContainer className="" width="100%" height="100%">
              <PieChart>
                <Pie
                  data={alumniData}
                  cx="50%"
                  cy="100%"
                  innerRadius="180%"
                  outerRadius="210%"
                  startAngle={180}
                  endAngle={0}
                  dataKey="value"
                >
                  {alumniData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Center Text */}
            <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 text-center">
              <p className="text-sm font-satoshi-regular text-black">Total Alumni</p>
              <p className="text-5xl font-satoshi-bold text-primary">{totalAlumni.toLocaleString()}</p>
            </div>

            {/* Legend */}
            <div className="flex justify-center mt-2 text-sm">
              <div className="flex items-center mx-2">
                <span className="w-3 h-3 rounded-full bg-primary mr-1"></span>
                <span className='text-gray-400 mr-2'> Active </span> {activePercentage}%
              </div>
              <div className="flex items-center mx-2">
                <span className="w-3 h-3 rounded-full bg-gray-300 mr-1"></span>
                <span className='text-gray-400 mr-2'> Inactive </span> {inactivePercentage}%
              </div>
            </div>
          </div>
        </div>
        {/* Batch information */}
        <div className={`${cardDesign} row-start-1 col-start-2 flex flex-col`}>
          {/* Batch header */}
          <div className='flex items-center justify-between'>
            <h2 className='font-satoshi-medium text-lg' >Batch Information</h2>
            <div className='flex gap-2'>
              <button className='border border-disabled rounded-xl px-3 py-1 cursor-pointer'>
                <p className='font-satoshi-regular'>Sort by <span className='font-satoshi-medium'>Count</span></p>
              </button>
                <button className='flex items-center gap-2 cursor-pointer text-md font-satoshi-regular'>
                  <MoveLeft/>
                    <p> Page </p>
                    <input
                      type="text"
                      value={batchPage}
                      onChange={() => {}}
                      className="w-9 text-center border border-disabled rounded-md outline-none text-primary font-satoshi-bold"
                    />
                  <p>of {totalBatchPages} </p>
                  <MoveRight/>
                </button>
              </div>
            </div>
            <div className='flex items-center'> 
              <table className="w-full text-center text-gray-800">
              {/* Table Header */}
              <thead>
                <tr className="text-xs text-primary font-satoshi-regular">
                  <th className="p-2 w-1/4">BATCH</th>
                  <th className="p-2 w-1/4">COUNT</th>
                  <th className="p-2 w-1/4">ACTIVE</th>
                  <th className="p-2 w-1/4">INACTIVE</th>
                </tr>
              </thead>
              {/* Table Body */}
              <tbody className='font-satoshi-regular'>
                {batchData.map((row, index) => {
                  const activePercentage = ((row.active / row.count) * 100).toFixed(0);
                  const inactivePercentage = ((row.inactive / row.count) * 100).toFixed(0);
                  
                  return (
                    <tr key={index} className="text-sm">
                      <td className="p-2">{row.batch}</td>
                      <td className="p-2">{row.count}</td>
                      <td className="p-2">
                        {row.active} <span className="text-gray-500">({activePercentage}%)</span>
                      </td>
                      <td className="p-2">
                        {row.inactive} <span className="text-gray-500">({inactivePercentage}%)</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        {/* Filters */}
        <div className='row-start-2 col-span-2'> Filters</div>
        {/* Industries */}
        <div className={`${cardDesign} row-start-3 col-span-2`}> </div>
        {/* Locations */}
        <div className={`${cardDesign} row-start-4 col-span-2`}> </div>
      </div>
    </div>
  )
}

export default AdminUserInformationReport
