import "../../index.css";
import Step1 from "../../assets/SignupAssets/step1.png"
import { useAppContext } from "../AuthContext/signupcontext.jsx"
import {useState } from "react";
function PersonalInformation(){
    const { userData, updateUserData, setUserData } = useAppContext();
    const { setCurrentSection} = useAppContext();
    const {setUserType} = useAppContext();
    const [error, setError] = useState(true);

    const [passMismatch, setPassMismatch] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState("")
    
    const checkFields = () => {
        if (userData.firstName == "" || userData.lastName== "" || userData.email=="" || userData.password==""){
            setError(false)
            
        } else {
            setCurrentSection("2")
            
        }
    }

    const updateConfirmPassword = (e) => {
        const value = e.target.value; 
        setConfirmPassword(value); // Update state with new input value
        
        
        
    };

    // const checkPassword = () =>{
        
    //     if (confirmPassword !== userData.password) {
    //         setPassMismatch(true)
    //     } else {
    //         setPassMismatch(false)
    //     }
    // }
    return(
        <div className="flex flex-col w-full items-center ">
            <div className = "flex flex-row z-10 space-x-8 mt-20">
                        <button className = "w-15 h-15 "></button>
                        <button className = "w-15 h-15 " onClick={checkFields}></button>

                        {/*  Placeholder buttons do not work, only for debugging and better placement of the 2 buttons above*/}
                        <button className = "w-15 h-15 " ></button>
                        <button className = "w-15 h-15 "/> 
            </div>
        {/* <Step1/> */}
        
            <img src={Step1} className="-mt-12"/>
            <label className="font-satoshi-bold text-center text-3xl text-black pt-10 pb-8">Personal Information</label>

            <div className="grid grid-cols-1 gap-4 p-4 lg:w-150 md:w-120">
                <div className="grid md:grid-cols-2 grid-cols-1 md:h-18 h-42 ">
                    <div className=" text-black flex flex-col">
                        {/* First Name */}
                        <label className="2xl font-satoshi-regular pb-2">First Name <label className="text-red-700">*</label></label>
                        <input type="text" 
                                value={userData.firstName} 
                                className="w-[100%] md:w-[95%] mb-5 md:mb-0 border-1 rounded-lg h-full"
                                onChange={(e) => updateUserData("firstName", e.target.value)}
                        />

                    </div>
                    <div className=" text-black flex flex-col">
                        <label className="2xl font-satoshi-regular pb-2">Last Name <label className="text-red-700">*</label></label>
                        <input type="text" 
                                value={userData.lastName} 
                                className="w-[100%] border-1 rounded-lg h-full"
                                onChange={(e) => updateUserData("lastName", e.target.value)}
                        />
                    
                    </div>
                </div>
                <div className="flex flex-col font-satoshi-regular ">
                        <label className="2xl font-satoshi-regular pb-2 ">Email <label className="text-red-700">*</label></label>
                        <input type="name" 
                               value={userData.email} 
                               onChange={(e) => updateUserData("email", e.target.value)}
                               className="w-[100%] border-1 rounded-lg h-10"
                        />
                </div>
                <div className="flex flex-col font-satoshi-regular ">
                        <label className="2xl font-satoshi-regular pb-2 ">Password <label className="text-red-700">*</label></label>
                        <input type="password" 
                               value={userData.password} 
                               onChange={(e) => {updateUserData("password", e.target.value); checkPassword()}}
                               className="w-[100%] border-1 rounded-lg h-10"
                        />
                </div>
                <div className="flex flex-col font-satoshi-regular ">
                        <label className="2xl font-satoshi-regular pb-2 ">Confirm Password <label className="text-red-700">*</label></label>
                        <input type="password" value = {confirmPassword} onChange={updateConfirmPassword} className="w-[100%] border-1 rounded-lg h-10"/>
                        <label className={`text-red-600 text-sm font-satoshi-light-italic ${passMismatch ? '': 'hidden'}`} >Passwords do not match</label>
                </div>
                <div className={`row-span-2 items-center flex mt-0 -pb-10 text-red-400 ${error ? 'hidden': 'block'}`}>
                    <label>Please answer all fields above</label>

                </div>
                <div className="grid grid-cols-2 h-18 items-center justify-center pt-10">
                    <div className=" text-black items-start">
                        <button
                            className="bg-primary text-white py-3 rounded-2xl text-lg w-4/6 font-bold hover:bg-blue-700 transition mt-0"
                            onClick={()=>{setCurrentSection("0"); setUserType("Undefined")}}
                        >
                            Back
                        </button>
                    </div>
                    <div className=" text-black flex flex-col items-end">
                        <button
                            className="bg-primary text-white py-3 rounded-2xl text-lg w-4/6 font-bold hover:bg-blue-700 transition mt-0"
                            onClick={checkFields}
                        >
                            Next

                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}



export default PersonalInformation;