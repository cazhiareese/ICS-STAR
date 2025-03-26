import React from 'react';
import { MapPin, Phone, IdCard, GraduationCap, Camera, Facebook, Github, Linkedin, Pencil } from "lucide-react";
import prince from '../assets/prince boy.jpg';

import SectionHeader from '../components/sectionheader';

function UserProfile() {
    return (
        <div className="flex flex-col items-center relative min-h-screen mt-10 gap-y-4">
            {/* Profile Section */}
            <div className="w-[1100px] h-[226px] border border-gray-300 rounded-[10px] bg-whitey p-6 flex items-center justify-between">
                
                {/* Left Section: Profile Picture */}
                <div className="relative flex items-center gap-6">
                    <div className="relative w-[160px] h-[160px] rounded-full border-[1.5px] border-black flex items-center justify-center overflow-hidden mx-5">
                        <img 
                            src={prince}
                            alt="Profile" 
                            className="w-full h-full object-cover"
                        />
                        {/* Camera Icon Overlay */}
                        <div className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow-md cursor-pointer">
                            <Camera size={18} className="text-gray-600" />
                        </div>
                    </div>

{/* Name and Email */}
<div className="flex flex-col justify-between gap-2">
    <h2 className="font-satoshi-black text-[32px] leading-[22px] tracking-[-0.02em] text-primary">
        Kiefer L. Tayawa
    </h2>
    <p className="font-satoshi-medium text-[24px] leading-[22px] tracking-[-0.02em] text-black">
        kltayawa@up.edu.ph
    </p>

    {/* Social Icons */}
    <div className="flex gap-4">
        <Facebook size={24} className="text-black cursor-pointer hover:text-blue-600" />
        <Github size={24} className="text-black cursor-pointer hover:text-blue-600" />
        <Linkedin size={24} className="text-black cursor-pointer hover:text-blue-600" />
    </div>
</div>


                </div>

                {/* Right Section: Edit Profile Button */}
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-full text-[16px] font-medium hover:bg-blue-800 transition">
                    <Pencil size={16} /> Edit Profile
                </button>
            </div>

            {/* Nav Section */}
            <div className="w-[1100px] h-[45px] border border-gray-300 rounded-[10px] bg--[#FFFF] p-2 flex items-center justify-start gap-7 mt-4 px-6 shadow-none">
                <span className="font-satoshi text-[20px] leading-[30px] tracking-[-0.02em] text-gray-700 cursor-pointer hover:text-blue-600 transition">About</span>
                <span className="font-satoshi text-[20px] leading-[30px] tracking-[-0.02em] text-gray-700 cursor-pointer hover:text-blue-600 transition">Work</span>
                <span className="font-satoshi text-[20px] leading-[30px] tracking-[-0.02em] text-gray-700 cursor-pointer hover:text-blue-600 transition">Job Posted</span>
                <span className="font-satoshi text-[20px] leading-[30px] tracking-[-0.02em] text-gray-700 cursor-pointer hover:text-blue-600 transition">Donation History</span>
            </div>

            {/* Personal Information Section */}
            <div className="w-[1100px] mt-6 relative">
                <SectionHeader title="PERSONAL INFORMATION" />
            </div>
            <div className="w-[1100px] mt-6 relative">
                <SectionHeader title="SKILLS AND INTEREST" />
            </div>
            <div className="w-[1100px] mt-6 relative">
                <SectionHeader title="AFFILIATIONS" />
            </div>
            <div className="w-[1100px] mt-6 relative">
                <SectionHeader title="SCHOLARSHIPS" />
            </div>
        </div>
    );
}

export default UserProfile;
