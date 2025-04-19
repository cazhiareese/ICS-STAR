import "../../index.css";
import Step2 from "../../assets/SignupAssets/step2.png";
import { CloudUpload, File, X } from 'lucide-react';
import { useState, useEffect } from "react";
import { useAppContext } from "../AuthContext/signupcontext";
import FilePicker from "react-file-picker";

function StudentInformation(){

    const [image, setImage] = useState(null);
    const [fileName, setFileName] = useState("No file selected");
    const [fileSize, setFileSize] = useState(0);
    const [file, setFile] = useState(null);

    const {setUserData, userData, updateUserData} = useAppContext();

    const years = Array.from({ length: 2025 - 1990 + 1 }, (_, i) => 1990 + i);
    const { setCurrentSection} = useAppContext();

    
    const [error, setError]= useState(false)
    const [studentNumberError, setStudentNumberError] = useState(false)
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
            updateUserData("selectedFile", selectedFile)
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
        // document.getElementById("fileInput").value = ""; // Reset input field
        // console.log(file)
    };

    // As Student number change limits it also to 5 digits
    const handleSNChange = (e) => {
        let inputValue = e.target.value.replace(/[^0-9]/g, ''); // Allow only numbers
        if (inputValue.length > 5) return; // Limit to 5 digits
        updateUserData("value", e.target.value)
    };

    // Requirements Checker !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    const checkRequirements = () =>{
        if (userData.value &&userData.selectedYear ){
             setCurrentSection("3")
            //  console.log("1"+userData.academicYear+"1")
        } else{
            setError(true)

            if (userData.selectedYear && userData.value) setStudentNumberError(false); else setStudentNumberError(true)
        }
    }
    
    return(
        <div className="flex flex-col w-full items-center pt-40 sm:pt-0 sm:mt-0 mt-10">
            <div className = "flex flex-row z-10 space-x-8 mt-20">
                        <button className = "w-15 h-15 " onClick={()=>setCurrentSection(1)}></button>
                        <button className = "w-15 h-15 "></button>

                        {/*  Placeholder buttons do not work, only for debugging and better placement of the 2 buttons above*/}
                        <button className = "w-15 h-15 " ></button>
                        <button className = "w-15 h-15 "/> 
            </div>
            <img src={Step2} className="-mt-12"/>
            <label className="font-satoshi-bold text-center text-3xl text-black pt-10 pb-8">Student Information</label>
            
            <div class="grid grid-cols-2 gap-4 p-4 lg:w-150 md:w-120">
                <div className="font-satoshi-regular">
                    Student Number <label className="text-red-700">*</label>
                </div>
                <div class="flex space-x-5 col-span-2 justify-center items-center">
                    <select 
                        value={userData.selectedYear} 
                        onChange={(e) => updateUserData("selectedYear", e.target.value)}
                        className={`border rounded-lg h-10 w-[45%] text-center ${studentNumberError==false ? 'border-black':'border-red-600'}`}
                    >
                        <option value="" disabled>Select a year</option>
                        {years.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                    <label>-</label>
                    <input type="number" 
                           value={userData.value} 
                           onChange={handleSNChange} 
                           placeholder="Enter up to 5 digits" className={`w-[45%] border-1 rounded-lg h-10 text-center ${studentNumberError==false ? 'border-black':'border-red-600'}`}
                    />

                </div>
                

                <div class="col-span-2">
                    Upload your Form 5 
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
                        Uploading your Form 5 is optional, but it can greatly help the admin in validating your information
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
                        <button
                            className="bg-primary text-white py-3 rounded-2xl text-lg w-4/6 font-bold hover:bg-blue-700 transition mt-0"
                            onClick = {checkRequirements}
                        >
                            Next
                        </button>
                    </div>
            </div>
        </div>
    );
}

export default StudentInformation