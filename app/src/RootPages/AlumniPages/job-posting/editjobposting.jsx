// EditJobPosting.jsx
import React from "react";
import BackButton from "../../../components/backbutton";
import JobSectionHeader from "./jobcomponent/jobsectionheader";


function EditJobPosting() {
  return (
    <div className="w-full max-w-[1100px] mx-auto p-4">
      <div className="sm:pl-12">
      <BackButton label="Back" />
      </div>

      <JobSectionHeader title="Edit Job Posting" />
      <div className="max-w-[1100px] mx-auto bg-whitey rounded-[10px] shadow border border-disabled p-4">
        <div className="flex flex-row gap-1 py-1">
          <div className="w-full border-neutral-c rounded-[11px] bg-white p-4 "></div>
          <div className="w-full border-neutral-c rounded-[11px] bg-white p-4 "></div>
        </div>
        <div className="flex flex-row gap-1 py-1">
          <div className="w-full border-neutral-c rounded-[11px] bg-white p-4 "></div>
          <div className="w-full border-neutral-c rounded-[11px] bg-white p-4 "></div>
        </div>
        <div className="flex flex-row gap-1 py-1">
          <div className="w-full border-neutral-c rounded-[11px] bg-white p-4 "></div>
          
        </div>
        <div className="flex flex-row gap-1 py-1">
          <div className="w-full border-neutral-c rounded-[11px] bg-white p-4 "></div>
          
        </div>
        <div className="flex flex-row gap-1 py-1">
          <div className="w-full border-neutral-c rounded-[11px] bg-white p-4 "></div>
          <div className="w-full border-neutral-c rounded-[11px] bg-white p-4 "></div>
        </div>
      </div>
      <div className="text-right mt-2">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Submit
        </button>
      </div>
      </div>
  );
}

export default EditJobPosting;
