import React, {useState, useEffect} from 'react';
import { MapPin, Phone, IdCard, GraduationCap, Camera, Facebook, Github, Linkedin, Pencil, PlusCircle, XCircle } from "lucide-react";
import prince from '../assets/prince boy.jpg';
import SectionHeader from './Profile/components/sectionheader';
import ProfileSection from './Profile/profilesection';
import UserProfileTabs from './Profile/components/userprofiletabs';
import PersonalInfoSection from './Profile/About/personalinfosection';
import SkillsInterestsSection from './Profile/About/skillsinterestsection';
import AffiliationsSection from './Profile/About/affiliationssection';
import ScholarshipsSection from './Profile/About/scholarshipsection';
import WorkSection from './Profile/Work/worksection';

const token = localStorage.getItem("token");

function UserProfile() {
    const [editMode, setEditMode] = useState(false);
    const [activeTab, setActiveTab] = useState("About"); 
    const [skills, setSkills] = useState([]);
    const [affiliations, setAffiliations] = useState([]);
    const [scholarships, setScholarships] = useState([]);
    const [error, setError] = useState(null);
    const [userDetails, setUserDetails] = useState({});

    //fetch user details from backend
    useEffect(() => {
      const fetchProfile = async () => {
          try {
              if (!token) {
                  setError("User not authenticated");
                  return;
              }
  
              const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
              const response = await fetch(`${API_BASE_URL}/profile`, {
                  method: "GET",
                  headers: {
                      Authorization: `Bearer ${token}`
                  },
              });
  
              if (!response.ok) {
                  if (response.status === 401) {
                      setError("Unauthorized access. Please log in again.");
                      return;
                  }
                  throw new Error("Network response was not ok");
              }
  
              const result = await response.json();
              const data = result.data; // Correctly access 'data.data'
  
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
                github: data.github // Added github
              });
              
  
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
  }, []);

  const addSkills = async (newSkills) => {
    try {
        if (!token) {
            setError("User not authenticated");
            return;
        }

        const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

        // Convert skills array into a query string format
        const queryParams = new URLSearchParams();
        newSkills.forEach(skill => queryParams.append("skills", skill));

        const response = await fetch(`${API_BASE_URL}/add-skills?${queryParams.toString()}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to add skills");
        }

        const result = await response.json();
        console.log(result.message); // "skills added successfully"

        // Update state only after successful API call
        setSkills([...skills, ...newSkills]);
    } catch (err) {
        setError("Failed to add skills");
    }
};

const removeSkill = async (skillToRemove) => {
  try {
    if (!token) {
      setError("User not authenticated");
      return;
    }

    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

    // Send DELETE request to remove the skill with the query parameter format
    const response = await fetch(`${API_BASE_URL}/remove-skill/?skill=${encodeURIComponent(skillToRemove)}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to remove skill");
    }

    const result = await response.json();
    console.log(result.message); // "Skill removed successfully"

    // Update the UI by filtering out the removed skill
    setSkills(skills.filter(skill => skill !== skillToRemove));
  } catch (err) {
    setError("Failed to remove skill");
  }
};


const removeAffiliation = async (affiliationToRemove) => {
  try {
    if (!token) {
      setError("User not authenticated");
      return;
    }

    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

    // Make sure you're sending the affiliation name, not the whole object
    const affiliationName = affiliationToRemove.affiliation || affiliationToRemove;

    // Send DELETE request to remove the affiliation with the query parameter format
    const response = await fetch(`${API_BASE_URL}/remove-affiliation/?affiliation=${encodeURIComponent(affiliationName)}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to remove affiliation");
    }

    const result = await response.json();
    console.log(result.message); // "Affiliation removed successfully"

    // Update the UI by filtering out the removed affiliation
    setAffiliations(affiliations.filter(affiliation => affiliation.affiliation !== affiliationName));
  } catch (err) {
    setError("Failed to remove affiliation");
  }
};

const removeScholarship = async (scholarshipToRemove) => {
  try {
    if (!token) {
      setError("User not authenticated");
      return;
    }

    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

    // Send DELETE request to remove the scholarship
    const response = await fetch(`${API_BASE_URL}/remove-scholarship/?scholarship=${encodeURIComponent(scholarshipToRemove)}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to remove scholarship");
    }

    const result = await response.json();
    console.log(result.message); // "Scholarship removed successfully"

    // Update the UI by filtering out the removed scholarship
    setScholarships(scholarships.filter(scholarship => scholarship !== scholarshipToRemove));
  } catch (err) {
    setError("Failed to remove scholarship");
  }
};




const addAffiliation = async (newAffiliation) => {
  try {
      if (!token) {
          setError("User not authenticated");
          return;
      }

      const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

      // Ensure newAffiliation is an object with 'affiliation' and 'role'
      if (!newAffiliation.affiliation || !newAffiliation.role) {
          setError("Invalid affiliation format");
          return;
      }

      // Convert affiliations & roles into query parameters
      const queryParams = new URLSearchParams();
      queryParams.append("affiliations", newAffiliation.affiliation);
      queryParams.append("roles", newAffiliation.role);

      const response = await fetch(`${API_BASE_URL}/add-affiliations?${queryParams.toString()}`, {
          method: "POST",
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });

      if (!response.ok) {
          throw new Error("Failed to add affiliation");
      }

      const result = await response.json();
      console.log(result.message); // "affiliations added successfully"

      // Update UI only after a successful API call
      setAffiliations([...affiliations, newAffiliation]);
  } catch (err) {
      setError("Failed to add affiliation");
  }
};

const addScholarship = async (newScholarship) => {
  try {
      if (!token) {
          setError("User not authenticated");
          return;
      }

      const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

      // Convert scholarship into query parameters
      const queryParams = new URLSearchParams();
      queryParams.append("scholarships", newScholarship);

      const response = await fetch(`${API_BASE_URL}/add-scholarships?${queryParams.toString()}`, {
          method: "POST",
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });

      if (!response.ok) {
          throw new Error("Failed to add scholarship");
      }

      const result = await response.json();
      console.log(result.message); // "scholarships added successfully"

      // Update UI only after a successful API call
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
            <ProfileSection editMode={editMode} userDetails={userDetails} setEditMode={setEditMode} handleChange={handleChange} />
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
          <PersonalInfoSection editMode={editMode} userDetails={userDetails} handleChange={handleChange}  />    
          <SkillsInterestsSection editMode={editMode} skills={skills} removeSkill={removeSkill} addSkills={addSkills} />
          <AffiliationsSection editMode={editMode} affiliations={affiliations} removeAffiliation={removeAffiliation} addAffiliation={addAffiliation} />
          <ScholarshipsSection editMode={editMode} scholarships={scholarships} removeScholarship={removeScholarship}   addScholarship={addScholarship}/>
    </>)}
    {activeTab === "Work" && <WorkSection userDetails={userDetails} handleChange={handleChange}/>}
        </div>
    );
}

export default UserProfile;