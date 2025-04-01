import React from "react";
import SectionHeader from "../components/sectionheader"; // Adjust the path based on your project structure

function WorkSection() {
  const handleEditWork = () => {
    console.log("Edit Work Clicked");
  };

  return (
<>
<div className="w-full max-w-[1100px] mt-6">
      {/* Section Header */}
      <SectionHeader title="Current Work" buttonText="Edit Work" onButtonClick={handleEditWork} />

      {/* Content */}

      </div>
    </>
  );
}

export default WorkSection;
