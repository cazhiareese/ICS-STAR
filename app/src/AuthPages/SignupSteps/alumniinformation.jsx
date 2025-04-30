import "../../index.css";
import Step2 from "../../assets/SignupAssets/step2.png";
import { CloudUpload, File, X } from 'lucide-react';
import { useState, useEffect } from "react";
import { useAppContext } from "../AuthContext/signupcontext";
import { ChevronDown } from 'lucide-react';
import Loading from "../../components/LoadingComponents/starloading.jsx"

function AlumnInfo(){

    const [image, setImage] = useState(null);
    const [fileName, setFileName] = useState("No file selected");
    const [fileSize, setFileSize] = useState(0);
    const [file, setFile] = useState(null);
    const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
    const [academicYearDropdownOpen, setAcademicYearDropdownOpen] = useState(false);
    // const years = ["AY 2024–2025", "AY 2023–2024", "AY 2022–2023", "AY 2021–2022"];
    const {setUserData, userData, updateUserData} = useAppContext();

    const years = Array.from({ length: 2025 - 1990 + 1 }, (_, i) => 1990 + i);
    const { setCurrentSection} = useAppContext();


    const [studentNumberError, setStudentNumberError] = useState(false)
    const [termGraduated, setTermGraduated] = useState(false)


    const [error, setError]= useState(false)


    const [loading, setLoading] = useState(false)

    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;


    // For Year
    const handleInputChange = (e) => {
        let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
        if (value.length > 8) value = value.slice(0, 8);

        let formattedValue = "AY ";
        if (value.length >= 4) {
            formattedValue += value.slice(0, 4) + " - ";
            if (value.length > 4) {
                formattedValue += value.slice(4);
            }
        } else {
            formattedValue += value;
        }

        updateUserData("academicYear", formattedValue)
    };

    // For Dropbox

    const handleDrop = (event) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files[0];

        console.log("File dropped:", event.dataTransfer.files);
        processFile(droppedFile);
    };


    // For Processing files either from dropping, or adding through click

    const processFile = (selectedFile) => {
        if (selectedFile) {
            const fileSize = (selectedFile.size / (1024 * 1024)).toFixed(2) + " MB"
            updateUserData("file", selectedFile)
            updateUserData("fileName", selectedFile.name)
            updateUserData("fileSize", selectedFile.size)
            updateUserData("image", "May image na")
            setImage("MAy image na")

        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        processFile(file)
    };


    const handleRemoveFile = () => {
        updateUserData("selectedFile", null)
        updateUserData("fileName", "")
        updateUserData("fileSize", "")
        updateUserData("image", "")
    };

    // As Student number change limits it also to 5 digits
    const handleSNChange = (e) => {
        let inputValue = e.target.value.replace(/[^0-9]/g, ''); // Allow only numbers
        if (inputValue.length > 5) return; // Limit to 5 digits
        updateUserData("value", e.target.value)
    };

    // Requirements Checker !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    const checkRequirements = async () => {
        // Check if all fields are filled first
        setLoading(true)
        const hasRequiredFields =
            userData.value &&
            (userData.academicYear && userData.academicYear !== "AY ") &&
            userData.selectedYear &&
            userData.selectedTerm;
    
        if (!hasRequiredFields) {
            setError(true);
            setTermGraduated(!(userData.academicYear && userData.academicYear !== "AY ") || !userData.selectedTerm);
            setStudentNumberError(!(userData.selectedYear && userData.value));
            setLoading(false)
            return;
        }
    
        // If required fields are filled, now check student number availability
        const isAvailable = await checkStudentNumberAvailability(
            `${userData.selectedYear}-${userData.value}`
        );
    
        if (!isAvailable) {
            alert("Student Number already taken")
            setError(true);
        } else {
            setStudentNumberError(false);
            setTermGraduated(false);
            setError(false);
            setCurrentSection("3");
        }
        setLoading(false)
    };
    
    const checkStudentNumberAvailability = async (studentNumber) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/get-studno?student_number=${studentNumber}`
            );
            const isAvailable = await response.json(); // Response is boolean directly
            return isAvailable;
        } catch (error) {
            console.error("Error checking student number:", error);
            return false; // Assume taken if error
        }
    };
    
    
    return(
        <div className="flex flex-col w-full items-center overflow-auto pt-40 sm:pt-0 sm:mt-0 mt-10">
             <div className = "flex flex-row z-10 space-x-8 mt-20">
                        <button className = "w-15 h-15 " onClick={()=>setCurrentSection(1)}></button>
                        <button className = "w-15 h-15 " onClick={()=>setCurrentSection(2)}></button>

                        {/*  Placeholder buttons do not work, only for debugging and better placement of the 2 buttons above*/}
                        <button className = "w-15 h-15 " ></button>
                        <button className = "w-15 h-15 "/> 
            </div>
            <img src={Step2} className="-mt-12"/>
            <label className="font-satoshi-bold text-center text-3xl text-black pt-10 pb-8">Alumni Information</label>
            
            <div class="grid grid-cols-2 gap-4 p-4 lg:w-150 md:w-120">
                <div className="font-satoshi-regular">
                    Student Number <label className="text-red-700">*</label>
                </div>
                <div class="flex space-x-5 col-span-2 justify-center items-center">
                <div className="relative w-[45%]">
                    <button
                        onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
                        className={`flex items-center justify-between border rounded-lg h-10 w-full px-4 text-left ${userData.selectedYear ? 'text-black' : 'text-gray-400'} ${studentNumberError == false ? 'border-black' : 'border-red-600'}`}
                    >
                        <span className="mx-auto">{userData.selectedYear || "Select a year"}</span>
                        <ChevronDown className="w-4 h-4 text-gray-600" />
                    </button>

                    {yearDropdownOpen && (
                        <ul className="absolute z-10 w-full mt-1 max-h-30 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg">
                        {years.map((year) => (
                            <li
                            key={year}
                            onClick={() => {
                                updateUserData("selectedYear", year);
                                setYearDropdownOpen(false);
                            }}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                            {year}
                            </li>
                        ))}
                        </ul>
                    )}
                    </div>
                    <label>-</label>
                    <input type="number" 
                           value={userData.value} 
                           onChange={handleSNChange} 
                           placeholder={"Enter up to 5 digits"} className={`w-[45%] border-1 rounded-lg h-10 text-center ${studentNumberError==false ? 'border-black':'border-red-600'}`}
                    />

                </div>
                <div className="col-span-2 font-satoshi-regulars">
                    Year and Term Graduated <label className="text-red-700">*</label>
                </div>
                <div class="flex space-x-5 col-span-2 justify-center items-center">
                    <div className="relative w-[45%]">
                    <select
                        value={userData.selectedTerm}
                        onChange={(e) => updateUserData("selectedTerm", e.target.value)}
                        className={`pl-10 appearance-none border rounded-lg h-10 w-full text-center ${userData.selectedTerm==""? "text-gray-400": ""} pr-12 ${termGraduated==false ? 'border-black':'border-red-600'}`}
                    >
                        <option value="" disabled>Select a Term</option>
                        <option value="1st Semester">First Semester</option>
                        <option value="2nd Semester">Second Semester</option>
                    </select>

                    {/* Custom Arrow Icon — shifted LEFT slightly */}
                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-600">
                        <ChevronDown className="w-4 h-4" />
                    </div>
                    </div>

                    <label>-</label>
                    <div className={`justify-center flex items-center border rounded-lg px-4 py-0 w-[45%] shadow-sm ${termGraduated == false ? 'border-black' : 'border-red-600'}`}>
                        <div className="relative w-full">
                            <button
                            onClick={() => setAcademicYearDropdownOpen(!academicYearDropdownOpen)}
                            className={`flex items-center justify-between w-full h-10 px-4 text-left rounded-lg ${userData.academicYear ? 'text-black' : 'text-gray-400'} `}
                            >
                            <span className="mx-auto">{userData.academicYear ? (userData.academicYear+"-"+ (userData.academicYear+1)) :"Select AY YYYY"}</span>
                            <ChevronDown className="w-4 h-4 text-gray-600" />
                            </button>

                            {academicYearDropdownOpen && (
                            <ul className="absolute z-10 w-full mt-1 max-h-30 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg">
                                {years.map((year) => (
                                <li
                                    key={year}
                                    onClick={() => {
                                    updateUserData("academicYear", year);
                                    setAcademicYearDropdownOpen(false);
                                    }}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    {year}
                                </li>
                                ))}
                            </ul>
                            )}
                        </div>
                    </div>
                </div>

                <div class="col-span-2">
                    Upload your Diploma 
                </div>
                
                    {!userData.image ? (
                        <div className="col-span-2 flex flex-col items-center justify-center space-y-4 py-4 rounded-2xl bg-gray-200 h-50"
                            onDragOver={(event) => event.preventDefault()}
                            onDrop={handleDrop}
                        >
                            <input 
                                type="file" 
                                accept="image/*, application/pdf" 
                                className="hidden"
                                id="fileInput"
                                onChange={handleFileChange}
                            />
                            
                            <div className="text-primary">
                                <CloudUpload className="h-10 w-10"/>
                            </div>
                            
                            <label>Drag and drop file here or</label>
                            <label 
                                htmlFor="fileInput"
                                className="flex flex-col items-center  pb-2 px-4 rounded-lg cursor-pointer font-satoshi-bold underline text-primary transition"
                            >
                                
                                Choose File

                            </label>
                        
                        </div>
                    ):(
                        <div className="col-span-2 flex flex-col items-center justify-center space-y-4 py-4 rounded-2xl bg-gray-200 h-23">
                        <div className="flex flex-row items-center justify-center w-full p-2">
                            {/* File Icon */}
                            <div className="text-primary flex justify-center items-center p-2 rounded-2xl row-span-2  bg-white mx-3">
                                <File className="w-10 h-10"/>
                            </div>

                            <div className="flex flex-col w-120 items-start">
                                {/* File Name */}
                                <p className="text-primary text-md font-satoshi-bold truncate max-w-70">{userData.fileName}</p>
                                {/* File Size */}
                                <p className="text-gray-500 text-sm">{userData.fileSize}</p>
                            </div>
                            {/* X Button */}
                            <button 
                                    onClick={handleRemoveFile} 
                                    className="text-primary hover:text-red-700 flex justify-center w-20 h-15"
                                >
                                    <X className="w-5 h-5"/>
                            </button>

                        </div>
                        </div>
                    )}
                    
                    {/* Display Selected File Name */}
                 

                <div className="col-span-2">
                    <label className="font-satoshi-light text-gray-500">
                        Uploading your Diploma is optional, but it can greatly help the admin in validating your information
                    </label>
                </div>

                <div className={`col-span-2 items-center flex mt-0 -pb-10 text-red-400 ${error ? 'block': 'hidden'}`}>
                    <label>Please answer all required fields above</label>

                </div>

                <div class=" text-black flex flex-col items-start">
                        <button
                            className="bg-primary text-white py-3 rounded-2xl text-lg w-4/6 font-bold hover:bg-blue-700 transition mt-0"
                            onClick = {()=>{setCurrentSection("1")}}
                        >
                            Back

                        </button>
                    </div>
                    <div class=" text-black flex flex-col items-end">
                {loading ? (<Loading/>):
                    
                        <button
                            className="bg-primary text-white py-3 rounded-2xl text-lg w-4/6 font-bold hover:bg-blue-700 transition mt-0"
                            onClick = {checkRequirements}
                        >
                            Next
                        </button>
                   
                }
                 </div>
                
            </div>
        </div>
    );
}

export default AlumnInfo