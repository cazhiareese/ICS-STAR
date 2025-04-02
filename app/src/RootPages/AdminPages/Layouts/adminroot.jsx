import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Sidebar from "../../../components/AdminComponents/adminsidebar";

import { Home, FileText, Calendar, Newspaper, BriefcaseBusiness, Heart } from "lucide-react";

function AdminRoot() {
  const sidebarItems = [
    { id: "dashboard", title: "Dashboard", icon: <Home size={24} />, path: "dashboard" },
    { id: "records", title: "Records", icon: <FileText size={24} />, path: "records" },
    { id: "events", title: "Events", icon: <Calendar size={24} />, path: "events" },
    { id: "newsletter", title: "Newsletter", icon: <Newspaper size={24} />, path: "newsletter" },
    { id: "career", title: "Career", icon: <BriefcaseBusiness size={24} />, path: "career" },
    { id: "donations", title: "Donations", icon: <Heart size={24} />, path: "donations" },    
  ];

  return (
    <div className="flex flex-col lg:flex-row h-screen">
        {/* Sidebar */}
        <Sidebar sidebarItems={sidebarItems} />
        {/* Content */}
        <div className="h-full overflow-auto">
          <Outlet/>
        </div>
    </div>
  );
}

export default AdminRoot;
