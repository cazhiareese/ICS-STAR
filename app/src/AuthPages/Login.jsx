import { useState, useEffect, useRef } from "react";
import "../index.css";
import { useAppContext } from "./AuthContext/signupcontext.jsx"
import { PersonStanding } from "lucide-react";
import loginBg from "../assets/login_gradientbg.jpeg";
import Constellations from "../assets/constellationLogin.png";
import ConstellationsUp from "../assets/constellationLoginUp.png";
import ConstellationsMobile from "../assets/constellationMobile.png";
import ICSSTARHEAD from "../assets/ics-starhead.png";
import Star from "../assets/Star 52.png"
import { Eye, EyeClosed, CircleX } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import CircularLoading from "../components/LoadingComponents/starloading";
import star from "../assets/star.png";
import google from "../assets/google.png"
import GuestModal from "./guestModal"
import ModalTemplate from "./modaltemplate"
import { useLocation } from 'react-router-dom';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import axios from "axios";

function LoginPage() {
    const {  updateUserData, setCurrentSection } = useAppContext();
    const baseURL = import.meta.env.VITE_BACKEND_URL;
    const clientId = import.meta.env.VITE_CLIENT_ID;
    const location = useLocation();

    const [openModal, setOpenModal] = useState(false);

    const [openError, setOpenError] = useState(false);

    const [activeEmail, setActiveEmail] = useState(false);
    const [email, setEmail] = useState("");

    const [activePassword, setActivePassword] = useState(false);
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false)

    const [isLoading, setIsLoading] = useState(false);

    const [codeError, setCodeError] = useState(false);

    const emailRef = useRef(null);

    const passwordRef = useRef(null);

    const handleModal = () => {
        setOpenModal(true)
    }

    const navigate = useNavigate();
    const stars = [
        { id: 1, top: "16%", left: "15%", size: "w-7" },
        { id: 2, top: "50%", left: "10%", size: "w-10" },
        { id: 3, top: "30%", left: "25%", size: "w-10" },
        { id: 4, top: "5%", left: "40%", size: "w-9" },
        { id: 5, top: "15%", left: "67%", size: "w-8" },
        { id: 6, top: "45%", left: "80%", size: "w-6" },
        { id: 7, top: "8%", left: "88%", size: "w-4" },
      ];

      useEffect(() => {
        const currentPath = location.pathname + location.search;
      
        // Avoid saving login or signup pages as last visited
        const blockedPaths = ["/login", "/"];
        if (!blockedPaths.includes(location.pathname)) {
          localStorage.setItem('lastVisitedPath', currentPath);
        }
      }, [location]);


    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
        console.log('Login Success:', tokenResponse);
            const formData = new FormData();
            formData.append('token', tokenResponse.access_token);

            const response = await axios.post(`${baseURL}/auth/google/register`, formData);
            
            if (response.data.message == "Logged in with Google"){
                localStorage.setItem("token", response.data.access_token);
                fetchUserData()
            }else{
                console.log(response.data.data)
                updateUserData("firstName", response.data.data.first_name)
                updateUserData("lastName", response.data.data.last_name)
                updateUserData("email", response.data.data.email)
                updateUserData("password", null)
                updateUserData("isGoogle", true)
                setCurrentSection("0");
                navigate("/signup");
            }

        },
        onError: (error) => {
        console.error('Login Failed:', error);
        },
        scope: 'openid email profile',
    });
      

    const login = async (e) => {
      // setIsLoading(true);
      // setTimeout(() => {
      // setIsLoading(false); // Simulate loading (remove if unnecessary)
      // }, 3000);

      // e.preventDefault(); // Prevent page reload
      setIsLoading(true); // Show loading spinner

      try {

          const response = await fetch(`${baseURL}/token`, {
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

              setOpenError(true)

          }
      } catch (error) {
          console.error("Error:", error);
        //   alert("Something went wrong!");
      } finally {
          setIsLoading(false); 
      }
    };


    const loginClick = async (e) => {
        await login(email, password);
    };

    const fetchUserData = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.log("No token found.");
            return;
        }
    
        try {
            const response = await fetch(`${baseURL}/users/me/`, {
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
                const lastPath = localStorage.getItem('lastVisitedPath');
                if (lastPath) {
                  navigate(lastPath);
                  localStorage.removeItem('lastVisitedPath');
                }
                
                window.location.href = "/alumni/dashboard";

            } else if (userData.user_type=="student"){
                window.location.href = "/student/dashboard";

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
        
        document.querySelectorAll('.inputLine').forEach(element => {
            element.style.borderColor = codeError ? 'red' : '#00369C'; // Change border color based on codeError
        });

        document.querySelectorAll('.inputDiamond').forEach(element => {
            element.style.color = codeError ? 'red' : '#00369C'; // Change border color based on codeError
        });
        

        
    }, [codeError]);


    const [position, setPosition] = useState(0);
  const maxPosition = 700; 
//   const [maxPosition, setMaxPosition]= useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition(prev => {
        if (prev < maxPosition) {
          return prev + 50; // Move 5px every tick
        } else {
          clearInterval(interval); // Stop when reaching the end
          return prev;
        }
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);


  return (

    <div className="flex items-center w-screen min-h-screen overflow-y-auto">
        {/* Background */}

        {/* <div className="absolute inset-0 object-fill bg-center scale-100 opacity-50 md:opacity-50 h-screen w-screen bg-fixed"
            style={{ backgroundImage: `url(${loginBg})` }}>
            <div className="sticky inset-0"></div>
        </div> */}

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

        <div className="hidden lg:flex flex-row justify-center lg:pt-0 lg:absolute lg:top-10 lg:left-0 lg:min-w-3xl sm:pt-50 pt-30
                [@media(max-height:750px)]:scale-[0.8] [@media(max-height:750px)]:-translate-y-5">
            <img 
                src={ICSSTARHEAD}
                alt="Login Background" 
                className="lg:absolute lg:left-15 lg:top-0 lg:w-[30%] sm:w-50 sm:h-10 w-50"
            />
            <div className="hidden sm:flex flex-row">
                <div className="w-0.75 h-10 bg-black ml-11"></div>
                <div className="flex flex-col -mt-1 text-xl font-satoshi-bold ml-3 leading-6">
                    <label><label className="text-primary">S</label>ystem for <label className="text-primary">T</label>racking</label>
                    <label><label className="text-primary">A</label>lumni <label className="text-primary">R</label>elations</label>
                </div>
            </div>
        </div>


        {/* Lower Portion */}
        <div className="flex flex-col justify-center items-center w-screen overflow-x-clip overflow-y-auto p-10 z-10 sm:overflow-clip overflow-clip
                sm:h-screen
                lg:h-screen lg:justify-center lg:p-10 lg:pt-30    
                [@media(max-height:750px)]:scale-[0.7]
                
                [@media(max-height:750px)]:p-0
                [@media(max-height:750px)]:overflow-clip
                [@media(min-height:751px)]:scale-[1]
                [@media(min-height:751px)]:justify-center
                [@media(max-width:1023px)]:scale-[0.8]
                [@media(max-width:768px)]:scale-[1]
                [@media(max-width:1023px)]:justify-normal
                [@media(max-width:1023px)]:overflow-y-auto
                
                "
                >

            {/* Mobile COnstellation */}
            <div className="sm:hidden block w-screen -mt-10 h-[220px] [@media(max-height:800px)]:opacity-40 overflow-visible opacity-40 absolute top-0 ">
                <img 
                    src={ConstellationsMobile}
                    alt="Login Background" 
                    className="w-[100%] object-cover"
                />
            </div>


            {/* <div className="lg:hidden md:block sm:block hidden w-screen opacity-0 sm:-mt-20 h-[40%] [@media(max-height:800px)]:opacity-40 overflow-clip">
                <img 
                    src={ConstellationsMobile}
                    alt="Login Background" 
                    className="w-[100%] object-cover"
                />
            </div> */}

            {/* ICS-STAR */}

            <div className="flex lg:hidden flex-row justify-center lg:pt-0 lg:absolute lg:top-10 lg:left-0 lg:min-w-3xl sm:pt-10 pt-30
            [@media(min-height:751px)]:pt-30
            ">
                <img 
                    src={ICSSTARHEAD}
                    alt="Login Background" 
                    className="lg:absolute lg:left-15 lg:top-0 lg:w-[30%] sm:w-50 sm:h-10 w-50"
                />
                <div className=" hidden sm:flex flex-row ">
                <div className="w-0.75 h-10 bg-black ml-11">`</div>
                <div className="flex flex-col -mt-1 text-xl font-satoshi-bold ml-3 leading-6">
                    <label><label className="text-primary">S</label>ystem for <label className="text-primary">T</label>racking</label>
                    <label><label className="text-primary">A</label>lumni <label className="text-primary">R</label>elations</label>
                </div>
                </div>
                
            
            </div>
            

            <div className="lg:hidden flex flex-col w-full mt-5">
                        <h1 className="text-4xl md:text-4xl font-satoshi-bold text-center">Bridging Alumni</h1>
                        <h1 className="text-4xl md:text-4xl font-satoshi-bold text-primary text-center">Across the Cosmos</h1>
            </div>

            <div className="sm:flex-row flex w-screen sm:justify-center z-20 lg:h-175 lg:min-h-155 py-10 ">
                
                {/* Login Signup */}
                <div onClick={() => setCodeError(false)} className="my-auto xl:ml-[5%] 2xl:ml-[15%] 3xl:ml-[30%] 4xl:ml-[25%] mx-auto flex flex-col items-center lg:justify-center h-full sm:mt-0 w-[30%]  
                            min-h-110  sm:min-h-140 min-w-sm xl:min-w-xl sm:min-w-lg 
                            md:min-w-lg lg:bg-[#f9f9fb] lg:shadow-[0px_10px_30px_rgba(0,0,0,0.3)] 
                            lg:rounded-4xl 
                            [@media(max-width:800px)]:scale-[1]
                            [@media(max-height:599px)]:scale-[0.8]
                            "
                    >
                        <h1 className="hidden lg:block text-6xl pt-4 font-satoshi-regular mb-0 text-[#102E46] cursor-default">Login</h1> 
                        
                        
                        {/* Email Input */}
                        
                        <div className=" flex flex-col justify-end pb-7 h-[25%] emailButton sm:-mb-5 -mt-3 w-[60%] sm:w-[70%] ">

                       
                            <label className= "block overflow-x-auto whitespace-nowrap scroll-bar-hide cursor-pointer text-gray-600 sm:text-lg font-satoshi-regular" onClick={() => {
                                    setActiveEmail(true);
                                    setTimeout(() => {
                                        emailRef.current?.focus();
                                    }, 0);
                                
                                }
                                }>
                                {!activeEmail ? (
                                    email ? `Email: ${email}` : <span className="font-satoshi-regular text-black">Email</span>
                                ) : (
                                    "Email"
                                )}
                            </label>
                            
                                
                            <div className="relative overflow-x-clip font-satoshi-regular">

                            
                                {/* Diamond swing */}
                                <span
                                    className={`input Diamond absolute cursor-pointer w-full top-1 transition-transform duration-400 transform text-primary ${activeEmail ? 'translate-x-full right-0 pt-7 mr-3 ' : 'translate-x-0 '}`}
                                    onClick={() => setActiveEmail(!activeEmail)}
                                >◆</span>

                                    {!activeEmail ? 
                                    
                                    <div className="inputLine w-full border-b-2 border-gray-400 focus-within:border-blue-500 outline-none py-2" 
                                    onClick={() => setActiveEmail(!activeEmail)}></div>
                                    
                                    : <input 
                                    type="email"
                                    ref={emailRef}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="inputLine w-full py-2 border-b-2 border-gray-400 focus:border-blue-500 outline-none  text-lg font-satoshi-regular"
                                    placeholder="Enter email here"
                                    /> }
                                
                            </div>
                        </div>

                        {/* Password */}
                        <div className="flex flex-col justify-end  h-[15%] -passwordButton mb-15 cursor-pointer w-[60%] sm:w-[70%]">

                            
                            <label className="block overflow-x-auto whitespace-nowrap scroll-bar-hide cursor-pointer text-gray-600 sm:text-lg font-satoshi-regular" onClick={() => {
                                setActivePassword(true); // only set to true, don't toggle
                                setTimeout(() => {
                                    passwordRef.current?.focus();
                                }, 0);
                                
                                }}>
                                {!activePassword ? (
                                    password ? `Password:  ${showPassword ? password : "*".repeat(password.length)}` : <span className="font-satoshi-regular text-black">Password</span>
                                ) : (
                                    "Password"
                                )}
                            </label>
                            
                                
                            <div className="relative overflow-x-clip">

                            
                                {/* Diamond swing */}
                                <span
                                    className={`inputDiamond absolute cursor-pointer w-full top-1 transition-transform duration-400 transform text-primary ${activePassword ? 'translate-x-full right-0 mr-3 pt-7' : 'translate-x-0'} z-10`}
                                    onClick={() => setActivePassword(!activePassword)}
                                >◆</span>

                                    {!activePassword ? 
                                        <>
                                        <div className="inputLine w-full border-b-2 border-gray-400 focus-within:border-blue-500 outline-none py-2" 
                                        onClick={() => {
                                            setActivePassword(!activePassword);
                                            
                                        }
                                            
                                            }>
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
                                            ref={passwordRef}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="inputLine  w-full border-b-2 mt-2 pb-2 border-gray-400 focus:border-blue-500 outline-none text-lg font-satoshi-regular pr-10"
                                            placeholder="Enter password here"
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
                        
                        <p className={`flex flex-row text-center items-center text-red-400 mb-6 -mt-12 ${codeError ? 'block' : 'hidden'}`}>
                            <CircleX size={18}/> &nbsp;Invalid Email/Password. Please enter again.
                        </p>
                        {/* Login Button */}
                        {/* <button className="bg-primary cursor-pointer text-white py-3 rounded-lg text-lg w-[50%] font-bold hover:bg-blue-700 transition mt-0">
                        Login
                        </button> */}

                        {isLoading ? (
                            // Rotating image
                            <div className="-mt-10 -mb-5">
                                <CircularLoading/>
                            </div>
                            
                        ) : (
                            <>
                            <button
                            className="bg-primary text-white py-3 rounded-3xl text-lg w-[60%] sm:w-[70%] font-satoshi-medium hover:bg-blue-700 transition mt-0 cursor-pointer"
                            onClick={()=>(loginClick())}
                            >
                            Login
                            </button>

                           
                            <button

                                className="relative bg-white border-1 py-3 rounded-3xl sm:text-lg text-sm w-[60%] sm:w-[70%] font-satoshi-regular transition mt-3 cursor-pointer hover:shadow-md hover:scale-[1.001]"
                                onClick={()=>loginWithGoogle()}
                                >
                                <label className="cursor-pointer">Continue with Google</label>
                                
                                    <img 
                                        src={google} 
                                        alt="Google Logo" 
                                        className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6"
                                    />

                            </button>


                            </>
                        )}


                        

                        {/* Signup Link */}
                        <p className="font-satoshi-regular text-center text-gray-600 mt-7 cursor-default">
                            Don't have an account? 
                        </p>
                        <p className="mb-3 space-x-1    ">
                        <a href="/signup" className="text-primary font-satoshi-regular underline">Signup here</a> <label className="font-satoshi-regular">or</label> <a className="text-primary font-satoshi-regular underline cursor cursor-pointer" onClick={handleModal}>Continue as guest</a>
                        </p>
                        
                </div>

                {/* Description */}
                <div className="my-auto lg:flex hidden  2xl:w-180 xl:w-150 lg:w-100 md:w-100 w-80 xl:h-50  bg-secondary ml-auto relative items-center rounded-l-2xl shadow-lg group">
                    <label className="2xl:text-2xl xl:text-xl sm:text-lg font-satoshi-regular 2xl:mx-20 xl:mx-10 md:mx-10 mx-10 my-5 space-y-5 leading-11 text-justify">
                        Built to connect alumni, students, and the institute.
                        <label className="font-satoshi-bold text-primary">
                        &nbsp;ICS-STAR
                        </label> makes it easy to track alumni, share updates, and bring everyone together.
                    </label>

                </div>

            </div>
            
            
            {/* Full-width caption for tall + wide screens */}
            <div className="hidden lg:hidden xl:flex flex-col w-screen px-10 [@media(max-height:800px)]:hidden ">
                <h1 className="text-5xl font-satoshi-regular text-right">Bridging Alumni</h1>
                <h1 className="text-5xl font-satoshi-bold text-primary text-right">Across the Cosmos</h1>
            </div>

            

        </div>
        <div className="hidden absolute bottom-10 right-10 text-right lg:flex xl:hidden flex-col w-screen px-10 [@media(max-height:800px)]:hidden">
                <h1 className="text-5xl font-satoshi-regular text-right">Bridging Alumni</h1>
                <h1 className="text-5xl font-satoshi-bold text-primary text-right">Across the Cosmos</h1>
            </div>
        <div className="hidden [@media(max-height:800px)]:flex flex-col absolute bottom-10 right-10 text-right [@media(max-width:1023px)]:hidden">
    <h1 className="text-3xl font-satoshi-regular">Bridging Alumni</h1>
    <h1 className="text-3xl font-satoshi-bold text-primary">Across the Cosmos</h1>
</div>

        {openModal &&
            <div className="fixed inset-0 flex items-center justify-center bg-black/75 z-50">
            <div className="bg-white rounded-3xl shadow-lg p-6 w-[25rem]">
                <h2 className="text-xl font-satoshi-bold mb-4 text-center mt-4 ">Continue as guest?</h2>
                <p className="text-black font-satoshi-regular text-center mb-6">
                    You may only access the newsletters and events page. To access more features, log in or sign up with your account.
                </p>
                <div className="flex flex-row items-center space-x-5 justify-center mt-8 mb-2">
                    <button
                        className="px-4 py-2 border border-primary text-primary font-satoshi-regular rounded-3xl w-25 hover:bg-primary/10 cursor-pointer"
                        onClick={() => setOpenModal(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-green-500 text-white font-satoshi-medium rounded-3xl w-25 hover:bg-green-600 cursor-pointer"
                        onClick={() => {
                            setOpenModal(false);
                            localStorage.removeItem("token");
                            navigate(`/guest/dashboard`);
                        }}
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
        
        }

        {openError && <ModalTemplate onClose={()=>setOpenError(false)} choiceclose="Close" information="Invalid email or password. Please check." header="Error!"/>}
        
    </div>

  );
}






export default LoginPage;