import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { List, LayoutGrid, MoveLeft, MoveRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, LabelList } from 'recharts';
import UsersTable from '../../../components/AdminComponents/userstable';
import axios from 'axios';
import SortModal from '../../../components/AdminComponents/sortmodal';
import OrderToggle from '../../../components/AdminComponents/ordertoggle';
import PaginationComponent from '../../../components/AdminComponents/PaginationComponent';
import AdminBack from '../../../components/AdminComponents/AdminBack'

// Skeleton Component
function AdminBatchInformationSkeleton() {
  return (
    <>
      {/* Back Button Skeleton */}
      <div className='flex flex-col gap-4'>
        {/* Title Skeleton */}
        <div className='w-48 h-8 bg-gray-200 rounded animate-pulse'></div>

        {/* Batch Selector and Counts Skeleton */}
        <div className='flex flex-row justify-between'>
          <div className='w-40 h-10 bg-gray-200 rounded animate-pulse'></div>
          <div className='flex flex-row gap-15'>
            {[...Array(3)].map((_, index) => (
              <div key={index} className='flex flex-col items-center gap-2'>
                <div className='w-24 h-8 bg-gray-200 rounded animate-pulse'></div>
                <div className='w-16 h-4 bg-gray-200 rounded animate-pulse'></div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className='flex flex-row gap-4'>
          {[...Array(2)].map((_, index) => (
            <div key={index} className='w-32 h-10 bg-gray-200 rounded animate-pulse'></div>
          ))}
        </div>

        {/* Statistics Section Skeleton */}
        <div className='flex flex-col gap-4'>
          {/* Pie Chart Skeletons */}
          {[...Array(2)].map((_, index) => (
            <div
              key={index}
              className='border border-gray-300 w-full h-80 rounded-xl p-6 bg-white shadow-lg'
            >
              <div className='w-48 h-6 bg-gray-200 rounded animate-pulse mb-4'></div>
              <div className='flex flex-row h-full'>
                <div className='flex-1 h-full bg-gray-200 rounded-full animate-pulse'></div>
                <div className='flex-1 flex flex-col gap-2 justify-center'>
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className='flex items-center gap-2'>
                      <div className='w-3 h-3 bg-gray-200 rounded-full animate-pulse'></div>
                      <div className='w-32 h-4 bg-gray-200 rounded animate-pulse'></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Brief Statistics Divider Skeleton */}
          <div className='w-full flex flex-row items-center'>
            <div className='w-48 h-6 bg-gray-200 rounded animate-pulse'></div>
            <div className='flex-1 h-0.5 bg-gray-200 ml-2 animate-pulse'></div>
          </div>

          {/* Bar Chart Skeletons */}
          {[...Array(2)].map((_, index) => (
            <div
              key={index}
              className='border border-gray-300 w-full h-80 rounded-xl p-6 bg-white shadow-lg'
            >
              <div className='w-48 h-6 bg-gray-200 rounded animate-pulse mb-4'></div>
              <div className='h-full w-full'>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className='flex items-center gap-2 mb-2'>
                    <div className='w-24 h-4 bg-gray-200 rounded animate-pulse'></div>
                    <div className='flex-1 h-6 bg-gray-200 rounded animate-pulse'></div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Location Statistics Divider Skeleton */}
          <div className='w-full flex-row items-center'>
            <div className='w-48 h-6 bg-gray-200 rounded animate-pulse'></div>
            <div className='flex-1 h-0.5 bg-gray-200 ml-2 animate-pulse'></div>
          </div>

          {/* Top Countries Bar Chart Skeleton */}
          <div className='border border-gray-300 w-full h-80 rounded-xl p-6 bg-white shadow-lg'>
            <div className='w-48 h-6 bg-gray-200 rounded animate-pulse mb-4'></div>
            <div className='h-full w-full'>
              {[...Array(5)].map((_, i) => (
                <div key={i} className='flex items-center gap-2 mb-2'>
                  <div className='w-24 h-4 bg-gray-200 rounded animate-pulse'></div>
                  <div className='flex-1 h-6 bg-gray-200 rounded animate-pulse'></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function AdminBatchInformation() {
  const navigate = useNavigate();
  const { batch } = useParams();
  const { state } = useLocation();
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const { count, active, active_percentage, inactive, inactive_percentage } = state || {};

  const [loading, setLoading] = useState(true);
  const [years, setYears] = useState([]);
  const [employmentData, setEmploymentData] = useState([]);
  const [unemploymentData, setUnemploymentData] = useState([]);
  const [jobTitles, setJobTitles] = useState([]);
  const [topIndustries, setTopIndustries] = useState([]);
  const [topCountries, setTopCountries] = useState([]);
  const [batchUsers, setBatchUsers] = useState([]);
  const [selectedYear, setSelectedYear] = useState(batch);
  const [batchTotalCount, setBatchTotalCount] = useState(count);
  const [batchActiveCount, setBatchActiveCount] = useState(active);
  const [batchActivePercentage, setBatchActivePercentage] = useState(active_percentage);
  const [batchInactiveCount, setBatchInactiveCount] = useState(inactive);
  const [batchInactivePercentage, setBatchInactivePercentage] = useState(inactive_percentage);
  const [statsOrUser, setStatsOrUser] = useState('stats');
  const [userPage, setUserPage] = useState(1);
  const [totalUserPages, setTotalUserPages] = useState(1);

  const COLORS = ['#0a3d91', '#5a78c8', '#a3b9ec', '#d8e4fa'];

  const sorters = [
    { label: 'Name', value: 'name' },
    { label: 'Batch', value: 'batch' },
    { label: 'Last Update', value: 'updated' },
  ];
  const [sortBy, setSortBy] = useState(sorters[0].value);
  const [sortDirection, setSortDirection] = useState('asc');
  const [orderBy, setOrderBy] = useState('name_asc');

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

  useEffect(() => {
    const fetchData = async (token) => {
      setLoading(true);
      try {
        const allYears = await axios.get(`${API_BASE_URL}/admin/stats/getAllYears`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setYears(allYears.data.data);

        const getActivityCount = await axios.get(`${API_BASE_URL}/admin/stats/get_active/${selectedYear}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBatchTotalCount(getActivityCount.data.data.total_users);
        setBatchActiveCount(getActivityCount.data.data.active_users);
        setBatchActivePercentage(getActivityCount.data.data.active_percentage);
        setBatchInactiveCount(getActivityCount.data.data.inactive_users);
        setBatchInactivePercentage(getActivityCount.data.data.inactive_percentage);

        try {
          const getemploymentData = await axios.get(`${API_BASE_URL}/admin/stats/get_batch_employment?batch=${selectedYear}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setEmploymentData(getemploymentData.data?.data || []);
        } catch (error) {
          console.warn("No employment data found for this batch.");
          setEmploymentData([]);
        }

        try {
          const getunemploymentData = await axios.get(`${API_BASE_URL}/admin/stats/batch/unemployment?batch=${selectedYear}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUnemploymentData(getunemploymentData.data.data);
        } catch (error) {
          console.warn("No unemployment data found for this batch.");
          setUnemploymentData([]);
        }

        try {
          const getJobTitles = await axios.get(`${API_BASE_URL}/admin/stats/get_batch_top_jobs?batch=${selectedYear}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setJobTitles(getJobTitles.data.data);
        } catch (error) {
          setJobTitles([]);
        }

        try {
          const getTopIndustries = await axios.get(`${API_BASE_URL}/admin/stats/get_batch_top_industries?batch=${selectedYear}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setTopIndustries(getTopIndustries.data.data);
        } catch (error) {
          setTopIndustries([]);
        }

        try {
          const getTopCountries = await axios.get(`${API_BASE_URL}/admin/stats/get_batch_top_countries?batch=${selectedYear}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setTopCountries(getTopCountries.data.data);
        } catch (error) {
          setTopCountries([]);
        }

        try {
          const batchParams = new URLSearchParams();
          batchParams.append('order_by', orderBy);
          const queryString = batchParams.toString();
          const getBatchUsers = await axios.get(`${API_BASE_URL}/admin/stats/alumni_batch_filter?batch=${selectedYear}&${queryString}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setBatchUsers(getBatchUsers.data.data);
        } catch (error) {
          setBatchUsers([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedYear) {
      const token = localStorage.getItem('token');
      fetchData(token);
    }
  }, [selectedYear, orderBy]);

  useEffect(() => {
    setSelectedYear(batch);
  }, [batch]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const batchParams = new URLSearchParams();
        batchParams.append('order_by', orderBy);
        const queryString = batchParams.toString();
        const getBatchUsers = await axios.get(`${API_BASE_URL}/admin/stats/alumni_batch_filter?batch=${selectedYear}&page=${userPage}&${queryString}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBatchUsers(getBatchUsers.data.data);
        setTotalUserPages(getBatchUsers.data.total_pages || 1);
      } catch (error) {
        setBatchUsers([]);
      }
    };
    fetchUsers();
  }, [sortBy, sortDirection, userPage, selectedYear]);

  return (
    <div className='py-6 px-25 overflow-auto max-h-screen'>
      {/* Back */}
      <AdminBack label={'Back'}/>
      {loading ? (
        <AdminBatchInformationSkeleton/>
      ) : (
      <div className='flex flex-col'>
        <h2 className='font-satoshi-bold text-2xl text-primary'> Batch Information </h2>
        {/* Batch and count */}
        <div className='flex flex-row justify-between'>
          {/* Batch selector */}
          <select
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              navigate(`/admin/dashboard/batch-reports/${e.target.value}`);
            }}
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
          <div className='w-full lg:w-auto min-w-xs'>
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
        {statsOrUser === 'stats' ? (
          <div className='flex flex-col gap-2 mt-2'>
            {/* Employment Status */}
            {employmentData && employmentData.length > 0 ? (
              <div className='border border-gray-300 w-full h-80 shadow-lg rounded-xl p-6 bg-white'>
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
                          dataKey="count"
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
                          {entry.status}
                          <span className="text-[#0a3d91] ml-1">({entry.percentage}%)</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
            {/* Reason for unemployment */}
            {unemploymentData && unemploymentData.length > 0 ? (
              <div className='border border-gray-300 w-full h-80 shadow-lg rounded-xl p-6 bg-white'>
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
                          dataKey="count"
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
                          {entry.work_mode}
                          <span className="text-[#0a3d91] ml-1">({entry.percentage}%)</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
            {/* Brief statistics divider */}
            {jobTitles && jobTitles.length > 0 && topIndustries && topIndustries.length > 0 ? (
              <div className='w-full flex flex-row items-center'>
                <h3 className='font-satoshi-medium text-xl'> Brief Work Statistics </h3>
                <div className='border-t-1 flex-1 ml-2 border-gray-300'></div>
              </div>
            ) : null}
            {/* Top Job Titles */}
            {jobTitles && jobTitles.length > 0 ? (
              <div className='border border-gray-300 w-full h-80 shadow-lg rounded-xl p-6 bg-white'>
                <h2 className='font-satoshi-bold text-xl'> Top Job Titles </h2>
                <div className='h-full w-full'>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={jobTitles}
                      margin={{ top: 20, right: 80, left: 80, bottom: 20 }}
                    >
                      <XAxis type="number" hide />
                      <YAxis
                        type="category"
                        dataKey="job_title"
                        tick={{ fill: "#5A5673", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Bar
                        dataKey="count"
                        barSize={20}
                        background={{ fill: "#EAF1FF" }}
                        radius={[10, 10, 10, 10]}
                      >
                        {jobTitles.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill="#0A2B91" radius={[10, 10, 10, 10]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : null}
            {/* Top Industries */}
            {topIndustries && topIndustries.length > 0 ? (
              <div className='border border-gray-300 w-full h-80 shadow-lg rounded-xl p-6 bg-white'>
                <h2 className='font-satoshi-bold text-xl'> Top Industries </h2>
                <div className='h-full w-full'>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={topIndustries}
                      margin={{ top: 20, right: 80, left: 80, bottom: 20 }}
                    >
                      <XAxis type="number" hide />
                      <YAxis
                        type="category"
                        dataKey="industry"
                        tick={{ fill: "#5A5673", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Bar
                        dataKey="count"
                        barSize={20}
                        background={{ fill: "#EAF1FF" }}
                        radius={[10, 10, 10, 10]}
                      >
                        {topIndustries.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill="#0A2B91" radius={[10, 10, 10, 10]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : null}
            {/* Brief location statistics divider */}
            {topCountries && topCountries.length > 0 ? (
              <div className='w-full flex flex-row items-center'>
                <h3 className='font-satoshi-medium text-xl'> Brief Location Statistics </h3>
                <div className='border-t-1 flex-1 ml-2 border-gray-300'></div>
              </div>
            ) : null}
            {/* Top Countries */}
            {topCountries && topCountries.length > 0 ? (
              <div className='border border-gray-300 w-full h-80 shadow-lg rounded-xl p-6 bg-white'>
                <h2 className='font-satoshi-bold text-xl'> Top Countries </h2>
                <div className='h-full w-full'>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={topCountries}
                      margin={{ top: 20, right: 80, left: 80, bottom: 20 }}
                    >
                      <XAxis type="number" hide />
                      <YAxis
                        type="category"
                        dataKey="country"
                        tick={{ fill: "#5A5673", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Bar
                        dataKey="count"
                        barSize={20}
                        background={{ fill: "#EAF1FF" }}
                        radius={[10, 10, 10, 10]}
                      >
                        {topCountries.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill="#0A2B91" radius={[10, 10, 10, 10]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <>
            <div className='flex gap-2 my-2 w-full justify-end'>
              <SortModal filters={sorters} selectedFilter={sortBy} onSelect={handleSortFieldChange} />
              <OrderToggle direction={sortDirection} onToggle={handleDirectionToggle} />
              <PaginationComponent
                page={userPage}
                setPage={setUserPage}
                totalPages={totalUserPages}
              />
            </div>
            <div className='border border-gray-400 rounded-xl p-6 flex-1 hidden lg:block h-fit bg-white'>
              <UsersTable data={batchUsers} userType='alum' />
            </div>
          </>
        )}
      </div>
    )}
    </div>
  );
}

export default AdminBatchInformation;