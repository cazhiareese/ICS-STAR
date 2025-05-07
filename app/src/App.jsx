import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import LoginPage from "./AuthPages/Login";
import SignupPage from "./AuthPages/Signup";
import StudentLanding from "./RootPages/StudentPages/studentdashboard";
import AlumniLanding from "./RootPages/AlumniPages/alumnidashboard";
import Root from "./RootPages/Root";
import UserProfile from "./RootPages/Userprofile";
import Unauthorized from "./AuthPages/Unauthorized";
import OnboardingDashboard from "./AuthPages/OnBoarding/dashboard_onboarding";
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';


// Providers
import { AppProvider } from "./AuthPages/AuthContext/signupcontext";
import { OnboardingProvider } from "./AuthPages/AuthContext/onboardingcontext";
// Admin imports
import AdminRoot from "./RootPages/AdminPages/Layouts/adminroot";
import AdminDashboard from "./RootPages/AdminPages/Dashboard/admindashboard";
import AdminRecords from "./RootPages/AdminPages/Records/adminrecords";
import AdminEvents from "./RootPages/AdminPages/Events/AdminEvents";
import AdminNewsletterLayout from "./RootPages/AdminPages/Layouts/adminnewsletter";
import AdminCareer from "./RootPages/AdminPages/Careers/AdminCareer";
import AdminDonations from "./RootPages/AdminPages/Donations/admindonations";
import OnBoarding from "./AuthPages/OnBoarding/mainpanelonboarding";

import AdminDashboardLayout from "./RootPages/AdminPages/Layouts/admindashboardlayout";
import AdminRecordsLayout from "./RootPages/AdminPages/Layouts/adminrecordslayout";
import AdminUserDetails from "./RootPages/AdminPages/Records/adminuserdetails";
import AdminPendingVerifications from "./RootPages/AdminPages/Records/adminpendingverifications";
import AdminVerificationConfirmation from "./RootPages/AdminPages/Records/adminverificationconfirmation";

import AlumniSearch from "./RootPages/AlumniPages/alumnisearch";
import DonationLanding from "./RootPages/AlumniPages/Donation.jsx/donationlanding";
import AdminBatchInformation from "./RootPages/AdminPages/Dashboard/adminbatchinformation";
import AdminAlumniInfo from "./RootPages/AdminPages/Dashboard/adminalumniinfo";
import Donation from "./components/donationInfo";

import AdminDonationsLayout from "./RootPages/AdminPages/Layouts/admindonationslayout";
import AdminDonationInformation from "./RootPages/AdminPages/Donations/admindonationinformation";
import AdminCreateDonationDrive from "./RootPages/AdminPages/Donations/admincreatedonationdrive";
import AdminHelpIcs from "./RootPages/AdminPages/Donations/adminhelpics";
import AdminPendingDonations from "./RootPages/AdminPages/Donations/adminpendingdonations";
import AdminCareerLayout from "./RootPages/AdminPages/Layouts/admincareerlayout";

import { jwtDecode } from "jwt-decode";
import DonationForm from "./RootPages/AlumniPages/Donation.jsx/donationform";
import AdminDonationDriveDemographics from "./RootPages/AdminPages/Donations/admindonationdrivedemographics";


import InterestedUsers from "./RootPages/AlumniPages/job-posting/interestedUsers";
import ReportJobPosting from "./RootPages/AlumniPages/job-posting/reportjobposting";
import CreateJobPostAlum from "./RootPages/AlumniPages/job-posting/createJobPostAlum";
import EditJobPostAlum from "./RootPages/AlumniPages/job-posting/editJobPostings";
import JobPostingLanding from "./RootPages/AlumniPages/job-posting/jobPostingLanding";
import AdminIndustryInformation from "./RootPages/AdminPages/Dashboard/adminindustryinformation";
import AdminCountryInformation from "./RootPages/AdminPages/Dashboard/admincountryinformation";
import AdminEventsLayout from "./RootPages/AdminPages/Layouts/AdminEventsLayout";
import AdminCreateEvent from "./RootPages/AdminPages/Events/AdminCreateEvent";
import AdminEventDetails from "./RootPages/AdminPages/Events/AdminEventDetails";

import NewsletterLanding from "./RootPages/AlumniPages/Newsletter/newsletterlanding";
import Newsletter from "./RootPages/AlumniPages/Newsletter/newsletter";

import AdminNewsLetter from "./RootPages/AdminPages/NewsLetter/AdminNewsLetter";
import AdminCreateNewsletter from "./RootPages/AdminPages/NewsLetter/AdminCreateNewsLetter";
import AdminNewsletterDetails from "./RootPages/AdminPages/NewsLetter/AdminNewsletterDetails";


const isSignedIn = !!localStorage.getItem("token");
//const isSignedIn = true;

console.log("isSignedIn:", isSignedIn);



import EventsLanding from "./RootPages/Events/eventslanding";
import EventCardsMain from "./RootPages/Events/eventCardsMain";
import AdminEventDemographics from "./RootPages/AdminPages/Events/AdminEventDemographics";
import AdminEditNewsletter from "./RootPages/AdminPages/NewsLetter/AdminEditNewletter";
import AdminDonationsInsights from "./RootPages/AdminPages/Donations/AdminDonationsInsights";
import AdminUserReports from "./RootPages/AdminPages/Layouts/adminuserreports";
import MostEngagedJobs from "./RootPages/AdminPages/Layouts/mostengagedjobs";


import GuestLanding from "./RootPages/GuestPages/guestlanding";
import AccountSettings from "./RootPages/Account/accountsettings";
//const isSignedIn = !!localStorage.getItem("token");
import ReddUserProfile from "./RootPages/RedUserProfile";
import JanryUserProfile from "./RootPages/JanryUserProfile";


function App() {
  const clientId = import.meta.env.VITE_CLIENT_ID
  function checkType() {
    const User = localStorage.getItem("token");
    //const User = true;
    let tokenType = null;
    if (User) {
      const decoded = jwtDecode(User);
      console.log("Decoded token:", decoded);
      //tokenType = "admin";
      //tokenType = "alumni";
      const tokenType = decoded.role; // Adjust this based on your token structure
      console.log("Decoded token type:", tokenType);
      return tokenType;
    } else {
      console.warn("⚠️ No token found in sessionStorage");
    }
  }

  function isOnboarded() {
    const User = localStorage.getItem("token");
    //const User = true;
    let tokenType = null;
    if (User) {
      const decoded = jwtDecode(User);
      console.log("Decoded token:", decoded);
      //tokenType = "admin";
      //tokenType = "alumni";
      const onBoarding = decoded.is_onboarded; // Adjust this based on your token structure
      const verified = decoded.is_verified
      console.log("Decoded token type:", tokenType);

      console.log
      if (onBoarding && verified){    
        return true
      } else if (!verified){
        return true
      }
        return false
    } else {
      console.warn("⚠️ No token found in sessionStorage");
    }
  }


  console.log(isSignedIn);

  return (
    <Routes>
      <Route path="/" element={<Navigate to={isSignedIn ? "/login" : "login"} />} />

      {/* Check if the user is signed in */}
      {!isSignedIn && (
        <>
       
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="login" element={ 
            <GoogleOAuthProvider clientId={clientId}>
            <AppProvider>
              <LoginPage />
            </AppProvider>
            </GoogleOAuthProvider>} />
          <Route
            path="signup"
            element={
              <GoogleOAuthProvider clientId={clientId}>
              <AppProvider>
                <SignupPage />
              </AppProvider>
              </GoogleOAuthProvider>
            }
          />

          <Route
            path="setup"
            element={ 
              <OnboardingProvider>
                
                <OnBoarding />
              </OnboardingProvider>
            }
          />
          
        </>
      )}
      
      {isSignedIn && checkType() === "alumni" && (
        <>
          {isOnboarded()?
           <>
          <Route path="/" element={<Root />}>
            <Route path="alumni/dashboard" element={<AlumniLanding />} />
            <Route path="alumni/account/settings" element={<AccountSettings />} />
            <Route path="alumni/alumnisearch" element={<AlumniSearch />} />
            <Route path="alumni/profile" element={<UserProfile />} />
            <Route path="alumni/profile/:userId" element={<JanryUserProfile />} />
            <Route path="alumni/donations" element={<DonationLanding />} />
            <Route path="alumni/events" element={<EventsLanding />} />
            <Route path="alumni/events/:eventid" element={<EventCardsMain />} />
            
            <Route path="alumni/donations/:driveid" element={<Donation />} />
            <Route path="alumni/donationforms/:driveid" element={<DonationForm />} />
            <Route path="alumni/jobPosting/interested/:jobid" element={<InterestedUsers />} />
            <Route path="alumni/jobPosting/report/:jobid" element={<ReportJobPosting />} />
            <Route path="alumni/jobPosting" element={<JobPostingLanding />} />
            <Route path="alumni/jobPosting/createJobPosting" element={<CreateJobPostAlum />} />

            
            <Route path="alumni/jobPosting/edit/:jobid" element={<EditJobPostAlum />} />
            <Route path="alumni/newsletter" element={<NewsletterLanding />} />
            <Route path="alumni/newsletter/:newsletterid" element={<Newsletter />} />

            <Route path="*" element={<LoginPage />} />


          </Route>
          </>
          :
          <Route
              path="*"
              element={
                <OnboardingProvider>
                  <OnboardingDashboard />
                </OnboardingProvider>
              }
            
            />
         } 
        </>
      )} 

      {isSignedIn && checkType() === "student" && (
        <>
          {isOnboarded() ?
          <>
            <Route path="/" element={<Root />}>
            <Route path="student/dashboard" element={<StudentLanding />} />
            <Route path="student/account/settings" element={<AccountSettings />} />
            <Route path="student/events" element={<EventsLanding />} />
            <Route path="students/events/:eventid" element={<EventCardsMain />} />
            <Route path="student/alumnisearch" element={<AlumniSearch />} />
            <Route path="student/profile" element={<UserProfile />} />
            <Route path="student/profile/:userId" element={<JanryUserProfile />} />
            <Route path="student/newsletter" element={<NewsletterLanding />} />
            <Route path="student/newsletter/:newsletterid" element={<Newsletter />} />
            <Route path="student/jobPosting/interested/:jobid" element={<InterestedUsers />} />
            <Route path="student/jobPosting/report/:jobid" element={<ReportJobPosting />} />
            <Route path="student/jobPosting" element={<JobPostingLanding />} />
            <Route path="*" element={<LoginPage />} />
          </Route>
          </>
           : 
            <Route
              path="*"
              element={
                <OnboardingProvider>
                  <OnboardingDashboard />
                </OnboardingProvider>
                
              }
              />
         }
        </>
      )}

      {!isSignedIn  && (
        <>
          <Route path="/" element={<Root />}>
            <Route path="guest/dashboard" element={<GuestLanding />} />
            <Route path="guest/events" element={<EventsLanding />} />
            <Route path="guest/events/:eventid" element={<EventCardsMain />} />
            <Route path="guest/newsletter" element={<NewsletterLanding />} />
            <Route path="guest/newsletter/:newsletterid" element={<Newsletter />} />
            <Route path="*" element={<Navigate to="/login" replace />} />

          </Route>
        </>
      )}

      {isSignedIn && checkType() === "admin" && (
        <>
          {/* Admin Routes */}
          <Route path="admin" element={<AdminRoot />}>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<AdminDashboardLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="alumni-report" element={<AdminAlumniInfo />} />
              <Route path="batch-reports/:batch" element={<AdminBatchInformation/>}/>
              <Route path="industry-reports" element={<AdminIndustryInformation/>}/>
              <Route path="country-reports" element={<AdminCountryInformation/>}/>
              <Route path="user-engagement-reports" element={<AdminUserReports/>}/>
              <Route path="user-engagement-reports/most-engaged-job-offers" element={<MostEngagedJobs/>}/>
            </Route>
            <Route path="records" element={<AdminRecordsLayout />}>
              <Route index element={<AdminRecords />} />
              <Route path=":userId" element={<ReddUserProfile />} />
              <Route path="pending-verifications" element={<AdminPendingVerifications />}/>
              <Route path="verification-confirmation/:userid"element={<AdminVerificationConfirmation />}/>
            </Route>
            <Route path="events" element={<AdminEventsLayout />}>
              <Route index element={<AdminEvents/>}/>
              <Route path="create-event" element={<AdminCreateEvent purpose="create"/>}/>
              <Route path="edit-event/:eventid" element={<AdminCreateEvent purpose="edit"/>}/>
              <Route path="event-details/:eventid" element={<AdminEventDetails/>}/>
              <Route path="event-demographics/:eventid" element={<AdminEventDemographics/>}/>
            </Route>
            <Route path="newsletter" element={<AdminNewsletterLayout />} >
              <Route index element={<AdminNewsLetter/>}/>
              <Route path="create-newsletter" element={<AdminCreateNewsletter/>}/>
              <Route path="newsletter-details/:id" element={<AdminNewsletterDetails/>}/>
              <Route path="newsletter-details/:newsletter_id/edit-newsletter" element={<AdminEditNewsletter/>}/>  
            </Route>
            <Route path="career" element={<AdminCareerLayout />}>
              <Route index element ={<AdminCareer/>}/>
            </Route>
            <Route path="donations" element={<AdminDonationsLayout />}> 
              <Route index element={<AdminDonations/>} />
              <Route path="insights" element={<AdminDonationsInsights/>}/>
              <Route path=":driveid" element={<AdminDonationInformation/>}/>
              <Route path="create-donation-drive" element={<AdminCreateDonationDrive/>}/>
              <Route path="help-ics/" element={<AdminHelpIcs/>}/>
              <Route path="pending-donations/:driveid" element={<AdminPendingDonations/>}/>
              <Route path="donation-drive-demographics/:driveid" element={<AdminDonationDriveDemographics/>} />
            </Route>
          </Route>
        </>
      )}

      {/* Redirect unknown routes */}
      <Route path="*" element={<LoginPage />} />
    </Routes>

  );
}

export default App;
