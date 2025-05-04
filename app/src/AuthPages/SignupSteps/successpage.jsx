    import "../../index.css";
    import Step3 from "../../assets/SignupAssets/step3.png"
    import { useAppContext } from "../AuthContext/signupcontext";
    import { useNavigate } from "react-router-dom";

    import { useState } from "react";

    import Loading from "../../components/LoadingComponents/starloading.jsx"

    function Success(){
        const navigate = useNavigate();
        const {currentSection, setCurrentSection, userData, userType} = useAppContext();
        const [loading, setLoading] = useState(false)

        const handleNextPage = async(e) => {
            // navigate("/admin/dashboard"); // Navigate to a new page
            setLoading(true)
            await register(userData.firstName,
                userData.lastName, 
                userData.email, 
                userData.password, 
                userData.selectedYear + "" + userData.value,
                userType,
                userData.file,
                userData.academicYear,
                userData.selectedYear
            )
            setLoading(false)
        };

        const baseURL = import.meta.env.VITE_BACKEND_URL;

        const register = async () => {
            try {
                const formData = new FormData();
                formData.append("first_name", userData.firstName);
                formData.append("last_name", userData.lastName);
                formData.append("email", userData.email);
                formData.append("password", userData.password);
                formData.append("student_number", `${userData.selectedYear}-${userData.value}`);
                formData.append("user_type", userType);
        
                if (userData.file) {
                    formData.append("verification_file", userData.file);
                }
        
                if (userType === "alumni") {
                    console.log(userData.academicYear)
                    formData.append("graduation_year", String(userData.academicYear).slice(-4));
                    formData.append("graduation_semester", userData.selectedTerm);
                }
        
                const response = await fetch(`${baseURL}/register`, {
                    method: "POST",
                    body: formData,
                });
        
                const data = await response.json();
        
                if (response.ok) {
                    localStorage.setItem("token", data.access_token);
                        alert("Registration Successful!");
        
                        // Redirect based on userType
                        window.location.href = userType === "alumni" ? "/alumni/dashboard" : "/student/dashboard";
                        return
                    
                } else {
                    alert(data.detail || "Registration failed!");
                    console.error("Response Status:", response.status);
                    console.error("Response OK:", response.ok);
                    console.error(data);
                }
            } catch (error) {
                console.error("Error:", error);
                // alert("Something went wrong!");
            }
        };
        

        return(
            <div className="flex flex-col w-full items-center pt-40 sm:pt-0 sm:mt-0 mt-10">
                <div className = "flex flex-row z-20 space-x-8 mt-20">
                            <button className = "w-15 h-15" onClick={()=>setCurrentSection(1)}></button>
                            <button className = "w-15 h-15 " onClick={()=>setCurrentSection(2)}></button>

                            {/*  Placeholder buttons do not work, only for debugging and better placement of the 2 buttons above*/}
                            <button className = "w-15 h-15 " ></button>
                            <button className = "w-15 h-15 "/> 
                </div>
                <img src={Step3} className="-mt-12"/>

                <label className="font-satoshi-bold text-center text-3xl text-black pt-20 pb-6 w-80">Account Created Successfully!</label>
                
                <div className = "flex flex-col lg:w-150 md:w-100 w-70 h-full text-xl text-justify pt-15">
                        <label className="font-satoshi-medium text-primary inline">
                                Your account is currently awaiting verification by our admin team,&nbsp;
                                <label className="font-satoshi-regular text-black inline ">
                                    but in the meantime, feel free to explore the website. We'll let you know as soon as your 
                                    verification is complete.
                                </label>
                        </label>

                        <label className="font-satoshi-italic text-gray-600 pt-10">
                                    Please note: Some features may be temporarily unavailable until your account is fully verified.
                        </label>
                        
                </div>

                <div class=" flex flex-col items-end lg:w-150 md:w-100 w-70">
                {loading ? (
                    <Loading /> // Show loading component while registration is in progress
                ) : (
                    <button
                        className="bg-primary text-white py-3 rounded-3xl text-lg w-40 font-bold hover:bg-blue-700 transition mt-6 mb-50"
                        onClick = {()=>(handleNextPage())}
                    >
                        Continue
                    </button>
                )}
                </div>
            </div>
        );
    }

    export default Success