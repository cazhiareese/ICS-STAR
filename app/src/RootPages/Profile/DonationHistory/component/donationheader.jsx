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
        <div className="w-1/3">Donation</div>
        {selectedType === "Monetary" ? (
          <div
            className="w-1/3 text-right cursor-pointer flex justify-end items-center gap-1"
            onClick={() => onSort("amount", selectedType)}
          >
            Amount {getSortIcon("amount", selectedType)}
          </div>
        ) : (
          <div className="w-1/3 text-right flex justify-end items-center gap-1">
            Status <ChevronDown className="inline text-primary w-4 h-4 opacity-0" />
          </div>
        )}
      </div>
    </div>
  );
}

export default DonationTableHeader;
