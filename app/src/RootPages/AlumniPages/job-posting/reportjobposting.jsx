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
      <div className="max-w-[1100px] mx-auto bg-white rounded-[10px] border border-disabled p-6 space-y-6">
  {/* Report Details */}
  <div>
    <label className="block font-medium text-gray-700 mb-2">Report Details</label>
    <textarea
      className="w-full border border-gray-300 rounded-md p-3 min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Please provide information that would help us understand your concern..."
    />
  </div>

  {/* File Upload */}
  <div>
    <label className="block font-medium text-gray-700 mb-2">Attach file(s) here:</label>
    <div className="w-full border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center text-center text-gray-500 bg-gray-50 hover:bg-gray-100 transition-colors">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 mb-2 text-blue-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M16 7l-4-4m0 0L8 7m4-4v12" />
      </svg>
      <p>Drag and drop file here or <span className="text-blue-600 underline cursor-pointer">Choose file</span></p>
      <input
        type="file"
        multiple
        className="hidden"
        id="file-upload"
      />
    </div>
  </div>

</div>
  {/* Submit Button */}
  <div className="text-right mt-5">
    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
      Submit
    </button>
  </div>
    </div>
  );
};

export default ReportJobPosting;
