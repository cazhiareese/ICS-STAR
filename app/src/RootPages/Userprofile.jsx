import React from 'react';
import { MapPin, Phone, IdCard, GraduationCap, Camera, Facebook, Github, Linkedin, Pencil } from "lucide-react";
import prince from '../assets/prince boy.jpg';
import SectionHeader from '../components/sectionheader';

function UserProfile() {
    return (
        <div className="flex flex-col items-center relative min-h-screen mt-10 gap-y-4 px-4 sm:px-6 lg:px-0">
            {/* Profile Section */}
            <div className="w-full max-w-[1100px] border border-gray-300 rounded-[10px] bg-white p-6 flex flex-col sm:flex-row items-center sm:justify-between">
                
                {/* Left Section: Profile Picture */}
                <div className="relative flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
                    <div className="relative w-[140px] sm:w-[160px] h-[140px] sm:h-[160px] rounded-full border-[1.5px] border-black flex items-center justify-center overflow-hidden">
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
                    <div className="flex flex-col items-center sm:items-start gap-2 text-center sm:text-left">
                        <h2 className="font-satoshi-black text-[24px] sm:text-[32px] leading-[22px] tracking-[-0.02em] text-primary">
                            Kiefer L. Tayawa
                        </h2>
                        <p className="font-satoshi-medium text-[18px] sm:text-[24px] leading-[22px] tracking-[-0.02em] text-black">
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
                <button className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-full text-[16px] font-medium hover:bg-blue-800 transition">
                    <Pencil size={16} /> Edit Profile
                </button>
            </div>

            {/* Nav Section */}
            <div className="w-full max-w-[1100px] border border-gray-300 rounded-[10px] bg-white p-2 flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-7 mt-4 px-6">
                <span className="font-satoshi text-[18px] sm:text-[20px] leading-[30px] tracking-[-0.02em] text-gray-700 cursor-pointer hover:text-blue-600 transition">
                    About
                </span>
                <span className="font-satoshi text-[18px] sm:text-[20px] leading-[30px] tracking-[-0.02em] text-gray-700 cursor-pointer hover:text-blue-600 transition">
                    Work
                </span>
                <span className="font-satoshi text-[18px] sm:text-[20px] leading-[30px] tracking-[-0.02em] text-gray-700 cursor-pointer hover:text-blue-600 transition">
                    Job Posted
                </span>
                <span className="font-satoshi text-[18px] sm:text-[20px] leading-[30px] tracking-[-0.02em] text-gray-700 cursor-pointer hover:text-blue-600 transition">
                    Donation History
                </span>
            </div>

            {/* Information Sections */}
            <div className="w-full max-w-[1100px] mt-6">
                <SectionHeader title="PERSONAL INFORMATION" />
            </div>
            <div className="w-full max-w-[1100px] mt-6">
                <SectionHeader title="SKILLS AND INTEREST" />
            </div>
            <div className="w-full max-w-[1100px] mt-6">
                <SectionHeader title="AFFILIATIONS" />
            </div>
            <div className="w-full max-w-[1100px] mt-6">
                <SectionHeader title="SCHOLARSHIPS" />
            </div>
        </div>
    );
}

export default UserProfile;
