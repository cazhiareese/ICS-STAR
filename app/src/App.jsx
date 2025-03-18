import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import { PersonStanding } from "lucide-react";
import LoginPage from "./AuthPages/Login";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem("User"));

  return (
      <Routes>
        <Route path="/" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
      </Routes>
  );
}

export default App;
