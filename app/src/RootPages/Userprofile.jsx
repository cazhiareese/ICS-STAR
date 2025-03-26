import React from 'react';

function UserProfile() {
  return (
    <div className="flex flex-col items-center relative min-h-screen mt-10 gap-y-4">
      <div>Profile</div>
      <div className="w-[1100px] h-[226px] border border-gray-300 rounded-[10px] bg-gray-200 shadow-md p-4 flex items-center justify-center">
        Profile Container
      </div>
      <div className="w-[1100px] h-[45px] border border-gray-300 rounded-[10px] bg-gray-200 shadow-md p-2 flex items-center justify-center">
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
