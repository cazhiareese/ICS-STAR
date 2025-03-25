import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../../components/AdminComponents/adminsidebar";
import AdminDashboard from "./AdminDashboard";
import AdminRecords from "./AdminRecords";
import AdminEvents from "./AdminEvents";
import AdminNewsletter from "./AdminNewsletter";
import AdminCareer from "./AdminCareer";
import AdminDonations from "./AdminDonations";
import { Home, FileText, Calendar, Newspaper, BriefcaseBusiness, Heart } from "lucide-react";

function AdminRoot() {
  const sidebarItems = [
    { id: "dashboard", title: "Dashboard", icon: <Home size={24} />, path: "/admin/dashboard" },
    { id: "records", title: "Records", icon: <FileText size={24} />, path: "/admin/records" },
    { id: "events", title: "Events", icon: <Calendar size={24} />, path: "/admin/events" },
    { id: "newsletter", title: "Newsletter", icon: <Newspaper size={24} />, path: "/admin/newsletter" },
    { id: "career", title: "Career", icon: <BriefcaseBusiness size={24} />, path: "/admin/career" },
    { id: "donations", title: "Donations", icon: <Heart size={24} />, path: "/admin/donations" },    
  ];

  return (
    <div className="flex flex-col">
      {/* Sidebar */}
      <Sidebar sidebarItems={sidebarItems} />

      {/* Content */}
      <div className="flex-grow">
        <Routes>
          {/* Correct index route */}
          <Route index element={<Navigate to="dashboard" />} />

          {/* Remove "/admin/" prefix from child paths */}
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="records" element={<AdminRecords />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="newsletter" element={<AdminNewsletter />} />
          <Route path="career" element={<AdminCareer />} />
          <Route path="donations" element={<AdminDonations />} />
        </Routes>
      </div>
    </div>
  );
}

export default AdminRoot;
