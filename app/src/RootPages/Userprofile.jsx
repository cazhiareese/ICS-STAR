import React from 'react';

function UserProfile() {
  return (
    <div className="flex flex-col relative">
      <div>Profile</div>
      <div className="absolute w-[1100px] h-[226px] top-[134px] left-[170px] border border-gray-300 rounded-[10px] bg-gray-200 shadow-md p-4">
        Profile Container
      </div>
      <div className="absolute w-[1100px] h-[45px] top-[379px] left-[170px] border border-gray-300 rounded-[10px] bg-gray-200 shadow-md p-2">
        Another Container
      </div>
      <div>nav</div>
      <div>Personal Information</div>
      <div>Skills and Interest</div>
      <div>Affiliations</div>
      <div>Scholarships</div>
    </div>
  );
}

export default UserProfile;
