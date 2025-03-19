import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import LoginPage from "./AuthPages/Login";
import StudentLanding from "./RootPages/StudentPages/studentdashboard";
import AdminLanding from "./RootPages/AdminPages/admindashboard";
import AlumniLanding from "./RootPages/AlumniPages/alumnidashboard";
import Root from "./RootPages/Root";

function App() {
  return (
    <Routes>
      {/* Login Page (No Navbar) */}
      <Route path="/" element={<LoginPage />} />

      {/* Routes that include the Navbar */}
      <Route path="/" element={<Root />}>
        <Route path="student" element={<StudentLanding />} />
        <Route path="admin" element={<AdminLanding />} />
        <Route path="alumni" element={<AlumniLanding />} />
      </Route>

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
