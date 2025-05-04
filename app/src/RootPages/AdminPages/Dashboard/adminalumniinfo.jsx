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
import PaginationComponent from "../../../components/AdminComponents/PaginationComponent";
import AdminBack from '../../../components/AdminComponents/AdminBack';

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
  const [sortBy, setSortBy] = useState(sorters[0].value);
  const [sortDirection, setSortDirection] = useState('desc');
  const [orderBy, setOrderBy] = useState('total_users_desc');
  const [token, setToken] = useState(null)
  const [batchPagesLoading, setBatchPagesLoading] = useState(true)

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

  const [batchData, setBatchData] = useState([])
  
  const [employerClassificationData, setEmployerClassificationData] = useState([])

  const [alumniData, setAlumniData] = useState([
    { name: "Active", value: 0 },
    { name: "Inactive", value: 0 },
  ])

  const [salaryGradeData, setSalaryGradeData] = useState([])

  const [locationData, setLocationData] = useState([])

  const [industries, setIndustries] = useState()
  const [employmentStatusData, setEmploymentStatusData] = useState([])
  const [batchPage, setBatchPage] = useState(1)
  const [totalBatchPages, setTotalBatchPages] = useState(1)

  async function fetchBatches() {
    setBatchPagesLoading(true)
    try {
      const batchParams = new URLSearchParams();
      batchParams.append('order', orderBy);
      const queryString = batchParams.toString();
      
      const batchActivity = await axios.get(`${API_BASE_URL}/admin/stats/get_active_by_batch?page=${batchPage}&${queryString}`)
      setTotalBatchPages(batchActivity.data.total_pages)
      setBatchData(batchActivity.data.data)
    } catch (error) {
      console.log(error)
    } finally {
      setBatchPagesLoading(false)
    }
  }

  useEffect(() => {
    fetchBatches()
  }, [batchPage, sortBy, sortDirection])

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

        fetchBatches()

        // Get industry count
        const industryCount = await axios.get(`${API_BASE_URL}/admin/stats/industry/count`)
        setIndustries(industryCount.data.data)

        // Get employment count
        const employmentCount = await axios.get(`${API_BASE_URL}/admin/stats/employment_status`)
        console.log(employmentCount.data.data)
        setEmploymentStatusData(employmentCount.data.data)

        // Get employer classification
        const employerCount = await axios.get(`${API_BASE_URL}/admin/stats/employment_class`)
        // console.log(employmentCount.data.data)
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
    setToken(localStorage.getItem('token'))
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

    // Skeleton Component
    const LoadingSkeleton = () => (
      <div className="animate-pulse flex-1">
        <div className="grid grid-cols-2 grid-rows-[17rem_2rem_50rem_17rem] gap-8 flex-1">
          {/* Total Alumni Skeleton */}
          <div className={`${cardDesign} row-start-1 col-start-1 flex items-center justify-center`}>
            <div className="relative w-full max-w-[300px] h-[150px] mx-auto">
              <div className="w-full h-full bg-gray-200 rounded-full"></div>
              <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 text-center">
                <div className="h-4 w-24 bg-gray-300 rounded mb-2"></div>
                <div className="h-10 w-16 bg-gray-300 rounded"></div>
              </div>
              <div className="flex justify-center mt-2">
                <div className="flex items-center mx-2">
                  <div className="w-3 h-3 bg-gray-300 rounded-full mr-1"></div>
                  <div className="h-4 w-16 bg-gray-300 rounded"></div>
                </div>
                <div className="flex items-center mx-2">
                  <div className="w-3 h-3 bg-gray-300 rounded-full mr-1"></div>
                  <div className="h-4 w-16 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          </div>
  
          {/* Batch Information Skeleton */}
          <div className={`${cardDesign} row-start-1 col-start-2 flex flex-col`}>
            <div className="flex items-center justify-between">
              <div className="h-6 w-48 bg-gray-300 rounded"></div>
              <div className="flex gap-2">
                <div className="h-8 w-24 bg-gray-300 rounded-xl"></div>
                <div className="h-8 w-12 bg-gray-300 rounded-xl"></div>
                <div className="h-8 w-32 bg-gray-300 rounded-xl"></div>
              </div>
            </div>
            <div className="flex items-center mt-2">
              <table className="w-full text-center">
                <thead>
                  <tr className="text-sm">
                    <th className="p-2 w-1/4"><div className="h-4 w-16 bg-gray-300 rounded"></div></th>
                    <th className="p-2 w-1/4"><div className="h-4 w-16 bg-gray-300 rounded"></div></th>
                    <th className="p-2 w-1/4"><div className="h-4 w-16 bg-gray-300 rounded"></div></th>
                    <th className="p-2 w-1/4"><div className="h-4 w-16 bg-gray-300 rounded"></div></th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, index) => (
                    <tr key={index}>
                      <td className="px-2 py-1"><div className="h-4 w-12 bg-gray-300 rounded mx-auto"></div></td>
                      <td className="px-2 py-1"><div className="h-4 w-12 bg-gray-300 rounded mx-auto"></div></td>
                      <td className="px-2 py-1"><div className="h-4 w-20 bg-gray-300 rounded mx-auto"></div></td>
                      <td className="px-2 py-1"><div className="h-4 w-20 bg-gray-300 rounded mx-auto"></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
  
          {/* Filters and Industry Reports Navigate Skeleton */}
          <div className="row-start-2 col-start-2 w-full gap-8 flex justify-end">
            <div className="h-6 w-32 bg-gray-300 rounded"></div>
          </div>
  
          {/* Industries and Employment Skeleton */}
          <div className={`${cardDesign} row-start-3 col-span-2 flex flex-col font-satoshi-regular`}>
            <div className="h-1/2 px-4 pb-4 pt-2">
              <div className="h-6 w-32 bg-gray-300 rounded mb-4"></div>
              <div className="w-full h-[90%] bg-gray-200 rounded-lg"></div>
            </div>
            <div className="w-full border-t border-gray-300 mt-3"></div>
            <div className="h-1/2 flex flex-row p-4 mt-3">
              <div className="h-full flex-1 text-center flex flex-col items-center justify-center">
                <div className="h-6 w-48 bg-gray-300 rounded mb-4"></div>
                <div className="w-3/4 h-3/4 bg-gray-200 rounded-full"></div>
              </div>
              <div className="h-full flex-1 text-center flex flex-col items-center justify-center">
                <div className="h-6 w-48 bg-gray-300 rounded mb-4"></div>
                <div className="w-3/4 h-3/4 bg-gray-200 rounded-full"></div>
              </div>
              <div className="h-full w-full flex-1 text-center flex flex-col items-center justify-center">
                <div className="h-6 w-48 bg-gray-300 rounded mb-4"></div>
                <div className="w-full h-[90%] bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
  
          {/* Locations Skeleton */}
          <div className={`${cardDesign} row-start-4 col-span-2 h-full p-4`}>
            <div className="w-full flex justify-between pb-4 px-2">
              <div className="h-6 w-32 bg-gray-300 rounded"></div>
              <div className="h-6 w-32 bg-gray-300 rounded"></div>
            </div>
            <div className="w-full h-[80%] bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  

    return (
      <div className="bg-[#f9f9fb] p-6 max-h-screen flex flex-col overflow-auto">
        <AdminBack label={"Back to dashboard"}/>
        <h1 className="font-satoshi-bold text-black text-3xl mb-4">User Information Reports</h1>
  
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            <div className="grid grid-cols-2 grid-rows-[17rem_2rem_50rem_17rem] gap-8 flex-1">
              {/* Total Alumni */}
              <div className={`${cardDesign} row-start-1 col-start-1 flex items-center justify-center`}>
                <div className="relative w-full max-w-[300px] h-[150px] mx-auto">
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
                  <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 text-center">
                    <p className="text-sm font-satoshi-regular text-black">Total Alumni</p>
                    <p className="text-5xl font-satoshi-bold text-primary">{alumniStatActivity.total_alumni}</p>
                  </div>
                  <div className="flex justify-center mt-2 text-sm">
                    <div className="flex items-center mx-2">
                      <span className="w-3 h-3 rounded-full bg-primary mr-1"></span>
                      <span className="text-gray-400 mr-2"> Active </span> {alumniStatActivity.active_alumni_percentage}%
                    </div>
                    <div className="flex items-center mx-2">
                      <span className="w-3 h-3 rounded-full bg-gray-300 mr-1"></span>
                      <span className="text-gray-400 mr-2"> Inactive </span> {alumniStatActivity.inactive_alumni_percentage}%
                    </div>
                  </div>
                </div>
              </div>
  
              {/* Batch Information */}
              <div className={`${cardDesign} row-start-1 col-start-2 flex flex-col`}>
                <div className="flex items-center justify-between">
                  <h2 className="font-satoshi-medium pl-1 medium text-xl">Batch Information</h2>
                  <div className="flex gap-2">
                    <SortModal filters={sorters} selectedFilter={sortBy} onSelect={handleSortFieldChange} />
                    <OrderToggle direction={sortDirection} onToggle={handleDirectionToggle} />
                    <PaginationComponent
                      page={batchPage}
                      setPage={setBatchPage}
                      totalPages={totalBatchPages}
                    />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <table className="w-full text-center text-gray-800">
                    <thead>
                      <tr className="text-sm text-primary font-satoshi-regular">
                        <th className="p-2 w-1/4">BATCH</th>
                        <th className="p-2 w-1/4">COUNT</th>
                        <th className="p-2 w-1/4">ACTIVE</th>
                        <th className="p-2 w-1/4">INACTIVE</th>
                      </tr>
                    </thead>
                    {batchPagesLoading ? (
                      <tbody>
                        {[...Array(5)].map((_, index) => (
                          <tr key={index}>
                            <td className="px-2 py-1"><div className="h-4 w-12 bg-gray-300 rounded mx-auto"></div></td>
                            <td className="px-2 py-1"><div className="h-4 w-12 bg-gray-300 rounded mx-auto"></div></td>
                            <td className="px-2 py-1"><div className="h-4 w-20 bg-gray-300 rounded mx-auto"></div></td>
                            <td className="px-2 py-1"><div className="h-4 w-20 bg-gray-300 rounded mx-auto"></div></td>
                          </tr>
                        ))}
                      </tbody>
                    ) : (
                      <tbody className="font-satoshi-regular">
                      {batchData.map((row, index) => {
                        const activePercentage = ((row.active_users / row.total_users) * 100).toFixed(0);
                        const inactivePercentage = ((row.inactive_users / row.total_users) * 100).toFixed(0);
                        return (
                          <tr
                          key={index}
                          className="text-md cursor-pointer hover:bg-secondary/50"
                          onClick={() =>
                            navigate(`/admin/dashboard/batch-reports/${row.batch}`, {
                              state: {
                                batch: row.batch,
                                count: row.total_users,
                                active: row.active_users,
                                active_percentage: row.active_users_percentage,
                                inactive: row.inactive_users,
                                inactive_percentage: row.inactive_users_percentage
                              },
                            })
                          }
                          >
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
                    )}
                  </table>
                </div>
              </div>
  
              {/* Filters and Industry Reports Navigate */}
              <div className="row-start-2 col-start-2 w-full gap-8 flex justify-end">
                <div className="flex justify-center align-center">
                </div>
                <button
                  className="flex flex-row gap-1 items-center cursor-pointer"
                  onClick={() => navigate("/admin/dashboard/industry-reports/")}
                >
                  <p className="font-satoshi-light text-sm">View Industry Breakdown</p>
                  <MoveRight />
                </button>
              </div>
  
              {/* Industries and Employment */}
              <div className={`${cardDesign} row-start-3 col-span-2 flex flex-col font-satoshi-regular`}>
                <div className="h-1/2 px-4 pb-4 pt-2">
                  <h3 className="text-2xl font-satoshi-bold pb-2">Industries</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={industries} margin={{ top: 20, bottom: -10 }}>
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
                </div>
                <div className="w-full border-t border-gray-300 mt-3"></div>
                <div className="h-1/2 flex flex-row p-4 mt-3">
                  <div className="h-full flex-1 text-center flex flex-col items-center justify-center">
                    <h3 className="text-2xl font-satoshi-bold">Employment Status</h3>
                    <ResponsiveContainer width="100%" height="100%">
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
                  </div>
                  <div className="h-full flex-1 text-center flex flex-col items-center justify-center">
                    <h3 className="text-2xl font-satoshi-bold">Employer Classification</h3>
                    <ResponsiveContainer width="100%" height="100%">
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
                  </div>
                  <div className="h-full w-full flex-1 text-center flex flex-col items-center justify-center">
                    <h3 className="text-2xl font-satoshi-bold">Salary Grade</h3>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={salaryGradeData}
                        layout="vertical"
                        margin={{ top: 10, bottom: 30, left: 10, right: 10 }}
                      >
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="salary_grade" width={150} tickLine={false} axisLine={false} />
                        <Bar dataKey="count" fill="#0a3d91" barSize={20} radius={[5, 5, 5, 5]}>
                          <LabelList dataKey="count" position="right" fill="#000" fontSize={14} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
  
              {/* Locations */}
              <div className={`${cardDesign} row-start-4 col-span-2 h-full p-4`}>
                <div className="w-full flex justify-between pb-4 px-2">
                  <h3 className="text-2xl font-satoshi-bold">Locations</h3>
                  <button
                    className="flex flex-row gap-1 items-center cursor-pointer justify-self-end"
                    onClick={() => navigate("/admin/dashboard/country-reports/")}
                  >
                    <p className="font-satoshi-light text-sm">View Country Breakdown</p>
                    <MoveRight />
                  </button>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={locationData} layout="vertical" margin={{ left: 40, right: 20, bottom: 40 }}>
                    <XAxis type="number" />
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
          </>
        )}
      </div>
    );
}

export default AdminAlumniInfo
