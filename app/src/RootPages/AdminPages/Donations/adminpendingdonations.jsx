import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MoveLeft, X } from 'lucide-react';
import ExpandedPendingDonations from '../../../components/AdminComponents/expandedpendingdonations';
import axios from 'axios';
import CircularLoading from '../../../components/LoadingComponents/circularloading';
import { motion, AnimatePresence } from 'framer-motion';

function AdminPendingDonations() {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const location = useLocation();
  const [token, setToken] = useState();
  const { driveName } = location.state;
  const [pendingDonations, setPendingDonations] = useState(location.state.pendingDonations || []);

  const [reviewDetailsModal, setReviewDetailsModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verifyTransition, setVerifyTransition] = useState(false);
  const [actionType, setActionType] = useState(null); // "approve" or "disapprove"
  const [showProofModal, setShowProofModal] = useState(false);

  async function verifyDonation() {
    if (!selectedDonation || !token) {
      console.error('Missing donation or token');
      setVerificationLoading(false); 
      alert('Unable to verify donation. Please log in and try again.');
      return;
    }

    setVerificationLoading(true);

    try {
      const endpoint = selectedDonation.type === 'Monetary' ? 'verify-monetary' : 'verify-inkind';
      const choice = actionType === 'approve' ? 'approve' : 'disapprove';
      const url = `${API_BASE_URL}/admin/donations/${endpoint}/${selectedDonation.donation_id}?choice=${choice}`;

      const response = await axios.put(url, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000, // 10-second timeout
      });

      // Update pendingDonations to remove the verified donation
      setPendingDonations((prev) =>
        prev.filter((donation) => donation.donation_id !== selectedDonation.donation_id)
      );
      console.log('Updated donation:', response.data);

      setVerificationLoading(false);
      setVerifyTransition(true);
    } catch (error) {
      let errorMessage = 'Verification failed. Please try again.';
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          errorMessage = 'Unauthorized. Please log in again.';
          // Optionally redirect: navigate('/login');
        } else if (error.response?.status === 404) {
          errorMessage = 'Donation not found.';
        } else if (error.code === 'ECONNABORTED') {
          errorMessage = 'Request timed out. Please check your connection.';
        }
      }
      console.error('Verification error:', error);
      alert(errorMessage); // Replace with a notification library like react-toastify
      setVerificationLoading(false);
      setVerifyTransition(false);
      setActionType(null);
    }
  }

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    if (!storedToken) {
      console.error('No token found');
      alert('Please log in to continue.');
      // Optionally redirect: navigate('/login');
    }
    console.log('Pending donations:', pendingDonations);
  }, [pendingDonations, navigate]);

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
            setSelectedDonation(donation);
            setReviewDetailsModal(true);
          }}
        />
      </div>

      {reviewDetailsModal && selectedDonation && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ x: 0, opacity: 1 }}
            animate={{
              x: showProofModal ? '-40%' : 0,
              opacity: 1,
            }}
            exit={{ x: 0, opacity: 0 }}
            transition={{ type: 'tween', duration: 0.4 }}
            className="flex flex-col items-center bg-white p-6 rounded-3xl shadow-lg min-w-md max-w-lg h-4/5 w-full"
          >
            <div className="flex justify-between w-full items-center pb-2">
              <h2 className="text-2xl font-satoshi-medium text-primary">
                {verificationLoading ? '' : verifyTransition ? 'Done' : 'Review Donation'}
              </h2>
              <button
                className='rounded-full h-fit bg-error p-1 cursor-pointer'
                onClick={() => {
                  setReviewDetailsModal(false);
                  setVerifyTransition(false);
                  setVerificationLoading(false);
                  setShowProofModal(false);
                  setActionType(null);
                }}
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

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
                    setReviewDetailsModal(false);
                    setVerifyTransition(false);
                  }}
                >
                  Close
                </button>
              </div>
            ) : actionType ? (
              <div className="flex flex-col flex-1 justify-center items-center w-full text-center h-full">
                <p className="text-xl font-satoshi-medium my-70 cursor-default">Confirm {actionType} of this donation?</p>
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
                <div className='bg-primary h-1/3 w-full rounded-xl flex justify-center items-center text-white'>
                  {selectedDonation.type === 'Monetary' && (
                    <img
                      src={selectedDonation.proof}
                      alt="proof of donation"
                      className='h-full w-full object-cover'
                    />
                  )}
                </div>

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

                {selectedDonation.type !== 'Monetary' ? (
                  <div className="flex flex-row w-full gap-2 text-white font-satoshi-regular mt-4">
                    <button
                      className="bg-error rounded-3xl w-1/2 py-3 cursor-pointer hover:bg-red-400"
                      onClick={() => setActionType('disapprove')}
                    >
                      <p>Disapprove</p>
                    </button>
                    <button
                      className="bg-primary rounded-3xl w-1/2 py-3 cursor-pointer hover:bg-hover"
                      onClick={() => setActionType('approve')}
                    >
                      <p>Approve</p>
                    </button>
                  </div>
                ) : (
                  <button
                    className='bg-primary text-white rounded-3xl w-1/2 py-3 cursor-pointer hover:bg-red-400'
                    onClick={() => setShowProofModal(true)}
                  >
                    <p>Proof of Payment</p>
                  </button>
                )}

                <AnimatePresence>
                  {showProofModal && selectedDonation && (
                    <motion.div
                      className="fixed inset-0 -z-50 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.div
                        initial={{ x: 0 }}
                        animate={{ x: 520 }}
                        exit={{ x: 0 }}
                        transition={{ type: 'tween', duration: 0.4 }}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-2xl rounded-3xl w-[180%] max-w-lg -z-50 p-6 h-full"
                      >
                        {actionType ? (
                          <div className="flex flex-col flex-1 justify-center items-center w-full text-center h-full">
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
                          <div className="w-full h-full flex flex-col">
                            <div className="flex justify-between items-center border-b pb-3">
                              <h2 className="text-xl font-satoshi-bold text-primary">Proof of Payment</h2>
                              <button
                                className="rounded-full h-fit bg-error p-1 cursor-pointer"
                                onClick={() => setShowProofModal(false)}
                              >
                                <X className="w-5 h-5 text-white" />
                              </button>
                            </div>

                            <div className="flex w-full justify-center h-3/4">
                              <div className="bg-primary h-full w-full rounded-xl flex justify-center items-center text-white mt-5">
                                {selectedDonation.type === "Monetary" && (
                                  <img
                                    src={selectedDonation.proof}
                                    alt="proof of donation"
                                    className="h-full w-full object-cover rounded-xl"
                                  />
                                )}
                              </div>
                            </div>

                            <div className="flex flex-row w-full gap-2 text-white font-satoshi-regular mt-10">
                              <button
                                className="bg-error rounded-3xl w-1/2 py-3 cursor-pointer hover:bg-red-400"
                                onClick={() => setActionType("disapprove")}
                              >
                                <p>Disapprove</p>
                              </button>
                              <button
                                className="bg-primary rounded-3xl w-1/2 py-3 cursor-pointer hover:bg-hover"
                                onClick={() => setActionType("approve")}
                              >
                                <p>Approve</p>
                              </button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default AdminPendingDonations;