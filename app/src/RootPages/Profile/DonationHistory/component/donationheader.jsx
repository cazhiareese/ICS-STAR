import React from "react";
import { ChevronDown } from "lucide-react";

function DonationTableHeader({ onSort, getSortIcon, selectedType }) {
  return (
    <div className="mt-1 rounded-xl py-2 font-satoshi-bold">
      <div className="flex font-semibold text-primary">
        <div
          className="w-1/3 cursor-pointer flex items-center gap-1"
          onClick={() => onSort("date_donated", selectedType)}
        >
          Date {getSortIcon("date_donated", selectedType)}
        </div>

        <div className="w-1/3">
          Donation Drive
        </div>

        <div
          className="w-1/3 text-left cursor-pointer flex items-center gap-1"
          onClick={() => onSort(selectedType === "Monetary" ? "amount" : "is_acknowledged", selectedType)}
        >
          {selectedType === "Monetary" ? "Amount" : "Status"} 
          {getSortIcon(selectedType === "Monetary" ? "amount" : "is_acknowledged", selectedType)}
        </div>
      </div>
    </div>
  );
}

export default DonationTableHeader;