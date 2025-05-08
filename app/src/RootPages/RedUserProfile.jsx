import React, { useState, useEffect } from "react";
import ProfileSection from "./Profile/profilesection";
import UserProfileTabs from "./Profile/components/userprofiletabs";
import PersonalInfoSection from "./Profile/About/personalinfosection";
import SkillsInterestsSection from "./Profile/About/skillsinterestsection";
import AffiliationsSection from "./Profile/About/affiliationssection";
import ScholarshipsSection from "./Profile/About/scholarshipsection";
import WorkSection from "./Profile/Work/worksection";
import DonationHistoryUser from "./Profile/DonationHistory/Donationhistoryuser";
import { Info, Check } from "lucide-react";
import JobPosted from "./Profile/JobPosting/userjobposting";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import { useParams } from "react-router-dom";
import AdminProfileSection from "./Profile/reddprofilesection";
import AdminBack from "../components/AdminComponents/AdminBack";


import {
  fetchProfile as apiFetchProfile,
  addSkills as apiAddSkills,
  removeSkill as apiRemoveSkill,
  addAffiliation as apiAddAffiliation,
  removeAffiliation as apiRemoveAffiliation,
  addScholarship as apiAddScholarship,
  removeScholarship as apiRemoveScholarship,
} from "./Profile/UserProfileAPI/userProfileApi"; 
import AlumniTransitionModal from "../components/AdminComponents/AlumniTransitionModal";



const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;




function ReddUserProfile() {
  const id = useParams();
  console.log("naku",id);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("About");
  const [skills, setSkills] = useState([]);
  const [affiliations, setAffiliations] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [error, setError] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [share, setShare] = useState(null)  
  const [userId, setUserId] = useState(null);

      const [showAlumniModal, setShowAlumniModal] = useState(false);
      const [makeAlumniLoading, setMakeAlumniLoading] = useState(false);
      const [transitionComplete, setTransitionComplete] = useState(false);
                                  //palitan nyo ito, lagay sa props kung sino ang user na gusto nyong ipakita
  //fetch user details from backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    const cyrus = sessionStorage.getItem("token");
    console.log("cyrus",cyrus);
    console.log(token);
const decoded = jwtDecode(token);
const tokentype = decoded.role;
console.log(decoded);
console.log("Decoded token typee:", tokentype);

console.log("unang id",id);
//needs to fixed si janry ay userId, si redd ay userd


const userIdFromURL = id.userId; // id is from useParams()
console.log("User ID from URL:", userIdFromURL);
const loggedInUserId = decoded.sub;
console.log("Logged-in User ID:", loggedInUserId);


setShare(true);
const user_id = userIdFromURL && !share ? userIdFromURL : loggedInUserId;
setUserId(userIdFromURL); // Set the user ID in state
console.log("Final user ID:", user_id);




const fetchUserProfileData = async () => {
  try {
    // Fetch personal information
    const personalResponse = await axios.get(`${API_BASE_URL}/profile/${user_id}/personal-information`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const personalData = personalResponse.data.data;
    console.log("Personal Infoss:", personalData);

    // Fetch work information
    const workResponse = await axios.get(`${API_BASE_URL}/profile/${user_id}/work`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const verifyResponse = await axios.get(`${API_BASE_URL}/${user_id}/status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const verifyData = verifyResponse.data.status;

    const workData = workResponse.data.data;



    // Set combined user details
    setUserDetails({
      // Personal Info
      city: personalData.city,
      country: personalData.country,
      email: personalData.email,
      facebook: personalData.facebook,
      linkedin: personalData.linkedin,
      github: personalData.github,
      first_name: personalData.first_name,
      last_name: personalData.last_name,
      state: personalData.state,
      marital_status: personalData.marital_status,
      mobile_number: personalData.mobile_number,
      graduation_year: personalData.graduation_year,
      graduation_semester: personalData.graduation_semester,
      student_number: personalData.student_number,

      // Decoded Token Info
      is_banned: verifyData.is_banned,
      is_verified: verifyData.is_verified,
      user_type: verifyData.user_type,

      // Work Info (example fields, customize as needed)
           employment_status: workData.employment_status,
           industry: workData.industry,
           job_title: workData.job_title,
          company_name: workData.company_name,
          work_location: workData.work_location,
           work_mode: workData.work_mode,
          employer_class: workData.employer_class,
          tenured_status: workData.tenured_status,
           salary_grade: workData.salary_grade,
    });

  } catch (error) {
    console.error("Error fetching user profile data:", error);
    throw error;
  }
};


    const fetchskills = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/profile/${user_id}/skills`, {
          headers: {
            'Authorization': `Bearer ${token}`  // replace with actual token logic
          }
        });
        const data = response.data.data;
        setSkills(data|| []);
      } catch (error) {
        console.error('Error fetching personal information:', error);
        throw error;
      }
    };

    const fetchaffiliations = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/profile/${user_id}/affiliations`, {
          headers: {
            'Authorization': `Bearer ${token}`  // replace with actual token logic
          }
        });
        const data = response.data.data;
        console.log("Affiliations Data:", data); // Debugging line
        setAffiliations(data|| []);
        console.log("hi",affiliations)
      } catch (error) {
        console.error('Error fetching personal information:', error);
        throw error;
      }
    };

    const fetchscholarships = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/profile/${user_id}/scholarships`, {
          headers: {
            'Authorization': `Bearer ${token}`  // replace with actual token logic
          }
        });
        const data = response.data.data;
        setScholarships(data|| []);
        console.log(affiliations)
      } catch (error) {
        console.error('Error fetching personal information:', error);
        throw error;
      }
    };

    // const fetchProfile = async () => {
    //   try {
    //     const data = await apiFetchProfile(); // Correctly access 'data.data'
    //     console.log(data);

    //     setUserDetails({
    //       first_name: data.first_name,
    //       last_name: data.last_name,
    //       email: data.email,
    //       user_type: data.user_type,
    //       location: `${data.city}, ${data.state}`,
    //       city: data.city,
    //       state: data.state,
    //       country: data.country, // Added country
    //       mobile_number: data.mobile_number,
    //       student_number: data.student_number,
    //       age: data.age, // Added age
    //       gender: data.gender, // Added gender
    //       marital_status: data.marital_status, // Added marital_status
    //       image: data.image, // Added image
    //       position: data.position, // Added position
    //       is_banned: data.is_banned, // Added is_banned
    //       is_verified: data.is_verified, // Added is_verified
    //       standing: data.standing, // Added standing
    //       graduation_year: data.graduation_year,
    //       graduation_semester: data.graduation_semester,
    //       employment_status: data.employment_status,
    //       industry: data.industry,
    //       job_title: data.job_title,
    //       company_name: data.company_name,
    //       work_location: data.work_location,
    //       work_mode: data.work_mode,
    //       employer_class: data.employer_class,
    //       tenured_status: data.tenured_status,
    //       salary_grade: data.salary_grade,
    //       facebook: data.facebook, // Added facebook
    //       linkedin: data.linkedin, // Added linkedin
    //       github: data.github, // Added github
    //     });

    //     // Set skills, scholarships, and affiliations
    //     setSkills(data.skills || []);
    //     setScholarships(data.scholarships || []);
    //     setAffiliations(data.affiliations || []);
    //     setIsLoading(false);
    //   } catch (err) {
    //     setError("Failed to load profile");
    //   }
    // };

    fetchUserProfileData();
    fetchskills();
    fetchaffiliations();
    fetchscholarships();
  console.log(userDetails);
    setIsLoading(false);
  }, []);

  const addSkills = async (newSkills) => {
    try {
      await apiAddSkills(newSkills); // Call the API function to add skills
      console.log("Skills added successfully");
      setSkills([...skills, ...newSkills]);
    } catch (err) {
      setError("Failed to add skills");
    }
  };

  async function makeAlumni() {
    const token = localStorage.getItem("token");
    setMakeAlumniLoading(true);
    try {
      await axios.put(`${API_BASE_URL}/admin/transition/${userId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransitionComplete(true);
    } catch (error) {
      console.error("Error transitioning to alumni:", error);
      setError("Failed to transition to alumni");
    } finally {
      setMakeAlumniLoading(false);
    }
  }
 

  const removeSkill = async (skillToRemove) => {
    try {
      await apiRemoveSkill(skillToRemove); // Call the API function to remove skill
      console.log("Skill removed successfully");
      // Update the UI by filtering out the removed skill
      setSkills(skills.filter((skill) => skill !== skillToRemove));
    } catch (err) {
      setError("Failed to remove skill");
    }
  };

  const removeAffiliation = async (affiliationToRemove) => {
    try {
      await apiRemoveAffiliation(affiliationToRemove); // Call the API function to remove affiliation
      console.log("Affiliation removed successfully");
      console.log(affiliations);
      setAffiliations(
        affiliations.filter(
          (affiliation) => affiliation !== affiliationToRemove
        )
        
      );
    } catch (err) {
      setError("Failed to remove affiliation");
    }
  };

  const removeScholarship = async (scholarshipToRemove) => {
    try {
      await apiRemoveScholarship(scholarshipToRemove); // Call the API function to remove scholarship
      console.log("Scholarship removed successfully");
      setScholarships(
        scholarships.filter(
          (scholarship) => scholarship !== scholarshipToRemove
        )
      );
    } catch (err) {
      setError("Failed to remove scholarship");
    }
  };

  const addAffiliation = async (newAffiliation) => {
    try {
      await apiAddAffiliation(newAffiliation); // Call the API function to add affiliation
      console.log("Affiliation added successfully");
      setAffiliations([...affiliations, newAffiliation]);
    } catch (err) {
      setError("Failed to add affiliation");
    }
  };

  const addScholarship = async (newScholarship) => {
    try {
      await apiAddScholarship(newScholarship); // Call the API function to add scholarship
      console.log("Scholarship added successfully");
      setScholarships([...scholarships, newScholarship]);
    } catch (err) {
      setError("Failed to add scholarship");
    }
  };

  const handleChange = (e, field) => {
    setUserDetails({ ...userDetails, [field]: e.target.value });
  };
  console.log("User Details:", userDetails);
  console.log("iddddd",userId);
  return (
    <div className="flex flex-col items-center relative h-[965px] mt-10 gap-y-4 px-4 sm:px-6 lg:px-0">
    {/* Left-aligned section for Back button and Records header */}
<div className="w-full max-w-[1100px]">
  {/* Row 1: Back button on its own line */}
  <div className="mb-3">
    <AdminBack label={'Back'} />
  </div>

  {/* Row 2: Header on the left, Button on the right */}
  <div className="flex justify-between items-center mb-2">
    <h1 className="text-primary font-satoshi-bold text-5xl">Records</h1>

    {userDetails.user_type === "student" && (
      <button
        className="flex items-center bg-success text-white text-md font-satoshi-regular gap-2 rounded-3xl px-4 py-2 cursor-pointer"
        onClick={() => setShowAlumniModal(true)}
      >
        <Check size={20} />
        <p>Make Alumni</p>
      </button>
    )}
  </div>
</div>

      {/* Profile Section */}
      <AdminProfileSection
        activeTab={activeTab}
        editMode={editMode}
        userDetails={userDetails}
        setEditMode={setEditMode}
        handleChange={handleChange}
        share={share} // Pass share prop to ProfileSection
        userId={userId} // Pass userId to ProfileSection
      />
      {userDetails.user_type === "alumni" && share && (
        <>
          {/* Navigation Tabs */}
          <UserProfileTabs userDetails={userDetails} editMode = {editMode} activeTab={activeTab} setActiveTab={setActiveTab} share={share} admin={true} />

          {/* Information Sections */}
        </>
      )}
      {/* Conditional Rendering Based on Tab Selection */}
      {activeTab === "About" && (
        <>
          <PersonalInfoSection
            editMode={editMode}
            userDetails={userDetails}
            handleChange={handleChange}
          />
          <SkillsInterestsSection
            editMode={editMode}
            skills={skills}
            removeSkill={removeSkill}
            addSkills={addSkills}
            isLoading={isLoading}
            isVerified={userDetails?.is_verified}
            share={share} // Pass share prop to SkillsInterestsSection
          />
          <AffiliationsSection
            editMode={editMode}
            affiliations={affiliations}
            removeAffiliation={removeAffiliation}
            addAffiliation={addAffiliation}
            isLoading={isLoading}
            isVerified={userDetails?.is_verified}
            share={share} // Pass share prop to AffiliationsSection
          />
          <ScholarshipsSection
            editMode={editMode}
            scholarships={scholarships}
            removeScholarship={removeScholarship}
            addScholarship={addScholarship}
            isLoading={isLoading}
            isVerified={userDetails?.is_verified}
            share={share} // Pass share prop to ScholarshipsSection
          />
        </>
      )}
      {activeTab === "Work" && (
        <WorkSection userDetails={userDetails} handleChange={handleChange} isVerified={userDetails?.is_verified} />
      )}
      {activeTab === "Donation History" && (
        <DonationHistoryUser userDetails={userDetails} user_id={userId} />
      )}
      {activeTab === "Job Posted" && (
        <JobPosted />
      )}

    <AlumniTransitionModal
        isOpen={showAlumniModal}
        onClose={() => {
          setShowAlumniModal(false);
          setTransitionComplete(false);
          if (transitionComplete) window.location.reload();
        }}
        onConfirm={makeAlumni}
        isLoading={makeAlumniLoading}
        isComplete={transitionComplete}
/> 
    </div>
  );
}

export default ReddUserProfile;
