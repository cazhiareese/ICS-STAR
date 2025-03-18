import React, { useState } from "react";
import { Home, FileText, Calendar, Newspaper, BriefcaseBusiness, Heart, LogOut, CircleUserRound, FileUser, ShieldUser, TriangleAlert, HandCoins, MoveRight, Users, Wallet } from "lucide-react";
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

  const response = {
    pendingVerifications: 28,
    reportedPostings: 5, 
    reportedUsers: 12, 
    fundingRequests: 10,
    registeredAlumni: 542,
  }

  const alumniLocations = [
    { "country": "Philippines", "percentage": "78%" },
    { "country": "United States", "percentage": "22%" },
    { "country": "Canada", "percentage": "18%" },
    { "country": "Australia", "percentage": "12%" },
    { "country": "United Kingdom", "percentage": "9%" }
  ]

  const dashboardCard = "bg-white drop-shadow-sm rounded-2xl p-4";

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
        <div className="flex-1 grid grid-cols-4 grid-rows-[0.5fr_1fr_1fr_1.7fr_0.2fr_2fr] gap-4">
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
          </div> 
        {/* Donations Card */}
          <div className={`${dashboardCard} col-span-4 row-span-1 flex flex-row gap-6`}> 
          {/* Donations */}
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <HandCoins/>
                  <p className="text-2xl "> Donations </p>
                </div>
              <button className="flex flex-row gap-4 items-center cursor-pointer"> <p className="font-satoshi-light text-sm">View All Events</p> <MoveRight/></button>            
              </div>
              {/* TODO: Insert percentage bars here */}
            </div>
            {/* Recent Donors */}
            <div className="flex-1 flex flex-col">
              <p className="text-2xl font-satoshi-medium"> Recent Donors</p>
              {/* TODO: Insert recent donor table here */}
            </div>
          </div> 
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
                {/* TODO: Insert Countries and percent here */}
                </div>
              </div>
              {/* Alumni Industries */}
              <div className="flex-1/5">
                <div className="bg-secondary rounded-2xl px-4 py-1">
                  <p className="font-satoshi-medium">Alumni Industries</p>
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
              <button className="flex flex-row gap-4 cursor-pointer"> <p className="font-satoshi-light text-sm">View User Information Reports</p> <MoveRight/></button>      
            </div>
          </div> 
        </div>
      </div>
    </div>
  </div>
  </>;
}

export default AdminLanding;
