import { MoveLeft, ArrowLeft, ArrowRight } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CircularLoading from '../../../components/LoadingComponents/circularloading';


function MostEngagedJobs() {
    const [daysFilter, setDaysFilter] = useState("30days");
    const [mostInterested, setMostInterested] = useState([]);
    const [loading, setLoading] = useState(false);
    const [skip, setSkip] = useState(0);
    const navigate = useNavigate();
    


    // BASE URL ENV
    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

    // API call for getting most interested list
    useEffect(() => {
        const fetchMostInterested = async () => {
          // setFullEngagementReportLoading(true);
          setLoading(true);
          try {
            const response = await axios.get(`${API_BASE_URL}/admin/engagement-statistics/jobs/top-interested?time_range=${daysFilter}&skip=${skip}&limit=10`);
            console.log(response.data);
            setMostInterested(response.data);
            const totalPages = Math.ceil(response.data.length / rowsPerPage);
            // setFullEngagementReportLoading(false);
            setLoading(false);
          } catch (err) {
            console.log(err.message || 'Something went wrong');
          }
        };
      
        fetchMostInterested();
    }, [daysFilter, skip]);
    return (
        <div className="bg-[rgb(243,241,244)] p-6 min-h-screen">
            {/* Back Link */}
            <div className="flex items-center mb-6 cursor-pointer" onClick={() => navigate(-1)}>
                <MoveLeft className="text-primary" />
                <p className="text-primary font-satoshi-medium text-lg ml-2">Back to Dashboard</p>
            </div>

            {/* Filters Row */}
            <div className="flex justify-between items-center mb-4">
                <div></div> {/* Empty div to push filters to the right */}
                <div className="flex items-center gap-4">
                {/* Date filter */}
                <div>
                    <select
                    className="rounded-md px-2 py-1 shadow-sm font-satoshi-medium w-40"
                    value={daysFilter}
                    onChange={(e) => setDaysFilter(e.target.value)}
                    >
                    <option value={"7days"}>Last 7 days</option>
                    <option value={"30days"}>Last 30 days</option>
                    <option value={"year"}>Last year</option>
                    </select>
                </div>
                </div>
            </div>

            {/* Title and Pagination Controls */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-satoshi-bold text-black py-5">Most Engaged Job Offers</h1>
                <div className="flex space-x-4">
                    <button onClick={() => setSkip(prevSkip => prevSkip - 10)}  disabled={skip === 0} className="p-2 rounded-full disabled:opacity-50 cursor-pointer">
                        <ArrowLeft className="h-5 w-5 text-black" />
                    </button>
                    <button onClick={() => setSkip(prevSkip => prevSkip + 10)}  disabled={mostInterested.length < 10} className="p-2 rounded-full disabled:opacity-50 cursor-pointer">
                        <ArrowRight className="h-5 w-5 text-black" />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl p-4 shadow-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="h-20 font-satoshi-bold text-gray-600 text-xs">
                            <tr>
                                <th className="py-3 px-6 font-semibold">DATE</th>
                                <th className="py-3 px-6 font-semibold">NAME</th>
                                <th className="py-3 px-6 font-semibold">COMPANY</th>
                                <th className="py-3 px-6 font-semibold">LINK</th>
                                <th className="py-3 px-6 font-semibold">INTERESTED</th>
                            </tr>
                        </thead>
                        <tbody className="font-satoshi-medium">
                            {mostInterested ? (
                                <CircularLoading/>
                            ) : (
                            mostInterested.map((job, index) => (
                                <tr key={index} className="border-b border-gray-300 hover:bg-gray-50 h-20">
                                    <td className="py-4 px-6 text-gray-500">{job.date_posted}</td>
                                    <td className="py-4 px-6 text-black">{job.title}</td>
                                    <td className="py-4 px-6 text-black">{job.company}</td>
                                    <td className="py-4 px-6 text-gray-500">
                                        <a href={job.link} className="text-primary underline">Link</a>
                                    </td>
                                    <td className="py-4 px-6">{job.interested_count}</td>
                                </tr>
                            )))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default MostEngagedJobs;
