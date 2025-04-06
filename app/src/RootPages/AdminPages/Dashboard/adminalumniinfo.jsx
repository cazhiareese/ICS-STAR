import React, { useState } from 'react'
import { MoveLeft, MoveRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import {PieChart, Pie, Cell, ResponsiveContainer, Legend} from 'recharts'
import { BarChart, Bar, XAxis, Tooltip, LabelList } from 'recharts';
import { YAxis } from "recharts";


function AdminAlumniInfo() {
  const navigate = useNavigate();

  const cardDesign = "bg-white drop-shadow-sm rounded-2xl p-4 w-full";
  const totalAlumni = 1375;
  const activePercentage = 23;
  const inactivePercentage = 77;
  const [batchPage, setBatchPage] = useState(1)
  const [totalBatchPages, setTotalBatchPages] = useState(20)

  const [batchData, setBatchData] = useState([
      { batch: 2022, count: 172, active: 80, inactive: 22 },
      { batch: 2019, count: 102, active: 80, inactive: 22 },
      { batch: 2018, count: 101, active: 80, inactive: 22 },
      { batch: 2022, count: 99, active: 80, inactive: 22 },
      { batch: 2022, count: 99, active: 80, inactive: 22 },
    ])

  const [industryData, setIndustryData] = useState([
    { name: "Agriculture, Forestry, and Fishing", value: 2 },
    { name: "Construction", value: 3 },
    { name: "Finance, Insurance, and Real Estate", value: 4 },
    { name: "Manufacturing", value: 5 },
    { name: "Mining", value: 6 },
    { name: "Public Administration", value: 7 },
    { name: "Retail Trade", value: 8 },
    { name: "Services", value: 9 },
    { name: "Transportation", value: 11 },
    { name: "Wholesale Trade", value: 10 },
    { name: "Other", value: 12 },
  ])
  const [employmentStatusData, setEmploymentStatusData] = useState([
    { name: "Employed", value: 60 },
    { name: "Unemployed", value: 20 },
    { name: "Self-Employed", value: 5 },
    { name: "Self-Employed", value: 5 },
    { name: "Student", value: 10 }
  ]) 
  
  const [employerClassificationData, setEmployerClassificationData] = useState([
      { name: "Private", value: 50 },
      { name: "Government", value: 30 },
      { name: "NGO", value: 10 },
      { name: "Freelancer", value: 10 }
    ])

  const [alumniData, setAlumniData] = useState([
    { name: "Active", value: activePercentage },
    { name: "Inactive", value: inactivePercentage },
  ])

  const [salaryGradeData, setSalaryGradeData] = useState([
    { name: "Less than ₱9,100", value: 10 },
    { name: "₱9,100 - ₱18,200", value: 15 },
    { name: "₱18,200 - ₱36,399", value: 30 },
    { name: "₱36,399 - ₱63,699", value: 5 },
    { name: "₱63,700 - ₱109,199", value: 12 },
    { name: "₱109,200 to ₱181,999", value: 31 },
    { name: "More than ₱181,999", value: 2 },
  ])

  const [locationData, seLocationData] = useState([
    { name: "USA", value: 100},
    { name: "Canada", value: 60 },
    { name: "UK", value: 75 },
    { name: "Australia", value: 30 },
  ])

  const COLORS = ["#00369C", "#618FE9", "#A3BFF4", "#CEDEFD"];
  const activeInactiveColors = ["#00369C", "#F7F7FB"]

  return (
    <div className='bg-[rgb(243,241,244)] p-6 max-h-screen flex flex-col overflow-auto'>
      <div className='flex gap-2 mb-5'>
        <button className="flex flex-row gap-4 items-center cursor-pointer" onClick={() => navigate(-1)}>
            <MoveLeft className='text-primary'/> 
            <p className='text-primary font-satoshi-medium text-lg'>Back to dashboard</p>
        </button>
      </div>
      <h1 className='font-satoshi-bold text-black text-3xl mb-4'>User Information Reports</h1>
      <div className={`grid grid-cols-2 grid-rows-[17rem_2rem_50rem_17rem] gap-8 flex-1`}>
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
                    <Cell key={`cell-${index}`} fill={activeInactiveColors[index]} />
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
                    <tr key={index} className="text-sm cursor-pointer hover:bg-secondary/50" onClick={() => {navigate(`/admin/dashboard/batch-reports/${row.batch}`)}}>
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
        {/* Industries and employment*/}
        <div className={`${cardDesign} row-start-3 col-span-2 flex flex-col font-satoshi-regular`}> 
          {/* Top half - bar graph */}
          <div className='h-1/2 p-4'>
            <h3 className='text-2xl font-satoshi-bold'> Industries</h3>
            <ResponsiveContainer width="100%" height='100%'>
              <BarChart data={industryData} margin={{ top: 20, bottom:-10}}>
                <XAxis 
                  dataKey="name" 
                  angle={0} 
                  textAnchor="middle" 
                  interval={0} 
                  height={100} 
                  tick={{ fontSize: 10, wordWrap: "break-word", width: 80 }}
                  />
                
                <Bar
                  dataKey="value"
                  fill="#0a3d91"
                  barSize={30}
                  radius={[5, 5, 0, 0]}
                  >
                  <LabelList dataKey="value" position="top" fill="#000" fontSize={12} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className='w-full border-t border-gray-300'></div>
          {/* Bottom half - pie graph */}
          <div className='h-1/2 flex flex-row p-4'>
            {/* Employment Status */}
            <div className='h-full flex-1 text-center flex flex-col items-center justify-center'>
              <h3 className='text-2xl font-satoshi-bold'>Employment Status</h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={employmentStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {employmentStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Employer Classification */}
            <div className='h-full flex-1 text-center flex flex-col items-center justify-center'>
              <h3 className='text-2xl font-satoshi-bold'>Employer Classification</h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={employerClassificationData}
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {employmentStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="h-full w-full flex-1 text-center flex flex-col items-center justify-center">
              <h3 className='text-2xl font-satoshi-bold'>Salary Grade</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={salaryGradeData}
                  layout="vertical"
                  margin={{ top: 10, bottom: 30, left: 10, right: 10 }}
                >
                  <XAxis type="number" hide/>
                  <YAxis type="category" dataKey="name" width={150} />
                  <Bar dataKey="value" fill="#0a3d91" barSize={20} radius={[0, 5, 5, 0]}>
                    <LabelList dataKey="value" position="right" fill="#000" fontSize={14} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        {/* Locations */}
        <div className={`${cardDesign} row-start-4 col-span-2 h-full p-4`}> 
          <h3 className='text-2xl font-satoshi-bold'> Locations </h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={locationData} layout="vertical" margin={{ left: 20, right: 20, bottom: 40 }}>
              <XAxis type="number"/>
              <YAxis type="category" dataKey="name" width={100} />
              <Bar dataKey="value" barSize={20} radius={[0, 5, 5, 0]}>
                {locationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[0]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default AdminAlumniInfo
