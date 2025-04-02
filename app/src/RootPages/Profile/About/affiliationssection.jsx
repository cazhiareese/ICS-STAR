import React, { useState } from "react";
import { PlusCircle, XCircle,X } from "lucide-react";
import SectionHeader from "../components/sectionheader";
import AddAffiliationsModal from "../components/affiliationmodal";

const AffiliationsSection = ({ editMode, affiliations, removeAffiliation, addAffiliation }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-full max-w-[1100px] mt-6">
      <SectionHeader title="AFFILIATIONS"
              buttonText="Add affiliations"
              onButtonClick={() => setIsModalOpen(true)} />

      <div className="flex justify-between items-center mt-4">
        {/* Affiliation List (Two-column layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 w-full">
          {affiliations.map((affiliation, index) => (
            <div key={index} className="flex flex-col">
              {/* Affiliation Name & Remove Icon */}
              <div className="flex items-center gap-2">
                <p className="text-primary font-satoshi-bold text-[20px]">{affiliation.affiliation}</p>
                {editMode && (
                  <div className="bg-error  rounded-full flex items-center justify-center hover:bg-red-800">
                  <XCircle
                    size={16}
                    className="text-white cursor-pointer hover:text-white transition"
                    onClick={() => removeAffiliation(affiliation)}
                  />
                </div>
                )}
              </div>
              {/* Role Below */}
              <p className="text-black font-satoshi-medium">{affiliation.role}</p>
            </div>
          ))}
        </div>


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
