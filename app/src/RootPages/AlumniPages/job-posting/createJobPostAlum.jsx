import { ArrowLeft } from 'lucide-react'
import React, { useState } from 'react'

function CreateJobPostAlum() {
    // Forms Values to be posted in the  API
    const [jobTitleInput, setJobTitleInput] = useState("");
    const [companyInput, setCompanyInput] = useState("");

    const handleJobTitleChange = (e) => {
        setJobTitleInput(e.target.value);
        console.log(jobTitleInput); //For checking only
    };

    const handleCompanyChange = (e) => {
        setCompanyInput(e.target.value);
        console.log(companyInput); //For checking only
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

            <div className='flex flex-row gap-3 mt-5'>
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
            
        </div>
    )
}

export default CreateJobPostAlum