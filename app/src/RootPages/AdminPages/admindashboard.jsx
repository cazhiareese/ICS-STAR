import React, { useState } from "react";
import { Home, FileText, Calendar, Newspaper, BriefcaseBusiness, Heart, LogOut } from "lucide-react";
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

  const dashboardCard = "bg-white drop-shadow-sm rounded-2xl";

  return <>
  <div className="flex h-screen w-screen">
    {/* Sidebar */}
    <div className="bg-white h-screen flex flex-col gap-3 px-4 pt-20 min-w-56">
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
    {/* Dashboard */}
    <div>
      <div className="bg-[#F3F1F4] h-screen w-full grid grid-cols-4 grid-rows-[0.5fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 p-4">
        {/* Dashboard Banner */}
        <div className="col-span-4 row-start-1 rounded-2xl bg-cover bg-center bg-no-repeat bg-[url('/assets/DashboardBanner.svg')] flex items-center justify-between"> 
          <p className="text-white font-satoshi-bold text-2xl ml-5"> Dashboard </p>
          <p className="text-white font-satoshi-light mr-52"> Bridging Alumni across the Cosmos </p>
        </div> 
        {/* Pending Verifications */}
        <div className={`${dashboardCard} col-start-1 row-start-2`}> Pending Verifications </div> 
        {/* Reported Postings */}
        <div className={`${dashboardCard} cols-start-2 row-start-2`}> Reported Postings </div> 
        {/* Reported Users */}
        <div className={`${dashboardCard} cols-start-1 row-start-3`}> Reported Users </div> 
        {/* Funding Requests */}
        <div className={`${dashboardCard} cols-start-2 row-start-3`}> Funding Requests </div> 
        {/* Upcoming Events */}
        <div className={`${dashboardCard} col-span-2 row-span-2`}> Upcoming Events </div> 
        {/* Donations */}
        <div className={`${dashboardCard} col-span-4 row-start-4`}> Donations </div> 
        {/* Registered Alumni */}
        <div className={`${dashboardCard} col-span-2 row-span-2`}> Registered Alumni </div> 
        {/* System Engagement */}
        <div className={`${dashboardCard} col-span-2 row-span-2`}> System Engagement </div> 
      </div>
    </div>
  </div>
  </>;
}

export default AdminLanding;
