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
import OtherUserProfile from "./RootPages/OtherUserprofile";

import InterestedUsers from "./RootPages/AlumniPages/job-posting/interestedUsers";
import ReportJobPosting from "./RootPages/AlumniPages/job-posting/reportjobposting";
import EditJobPosting from "./RootPages/AlumniPages/job-posting/editjobposting";
import CreateJobPostAlum from "./RootPages/AlumniPages/job-posting/createJobPostAlum";
import EditJobPostAlum from "./RootPages/AlumniPages/job-posting/editJobPostings";
import JobPostingLanding from "./RootPages/AlumniPages/job-posting/jobPostingLanding";
import AdminIndustryInformation from "./RootPages/AdminPages/Dashboard/adminindustryinformation";
import AdminCountryInformation from "./RootPages/AdminPages/Dashboard/admincountryinformation";
import AdminEventsLayout from "./RootPages/AdminPages/Layouts/AdminEventsLayout";
import AdminCreateEvent from "./RootPages/AdminPages/Events/AdminCreateEvent";
import AdminEventDetails from "./RootPages/AdminPages/Events/AdminEventDetails";
import AdminNewsLetter from "./RootPages/AdminPages/NewsLetter/AdminNewsLetter";
import AdminCreateNewsletter from "./RootPages/AdminPages/NewsLetter/AdminCreateNewsLetter";
import AdminNewsletterDetails from "./RootPages/AdminPages/NewsLetter/AdminNewsletterDetails";


const isSignedIn = !!localStorage.getItem("token");
//const isSignedIn = true;
console.log("isSignedIn:", isSignedIn);



import EventsLanding from "./RootPages/Events/eventslanding";
import EventCardsMain from "./RootPages/Events/eventCardsMain";
import AdminEditNewsletter from "./RootPages/AdminPages/NewsLetter/AdminEditNewletter";


//const isSignedIn = !!localStorage.getItem("token");




function App() {
  function checkType() {
    const User = localStorage.getItem("token");
    // const User = true;
    let tokenType = null;
    if (User) {
      const decoded = jwtDecode(User);
      // console.log("Decoded token:", decoded);
      // tokenType = "admin";
      // tokenType = "student";
      const tokenType = decoded.role; // Adjust this based on your token structure
      console.log("Decoded token type:", tokenType);
      return tokenType;
    } else {
      console.warn("⚠️ No token found in sessionStorage");
    }
  } 

  function checkOnboardedStatus() {
    const User = localStorage.getItem("token");
    // const User = true;
    let tokenType = null;
    if (User) {
      
      const decoded = jwtDecode(User);
      console.log("OSDNFJKDSFJKDSHJFJKDSF ONBOARDED HERE")
      
      const tokenType = decoded.is_onboarded; 
      console.log("is onboarded:", tokenType)
      console.log(decoded)
      return false;
    } else {
      console.warn("⚠️ No token found in sessionStorage");
    }
  } 

  console.log(isSignedIn);
  console.log(checkType())

  return (
    <Routes>
      {/* Check if the user is signed in */}
      {!isSignedIn && (
        <>
          <Route path="login" element={<LoginPage />} />
          <Route
            path="signup"
            element={
              <AppProvider>
                <SignupPage />
              </AppProvider>
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
          <Route path="/" element={<Root />}>
            {checkOnboardedStatus() === true ?

              <>
                <Route path="alumni/dashboard" element={<AlumniLanding />} />
                <Route path="alumni/alumnisearch" element={<AlumniSearch />} />
                <Route path="alumni/profile" element={<UserProfile />} />
                <Route path="alumni/profile/:userId" element={<OtherUserProfile />} />
                <Route path="alumni/donations" element={<DonationLanding />} />
                <Route path="alumni/events" element={<EventsLanding />} />
                <Route path="alumni/events/:eventid" element={<EventCardsMain />} />
                
                <Route path="alumni/donations/:driveid" element={<Donation />} />
                <Route path="alumni/donationforms/:driveid" element={<DonationForm />} />
                <Route path="alumni/jobPosting/interested/:jobid" element={<InterestedUsers />} />
                <Route path="alumni/jobPosting/report/:jobid" element={<ReportJobPosting />} />
                <Route path="alumni/jobPosting/edit/:jobid" element={<EditJobPosting />} />
                <Route path="alumni/jobPosting" element={<JobPostingLanding />} />
                <Route path="alumni/jobPosting/createJobPosting" element={<CreateJobPostAlum />} />

                
                <Route path="alumni/jobPosting/editJobPosting/:jobId" element={<EditJobPostAlum />} />

                <Route path="*" element={<Unauthorized />} />
              </>
              
              :
              // <Route path="alumni/dashboard" element={<AlumniLanding />} />
              <>
              <Route
              path="alumni/dashboard"
              element={
                <OnboardingProvider>
                  <OnBoarding />
                </OnboardingProvider>
              }
              />
              <Route path="*" element={
                <OnboardingProvider>
                  <OnBoarding />
                </OnboardingProvider>
              }
              
              
              />
              </>
            }
            

            
          </Route>
        </>
      )} 

      {isSignedIn && checkType() === "student" && (
        <>
          <Route path="/" element={<Root />}>
            
            
            

            {checkOnboardedStatus() === true ?
              <>
              <Route path="student/dashboard" element={<StudentLanding />} />
              <Route path="student/events" element={<EventsLanding />} />
              <Route path="student/events/:eventid" element={<EventCardsMain />} />
              <Route path="student/alumnisearch" element={<AlumniSearch />} />
              <Route path="student/donations" element={<DonationLanding />} />

              </>
              
              :
              <>
              <Route
              path="student/dashboard"
              element={
                <OnboardingProvider>
                  <OnBoarding />
                </OnboardingProvider>
              }
              />
              <Route path="student/profile" element={<UserProfile />} />
              <Route path="*" element={
                <OnboardingProvider>
                  <OnBoarding />
                </OnboardingProvider>
              } />
              </>
              
            }
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
            </Route>
            <Route path="records" element={<AdminRecordsLayout />}>
              <Route index element={<AdminRecords />} />
              <Route path=":userid" element={<AdminUserDetails />} />
              <Route path="pending-verifications" element={<AdminPendingVerifications />}/>
              <Route path="verification-confirmation/:userid"element={<AdminVerificationConfirmation />}/>
            </Route>
            <Route path="events" element={<AdminEventsLayout />}>
              <Route index element={<AdminEvents/>}/>
              <Route path="create-event" element={<AdminCreateEvent purpose="create"/>}/>
              <Route path="edit-event/:eventid" element={<AdminCreateEvent purpose="edit"/>}/>
              <Route path="event-details/:eventid" element={<AdminEventDetails/>}/>
            </Route>
            <Route path="newsletter" element={<AdminNewsletterLayout />} >
              <Route index element={<AdminNewsLetter/>}/>
              <Route path="create-newsletter" element={<AdminCreateNewsletter/>}/>
              <Route path="newsletter-details" element={<AdminNewsletterDetails/>}/>
              <Route path="newsletter-details/edit-newsletter" element={<AdminEditNewsletter/>}/>  
            </Route>
            <Route path="career" element={<AdminCareerLayout />}>
              <Route index element ={<AdminCareer/>}/>
            </Route>
            <Route path="donations" element={<AdminDonationsLayout />}> 
              <Route index element={<AdminDonations/>} />
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
