import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminModal from './adminmodal';

function JobTable({ data }) {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState(null);

  return (
    <>
      <table className="w-full">
        <thead>
          <tr className="text-left text-xs text-primary font-satoshi-regular">
            <th className="py-2 px-4">Date Posted</th>
            <th className="py-2 px-4">Job Title</th>
            <th className="py-2 px-4">Creator</th>
            <th className="py-2 px-4">Interested #</th>
            <th className="py-2 px-4">Card</th>
          </tr>
        </thead>

        <tbody className="font-satoshi-regular text-md">
          {data.map((job, index) => (
            <tr key={index}>
              <td className="py-3 px-4 font-satoshi-bold">{job.date_posted}</td>
              <td className="py-3 px-4">{job.job_title}</td>
              <td className="py-3 px-4">{job.creator}</td>
              <td className="py-3 px-4">{job.interested}</td>
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

      <AdminModal isOpen={!!selectedJob} onClose={() => setSelectedJob(null)}>
        {selectedJob && (
          <>
            <div className='h-1/3 w-full bg-primary font-satoshi-regular rounded-t-2xl'></div>
            <div className='p-6'>
                <h2 className="text-4xl font-satoshi-bold mb-2">{selectedJob.job_title}</h2>
                <p className="text-2xl font-satoshi-regular">
                {selectedJob.org || 'Institute of Computer Science, UPLB'}
                </p>
                <p className='font-satoshi-regular'>
                    Posted by: <span className="text-primary">{selectedJob.creator}</span>
                </p>
                <p className='font-satoshi-regular'>
                    Date: {selectedJob.date_posted}
                </p>

                <h3 className="font-satoshi-medium mb-1 text-lg">Details</h3>
                <p className='font-satoshi-regular text-sm'>Details here</p>

                <h3 className="font-satoshi-medium mb-1 text-lg">Description</h3>
                <p className="font-satoshi-regular text-sm">
                This is a placeholder description. Replace with actual data or enrich the job object!
                </p>
            </div>
          </>
        )}
      </AdminModal>
    </>
  );
}

export default JobTable;
