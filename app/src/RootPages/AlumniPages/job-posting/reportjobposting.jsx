import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BackButton from "../../../components/backbutton";
import JobSectionHeader from "./jobcomponent/jobsectionheader";
import JobOverviewCard from "./jobcomponent/joboverview";
import { Info } from "lucide-react";

function ReportJobPosting() {
  const [jobOverview, setJobOverview] = useState(null);
  const [formData, setFormData] = useState({
    details: "",
    files: [],
  });
  const [isDragging, setIsDragging] = useState(false);

  const { jobid: id } = useParams();
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchJobOverview = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/job/overview/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch job overview");
        const data = await response.json();
        setJobOverview(data);
      } catch (err) {
        console.error("Job Overview Fetch Error:", err);
      }
    };

    fetchJobOverview();
  }, [id, token]);

  const handleDetailsChange = (e) => {
    setFormData({ ...formData, details: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, files: Array.from(e.target.files) });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFormData({ ...formData, files: droppedFiles });
  };

  return (
    <div className="w-full max-w-[1100px] mx-auto p-4">
      <div className="sm:pl-12">
        <BackButton label="Back" />
      </div>
      <JobSectionHeader title="Report a Job" />
      <div className="flex items-start gap-1 w-full max-w-3xl px-4 pb-3 pl-12 text-neutral-c sm:max-w-[1100px]">
        <Info className="w-4 h-4 flex-shrink-0" />
        <span className="text-[12px] sm:text-[14px] font-satoshi-medium-italic text-center sm:text-left">
          Thank you for helping keep our career page safe and relevant. Your report will be reviewed by our team and appropriate action will be taken.
        </span>
      </div>

      {jobOverview && <JobOverviewCard overview={jobOverview} />}

      <div className="max-w-[1100px] mx-auto bg-whitey rounded-[10px] border border-disabled p-6 space-y-6 h-[506px]">
        {/* Report Details */}
        <div>
          <label className="block font-satoshi-bold text-black mb-2">
            Report Details
          </label>
          <textarea
            value={formData.details}
            onChange={handleDetailsChange}
            className="w-full border font-satoshi-medium border-gray-300 rounded-md p-3 min-h-[220px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Please provide information that would help us understand your concern..."
          />
        </div>

        {/* File Upload with Drag & Drop */}
        <div>
          <label className="block font-satoshi-bold text-black mb-2">
            Attach file(s) here:
          </label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`w-full h-[130px] border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center text-center transition-colors ${
              isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-gray-200 hover:bg-gray-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 mb-2 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M16 7l-4-4m0 0L8 7m4-4v12"
              />
            </svg>
            <p className="font-satoshi-medium text-lack">
              Drag and drop file here or{" "}
              <label htmlFor="file-upload" className="text-primary  cursor-pointer">
                Choose file
              </label>
            </p>
            <input
              id="file-upload"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          {formData.files.length > 0 && (
            <ul className=" text-sm text-gray-700 list-disc list-inside">
              {formData.files.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          )}
          </div>
          {/* Preview file names */}

        </div>
      </div>

      {/* Submit Button */}
      <div className="text-right mt-2">
        <button className="bg-primary  text-white px-6 py-2 rounded-[20px] font-satoshi-bold hover:bg-hover cursor-pointer transition-colors">
          Submit
        </button>
      </div>
    </div>
  );
}

export default ReportJobPosting;
