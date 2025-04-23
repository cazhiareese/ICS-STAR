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
      </div>
  );
}

export default EditJobPosting;
