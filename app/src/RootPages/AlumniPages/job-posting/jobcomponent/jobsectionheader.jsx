import React from 'react';

function JobSectionHeader({ title }) {
  return (
    <h2 className="text-[28px] sm:text-[40px] font-satoshi-bold text-gray-800 mb-4 text-center sm:text-left sm:pl-13">
      {title}
    </h2>
  );
}

export default JobSectionHeader;
