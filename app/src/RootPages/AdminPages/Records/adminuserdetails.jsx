import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { MoveLeft, Check, ShieldAlert, MapPin, Phone, IdCard, GraduationCap, X, CheckCircle  } from 'lucide-react';
import axios from 'axios'
import CircularLoading from '../../../components/LoadingComponents/circularloading';

function AdminUserDetails() {
  const navigate = useNavigate()
  const { userid } = useParams();

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const [loading, setLoading] = useState(true)
  const [limitAccessLoading, setLimitAccessLoading] = useState(false)
  const [showAlumniModal, setShowAlumniModal] = useState(false)
  const [makeAlumniLoading, setMakeAlumniLoading] = useState(false)
  const [transitionComplete, setTransitionComplete] = useState(false)  
  const [showReportsModal, setShowRepotsModal] = useState(false)
  const [reports, setReports] = useState([])
  const [user, setUser] = useState({
    // "user_id": ""
    // "first_name": "",
    // "last_name": "",
    // "email": "",
    // "mobile_number": "",
    // "age": ,
    // "gender": "M",
    // "city": "Marinduque",
    // "state": "MIMAROPA",
    // "country": "Philippines",
    // "marital_status": "Single",
    // "image": null,
    // "user_type": "alumni",
    // "position": null,
    // "is_banned": false,
    // "student_number": "2019-23232",
    // "standing": null,
    // "graduation_year": 2024,
    // "graduation_semester": "2nd Semester",
    // "employment_status": "unemployed",
    // "industry": null,
    // "company_name": null,
    // "job_title": null,
    // "work_location": null,
    // "work_mode": null,
    // "employer_class": null,
    // "tenured_status": null,
    // "salary_grade": null,
    // "facebook": null,
    // "linkedin": null,
    // "github": null,
    // "created_at": "2025-04-06T07:16:01.008079+00:00",
    // "updated_at": "2025-04-06T09:43:01.302784+00:00",
    // "skills": [],
    // "scholarships": [],
    // "affiliations": []
  })

  useEffect(() => {
      console.log(userid);
      const fetchData = async () => {
        setLoading(true)
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
        } finally {
          setLoading(false)
        }
      }

      fetchData()
  }, [userid])

  const [isOpen, setIsOpen] = useState(false);

  async function makeAlumni() {
    setMakeAlumniLoading(true)
    try {
      const response = await axios.put(`${API_BASE_URL}/admin/transition/${userid}`)
      console.log(response)
      setTimeout(() => {
      }, 500)
      setTransitionComplete(true)
    } catch (error) {
      console.error(error)
    } finally {
      setMakeAlumniLoading(false)
    }
  }

  async function limitAccountAccess() {
    // alert("Limited account access")
    setLimitAccessLoading(true)
    try {
      const response = await axios.put(`${API_BASE_URL}/admin/ban/${userid}`)
      console.log(response)
    } catch (error) {
      console.log(error)
    } finally {
      setLimitAccessLoading(false)
      // setIsOpen(false)
    }
  }

  return (
    loading ? (
      <div className='flex items-center justify-center h-screen'>
        <CircularLoading size={90}/>
      </div>
    ) : (
      <div className='p-6 overflow-auto max-h-screen'>
        {/* Back */}
        <button className="flex gap-2 mb-3 flex-row items-center cursor-pointer" onClick={() => navigate(-1)}>
          <MoveLeft className='text-primary'/> 
          <p className='text-primary font-satoshi-medium text-lg'>Back</p>
        </button>
        {/* Records and confirmation button*/}
        <div className='flex lg:justify-between justify-end items-center mb-5'>
          <h1 className='text-primary font-satoshi-bold text-3xl hidden lg:block'>Records</h1>
          {user.user_type === 'student' ? (
          <button
            className='flex items-center bg-success text-white text-md font-satoshi-regular gap-2 rounded-3xl px-4 py-2 cursor-pointer'
            onClick={() => setShowAlumniModal(true)}
          >
            <Check className='' size={20}/>
            <p> Make Alumni</p>
          </button>
        ) : (<></>)}
        </div>
        {/* Basic information */}
        <div className='flex flex-row border border-gray-300 rounded-xl w-full p-6 mb-6'>
          <div className='border border-black rounded-full h-30 w-30'></div>
          <div className='flex flex-col justify-center ml-8'>
            <h2 className='font-satoshi-bold text-2xl'>{`${user.first_name} ${user.last_name}`}</h2>
            <p className='font-satoshi-light'>{user.email}</p>
          </div>
          <button className='hidden lg:flex flex-row gap-2 ml-auto text-error font-satoshi-medium cursor-pointer' onClick={() => {setLimitAccessLoading(true)}}>
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
        {limitAccessLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
            <div className="flex flex-col items-center bg-white p-6 rounded-3xl shadow-lg min-w-md h-2/5">
              {/* Modal Header */}
              <div className="flex justify-between w-full items-center pb-2">
                <h2 className="text-2xl font-satoshi-medium">Report Logs</h2>
                <button className='rounded-full h-fit bg-error p-1 cursor-pointer' onClick={() => setLimitAccessLoading(false)}>
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
        {/* Graduation loading */}
        {showAlumniModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
            <div className="flex flex-col justify-center items-center bg-white p-6 rounded-3xl shadow-lg w-[400px] min-h-[250px]">
              {/* Loading Spinner */}
              {makeAlumniLoading ? (
                <div className='h-full'>
                  <CircularLoading />
                </div>
              ) : transitionComplete ? (
                <>
                  <div className="text-success">
                    <CheckCircle size={48} />
                  </div>
                  <p className="text-xl font-satoshi-medium mt-4 text-center">
                    Transition to Alumni Successful!
                  </p>
                  <button
                    className="bg-success text-white px-4 py-2 rounded-3xl w-full mt-6 cursor-pointer"
                    onClick={() => {
                      setShowAlumniModal(false)
                      setTransitionComplete(false)
                      window.location.reload()
                    }}
                  >
                    Close
                  </button>
                </>
              ) : (
                <div className=''>
                  <p className="text-xl font-satoshi-medium text-center mt-4">
                    Confirm transition to Alumni?
                  </p>
                  <div className="flex gap-3 mt-6 w-full h-full justify-center">
                    <button
                      className="bg-gray-300 text-black px-4 py-2 rounded-3xl w-full cursor-pointer"
                      onClick={() => setShowAlumniModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-success text-white px-4 py-2 rounded-3xl w-full cursor-pointer"
                      onClick={makeAlumni}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  )
}

export default AdminUserDetails
