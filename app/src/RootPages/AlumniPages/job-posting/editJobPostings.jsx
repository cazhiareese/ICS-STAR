import { ArrowLeft, ChevronDown, CloudUpload, X } from 'lucide-react'
import React, { useState, useRef, useEffect, use } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from "framer-motion";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import CircularLoading from '../../../components/LoadingComponents/circularloading';
import JobPostSummary from '../../../components/AlumniComponents/jobPostSummary';
// import { useParams } from 'next/navigation';

function EditJobPostAlum() {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    console.log(typeof decoded.sub);
    

    //cyrus was here: incorrect access of params, fixed
    const id = useParams(); 
    const  jobId  = id.jobid; 
    console.log(jobId); // For checking only
    
    

    const [tagInput, setTagInput] = useState('');
    const [tagss, setTagss] = useState([]);
    const [tagsSuggestions, setTagSuggestions] = useState([]);
    const [currentCompany, setCurrentCompany] = useState(false);
    const [summary, setSummary] = useState({});
    const handleTagInputChange = (e) => {
        setTagInput(e.target.value);
    };

    const handleTagInputKeyPress = (e) => {
        if (e.key === 'Enter' && tagInput.trim() !== '') {
          const newTags = tagInput
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0 && !tagss.includes(tag));
    
          // Add new tags to the state and reset input
          setTagss(prevTags => [...prevTags, ...newTags]);
          setTagInput('');
          console.log(tagss);
        }
      };
    
    const handleAddTags = () => {
        setIsTagsModalOpen(false);
    };

    // Remove a tag from the list
    const handleRemoveTag = (tagToRemove) => {
        setTagss(prevTags => prevTags.filter(tag => tag !== tagToRemove));
    };
    
    const handleAddSuggestionTag = (tag) => {
        if (!tagss.includes(tag)) {
          setTagss([...tagss, tag]);
        }
    };
      
    // Forms Values to be posted in the  API
    const [jobTitleInput, setJobTitleInput] = useState("");
    const [companyInput, setCompanyInput] = useState("");
    const [salaryInput, setSalaryInput] = useState(0);
    const [linkInput, setLinkInput] = useState("");
    const [employmentType, setEmploymentType] = useState("");
    const [employmentMode, setEmploymentMode] = useState("");
    const [description, setDescription] = useState("");


    const fileInputRef = useRef(null);
    const [fileName, setFileName] = useState('');
    const [file, setFile] = useState(null);
    const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
    const tagsRef = useRef(null);
    const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

    const [submitting, setSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);


    // dummy tags
    const tags = [
        "Artificial Intelligence",
        "Cybersecurity",
        "Gamedev",
        "Machine Learning",
        "Big Data",
        "Data Science"
    ]

    useEffect(() => {
        setTagSuggestions(["UI/UX", "Gamedev", "Software Eng", "QA"]);
    }, []);

    useEffect(() => {
        if (isTagsModalOpen && tagsRef.current) {
          const rect = tagsRef.current.getBoundingClientRect();
          setPosition({
            top: rect.bottom + window.scrollY + 8, // 8px below
            left: rect.left + window.scrollX,
            width: rect.width,
          });
        }
      }, [isTagsModalOpen]);


    const handleJobTitleChange = (e) => {
        setJobTitleInput(e.target.value);
        console.log(jobTitleInput); //For checking only
    };

    const handleJobDescriptionChange = (e) => {
        setDescription(e.target.value);
        console.log(description); //For checking only
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

    const handleEmploymentTypeChange = (e) => {
        setEmploymentType(e.target.value);
        console.log(employmentType); //For checking only
    };

    const handleEmploymentModeChange = (e) => {
        setEmploymentMode(e.target.value);
        console.log(employmentMode); //For checking only
    };

    // Navigate back
    const navigate = useNavigate();
    const navToJobPostLanding= () => {
        navigate(-1);
    }

    
    // FOR FILE UPLOAD ONLy-----------------------------------
    // Triggered when a user selects a file through the file picker.
    const handleFileSubmit = (file) => {
        setFile(file);
    };
    
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            handleFileSubmit(file);
        }
    };

    // Triggered when a file is dragged and dropped into the upload area.
    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            setFileName(file.name);
            handleFileSubmit(file);
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

    // BASE URL ENV
    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

    // Submitting job post
    const handleSubmitJob = async () => {
        if (
            !jobTitleInput.trim() ||
            !companyInput.trim() ||
            !linkInput.trim() ||
            !description.trim() ||
            !employmentType.trim() ||
            !employmentMode.trim()
        ) {
            alert("Please fill in all required fields");
            return;
        }

        setSubmitting(true);

        const formData = new FormData();

        formData.append('title', jobTitleInput);
        formData.append('company', companyInput);
        salaryInput && formData.append('salary', salaryInput);
        tagss && formData.append('tags', tagss);
        formData.append('link', linkInput);
        formData.append('description', description);
        formData.append('employment_type', employmentType);
        formData.append('mode', employmentMode)
        formData.append('user_id', decoded.sub);
        console.log(formData)
        if (file != null) {
            formData.append('image', file);
        }
    
        try {
            const response = await axios.put(`${API_BASE_URL}/edit-job-postings/${jobId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Job successfully posted:', response.data);
            // alert("Job successfully submitted!");

            setSubmitting(false);
            // Store response to summary
            setSummary(response.data);
            setIsSubmitted(true);
            console.log(formData)
            // Optionally reset form fields here
        } catch (error) {
            console.error('Error posting job:', error);
            setSubmitting(false);
            alert("There was an error submitting the job post.");
        }
    };


    useEffect(() => {  
        async function fetchJob() {
            try {
              const { data } = await axios.get(`${API_BASE_URL}/job-postings/${jobId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,   // include only if your API is protected
                },
              });
              console.log('Job data:', data);
            //   setJob(data);   // or whatever state handler you use
              setJobTitleInput(data.title);
              setCompanyInput(data.company);
                setLinkInput(data.link);
                setTagss(data.tags);
                setDescription(data.description);
                setSalaryInput(data.salary);
                setEmploymentMode(data.mode)
                setEmploymentType(data.employment_type)
            } catch (err) {
              console.error('Failed to load job:', err);
              alert('Could not fetch job details.');
            }
        }
        fetchJob();
    },[]);
    return (
        <div className="flex flex-col px-4 md:px-0 md:mx-48 mt-16 mb-30">
          {/* Modal For successful post */}
          <JobPostSummary isOpen={isSubmitted} setIsOpen={setIsSubmitted} job={summary} />
      
          {/* Back button */}
          <button onClick={navToJobPostLanding} className="text-primary flex gap-5 cursor-pointer">
            <ArrowLeft size={25} />
            <span className="font-satoshi-medium text-primary text-xl">Back</span>
          </button>
      
          {/* Title */}
          <h1 className="font-satoshi-bold text-black text-3xl md:text-4xl py-10">Edit Current Job</h1>
      
          {/* Job Title & Company */}
          <div className='flex md:flex-row flex-col md:gap-3 gap-5'>
                {/* Job Title */}
                <div className='outline-1 rounded-3xl outline-neutral-400 pb-6 pt-5 px-8 w-full'>
                    <h1 className='text-lg font-satoshi-medium pb-3'>
                        Job Title <span className='text-error'>*</span>
                    </h1>
                    {/* Input Box */}
                    <div className="relative w-full h-6">
                        <input
                            type="text"
                            value={jobTitleInput}
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
                            value={companyInput}
                            className="bg-white font-satoshi-medium text-md w-full h-10 md:pl-5 pl-5 pr-4 py-2 rounded-2xl text-black border border-neutral-400 focus:border-primary focus:outline-none focus:ring-0"
                            disabled={currentCompany}
                        />
                    </div>

                    <label className="flex items-center gap-2 ml-auto pt-7">
                        <input
                        onChange={(e) => setCurrentCompany(e.target.checked)}
                        type="checkbox" className="bg-primary accent-primary w-4 h-4"/> 
                        <span className='font-satoshi-regular'>Same as current company</span>
                    </label>
                </div>
            </div>

            {/* SALARY & TAGS */}
            <div className='flex md:flex-row flex-col md:gap-3 gap-5 mt-6'>
                {/* Salary */}
                <div className='outline-1 rounded-3xl outline-neutral-400 pb-6 pt-5 px-8 md:w-5/6 w-full'>
                    <h1 className='text-lg font-satoshi-medium pb-3'>
                        Salary/Compensation
                    </h1>
                    {/* Input Box */}
                    <div className="relative w-full h-6">
                    <input
                        
                        onChange={handleSalaryChange}
                        value = {salaryInput}
                        type="number"
                        step="any"
                        className="bg-white font-satoshi-medium text-md w-full h-10 md:pl-5 pl-5 pr-4 py-2 rounded-2xl text-black border border-neutral-400 focus:border-primary focus:outline-none focus:ring-0"
                    />
                    </div>
                </div>
                
                {/* TODO: Make the integration last */}
                {/* Tags (Optional) */}
                <div className='flex flex-col outline-1 rounded-3xl outline-neutral-400 pb-12 pt-5 px-8 w-full relative'>
                    <h1 className='text-lg font-satoshi-medium pb-3'>
                        Tags (Optional)
                    </h1>

                    {/* This is the clickable box that opens the modal */}
                    <div
                        ref={tagsRef}
                        className="flex flex-row items-center cursor-pointer py-2 outline outline-1 rounded-xl h-10 outline-neutral-400 px-5"
                        onClick={() => setIsTagsModalOpen(true)}
                    >
                        <span className="text-neutral-500 font-satoshi-regular truncate">
                            {tagss.length > 0
                                ? tagss.slice(0, 5).join(", ") + (tagss.length > 2 ? "..." : "")
                                : "Select tags"}
                        </span>

                        <motion.button
                        className="cursor-pointer hover:text-primary ml-auto"
                        animate={{ rotate: isTagsModalOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        >
                        <ChevronDown size={25} />
                        </motion.button>
                    </div>
                </div>

                {/* Modal */}
                {isTagsModalOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-50 bg-white shadow-xl border border-neutral-300 rounded-2xl p-6"
                        
                        style={{
                            top: position.top,
                            left: position.left,
                            width: position.width,
                        }}
                    >
                        <div className="flex justify-between items-center mb-3">
                            <div className='text-2xl font-satoshi-medium border-b-1 border-neutral-300 w-full pb-3'>Add Tags</div>
                            <button
                                onClick={() => setIsTagsModalOpen(false)}
                                className='text-gray-500 hover:text-red-500'
                            >
                                ✕
                            </button>
                        </div>

                        {/* Input box for tags */}
                        <input
                        type="text"
                        value={tagInput}
                        onChange={handleTagInputChange}
                        onKeyPress={handleTagInputKeyPress}
                        className="bg-white font-satoshi-medium text-md w-full h-10 md:pl-5 pl-5 pr-4 py-2 rounded-2xl text-black border border-neutral-400 focus:border-primary focus:outline-none focus:ring-0"
                        placeholder='Enter tags'
                        />

                        {/* Render user-added tags */}
                        {tagss.length > 0 && (
                        <>
                            <h1 className='text-md font-satoshi-medium w-full py-3'>Your Tags</h1>
                            <div className="flex flex-wrap gap-2">
                                {tagss.map((tag, index) => (
                                    <span
                                    key={index}
                                    className="bg-primary text-white text-xs rounded-full px-3 py-1 font-satoshi-medium flex items-center gap-1 w-fit"
                                    >
                                        {tag}
                                        <button
                                            onClick={() => handleRemoveTag(tag)}
                                            className=" text-white text-xs rounded-full p-1 "
                                        >
                                            <X size={14}/>
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </>
                        )}

                        {/* Suggestion buttons */}
                        <h1 className='text-md font-satoshi-medium w-full py-3'>Suggestions</h1>
                        <div className="flex flex-wrap gap-2">
                            {tagsSuggestions
                                .filter(tag => !tagss.includes(tag)) // Only show tags not yet added
                                .map((tag, index) => (
                                    <button
                                    key={index}
                                    onClick={() => handleAddSuggestionTag(tag)}
                                    className="rounded-full border-2 border-primary text-primary px-4 py-1 font-satoshi-medium text-sm transition cursor-pointer"
                                    >
                                    {tag}
                                    </button>
                            ))}


                        </div>

                        {/* Submit button for tags */}
                        <div className="mt-6 flex justify-end w-full">
                            <button
                                onClick={handleAddTags}
                                className="rounded-full bg-primary font-satoshi-medium text-white text-md h-10 px-6 cursor-pointer"
                            >
                                Done
                            </button>
                        </div>



                    </motion.div>
                )}
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
                        value={linkInput}   
                    />
                </div>
            </div>

            {/* Job Description and Hiring Process */}
            <div className='flex md:flex-row flex-col outline-1 rounded-3xl outline-neutral-400 pb-6 pt-5 mt-6 px-8 w-full gap-5'>
                
                {/* Input Box */}
                <div className="relative md:w-4/6 w-full">
                    <h1 className='text-lg font-satoshi-medium pb-3'>
                        Job Description and Hiring Process <span className='text-error'>*</span>
                    </h1>
                    <textarea
                        type="text"
                        className="bg-white font-satoshi-medium text-md w-full md:pl-5 pl-5 pr-4 py-2 rounded-2xl text-black border border-neutral-400 focus:border-primary focus:outline-none focus:ring-0 h-40"
                        onChange={handleJobDescriptionChange}
                        placeholder='Describe job posting'
                        value={description}
                    />
                </div>

                
                <div className='md:w-2/6 w-full'>
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
            {/* Emplyment type and mode */}
            <div className='flex md:flex-row flex-col md:gap-3 gap-5 mt-6'>
                {/* Employment type */}
                <div className='outline-1 rounded-3xl outline-neutral-400 pb-6 pt-5 px-8 w-full'>
                    <h1 className='text-lg font-satoshi-medium pb-3'>
                        Employment Type <span className='text-error'>*</span>
                    </h1>
                    {/* dropdown Box */}
                    <div className="relative w-full">
                        <select
                            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
                            onChange={handleEmploymentTypeChange}
                            value={employmentType}
                        >
                            <option value="fulltime">Full-time</option>
                            <option value="parttime">Part-time</option>
                            <option value="contractual">Contractual</option>
                            <option value="Freelance">Freelance</option>
                            <option value="internship">Internship</option>
                            <option value="apprenticeship ">Apprenticeship</option>
                        </select>

                        {/* Fake dropdown with icon */}
                        <div className="bg-white font-satoshi-medium text-md w-full flex items-center justify-between md:pl-5 pl-5 pr-4 py-2 rounded-2xl text-black border border-neutral-400 pointer-events-none">
                            {employmentType || 'Select Job Type'}
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                        </div>
                    </div>

                </div>
                
                {/* Employment Mode */}
                <div className='outline-1 rounded-3xl outline-neutral-400 pb-6 pt-5 px-8 w-full'>
                    <h1 className='text-lg font-satoshi-medium pb-3'>
                        Employment Mode <span className='text-error'>*</span>
                    </h1>
                    {/* dropdown Box */}
                    <div className="relative w-full">
                        <select
                            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
                            onChange={handleEmploymentModeChange}
                            value={employmentMode}
                        >
                            <option value="onsite">On-site</option>
                            <option value="remote">Remote</option>
                            <option value="hybrid">Hybrid</option>
                        </select>

                        {/* Fake dropdown with icon */}
                        <div className="bg-white font-satoshi-medium text-md w-full flex items-center justify-between md:pl-5 pl-5 pr-4 py-2 rounded-2xl text-black border border-neutral-400 pointer-events-none">
                            {employmentMode || 'Select Mode'}
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                        </div>
                    </div>

                </div>
            </div>
            

            {submitting ? (
                <div className="ml-auto mt-6">
                    <CircularLoading />
                </div>
            ) : (
                <button 
                onClick={handleSubmitJob} 
                className="mt-6 rounded-full justify-center bg-primary font-satoshi-medium text-white text-xl md:w-1/6 sm:w-2/6 w-3/6  h-12 ml-auto cursor-pointer"
                >
                    Submit
                </button>
            )}
        </div>
      );
      
}

export default EditJobPostAlum