// ReportJobPosting.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BackButton from "../../../components/backbutton";
import JobSectionHeader from "./jobcomponent/jobsectionheader";
import JobOverviewCard from "./jobcomponent/joboverview";

function ReportJobPosting (){
    const [jobOverview, setJobOverview] = useState(null);
    const id = "f7a09e35-1e12-4214-9bda-5c87de635416";
    console.log(id);
    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem("token");

      useEffect(() => {
        const fetchJobOverview = async () => {
          try {
            const response = await fetch(`${API_BASE_URL}/job/overview/${id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
        
            if (!response.ok) throw new Error("Failed to fetch job overview");
        
            const data = await response.json();
            console.log("Job Overview Data:", data); // Debugging line
            setJobOverview(data);
          } catch (err) {
            console.error("Job Overview Fetch Error:", err);
          }
        };
        
        fetchJobOverview();
        
    

      }, [id, token]);
  return (
<div className="w-full max-w-[1100px] mx-auto p-4">
<div className="sm:pl-12">
      <BackButton label="Back" />
      </div>
      <JobSectionHeader title="Report a Job" />
      {jobOverview && <JobOverviewCard overview={jobOverview} />}
    </div>
  );
};

export default ReportJobPosting;
