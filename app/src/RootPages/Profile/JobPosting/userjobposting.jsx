import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BriefcaseBusiness } from 'lucide-react';
import JobCard from '../../../components/AlumniComponents/JobCard';
// import JobExpandedCard from '../../../components/AlumniComponents/JobExpandedCard';
import CircularLoading from '../../../components/LoadingComponents/circularloading';
import axios from 'axios';

export default function JobPosted() {
        const [selectedJobId, setSelectedJobId] = useState(""); //the job id will be stored here
        const [selectedJob, setSelectedJob] = useState({});
        const [jobList, setJobList] = useState([]);
        const [userId, setUserId] = useState(null);
        const [loading, setLoading] = useState(false);
        const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
        const token = localStorage.getItem("token");

        //For Dummy testing only
        useEffect(() => {
          const fetchJobs = async () => {
            try {
              const response = await axios.get(`${API_BASE_URL}/profile/me/job-post-history`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              
              console.log("Job List Response:", response.data);

              const jobs = response.data.data.map((job) => ({
                title: job.position || "Untitled Role",
                company: job.company || "Unknown Company",
                description: job.description || "No description available.",
                user_name: "",
                tags: job.tags || [],
                interested_count: job.interested_count || 0,
              }));
      
              setJobList(jobs);
            } catch (error) {
              console.error("Error fetching job data:", error);
            }
          };
      
          fetchJobs();
        }, [token]);




    useEffect(() => {
        // Job Dummy Data
        const job = {
            title: "Data Scientist",
            company: "Google Alphabet",
            description: "Lorem ipsum dolor sit amet consectetur. Risus tellus odio sit vel ut nibh natoque id. Eu facilisis augue neque non enim a duis. Odio tortor vestibulum gravida nullam quis sed enim ipsum ullamcorper. Venenatis nulla vulputate et ut ut rhoncu...",
            salary: 20000,
            tags: ["Software Engineering", "UI/UX","Software Engineering", "UI/UX","Software Engineering", "UI/UX"],
            employment_type: "Full-time",
            mode: "On-site",
            link: "LinkedIn.com",
            image: "https://www.computersciencedegreehub.com/wp-content/uploads/2020/05/What-is-a-Software-Engineer-scaled.jpg",
            user_name: "Roche Quejada", //Tentative
            interested_count: 5,
            user_id: "2543d5a7-f7f3-4a90-92f7-d0a8595db26b"
        }

        setSelectedJob(job);
        
    }, []);

  return (
    <div className="w-full max-w-[1100px] mt-6">
<div className="flex flex-col lg:flex-row lg:gap-2 justify-center items-center sm:justify-start sm:px-1 ml-7">
  {/* Scrollable Job List */}
  <div className="h-[660px] overflow-y-scroll overflow-x-hidden pt-1 scrollbar-left w-full lg:max-w-[420px] outline-0 flex-shrink-0">
    {!loading ? (
      <div className="flex flex-col gap-5">
        {jobList.map((job, index) => (
          <JobCard
            key={index}
            job={job}
            selectedJobId={selectedJobId}
            setSelectedJobId={setSelectedJobId}
          />
        ))}
      </div>
    ) : (
      <div className="flex flex-row justify-center h-full gap-5">
        <h1 className="text-xl font-satoshi-bold text-gray-400">Loading Jobs</h1>
        <CircularLoading />
      </div>
    )}
  </div>

  {/* Job Preview */}
  <div className="w-full flex-grow">
    {!selectedJob || !selectedJob.tags ? (
      <div className="flex flex-col items-center justify-center px-4 py-8 sm:py-12 rounded-xl">
        <div className="text-primary opacity-50">
          <BriefcaseBusiness size={120} className="sm:size-[200px]" />
        </div>
        <h1 className="text-primary opacity-50 text-2xl sm:text-3xl font-satoshi-bold text-center mt-4">
          Select Job Posting
        </h1>
      </div>
    ) : (
      <JobExpandedCard job={selectedJob} currentUserID={userId} />
    )}
  </div>
</div>


    </div>
  );
}
