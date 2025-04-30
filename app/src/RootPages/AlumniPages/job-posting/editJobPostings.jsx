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
        // const newTags = tagInput
        //   .split(',')
        //   .map(tag => tag.trim())
        //   .filter(tag => tag.length > 0 && !tagss.includes(tag));
    
        // setTagss(prevTags => [...prevTags, ...newTags]);
        // setTagInput('');
        setIsTagsModalOpen(false);
    };

    // Remove a tag from the list
    const handleRemoveTag = (tagToRemove) => {
        setTagss(prevTags => prevTags.filter(tag => tag !== tagToRemove));
    };
    
    const handleAddSuggestionTag = (tag) => {
        if (!tagss.includes(tag)) {
          setTagss([...tagss, tag]);
      
        //   // Remove tag from suggestions
        //   setTagSuggestions(prev => prev.filter(t => t !== tag));
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

            // Optionally reset form fields here
        } catch (error) {
            console.error('Error posting job:', error);
            setSubmitting(false);
            alert("There was an error submitting the job post.");
        }
    };


    

    // useEffect(() => {
    //     setJobTitleInput('Frontend Developer');
    //     setCompanyInput('OpenAI Inc.');
    //     setLinkInput('https://www.openai.com/careers/frontend-dev');
    //     setTagss(['React', 'Tailwind', 'TypeScript']);
    //     setSalaryInput(20000);
    //     setDescription('We’re looking for a skilled Frontend Developer to join our AI team and build awesome tools.');
    // }, []);

    // Get company by id

    // useEffect(() => {
    //     const token = localStorage.getItem('token'); 
    //     const decoded = jwtDecode(token);
    //     console.log(decoded.sub)
    //     const fetchJobs = async () => {
        
    //     try {
    //         const response = await axios.get(`${API_BASE_URL}/job/get-company-by-id/${decoded.sub}`);
    //         if (!response.ok) {
    //         throw new Error('Failed to fetch company');
    //         }
            
    //         console.log(response.data);
            
    //     } catch (err) {
    //         alert(err.message || 'Something went wrong');
    //     } finally {
            
    //     }
    //     };

    //     fetchJobs();
    // }, []);


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
          <div className="flex flex-col md:flex-row gap-3">
            {/* Job Title */}
            <div className="outline-1 rounded-3xl outline-neutral-400 pb-6 pt-5 px-8 w-full">
              <h1 className="text-lg font-satoshi-medium pb-3">
                Job Title <span className="text-error">*</span>
              </h1>
              <input
                type="text"
                className="bg-white font-satoshi-medium text-md w-full pl-5 pr-4 py-2 rounded-2xl text-black border border-neutral-400 focus:border-primary focus:outline-none focus:ring-0"
                onChange={handleJobTitleChange}
                value={jobTitleInput}
              />
            </div>
      
            {/* Company */}
            <div className="flex flex-col outline-1 rounded-3xl outline-neutral-400 pb-4 pt-5 px-8 w-full">
              <h1 className="text-lg font-satoshi-medium pb-3">
                Company/Agency/Institution <span className="text-error">*</span>
              </h1>
              <input
                onChange={handleCompanyChange}
                type="text"
                value={companyInput}
                className="bg-white font-satoshi-medium text-md w-full h-10 pl-5 pr-4 py-2 rounded-2xl text-black border border-neutral-400 focus:border-primary focus:outline-none focus:ring-0"
                disabled={currentCompany}
              />
              <label className="flex items-center gap-2 ml-auto pt-7">
                <input
                  onChange={(e) => setCurrentCompany(e.target.checked)}
                  type="checkbox"
                  className="bg-primary w-4 h-4"
                />
                <span className="font-satoshi-regular">Same as current company</span>
              </label>
            </div>
          </div>
      
          {/* Salary & Tags */}
          <div className="flex flex-col md:flex-row gap-3 mt-6">
            {/* Salary */}
            <div className="outline-1 rounded-3xl outline-neutral-400 pb-6 pt-5 px-8 w-full md:w-5/6">
              <h1 className="text-lg font-satoshi-medium pb-3">Salary/Compensation</h1>
              <input
                onChange={handleSalaryChange}
                type="number"
                step="any"
                className="bg-white font-satoshi-medium text-md w-full h-10 pl-5 pr-4 py-2 rounded-2xl text-black border border-neutral-400 focus:border-primary focus:outline-none focus:ring-0"
              />
            </div>
      
            {/* Tags */}
            <div className="flex flex-col outline-1 rounded-3xl outline-neutral-400 pb-12 pt-5 px-8 w-full relative">
              <h1 className="text-lg font-satoshi-medium pb-3">Tags (Optional)</h1>
              <div
                ref={tagsRef}
                className="flex items-center cursor-pointer py-2 outline outline-1 rounded-xl h-10 outline-neutral-400 px-5"
                onClick={() => setIsTagsModalOpen(true)}
              >
                <span className="text-neutral-500 font-satoshi-regular">Select tags</span>
                <motion.button
                  className="cursor-pointer hover:text-primary ml-auto"
                  animate={{ rotate: isTagsModalOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={25} />
                </motion.button>
              </div>
      
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
                    <div className="text-2xl font-satoshi-medium border-b border-neutral-300 w-full pb-3">Add Tags</div>
                    <button onClick={() => setIsTagsModalOpen(false)} className="text-gray-500 hover:text-red-500">
                      ✕
                    </button>
                  </div>
      
                  <input
                    type="text"
                    value={tagInput}
                    onChange={handleTagInputChange}
                    onKeyPress={handleTagInputKeyPress}
                    className="bg-white font-satoshi-medium text-md w-full h-10 pl-5 pr-4 py-2 rounded-2xl text-black border border-neutral-400 focus:border-primary focus:outline-none focus:ring-0"
                    placeholder="Enter tags"
                  />
      
                  {tagss.length > 0 && (
                    <>
                      <h1 className="text-md font-satoshi-medium w-full py-3">Your Tags</h1>
                      <div className="flex flex-wrap gap-2">
                        {tagss.map((tag, index) => (
                          <span key={index} className="bg-primary text-white text-xs rounded-full px-3 py-1 font-satoshi-medium flex items-center gap-1 w-fit">
                            {tag}
                            <button onClick={() => handleRemoveTag(tag)} className="text-white text-xs rounded-full p-1">
                              <X size={14} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </>
                  )}
      
                  <h1 className="text-md font-satoshi-medium w-full py-3">Suggestions</h1>
                  <div className="flex flex-wrap gap-2">
                    {tagsSuggestions
                      .filter(tag => !tagss.includes(tag))
                      .map((tag, index) => (
                        <button
                          key={index}
                          onClick={() => handleAddSuggestionTag(tag)}
                          className="rounded-full border-2 border-primary text-primary px-4 py-1 font-satoshi-medium text-sm"
                        >
                          {tag}
                        </button>
                      ))}
                  </div>
      
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
          </div>
      
          {/* Application link */}
          <div className="flex flex-col outline-1 rounded-3xl outline-neutral-400 pb-6 pt-5 mt-6 px-8 w-full">
            <h1 className="text-lg font-satoshi-medium pb-3">
              Link to application platform or submission email <span className="text-error">*</span>
            </h1>
            <input
              type="text"
              className="bg-white font-satoshi-medium text-md w-full pl-5 pr-4 py-2 rounded-2xl text-black border border-neutral-400 focus:border-primary focus:outline-none focus:ring-0"
              onChange={handleLinkInput}
              value={linkInput}
            />
          </div>
      
          {/* Description and Image */}
          <div className="flex flex-col md:flex-row outline-1 rounded-3xl outline-neutral-400 pb-6 pt-5 mt-6 px-8 w-full gap-5">
            <div className="w-full md:w-4/6">
              <h1 className="text-lg font-satoshi-medium pb-3">
                Job Description and Hiring Process <span className="text-error">*</span>
              </h1>
              <textarea
                className="bg-white font-satoshi-medium text-md w-full pl-5 pr-4 py-2 rounded-2xl text-black border border-neutral-400 focus:border-primary focus:outline-none focus:ring-0 h-40"
                onChange={handleJobDescriptionChange}
                value={description}
                placeholder="Describe job posting"
              />
            </div>
      
            <div className="w-full md:w-2/6">
              <h1 className="text-lg font-satoshi-medium pb-3">Image (Optional)</h1>
              <div
                className="flex flex-col bg-neutral-100 rounded-3xl justify-center items-center py-10 gap-2"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <h1 className="text-primary">
                  <CloudUpload size={30} />
                </h1>
                <h1 className="text-neutral-500 font-satoshi-regular">Drag and drop files here or</h1>
                <button
                  onClick={triggerFileInput}
                  className="text-primary underline font-satoshi-regular cursor-pointer"
                >
                  Choose file
                </button>
                {fileName && (
                  <p className="text-neutral-700 text-xs font-satoshi-regular mt-2 break-words w-full text-center px-4">
                    Selected: {fileName}
                  </p>
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>
      
          {/* Employment Type and Mode */}
          <div className="flex flex-col md:flex-row gap-3 mt-6">
            {/* Type */}
            <div className="outline-1 rounded-3xl outline-neutral-400 pb-6 pt-5 px-8 w-full">
              <h1 className="text-lg font-satoshi-medium pb-3">
                Employment Type <span className="text-error">*</span>
              </h1>
              <div className="relative w-full">
                <select
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={handleEmploymentTypeChange}
                  value={employmentType}
                >
                  <option value="fulltime">Full-time</option>
                  <option value="parttime">Part-time</option>
                  <option value="contractual">Contractual</option>
                  <option value="freelance">Freelance</option>
                  <option value="internship">Internship</option>
                  <option value="apprenticeship">Apprenticeship</option>
                </select>
                <div className="bg-white font-satoshi-medium text-md w-full flex items-center justify-between pl-5 pr-4 py-2 rounded-2xl text-black border border-neutral-400 pointer-events-none">
                  {employmentType || 'Select Job Type'}
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                </div>
              </div>
            </div>
      
            {/* Mode */}
            <div className="outline-1 rounded-3xl outline-neutral-400 pb-6 pt-5 px-8 w-full">
              <h1 className="text-lg font-satoshi-medium pb-3">
                Employment Mode <span className="text-error">*</span>
              </h1>
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
                <div className="bg-white font-satoshi-medium text-md w-full flex items-center justify-between pl-5 pr-4 py-2 rounded-2xl text-black border border-neutral-400 pointer-events-none">
                  {employmentMode || 'Select Mode'}
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                </div>
              </div>
            </div>
          </div>
      
          {/* Submit */}
          {submitting ? (
            <div className="ml-auto mt-6">
              <CircularLoading />
            </div>
          ) : (
            <button
              onClick={handleSubmitJob}
              className="mt-6 rounded-full justify-center bg-primary font-satoshi-medium text-white text-xl w-full md:w-1/6 h-12 ml-auto cursor-pointer"
            >
              Submit
            </button>
          )}
        </div>
      );
      
}

export default EditJobPostAlum