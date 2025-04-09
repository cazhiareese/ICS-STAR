import React, { useState } from "react";
import { ChevronDown, ChevronUp, Check } from "lucide-react"; 
import SectionHeader from "../components/sectionheader"; 

function DonationHistoryUser({userDetails}) {
  return (
    <div className="w-full max-w-[1100px] mt-6">
      {/* Section Header */}
      <SectionHeader
        title="DONATIONS"
      />
      </div>
  );
}

export default DonationHistoryUser;
