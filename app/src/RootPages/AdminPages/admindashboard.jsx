import React, { useState } from "react";
import { Home, FileText, Calendar, Newspaper, BriefcaseBusiness, Heart, LogOut, CircleUserRound, FileUser, ShieldUser, TriangleAlert, HandCoins, MoveRight, Users, Wallet } from "lucide-react";
import { 
  PieChart, Pie, Cell, Tooltip, Legend, 
  LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid
} from "recharts";

import SidebarItem from "../../components/AdminComponents/sidebaritem";

function AdminLanding() {
  // To apply selected on sidebar item
  const [selected, setSelected] = useState('dashboard')

  // Items for the sidebar
  const sidebarItems = [
    { id: "dashboard", title: "Dashboard", icon: <Home size={24} /> },
    { id: "records", title: "Records", icon: <FileText size={24} /> },
    { id: "events", title: "Events", icon: <Calendar size={24} /> },
    { id: "newsletter", title: "Newsletter", icon: <Newspaper size={24} /> },
    { id: "career", title: "Career", icon: <BriefcaseBusiness size={24} /> },
    { id: "donations", title: "Donations", icon: <Heart size={24} /> },    
  ];
  
  const dashboardCard = "bg-white drop-shadow-sm rounded-2xl p-4";

  // SAMPLE DATA

  const response = {
    pendingVerifications: 28,
    reportedPostings: 5, 
    reportedUsers: 12, 
    fundingRequests: 10,
    registeredAlumni: 542,
  }

  const events = [
    {
      dateLabel: "Tomorrow",
      items: [{ title: "Lorem Ipsum Dolor sit Amet", time: "10 am, ICSMH" }]
    },
    {
      dateLabel: "In 4 days",
      items: [
        { title: "Lorem Ipsum Dolor sit Amet", time: "3 pm, ICSMH" },
        { title: "Lorem Ipsum Dolor sit Amet", time: "3 pm, ICSMH" },
        { title: "Lorem Ipsum Dolor sit Amet", time: "3 pm, ICSMH" }
      ]
    }
  ];

  const donations = [
    { name: "Lorem Ipsum Dolor", raised: 12000, goal: 15000, donors: 6 },
    { name: "Lorem Ipsum", raised: 14000, goal: 20000, donors: 30 },
    { name: "Lorem Ipsum", raised: 13500, goal: 20000, donors: 21 },
  ];

  const donors = [
    { donation: "Lorem Ipsum Dolor", name: "Lorem Ipsum", amount: "10,000 PHP" },
    { donation: "Lorem Ipsum Dolor", name: "Lorem Ipsum", amount: "10,000 PHP" },
    { donation: "Lorem Ipsum Dolor", name: "Lorem Ipsum", amount: "10,000 PHP" },
    { donation: "Lorem Ipsum Dolor", name: "Lorem Ipsum", amount: "10,000 PHP" },
  ];

  const alumniLocations = [
    { "country": "Philippines", "percentage": "78%" },
    { "country": "United States", "percentage": "22%" },
    { "country": "Canada", "percentage": "18%" },
    { "country": "Australia", "percentage": "12%" },
    { "country": "United Kingdom", "percentage": "9%" }
  ]

  const alumniIndustries = [
    { name: "Services", value: 40, color: "#0B2B6F" },
    { name: "Finance", value: 25, color: "#2858D6" },
    { name: "Manufacturing", value: 15, color: "#8CA6DB" },
    { name: "Retail Trade", value: 10, color: "#CBD7F1" },
    { name: "Others", value: 10, color: "#E8F0FF" }
  ];

  const systemEngagementReport = [
    { date: "1 Oct", visits: 100 },
    { date: "3 Oct", visits: 250 },
    { date: "7 Oct", visits: 300 },
    { date: "10 Oct", visits: 180 },
    { date: "14 Oct", visits: 450 },
    { date: "20 Oct", visits: 700 },
    { date: "23 Oct", visits: 457 },
    { date: "27 Oct", visits: 600 },
    { date: "30 Oct", visits: 320 },
  ];

  return <>
  <div className="flex flex-row">
    {/* Sidebar */}
    <div className="bg-white h-screen flex flex-col gap-3 px-4 pt-20 w-2/12">
      {/* Sidebar items */}
      {sidebarItems.map((item) => (
          <SidebarItem
            key={item.id}
            title={item.title}
            icon={item.icon}
            isSelected={selected === item.id}
            onClick={() => setSelected(item.id)}
          />
        ))}
        {/* Log out */}
      <div className={`flex flex-row p-2 rounded-r-3xl items-center ml-2 mt-16 cursor-pointer`}>
        <span className="mr-3"><LogOut /></span>
        <p className="text-lg font-satoshi-medium">Log out</p>
      </div>
    </div>

    {/* Dashboard area */}
    <div className="bg-[#F3F1F4] flex-1 max-h-screen overflow-auto">
      <div className=" p-4 flex flex-col max-w-7xl mx-auto">
        <div className="flex flex-row mb-3 items-center">
          <CircleUserRound size={32}/>
          <p className="ml-2 text-3xl">
            <span className="font-satoshi-light">Welcome back </span>
            <span className="font-satoshi-bold">Admin,</span>
          </p>
        </div>
        {/* Grid */}
        <div className="flex-1 grid grid-cols-4 grid-rows-[0.5fr_0.7fr_0.7fr_1.7fr_0.2fr_2fr] gap-4">
        {/* Dashboard Banner */}
          <div className="col-span-4 row-start-1 rounded-2xl bg-cover bg-center bg-no-repeat bg-[url('/assets/DashboardBanner.svg')] flex items-center justify-between"> 
            <p className="text-white font-satoshi-bold text-2xl ml-5"> Dashboard </p>
            <p className="text-white font-satoshi-light mr-52"> Bridging Alumni across the Cosmos </p>
          </div> 
        {/* Pending Verifications */}
          <div className={`${dashboardCard} col-start-1 row-start-2 flex flex-row justify-between`}> 
            <div className="flex flex-col">
              <p className="font-satoshi-light text-sm"> Pending Verifications </p>
              <p className="text-5xl"> {response.pendingVerifications} </p>
            </div>
            <div className="">
              <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                <FileUser className="w-6 h-6 text-white" />
              </div>
            </div>
          </div> 
        {/* Reported Postings */}
          <div className={`${dashboardCard} cols-start-2 row-start-2 flex flex-row justify-between`}>
            <div className="flex flex-col">
              <p className="font-satoshi-light text-sm"> Reported Postings </p>
              <p className="text-5xl"> {response.reportedPostings} </p>
            </div>
            <div className="">
              <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                <TriangleAlert className="w-6 h-6 text-white" />
              </div>
            </div>
          </div> 
        {/* Reported Users */}
          <div className={`${dashboardCard} cols-start-1 row-start-3 flex flex-row justify-between`}>
            <div className="flex flex-col">
              <p className="font-satoshi-light text-sm"> Reported Users </p>
              <p className="text-5xl"> {response.reportedUsers} </p>
            </div>
            <div className="">
              <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                <ShieldUser className="w-6 h-6 text-white" />
              </div>
            </div>
          </div> 
        {/* Funding Requests */}
          <div className={`${dashboardCard} cols-start-2 row-start-3 flex flex-row justify-between`}>
            <div className="flex flex-col">
              <p className="font-satoshi-light text-sm"> Funding Requests </p>
              <p className="text-5xl"> {response.fundingRequests} </p>
            </div>
            <div className="">
              <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
            </div>
          </div> 
        {/* Upcoming Events */}
          <div className={`${dashboardCard} col-span-2 row-span-2`}> 
            <div className="flex flex-row justify-between">
              <p className="font-satoshi-medium text-2xl"> Upcoming Events </p> 
                <button className="flex flex-row gap-4 items-center cursor-pointer"> <p className="font-satoshi-light">View All Events</p> <MoveRight/></button>
            </div>
            <div className="gap-3 flex flex-col flex-1 mt-3">
              {events.map((event, index) => (
                <div key={index} className="flex items-start gap-3">
                  {/* Date Label */}
                  <div className="bg-secondary text-black font-medium px-4 py-2 rounded-full text-sm whitespace-nowrap min-w-24 flex items-center justify-center">
                    {event.dateLabel}
                  </div>

                  {/* Event Details */}
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
          </div> 
        {/* Donations Card */}
          <div className={`${dashboardCard} col-span-4 row-span-1 flex flex-row gap-6`}> 
          {/* Donations */}
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <HandCoins/>
                  <p className="text-2xl "> Donations </p>
                </div>
              <button className="flex flex-row gap-4 items-center cursor-pointer"> <p className="font-satoshi-light text-sm">View All Donations</p> <MoveRight/></button>            
              </div>
              {/* Donation Bars */}
              {donations.map((donation, index) => {
                const progress = (donation.raised / donation.goal) * 100;
                return (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between text-black text-sm mb-1">
                      <span>{donation.name}</span>
                      <div className="flex flex-row gap-4">
                        <span>{donation.raised.toLocaleString()} PHP / {donation.goal.toLocaleString()} PHP</span>
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
            {/* Recent Donors */}
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
          </div> 
          {/* Alumni part */}
          <h2 className="col-span-4 text-2xl font-satoshi-medium -mb-4">More about your Alumni</h2>
        {/* Registered Alumni */}
          <div className={`${dashboardCard} col-span-2 row-span-2 flex flex-col`}>
            {/* Alumni header */}
            <div className="flex flex-row justify-between">
              {/* Registed Alumni count */}
              <div className="flex flex-row items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <p className="font-satoshi-light -mb-1">Registered Alumni</p>
                  <p className="font-satoshi-medium text-4xl">{response.registeredAlumni}</p>
                </div>
              </div>
              {/* View Alumni Statistics */}
              <div>
                <button className="flex flex-row gap-4 items-center cursor-pointer"> <p className="font-satoshi-light text-sm">View All Events</p> <MoveRight/></button>      
              </div>
            </div>
            {/* Alumni Locations and Industries */}
            <div className="mt-3 flex flex-row gap-2">
              {/* Alumni Locations */}
              <div className="flex-1">
                <div className="bg-secondary rounded-2xl px-4 py-1">
                  <p className="font-satoshi-medium">Alumni Locations</p>
                </div>
                <div>
                  {/* Table showing the top locations */}
                <table className="w-full mt-2">
                  <tbody>
                    {alumniLocations.map((location, index) => (
                          <tr key={index} className="flex justify-between px-6 py-1">
                            <td className="text-black font-satoshi-light text-sm">{location.country}</td>
                            <td className="text-primary font-medium text-sm">{location.percentage}</td>
                          </tr>
                        ))}
                  </tbody>
                </table>
                </div>
              </div>
              {/* Alumni Industries */}
              <div className="flex-1/5">
                <div className="bg-secondary rounded-2xl px-4 py-1">
                  <p className="font-satoshi-medium">Alumni Industries</p>
                </div>
                <div className="flex flex-row items-center justify-center">
                  {/* Donut Chart */}
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
                  {/* Legend */}
                  <div>
                    {alumniIndustries.map((entry, index) => (
                      <div key={index} className="flex items-center gap-2 text-gray-800">
                        <span
                          className="inline-block w-3 h-3 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        ></span>
                        <span>{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div> 
        {/* System Engagement */}
          <div className={`${dashboardCard} col-span-2 row-span-2 flex flex-col`}> 
            <div className="flex flex-row justify-between">
              <div className="flex flex-col">
                <h2 className="font-satoshi-medium text-2xl"> System Engagement</h2>  
                <p className="font-satoshi-light text-xs">User visit for the last 30 days</p>
              </div>
              <button className="flex flex-row gap-4 cursor-pointer mt-2"> <p className="font-satoshi-light text-sm">View User Information Reports</p> <MoveRight/></button>      
            </div>
            <div className="flex items-center mt-2">
              <ResponsiveContainer width="90%" height={200}>
                <LineChart data={systemEngagementReport}>
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
          </div> 
        </div>
      </div>
    </div>
  </div>
  </>;
}

export default AdminLanding;
