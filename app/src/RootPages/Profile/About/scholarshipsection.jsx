import React, { useState } from "react";
import { PlusCircle, XCircle } from "lucide-react";
import SectionHeader from "../../../components/sectionheader";
import AddScholarshipModal from "../scholarshipmodal";

const ScholarshipsSection = ({ editMode, scholarships, removeScholarship, addScholarship }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-full max-w-[1100px] mt-6">
      <SectionHeader title="SCHOLARSHIPS" 
              buttonText="Add scholarships"
              onButtonClick={() => setIsModalOpen(true)}/>

      <div className="flex justify-between items-center mt-4">
        {/* Scholarship List */}
        <div className="w-full">
          {scholarships.map((scholarship, index) => (
            <div key={index}>
              <div className="flex items-center justify-between py-2">
                {/* Scholarship Name */}
                <p className="text-blue-700 font-medium">{scholarship}</p>

                {/* Remove Icon (Only in Edit Mode) */}
                {editMode && (
                  <XCircle
                    size={16}
                    className="text-red-500 cursor-pointer hover:text-red-600 transition"
                    onClick={() => removeScholarship(index)}
                  />
                )}
              </div>

              {/* Divider after every scholarship */}
              <div className="w-full border-b border-gray-300"></div>
            </div>
          ))}
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
