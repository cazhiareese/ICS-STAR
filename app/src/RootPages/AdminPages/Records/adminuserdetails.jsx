import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { MoveLeft, Check, ShieldAlert, MapPin, Phone, IdCard, GraduationCap, X  } from 'lucide-react';
import axios from 'axios'
import { div, p } from 'framer-motion/client';

function AdminUserDetails() {
  const navigate = useNavigate()
  const { userid } = useParams();

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const [reports, setReports] = useState([])
  const [user, setUser] = useState({
    "user_id": "422aaae7-542a-4790-befa-2e2e1a6e4707",
    "first_name": "Michael",
    "last_name": "Brown",
    "email": "michael.brown@example.com",
    "mobile_number": "09090900902",
    "age": 21,
    "gender": "M",
    "city": "Marinduque",
    "state": "MIMAROPA",
    "country": "Philippines",
    "marital_status": "Single",
    "image": null,
    "user_type": "alumni",
    "position": null,
    "is_banned": false,
    "student_number": "2019-23232",
    "standing": null,
    "graduation_year": 2024,
    "graduation_semester": "2nd Semester",
    "employment_status": "unemployed",
    "industry": null,
    "company_name": null,
    "job_title": null,
    "work_location": null,
    "work_mode": null,
    "employer_class": null,
    "tenured_status": null,
    "salary_grade": null,
    "facebook": null,
    "linkedin": null,
    "github": null,
    "created_at": "2025-04-06T07:16:01.008079+00:00",
    "updated_at": "2025-04-06T09:43:01.302784+00:00",
    "skills": [],
    "scholarships": [],
    "affiliations": []
  })

  useEffect(() => {
      console.log(userid);
      const fetchData = async () => {
        try {
          // get the user details
          const user = await axios.get(`${API_BASE_URL}/profile/${userid}`)
          console.log(user.data.data)
          setUser(user.data.data)

          // get the reports
          const reports = await axios.get(`${API_BASE_URL}/admin/report-logs/${userid}`)
          console.log(reports.data)
          setReports(reports.data)
        } catch (error) {
          console.log(error)
        }
      }

      fetchData()
  }, [userid])

  const [isOpen, setIsOpen] = useState(false);

  function makeAlumni() {
    alert("Made alumni")
  }

  function limitAccountAccess() {
    alert("Limited account access")
    axios.put(`${API_BASE_URL}/admin/ban${userid}`)
    .then(response => {
      console.log(response)
    }).catch(error => {
      console.log(response)
    })
    setIsOpen(false)
  }

  return (
    <div className='p-6 overflow-auto max-h-screen'>
      {/* Back */}
      <button className="flex gap-2 mb-3 flex-row items-center cursor-pointer" onClick={() => navigate(-1)}>
        <MoveLeft className='text-primary'/> 
        <p className='text-primary font-satoshi-medium text-lg'>Back</p>
      </button>
      {/* Records and confirmation button*/}
      <div className='flex lg:justify-between justify-end items-center mb-5'>
        <h1 className='text-primary font-satoshi-bold text-3xl hidden lg:block'>Records</h1>
        <button className='flex items-center bg-success text-white text-md font-satoshi-regular gap-2 rounded-3xl px-4 py-2 cursor-pointer' onClick={() => {makeAlumni()}}>
          <Check className='' size={20}/>
          <p> Make Alumni</p>
        </button>
      </div>
      {/* Basic information */}
      <div className='flex flex-row border border-gray-300 rounded-xl w-full p-6 mb-6'>
        <div className='border border-black rounded-full h-30 w-30'></div>
        <div className='flex flex-col justify-center ml-8'>
          <h2 className='font-satoshi-bold text-2xl'>{`${user.first_name} ${user.last_name}`}</h2>
          <p className='font-satoshi-light'>{user.email}</p>
        </div>
        <button className='hidden lg:flex flex-row gap-2 ml-auto text-error font-satoshi-medium cursor-pointer' onClick={() => {setIsOpen(true)}}>
          <p className='hidden lg:block'>View Report Logs</p>
          <ShieldAlert/>
        </button>
      </div>
      {/* Personal information */}
      <h2 className='font-satoshi-medium text-xl'> PERSONAL INFORMATION</h2>
      <div className='border-t border-gray-300 grid gap-y-5 grid-cols-2 lg:flex flex-row justify-between text-lg py-5 w-full mb-5'>
      {/* Personal information cards */}
        {/* Location */}
        <div className='flex flex-col'>
          <div className='flex items-center'>
            <MapPin/>
            <h3 className='font-satoshi-light ml-1'>Location</h3>
          </div>
          <h3 className='font-satoshi-medium ml-7'> {user.work_location}</h3>
        </div>
        {/* Mobile Number */}
        <div className='flex flex-col'>
          <div className='flex items-center'>
            <Phone/>
            <h3 className='font-satoshi-light ml-1'>Mobile Number</h3>
          </div>
          <h3 className='font-satoshi-medium ml-7'> {user.mobile_number} </h3>
        </div>
        {/* Student Number */}
        <div className='flex flex-col'>
          <div className='flex items-center'>
            <IdCard/>
            <h3 className='font-satoshi-light ml-1'>Student Number</h3>
          </div>
          <h3 className='font-satoshi-medium ml-7'> {user.student_number} </h3>
        </div>
        {/* Graduating Class */}
        <div className='flex flex-col'>
          <div className='flex items-center'>
            <GraduationCap/>
            <h3 className='font-satoshi-light ml-1'>Graduating Class</h3>
          </div>
          <h3 className='font-satoshi-medium ml-7'> {`${user.graduation_year} ${user.graduation_semester}`} </h3>
        </div>
      </div>
      {/* SKILLS AND INTERESTS */}
      <h2 className='font-satoshi-medium text-xl'> SKILLS AND INTERESTS</h2>
      <div className='border-t border-gray-300 flex flex-row flex-wrap gap-3 py-5 mb-5'>
        {user.skills.map((skill, index) => (
          <div key={index} className="rounded-4xl p-2 border-2 w-fit border-black">
            <p className='font-satoshi-medium lg:text-md text-sm whitespace-nowrap'> {skill} </p>
          </div>
        ))}
      </div>
      {/* AFFILIATIONS */}
      <h2 className='font-satoshi-medium text-xl'> AFFILIATIONS </h2>
      <div className='border-t border-gray-300 grid grid-cols-2 w-full gap-3 py-5 mb-5'>
        {user.affiliations.map((affiliation, index) => (
          <div key={index} className="">
            <p className='font-satoshi-medium'> {affiliation.organization} </p>
            <p className='font-satoshi-light'> {affiliation.role}</p>
          </div>
        ))}
      </div>
      {/* SCHOLARSHIPS */}
      <h2 className='font-satoshi-medium text-xl'> SCHOLARSHIPS </h2>
      <div className='border-t border-gray-300 grid grid-cols-2 w-full gap-3 py-5 mb-5'>
        {user.scholarships.map((scholarship, index) => (
          <div key={index} className="">
            <p className='font-satoshi-medium'> {scholarship} </p>
          </div>
        ))}
      </div>
      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="flex flex-col items-center bg-white p-6 rounded-3xl shadow-lg min-w-md h-2/5">
            {/* Modal Header */}
            <div className="flex justify-between w-full items-center pb-2">
              <h2 className="text-2xl font-satoshi-medium">Report Logs</h2>
              <button className='rounded-full h-fit bg-error p-1 cursor-pointer' onClick={() => setIsOpen(false)}>
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            {/* Report Table */}
            {reports === null ? (
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
                      <td className='py-2'>{report.report_date}</td>
                      <td>{report.report_time}</td>
                      <td>{report.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className='h-full'>
                <p className='font-satoshi-regular text-lg text-black'> No reports </p>
              </div>
            )}

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
