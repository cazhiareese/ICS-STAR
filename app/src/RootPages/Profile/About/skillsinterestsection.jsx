import React, { useState } from "react";
import { XCircle } from "lucide-react";
import SectionHeader from "../components/sectionheader";
import AddSkillsModal from "../components/skillmodal";

const SkillsInterestsSection = ({ editMode, skills, removeSkill, addSkills }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-full max-w-[1100px] mt-6">
      {/* Section Header with Button */}
      <SectionHeader
        title="SKILLS AND INTERESTS"
        buttonText="Add skills/interests"
        onButtonClick={() => setIsModalOpen(true)}
      />

      {/* Skills List */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-4">
        {skills.map((skill, index) => (
          <div key={index} className="relative">
            <span className="block px-4 py-2 border border-blue-700 text-blue-700 rounded-full font-medium text-[16px] hover:bg-blue-50 transition text-center">
              {skill}
            </span>
            {editMode && (
              <XCircle
                size={18}
                className="absolute -top-2 -right-2 text-red-500 cursor-pointer bg-white rounded-full"
                onClick={() => removeSkill(index)}
              />
            )}
          </div>
        ))}
      </div>

      {/* Add Skills Modal */}
      <AddSkillsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addSkills}
      />
    </div>
  );
};

export default SkillsInterestsSection;
