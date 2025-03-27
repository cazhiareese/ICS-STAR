import React, {useState} from 'react';
import { MapPin, Phone, IdCard, GraduationCap, Camera, Facebook, Github, Linkedin, Pencil, PlusCircle, XCircle } from "lucide-react";
import prince from '../assets/prince boy.jpg';
import SectionHeader from '../components/sectionheader';

const alumniUsers = [
    { user_id: 1, first_name: "John", last_name: "Doe", mobile_number: "09123456789", age: 30, gender: "M", city: "Los Baños", state: "Laguna", country: "Philippines", marital_status: "Single", image: "profile_images/john_doe.jpg", password: "hashed_password_here", email: "johndoe@example.com", verification_file: "verification_docs/john_doe.pdf", user_type: "alumni", student_number: "2015-12345", graduation_year: 2019, graduation_semester: "2nd Semester", employment_status: "Employed", job_title: "Software Engineer", work_location: "Makati City, Philippines", work_mode: "Hybrid", employer_class: "Private", tenured_status: "Yes", salary_grade: "SG 12", is_banned: false },  
    { user_id: 2, first_name: "Jane", last_name: "Smith", mobile_number: "09234567890", age: 28, gender: "F", city: "Quezon City", state: "Metro Manila", country: "Philippines", marital_status: "Married", image: "profile_images/jane_smith.jpg", password: "hashed_password_here", email: "janesmith@example.com", verification_file: "verification_docs/jane_smith.pdf", user_type: "alumni", student_number: "2016-67890", graduation_year: 2020, graduation_semester: "1st Semester", employment_status: "Self-Employed", job_title: "Freelance UX Designer", work_location: "Remote", work_mode: "Remote", employer_class: "Freelancer", tenured_status: "No", salary_grade: "N/A", is_banned: false }  
  ];
  
const signedinuser = { user_id: 2, first_name: "Jane", last_name: "Smith", mobile_number: "09234567890", age: 28, gender: "F", city: "Quezon City", state: "Metro Manila", country: "Philippines", marital_status: "Married", image: '../assets/prince boy.jpg', password: "hashed_password_here", email: "janesmith@example.com", verification_file: "verification_docs/jane_smith.pdf", user_type: "alumni", student_number: "2016-67890", graduation_year: 2020, graduation_semester: "1st Semester", employment_status: "Self-Employed", job_title: "Freelance UX Designer", work_location: "Remote", work_mode: "Remote", employer_class: "Freelancer", tenured_status: "No", salary_grade: "N/A", is_banned: false }
const iskills = ["Artificial Intelligence", "Cybersecurity", "Web Development"];
const iaffiliations = [{ affiliation: "Young Software Engineers’ Society", role: "Resident Member" },{ affiliation: "Young Software Engineers’ Society", role: "Resident Member" },{ affiliation: "Young Software Engineers’ Society", role: "Resident Member" },];
const ischolarships = ["DOST Scholarship", "UPLB SLAS"];

function UserProfile() {
    const [editMode, setEditMode] = useState(false);

    const [userDetails, setUserDetails] = useState({
      firstName: signedinuser.first_name,
      lastName: signedinuser.last_name,
      email: signedinuser.email,
      location: `${signedinuser.city}, ${signedinuser.state}`,
      mobile: signedinuser.mobile_number,
      studentNumber: signedinuser.student_number,
      graduatingClass: `${signedinuser.graduation_year} - ${signedinuser.graduation_semester}`,
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
            <div className="w-full max-w-[1100px] border border-gray-300 rounded-[10px] bg-whitey p-6 flex flex-col sm:flex-row items-center sm:justify-between">
                
                {/* Left Section: Profile Picture */}
                <div className="relative flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
                    <div className="relative w-[140px] sm:w-[160px] h-[140px] sm:h-[160px] rounded-full border-[1.5px] border-black flex items-center justify-center overflow-hidden mx-4">
                        <img 
                            src={prince}
                            alt="Profile" 
                            className="w-full h-full object-cover"
                        />
                        {/* Camera Icon Overlay */}
                        <div className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow-md cursor-pointer">
                            <Camera size={18} className="text-gray-600" />
                        </div>
                    </div>

                    {/* Name and Email */}
                    <div className="flex flex-col items-center sm:items-start gap-2 text-center sm:text-left">
                    {editMode ? (
              <>
                <input
                  type="text"
                  value={userDetails.firstName}
                  onChange={(e) => handleChange(e, "firstName")}
                  className="text-[24px] sm:text-[32px] font-satoshi-black text-primary bg-white border border-gray-300 rounded-md px-2 py-1 text-center sm:text-left"
                />
                <input
                  type="text"
                  value={userDetails.lastName}
                  onChange={(e) => handleChange(e, "lastName")}
                  className="text-[24px] sm:text-[32px] font-satoshi-black text-primary bg-white border border-gray-300 rounded-md px-2 py-1 text-center sm:text-left"
                />
                <input
                  type="email"
                  value={userDetails.email}
                  onChange={(e) => handleChange(e, "email")}
                  className="text-[18px] sm:text-[24px] font-satoshi-medium text-black bg-white border border-gray-300 rounded-md px-2 py-1 text-center sm:text-left"
                />
              </>
            ) : (
              <>
                <h2 className="font-satoshi-black text-[24px] sm:text-[32px] leading-[22px] tracking-[-0.02em] text-primary">
                  {userDetails.firstName} {userDetails.lastName}
                </h2>
                <p className="font-satoshi-medium text-[18px] sm:text-[24px] leading-[22px] tracking-[-0.02em] text-black">
                  {userDetails.email}
                </p>
              </>
            )}

                        {/* Social Icons */}
                        <div className="flex gap-4">
                            <Facebook size={24} className="text-black cursor-pointer hover:text-blue-600" />
                            <Github size={24} className="text-black cursor-pointer hover:text-blue-600" />
                            <Linkedin size={24} className="text-black cursor-pointer hover:text-blue-600" />
                        </div>
                    </div>
                </div>

                {/* Right Section: Edit Profile Button */}
                <button onClick={() => setEditMode(!editMode)}className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-full text-[16px] font-medium hover:bg-blue-800 transition">
                    <Pencil size={16} /> {editMode ? "Done Editing" : "Edit Profile"}
                </button>
            </div>

            {/* Nav Section */}
            <div className="w-full max-w-[1100px] border border-gray-300 rounded-[10px] bg-whitey p-2 flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-7 mt-4 px-6">
                <span className="font-satoshi text-[18px] sm:text-[20px] leading-[30px] tracking-[-0.02em] text-gray-700 cursor-pointer hover:text-blue-600 transition">About</span>
                <span className="font-satoshi text-[18px] sm:text-[20px] leading-[30px] tracking-[-0.02em] text-gray-700 cursor-pointer hover:text-blue-600 transition">Work</span>
                <span className="font-satoshi text-[18px] sm:text-[20px] leading-[30px] tracking-[-0.02em] text-gray-700 cursor-pointer hover:text-blue-600 transition">Job Posted</span>
                <span className="font-satoshi text-[18px] sm:text-[20px] leading-[30px] tracking-[-0.02em] text-gray-700 cursor-pointer hover:text-blue-600 transition">Donation History</span>
            </div>

            {/* Information Sections */}
            <div className="w-full max-w-[1100px] mt-6">
      <SectionHeader title="PERSONAL INFORMATION" />

      <div className="flex flex-wrap justify-between items-center mt-4 text-gray-700 text-[16px]">
        {/* Location */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <div className="flex items-center gap-2">
            <MapPin size={20} className="text-gray-600" />
            <span>Location</span>
          </div>
          {editMode ? (
              <input
                type="text"
                value={userDetails.location}
                onChange={(e) => handleChange(e, "location")}
                className="text-blue-700 font-medium bg-white border border-gray-300 rounded-md px-2 py-1"
              />
            ) : (
              <span className="text-blue-700 font-medium">{userDetails.location}</span>
            )}
        </div>

        {/* Mobile Number */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <div className="flex items-center gap-2">
            <Phone size={20} className="text-gray-600" />
            <span>Mobile Number</span>
          </div>
          {editMode ? (
              <input
                type="text"
                value={userDetails.mobile}
                onChange={(e) => handleChange(e, "mobile")}
                className="text-blue-700 font-medium bg-white border border-gray-300 rounded-md px-2 py-1"
              />
            ) : (
              <span className="text-blue-700 font-medium">{userDetails.mobile}</span>
            )}
        </div>

        {/* Student Number */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <div className="flex items-center gap-2">
            <IdCard size={20} className="text-gray-600" />
            <span>Student Number</span>
          </div>
          {editMode ? (
              <input
                type="text"
                value={userDetails.studentNumber}
                onChange={(e) => handleChange(e, "studentNumber")}
                className="text-blue-700 font-medium bg-white border border-gray-300 rounded-md px-2 py-1"
              />
            ) : (
              <span className="text-blue-700 font-medium">{userDetails.studentNumber}</span>
            )}
        </div>

        {/* Graduating Class */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <div className="flex items-center gap-2">
            <GraduationCap size={20} className="text-gray-600" />
            <span>Graduating Class</span>
          </div>
          {editMode ? (
              <input
                type="text"
                value={userDetails.graduatingClass}
                onChange={(e) => handleChange(e, "graduatingClass")}
                className="text-blue-700 font-medium bg-white border border-gray-300 rounded-md px-2 py-1"
              />
            ) : (
              <span className="text-blue-700 font-medium">{userDetails.graduatingClass}</span>
            )}
        </div>
      </div>
    </div>
    <div className="w-full max-w-[1100px] mt-6">
      <SectionHeader title="SKILLS AND INTERESTS" />

      <div className="flex justify-between items-center mt-4">
        {/* Skills List */}
        <div className="flex flex-wrap gap-3">
  {skills.map((skill, index) => (
    <div key={index} className="relative inline-block">
      <span className="px-4 py-2 border border-blue-700 text-blue-700 rounded-full font-medium text-[16px] hover:bg-blue-50 transition">
        {skill}
      </span>
      {editMode && (
        <XCircle
          size={18}
          className="absolute -top-2 -right-2 text-red-500 cursor-pointer bg-white rounded-full"
          onClick={() => removeSkill(index)}
        />
      )}
    </div>
  ))}
</div>


        {/* Add Skills Button */}
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-full text-[14px] font-medium hover:bg-blue-800 transition">
          <PlusCircle size={16} />
          Add skills/interests
        </button>
      </div>
    </div>
    <div className="w-full max-w-[1100px] mt-6">
      <SectionHeader title="AFFILIATIONS" />

      <div className="flex justify-between items-center mt-4">
  {/* Affiliation List (Two-column layout) */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 w-full">
    {affiliations.map((affiliation, index) => (
      <div key={index} className="flex flex-col">
        {/* Affiliation Name & Remove Icon */}
        <div className="flex items-center gap-2">
          <p className="text-blue-700 font-medium">{affiliation.affiliation}</p>
          {editMode && (
            <XCircle
              size={16}
              className="text-red-500 cursor-pointer hover:text-red-600 transition"
              onClick={() => removeAffiliation(index)}
            />
          )}
        </div>
        {/* Role Below */}
        <p className="text-gray-600">{affiliation.role}</p>
      </div>
    ))}
  </div>

  {/* Add Affiliations Button */}
  <button className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-full text-[14px] font-medium hover:bg-blue-800 transition">
    <PlusCircle size={16} />
    Add affiliations
  </button>
</div>

    </div>
    <div className="w-full max-w-[1100px] mt-6">
      <SectionHeader title="SCHOLARSHIPS" />

      <div className="flex justify-between items-center mt-4">
  {/* Scholarship List */}
  <div className="w-full">
    {scholarships.map((scholarship, index) => (
      <div key={index}>
        <div className="flex items-center justify-between py-2">
          {/* Scholarship Name */}
          <p className="text-blue-700 font-medium">{scholarship}</p>

          {/* Remove Icon (Only in Edit Mode) */}
          {editMode && (
            <XCircle
              size={16}
              className="text-red-500 cursor-pointer hover:text-red-600 transition"
              onClick={() => removeScholarship(index)}
            />
          )}
        </div>

        {/* Divider after every scholarship */}
        <div className="w-full border-b border-gray-300"></div>
      </div>
    ))}
  </div>

  {/* Add Scholarships Button */}
  <button className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-full text-[14px] font-medium hover:bg-blue-800 transition">
    <PlusCircle size={16} />
    Add scholarships
  </button>
</div>

    </div>
        </div>
    );
}

export default UserProfile;