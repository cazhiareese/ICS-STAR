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
  <div className="flex">
    {/* Sidebar */}
    <div className="bg-white h-screen flex-1 flex flex-col gap-3 p-4 pt-20">
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
    <div className="bg-[#F3F1F4] h-screen flex-1/2 grid grid-cols-4 grid-rows-[0.5fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 p-4">

    </div>
  </div>
  </>;
}

export default AdminLanding;
