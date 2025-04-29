import React, { useState } from "react";
import { Minus } from "lucide-react";
import SectionHeader from "../components/sectionheader";
import AddSkillsModal from "../components/skillmodal";
import CircularLoading from "../../../components/LoadingComponents/circularloading";

const SkillsInterestsSection = ({
  editMode,
  skills,
  removeSkill,
  addSkills,
  isLoading,
  isVerified, 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log(isVerified);

  return (
    <div className="w-full max-w-[1100px] mt-6">
      {/* Section Header with Button */}
      <SectionHeader
        title="SKILLS AND INTERESTS"
        buttonText="Add skills/interests"
        onButtonClick={() => setIsModalOpen(true)}
        isVerified={isVerified} 
      />

        {isVerified && (
          <>
      {/* Loading State */}
      {isLoading ? (
        <div className="w-full flex justify-center mt-4">
          <CircularLoading />
        </div>
      ) : skills.length === 0 ? (
        <div className="w-full flex justify-center mt-4 text-gray-500 italic">
          No skills or interests yet.
        </div>
      ) : (
        // Skills List
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-4">
          {skills.map((skill, index) => (
            <div key={index} className="relative">
              <span className="block px-4 py-2 border-2 border-primary text-primary rounded-full font-satoshi-bold text-[16px] hover:bg-hover hover:text-white transition text-center">
                {skill}
              </span>
              {editMode && (
                <Minus
                  size={18}
                  className="absolute -top-2 -right-2 text-white cursor-pointer bg-error rounded-full hover:bg-red-800"
                  onClick={() => {
                    console.log(
                      "Skill to remove:",
                      skill,
                      "Type:",
                      typeof skill
                    );
                    removeSkill(skill);
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}
      </>)}

      {/* Add Skills Modal */}
      <AddSkillsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addSkills}
        existingSkills={skills}
      />
    </div>
  );
};

export default SkillsInterestsSection;
