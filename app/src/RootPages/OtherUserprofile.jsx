import React, { useState, useEffect } from "react";
import ProfileSection from "./Profile/profilesection";
import UserProfileTabs from "./Profile/components/userprofiletabs";
import PersonalInfoSection from "./Profile/About/personalinfosection";
import SkillsInterestsSection from "./Profile/About/skillsinterestsection";
import AffiliationsSection from "./Profile/About/affiliationssection";
import ScholarshipsSection from "./Profile/About/scholarshipsection";
import WorkSection from "./Profile/Work/worksection";
import DonationHistoryUser from "./Profile/DonationHistory/Donationhistoryuser";
import { useParams } from "next/navigation";

import {
  fetchProfile as apiFetchProfile,
  addSkills as apiAddSkills,
  removeSkill as apiRemoveSkill,
  addAffiliation as apiAddAffiliation,
  removeAffiliation as apiRemoveAffiliation,
  addScholarship as apiAddScholarship,
  removeScholarship as apiRemoveScholarship,
  fetchPublicProfileById as apiFetchPublicProfile
} from "./Profile/UserProfileAPI/userProfileApi"; 
import { useParams } from "react-router-dom";
import OtherProfileSection from "./Profile/otherprofilesection";
import OtherSkillsInterestsSection from "./Profile/About/othersskillsandinterestsection";
import OtherAffiliationsSection from "./Profile/About/otheraffiliationsection";
import OtherScholarshipsSection from "./Profile/About/otherscholarshipsection";


const token = localStorage.getItem("token");

function OtherUserProfile() {
  const params = useParams();
  const userId = params?.userId;

  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("About");
  const [skills, setSkills] = useState([]);
  const [affiliations, setAffiliations] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [error, setError] = useState(null);
  const [userDetails, setUserDetails] = useState({});

  //fetch user details from backend
  useEffect(() => {
    if (!userId){
      console.log("nothing")
      return;
    } 

    const fetchProfile = async () => {
      try {
        const data = await apiFetchPublicProfile({ userId }); // Correctly access 'data.data'

        setUserDetails({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          user_type: data.user_type,
          location: `${data.city}, ${data.state}`,
          city: data.city,
          state: data.state,
          country: data.country, // Added country
          mobile_number: data.mobile_number,
          student_number: data.student_number,
          age: data.age, // Added age
          gender: data.gender, // Added gender
          marital_status: data.marital_status, // Added marital_status
          image: data.image, // Added image
          position: data.position, // Added position
          is_banned: data.is_banned, // Added is_banned
          standing: data.standing, // Added standing
          graduation_year: data.graduation_year,
          graduation_semester: data.graduation_semester,
          employment_status: data.employment_status,
          industry: data.industry,
          job_title: data.job_title,
          company_name: data.company_name,
          work_location: data.work_location,
          work_mode: data.work_mode,
          employer_class: data.employer_class,
          tenured_status: data.tenured_status,
          salary_grade: data.salary_grade,
          facebook: data.facebook, // Added facebook
          linkedin: data.linkedin, // Added linkedin
          github: data.github, // Added github
        });

        console.log(userDetails)

        // Set skills, scholarships, and affiliations
        setSkills(data.skills || []);
        console.log(data.skills);
        setScholarships(data.scholarships || []);
        setAffiliations(data.affiliations || []);
        console.log(data.affiliations);
      } catch (err) {
        setError("Failed to load profile");
      }
    };

    fetchProfile();
  }, [userId]);

  const addSkills = async (newSkills) => {
    try {
      await apiAddSkills(newSkills); // Call the API function to add skills
      console.log("Skills added successfully");
      setSkills([...skills, ...newSkills]);
    } catch (err) {
      setError("Failed to add skills");
    }
  };

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
      setAffiliations(
        affiliations.filter(
          (affiliation) => affiliation.affiliation !== affiliationName
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
  console.log(localStorage.getItem("token"));
  return (
    <div className="flex flex-col items-center relative h-[965px] mt-10 gap-y-4 px-4 sm:px-6 lg:px-0">
      {/* Profile Section */}
      <OtherProfileSection
        editMode={editMode}
        userDetails={userDetails}
        setEditMode={setEditMode}
        handleChange={handleChange}
        userPicture={userDetails.image}
      />
      {userDetails.user_type === "alumni" && (
        <>
          {/* Navigation Tabs */}
          <UserProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

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
          <OtherSkillsInterestsSection
            editMode={editMode}
            skills={skills}
            removeSkill={removeSkill}
            addSkills={addSkills}
          />
          <OtherAffiliationsSection
            editMode={editMode}
            affiliations={affiliations}
            removeAffiliation={removeAffiliation}
            addAffiliation={addAffiliation}
          />
          <OtherScholarshipsSection
            editMode={editMode}
            scholarships={scholarships}
            removeScholarship={removeScholarship}
            addScholarship={addScholarship}
          />
        </>
      )}
      {activeTab === "Work" && (
        <WorkSection userDetails={userDetails} handleChange={handleChange} />
      )}
      {activeTab === "Donation History" && (
        <DonationHistoryUser userDetails={userDetails} />
      )}
    </div>
  );
}

export default OtherUserProfile;
