import React, { useEffect, useState } from "react";
import { Home, FileText, Calendar, Newspaper, BriefcaseBusiness, Heart, LogOut, CircleUserRound, FileUser, ShieldUser, TriangleAlert, HandCoins, MoveRight, Users, Wallet } from "lucide-react";
import { 
  PieChart, Pie, Cell, Tooltip, Legend, 
  LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid
} from "recharts";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import formatEvents from "../../../components/formatEvents";

function AdminDashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [pendingVerifications, setPendingVerifications] = useState(null);
  const [userReports, setUserReports] = useState(null);
  const [postReports, setPostReports] = useState(null);
  const [fundingRequests, setFundingRequests] = useState(null);
  const [donors, setDonors] = useState([]);
  const [stats, setStats] = useState(null);
  const [registeredAlumni, setRegisteredAlumni] = useState(null);
  const [alumniIndustries, setAlumniIndustries] = useState([]);
  const [alumniLocations, setAlumniLocations] = useState([]);
  const [fullEngagementReport, setFullEngagementReport] = useState([]);
  const [daysFilter, setDaysFilter] = useState("30days");
  const [batchFilter, setBatchFilter] = useState("2022");
  const [events, setEvents] = useState([]);
  const [topDonation, setTopDonation] = useState([]);
  const COLORS = ["#0B2B6F", "#2858D6", "#8CA6DB", "#CBD7F1", "#E8F0FF"];
  
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Pending Verifications
        const pendingVerificationResponse = await axios.get(`${API_BASE_URL}/admin/unverified/count`);
        setPendingVerifications(pendingVerificationResponse.data.count);

        // Fetch Reports
        const [userReportsResponse, postReportsResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/admin_dashboard/pending-reported-users/count`),
          axios.get(`${API_BASE_URL}/admin_dashboard/pending-reported-posts/count`)
        ]);
        setUserReports(userReportsResponse.data.pending_reported_users_count);
        setPostReports(postReportsResponse.data.pending_reported_posts_count);

        // Fetch Funding Requests
        const fundingRequestResponse = await axios.get(`${API_BASE_URL}/admin_dashboard/not_yet_acknowledged_donations_count`);
        setFundingRequests(fundingRequestResponse.data.not_yet_acknowledged_donations_count);

        // Fetch Donors
        const donorsResponse = await axios.get(`${API_BASE_URL}/admin_dashboard/recent-donors`);
        const donorsFormat = donorsResponse.data.slice(0, donorsResponse.data.length - 1).map(item => ({
          donation: item.drive_title,
          name: item.donor_name,
          amount: item.donation_details
        }));
        setDonors(donorsFormat);

        // Fetch Events
        const eventsResponse = await axios.get(`${API_BASE_URL}/admin_dashboard/upcoming-events`);
        setEvents(formatEvents(eventsResponse.data));

        // Fetch Stats
        const statsResponse = await axios.get(`${API_BASE_URL}/admin_dashboard/user_statistics`);
        setStats(statsResponse.data);
        setRegisteredAlumni(statsResponse.data.verified_alumni_count);
        const formattedIndustries = statsResponse.data.top_alumni_industries.map((item, index) => ({
          name: item.industry,
          value: item.percentage,
          color: COLORS[index % COLORS.length]
        }));
        setAlumniIndustries(formattedIndustries);
        const formattedLocations = statsResponse.data.top_alumni_countries.map(item => ({
          country: item.country,
          percentage: `${item.percentage}%`
        }));
        setAlumniLocations(formattedLocations);

        // Fetch Top Donations
        const topDonationsResponse = await axios.get(`${API_BASE_URL}/admin_dashboard/top-funded-drives`);
        setTopDonation(topDonationsResponse.data);

        // Fetch Engagement
        const engagementResponse = await axios.get(`${API_BASE_URL}/admin/engagement-statistics/visits?time_range=${daysFilter}${batchFilter !== 0 ? `&batch=${batchFilter}` : ''}`);
        setFullEngagementReport(engagementResponse.data);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const dashboardCard = "bg-white drop-shadow-sm rounded-2xl p-4 w-full";

  const goToInfoReports = () => {
    navigate('user-engagement-reports', { relative: 'path' });
  };

  const SkeletonCard = () => (
    <div className="flex flex-col justify-between h-full animate-pulse">
      <div className="flex flex-row justify-between">
        <div className="h-12 w-16 bg-gray-200 rounded"></div>
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
          {/* <div className="w-6 h-6 bg-gray-300 rounded-full"></div> */}
        </div>
      </div>
      <div className="h-4 w-3/4 bg-gray-200 rounded mt-4"></div>
    </div>
  );

  const SkeletonEvents = () => (
    <div className="flex flex-col h-full animate-pulse">
      <div className="flex flex-row justify-between mb-4">
        <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
          <div className="h-4 w-4 bg-gray-200 rounded"></div>
        </div>
      </div>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex items-start gap-3 mb-3">
          <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
          <div className="flex-1">
            <div className="flex justify-between">
              <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const SkeletonDonations = () => (
    <div className="flex w-full flex-col lg:flex-row gap-6 h-full animate-pulse">
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gray-200 rounded"></div>
            <div className="h-6 w-24 bg-gray-200 rounded"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
          </div>
        </div>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
              <div className="flex flex-row gap-4">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
              </div>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
      <div className="flex-1 flex flex-col">
        <div className="h-6 w-1/3 bg-gray-200 rounded mb-4"></div>
        <div className="flex-1 overflow-auto">
          <table className="w-full h-full border-collapse">
            <thead className="bg-gray-100 text-sm sticky top-0">
              <tr>
                <th className="text-left px-3 py-2">
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                </th>
                <th className="text-left">
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                </th>
                <th className="text-left">
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Array.from({ length: 3 }).map((_, index) => (
                <tr key={index} className="">
                  <td className="py-1 px-3">
                    <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                  </td>
                  <td>
                    <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                  </td>
                  <td>
                    <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const SkeletonAlumni = () => (
    <div className="flex flex-col h-full animate-pulse">
      <div className="flex flex-row justify-between mb-4">
        <div className="flex flex-row items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center"></div>
          <div className="flex flex-col">
            <div className="h-4 w-32 bg-gray-200 rounded -mb-1"></div>
            <div className="h-10 w-16 bg-gray-200 rounded mt-2"></div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
          <div className="h-4 w-4 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="mt-3 flex flex-col lg:flex-row gap-2">
        <div className="flex-1">
          <div className="bg-gray-100 rounded-2xl px-4 py-1">
            <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
          </div>
          <div className="mt-2">
            <table className="w-full">
              <tbody>
                {Array.from({ length: 3 }).map((_, index) => (
                  <tr key={index} className="flex justify-between px-6 py-1">
                    <td>
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    </td>
                    <td>
                      <div className="h-4 w-12 bg-gray-200 rounded"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex-1/5">
          <div className="bg-gray-100 rounded-2xl px-4 py-1">
            <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
          </div>
          <div className="flex flex-row items-center justify-center mt-2">
            <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
            <div className="ml-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const SkeletonEngagement = () => (
    <div className="flex flex-col h-full animate-pulse">
      <div className="flex flex-row justify-between mb-4">
        <div className="flex flex-col">
          <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
          <div className="h-3 w-1/4 bg-gray-200 rounded mt-1"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
          <div className="h-4 w-4 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="flex items-center mt-2">
        <ResponsiveContainer width="90%" height={200}>
          <LineChart data={[{ date: "", visits: 0 }, { date: "", visits: 0 }]}>
            <CartesianGrid vertical={false} stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              tickLine={true} 
              axisLine={true} 
              tick={{ fontSize: "14px", fontFamily: "Satoshi-Light, sans-serif", fill: "#d1d5db" }} 
            />
            <YAxis 
              tickLine={true} 
              axisLine={true} 
              tick={{ fontSize: "14px", fontFamily: "Satoshi-Light, sans-serif", fill: "#d1d5db" }} 
            />
            <Line type="linear" dataKey="visits" stroke="#d1d5db" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <>
      <div className="bg-gray-100 flex-1 lg:max-h-screen overflow-auto">
        <div className="p-4 flex flex-col max-w-7xl mx-auto">
          {/* Welcome admin div */}
          <div className="flex flex-row mb-3 items-center">
            <CircleUserRound size={32}/>
            <p className="ml-2 text-3xl">
              <span className="font-satoshi-light">Welcome back </span>
              <span className="font-satoshi-bold">Admin,</span>
            </p>
          </div>
          {/* Grid */}
          <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 grid-rows-[5em_7em_7em_14em_28em_1em_29em_19em] lg:grid-rows-[5em_7em_7em_14em_1em_18em] gap-4">
          {/* Dashboard Banner */}
          <div className="w-full h-[5em] overflow-clip col-start-1 col-span-2 lg:col-span-4 row-start-1 rounded-2xl flex items-center justify-between relative">
            <img
              src="/assets/DashboardBanner.svg"
              alt="Dashboard Banner"
              className="absolute inset-0 h-full object-cover"
            />
            <p className="text-white font-satoshi-bold text-2xl ml-5 z-10">Dashboard</p>
            <p className="text-white font-satoshi-light mr-3 lg:mr-52 hidden lg:block z-10">
              Bridging Alumni across the Cosmos
            </p>
          </div>
            {/* Pending Verifications */}
            <div className={`${dashboardCard} col-start-1 row-start-2 flex flex-col justify-between`}> 
              {loading ? <SkeletonCard /> : (
                <>
                  <div className="flex flex-row justify-between">
                    <p className="text-5xl"> {pendingVerifications} </p>
                    <div className="">
                      <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                        <FileUser className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <p className="font-satoshi-light text-sm "> Pending Verifications </p>
                </>
              )}
            </div> 
            {/* Reported Postings */}
            <div className={`${dashboardCard} col-start-2 row-start-2 flex flex-col justify-between`}> 
              {loading ? <SkeletonCard /> : (
                <>
                  <div className="flex flex-row justify-between">
                    <p className="text-5xl"> {postReports} </p>
                    <div className="">
                      <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                        <TriangleAlert className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <p className="font-satoshi-light text-sm "> Reported Job Postings </p>
                </>
              )}
            </div> 
            {/* Reported Users */}
            <div className={`${dashboardCard} col-start-1 row-start-3 flex flex-col justify-between`}> 
              {loading ? <SkeletonCard /> : (
                <>
                  <div className="flex flex-row justify-between">
                    <p className="text-5xl"> {userReports} </p>
                    <div className="">
                      <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                        <ShieldUser className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <p className="font-satoshi-light text-sm "> Reported Users </p>
                </>
              )}
            </div> 
            {/* Funding Requests */}
            <div className={`${dashboardCard} col-start-2 row-start-3 flex flex-col justify-between`}> 
              {loading ? <SkeletonCard /> : (
                <>
                  <div className="flex flex-row justify-between">
                    <p className="text-5xl"> {fundingRequests} </p>
                    <div className="">
                      <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                        <Wallet className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <p className="font-satoshi-light text-sm "> Funding Requests </p>
                </>
              )}
            </div> 
            {/* Upcoming Events */}
            <div className={`${dashboardCard} col-start-1 lg:col-start-3 col-span-2 row-start-4 lg:row-start-2 lg:row-span-2`}> 
              {loading ? <SkeletonEvents /> : (
                <>
                  <div className="flex flex-row justify-between">
                    <p className="font-satoshi-medium text-2xl"> Upcoming Events </p> 
                    <button className="flex flex-row gap-4 items-center cursor-pointer hover:text-hover" onClick={() => {navigate("/admin/events")}}> 
                      <p className="font-satoshi-light">View All Events</p> 
                      <MoveRight/>
                    </button>
                  </div>
                  <div className="gap-3 flex flex-col flex-1 mt-3">
                    {events.map((event, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="bg-secondary text-black font-medium px-4 py-2 rounded-full text-sm whitespace-nowrap min-w-24 flex items-center justify-center">
                          {event.dateLabel}
                        </div>
                        <div className="flex flex-col gap-3 flex-1 mt-1">
                          {event.items.map((item, idx) => (
                            <div key={idx} className="flex flex-row justify-between flex-1 text-sm items-center">
                              <div>{item.title}</div>
                              <div className="font-satoshi-light">{item.time}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div> 
            {/* Donations Card */}
            <div className={`${dashboardCard} col-span-2 col-start-1 lg:col-span-4 flex flex-col lg:flex-row gap-6`}> 
              {loading ? <SkeletonDonations /> : (
                <>
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <HandCoins/>
                        <p className="text-2xl "> Donations </p>
                      </div>
                      <button className="flex flex-row gap-4 items-center cursor-pointer hover:text-hover" onClick={() => {navigate("/admin/donations")}}> 
                        <p className="font-satoshi-light text-sm">View All Donations</p> 
                        <MoveRight/>
                      </button>            
                    </div>
                    {topDonation.map((donation, index) => {
                      const progress = donation.percentage_funded;
                      return (
                        <div key={index} className="mb-4">
                          <div className="flex justify-between text-black text-sm mb-1">
                            <span>{donation.title}</span>
                            <div className="flex flex-row gap-4">
                              <span>{donation.total_donations.toLocaleString()} PHP / {donation.target_cost.toLocaleString()} PHP</span>
                              <div className="w-6 h-6 text-xs font-semibold flex items-center justify-center bg-secondary text-primary rounded-full">
                                {donation.donors}
                              </div>
                            </div>
                          </div>
                          <div className="relative w-full h-2 bg-gray-200 rounded-full">
                            <div
                              className="absolute h-full bg-primary rounded-full"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <p className="text-2xl font-satoshi-medium"> Recent Donors</p>
                    <table className="w-full border-collapse">
                      <thead className="bg-secondary text-black text-sm">
                        <tr>
                          <th className="text-left px-3 py-2 font-satoshi-regular">Donation</th>
                          <th className="text-left font-satoshi-regular ">Name</th>
                          <th className="text-left font-satoshi-regular">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {donors.map((donor, index) => (
                          <tr key={index} className="">
                            <td className="py-1 px-3 font-satoshi-light">{donor.donation}</td>
                            <td className="font-satoshi-light">{donor.name}</td>
                            <td className="text-left font-satoshi-light">{donor.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div> 
            {/* Alumni part */}
            <div className="row-start-6 col-span-2 lg:row-start-5 lg:col-span-4 text-2xl font-satoshi-medium -mb-4">
              <h2 className="">More about your Alumni</h2>
            </div>
            {/* Registered Alumni */}
            <div className={`${dashboardCard} col-span-2 row-start-7 lg:row-start-6 flex flex-col`}> 
              {loading ? <SkeletonAlumni /> : (
                <>
                  <div className="flex flex-row justify-between">
                    <div className="flex flex-row items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex flex-col">
                        <p className="font-satoshi-light -mb-1">Registered Alumni</p>
                        <p className="font-satoshi-medium text-4xl">{registeredAlumni}</p>
                      </div>
                    </div>
                    <div>
                      <button className="flex flex-row gap-4 items-center cursor-pointer hover:text-hover" onClick={() => navigate("/admin/dashboard/alumni-report")}> 
                        <p className="font-satoshi-light text-sm">View your Alumni</p> 
                        <MoveRight/>
                      </button>      
                    </div>
                  </div>
                  <div className="mt-3 flex flex-col lg:flex-row gap-2">
                    <div className="flex-1">
                      <div className="bg-secondary rounded-2xl px-4 py-1">
                        <p className="font-satoshi-medium">Alumni Locations</p>
                      </div>
                      <div>
                        <table className="w-full mt-2">
                          <tbody>
                            {alumniLocations.map((location, index) => (
                              <tr key={index} className="flex justify-between px-6 py-1">
                                <td className="text-black font-satoshi-light text-sm mr-5 whitespace-nowrap text-ellipsis overflow-clip">{location.country}</td>
                                <td className="text-primary font-medium text-sm">{location.percentage}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="flex-1/5">
                      <div className="bg-secondary rounded-2xl px-4 py-1">
                        <p className="font-satoshi-medium">Alumni Industries</p>
                      </div>
                      <div className="flex flex-row items-center justify-center">
                        <PieChart width={140} height={140}>
                          <Pie
                            data={alumniIndustries}
                            cx="50%"
                            cy="50%"
                            innerRadius={35}
                            outerRadius={60}
                            dataKey="value"
                          >
                            {alumniIndustries.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                        <div>
                          {alumniIndustries.map((entry, index) => (
                            <div key={index} className="flex items-center gap-2 text-gray-800">
                              <span
                                className="inline-block min-w-3 min-h-3 rounded-full"
                                style={{ backgroundColor: entry.color }}
                              ></span>
                              <span className="text-sm">{entry.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div> 
            {/* System Engagement */}
            <div className={`${dashboardCard} col-start-1 row-start-8 lg:row-start-6 lg:col-start-3 col-span-2 flex flex-col`}> 
              {loading ? <SkeletonEngagement /> : (
                <>
                  <div className="flex flex-row justify-between">
                    <div className="flex flex-col">
                      <h2 className="font-satoshi-medium text-2xl"> System Engagement</h2>  
                      <p className="font-satoshi-light text-xs">User visit for the last 30 days</p>
                    </div>
                    <button onClick={goToInfoReports} className="flex flex-row gap-4 cursor-pointer mt-2 hover:text-hover"> 
                      <p className="font-satoshi-light text-sm">View User Information Reports</p> 
                      <MoveRight/>
                    </button>      
                  </div>
                  <div className="flex items-center mt-2">
                    <ResponsiveContainer width="90%" height={200}>
                      <LineChart data={fullEngagementReport}>
                        <CartesianGrid vertical={false} />
                        <XAxis 
                          dataKey="date" 
                          tickLine={true} 
                          axisLine={true} 
                          tick={{ fontSize: "14px", fontFamily: "Satoshi-Light, sans-serif" }} 
                        />
                        <YAxis 
                          tickLine={true} 
                          axisLine={true} 
                          tick={{ fontSize: "14px", fontFamily: "Satoshi-Light, sans-serif" }} 
                        />
                        <Tooltip />
                        <Line type="linear" dataKey="visits" stroke="#0B2B6F" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </>
              )}
            </div> 
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;