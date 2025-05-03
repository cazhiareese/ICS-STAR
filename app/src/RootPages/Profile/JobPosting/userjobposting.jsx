import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BriefcaseBusiness, ArrowLeft, ArrowRight } from 'lucide-react';
import JobCard from '../../../components/AlumniComponents/JobCard';
import JobExpandedCard from '../../../components/AlumniComponents/JobExpandedCard';
import CircularLoading from '../../../components/LoadingComponents/circularloading';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export default function JobPosted() {
        const [selectedJobId, setSelectedJobId] = useState(""); //the job id will be stored here
        const [selectedJob, setSelectedJob] = useState({});
        const [jobList, setJobList] = useState([]);
        const [userId, setUserId] = useState(null);
        const [loading, setLoading] = useState(false);
        const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
        const token = localStorage.getItem("token");
        const [mobileExpanded, setMobileExpanded] = useState(false);
        const [currentPage, setCurrentPage] = useState(1);
        const [maxPage, setMaxPage] = useState(1);
const [isError, setError] = useState(false);

        //For Dummy testing only

            const [usertype, setUserType] = useState(null);
            
            useEffect(() => {
                const token = localStorage.getItem('token'); 
                const decoded = jwtDecode(token);
                console.log("Decoded JWT:", decoded);
                setUserId(decoded.sub); 
                setUserType(decoded.role); //cyrus was here
                // console.log(decoded.sub)
                if (decoded.role == "alumni"){
                    setUserType("alumni");
                }
                else{
                    setUserType("student");
                }
                
            }, []);
        useEffect(() => {
          const fetchJobs = async () => {
            setLoading(true);
            try {
              const response = await axios.get(`${API_BASE_URL}/profile/me/job-post-history`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              
              console.log("Job List Response:", response.data);

              const jobs = response.data.data;
              setLoading(false);
              setError(false);
      
              setJobList(jobs);
            } catch (error) {
              console.error("Error fetching job data:", error);
            }
          };
      
          fetchJobs();
        }, [token]);

    useEffect(() => {
        const fetchJobs = async () => {
            console.log(`${API_BASE_URL}/job-postings/${selectedJobId}`);
            try {
                const response = await fetch(`${API_BASE_URL}/job-postings/${selectedJobId}`);
                if (!response.ok) {
                throw new Error('Failed to fetch job using id');
                }
                const data = await response.json();
                console.log("data", data)
                // Set selected job
                setSelectedJob(data)
            } catch (err) {
                console.log(err.message || 'Something went wrong');
            } 
        };

        fetchJobs();
    }, [selectedJobId]);


  return (
    <div className="w-full  mt-6">
            <div className='flex flex-row mt-10 gap-2 justify-center'>
                <div className='flex flex-col'>

                    {/* Scrollable wrapper */}
                    <div className='h-[660px] overflow-y-scroll overflow-x-hidden pt-1 scrollbar-left w-xl outline-0'>
                        
                        {!loading ? (
                            <div className='flex flex-col gap-5 items-center '>
                                
                                {!isError && Array.isArray(jobList) && jobList.length > 0 ? (
                                    jobList.map((job, index) => (
                                        <JobCard
                                        key={index} // Consider using job.id if available instead of index
                                        job={job}
                                        selectedJobId={selectedJobId}
                                        setSelectedJobId={setSelectedJobId}
                                        setMobileExpanded={setMobileExpanded}
                                        
                                        />
                                    ))
                                    ) : (
                                    <p className="text-gray-500 text-center mt-4">
                                        {isError ? 'No jobs found.' : 'No jobs available.'}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className='flex flex-row justify-center h-full gap-5 pt-10'>
                                <h1 className='text-xl font-satoshi-bold text-gray-400'> Loading Jobs</h1>
                                <CircularLoading />
                            </div>
                        )}
                    </div>
                </div>



                {/* Job Preview */} 
                
                {!selectedJob || !selectedJob.tags ? (
                    <div className="md:flex flex-col items-center justify-center w-[800px] outline-0  hidden">
                        <h1 className='text-primary opacity-50'><BriefcaseBusiness size={200}/></h1>
                        <h1 className='text-primary opacity-50 text-3xl font-satoshi-bold'>Select Job Posting</h1>
                    </div>
                ) : (
                    <JobExpandedCard job={selectedJob} currentUserID={userId} mobileExpanded={mobileExpanded} setMobileExpanded={setMobileExpanded} setJob={setSelectedJob} />
                )}
                
            </div>


    </div>
  );
}
