import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import { PersonStanding } from "lucide-react";
import LoginPage from "./AuthPages/Login";
import StudentLanding from "./RootPages/StudentPages/studentdashboard";
import AdminLanding from "./RootPages/AdminPages/admindashboard";
import AlumniLanding from "./RootPages/AlumniPages/alumnidashboard";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem("User"));

  return (
      <Routes>
        <Route path="/" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/student" element={<StudentLanding />} />
        <Route path="/admin" element={<AdminLanding />} />
        <Route path="/alumni" element={<AlumniLanding />} />
      </Routes>
  );
}

export default App;
