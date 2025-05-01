import { React, useEffect, useState } from 'react'
import { MoveLeft, Check, IdCard, GraduationCap } from 'lucide-react'
import { Navigate, useNavigate , useParams } from 'react-router-dom'
import axios from 'axios';
import CircularLoading from '../../../components/LoadingComponents/circularloading';
import { CheckCircle } from 'lucide-react';

function AdminVerificationConfirmation() {
  const navigate = useNavigate()

  const [user, setUser] = useState({
  })

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const { userid } = useParams();
  const [loading, setLoading] = useState(true)
  const [verifyTransition, setVerifyTransition] = useState(false)  
  const [verificationLoading, setVerificationLoading] = useState(false)
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const userProfile = await axios.get(`${API_BASE_URL}/admin/unverified/user/${userid}`)
        console.log(userProfile.data)
        setUser(userProfile.data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    } 
    fetchData()
  }, [])

  async function verifyUser() {
    setVerificationLoading(true)
    try {
      const response = await axios.put(`${API_BASE_URL}/admin/confirm/${userid}`)
      console.log(response)
      setVerifyTransition(false)
      setTimeout(() => {        
      }, 500)
      setVerifyTransition(true)
    } catch (error) {
      console.log(error)
    } finally {
      setVerificationLoading(false)
    }
  }

  return (
    loading ? (
      <div className='flex items-center justify-center h-screen'>
        <CircularLoading size={90}/>
      </div>
    ) : (
    <div className='p-6 flex flex-col h-screen w-full'>
      <div className='flex gap-2 mb-0'>
        <button className="flex flex-row gap-4 items-center cursor-pointer" onClick={() => navigate(-1)}>
          <MoveLeft className='text-primary'/> 
          <p className='text-primary font-satoshi-medium text-lg'>Back</p>
        </button>
      </div>
      <div className='flex justify-between mt-2'>
        {/* Records header */}
        <div className="items-baseline gap-2 hidden lg:flex">
          <h1 className='text-primary font-satoshi-bold text-5xl '> Records </h1>
          <p className='font-satoshi-light text-lg text-gray-500'>/ Pending Verifications</p>
        </div>
        <button className='flex items-center bg-success text-white text-md font-satoshi-medium gap-2 rounded-3xl px-4 py-1 cursor-pointer hover:bg-green-400' onClick={() => {setShowVerificationModal(true)}}>
          <Check className=''/>
          <p> Confirm Verification</p>
        </button>
      </div>
      {/* Information */}
      <div className='w-full p-6 mt-10 flex flex-col'>
        {/* Basic information */}
        <div className='flex'>
          {/* Image placeholder */}
          <div className='bg-primary rounded-full h-30 w-30'> 
            <img src={user.image} alt='' className='object-contain w-full' />
          </div>
            <div className='flex flex-col justify-between ml-6'>
              <div>
                <p className='font-satoshi-bold text-3xl'> {user.name} </p>
                <p className='font-satoshi-light'> {user.email}</p>
              </div>
            {/* Student number and graduating class */}
            <div className='flex flex-row'>
              {/* Student number */}
              <div className='flex flex-col'>
                <div className='flex flex-row gap-2'>
                  <IdCard/> 
                  <p className='font-satoshi-regular'>Student Number</p>
                </div>
                <p className='ml-8 font-satoshi-bold'>{user.student_number}</p>
              </div>
              <div className='flex flex-col ml-20'>
                <div className='flex flex-row gap-2'>
                  <GraduationCap/> 
                  <p className='font-satoshi-regular'>Graduating Class</p>
                </div>
                <p className='ml-8 font-satoshi-bold'>{user.grad_class}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Verification File */}
      <div className='mt-4 flex-1 flex flex-col'>
        <h2 className='font-satoshi-bold text-xl'>VERIFICATION FILE</h2>
        <div className='border border-disabled mb-4'></div>
        <div className='w-1/2 h-96'>
        {user.verification_file === null ? (
          <h2 className='font-satoshi-regular'>No verification file submitted</h2>
        ) : (
          <img src={user.verification_file} alt="verification file" className="object-cover h-full border" />
        )}
        </div>
      </div>

      {/* Graduation loading */}
      {showVerificationModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="flex flex-col justify-center items-center bg-white p-6 rounded-3xl shadow-lg w-[400px] min-h-[250px]">
            {/* Loading Spinner */}
            {verificationLoading ? (
              <div className='h-full'>
                <CircularLoading />
              </div>
            ) : verifyTransition ? (
              <>
                <div className="text-success">
                  <CheckCircle size={48} />
                </div>
                <p className="text-xl font-satoshi-medium mt-4 text-center">
                  Confirmed verification!
                </p>
                <button
                  className="bg-success text-white px-4 py-2 rounded-3xl w-full mt-6 cursor-pointer"
                  onClick={() => {
                    setShowVerificationModal(false)
                    setVerifyTransition(false)
                    navigate(-1)
                  }}
                >
                  Close
                </button>
              </>
            ) : (
              <div className=''>
                <p className="text-xl font-satoshi-medium text-center mt-4">
                  Are you sure you want to verify this account?
                </p>
                <div className="pt-8 font-satoshi-medium flex gap-3 mt-6 w-ful h-full justify-center">
                  <button
                    className="bg-white text-primary px-4 py-2 rounded-3xl w-25 outline outline-1 outline-primary cursor-pointer"
                    onClick={() => setShowVerificationModal(false)}
                  >
                    Not yet
                  </button>
                  <button
                    className="bg-success text-white px-4 py-2 rounded-3xl w-25 cursor-pointer"
                    onClick={verifyUser}
                  >
                    Verify
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

export default AdminVerificationConfirmation
