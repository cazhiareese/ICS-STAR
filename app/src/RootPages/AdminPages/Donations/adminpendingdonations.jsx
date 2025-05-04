import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { MoveLeft, X } from 'lucide-react'
import ExpandedPendingDonations from '../../../components/AdminComponents/expandedpendingdonations'
import axios from 'axios'
import CircularLoading from '../../../components/LoadingComponents/circularloading'

function AdminPendingDonations() {
  const navigate = useNavigate()
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const location = useLocation()
  const [token, setToken] = useState()
  // const { driveid } = useParams()
  const { pendingDonations, driveName } = location.state

  const [reviewDetailsModal, setReviewDetailsModal] = useState(false)
  const [selectedDonation, setSelectedDonation] = useState(null)
  const [verificationLoading, setVerificationLoading] = useState(false)
  const [verifyTransition, setVerifyTransition] = useState(false)
  const [actionType, setActionType] = useState(null) // "approve" or "disapprove"

  async function verifyDonation() {
    if (!selectedDonation) return
    setVerificationLoading(true)

    try {
      const endpoint = selectedDonation.donation_type === 'Monetary'
        ? 'verify-monetary'
        : 'verify-inkind'

      const choice = actionType === 'approve' ? 'approve' : 'disapprove'
      const url = `${API_BASE_URL}/admin/donations/${endpoint}/${selectedDonation.donation_id}?choice=${choice}`

      await axios.post(url, {headers: {Authorization: `Bearer ${token}`}})

      setVerificationLoading(false)
      setVerifyTransition(true)
    } catch (error) {
      console.error('Verification failed:', error)
      setVerificationLoading(false)
      setVerifyTransition(false)
      setActionType(null)
    }
  }

  useEffect(() => {
    setToken(localStorage.getItem('token'))
    console.log(pendingDonations)
  }, [pendingDonations])

  return (
    <div className='flex flex-col lg:p-6 h-screen overflow-hidden max-w-7xl mx-auto'>
      <button className="flex gap-2 mb-3 flex-row items-center cursor-pointer" onClick={() => navigate(-1)}>
        <MoveLeft className='text-primary' />
        <p className='text-primary font-satoshi-medium text-lg'>Back to Donations List</p>
      </button>

      <h1 className='text-primary text-5xl font-satoshi-bold'>{driveName}</h1>
      <h2 className='text-black text-3xl font-satoshi-medium mb-10'>Pending Verifications</h2>

      <div className='border border-gray-300 rounded-2xl h-full overflow-auto bg-white'>
        <ExpandedPendingDonations
          data={pendingDonations}
          onReview={(donation) => {
            setSelectedDonation(donation)
            setReviewDetailsModal(true)
          }}
        />
      </div>

      {/* Unified Modal */}
      {reviewDetailsModal && selectedDonation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="flex flex-col items-center bg-white p-6 rounded-3xl shadow-lg min-w-md max-w-lg h-4/5 w-full">
            {/* Header */}
            <div className="flex justify-between w-full items-center pb-2">
              <h2 className="text-2xl font-satoshi-medium text-primary">
                {verificationLoading ? '' : verifyTransition ? 'Done' : 'Review Donation'}
              </h2>
              <button
                className='rounded-full h-fit bg-error p-1 cursor-pointer'
                onClick={() => {
                  setReviewDetailsModal(false)
                  setVerifyTransition(false)
                  setVerificationLoading(false)
                }}
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Content switching */}
            {verificationLoading ? (
              <div className="flex-1 flex items-center justify-center w-full">
                <CircularLoading />
              </div>
            ) : verifyTransition ? (
              <div className="flex flex-col flex-1 justify-center items-center w-full text-center">
                <p className="text-success text-xl font-satoshi-medium">
                  Donation {actionType === 'approve' ? 'approved' : 'disapproved'}!
                </p>
                <button
                  className="bg-success text-white px-4 py-2 rounded-3xl w-full mt-6 cursor-pointer"
                  onClick={() => {
                    setReviewDetailsModal(false)
                    setVerifyTransition(false)
                  }}
                >
                  Close
                </button>
              </div>
            ) : actionType ? (
              <div className="flex flex-col flex-1 justify-center items-center w-full text-center">
                <p className="text-xl font-satoshi-medium mt-4">Confirm {actionType}?</p>
                <div className="flex gap-3 mt-6 w-full justify-center">
                  <button
                    className="bg-gray-300 text-black px-4 py-2 rounded-3xl w-full cursor-pointer"
                    onClick={() => setActionType(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-success text-white px-4 py-2 rounded-3xl w-full cursor-pointer"
                    onClick={verifyDonation}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Proof of Payment */}
                <div className='bg-primary h-1/3 w-full rounded-xl flex justify-center items-center text-white'>
                {selectedDonation.type === 'Monetary' &&
                  <img src={selectedDonation.proof} alt="proof of donation" className='h-full w-full object-cover' />
                }
                </div>

                {/* Donation Info */}
                <div className='w-full h-full flex flex-col flex-1 px-10 text-xl items-center justify-center'>
                  <div className='flex justify-between w-full'>
                    <p className='font-satoshi-light'>Donor: </p>
                    <p className='font-satoshi-medium'>{selectedDonation.name}</p>
                  </div>
                  <div className='flex justify-between w-full'>
                    <p className='font-satoshi-light'>Donation Type: </p>
                    <p className='font-satoshi-medium'>{selectedDonation.type}</p>
                  </div>
                  <div className='flex justify-between w-full'>
                    <p className='font-satoshi-light'>Donation Description: </p>
                    <p className='font-satoshi-medium'>{selectedDonation.donation_details}</p>
                  </div>
                  <div className='flex justify-between w-full'>
                    <p className='font-satoshi-light'>Date Donated: </p>
                    <p className='font-satoshi-medium'>{selectedDonation.donation_date}</p>
                  </div>
                  <div className='flex justify-between w-full'>
                    <p className='font-satoshi-light'>Time Donated: </p>
                    <p className='font-satoshi-medium'>{selectedDonation.donation_time}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className='flex flex-row w-full gap-2 text-white font-satoshi-regular'>
                  <button
                    className='bg-error rounded-3xl w-1/2 py-3 cursor-pointer hover:bg-red-400'
                    onClick={() => setActionType("disapprove")}
                  >
                    <p>Disapprove</p>
                  </button>
                  <button
                    className='bg-primary rounded-3xl w-1/2 py-3 cursor-pointer hover:bg-hover'
                    onClick={() => setActionType("approve")}
                  >
                    <p>Approve</p>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPendingDonations