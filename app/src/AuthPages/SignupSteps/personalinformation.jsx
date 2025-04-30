import "../../index.css";
import Step1 from "../../assets/SignupAssets/step1.png"
import { useAppContext } from "../AuthContext/signupcontext.jsx"
import {useState, useEffect } from "react";
import Loading from "../../components/LoadingComponents/starloading.jsx"

function PersonalInformation(){
    const { userData, updateUserData, setUserData, userType } = useAppContext();
    const { setCurrentSection} = useAppContext();
    const {setUserType} = useAppContext();
    const [error, setError] = useState(true);

    const [passMismatch, setPassMismatch] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState("")
    
    const [firstNameError, setFirstNameError] = useState(false)
    const [lastNameError, setLastNameError] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)

    const [loading, setLoading] = useState(false)

    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

    const checkFields = async() => {
        console.log(userType)
        setLoading(true)

        const checker = await checkEmailAvailability(userData.email)
        console.log(checker)
        if (!checker) {
            alert("Email already Registered, please register a new email address")
            userData.email=""
            console.log("HELJDKFDSF", checker)
        }
        else if (userData.firstName == "" || userData.lastName== "" || (userData.email=="" || validateEmail(userData.email) == false) || userData.password==""){
            setError(false)
            if (userData.firstName == "") setFirstNameError(true); else setFirstNameError(false)
            if (userData.lastName == "") setLastNameError(true); else setLastNameError(false)
            if (userData.email == "" || validateEmail(userData.email) == false) setEmailError(true), console.log(userData.email); else setEmailError(false)
            if (userData.password == "") setPasswordError(true); else setPasswordError(false)
            
        } else if (passMismatch==true){
            console.log("Password Mismatch")
            console.log(validateEmail(userData.email))
        } else {
            setCurrentSection("2")
            
        }
        setLoading(false)
    }

    const checkEmailAvailability = async (email) => {
        try {
            const response = await fetch(`${API_BASE_URL}/get-email?email=${email}`);
            const isAvailable = await response.json(); // This will be true or false directly
            return isAvailable;
        } catch (error) {
            console.error("Error checking email availability:", error);
            return false;
        }
    };
    


    
    const updateConfirmPassword = (e) => {
        const value = e.target.value; 
        setConfirmPassword(value); // Update state with new input value
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };


    useEffect(() => {
        if (confirmPassword !== userData.password) {
            setPassMismatch(true)
        } else {
            setPassMismatch(false)
        }
    },[confirmPassword, userData.password])
    return(
        <div className="flex flex-col w-full items-center pt-40 sm:pt-0 sm:mt-0 mt-10">
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
                        <label className="2xl font-satoshi-regular pb-2">First Name<label className="text-red-700">*</label></label>
                        <input type="text" 
                                value={userData.firstName} 
                                className={`pl-3 w-[100%] md:w-[95%] mb-5 md:mb-0 border-1 rounded-lg h-full ${firstNameError==false ? 'border-black':'border-red-600'}`}
                                onChange={(e) => updateUserData("firstName", e.target.value)}
                        />

                    </div>
                    <div className=" text-black flex flex-col">
                        <label className="2xl font-satoshi-regular pb-2">Last Name <label className="text-red-700">*</label></label>
                        <input type="text" 
                                value={userData.lastName} 
                                className={`pl-3 w-[100%] border-1 rounded-lg h-full ${lastNameError==false ? 'border-black':'border-red-600'}`}
                                onChange={(e) => updateUserData("lastName", e.target.value)}
                        />
                    
                    </div>
                </div>
                <div className="flex flex-col font-satoshi-regular ">
                        <label className="2xl font-satoshi-regular pb-2 ">Email <label className="text-red-700">*</label></label>
                        <input type="name" 
                               value={userData.email} 
                               onChange={(e) => updateUserData("email", e.target.value)}
                               className={`pl-3 w-[100%] border-1 rounded-lg h-10 ${emailError==false ? 'border-black':'border-red-600'}`}
                        />
                </div>
                <div className="flex flex-col font-satoshi-regular ">
                        <label className="2xl font-satoshi-regular pb-2 ">Password <label className="text-red-700">*</label></label>
                        <input type="password" 
                               value={userData.password} 
                               onChange={(e) => {updateUserData("password", e.target.value)}}
                               className={`pl-3 w-[100%] border-1 rounded-lg h-10 ${passwordError==false ? 'border-black':'border-red-600'}`}
                        />
                </div>
                <div className="flex flex-col font-satoshi-regular ">
                        <label className="2xl font-satoshi-regular pb-2 ">Confirm Password <label className="text-red-700">*</label></label>
                        <input type="password" value = {confirmPassword} onChange={updateConfirmPassword} className="pl-3 w-[100%] border-1 rounded-lg h-10"/>
                        <label className={`text-red-600 text-sm font-satoshi-light-italic ${passMismatch ? '': 'hidden'}`} >Passwords do not match</label>
                </div>
                <div className={`row-span-2 items-center flex mt-0 -pb-10 text-red-400 ${error ? 'hidden': 'block'}`}>
                    <label>Please answer all fields above correctly</label>

                </div>
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

                        {loading ? (
                            <Loading/>
                        ):
                        <button
                            className="bg-primary text-white py-3 rounded-2xl text-lg w-4/6 font-bold hover:bg-blue-700 transition mt-0"
                            onClick={checkFields}
                        >
                            Next

                        </button>


                        }
                        
                    </div>
                </div>
            </div>
        </div>
    );
}



export default PersonalInformation;