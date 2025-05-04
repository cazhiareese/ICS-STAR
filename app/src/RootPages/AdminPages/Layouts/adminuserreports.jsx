import axios from 'axios';
import { MoveLeft, CalendarDays, Users } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line } from 'recharts';
import AdminBack from '../../../components/AdminComponents/AdminBack';

function AdminEngagementReports() {
  const navigate = useNavigate();
  const [daysFilter, setDaysFilter] = useState("30days");
  const [batchFilter, setBatchFilter] = useState(0);
  const [selectedTab, setSelectedTab] = useState(null);
  const [fullEngagementReport, setFullEngagementReport] = useState(null);
  const [fullEngagementReportLoading, setFullEngagementReportLoading] = useState(false);
  const [mostDonations, setMostDonations] = useState([]);
  const [mostInterested, setMostInterested] = useState([]);
  const [donationHighlights, setDonationHighlights] = useState({});
  const [donorHighlights, setDonorHighlights] = useState({});
  const [recentNewsLetters, setRecentLetters] = useState([]);
  const [visitsLoading, setVisitsLoading] = useState(true)

  // BASE URL ENV
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;


  useEffect(() => {
    const fetchFullEngagementReport = async () => {
      setFullEngagementReportLoading(true);
      console.log(`${API_BASE_URL}/admin/engagement-statistics/visits?time_range=${daysFilter}${batchFilter != 0 ? `&batch=${batchFilter}` : ''}`)
      try {
        const response = await axios.get(
          `${API_BASE_URL}/admin/engagement-statistics/visits?time_range=${daysFilter}${batchFilter != 0 ? `&batch=${batchFilter}` : ''}`
        );
        console.log(response.data);
        setFullEngagementReport(response.data);
      } catch (err) {
        console.log(err.message || 'Error fetching engagement report');
      } finally {
        setFullEngagementReportLoading(false);
      }
    };
  
    fetchFullEngagementReport();
  }, [daysFilter, batchFilter]);

  useEffect(() => {
    const fetchData = async () => {
      setFullEngagementReportLoading(true);
      try {
        let response;
        fetchEngagementStatistics()
        // Second request: Most Donations
        response = await axios.get(`${API_BASE_URL}/admin/engagement-statistics/donation-drives/top-3-donors?time_range=${daysFilter}`, {headers: {Authorization: `Bearer ${token}`}});
        console.log(response.data);
        setMostDonations(response.data);

        // Third request: Most Interested (Jobs)
        response = await axios.get(`${API_BASE_URL}/admin/engagement-statistics/jobs/top-3-interested?time_range=${daysFilter}`, {headers: {Authorization: `Bearer ${token}`}});
        console.log(response.data);
        setMostInterested(response.data);

        // Fourth request: Recent Newsletters
        response = await axios.get(`${API_BASE_URL}/admin/engagement-statistics/newsletters/top-3?time_range=${daysFilter}`, {headers: {Authorization: `Bearer ${token}`}});
        console.log(response.data);
        setRecentLetters(response.data);

        // Fifth request: Donation Highlights
        response = await axios.get(`${API_BASE_URL}/admin/engagement-statistics/donation-drives/most-donations?time_range=${daysFilter}`, {headers: {Authorization: `Bearer ${token}`}});
        if (response.status !== 404) {
          console.log("donation", response.data);
          setDonationHighlights(response.data);
        }

        // Sixth request: Donor Highlights
        response = await axios.get(`${API_BASE_URL}/admin/engagement-statistics/donation-drives/most-donors?time_range=${daysFilter}`, {headers: {Authorization: `Bearer ${token}`}});
        if (response.status !== 404) {
          console.log(response.data);
          setDonorHighlights(response.data);
        }
      } catch (err) {
        console.log(err.message || 'Something went wrong');
      } finally {
        setFullEngagementReportLoading(false);
      }
    };

    fetchData();
  }, [daysFilter]);

  const goToMostEngagedJob = () => {
    navigate('most-engaged-job-offers', { relative: 'path' });
  };

  // Skeleton Component
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      {/* Filters Row Skeleton */}
      <div className="flex justify-between items-center mb-4">
        <div></div>
        <div className="flex items-center gap-4">
          <div className="h-8 w-40 bg-gray-300 rounded-md"></div>
        </div>
      </div>

      {/* Chart Card Skeleton */}
      <div className="bg-white rounded-2xl shadow p-6 mb-8">
        <div className="flex flex-row">
          <div className="flex flex-col pb-5">
            <div className="h-8 w-48 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 w-64 bg-gray-300 rounded"></div>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <div className="h-4 w-16 bg-gray-300 rounded"></div>
            <div className="h-8 w-36 bg-gray-300 rounded-md"></div>
          </div>
        </div>
        <div className="w-full h-56 bg-gray-200 rounded-lg mt-4"></div>
      </div>

      {/* Newsletters and Job Offers Cards Skeleton */}
      <div className="flex md:flex-row flex-col gap-5">
        {/* Most Recent Newsletters Skeleton */}
        <div className="bg-white rounded-2xl shadow p-6 md:w-1/2">
          <div className="flex flex-col mb-6">
            <div className="h-8 w-64 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 w-48 bg-gray-300 rounded"></div>
          </div>
          <div className="flex flex-col gap-6">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="flex gap-4 items-center">
                <div className="h-6 w-6 bg-gray-300 rounded"></div>
                <div className="w-14 h-14 bg-gray-200 rounded-md"></div>
                <div className="flex flex-col flex-1">
                  <div className="h-5 w-3/4 bg-gray-300 rounded"></div>
                  <div className="flex gap-2 items-center mt-1">
                    <CalendarDays size={20} className="text-gray-300" />
                    <div className="h-4 w-24 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Job Offers Highlight Skeleton */}
        <div className="bg-white rounded-2xl shadow p-6 md:w-1/2">
          <div className="flex flex-col mb-6">
            <div className="h-8 w-64 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 w-48 bg-gray-300 rounded"></div>
          </div>
          <div className="flex flex-col gap-6">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="flex gap-4 items-center">
                <div className="h-6 w-6 bg-gray-300 rounded"></div>
                <div className="w-14 h-14 bg-gray-200 rounded-md"></div>
                <div className="flex flex-col flex-1">
                  <div className="h-5 w-3/4 bg-gray-300 rounded mb-1"></div>
                  <div className="h-4 w-1/2 bg-gray-300 rounded mb-1"></div>
                  <div className="flex flex-row gap-5">
                    <div className="flex gap-2 items-center">
                      <CalendarDays size={20} className="text-gray-300" />
                      <div className="h-4 w-24 bg-gray-300 rounded"></div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Users size={20} className="text-gray-300" />
                      <div className="h-4 w-16 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-right mt-6">
            <div className="h-5 w-32 bg-gray-300 rounded ml-auto"></div>
          </div>
        </div>
      </div>

      {/* Donations Highlights Skeleton */}
      <div className="bg-white rounded-2xl shadow p-6 mt-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col">
            <div className="h-8 w-64 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 w-48 bg-gray-300 rounded"></div>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="h-5 w-32 bg-gray-300 rounded"></div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-6 mt-8">
          {/* Highest Amount Donated Skeleton */}
          <div className="flex flex-col items-center justify-center rounded-2xl p-6 w-full md:w-1/2">
            <div className="flex flex-row gap-5">
              <div className="relative w-40 h-40 mb-4">
                <div className="w-40 h-40 bg-gray-200 rounded-full"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div className="h-6 w-12 bg-gray-300 rounded"></div>
                    <div className="h-4 w-16 bg-gray-300 rounded mt-1"></div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="h-4 w-48 bg-gray-300 rounded mb-2"></div>
                <div className="h-8 w-64 bg-gray-300 rounded mb-2"></div>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-gray-300" />
                  <div className="h-4 w-32 bg-gray-300 rounded"></div>
                </div>
                <div className="h-5 w-40 bg-gray-300 rounded mt-2"></div>
              </div>
            </div>
          </div>

          {/* Highest Amount of Donators Skeleton */}
          <div className="flex flex-col items-center justify-center rounded-2xl p-6 w-full md:w-1/2">
            <div className="flex flex-row gap-5">
              <div className="relative w-40 h-40 mb-4">
                <div className="w-40 h-40 bg-gray-200 rounded-full"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div className="h-6 w-12 bg-gray-300 rounded"></div>
                    <div className="h-4 w-16 bg-gray-300 rounded mt-1"></div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="h-4 w-48 bg-gray-300 rounded mb-2"></div>
                <div className="h-8 w-64 bg-gray-300 rounded mb-2"></div>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-gray-300" />
                  <div className="h-4 w-32 bg-gray-300 rounded"></div>
                </div>
                <div className="h-5 w-40 bg-gray-300 rounded mt-2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[rgb(243,241,244)] p-6 min-h-screen">
      <AdminBack label={'Back to dashboard'} />

      {fullEngagementReportLoading ? (
        <LoadingSkeleton />
      ) : (
        <>
          {/* Filters Row */}
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <div className="flex items-center gap-4">
              <div>
                <select
                  className="rounded-md px-2 py-1 shadow-sm font-satoshi-medium w-40"
                  value={daysFilter}
                  onChange={(e) => setDaysFilter(e.target.value)}
                >
                  <option value="7days">Last 7 days</option>
                  <option value="30days">Last 30 days</option>
                  <option value="year">Last year</option>
                </select>
              </div>
            </div>
          </div>

          {/* Chart Card */}
          <div className="bg-white rounded-2xl shadow p-6 mb-8">
            {visitsLoading ? (
                <div className="bg-white rounded-2xl shadow p-6 mb-8">
                <div className="flex flex-row">
                  <div className="flex flex-col pb-5">
                    <div className="h-8 w-48 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 w-64 bg-gray-300 rounded"></div>
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    <div className="h-4 w-16 bg-gray-300 rounded"></div>
                    <div className="h-8 w-36 bg-gray-300 rounded-md"></div>
                  </div>
                </div>
                <div className="w-full h-56 bg-gray-200 rounded-lg mt-4"></div>
              </div>
            ) : (
              <>
              <div className="flex flex-row">
                <div className="flex flex-col pb-5">
                  <h1 className="text-3xl font-satoshi-bold text-black">Site Visits</h1>
                  <p className="text-gray-500 text-sm font-satoshi-light">
                    User visit for the last {daysFilter === "7days" ? "7 days" : daysFilter === "year" ? "365 days" : "30 days"}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <label className="text-sm text-gray-700 font-satoshi-bold">Batch:</label>
                  <select
                  className="w-36 rounded-md px-2 py-1 shadow-md"
                  value={batchFilter}
                  onChange={(e) => setBatchFilter(e.target.value)}
                >
                  <option value="0">All</option>
                  {Array.from({ length: 51 }, (_, i) => 1975 + i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                </div>
              </div>
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
          </>
        )}
        </div>

          <div className="flex md:flex-row flex-col gap-5">
            {/* Most Recent Newsletters */}
            <div className="bg-white rounded-2xl shadow p-6 md:w-1/2">
              <div className="flex flex-col justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-satoshi-bold text-black">Most Recent Newsletters</h1>
                  <p className="text-gray-500 text-sm font-satoshi-light pb-3">
                    Last {daysFilter === "7days" ? "7 days" : daysFilter === "year" ? "365 days" : "30 days"}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                {recentNewsLetters.map((item, idx) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <p className="text-primary font-satoshi-medium text-lg">#{idx + 1}</p>
                    <img src={item.image} className="w-14 h-14 rounded-md bg-gray-300" alt="Newsletter" />
                    <div className="flex flex-col">
                      <h1 className="text-black font-satoshi-bold text-lg">{item.title}</h1>
                      <div className="flex gap-2 items-center text-black text-sm mt-1 font-satoshi-medium">
                        <CalendarDays size={20} />
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Job Offers Highlight */}
            <div className="bg-white rounded-2xl shadow p-6 md:w-1/2">
              <div className="flex flex-col justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-satoshi-bold text-black">Job Offers Highlight</h1>
                  <p className="text-gray-500 text-sm font-satoshi-light pb-3">
                    Last {daysFilter === "7days" ? "7 days" : daysFilter === "year" ? "365 days" : "30 days"}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                {mostInterested.map((item, idx) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <p className="text-primary font-satoshi-medium text-lg">#{idx + 1}</p>
                    <img src={item.image} className="w-14 h-14 rounded-md bg-gray-300" alt="Job offer" />
                    <div className="flex flex-col">
                      <h1 className="text-black font-satoshi-bold text-lg">{item.title}</h1>
                      <h1 className="text-black font-satoshi-regular text-md">{item.company}</h1>
                      <div className="flex flex-row gap-5">
                        <div className="flex gap-2 items-center text-black text-sm mt-1 font-satoshi-medium">
                          <CalendarDays size={20} />
                          <span>{item.date_posted}</span>
                        </div>
                        <div className="flex gap-2 items-center text-black text-sm mt-1 font-satoshi-medium">
                          <Users size={20} />
                          <span>{item.interested_count} person</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-right mt-6">
                <button onClick={goToMostEngagedJob} className="text-primary font-satoshi-medium cursor-pointer">
                  See Full Report →
                </button>
              </div>
            </div>
          </div>

          {/* Donations Highlights */}
          <div className="bg-white rounded-2xl shadow p-6 mt-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col">
                <h1 className="text-3xl font-satoshi-bold text-black">Donations Highlights</h1>
                <p className="text-gray-500 text-sm font-satoshi-light">
                  User donations for the last {daysFilter === "7days" ? "7 days" : daysFilter === "year" ? "365 days" : "30 days"}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <button className="text-primary font-satoshi-medium cursor-pointer">
                  See Full Report →
                </button>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6 mt-8">
              {/* Highest Amount Donated */}
              <div className="flex flex-col items-center justify-center rounded-2xl p-6 w-full md:w-1/2">
                <div className="flex flex-row gap-5">
                  <div className="relative w-40 h-40 mb-4">
                    <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 36 36">
                      <path
                        className="text-gray-200 stroke-current"
                        strokeWidth="8"
                        fill="none"
                        d="M18 5 a 13 13 0 0 1 0 26 a 13 13 0 0 1 0 -26"
                      />
                      <path
                        className="text-primary stroke-current"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${donationHighlights.percentage_progress}, 100`}
                        d="M18 5 a 13 13 0 0 1 0 26 a 13 13 0 0 1 0 -26"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-satoshi-bold">{Math.ceil(donationHighlights.percentage_progress)} %</span>
                        <h1 className="font-satoshi-regular text-xs">Reached</h1>
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
                    <p className="text-primary font-satoshi-bold mt-2">
                      ₱ {donationHighlights.amount_gathered} / ₱ {donationHighlights.target_cost} raised
                    </p>
                  </div>
                </div>
              </div>

              {/* Highest Amount of Donators */}
              <div className="flex flex-col items-center justify-center rounded-2xl p-6 w-full md:w-1/2">
                <div className="flex flex-row gap-5">
                  <div className="relative w-40 h-40 mb-4">
                    <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 36 36">
                      <path
                        className="text-gray-200 stroke-current"
                        strokeWidth="8"
                        fill="none"
                        d="M18 5 a 13 13 0 0 1 0 26 a 13 13 0 0 1 0 -26"
                      />
                      <path
                        className="text-primary stroke-current"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${donorHighlights.percentage_progress}, 100`}
                        d="M18 5 a 13 13 0 0 1 0 26 a 13 13 0 0 1 0 -26"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-satoshi-bold">{Math.ceil(donorHighlights.percentage_progress)} %</span>
                        <h1 className="font-satoshi-regular text-xs">Reached</h1>
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
                    <p className="text-primary font-satoshi-bold mt-2">
                      ₱{donorHighlights.amount_gathered} / ₱{donorHighlights.target_cost} raised
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminEngagementReports;