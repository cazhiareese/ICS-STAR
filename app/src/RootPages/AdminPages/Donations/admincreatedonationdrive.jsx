import React, { useRef, useState } from 'react'
import { MoveLeft, Plus, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import CircularLoading from '../../../components/LoadingComponents/circularloading'

function AdminCreateDonationDrive() {
  const navigate = useNavigate()

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState('');
  const [transitionComplete, setTransitionComplete] = useState(false)
  const [createConfirmation, setCreateConfirmation]= useState(false)
  const [createConfirmationLoading, setCreateConfirmationLoading] = useState(false)

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFileName(file.name);
    else setFileName('');
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [image, setImage] = useState(null);
  const [supportingLinks, setSupportingLinks] = useState('');
  const [createLoading, setCreateLoading] = useState(false)

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleTargetAmountChange = (e) => setTargetAmount(e.target.value);
  const handleSupportingLinksChange = (e) => setSupportingLinks(e.target.value);
  
  const handleSubmit = async (e) => {
    setCreateConfirmationLoading(true);
  
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('target_cost', parseFloat(targetAmount));
  
    if (supportingLinks) {
      supportingLinks.split(',').forEach(link => {
        formData.append('support_links', link.trim());
      });
    }
  
    if (image) {
      formData.append('image', image);
    }
  
    try {
      const response = await axios.post(`${API_BASE_URL}/create-donation-drives`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
  
      console.log(response);
      setTransitionComplete(true); // show success checkmark
    } catch (error) {
      console.error('Error:', error);
      alert("Something went wrong!");
      setCreateConfirmation(false); // close modal on error
    } finally {
      setCreateConfirmationLoading(false);
    }
  };
  
  return (
    <div className='p-6'>
    {/* Back */}
      <button className="flex gap-2 mb-3 flex-row items-center cursor-pointer" onClick={() => navigate(-1)}>
        <MoveLeft className='text-primary'/> 
        <p className='text-primary font-satoshi-medium text-lg'>Back to Donations List</p>
      </button>
      <h1 className='font-satoshi-bold text-4xl'>Create Donation Drive</h1>
      <form action="" className="w-1/2 space-y-4 p-4" onSubmit={handleSubmit}>
      {/* Title */}
        <div>
          <label htmlFor="donationTitle" className="block mb-1 font-satoshi-medium">Title</label>
          <input
            type="text"
            id="donationTitle"
            value={title}
            onChange={handleTitleChange}
            className="border rounded-3xl p-3 w-full border-gray-300"
            placeholder="Enter title of Donation Drive"
          />
        </div>
        {/* Description */}
        <div>
          <label htmlFor="donationDescription" className="block mb-1 font-satoshi-medium">Description</label>
          <textarea
            id="donationDescription"
            value={description}
            onChange={handleDescriptionChange}
            className="border border-gray-300 rounded-3xl p-3 w-full resize-none"
            placeholder="Enter description of Donation Drive"
            rows={10}
          />
        </div>
        {/* Target Amount */}
        <div>
          <label htmlFor="targetAmount" className="block mb-1 font-satoshi-medium">Target Amount</label>
          <input
            type="text"
            id="targetAmount"
            value={targetAmount}
            onChange={handleTargetAmountChange}
            className="border rounded-3xl p-3 w-full border-gray-300"
            placeholder="Starting Goal"
          />
        </div>
        {/* Image select */}
        <div>
          <label className="block mb-1 font-satoshi-medium">Supporting Image</label>
          <button
            type="button"
            onClick={triggerFileSelect}
            className="border rounded-3xl p-3 w-full h-64 border-gray-300 cursor-pointer"
          >
            Drag and drop image here or <span className="text-primary">Choose image</span>
          </button>
          {fileName && (
            <p className="mt-2 text-sm text-gray-600">Selected: {fileName}</p>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        {/* Supporting Links */}
        <div>
          <label htmlFor="supportingLinks" className="block mb-1 font-satoshi-medium">Supporting Links</label>
          <input
            type="text"
            id="supportingLinks"
            value={supportingLinks}
            onChange={handleSupportingLinksChange}
            className="border rounded-3xl p-3 w-full border-gray-300"
            placeholder="Enter Supporting Links"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="bg-primary font-satoshi-medium text-white p-4 rounded-2xl hover:bg-secondary hover:text-primary cursor-pointer"
            onClick={() => setCreateConfirmation(true)}
          >
            Create Donation Drive
          </button>
        </div>
      </form>
      {createConfirmation && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
            <div className="flex flex-col justify-center items-center bg-white p-6 rounded-3xl shadow-lg w-[400px] min-h-[250px]">
              {/* Loading Spinner */}
              {createConfirmationLoading ? (
                <div className='h-full'>
                  <CircularLoading />
                </div>
              ) : transitionComplete ? (
                <>
                  <div className="text-success">
                    <CheckCircle size={48} />
                  </div>
                  <p className="text-xl font-satoshi-medium mt-4 text-center">
                    Successfully created donation drive!
                  </p>
                  <button
                    className="bg-success text-white px-4 py-2 rounded-3xl w-full mt-6 cursor-pointer"
                    onClick={() => {
                      setCreateConfirmation(false)
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
                    Are you sure you want to create this donation drive?
                  </p>
                  <div className="flex gap-3 mt-6 w-full h-full justify-center">
                    <button
                      className="border border-gray-300 px-4 py-2 rounded-3xl w-full cursor-pointer text-gray-300"
                      onClick={() => setCreateConfirmation(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-success text-white px-4 py-2 rounded-3xl w-full cursor-pointer"
                      onClick={handleSubmit}
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
}

export default AdminCreateDonationDrive
