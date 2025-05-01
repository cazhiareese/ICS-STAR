import { React, useEffect, useState } from 'react'
import { MoveLeft, Check, IdCard, GraduationCap, Download } from 'lucide-react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import CircularLoading from '../../../components/LoadingComponents/circularloading';
import { CheckCircle } from 'lucide-react';

function AdminVerificationConfirmation() {
  const navigate = useNavigate()

  const [user, setUser] = useState({})
  const [fileType, setFileType] = useState(null)
  const [error, setError] = useState(null)
  const [pdfFileUrl, setPdfFileUrl] = useState(null)

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
        setUser(userProfile.data)
        if (userProfile.data.verification_file) {
          const extension = userProfile.data.verification_file.split('.').pop().toLowerCase()
          setFileType(extension === 'pdf' ? 'pdf' : 'image')
          if (extension === 'pdf') {
            // Fetch PDF as blob
            const response = await axios.get(userProfile.data.verification_file, {
              responseType: 'blob'
            })
            // Create a File object from the blob
            const pdfBlob = new Blob([response.data], { type: 'application/pdf' })
            const fileUrl = URL.createObjectURL(pdfBlob)
            setPdfFileUrl(fileUrl)
          }
        }
      } catch (error) {
        console.error('Error fetching user or file:', error)
        setError('Failed to load verification file. Please try downloading.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [userid])

  useEffect(() => {
    // Clean up the object URL when component unmounts
    return () => {
      if (pdfFileUrl) {
        URL.revokeObjectURL(pdfFileUrl)
      }
    }
  }, [pdfFileUrl])

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

  const handleDownload = () => {
    if (!pdfFileUrl) return
    const link = document.createElement('a')
    link.href = pdfFileUrl
    link.download = 'verification_file.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
        <div className="items-baseline gap-2 hidden lg:flex">
          <h1 className='text-primary font-satoshi-bold text-5xl'>Records</h1>
          <p className='font-satoshi-light text-lg text-gray-500'>/ Pending Verifications</p>
        </div>
        <button className='flex items-center bg-success text-white text-md font-satoshi-medium gap-2 rounded-3xl px-4 py-1 cursor-pointer hover:bg-green-400' onClick={() => {setShowVerificationModal(true)}}>
          <Check className=''/>
          <p>Confirm Verification</p>
        </button>
      </div>
      <div className='w-full p-6 mt-10 flex flex-col'>
        <div className='flex'>
          <div className='bg-primary rounded-full h-30 w-30'>
            <img src={user.image} alt='' className='object-contain w-full' />
          </div>
          <div className='flex flex-col justify-between ml-6'>
            <div>
              <p className='font-satoshi-bold text-3xl'>{user.name || 'N/A'}</p>
              <p className='font-satoshi-light'>{user.email || 'N/A'}</p>
            </div>
            <div className='flex flex-row'>
              <div className='flex flex-col'>
                <div className='flex flex-row gap-2'>
                  <IdCard/>
                  <p className='font-satoshi-regular'>Student Number</p>
                </div>
                <p className='ml-8 font-satoshi-bold'>{user.student_number || 'N/A'}</p>
              </div>
              <div className='flex flex-col ml-20'>
                <div className='flex flex-row gap-2'>
                  <GraduationCap/>
                  <p className='font-satoshi-regular'>Graduating Class</p>
                </div>
                <p className='ml-8 font-satoshi-bold'>{user.grad_class || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='mt-4 flex-1 flex flex-col'>
        <h2 className='font-satoshi-bold text-xl'>VERIFICATION FILE</h2>
        <div className='border border-disabled mb-4'></div>
        <div className='w-1/2 h-96 '>
          {error ? (
            <p className='font-satoshi-regular text-red-500'>{error}</p>
          ) : user.verification_file === null ? (
            <h2 className='font-satoshi-regular'>No verification file submitted</h2>
          ) : fileType === 'pdf' ? (
            <div className='flex flex-col '>
              <button
                onClick={handleDownload}
                disabled={!pdfFileUrl}
                className='bg-primary flex flex-row items-center justify-center gap-2 text-white font-satoshi-regular h-fit w-fit px-4 py-2 rounded-3xl cursor-pointer hover:bg-hover disabled:opacity-50'
              >
                <Download/>
                Download PDF
              </button>
            </div>
          ) : (
            <img src={user.verification_file} alt="verification file" className="object-cover h-full border" />
          )}
        </div>
      </div>
      {showVerificationModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="flex flex-col justify-center items-center bg-white p-6 rounded-3xl shadow-lg w-[400px] min-h-[250px]">
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