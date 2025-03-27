import React, { useState } from "react";
import { PlusCircle, XCircle } from "lucide-react";
import SectionHeader from "../../../components/sectionheader";
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
                <p className="text-blue-700 font-medium">{affiliation.affiliation}</p>
                {editMode && (
                  <XCircle
                    size={16}
                    className="text-red-500 cursor-pointer hover:text-red-600 transition"
                    onClick={() => removeAffiliation(index)}
                  />
                )}
              </div>
              {/* Role Below */}
              <p className="text-gray-600">{affiliation.role}</p>
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
