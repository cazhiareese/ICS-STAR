import { useState } from "react";
import "../index.css";
import { PersonStanding } from "lucide-react";
import loginBg from "./login_gradientbg.jpeg";
import Constellations from "./constellationLogin.png";
import ConstellationsUp from "./constellationLoginUp.png";
import ConstellationsMobile from "./constellationMobile.png";
import ICSSTARHEAD from "./ics-starhead.png";
import Star from "./Star 52.png"
import { Eye, EyeClosed } from 'lucide-react';

function Login() {

    const [activeEmail, setActiveEmail] = useState(false);
    const [email, setEmail] = useState("");

    const [activePassword, setActivePassword] = useState(false);
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false)

    const [isLoading, setIsLoading] = useState(false);

    const loginClick = () => {
        setIsLoading(true);
        setTimeout(() => {
        setIsLoading(false); // Simulate loading (remove if unnecessary)
        }, 3000);
    };

  return (
    <div className="flex items-center justify-center h-screen">
        {/* Background */}

        <div className="absolute inset-0 bg-cover object-fill bg-center scale-100 opacity-50 md:opacity-50"
            style={{ backgroundImage: `url(${loginBg})` }}>
            <div className="absolute inset-0"></div>
        </div>

        {/* Lower COnstellation */}
        <div className="hidden sm:absolute bottom-0 left-0 min-w-2xl w-3/5 ">
            <img 
                src={Constellations}
                alt="Login Background" 
                className="w-[70%]"
            />
        </div>

        {/* Upper COnstellation */}
        <div className="hidden sm:absolute top-0 right-0 w-3/5 min-w-2xl">
            <img 
                src={ConstellationsUp}
                alt="Login Background" 
                className="absolute top-0 right-0 w-[70%]"
            />
        </div>

        {/* Login Signup */}
        <div className="flex flex-col items-center justify-center w-screen h-screen p-10 z-10">
            

            {/* Mobile COnstellation */}
            <div className="sm:hidden block w-screen -mt-20 h-[40%] ">
                <img 
                    src={ConstellationsMobile}
                    alt="Login Background" 
                    className="w-[100%]  object-cover"
                />
            </div>

            {/* ICS-STAR */}

            <div className="flex justify-center sm:pt-30 md:pt-0 sm:absolute sm:top-10 sm:left-0 sm:min-w-3xl ">
                <img 
                    src={ICSSTARHEAD}
                    alt="Login Background" 
                    className="sm:absolute sm:left-15 sm:top-0 sm:w-[25%] w-50"
                />
            </div>
            

            <div className="sm:hidden flex flex-col w-full mt-5">
                        <h1 className="text-3xl sm:text-5xl font-satoshi-light text-center">Bridging Alumni</h1>
                        <h1 className="text-3xl sm:text-5xl font-satoshi-bold font-bold text-primary text-center">Across the Cosmos</h1>
            </div>

            {/* Login Signup */}
            <div className="flex flex-col items-center justify-center -mt-10 sm:mt-30 w-[30%] h-[70%] min-w-md sm:min-w-lg sm:bg-[#F5F5F5] sm:shadow-[0px_10px_30px_rgba(0,0,0,0.3)] sm:rounded-4xl">
                    <h1 className="hidden sm:block text-8xl font-satoshi-medium mb-16 text-[#102E46]">Login</h1> 
                    
                    
                    {/* Email Input */}
                    
                    <div className="emailButton mb-12 cursor-pointer w-[60%] sm:w-[70%]">

                        
                        <label className="block cursor-pointer text-gray-600 sm:text-lg -mb-0" onClick={() => setActiveEmail(!activeEmail)}>
                        {!activeEmail ? (
                            email ? `Email: ${email}` : <span className="text-gray-600">Email</span>
                        ) : (
                            "Email"
                        )}
                        </label>
                        
                            
                        <div className="relative">

                        
                            {/* Diamond swing */}
                            <span
                                className={`absolute cursor-pointer w-full top-1 transition-transform duration-400 transform text-primary ${activeEmail ? 'translate-x-full right-0 pt-10 mr-2' : 'translate-x-0 left-0'}`}
                                onClick={() => setActiveEmail(!activeEmail)}
                            >◆</span>

                                {!activeEmail ? 
                                
                                <div className="w-full border-b-2 border-gray-400 focus-within:border-blue-500 outline-none py-2" 
                                onClick={() => setActiveEmail(!activeEmail)}></div>
                                
                                : <input 
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                // onBlur={() => setActiveEmail(false)}
                                className="w-full pt-5 border-b-2 border-gray-400 focus:border-blue-500 outline-none py-2 text-lg font-satoshi-variable"
                                /> }
                            
                        </div>
                    </div>

                    {/* Password */}
                    <div className="passwordButton mb-12 cursor-pointer w-[60%] sm:w-[70%]">

                        
                        <label className="block cursor-pointer text-gray-600 sm:text-lg -mb-0" onClick={() => setActivePassword(!activePassword)}>
                        {!activePassword ? (
                            password ? `Password:  ${showPassword ? password : "*".repeat(password.length)}` : <span className="text-gray-600">Password</span>
                        ) : (
                            "Password"
                        )}
                        </label>
                        
                            
                        <div className="relative">

                        
                            {/* Diamond swing */}
                            <span
                                className={`absolute cursor-pointer w-full top-1 transition-transform duration-400 transform text-primary ${activePassword ? 'translate-x-full right-0 pt-10 mr-2' : 'translate-x-0 left-0'}`}
                                onClick={() => setActivePassword(!activePassword)}
                            >◆</span>

                                {!activePassword ? 
                                    <>
                                    <div className="w-full border-b-2 border-gray-400 focus-within:border-blue-500 outline-none py-2" 
                                    onClick={() => setActivePassword(!activePassword)}>
                                    </div>
                                    <span className="absolute right-2 -top-6 text-gray-500 cursor-pointer "onClick={() => setShowPassword(!showPassword)}>
                                        
                                        {
                                            showPassword ? (
                                                <Eye/>
                                            ) : (
                                                <EyeClosed/>
                                            )
                                        }
                                    </span></>
                                    
                                    : <>
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        // onBlur={() => setActivePassword(false)}
                                        className="w-full pt-5 border-b-2 border-gray-400 focus:border-blue-500 outline-none py-2 text-lg font-satoshi-variable"
                                    /> 

                                    <span 
                                        className="absolute right-2 top-6 text-gray-500 cursor-pointer" 
                                        onClick={() => setShowPassword(!showPassword)}
                                    >{
                                        showPassword ? (
                                            <Eye/>
                                        ) : (
                                            <EyeClosed/>
                                        )
                                    }</span>
                                    
                                    </>
                                }
                            
                        </div>
                    </div>
                    

                    {/* Login Button */}
                    {/* <button className="bg-primary cursor-pointer text-white py-3 rounded-lg text-lg w-[50%] font-bold hover:bg-blue-700 transition mt-0">
                    Login
                    </button> */}

                    {isLoading ? (
                        // Rotating image
                        <img
                        src={Star}
                        alt="Loading"
                        className="w-12 h-12 animate-spin"
                        />
                    ) : (
                        // Normal button
                        <button
                        className="bg-primary text-white py-3 rounded-lg text-lg w-[50%] font-bold hover:bg-blue-700 transition mt-0"
                        onClick={loginClick}
                        >
                        Login
                        </button>
                    )}

                    {/* Signup Link */}
                    <p className="text-center text-gray-600 mt-4">
                        Don’t have an account? <a href="#" className="text-blue-600 font-semibold">Signup here</a>
                    </p>
            </div>
            
            {/* Caption below */}
            <div className="hidden sm:block flex flex-col w-full pt-10 ">
                <h1 className="text-5xl font-satoshi-light text-right">Bridging Alumni</h1>
                <h1 className="text-5xl font-satoshi-bold font-bold text-primary text-right">Across the Cosmos</h1>
            </div>
        </div>
    </div>
    
  );
}

export default Login;
