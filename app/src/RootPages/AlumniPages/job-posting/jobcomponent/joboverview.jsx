import React from "react";
import { Heart, Calendar, User } from "lucide-react";

function JobOverviewCard({ overview }) {
  return (
    <div className="relative border border-gray-300 rounded-[20px] shadow-xl max-h-[178px]  py-6 px-8 w-full max-w-[1100px] mx-auto bg-white flex flex-row justify-between items-center mb-6">
      {/* Left Section: Role & Company */}
      <div className="flex flex-col">
        <h2 className="text-[18px] text-primary font-satoshi-bold sm:text-[40px]">{overview.title}</h2>
        <p className="font-satoshi-regular">{overview.company}</p>
        <p className="font-satoshi-regular">{overview.poster_location || "—"}</p>
      </div>

      {/* Right Section: Stats */}
      <div className="flex flex-col gap-2 text-sm text-gray-700 font-satoshi-regular">
        <div className="flex items-center gap-2">
          <Heart className="text-primary w-4 h-4" />
          <p>
            <span className="text-primary font-satoshi-bold">
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
