import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { MoveLeft, Check, ShieldAlert, MapPin, Phone, IdCard, GraduationCap, X  } from 'lucide-react';

function AdminUserDetails() {
  const navigate = useNavigate()
  const { userid } = useParams();
  useEffect(() => {
      console.log(userid);
  }, [userid])

  const [isOpen, setIsOpen] = useState(false);

  function makeAlumni() {
    alert("Made alumni")
  }

  function limitAccountAccess() {
    alert("Limited account access")
    setIsOpen(false)
  }

  const reports = [
    { date: "03/30/25", time: "15:05:05", remarks: "Inappropriate job posting" },
    { date: "03/30/25", time: "15:05:05", remarks: "Inappropriate job posting" },
    { date: "03/30/25", time: "15:05:05", remarks: "Inappropriate job posting" },
    { date: "03/30/25", time: "15:05:05", remarks: "Inappropriate job posting" },
  ];

  const skills = ['Artificial Intelligence', 'Cybersecurity', 'Web Development']
  const affiliations = [
    {
      "organization": "Young Software Engineers' Society",
      "role": "Resident Member"
    },
    {
      "organization": "Young Software Engineers' Society",
      "role": "Resident Member"
    },
    {
      "organization": "Young Software Engineers' Society",
      "role": "Resident Member"
    }
  ]
  const scholarships = ["DOST Scholarship", "UPLB SLAS"]
  return (
    <div className='p-6 overflow-auto h-screen'>
      {/* Back */}
      <button className="flex gap-2 mb-3 flex-row items-center cursor-pointer" onClick={() => navigate(-1)}>
        <MoveLeft className='text-primary'/> 
        <p className='text-primary font-satoshi-medium text-lg'>Back</p>
      </button>
      {/* Records and confirmation button*/}
      <div className='flex justify-between items-center mb-5'>
        <h1 className='text-primary font-satoshi-bold text-3xl'>Records</h1>
        <button className='flex items-center bg-success text-white text-md font-satoshi-regular gap-2 rounded-3xl px-4 py-2 cursor-pointer' onClick={() => {makeAlumni()}}>
          <Check className='' size={20}/>
          <p> Make Alumni</p>
        </button>
      </div>
      {/* Basic information */}
      <div className='flex flex-row border border-gray-300 rounded-xl w-full p-6 mb-6'>
        <div className='border border-black rounded-full h-30 w-30'></div>
        <div className='flex flex-col justify-center ml-8'>
          <h2 className='font-satoshi-bold text-3xl'>Kiefer Tayawa</h2>
          <p className='font-satoshi-light'>kltayawa@up.edu.ph</p>
        </div>
        <button className='flex flex-row gap-2 ml-auto text-error font-satoshi-medium' onClick={() => {setIsOpen(true)}}>
          <p>View Report Logs</p>
          <ShieldAlert/>
        </button>
      </div>
      {/* Personal information */}
      <h2 className='font-satoshi-medium text-xl'> PERSONAL INFORMATION</h2>
      <div className='border-t border-gray-300 flex flex-row justify-between text-lg py-5 w-full mb-5'>
      {/* Personal information cards */}
        {/* Location */}
        <div className='flex flex-col'>
          <div className='flex items-center'>
            <MapPin/>
            <h3 className='font-satoshi-light ml-1'>Location</h3>
          </div>
          <h3 className='font-satoshi-medium ml-7'> Manila, PH</h3>
        </div>
        {/* Mobile Number */}
        <div className='flex flex-col'>
          <div className='flex items-center'>
            <Phone/>
            <h3 className='font-satoshi-light ml-1'>Mobile Number</h3>
          </div>
          <h3 className='font-satoshi-medium ml-7'> 09123456789</h3>
        </div>
        {/* Student Number */}
        <div className='flex flex-col'>
          <div className='flex items-center'>
            <IdCard/>
            <h3 className='font-satoshi-light ml-1'>Student Number</h3>
          </div>
          <h3 className='font-satoshi-medium ml-7'> 1234-56789 </h3>
        </div>
        {/* Graduating Class */}
        <div className='flex flex-col'>
          <div className='flex items-center'>
            <GraduationCap/>
            <h3 className='font-satoshi-light ml-1'>Graduating Class</h3>
          </div>
          <h3 className='font-satoshi-medium ml-7'> 2022 - 1st Semester</h3>
        </div>
      </div>
      {/* SKILLS AND INTERESTS */}
      <h2 className='font-satoshi-medium text-xl'> SKILLS AND INTERESTS</h2>
      <div className='border-t border-gray-300 flex flex-row gap-3 py-5 mb-5'>
        {skills.map((skill, index) => (
          <div key={index} className="rounded-4xl p-2 border-2 w-fit border-black">
            <p className='font-satoshi-medium'> {skill} </p>
          </div>
        ))}
      </div>
      {/* AFFILIATIONS */}
      <h2 className='font-satoshi-medium text-xl'> SKILLS AND INTERESTS</h2>
      <div className='border-t border-gray-300 grid grid-cols-2 w-full gap-3 py-5 mb-5'>
        {affiliations.map((affiliation, index) => (
          <div key={index} className="">
            <p className='font-satoshi-medium'> {affiliation.organization} </p>
            <p className='font-satoshi-light'> {affiliation.role}</p>
          </div>
        ))}
      </div>
      {/* SCHOLARSHIPS */}
      <h2 className='font-satoshi-medium text-xl'> SCHOLARSHIPS </h2>
      <div className='border-t border-gray-300 grid grid-cols-2 w-full gap-3 py-5 mb-5'>
        {scholarships.map((scholarship, index) => (
          <div key={index} className="">
            <p className='font-satoshi-medium'> {scholarship} </p>
          </div>
        ))}
      </div>
      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="flex flex-col items-center bg-white p-6 rounded-3xl shadow-lg max-w-md h-2/5">
            {/* Modal Header */}
            <div className="flex justify-between w-full items-center pb-2">
              <h2 className="text-2xl font-satoshi-medium">Report Logs</h2>
              <button className='rounded-full h-fit bg-error p-1 cursor-pointer' onClick={() => setIsOpen(false)}>
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Report Table */}
            <table className="w-full mt-3 table-fixed overflow-auto">
              <thead>
                <tr className="text-left text-sm font-satoshi-medium">
                  <th className='w-1/4'>Date</th>
                  <th className='w-1/4'>Time</th>
                  <th className='w-1/2'>Remarks</th>
                </tr>
              </thead>
              <tbody className=''>
                {reports.map((report, index) => (
                  <tr key={index} className="font-satoshi-regular">
                    <td className='py-2'>{report.date}</td>
                    <td>{report.time}</td>
                    <td>{report.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Action Button */}
            <button className="mt-4 bg-error text-white px-4 py-2 rounded-3xl w-full cursor-pointer" onClick={() => {limitAccountAccess()}}>
              Limit Account Access
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUserDetails
