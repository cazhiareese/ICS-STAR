import React, {useState, useEffect, useRef} from 'react'
import { MoveLeft, X, Link, MoveRight, Pencil, Check } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import VerifiedDonationsTable from "../../../components/AdminComponents/verifieddonationstable"
import PendingDonationsTable from '../../../components/AdminComponents/pendingdonationstable';
import axios from 'axios';
import CircularLoading from '../../../components/LoadingComponents/circularloading';
import PaginationComponent from '../../../components/AdminComponents/PaginationComponent'
import AdminBack from '../../../components/AdminComponents/AdminBack';

function AdminDonationInformation() {
  const navigate = useNavigate()
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const {driveid} = useParams();
  const [token, setToken] = useState(null)

  const [progressData, setProgressData] = useState([]);

  const [pendingDonations, setPendingDonations] = useState([])
  const [verifiedDonations, setVerifiedDonations] = useState([])
  const [viewDetailsModal, setViewDetailsModal] = useState(false) 
  const [closeDonation, setCloseDonation] = useState(false)
  const [closeDonationLoading, setCloseDonationLoading] = useState(false)
  const [transitionComplete, setTransitionComplete] = useState(false)
  const [noPendingDonations, setNoPendingDonations] = useState()
  const [donation, setDonation] = useState()
  const [loading, setLoading] = useState(true)
  const [pendingDonationLoading, setPendingDonationLoading] = useState(true)
  const [pendingPage, setPendingPage] = useState(1)
  const [totalPendingPages, setTotalPendingPages] = useState(1)
  const [verifiedDonationLoading, setVerifiedDonationLoading] = useState(true)
  const [verifiedPage, setVerifiedPage] = useState(1)
  const [totalVerifiedPages, setTotalVerifiedPages] = useState(1)
  const [pendingMonetaryTotal, setPendingMonetaryTotal] = useState(null)
  const [pendingInKindTotal, setPendingInKindTotal] = useState(null)
  const [editGoalModal, setEditGoalModal] = useState(false);
  const [newGoal, setNewGoal] = useState('');
  const editButtonRef = useRef(null);
  const [editing, setEditing] = useState(false);
  const [description, setDescription] = useState(donation?.description || '');
  const [links, setLinks] = useState(donation?.links || []);

  useEffect(() => {
    if (donation) {
      setDescription(donation.description || '');
      setLinks(donation.links || []);
    }
  }, [donation]);

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("description", description);
  
    if (links && links.length > 0) {
      links.forEach((link) => {
        formData.append("support_links", link);
      });
    }
  
    try {
      await axios.put(`${API_BASE_URL}/edit-donation-drive/description-links/${driveid}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setDonation({ ...donation, description, links });
      setEditing(false);
    } catch (error) {
      console.error("Failed to update donation:", error);
    }
  };

  // Handle cancel editing
  const handleCancel = () => {
    setDescription(donation.description || '');
    setLinks(donation.links || []);
    setEditing(false);
  };

  // Add a new link input field
  const addLink = () => {
    setLinks([...links, '']);
  };

  // Update a link at a specific index
  const updateLink = (index, value) => {
    const updatedLinks = [...links];
    updatedLinks[index] = value;
    setLinks(updatedLinks);
  };

  // Remove a link at a specific index
  const removeLink = (index) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  // Inside your component:
const textareaRef = useRef(null);

  // Adjust textarea height based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [description]);

  async function handleUpdateGoal() {
    const formData = new FormData();
    formData.append("goal", parseFloat(newGoal));
  
    try {
      const response = await axios.put(
        `${API_BASE_URL}/edit-donation-drive/goal/${driveid}`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );
      setEditGoalModal(false);
      setNewGoal('');
      fetchData();
      alert(response.data.message); // Success message
    } catch (error) {
      console.error("Failed to update donation goal:", error);
      alert("Failed to update goal: " + (error.response?.data?.detail || error.message));
    }
  }

  async function handleCloseDrive() {
    setCloseDonationLoading(true)
  
    try {
      await axios.post(`${API_BASE_URL}/admin/donations/close-drive/${driveid}`, {headers: { Authorization: `Bearer ${token}` }})
      // console.log(response)
  
      // Show success message
      setCloseDonationLoading(false)
      setTransitionComplete(true)
      window.location.reload()
    } catch (error) {
      console.error("Failed to close donation drive", error)
    }
  }

  async function fetchData() {
    setLoading(true)

    try {
      const donationResponse = await axios.get(`${API_BASE_URL}/admin/donations/view/${driveid}`, {headers: { Authorization: `Bearer ${token}` }})
      // console.log(donationResponse.data)   
      setDonation(donationResponse.data)

      const percentResponse = await axios.get(`${API_BASE_URL}/admin/donations/percent-funded/${driveid}`, {headers: { Authorization: `Bearer ${token}` }})
      setProgressData([
        { name: "progress", value: percentResponse.data.percent_funded },
        { name: "remaining", value: percentResponse.data.remaining_percent }
      ])

    } catch (error) {
      console.error("Failed to fetch donation data", error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchNextVerifiedPage() {
    setVerifiedDonationLoading(true)
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/donations/get-all-verified-donations/${driveid}?page=${verifiedPage}&page_size=10`, {headers: { Authorization: `Bearer ${token}` }})
      // console.log(response)
      setTotalVerifiedPages(response.data.total_pages)
      setVerifiedDonations(response.data.data)
    } catch (error) {
      console.log(error)
    } finally {
      setVerifiedDonationLoading(false)
    }
  }

  async function fetchNextPendingPage() {
    setPendingDonationLoading(true)
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/donations/get-all-pending-donations/${driveid}?page${pendingPage}1&page_size=5`, {headers: { Authorization: `Bearer ${token}` }})
      console.log(response)
      setTotalPendingPages(response.data.total_pages)
      setPendingDonations(response.data.data)
      setPendingMonetaryTotal(response.data.monetary_total)
      setPendingInKindTotal(response.data.inkind_total)
      setNoPendingDonations(response.data.data.length === 0 ? true : false)
    } catch (error) {
      console.log(error)
    } finally {
      setPendingDonationLoading(false)
    }
  }

  useEffect(() => {
    fetchNextVerifiedPage()
  }, [verifiedPage])

  useEffect(() => {
    fetchNextPendingPage()

  }, [pendingPage])


  useEffect(() => {
    setToken(localStorage.getItem('token'))
    fetchNextPendingPage()
    fetchNextVerifiedPage()
    fetchData()
  }, [])
  

  const COLORS = [
    progressData[0]?.value > 100 ? '#27AE60' : '#0B2B8C',
    '#F4F4F4',
  ];

  return (
    <div className='flex flex-col lg:p-6 overflow-auto max-w-7xl mx-auto min-h-screen bg-gray-100'>
      {loading ? (
        <div className='flex h-screen w-full items-center justify-center'>
          <CircularLoading/>
        </div>
      ) : (
        <>
        {/* Back */}
        <AdminBack label={'Back to Donations List'}/>
          {/* Donation name and tag */}
          <div className='flex flex-row justify-between mb-5'>
            <div className='flex flex-row gap-2'>
              <h1 className='font-satoshi-bold text-primary text-4xl'>{donation.title}</h1>
              {/* Open or closed button */}
              {donation.is_closed ? (
                <div className='bg-red-100 px-7 py-1 rounded-3xl flex items-center h-fit place-self-end'> 
                <p className='text-error font-satoshi-medium text-sm'>Closed</p>
              </div>          ) : (
                <div className='bg-green-100 px-7 py-1 rounded-3xl flex items-center h-fit place-self-end'> 
                  <p className='text-success font-satoshi-medium text-sm'>Open</p>
                </div>
              )}
            </div>
            {/* Generate Report or close drive */}
            <div className='h-fit gap-5 flex flex-row'>
              {donation.is_closed ? (
                // For closed
                <>
                  {/* View Details */}
                  <button className='bg-primary text-white px-7 py-2 shadow-lg rounded-2xl hover:bg-hover cursor-pointer' onClick={() => {setViewDetailsModal(true)}}>
                    <p className='font-satoshi-light'>View Details</p>
                  </button>
                  {/* Export Donor List */}
                  <button className='bg-primary hover:bg-hover text-white px-7 py-2 shadow-lg rounded-2xl cursor-pointer'>
                    <p className='font-satoshi-light'>Export Donor List</p>
                  </button>
                </>          
              ) : (
                // For open
                <>
                  {/* View Statistics */}
                  <button className='bg-primary text-white px-7 py-2 shadow-lg rounded-2xl cursor-pointer hover:bg-hover' onClick={() => {navigate(`/admin/donations/donation-drive-demographics/${driveid}`)}}>
                    <p className='font-satoshi-light'>View Statistics</p>
                  </button>
                  {/* Close Drive */}
                  <button
                    className='bg-error hover:bg-red-400 text-white px-7 py-2 shadow-lg rounded-2xl cursor-pointer'
                    onClick={() => {setCloseDonation(true)}}
                  >
                    <p className='font-satoshi-light'>Close Drive</p>
                  </button>
                </>
              )}
            </div>
          </div>
          {/* Goal progress and recent transactions */}
          <div className='flex flex-row gap-2 mb-4 h-80'>
            {/* Goal Progress */}
            <div className="relative flex flex-col items-center justify-center flex-1/3 pb-10 border border-gray-300 rounded-xl h-full bg-white">
              {/* Edit Goal Button */}
              <div className="w-full flex flex-row justify-end mb-2 mt-2">
                <button
                  ref={editButtonRef}
                  className="flex flex-row items-center px-4 py-2 bg-primary shadow-lg rounded-xl text-white mr-2 font-satoshi-regular hover:bg-hover cursor-pointer"
                  onClick={() => setEditGoalModal(!editGoalModal)}
                >
                  Edit Goal
                </button>
              </div>
              {/* Edit Goal Modal */}
              {editGoalModal && (
                <div className="absolute top-16 right-2 bg-white shadow-lg rounded-xl p-4 z-10 flex items-center gap-2 border border-gray-300">
                  <label className="text-sm font-satoshi-medium text-gray-700">Enter new goal:</label>
                  <div className="flex items-center border border-gray-300 rounded-lg px-2 py-1">
                    <span className="text-gray-500 mr-1">₱</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={newGoal}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || (e.target.validity.valid && parseFloat(value) >= 0)) {
                          setNewGoal(value);
                        }
                      }}
                      className="w-24 outline-none text-sm font-satoshi-regular"
                      placeholder="10,000"
                    />
                  </div>
                  <button
                    onClick={handleUpdateGoal}
                    className="bg-success text-white p-1 rounded-full hover:bg-green-400 cursor-pointer"
                  >
                    <Check size={16} />
                  </button>
                </div>
              )}
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={progressData}
                    startAngle={180}
                    endAngle={0}
                    cx="50%"
                    cy="70%"
                    innerRadius="100%"
                    outerRadius="130%"
                    dataKey="value"
                  >
                    {progressData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="text-center -mt-38">
                <p className="text-sm text-gray-500 font-satoshi-medium">Goal Progress</p>
                <p className="text-6xl font-bold text-[#1F2A63] font-satoshi-bold">
                  {progressData[0]?.value ?? 0}%
                </p>
              </div>
            </div>
            {/* Pending donations table */}
              <div className='flex-2/3 border border-gray-300 rounded-xl p-6 w-full flex flex-col h-full bg-white'>
                <div className='flex flex-row justify-between'>
                  <h2 className='font-satoshi-medium text-black text-2xl'>Pending Verification</h2>
                  {noPendingDonations ? (
                    <></>
                  ) : (
                    <PaginationComponent
                      page={pendingPage}
                      setPage={setPendingPage}
                      totalPages={totalPendingPages}
                    />
                  )}
                </div>
                <div className='w-full h-full flex-1 overflow-auto'>
                  {noPendingDonations ? (
                    <p className='text-center text-gray-500'>No donations to verify</p>
                ) : (
                  <>
                  <PendingDonationsTable data={pendingDonations} loading={pendingDonationLoading}/>
                  </>
                )} 
              </div>
              {noPendingDonations ? (
                <></>
              ) : (
                <div className='flex flex-row justify-between'>
                  <div className='flex flex-row gap-5 flex-1'>
                    <h3 className='font-satoshi-light'>Monetary Total: <span className='text-primary'>{pendingMonetaryTotal}</span></h3>
                    <h3 className='font-satoshi-light'>In-Kind Total: <span classname='text-primary'>{pendingInKindTotal}</span></h3>
                  </div>
                  <button className='flex gap-2 w-full flex-1 text-primary hover:text-hover transition-colors cursor-pointer justify-end items-center' onClick={() => {
                    navigate(`/admin/donations/pending-donations/${driveid}`, 
                      {state: {pendingDonations, driveName: donation.title}})
                    }}>
                    <p className='font-satoshi-light'> View all pending verifications </p>
                    <MoveRight className='stroke-1'/>
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="border border-gray-300 rounded-xl p-4 mb-3 bg-white">
            {/* Description Section */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-satoshi-medium mb-2">Description</h2>
              {editing ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="bg-green-500 text-white p-1 rounded-full hover:bg-green-600"
                  >
                    <Check size={20} />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <button className='hover:text-hover cursor-pointer' onClick={() => setEditing(true)}>
                  <Pencil />
                </button>
              )}
            </div>
            {editing ? (
              <textarea
                ref={textareaRef}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-satoshi-light resize-none"
                rows={1}
                style={{ lineHeight: '1.25rem' }} // Match font-satoshi-light line height
              />
            ) : (
              <p className="font-satoshi-light">{donation?.description}</p>
            )}
            <h2 className="text-lg font-satoshi-medium mt-4">Relevant Links</h2>
            <div className="border-b border-gray-300 mb-1" />
            {editing ? (
              <div className="flex flex-col gap-2">
                {links.map((link, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={link}
                      onChange={(e) => updateLink(index, e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter link"
                    />
                    <button
                      onClick={() => removeLink(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addLink}
                  className="text-primary hover:text-hover font-satoshi-medium text-sm cursor-pointer"
                >
                  + Add Link
                </button>
              </div>
            ) : (
              donation?.links?.map((link, index) => (
                <div
                  key={index}
                  className="flex flex-row gap-2 items-center text-primary hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded w-fit"
                >
                  <Link size={16} />
                  <a
                    className="font-satoshi-light text-md hover:text-hover"
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link}
                  </a>
                </div>
              ))
            )}
          </div>
          {/* Donations and filters */}
          <div className='flex flex-row justify-between mb-3'>
            <div className='flex items-end'>
              <h2 className='text-4xl font-satoshi-bold'>Donations</h2>
              <p className='text-lg font-satoshi-light'>/Verified</p>
            </div>
            <PaginationComponent
              page={verifiedPage}
              setPage={setVerifiedPage}
              totalPages={totalVerifiedPages}
            />
          </div>
          {/* Verified Donations Table */}
          <div className='border border-gray-300 rounded-xl p-6 hidden h-fit lg:block bg-white'>
            <VerifiedDonationsTable data={verifiedDonations} loading={verifiedDonationLoading}/>
          </div>
          {/* View Details Modal */}
          {viewDetailsModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
                <div className="flex flex-col items-center bg-white p-6 rounded-3xl shadow-lg min-w-md max-w-lg h-4/5">
                  {/* Modal Header */}
                  <div className="flex justify-between w-full items-center pb-2">
                    <h2 className="text-2xl font-satoshi-medium">Donation Details</h2>
                    <button className='rounded-full h-fit bg-error p-1 cursor-pointer' onClick={() => {setViewDetailsModal(false)}}>
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>
                  {/* Image */}
                  <div className="bg-primary h-1/3 w-full rounded-xl overflow-hidden">
                    <img
                      src={donation.image}
                      alt="Donation image"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className='mb-5 flex flex-col w-full'>
                    <h1 className='font-satoshi-bold text-2xl'>{donation.title}</h1>
                    <p className='font-satoshi-light '>Date Started: {donation.created_at}</p>
                  </div>
                  <div className='flex flex-col w-full'>
                    <h2 className='font-satoshi-light text-sm'>Description</h2>
                    <p className='font-satoshi-regular text-sm'>
                      {donation.description}
                    </p>
                  </div>

                  {/* Links */}
                  <div className='w-full mt-2'>
                    <h2>Relevant Links</h2>
                    <div className='border border-t-gray-300'></div>
                    {/* Iterate over links */}
                    <div className="ml-6 flex gap-2 overflow-auto flex-col">
                      {donation.relevant_links?.map((link, index) => (
                        <a
                          key={index}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className='text-primary text-sm break-all'
                        >
                          {link}
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  {/* <button className="mt-4 bg-primary text-white px-4 py-2 rounded-3xl w-full cursor-pointer" onClick={() => {}}>
                    Limit Account Access
                  </button> */}
                </div>
              </div>
            )}
            {/* Close Donation Confirmatino Modal */}
            {closeDonation && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
                <div className="flex flex-col justify-center items-center bg-white p-6 rounded-3xl shadow-lg w-[400px] min-h-[250px]">
                  {closeDonationLoading ? (
                    <div className="h-full">
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
                          setCloseDonation(false)
                          setTransitionComplete(false)
                        }}
                      >
                        Close
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-xl font-satoshi-medium text-center mt-4">
                        Are you sure you want to close this donation drive?
                      </p>
                      <div className="flex gap-3 mt-6 w-full h-full justify-center">
                        <button
                          className="border border-gray-300 px-4 py-2 rounded-3xl w-full cursor-pointer text-gray-400"
                          onClick={() => setCloseDonation(false)}
                        >
                          Cancel
                        </button>
                        <button
                          className="bg-error text-white px-4 py-2 rounded-3xl w-full cursor-pointer"
                          onClick={() => handleCloseDrive()}
                        >
                          Confirm
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
        </>
      )}
    </div>
  )
}

export default AdminDonationInformation