import { useState, useEffect } from "react";
import "../index.css";
import { PersonStanding } from "lucide-react";
import loginBg from "../assets/login_gradientbg.jpeg";
import Constellations from "../assets/constellationLogin.png";
import ConstellationsUp from "../assets/constellationLoginUp.png";
import ConstellationsMobile from "../assets/constellationMobile.png";
import ICSSTARHEAD from "../assets/ics-starhead.png";
import Star from "../assets/Star 52.png"
import { Eye, EyeClosed } from 'lucide-react';
import { useNavigate } from "react-router-dom";

function SignupPage() {

    const [activeEmail, setActiveEmail] = useState(false);
    const [email, setEmail] = useState("");

    const [activePassword, setActivePassword] = useState(false);
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false)

    const [isLoading, setIsLoading] = useState(false);

    // const loginClick = () => {  
    //     setIsLoading(true);
    //     setTimeout(() => {
    //     setIsLoading(false); // Simulate loading (remove if unnecessary)
    //     }, 3000);

        
    // };

    const login = async (e) => {
      // setIsLoading(true);
      // setTimeout(() => {
      // setIsLoading(false); // Simulate loading (remove if unnecessary)
      // }, 3000);

      // e.preventDefault(); // Prevent page reload
      setIsLoading(true); // Show loading spinner

      try {
          const response = await fetch("http://localhost:8000/token", {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: new URLSearchParams({ username: email, password: password }),
          });

          const data = await response.json();

          if (response.ok) {
              localStorage.setItem("token", data.access_token);
              // alert("Login Successful!");
              fetchUserData();
              
          } else {
              alert(data.detail || "Login failed!");
              alert(data)
          }
      } catch (error) {
          console.error("Error:", error);
          alert("Something went wrong!");
      } finally {
          setIsLoading(false); 
      }
  };

    const loginClick = async (e) => {
        e.preventDefault();
        await login(email, password);
    };

    const fetchUserData = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.log("No token found.");
            return;
        }
    
        try {
            const response = await fetch("http://localhost:8000/users/me/", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            if (!response.ok) {
                console.error("Failed to fetch user data:", response.status);
                return; // Stop execution if response is not OK
            }
    
            const userData = await response.json();
            console.log("User Info:", userData);

            if (userData.user_type=="alumni"){
                window.location.href = "/alumni";

            } else if (userData.user_type=="student"){
                window.location.href = "/student";

            } else if (userData.user_type=="admin"){
                window.location.href = "/admin";
            }

        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };
    // bob@student.com

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleLogin = (userType) => {
        sessionStorage.setItem("User", JSON.stringify({ type: userType }));
        navigate(`/${userType}`);
      };

  return (
    <div className="flex items-center justify-center h-screen overflow-hidden">
        {/* Background */}

        <div className="absolute inset-0 bg-cover object-fill bg-center scale-100 opacity-50 md:opacity-50"
            style={{ backgroundImage: `url(${loginBg})` }}>
            <div className="sticky inset-0"></div>
        </div>

        {/* Lower COnstellation */}
        <div className="absolute opacity-0 sm:opacity-100 bottom-0 left-0 sm:min-w-2xl w-3/5 ">
            <img 
                src={Constellations}
                alt="Login Background" 
                className="w-[70%]"
            />
        </div>

        {/* Upper COnstellation */}
        <div className="absolute opacity-0 sm:opacity-100 top-0 right-0 w-3/5 sm:min-w-2xl ">
            <img 
                src={ConstellationsUp}
                alt="Login Background" 
                className="absolute top-0 right-0 w-[70%]"
            />
        </div>

        {/* Lower Portion */}
        <div className="flex flex-col overflow-auto [@media(max-height:800px)]:justify-normal items-center justify-center w-screen h-screen p-10 z-10">
            

            {/* Mobile COnstellation */}
            <div className="sm:hidden block w-screen -mt-20 h-[40%] [@media(max-height:800px)]:opacity-40 [@media(max-height:800px)]:opacity-40">
                <img 
                    src={ConstellationsMobile}
                    alt="Login Background" 
                    className="w-[100%] object-cover"
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
            

            <div className="sm:hidden flex flex-col w-full mt-5 ">
                        <h1 className="text-3xl sm:text-5xl font-satoshi-light text-center">Bridging Alumni</h1>
                        <h1 className="text-3xl sm:text-5xl font-satoshi-bold font-bold text-primary text-center">Across the Cosmos</h1>
            </div>

            {/* Login Signup */}
            <div className="flex flex-col items-center justify-center sm:mt-30 w-[30%]  min-h-110 sm:min-h-135 min-w-sm sm:min-w-md sm:bg-[#F5F5F5] sm:shadow-[0px_10px_30px_rgba(0,0,0,0.3)] sm:rounded-4xl">
                    <h1 className="hidden sm:block text-8xl font-satoshi-light mb-0 text-[#102E46]">Signup</h1> 
                    
                    
                    {/* Email Input */}
                    
                    <div className="flex flex-col justify-end pb-7 h-[25%] emailButton sm:-mb-5 cursor-pointer w-[60%] sm:w-[70%]">

                        
                        <label className="block overflow-x-scroll whitespace-nowrap scroll-bar-hide cursor-pointer text-gray-600 sm:text-lg -mb-0" onClick={() => setActiveEmail(!activeEmail)}>
                        {!activeEmail ? (
                            email ? `Email: ${email}` : <span className="text-gray-600">Email</span>
                        ) : (
                            "Email"
                        )}
                        </label>
                        
                            
                        <div className="relative">

                        
                            {/* Diamond swing */}
                            <span
                                className={`absolute cursor-pointer w-full top-1 transition-transform duration-400 transform text-primary ${activeEmail ? 'translate-x-full right-0 pt-7 mr-2' : 'translate-x-0 left-0'}`}
                                onClick={() => setActiveEmail(!activeEmail)}
                            >◆</span>

                                {!activeEmail ? 
                                
                                <div className="w-full border-b-2 border-gray-400 focus-within:border-blue-500 outline-none py-2" 
                                onClick={() => setActiveEmail(!activeEmail)}></div>
                                
                                : <input 
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={() => setActiveEmail(false)}
                                className="w-full py-2 border-b-2 border-gray-400 focus:border-blue-500 outline-none  text-lg font-satoshi-variable"
                                placeholder="Enter Email Here"
                                /> }
                            
                        </div>
                    </div>

                    {/* Password */}
                    <div className="flex flex-col justify-end  h-[15%] -passwordButton mb-16 cursor-pointer w-[60%] sm:w-[70%]">

                        
                        <label className="block overflow-x-auto whitespace-nowrap scroll-bar-hide cursor-pointer text-gray-600 sm:text-lg " onClick={() => setActivePassword(!activePassword)}>
                            {!activePassword ? (
                                password ? `Password:  ${showPassword ? password : "*".repeat(password.length)}` : <span className="text-gray-600">Password</span>
                            ) : (
                                "Password"
                            )}
                        </label>
                        
                            
                        <div className="relative">

                        
                            {/* Diamond swing */}
                            <span
                                className={`absolute cursor-pointer w-full top-1 transition-transform duration-400 transform text-primary ${activePassword ? 'translate-x-full right-0 mr-2 pt-5.5' : 'translate-x-0 left-0'} z-10`}
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
                                        onBlur={() => setActivePassword(false)}
                                        className=" w-full border-b-2 mt-2 pb-2 border-gray-400 focus:border-blue-500 outline-none text-lg font-satoshi-variable pr-10"
                                        placeholder="Enter Password Here"
                                    /> 

                                    <span 
                                        className="absolute right-2 top-3 text-gray-500 cursor-pointer" 
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

export default SignupPage;


// function LoginPage() {
//   const navigate = useNavigate();

  

//   return (
//     <>
//         <div className="flex items-center justify-center min-h-screen bg-gray-100">
//         <div className="container max-w-md p-6 bg-white shadow-lg rounded-lg text-center">
//             <h1 className="text-3xl font-bold text-blue-500">Login</h1>
//             <button
//             className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//             onClick={() => handleLogin("student")}
//             >
//             Login as Student
//             </button>
//             <button
//             className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
//             onClick={() => handleLogin("admin")}
//             >
//             Login as Admin
//             </button>
//             <button
//             className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
//             onClick={() => handleLogin("alumni")}
//             >
//             Login as Alumni
//             </button>
//         </div>
//         </div>
//     </>
//   );
// }

// export default LoginPage;
