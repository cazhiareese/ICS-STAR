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

    const {currentSection, setCurrentSection} = useAppContext();
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
        setCurrentSection("1")
    }
    const SetStudent =()=>{
        setUserType("student")
        setCurrentSection("1")
    }


    return(
        <>
            {userType=="Undefined" ?
            
            
            (
                <div className="flex flex-col items-center sm:justify-start justify-center sm:mt-20 flex-1 bg-white z-10 ">
                    
                    <div className="flex flex-col items-start w-[70%] pt-10 mt-10">
                        <label className="text-3xl font-satoshi-bold">Register As</label>
                        <label className="text-md font-satoshi-light text-gray-600">Select your status to get started.</label>
                    
                    </div>
                    <div className="flex flex-col items-start w-[70%]">
                        <div className="flex flex-col w-[100%] max-w-2xl pt-10  ">
                            

                            {/* ALumni */}
                            <div className="border border-gray-300 cursor-pointer shadow-xl flex items-center h-25 rounded-2xl mt-10" onClick={SetAlumni}>
                                <div className="grid grid-cols-2 w-[60%]">
                                    
                                    <div 
                                        className="row-span-2 text-primary flex items-center justify-center">
                                        <img src={Alumni}/>
                                        
                                    </div>
                                    <label className="text-black font-satoshi-bold text-2xl">Alumni</label>
                                    <label className="text-gray-600 font-satoshi-light text-md w-50">Join the alumni network</label>
                                    
                                </div>
                            </div>
                            
                            {/* Student */}
                            <div className="border border-gray-300 cursor-pointer shadow-xl flex items-center h-25 rounded-2xl mt-7" onClick={SetStudent}>
                                <div className="grid grid-cols-2 w-[60%]">
                                    
                                <div 
                                        className="row-span-2 text-primary flex items-center justify-center">
                                        <img src={Student}/>
                                        
                                    </div>
                                    <label className="text-black font-satoshi-bold text-2xl">Student</label>
                                    <label className="text-gray-600 font-satoshi-light text-md w-50">Join as a current ICS student</label>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    
                
                </div>
            ):
            (
                
                <div className="flex flex-col items-center justify-start sm:mt-20 sm:flex-1 bg-white sm:z-10">
                    

                    <div className="-mt-5 flex-1 flex w-full overflow-auto">
                        {userType === "Student" 
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