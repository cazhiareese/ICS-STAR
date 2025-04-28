import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BriefcaseBusiness } from 'lucide-react';
import JobCard from '../../../components/AlumniComponents/JobCard';
import JobExpandedCard from '../../../components/AlumniComponents/JobExpandedCard';
import CircularLoading from '../../../components/LoadingComponents/circularloading';

export default function JobPosted() {
        const [selectedJobId, setSelectedJobId] = useState(""); //the job id will be stored here
        const [selectedJob, setSelectedJob] = useState({});
        const [jobList, setJobList] = useState([]);
        const [userId, setUserId] = useState(null);
        const [loading, setLoading] = useState(false);

        //For Dummy testing only
    useEffect(() => {
        //Job Dummy Data


        const job = {
            title: "Data Scientist",
            company: "Google Alphabet",
            description: "Lorem ipsum dolor sit amet consectetur. Risus tellus odio sit vel ut nibh natoque id. Eu facilisis augue neque non enim a duis. Odio tortor vestibulum gravida nullam quis sed enim ipsum ullamcorper. Venenatis nulla vulputate et ut ut rhoncu...",
            user_name: "Roche Quejada",
            tags: ["Software Engineering", "UI/UX","Software Engineering", "UI/UX","Software Engineering", "UI/UX"],
            interested_count: 5
        }
        
        const jobs = [job,job,job, job, job, job, job];
        setJobList(jobs);
        
    }, []);




    // useEffect(() => {
    //     // Job Dummy Data
    //     const job = {
    //         title: "Data Scientist",
    //         company: "Google Alphabet",
    //         description: "Lorem ipsum dolor sit amet consectetur. Risus tellus odio sit vel ut nibh natoque id. Eu facilisis augue neque non enim a duis. Odio tortor vestibulum gravida nullam quis sed enim ipsum ullamcorper. Venenatis nulla vulputate et ut ut rhoncu...",
    //         salary: 20000,
    //         tags: ["Software Engineering", "UI/UX","Software Engineering", "UI/UX","Software Engineering", "UI/UX"],
    //         employment_type: "Full-time",
    //         mode: "On-site",
    //         link: "LinkedIn.com",
    //         image: "https://www.computersciencedegreehub.com/wp-content/uploads/2020/05/What-is-a-Software-Engineer-scaled.jpg",
    //         user_name: "Roche Quejada", //Tentative
    //         interested_count: 5,
    //         user_id: "2543d5a7-f7f3-4a90-92f7-d0a8595db26b"
    //     }

    //     setSelectedJob(job);
        
    // }, []);

  return (
    <div className="w-full max-w-[1100px] mt-6">
            <div className='flex flex-row  gap-2 justify-center'>
                {/* Scrollable wrapper */}
                <div className='h-[660px] overflow-y-scroll overflow-x-hidden pt-1 scrollbar-left w-xl outline-0'>
                    {!loading ? (
                        <div className='flex flex-col gap-5 '>
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
                        <div className='flex flex-row justify-center h-full gap-5'>
                            <h1 className='text-xl font-satoshi-bold text-gray-400'> Loading Jobs</h1>
                            <CircularLoading />
                        </div>
                    )}
                </div>



                {/* Job Preview */} 
                
                {!selectedJob || !selectedJob.tags ? (
                    <div className="flex flex-col items-center justify-center w-lg outline-0">
                        <h1 className='text-primary opacity-50'><BriefcaseBusiness size={200}/></h1>
                        <h1 className='text-primary opacity-50 text-3xl font-satoshi-bold'>Select Job Posting</h1>
                    </div>
                ) : (
                    <JobExpandedCard job={selectedJob} currentUserID={userId} />
                )}
                
            </div>
    </div>
  );
}
