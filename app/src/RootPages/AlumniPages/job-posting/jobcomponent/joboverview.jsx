import React from "react";
import { Heart, Calendar, User } from "lucide-react";

function JobOverviewCard({ overview }) {
  return (
    <div className="relative border border-gray-300 rounded-[20px] shadow-xl max-h-[178px]  py-6 px-8 w-full max-w-[1100px] mx-auto  bg-white flex flex-row justify-between items-center mb-6">
      {/* Left Section: Role & Company */}
      <div className="flex flex-col">
        <h2 className="text-[18px] text-primary font-satoshi-black sm:text-[40px] sm:font-satoshi-bold">{overview.title}</h2>
        <p className="text-[11px]c sm:text-[18px] font-satoshi-medium">{overview.company}</p>
        <p className="text-[11px]c sm:text-[18px] font-satoshi-medium">{overview.poster_location || "—"}</p>
      </div>

      {/* Right Section: Stats */}
      <div className="flex flex-col gap-2 text-[11px] sm:text-[18px] text-black font-satoshi-medium">
        <div className="flex items-center gap-2">
          <Heart className="text-primary w-4 h-4" />
          <p>
            <span className="text-primary font-satoshi-black sm:font-satoshi-bold">
              {overview.total_interested} people
            </span>{" "}
            are interested     
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="text-primary w-4 h-4" />
          <p>{overview.created_at}</p>
        </div>
        <div className="flex items-center gap-2">
          <User className="text-primary w-4 h-4" />
          <p>{overview.posted_by}</p>
        </div>
      </div>
    </div>
  );
}

export default JobOverviewCard;
