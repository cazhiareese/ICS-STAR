import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminModal from './AdminModal';
import { X, CheckCircle } from 'lucide-react';
import axios from 'axios'
import CircularLoading from '../LoadingComponents/circularloading';

function JobTable({ data, jobType }) {
    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL
    const navigate = useNavigate();
    const [selectedJob, setSelectedJob] = useState(null);
    const [reports, setReports] = useState([])
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [removeLoading, setRemoveLoading] = useState(false);
    const [removeSuccess, setRemoveSuccess] = useState(false);
    const token = localStorage.getItem('token');


    async function removePost(token) {
      setRemoveLoading(true);
      try {
          await axios.delete(`${API_BASE_URL}/delete-job-postings/${selectedJob.post_id}`, {headers: {Authorization: `Bearer ${token}`}});
          setRemoveLoading(false);
          setRemoveSuccess(true);
          navigate(-1)
      } catch (error) {
          setRemoveLoading(false);
          console.error("Failed to delete post:", error);
      }
  }

    async function fetchReports(token){
        const response = await axios.get(`${API_BASE_URL}/admin/job-posts/${selectedJob.post_id}/reports`, {headers: {Authorization: `Bearer ${token}`}})
        console.log(response.data)
        setReports(response.data)
    }

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (selectedJob) {
          fetchReports(token);
      }
  }, [selectedJob]);

  return (
    <>
      <table className="w-full">
        <thead>
          <tr className="text-left text-sm text-primary font-satoshi-bold border-b border-gray-200">
            <th className="py-2 px-4">Date Posted</th>
            <th className="py-2 px-4">Job Title</th>
            <th className="py-2 px-4">Creator</th>
            <th className="py-2 px-4">Interested #</th>
            <th className="py-2 px-4">Card</th>
          </tr>
        </thead>

        <tbody className="font-satoshi-regular text-md">
          {data.map((job, index) => (
            <tr 
              key={index}
              className="border-b border-gray-200 h-10"
              >
              <td className="py-3 px-4 font-satoshi-regular">{job.date_posted}</td>
              <td className="py-3 px-4">{job.title}</td>
              <td className="py-3 px-4">{job.user_name}</td>
              <td className="py-3 px-4">{job.interested_count}</td>
              <td className="py-3 px-4">
                <button
                  className="text-primary hover:text-hover cursor-pointer underline"
                  onClick={() => setSelectedJob(job)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">            
            {jobType === 'reported' ? (
            <div className="flex flex-row gap-6 p-6 h-4/5 w-full">
                {/* Left Column: Reports Table */}
                <div className="flex flex-col md:w-3/5 bg-white rounded-2xl shadow p-6">
                    <div className='flex flex-row justify-between'>
                        <h2 className="text-3xl font-satoshi-bold mb-1">{selectedJob.title}</h2>
                        <button onClick={() => {setSelectedJob(null)}}>
                            <X size={28} className='text-primary rounded-full hover:text-hover cursor-pointer'/>
                        </button>
                    </div>
                    <p className="text-lg text-gray-700">{selectedJob.company}</p>
                    <p className="mb-4 text-sm text-gray-600">
                        Posted by: <span className="text-primary">{selectedJob.user_name}</span>
                    </p>

                    <h3 className="text-lg font-satoshi-medium mb-2">Reports</h3>
                    <div className="overflow-auto flex-1 rounded-2xl w-full border border-gray-300">
                        <table className="w-full">
                        <thead>
                            <tr className="text-sm text-left text-primary border-b border-gray-200">
                            <th className="py-2 px-3">Date Reported</th>
                            <th className="py-2 px-3">Alumni</th>
                            <th className="py-2 px-3">Reason</th>
                            <th className="py-2 px-3">Attachments</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {reports.map((report, i) => (
                            <tr 
                              key={i} 
                              className="border-b border-gray-200 h-10"
                              >
                                <td className="py-2 px-3">{report.date_reported}</td>
                                <td className="py-2 px-3">{report.reporter_name}</td>
                                <td className="py-2 px-3">{report.reason}</td>
                                <td className="py-2 px-3">
                                {report.attachment ? (
                                    <a
                                    className="text-primary underline hover:text-hover"
                                    href={report.attachment}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    >
                                    {report.attachment.split('/').pop()}
                                    </a>
                                ) : (
                                    'N/A'
                                )}
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                    {/* TODO: Add remove post */}
                    <div className="pt-4 flex w-full justify-end">
                        <button className="bg-error hover:bg-red-800 text-white px-6 py-2 rounded-3xl font-satoshi-medium text-lg cursor-pointer" 
                        onClick={() => setShowRemoveModal(true)}>
                        Remove Post
                        </button>
                    </div>
                </div>

                {/* Right Column: Job Preview Card */}
                <div className="md:w-2/5 bg-white rounded-2xl shadow overflow-hidden">
                    <div className="h-1/3 w-full bg-primary font-satoshi-regular rounded-t-2xl">
                      <img src={selectedJob.image} alt="" />
                    </div>
                    <div className="p-6">
                        <h2 className="text-4xl font-satoshi-bold mb-2">{selectedJob.title}</h2>
                        <p className="text-2xl font-satoshi-regular">
                        {selectedJob.company}
                        </p>
                        <p className='font-satoshi-regular'>
                        Posted by: <span className="text-primary">{selectedJob.user_name}</span>
                        </p>
                        <p className='font-satoshi-regular'>
                        Date: {selectedJob.date_posted}
                        </p>

                        <h3 className="font-satoshi-medium text-lg">Details</h3>
                        <p className='font-satoshi-regular text-md'><span className='font-satoshi-medium'>Employment type:</span> {selectedJob.employment_type}</p>
                        <p className='font-satoshi-regular text-md'> <span className='font-satoshi-medium'>Mode:</span> {selectedJob.mode}</p>

                        <h3 className="font-satoshi-medium text-lg">Description</h3>
                        <p className="font-satoshi-regular text-md">
                        {selectedJob.description}
                        </p>
                    </div>
                </div>
            </div>
            ) : (
            <div className="relative max-w-4xl mx-auto bg-white rounded-2xl shadow overflow-hidden h-4/5 w-1/3">
                <button 
                    className="absolute top-4 right-4 cursor-pointer text-white rounded-full"
                    onClick={() => setSelectedJob(null)}
                >
                    <X size={24} className=''/>
                </button>
                <div className="h-1/3 w-full bg-primary font-satoshi-regular rounded-t-2xl"></div>
                <div className="p-6">
                    <h2 className="text-4xl font-satoshi-bold mb-2">{selectedJob.title}</h2>
                    <p className="text-2xl font-satoshi-regular">
                    {selectedJob.company}
                    </p>
                    <p className='font-satoshi-regular'>
                    Posted by: <span className="text-primary">{selectedJob.user_name}</span>
                    </p>
                    <p className='font-satoshi-regular'>
                    Date: {selectedJob.date_posted}
                    </p>

                    <h3 className="font-satoshi-medium text-lg">Details</h3>
                    <p className='font-satoshi-regular text-md'><span className='font-satoshi-medium'>Employment type:</span> {selectedJob.employment_type}</p>
                    <p className='font-satoshi-regular text-md'> <span className='font-satoshi-medium'>Mode:</span> {selectedJob.mode}</p>

                    <h3 className="font-satoshi-medium text-lg">Description</h3>
                    <p className="font-satoshi-regular text-md">
                    {selectedJob.description}
                    </p>
                </div>
            </div>

            )}
        </div>
        )}
        {showRemoveModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
            <div className="flex flex-col justify-center items-center bg-white p-6 rounded-3xl shadow-lg w-[400px] min-h-[250px]">
              {removeLoading ? (
                <div className='h-full'>
                  <CircularLoading />
                </div>
              ) : removeSuccess ? (
                <>
                  <div className="text-success">
                    <CheckCircle size={48} />
                  </div>
                  <p className="text-xl font-satoshi-medium mt-4 text-center">
                    Post successfully removed!
                  </p>
                  <button
                    className="bg-success text-white px-4 py-2 rounded-3xl w-full mt-6 cursor-pointer"
                    onClick={() => {
                      setShowRemoveModal(false);
                      setRemoveSuccess(false);
                      setSelectedJob(null);
                      // optionally: refresh job list
                    }}
                  >
                    Close
                  </button>
                </>
              ) : (
                <>
                  <p className="text-xl font-satoshi-medium text-center mt-4">
                    Are you sure you want to remove the posting?
                  </p>
                  <div className="pt-8 font-satoshi-medium flex gap-3 mt-6 w-ful h-full justify-center">
                    <button
                      className="bg-white text-primary px-4 py-2 rounded-3xl w-25 outline outline-1 outline-primary cursor-pointer"
                      onClick={() => setShowRemoveModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-error text-white px-4 py-2 rounded-3xl w-25 cursor-pointer"
                      onClick={removePost(token)}
                    >
                      Remove
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

    </>
  );
}

export default JobTable;
