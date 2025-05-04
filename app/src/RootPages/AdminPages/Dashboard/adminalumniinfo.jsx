import React, { useState, useEffect } from 'react'
import { MoveLeft, MoveRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import {PieChart, Pie, Cell, ResponsiveContainer, Legend} from 'recharts'
import { BarChart, Bar, XAxis, Tooltip, LabelList } from 'recharts';
import { YAxis } from "recharts";
import axios from 'axios'
import SkeletonLoading from '../../../components/LoadingComponents/skeletonloading';
import CircularLoading from '../../../components/LoadingComponents/circularloading';
import { div, q } from 'framer-motion/client';
import SortModal from '../../../components/AdminComponents/sortmodal';
import OrderToggle from '../../../components/AdminComponents/ordertoggle';

function AdminAlumniInfo() {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const [loading, setLoading] = useState(true)

  const cardDesign = "bg-[#FFFFFF] drop-shadow-sm rounded-2xl p-4 w-full";
  const [alumniStatActivity, setAlumniStatActivity] = useState({
    "total_alumni": 0,
    "active_alumni": 0,
    "active_alumni_percentage": 0.0,
    "inactive_alumni": 0,
    "inactive_alumni_percentage": 0.0
  })

  const sorters = [
    { label: 'Count', value: 'total_users' },
    { label: 'Batch', value: 'batch' },
    {label:'Active', value: 'active_users'},
    {label: 'Inactive', value:'inactive_users'}
  ]

  const [batchPage, setBatchPage] = useState(1)
  const [totalBatchPages, setTotalBatchPages] = useState(20)
  const [sortBy, setSortBy] = useState(sorters[0].value);
  const [sortDirection, setSortDirection] = useState('desc');
  const [orderBy, setOrderBy] = useState('total_users_desc');

    const handleSortFieldChange = (field) => {
      setSortBy(field);
      const newParam = `${field}_${sortDirection}`;
      setOrderBy(newParam);
    };
  
    const handleDirectionToggle = (newDirection) => {
      setSortDirection(newDirection);
      const newParam = `${sortBy}_${newDirection}`;
      setOrderBy(newParam);
    };

  const [batchData, setBatchData] = useState([
      // { batch: 2022, count: 172, active: 80, inactive: 22 },
      // { batch: 2019, count: 102, active: 80, inactive: 22 },
      // { batch: 2018, count: 101, active: 80, inactive: 22 },
      // { batch: 2022, count: 99, active: 80, inactive: 22 },
      // { batch: 2022, count: 99, active: 80, inactive: 22 },
    ])

  // const [industryData, setIndustryData] = useState([
  //   { name: "Agriculture, Forestry, and Fishing", value: 2 },
  //   { name: "Construction", value: 3 },
  //   { name: "Finance, Insurance, and Real Estate", value: 4 },
  //   { name: "Manufacturing", value: 5 },
  //   { name: "Mining", value: 6 },
  //   { name: "Public Administration", value: 7 },
  //   { name: "Retail Trade", value: 8 },
  //   { name: "Services", value: 9 },
  //   { name: "Transportation", value: 11 },
  //   { name: "Wholesale Trade", value: 10 },
  //   { name: "Other", value: 12 },
  // ])
  // const [employmentStatusData, setEmploymentStatusData] = useState([
  //   { name: "Employed", value: 60 },
  //   { name: "Unemployed", value: 20 },
  //   { name: "Self-Employed", value: 5 },
  //   { name: "Self-Employed", value: 5 },
  //   { name: "Student", value: 10 }
  // ]) 
  
  const [employerClassificationData, setEmployerClassificationData] = useState([
      // { name: "Private", value: 50 },
      // { name: "Government", value: 30 },
      // { name: "NGO", value: 10 },
      // { name: "Freelancer", value: 10 }
    ])

  const [alumniData, setAlumniData] = useState([
    { name: "Active", value: 0 },
    { name: "Inactive", value: 0 },
  ])

  const [salaryGradeData, setSalaryGradeData] = useState([
    // { name: "Less than ₱9,100", value: 10 },
    // { name: "₱9,100 - ₱18,200", value: 15 },
    // { name: "₱18,200 - ₱36,399", value: 30 },
    // { name: "₱36,399 - ₱63,699", value: 5 },
    // { name: "₱63,700 - ₱109,199", value: 12 },
    // { name: "₱109,200 to ₱181,999", value: 31 },
    // { name: "More than ₱181,999", value: 2 },
  ])

  const [locationData, setLocationData] = useState([
    // { name: "USA", value: 100},
    // { name: "Canada", value: 60 },
    // { name: "UK", value: 75 },
    // { name: "Australia", value: 30 },
  ])

  const [industries, setIndustries] = useState()
  const [employmentStatusData, setEmploymentStatusData] = useState([
    // {
    //     "status": "unemployed",
    //     "count": 6,
    //     "percentage": 33.33
    // },
    // {
    //     "status": "employed",
    //     "count": 11,
    //     "percentage": 61.11
    // },
    // {
    //     "status": "unemployed_no_experience",
    //     "count": 1,
    //     "percentage": 5.56
    // }
  ])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get alumni count
        const alumniStatActivity = await axios.get(`${API_BASE_URL}/admin/stats/activity`);
        setAlumniStatActivity(alumniStatActivity.data.data);
        
        // Destructure response
        const { active_alumni, inactive_alumni } = alumniStatActivity.data.data
        setAlumniData([
          { name: "Active", value: active_alumni },
          { name: "Inactive", value: inactive_alumni },
        ])

        const batchParams = new URLSearchParams();
        batchParams.append('order', orderBy);
        const queryString = batchParams.toString();

        const batchActivity = await axios.get(`${API_BASE_URL}/admin/stats/get_active_by_batch?${queryString}`)
        setBatchData(batchActivity.data.data)

        // Get industry count
        const industryCount = await axios.get(`${API_BASE_URL}/admin/stats/industry/count`)
        setIndustries(industryCount.data.data)

        // Get employment count
        const employmentCount = await axios.get(`${API_BASE_URL}/admin/stats/employment_status`)
        console.log(employmentCount.data.data)
        setEmploymentStatusData(employmentCount.data.data)

        // Get employer classification
        const employerCount = await axios.get(`${API_BASE_URL}/admin/stats/employment_class`)
        console.log(employerCount.data.data)
        setEmployerClassificationData(employerCount.data.data)
        
        // Get salary grade 
        const salaryGradeCount = await axios.get(`${API_BASE_URL}/admin/stats/salary_grade`)
        setSalaryGradeData(salaryGradeCount.data.data)

        const locationCount = await axios.get(`${API_BASE_URL}/admin/stats/countries`)
        setLocationData(locationCount.data.data)
      } catch (error) {
        console.log(error);
        // setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  },[])

  useEffect(() => {

    const fetchBatchActivity = async () => {
      try{
        const batchParams = new URLSearchParams();
        batchParams.append('order', orderBy);
        const queryString = batchParams.toString();
        const batchActivity = await axios.get(`${API_BASE_URL}/admin/stats/get_active_by_batch?${queryString}`)
          setBatchData(batchActivity.data.data)
      }catch (error){
        console.log(error)
      }
    }

    fetchBatchActivity();
   
  }, [sortBy, sortDirection])

  const COLORS = ["#00369C", "#618FE9", "#A3BFF4", "#CEDEFD"];
  const activeInactiveColors = ["#00369C", "#F7F7FB"]

  return (
    <div className='bg-[#f9f9fb] p-6 max-h-screen flex flex-col overflow-auto'>
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
          {loading ? (
            <SkeletonLoading/>
          ) : (
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
              <p className="text-5xl font-satoshi-bold text-primary">{alumniStatActivity.total_alumni}</p>
            </div>

            {/* Legend */}
            <div className="flex justify-center mt-2 text-sm">
              <div className="flex items-center mx-2">
                <span className="w-3 h-3 rounded-full bg-primary mr-1"></span>
                <span className='text-gray-400 mr-2'> Active </span> {alumniStatActivity.active_alumni_percentage}%
              </div>
              <div className="flex items-center mx-2">
                <span className="w-3 h-3 rounded-full bg-gray-300 mr-1"></span>
                <span className='text-gray-400 mr-2'> Inactive </span> {alumniStatActivity.inactive_alumni_percentage}%
              </div>
            </div>
          </div>
          )}
        </div>
        {/* Batch information */}
        <div className={`${cardDesign} row-start-1 col-start-2 flex flex-col`}>
          {/* Batch header */}
          <div className='flex items-center justify-between'>
            <h2 className='font-satoshi-medium pl-1 medium text-xl' >Batch Information</h2>
            <div className='flex gap-2'>
              {/* <button className='border border-disabled rounded-xl px-3 py-1 cursor-pointer'> */}
                {/* <p className='font-satoshi-regular'>Sort by <span className='font-satoshi-medium'>Count</span></p> */}
                <SortModal filters={sorters} selectedFilter={sortBy} onSelect={handleSortFieldChange}/>
                <OrderToggle direction={sortDirection} onToggle={handleDirectionToggle}/>
              {/* </button> */}
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
            <div className='flex items-center mt-2'> 
              <table className="w-full text-center text-gray-800">
              {/* Table Header */}
              <thead>
                <tr className="text-sm text-primary font-satoshi-regular">
                  <th className="p-2 w-1/4">BATCH</th>
                  <th className="p-2 w-1/4">COUNT</th>
                  <th className="p-2 w-1/4">ACTIVE</th>
                  <th className="p-2 w-1/4">INACTIVE</th>
                </tr>
              </thead>
              {/* Table Body */}
              <tbody className='font-satoshi-regular'>
                {batchData.map((row, index) => {
                  const activePercentage = ((row.active_users / row.total_users) * 100).toFixed(0);
                  const inactivePercentage = ((row.inactive_users / row.total_users) * 100).toFixed(0);
                  
                  return (
                    <tr key={index} className="text-md cursor-pointer hover:bg-secondary/50" onClick={() => {navigate(`/admin/dashboard/batch-reports/${row.batch}`, 
                      {
                        state: {
                          batch: row.batch,
                          count: row.total_users,
                          active: row.active_users,
                          active_percentage: row.active_users_percentage,
                          inactive: row.inactive_users,
                          inactive_percentage: row.inactive_users_percentage
                        },
                    })}}>
                      <td className="px-2 py-1">{row.batch}</td>
                      <td className="px-2 py-1">{row.total_users}</td>
                      <td className="px-2 py-1">
                        {row.active_users} <span className="text-gray-500">({activePercentage}%)</span>
                      </td>
                      <td className="px-2 py-1">
                        {row.inactive_users} <span className="text-gray-500">({inactivePercentage}%)</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        {/* Filters and Industry Reports Navigate*/}
        <div className='row-start-2 col-start-2 w-full gap-8 flex justify-end'>
          <div className='flex justify-center align-center'> 
            Filters Here
          </div>
          <button className="flex flex-row gap-1 items-center cursor-pointer" onClick={()=> navigate("/admin/dashboard/industry-reports/")}><p className="font-satoshi-light text-sm">View Industry Breakdown</p><MoveRight/></button>
        </div>
        {/* Industries and employment*/}
        <div className={`${cardDesign} row-start-3 col-span-2 flex flex-col font-satoshi-regular`}> 
          {/* Top half - bar graph */}
          <div className='h-1/2 px-4 pb-4 pt-2'>
            <h3 className='text-2xl font-satoshi-bold pb-2'> Industries</h3>
            {loading ? (
              <div className='flex items-center justify-center h-full'>
                <CircularLoading/>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height='100%'>
                <BarChart data={industries} margin={{ top: 20, bottom:-10}}>
                  <XAxis 
                    dataKey="industry" 
                    angle={0} 
                    textAnchor="middle" 
                    interval={0} 
                    height={100} 
                    tick={{ fontSize: 12, wordWrap: "break-word", width: 100 }}
                    tickLine={false}
                    axisLine={false}
                    />
                  
                  <Bar
                    dataKey="count"
                    fill="#0a3d91"
                    barSize={60}
                    radius={[5, 5, 5, 5]}
                    >
                    <LabelList dataKey="count" position="top" fill="#000" fontSize={12} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              )}
            </div>
          <div className='w-full border-t border-gray-300 mt-3'></div>
          {/* Bottom half - pie graph */}
          <div className='h-1/2 flex flex-row p-4 mt-3'>
            {/* Employment Status */}
            <div className='h-full flex-1 text-center flex flex-col items-center justify-start'>
              <h3 className='text-2xl font-satoshi-bold'>Employment Status</h3>
              {loading ? (
                <div className='flex items-center justify-center h-full'>
                  <CircularLoading/>
                </div>
              ) : (
                <>
                <ResponsiveContainer width="80%" height="80%">
                <PieChart>
                  <Pie
                    data={employmentStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    fill="#8884d8"
                    dataKey="percentage"
                    nameKey="status"
                    >
                    {employmentStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value}%`, name]}
                    cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
               <div className='flex gap-2 justify-center flex-wrap'>
               {employmentStatusData.map((entry, index) => (
                   <div key={index} className="flex items-center gap-2 text-gray-800">
                     <span
                       className="inline-block min-w-3 min-h-3 rounded-full"
                       style={{ backgroundColor: COLORS[index % COLORS.length] }}
                     ></span>
                     <span className="text-sm">{entry.status}</span>
                   </div>
                 ))}
               </div>
               </>
              )}
            </div>
            {/* Employer Classification */}
            <div className='h-full flex-1 text-center flex flex-col items-center justify-start'>
              <h3 className='text-2xl font-satoshi-bold'>Employer Classification</h3>
              {loading ? (
                <div className='flex items-center justify-center h-full'>
                  <CircularLoading/>
                </div>
              ) : (
              <>
              <ResponsiveContainer width="80%" height="80%">
                <PieChart>
                  <Pie
                    data={employerClassificationData}
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    fill="#8884d8"
                    dataKey="percentage"
                    nameKey="class"
                  >
                    {employerClassificationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, percentage) => [`${value}%`, percentage]}
                    cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className='flex gap-2 justify-center flex-wrap'>
              {employerClassificationData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-800">
                    <span
                      className="inline-block min-w-3 min-h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></span>
                    <span className="text-sm">{entry.class}</span>
                  </div>
                ))}
              </div>
              </>
              )}
            </div>
            {/* Salary grade */}
            <div className="h-full w-full flex-1 text-center flex flex-col items-center justify-start">
              <h3 className='text-2xl font-satoshi-bold'>Salary Grade</h3>
              {loading ? (
                <div className='flex items-center justify-center h-full'>
                  <CircularLoading/>
                </div>
              ) : (
                <ResponsiveContainer width="125%" height="100%">
                  <BarChart
                    data={salaryGradeData}
                    layout="vertical"
                    margin={{ top: 10, bottom: 30, left: 10, right: 10 }}
                    >
                    <XAxis type="number" hide/>
                    <YAxis type="category" dataKey="salary_grade" width={150} tickLine={false} axisLine={false}/>
                    <Bar dataKey="count" fill="#0a3d91" barSize={20} radius={[5, 5, 5, 5]}>
                      <LabelList dataKey="count" position="right" fill="#000" fontSize={14} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                )}
            </div>
          </div>
        </div>
        {/* Locations */}
        <div className={`${cardDesign} row-start-4 col-span-2 h-full p-4`}> 
          {/* Country Reports Navigate */}
          <div className='w-full flex justify-between pb-4 px-2'>
            <h3 className='text-2xl font-satoshi-bold'> Locations </h3>
            <button className="flex flex-row gap-1 items-center cursor-pointer justify-self-end" onClick={()=> navigate("/admin/dashboard/country-reports/")}><p className="font-satoshi-light text-sm">View Country Breakdown</p><MoveRight/></button>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={locationData} layout="vertical" margin={{ left: 40, right: 20, bottom: 40 }}>
              <XAxis type="number"/>
              <YAxis type="category" dataKey="country" width={100} />
              <Bar dataKey="count" barSize={20} radius={[0, 5, 5, 0]}>
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
