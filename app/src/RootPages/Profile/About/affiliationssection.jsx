import React, { useState } from "react";
import { X } from "lucide-react";
import SectionHeader from "../components/sectionheader";
import AddAffiliationsModal from "../components/affiliationmodal";
import CircularLoading from "../../../components/LoadingComponents/circularloading";

const AffiliationsSection = ({
  editMode,
  affiliations,
  removeAffiliation,
  addAffiliation,
  isLoading, 
  isVerified,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-full max-w-[1100px] mt-10">
      <SectionHeader
        title="AFFILIATIONS"
        buttonText="Add affiliations"
        onButtonClick={() => setIsModalOpen(true)}
        isVerified={isVerified}
      />


      <div className="flex justify-between items-center mt-4">
        {isVerified && (

        <>
        {isLoading ? (
          <div className="w-full flex justify-center mt-4">
            <CircularLoading />
          </div>
        ) : affiliations.length === 0 ? (
          <div className="w-full flex justify-center mt-4 text-gray-500 italic">
            No affiliations yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 w-full">
            {affiliations.map((affiliation, index) => (
              <div key={index} className="flex flex-col">
                {/* Affiliation Name & Remove Icon */}
                <div className="flex items-center gap-2">
                  <p className="text-primary font-satoshi-bold text-[20px]">
                    {affiliation.affiliation}
                  </p>
                  {editMode && (
                    <div className="w-4 h-4 bg-error rounded-full flex items-center justify-center hover:bg-red-800">
                      <X
                        size={12}
                        className="text-white cursor-pointer hover:text-white transition"
                        onClick={() => removeAffiliation(affiliation)}
                      />
                    </div>
                  )}
                </div>
                {/* Role Below */}
                <p className="text-black font-satoshi-medium">
                  {affiliation.role}
                </p>
              </div>
            ))}
          </div>
        )}</>)}
      </div>

      {/* Add Affiliations Modal */}
      <AddAffiliationsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addAffiliation}
      />
    </div>
  );
};

export default AffiliationsSection;
