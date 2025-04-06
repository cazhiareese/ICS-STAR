import "../../index.css";
import Step2 from "../../assets/SignupAssets/step2.png";
import { CloudUpload, File, X } from 'lucide-react';
import { useState, useEffect } from "react";
import { useAppContext } from "../AuthContext/signupcontext";
import ErrorBox from "../errorbox.jsx"

function AlumnInfo(){

    const [image, setImage] = useState(null);
    const [fileName, setFileName] = useState("No file selected");
    const [fileSize, setFileSize] = useState(0);
    const [file, setFile] = useState(null);

    const {setUserData, userData, updateUserData} = useAppContext();

    const years = Array.from({ length: 2025 - 1990 + 1 }, (_, i) => 1990 + i);
    const { setCurrentSection} = useAppContext();


    const [studentNumberError, setStudentNumberError] = useState(false)
    const [termGraduated, setTermGraduated] = useState(false)


    const [error, setError]= useState(false)

    // For Year
    const handleInputChange = (e) => {
        let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
        if (value.length > 4) value = value.slice(0, 4);

        let formattedValue = "";
        if (value.length >= 4) {
            formattedValue += value.slice(0, 4);
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
        let inputValue = e.target.value.replace(/\D/g, ""); // Allow only numbers
        if (inputValue.length > 5) return; // Limit to 5 digits
        updateUserData("value", e.target.value)
        
    };

    // Requirements Checker !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    const checkRequirements = () =>{
        if (userData.value && (userData.academicYear && userData.academicYear!="AY ") &&userData.selectedYear &&userData.selectedTerm){
             setCurrentSection("3")
            
        } else{
            setError(true)
            if ((userData.academicYear && userData.academicYear!="AY ")  || userData.selectedTerm !="") setTermGraduated(false); else setTermGraduated(true)
            
            if (userData.selectedYear && userData.value) setStudentNumberError(false); else setStudentNumberError(true)
        }
    }
    
    
    return(
        <div className="flex flex-col w-full items-center overflow-auto pt-10 sm:pt-0 sm:mt-0 mt-10">
             <div className = "fixed flex flex-row z-20 space-x-8 mt-10 ">
                        <button className = "w-15 h-15 " onClick={()=>setCurrentSection(1)}></button>
                        <button className = "w-15 h-15 " onClick={()=>setCurrentSection(2)}></button>

                        {/*  Placeholder buttons do not work, only for debugging and better placement of the 2 buttons above*/}
                        <button className = "w-15 h-15 " ></button>
                        <button className = "w-15 h-15 "/> 
            </div>
            <img src={Step2} className="fixed mt-10 z-10 "/>
            <label className="fixed font-satoshi-bold text-center text-3xl text-black pt-30 pb-8 w-full bg-white">Alumni Information</label>
            
            <div class="grid grid-cols-2 gap-4 p-4 lg:w-150 md:w-120 pt-50 ">
                <div className="font-satoshi-regular">
                    Student Number <label className="text-red-700">*</label>
                </div>
                <div class="flex space-x-5 col-span-2 justify-center items-center">
                    <select 
                        value={userData.selectedYear} 
                        onChange={(e) => { updateUserData("selectedYear", e.target.value), updateUserData("academicYear", parseInt(e.target.value) +4)}}
                        className={`border rounded-lg h-10 w-[45%] text-center ${studentNumberError==false ? 'border-black':'border-red-600'}`}
                    >
                        <option value="" disabled>Select a year</option>
                        {years.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                    <label>-</label>
                    <input type="text" 
                           value={userData.value} 
                           onChange={handleSNChange} 
                           placeholder={"Enter up to 5 digits"} className={`w-[45%] border-1 rounded-lg h-10 text-center ${studentNumberError==false ? 'border-black':'border-red-600'}`}
                    />
                    

                </div>
                { studentNumberError &&
                    <div className="w-full -mt-3">
                        <ErrorBox/>
                    </div>
                }
                <div className="col-span-2 font-satoshi-regular">
                    Year and Term Graduated <label className="text-red-700">*</label>
                </div>
                
                <div class="flex space-x-5 col-span-2 justify-center items-center">
                    <select 
                        value={userData.selectedTerm} 
                        onChange={(e) => updateUserData("selectedTerm", e.target.value)}
                        className={`border rounded-lg h-10 w-[45%] text-center  ${termGraduated==false ? 'border-black':'border-red-600'}`}
                    >
                        <option value="" disabled>Select a Term</option>
                        <option value="1st Semester">First Semester</option>
                        <option value="2nd Semester">Second Semester</option>
                        <option value="Midyear">Midyear</option>
                        
                    </select>
                    <label>-</label>
                    <div className={`flex items-center border rounded-lg px-4 py-2 w-[45%] shadow-sm text-center ${termGraduated==false ? 'border-black':'border-red-600'}`}>
                        <input
                            type="text"
                            value={userData.academicYear} 
                            onChange={handleInputChange}
                            placeholder="YYYY"
                            className={`outline-none w-full text-gray-700 placeholder-gray-400 text-center`}
                        />
                    </div>
                </div>
                { termGraduated &&
                    <div className="w-full -mt-3">
                        <ErrorBox/>
                    </div>
                }

                <div class="col-span-2 font-satoshi-regular">
                    Upload your Diploma (Optional)
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

                {/* <div className={`col-span-2 items-center flex mt-0 -pb-10 text-red-400 ${error ? 'block': 'hidden'}`}>
                    <label>Please answer all required fields above</label>

                </div> */}

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

export default AlumnInfo