import React from "react";
import { ChevronDown } from "lucide-react";

function DonationTableHeader({ onSort, getSortIcon, selectedType }) {
  return (
    <div className="mt-1 rounded-xl py-2 font-satoshi-bold">
      <div className="flex font-semibold text-primary">
        <div
          className={
            selectedType === "Monetary"
              ? "w-1/4 cursor-pointer flex items-center gap-1 text-left"
              : "w-1/3 cursor-pointer flex items-center gap-1 text-left"
          }
          onClick={() => onSort("date_donated", selectedType)}
        >
          Date {getSortIcon("date_donated", selectedType)}
        </div>
        <div
          className={
            selectedType === "Monetary"
              ? "w-1/3 text-left px-2 sm:px-6"
              : "w-1/3 text-left px-2 sm:px-6"
          }
        >
          Donation Drive
        </div>
        {selectedType === "Monetary" ? (
          <>
            <div
              className="w-1/4 cursor-pointer flex items-center gap-1 text-left px-2 sm:px-3"
              onClick={() => onSort("amount", selectedType)}
            >
              Amount {getSortIcon("amount", selectedType)}
            </div>
            <div
              className="w-1/4  cursor-pointer flex justify-center sm:justify-start items-center gap-1 text-left"
              onClick={() => onSort("is_acknowledged", selectedType)}
            >
              Status {getSortIcon("is_acknowledged", selectedType)}
            </div>
          </>
        ) : (
          <div
            className="w-1/3 cursor-pointer flex justify-self-start sm:justify-self-end items-center gap-1 text-left"
            onClick={() => onSort("is_acknowledged", selectedType)}
          >
            Status {getSortIcon("is_acknowledged", selectedType)}
          </div>
        )}
      </div>
    </div>
  );
}

export default DonationTableHeader;