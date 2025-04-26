import { MoveLeft, ArrowLeft, ArrowRight } from 'lucide-react';
import React, { useState } from 'react';

const dummyJobs = [
    { date: 'Mar 8, 2025', name: 'Software Developer', company: 'ABCDE and Co.', link: '#', interested: 200 },
    { date: 'Mar 9, 2025', name: 'Frontend Engineer', company: 'XYZ Corp.', link: '#', interested: 180 },
    { date: 'Mar 10, 2025', name: 'Backend Engineer', company: 'Techies Ltd.', link: '#', interested: 220 },
    { date: 'Mar 11, 2025', name: 'Fullstack Developer', company: 'Innovate Inc.', link: '#', interested: 150 },
    { date: 'Mar 12, 2025', name: 'QA Engineer', company: 'SoftWorks', link: '#', interested: 130 },
    { date: 'Mar 13, 2025', name: 'DevOps Engineer', company: 'DeployHub', link: '#', interested: 210 },
    { date: 'Mar 14, 2025', name: 'Product Manager', company: 'Visionary Co.', link: '#', interested: 175 },
    { date: 'Mar 15, 2025', name: 'Data Scientist', company: 'DataGenius', link: '#', interested: 240 },
    { date: 'Mar 8, 2025', name: 'Software Developer', company: 'ABCDE and Co.', link: '#', interested: 200 },
    { date: 'Mar 9, 2025', name: 'Frontend Engineer', company: 'XYZ Corp.', link: '#', interested: 180 },
    { date: 'Mar 10, 2025', name: 'Backend Engineer', company: 'Techies Ltd.', link: '#', interested: 220 },
    { date: 'Mar 11, 2025', name: 'Fullstack Developer', company: 'Innovate Inc.', link: '#', interested: 150 },
    { date: 'Mar 12, 2025', name: 'QA Engineer', company: 'SoftWorks', link: '#', interested: 130 },
    { date: 'Mar 13, 2025', name: 'DevOps Engineer', company: 'DeployHub', link: '#', interested: 210 },
    { date: 'Mar 14, 2025', name: 'Product Manager', company: 'Visionary Co.', link: '#', interested: 175 },
    { date: 'Mar 15, 2025', name: 'Data Scientist', company: 'DataGenius', link: '#', interested: 240 },
];

function MostEngagedJobs() {
    const [page, setPage] = useState(0);
    const [daysFilter, setDaysFilter] = useState(30);
    const rowsPerPage = 6;

    const handlePrev = () => {
        if (page > 0) setPage(page - 1);
    };

    const handleNext = () => {
        if ((page + 1) * rowsPerPage < dummyJobs.length) setPage(page + 1);
    };

    // Slice the job array 
    const paginatedJobs = dummyJobs.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

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
                    onChange={(e) => setDaysFilter(Number(e.target.value))}
                    >
                    <option value={7}>Last 7 days</option>
                    <option value={15}>Last 15 days</option>
                    <option value={30}>Last 30 days</option>
                    </select>
                </div>
                </div>
            </div>

            {/* Title and Pagination Controls */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-satoshi-bold text-black py-5">Most Engaged Job Offers</h1>
                <div className="flex space-x-4">
                    <button onClick={handlePrev} disabled={page === 0} className="p-2 rounded-full disabled:opacity-50 cursor-pointer">
                        <ArrowLeft className="h-5 w-5 text-black" />
                    </button>
                    <button onClick={handleNext} disabled={(page + 1) * rowsPerPage >= dummyJobs.length} className="p-2 rounded-full disabled:opacity-50 cursor-pointer">
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
                            {paginatedJobs.map((job, index) => (
                                <tr key={index} className="border-b border-gray-300 hover:bg-gray-50 h-20">
                                    <td className="py-4 px-6 text-gray-500">{job.date}</td>
                                    <td className="py-4 px-6 text-black">{job.name}</td>
                                    <td className="py-4 px-6 text-black">{job.company}</td>
                                    <td className="py-4 px-6 text-gray-500">
                                        <a href={job.link} className="text-primary underline">Link</a>
                                    </td>
                                    <td className="py-4 px-6">{job.interested}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default MostEngagedJobs;
