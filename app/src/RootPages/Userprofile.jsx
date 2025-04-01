import React, {useState} from 'react';
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

const alumniUsers = [
    { user_id: 1, first_name: "John", last_name: "Doe", mobile_number: "09123456789", age: 30, gender: "M", city: "Los Baños", state: "Laguna", country: "Philippines", marital_status: "Single", image: "profile_images/john_doe.jpg", password: "hashed_password_here", email: "johndoe@example.com", verification_file: "verification_docs/john_doe.pdf", user_type: "alumni", student_number: "2015-12345", graduation_year: 2019, graduation_semester: "2nd Semester", employment_status: "Employed", job_title: "Software Engineer", work_location: "Makati City, Philippines", work_mode: "Hybrid", employer_class: "Private", tenured_status: "Yes", salary_grade: "SG 12", is_banned: false },  
    { user_id: 2, first_name: "Jane", last_name: "Smith", mobile_number: "09234567890", age: 28, gender: "F", city: "Quezon City", state: "Metro Manila", country: "Philippines", marital_status: "Married", image: "profile_images/jane_smith.jpg", password: "hashed_password_here", email: "janesmith@example.com", verification_file: "verification_docs/jane_smith.pdf", user_type: "alumni", student_number: "2016-67890", graduation_year: 2020, graduation_semester: "1st Semester", employment_status: "Self-Employed", job_title: "Freelance UX Designer", work_location: "Remote", work_mode: "Remote", employer_class: "Freelancer", tenured_status: "No", salary_grade: "N/A", is_banned: false }  
  ];
  
const signedinuser = { user_id: 2, first_name: "Jane", last_name: "Smith", mobile_number: "09234567890", age: 28, gender: "F", city: "Quezon City", state: "Metro Manila", country: "Philippines", marital_status: "Married", image: '../assets/prince boy.jpg', password: "hashed_password_here", email: "janesmith@example.com", verification_file: "verification_docs/jane_smith.pdf", user_type: "alumni", student_number: "2016-67890", graduation_year: 2020, graduation_semester: "1st Semester", employment_status: "Self-Employed", job_title: "Freelance UX Designer", work_location: "Quezon City, PH", work_mode: "Remote", employer_class: "Private", tenured_status: "Permanent", salary_grade: "3", is_banned: false, company_name: "AZEUS" }
const iskills = ["Artificial Intelligence", "Cybersecurity", "Web Development"];
const iaffiliations = [{ affiliation: "Young Software Engineers’ Society", role: "Resident Member" },{ affiliation: "Young Software Engineers’ Society", role: "Resident Member" },{ affiliation: "Young Software Engineers’ Society", role: "Resident Member" },];
const ischolarships = ["DOST Scholarship", "UPLB SLAS"];

function UserProfile() {
    const [editMode, setEditMode] = useState(false);
    const [activeTab, setActiveTab] = useState("About"); 
    const addSkills = (newSkills) => {
      setSkills([...skills, ...newSkills]);
    };
    const addAffiliation = (newAffiliation) => {
      setAffiliations([...affiliations, newAffiliation]);
    };
    const addScholarship = (newScholarship) => {
      setScholarships([...scholarships, newScholarship]);
    };
    
    

    const [userDetails, setUserDetails] = useState({
      first_name: signedinuser.first_name,
      last_name: signedinuser.last_name,
      email: signedinuser.email,
      location: `${signedinuser.city}, ${signedinuser.state}`,
      mobile_number: signedinuser.mobile_number,
      student_number: signedinuser.student_number,
      graduatingClass: `${signedinuser.graduation_year} - ${signedinuser.graduation_semester}`,
      
      // Added fields
      job_title: signedinuser.job_title,
      company_name: signedinuser.company_name,
      work_location: signedinuser.work_location,
      work_mode: signedinuser.work_mode,
      employer_class: signedinuser.employer_class,
      tenured_status: signedinuser.tenured_status,
      salary_grade: signedinuser.salary_grade,
    });
    


    const [skills, setSkills] = useState(iskills);
    const [affiliations, setAffiliations] = useState(iaffiliations);
    const [scholarships, setScholarships] = useState(ischolarships);

    const removeSkill = (index) => setSkills(skills.filter((_, i) => i !== index));
    const removeAffiliation = (index) => setAffiliations(affiliations.filter((_, i) => i !== index));
    const removeScholarship = (index) => setScholarships(scholarships.filter((_, i) => i !== index));

    const handleChange = (e, field) => {
      setUserDetails({ ...userDetails, [field]: e.target.value });
    };

    return (
      <div className="flex flex-col items-center relative h-[965px] mt-10 gap-y-4 px-4 sm:px-6 lg:px-0">

            {/* Profile Section */}
            <ProfileSection editMode={editMode} userDetails={userDetails} setEditMode={setEditMode} handleChange={handleChange} />
      {/* Navigation Tabs */}
      <UserProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Information Sections */}
            {/* Conditional Rendering Based on Tab Selection */}
      {activeTab === "About" && (
        <>
          <PersonalInfoSection editMode={editMode} userDetails={userDetails} handleChange={handleChange} />    
          <SkillsInterestsSection editMode={editMode} skills={skills} removeSkill={removeSkill} addSkills={addSkills} />
          <AffiliationsSection editMode={editMode} affiliations={affiliations} removeAffiliation={removeAffiliation} addAffiliation={addAffiliation} />
          <ScholarshipsSection editMode={editMode} scholarships={scholarships} removeScholarship={removeScholarship}   addScholarship={addScholarship}/>
    </>)}
    {activeTab === "Work" && <WorkSection userDetails={userDetails} />}
        </div>
    );
}

export default UserProfile;