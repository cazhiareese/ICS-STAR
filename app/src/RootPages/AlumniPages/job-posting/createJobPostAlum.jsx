import { ArrowLeft, CloudUpload } from 'lucide-react'
import React, { useState, useRef } from 'react'
import PaymentProof from '../../../components/AlumniComponents/DonationComponents/paymentProof';

function CreateJobPostAlum() {
    // Forms Values to be posted in the  API
    const [jobTitleInput, setJobTitleInput] = useState("");
    const [companyInput, setCompanyInput] = useState("");
    const [salaryInput, setSalaryInput] = useState(0);
    const [linkInput, setLinkInput] = useState("");

    const fileInputRef = useRef(null);
    const [fileName, setFileName] = useState('');
    const [file, setFile] = useState(null);

    const handleJobTitleChange = (e) => {
        setJobTitleInput(e.target.value);
        console.log(jobTitleInput); //For checking only
    };

    const handleCompanyChange = (e) => {
        setCompanyInput(e.target.value);
        console.log(companyInput); //For checking only
    };

    const handleSalaryChange = (e) => {
        setSalaryInput(e.target.value);
        console.log(salaryInput); //For checking only
    };

    const handleLinkInput = (e) => {
        setLinkInput(e.target.value);
        console.log(linkInput); //For checking only
    };
    
    // FOR FILE UPLOAD ONLy-----------------------------------
    // Triggered when a user selects a file through the file picker.
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            onFileSubmit(file);
        }
    };

    // Triggered when a file is dragged and dropped into the upload area.
    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            setFileName(file.name);
            onFileSubmit(file);
        }
    };

    // Allows drag and rop files to browser
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    // opens native file picker dialog
    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    return (
        <div className='flex flex-col mx-48 my-16'>
            {/* Back button */}
            <button className='text-primary flex gap-5 cursor-pointer'>
                <ArrowLeft size={25} />
                <span className='font-satoshi-medium text-primary text-xl'>Back</span>
            </button>

            {/* Create Job Posting title */}
            <h1 className='font-satoshi-bold text-black text-4xl py-10'>Create Job Posting</h1>
            

            {/* JOB TITLE & COMPANY */}
            <div className='flex flex-row gap-3'>
                {/* Job Title */}
                <div className='outline-1 rounded-3xl outline-neutral-400 pb-6 pt-5 px-8 w-full'>
                    <h1 className='text-lg font-satoshi-medium pb-3'>
                        Job Title <span className='text-error'>*</span>
                    </h1>
                    {/* Input Box */}
                    <div className="relative w-full h-6">
                        <input
                            type="text"
                            className="bg-white font-satoshi-medium text-md w-full md:pl-5 pl-5 pr-4 py-2 rounded-2xl text-black border border-neutral-400 focus:border-primary focus:outline-none focus:ring-0"
                            onChange={handleJobTitleChange}
                        />
                    </div>
                </div>
                
                {/* Company/Agency/Institution */}
                <div className='flex flex-col outline-1 rounded-3xl outline-neutral-400 pb-4 pt-5 px-8 w-full'>
                    <h1 className='text-lg font-satoshi-medium pb-3'>
                        Company/Agency/Institution <span className='text-error'>*</span>
                    </h1>
                    {/* Input Box */}
                    <div className="relative w-full h-6">
                        <input
                            onChange={handleCompanyChange}
                            type="text"
                            className="bg-white font-satoshi-medium text-md w-full h-10 md:pl-5 pl-5 pr-4 py-2 rounded-2xl text-black border border-neutral-400 focus:border-primary focus:outline-none focus:ring-0"
                        />
                    </div>

                    <label className="flex items-center gap-2 ml-auto pt-7">
                        {/* TODO: modify checkbox */}
                        <input type="checkbox" className="bg-primary w-4 h-4"/> 
                        <span className='font-satoshi-regular'>Same as current company</span>
                    </label>
                </div>
            </div>

            {/* SALARY & TAGS */}
            <div className='flex flex-row gap-3 mt-6'>
                {/* Salary */}
                <div className='outline-1 rounded-3xl outline-neutral-400 pb-6 pt-5 px-8 w-5/6'>
                    <h1 className='text-lg font-satoshi-medium pb-3'>
                        Salary/Compensation
                    </h1>
                    {/* Input Box */}
                    <div className="relative w-full h-6">
                    <input
                        onChange={handleSalaryChange}
                        type="number"
                        step="any"
                        className="bg-white font-satoshi-medium text-md w-full h-10 md:pl-5 pl-5 pr-4 py-2 rounded-2xl text-black border border-neutral-400 focus:border-primary focus:outline-none focus:ring-0"
                    />
                    </div>
                </div>
                
                {/* TODO: Make the integration last */}
                {/* Tags (Optional) */}
                <div className='flex flex-col outline-1 rounded-3xl outline-neutral-400 pb-12 pt-5 px-8 w-full'>
                    <h1 className='text-lg font-satoshi-medium pb-3'>
                        Tags (Optional)
                    </h1>
                    {/* Input Box */}
                    <div className="relative w-full h-6">
                        <input
                            onChange={handleCompanyChange}
                            type="text"
                            className="bg-white font-satoshi-medium text-md w-full h-10 md:pl-5 pl-5 pr-4 py-2 rounded-2xl text-black border border-neutral-400 focus:border-primary focus:outline-none focus:ring-0"
                        />
                    </div>

                
                </div>
            </div>

            {/* Link to application platform or submission email */}
            <div className='flex flex-row outline-1 rounded-3xl outline-neutral-400 pb-6 pt-5 mt-6 px-8 w-full'>
                {/* Input Box */}
                <div className="relative w-full">
                    <h1 className='text-lg font-satoshi-medium pb-3'>
                        Link to application platform or submission email <span className='text-error'>*</span>
                    </h1>
                    <input
                        type="text"
                        className="bg-white font-satoshi-medium text-md w-full md:pl-5 pl-5 pr-4 py-2 rounded-2xl text-black border border-neutral-400 focus:border-primary focus:outline-none focus:ring-0"
                        onChange={handleLinkInput}
                    />
                </div>
            </div>

            {/* Job Description and Hiring Process */}
            <div className='flex flex-row outline-1 rounded-3xl outline-neutral-400 pb-6 pt-5 mt-6 px-8 w-full gap-5'>
                
                {/* Input Box */}
                <div className="relative w-4/6">
                    <h1 className='text-lg font-satoshi-medium pb-3'>
                        Job Description and Hiring Process <span className='text-error'>*</span>
                    </h1>
                    <textarea
                        type="text"
                        className="bg-white font-satoshi-medium text-md w-full md:pl-5 pl-5 pr-4 py-2 rounded-2xl text-black border border-neutral-400 focus:border-primary focus:outline-none focus:ring-0 h-40"
                        onChange={handleJobTitleChange}
                        placeholder='Describe job posting'
                    />
                </div>

                {/* TODO: add file upload here */}
                <div className='w-2/6'>
                    <h1 className='text-lg font-satoshi-medium pb-3'>
                        Image (Optional)
                    </h1>

                    <div
                        className='flex flex-col bg-neutral-100 rounded-3xl justify-center items-center py-10 gap-2'
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                    >
                        <h1 className='text-primary'>
                            <CloudUpload size={30} />
                        </h1>
                        {/* Drag and drop indicator */}
                        <h1 className='text-neutral-500 font-satoshi-regular'>
                            Drag and drop files here or
                        </h1>
                        {/* File upload button */}
                        <button
                            onClick={triggerFileInput}
                            className='text-primary underline font-satoshi-regular cursor-pointer'
                        >
                            Choose file
                        </button>
                        {/* File name indicator */}
                        {fileName && (
                            <p className='text-neutral-700 text-xs font-satoshi-regular mt-2 break-words w-full text-center px-4'>
                                Selected: {fileName}
                            </p>
                        )}
                        <input
                            type='file'
                            accept='image/*'
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className='hidden'
                        />
                    </div>
                    
                </div>

                
            </div>
            <button  
                className="mt-6 rounded-full justify-center bg-primary font-satoshi-medium text-white text-xl w-1/6 h-12 ml-auto cursor-pointer"
            >
                Submit
            </button>
            
        </div>
    )
}

export default CreateJobPostAlum