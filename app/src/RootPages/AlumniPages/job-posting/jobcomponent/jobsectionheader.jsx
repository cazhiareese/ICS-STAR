import React from 'react';

function JobSectionHeader({ title }) {
  return (
    <h2 className="text-2xl font-satoshi-black text-gray-800 mb-4 text-left">
      {title}
    </h2>
  );
}

export default JobSectionHeader;
