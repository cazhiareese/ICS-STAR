import "../../index.css";

import Sample2 from "./studentinformation.jsx"
import Sample3 from "./successpage.jsx"
import AlumniInfo from "./alumniinformation.jsx"
import Sample from "./personalinformation.jsx"
import Alumni from "../../assets/SignupAssets/Alumni.png"
import Student from "../../assets/SignupAssets/Student.png"
import { useState, useEffect } from "react";
import { GraduationCap, BookOpen } from 'lucide-react';
import { useAppContext } from "../AuthContext/signupcontext.jsx"


function SignupMain() {

    const {currentSection, userData, setCurrentSection} = useAppContext();
    const {userType, setUserType} = useAppContext();

    const {sectionOnePass, setSectionOnePass} = useAppContext();
    const {sectionTwoPass, setSectionTwoPass} = useAppContext();


    

    const StudentComponents = {
        1: <Sample />,
        2: <Sample2 />,
        3: <Sample3 />
    };

    const AlumniComponents = {
        1: <Sample />,
        2: <AlumniInfo />,
        3: <Sample3 />
    };

    const SetAlumni =()=>{
        setUserType("alumni")
        if (userData.password === null){
            setCurrentSection("2")
        }else{
            setCurrentSection("1")
        }
        
        

        
    }
    const SetStudent =()=>{
        setUserType("student")


        if (userData.password === null){
            setCurrentSection("2")
        }else{
            setCurrentSection("1")
        }
    }


    return(
        <>
            {userType=="Undefined" ?
            
            
            (
                <div className="flex flex-col items-center sm:justify-start justify-center sm:mt-20 flex-1 bg-white z-10 ">
                    <div className="flex flex-col items-start w-[70%] pt-10 mt-8">
                        <label className="text-3xl font-satoshi-bold">Register as</label>
                        <label className="text-md font-satoshi-regular text-gray-600">Select your status to get started.</label>

                        <div className="flex flex-col w-full max-w-2xl pt-10">
                            
                            {/* Alumni */}
                            <div
                            className="border border-gray-300 cursor-pointer shadow-xl flex items-center rounded-2xl mt-10 p-5 hover:shadow-2xl transition w-full p-6"
                            onClick={SetAlumni}
                            >
                            <div className="flex items-center space-x-4 w-full">
                                <img src={Alumni} alt="Alumni" className="w-14 h-14 min-w-14" />
                                <div className="flex flex-col pl-2">
                                <span className="text-black font-satoshi-bold text-lg sm:text-xl">Alumni</span>
                                <span className="text-gray-600 font-satoshi-regular text-sm sm:text-md">Join the alumni network</span>
                                </div>
                            </div>
                            </div>

                            {/* Student */}
                            <div
                            className="border border-gray-300 cursor-pointer shadow-xl flex items-center rounded-2xl mt-7 p-5 hover:shadow-2xl transition w-full p-6"
                            onClick={SetStudent}
                            >
                            <div className="flex items-center space-x-4 w-full">
                                <img src={Student} alt="Student" className="w-14 h-14 min-w-14" />
                                <div className="flex flex-col pl-2">
                                <span className="text-black font-satoshi-bold text-lg sm:text-xl">Student</span>
                                <span className="text-gray-600 font-satoshi-regular text-sm sm:text-md">Join as a current ICS student</span>
                                </div>
                            </div>
                            </div>

                        </div>
                        </div>
                </div>
            ):
            (
                
                <div className="flex flex-col items-center justify-start sm:mt-20 sm:flex-1 bg-white sm:z-10">
                    {/* <div className = "flex flex-row z-10 space-x-8">
                        <button className = "w-15 h-15 " onClick={()=>setCurrentSection(1)}></button>
                        <button className = "w-15 h-15 " onClick={()=>setCurrentSection(2)}></button>

                        {/*  Placeholder buttons do not work, only for debugging and better placement of the 2 buttons above*/}
                        {/*<button className = "w-15 h-15 " ></button>
                        <button className = "w-15 h-15 "/> 
                    </div> */}

                    <div className="-mt-12 flex-1 flex w-full overflow-auto">
                        {userType === "student" 
                            ? (StudentComponents[currentSection] || <div>Invalid Section</div>) 
                            : (AlumniComponents[currentSection] || <div>Invalid Section</div>)
                        }
                    </div>
                

                
                </div>
            )}
            
        </>
        


    );

}

export default SignupMain;