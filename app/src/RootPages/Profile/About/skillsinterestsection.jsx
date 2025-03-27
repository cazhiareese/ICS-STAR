import React from "react";
import { PlusCircle, XCircle } from "lucide-react";
import SectionHeader from "../../../components/sectionheader";

const SkillsInterestsSection = ({ editMode, skills, removeSkill }) => {
  return (
    <div className="w-full max-w-[1100px] mt-6">
      <SectionHeader title="SKILLS AND INTERESTS" />

      <div className="flex justify-between items-center mt-4">
        {/* Skills List */}
        <div className="flex flex-wrap gap-3">
          {skills.map((skill, index) => (
            <div key={index} className="relative inline-block">
              <span className="px-4 py-2 border border-blue-700 text-blue-700 rounded-full font-medium text-[16px] hover:bg-blue-50 transition">
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

        {/* Add Skills Button */}
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-full text-[14px] font-medium hover:bg-blue-800 transition">
          <PlusCircle size={16} />
          Add skills/interests
        </button>
      </div>
    </div>
  );
};

export default SkillsInterestsSection;
