import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import LoginPage from "./AuthPages/Login";
import SignupPage from "./AuthPages/Signup";
import StudentLanding from "./RootPages/StudentPages/studentdashboard";
import AlumniLanding from "./RootPages/AlumniPages/alumnidashboard";
import Root from "./RootPages/Root";
import UserProfile from "./RootPages/Userprofile";

// Providers
import { AppProvider } from "./AuthPages/AuthContext/signupcontext";
import { OnboardingProvider } from "./AuthPages/AuthContext/onboardingcontext";
// Admin imports
import AdminRoot from "./RootPages/AdminPages/Layouts/adminroot";
import AdminDashboard from "./RootPages/AdminPages/Dashboard/admindashboard";
import AdminRecords from "./RootPages/AdminPages/Records/adminrecords";
import AdminEvents from "./RootPages/AdminPages/adminevents";
import AdminNewsletter from "./RootPages/AdminPages/adminnewsletter";
import AdminCareer from "./RootPages/AdminPages/admincareer";
import AdminDonations from "./RootPages/AdminPages/admindonations";
import OnBoarding from "./AuthPages/OnBoarding/mainpanelonboarding";

import AdminUserInformationReport from "./RootPages/AdminPages/Dashboard/adminuserinformationreport";
import AdminDashboardLayout from "./RootPages/AdminPages/Layouts/admindashboardlayout";
import AdminRecordsLayout from "./RootPages/AdminPages/Layouts/adminrecordslayout";
import AdminUserDetails from "./RootPages/AdminPages/Records/adminuserdetails";
import AdminPendingVerifications from "./RootPages/AdminPages/Records/adminpendingverifications";
import AdminVerificationConfirmation from "./RootPages/AdminPages/Records/adminverificationconfirmation";
import AlumniSearch from "./RootPages/AlumniPages/alumnisearch";


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
        <Route path="alumni" element={<AlumniLanding />}/> 
        <Route path="alumnisearch" element={<AlumniSearch />} />
        <Route path="profile" element={<UserProfile />} />

        {/* Alumni Routes */}
        <Route path="alumni" element={<AlumniLanding />}/>
        <Route path="alumni/search" element={<AlumniSearch />} />
        

        {/* Admin Routes */}
        <Route path="admin" element={<AdminRoot />}>
        <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<AdminDashboardLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="user-reports" element={<AdminUserInformationReport />} />
          </Route>
          <Route path="records" element={<AdminRecordsLayout />} >
            <Route index element={<AdminRecords/>}/>
            <Route path=":userid" element={<AdminUserDetails/>}/>
            <Route path="pending-verifications" element={<AdminPendingVerifications/>}/>
            <Route path="verification-confirmation/:id" element={<AdminVerificationConfirmation/>}/>
          </Route>
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
