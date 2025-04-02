import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import LoginPage from "./AuthPages/Login";
import SignupPage from "./AuthPages/Signup";
import StudentLanding from "./RootPages/StudentPages/studentdashboard";
import AlumniLanding from "./RootPages/AlumniPages/alumnidashboard";
import Root from "./RootPages/Root";

// Providers
import { AppProvider } from "./AuthPages/AuthContext/signupcontext";
import { OnboardingProvider } from "./AuthPages/AuthContext/onboardingcontext";
// Admin imports
import AdminRoot from "./RootPages/AdminPages/adminroot";
import AdminDashboard from "./RootPages/AdminPages/admindashboard";
import AdminRecords from "./RootPages/AdminPages/adminrecords";
import AdminEvents from "./RootPages/AdminPages/adminevents";
import AdminNewsletter from "./RootPages/AdminPages/adminnewsletter";
import AdminCareer from "./RootPages/AdminPages/admincareer";
import AdminDonations from "./RootPages/AdminPages/admindonations";
import OnBoarding from "./AuthPages/OnBoarding/mainpanelonboarding";

function App() {
  return (
    <Routes>
      {/* Login Pages (No Navbar) */}
      <Route path="/" element={<LoginPage/>}/>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={
        <AppProvider>
          <SignupPage />
        </AppProvider>
      } />

      <Route path="/setup" element={
        <OnboardingProvider>
          <OnBoarding />
        </OnboardingProvider>
      } />

      {/* Routes that include the Navbar */}
      <Route path="/" element={<Root />}>
        <Route path="student" element={<StudentLanding />} />
        <Route path="alumni" element={<AlumniLanding />} />
        

        {/* Admin Routes */}
        <Route path="admin" element={<AdminRoot />}>
          {/* Redirect to dashboard as default */}
          <Route index element={<Navigate to="dashboard" />} /> 
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="records" element={<AdminRecords />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="newsletter" element={<AdminNewsletter />} />
          <Route path="career" element={<AdminCareer />} />
          <Route path="donations" element={<AdminDonations />} />
        </Route>
      </Route>

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
