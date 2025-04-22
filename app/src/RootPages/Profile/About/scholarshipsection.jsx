import React, { useState } from "react";
import { XCircle } from "lucide-react";
import SectionHeader from "../components/sectionheader";
import AddScholarshipModal from "../components/scholarshipmodal";
import CircularLoading from "../../../components/LoadingComponents/circularloading";

const ScholarshipsSection = ({
  editMode,
  scholarships,
  removeScholarship,
  addScholarship,
  isLoading, // <-- added this prop
  isVerified, // <-- added this prop
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-full max-w-[1100px] mt-6">
      <SectionHeader
        title="SCHOLARSHIPS"
        buttonText="Add scholarships"
        onButtonClick={() => setIsModalOpen(true)}
        isVerified={isVerified}
      />


      <div className="flex justify-between items-center mt-4">
        {/* Scholarship List */}
        <div className="w-full">
          {isVerified && (
          <>
          {isLoading ? (
            <div className="flex justify-center mt-4">
              <CircularLoading />
            </div>
          ) : scholarships.length === 0 ? (
            <div className="flex justify-center mt-4 text-gray-500 italic">
              No scholarships yet.
            </div>
          ) : (
            scholarships.map((scholarship, index) => (
              <div key={index}>
                <div className="flex items-center justify-between py-2">
                  {/* Scholarship Name */}
                  <p className="text-primary font-satoshi-bold text-[20px]">
                    {scholarship}
                  </p>

                  {/* Remove Icon (Only in Edit Mode) */}
                  {editMode && (
                    <div className="bg-error rounded-full flex items-center justify-center hover:bg-red-800">
                      <XCircle
                        size={16}
                        className="text-white cursor-pointer hover:text-white transition"
                        onClick={() => removeScholarship(scholarship)}
                      />
                    </div>
                  )}
                </div>

                {/* Divider after every scholarship */}
                <div className="w-full border-b border-disabled"></div>
              </div>
            ))
          )}</>)}
        </div>
      </div>

      {/* Add Scholarships Modal */}
      <AddScholarshipModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addScholarship}
      />
    </div>
  );
};

export default ScholarshipsSection;
