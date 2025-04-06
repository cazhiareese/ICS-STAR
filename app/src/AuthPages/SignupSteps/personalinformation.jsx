import "../../index.css";
import Step1 from "../../assets/SignupAssets/step1.png"
import { useAppContext } from "../AuthContext/signupcontext.jsx"
import {useState, useEffect } from "react";
import ErrorBox from "../errorbox.jsx";
import { CircleAlert } from 'lucide-react';

function PersonalInformation(){
    const { userData, updateUserData, setUserData } = useAppContext();
    const { setCurrentSection} = useAppContext();
    const {setUserType} = useAppContext();
    const [error, setError] = useState(true);

    const [passMismatch, setPassMismatch] = useState(false)
    const {confirmPassword, setConfirmPassword} = useAppContext();
    
    const [firstNameError, setFirstNameError] = useState(false)
    const [lastNameError, setLastNameError] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [confirmpasswordError, setConfirmpasswordError] = useState(false)


    const checkFields = () => {
        if (userData.firstName == "" || userData.lastName== "" || (userData.email=="" || validateEmail(userData.email) == false) || userData.password==""){
            setError(false)
            if (userData.firstName == "") setFirstNameError(true); else setFirstNameError(false)
            if (userData.lastName == "") setLastNameError(true); else setLastNameError(false)
            if (userData.email == "" || validateEmail(userData.email) == false) setEmailError(true), console.log(userData.email); else setEmailError(false)
            if (userData.password == "") setPasswordError(true); else setPasswordError(false)
            if (userData.confirmPassword == "") setConfirmpasswordError(true); else setConfirmpasswordError(false)
            
        } else if (passMismatch==true){
            console.log("Password Mismatch")
        } else {
            setCurrentSection("2")
        }
    }

    const updateConfirmPassword = (e) => {
        const value = e.target.value; 
        setConfirmPassword(value); // Update state with new input value
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };


    useEffect(() => {
        if (userData.confirmPassword !== userData.password) {
            setPassMismatch(true)
        } else {
            setPassMismatch(false)
        }
    },[userData.confirmPassword, userData.password])

    useEffect(()=>{
        if (firstNameError && userData.firstName!=""){
            setFirstNameError(false)
        }
        if (lastNameError && userData.lastName!=""){
            setLastNameError(false)
        }
        if (emailError && userData.email!="" && validateEmail(userData.email) == true){
            setEmailError(false)
        }
        if (passwordError && userData.password!=""){
            setPasswordError(false)
        }
        if (confirmpasswordError && userData.confirmPassword!=""){
            setConfirmpasswordError(false)
        }

    }, [firstNameError, lastNameError, emailError, passwordError, confirmpasswordError, userData])
    return(
        <div className="flex flex-col w-full items-center pt-0 mt-0">
            <div className = "fixed flex flex-row z-20 space-x-8 mt-9 ">
                        <button className = "w-15 h-15 "></button>
                        <button className = "w-15 h-15 " onClick={checkFields}></button>

                        {/*  Placeholder buttons do not work, only for debugging and better placement of the 2 buttons above*/}
                        <button className = "w-15 h-15 " ></button>
                        <button className = "w-15 h-15 "/> 
            </div>
        {/* <Step1/> */}
        
            <img src={Step1} className="fixed mt-10 z-10"/>
            <label className="fixed font-satoshi-bold text-center text-3xl text-black pt-30 pb-8 bg-white ">Personal Information</label>

            <div className="grid grid-cols-1 gap-4 p-4 lg:w-150 md:w-120 pt-50">
                <div className="grid grid-cols-2 h-18 ">
                    <div className={` text-black flex flex-col ${firstNameError==false ? 'h-18':'h-25 '}`}>
                        {/* First Name */}
                        <label className="2xl font-satoshi-regular pb-2">First Name <label className="text-red-700">*</label></label>
                        
                        <div className="relative w-full h-full ">
                            <input type="text" 
                                    value={userData.firstName} 
                                    className={`w-[95%] mb-0 border-1 rounded-lg pl-3 ${firstNameError==false ? 'border-black h-full ':'border-red-600 h-3/5'}`}
                                    onChange={(e) => updateUserData("firstName", e.target.value)}
                            />
                            <div className={`rounded-full w-6 h-6 flex items-center justify-center bg-red-600 absolute right-6 transform -translate-y-1/2 top-5 text-white ${firstNameError ? "block":"hidden"} `}>
                                    <label className="font-satoshi-bold">!</label>
                            </div>
                        </div>
                        
                        

                    </div>
                    <div className={`text-black flex flex-col ${lastNameError==false ? 'h-18':'h-25 '}`}>
                        <label className="2xl font-satoshi-regular pb-2">Last Name <label className="text-red-700">*</label></label>
                        <div className="relative w-full h-full ">
                            <input type="text" 
                                    value={userData.lastName} 
                                    className={`w-[100%] border-1 rounded-lg pl-3 ${lastNameError==false ? 'border-black h-full ':'border-red-600 h-3/5'}`}
                                    onChange={(e) => updateUserData("lastName", e.target.value)}
                            />
                            <div className={`rounded-full w-6 h-6 flex items-center justify-center bg-red-600 absolute right-6 transform -translate-y-1/2 top-5 text-white ${lastNameError ? "block":"hidden"} `}>
                                    <label className="font-satoshi-bold">!</label>
                            </div>
                        </div>
                        
                        {/* {lastNameError && <ErrorBox/>} */}
                    </div>
                    
                </div>
                {/* <div className="pt-5"> */}
                    
                {/* </div> */}
                <div className="-mt-4 flex flex-row w-full">
                    <div className="w-1/2 flex items-start">
                        {firstNameError && <ErrorBox />}
                    </div>

                    <div className="w-1/2 flex items-start">
                        {lastNameError && <ErrorBox />}
                    </div>
                </div>
                {/* {firstNameError && <ErrorBox/>} */}
                <div className={`flex flex-col font-satoshi-regular ${lastNameError || firstNameError ? "-mt-0":"-mt-3"} `}>
                        <label className="2xl font-satoshi-regular pb-2 ">Email <label className="text-red-700">*</label></label>
                            <div className="relative w-full h-full ">
                                <input type="name" 
                                    value={userData.email} 
                                    onChange={(e) => updateUserData("email", e.target.value)}
                                    className={`pl-3 w-[100%] border-1 rounded-lg h-10 ${emailError==false ? 'border-black':'border-red-600'}`}
                                />
                                <div className={`rounded-full w-6 h-6 flex items-center justify-center bg-red-600 absolute right-6 transform -translate-y-1/2 top-5 text-white ${emailError ? "block":"hidden"} `}>
                                    <label className="font-satoshi-bold">!</label>
                                </div>
                            </div>
                        {emailError && <ErrorBox/>}
                </div>
                <div className="flex flex-col font-satoshi-regular ">
                        <label className="2xl font-satoshi-regular pb-2 ">Password <label className="text-red-700">*</label></label>
                            <div className="relative w-full h-full ">                        
                                <input type="password" 
                                    value={userData.password} 
                                    onChange={(e) => {updateUserData("password", e.target.value)}}
                                    className={`w-[100%] border-1 rounded-lg h-10 pl-3 ${passwordError==false ? 'border-black':'border-red-600'}`}
                                />
                                <div className={`rounded-full w-6 h-6 flex items-center justify-center bg-red-600 absolute right-6 transform -translate-y-1/2 top-5 text-white ${passwordError ? "block":"hidden"} `}>
                                    <label className="font-satoshi-bold">!</label>
                                </div>
                            </div>
                        {passwordError && <ErrorBox/>}
                </div>
                <div className="flex flex-col font-satoshi-regular ">
                        <label className="2xl font-satoshi-regular pb-2 ">Confirm Password <label className="text-red-700">*</label></label>
                            <div className="relative w-full h-full ">    
                                <input type="password" value = {userData.confirmPassword} onChange={(e) => {updateUserData("confirmPassword", e.target.value)}} className={` pl-3 w-[100%] border-1 rounded-lg h-10 ${confirmpasswordError==false ? 'border-black':'border-red-600'}`}/>
                                <label className={`text-red-600 text-sm font-satoshi-light-italic ${passMismatch ? '': 'hidden'}`} >Passwords do not match</label>
                                
                                <div className={`rounded-full w-6 h-6 flex items-center justify-center bg-red-600 absolute right-6 transform -translate-y-1/2 top-5 text-white ${confirmpasswordError ? "block":"hidden"} `}>
                                            <label className="font-satoshi-bold">!</label>
                                </div>
                            </div>
                        {/* {confirmpasswordError && <ErrorBox/>} */}
                </div>
                {/* <div className={`row-span-2 items-center flex mt-0 -pb-10 text-red-400 ${error ? 'hidden': 'block'}`}>
                    <label>Please answer all fields above correctly</label>

                </div> */}
                <div className="grid grid-cols-2 h-18 items-center justify-center sm:pb-0 mb-10">
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