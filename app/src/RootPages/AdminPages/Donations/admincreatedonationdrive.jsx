import React, { useState, useEffect } from 'react';
import { MoveLeft, UploadCloud, X, Trash2, Plus, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CircularLoading from '../../../components/LoadingComponents/circularloading';

function AdminCreateDonationDrive() {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target_cost: '',
    support_links: [],
    image: null,
  });
  const [imageName, setImageName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [linkInput, setLinkInput] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [transitionComplete, setTransitionComplete] = useState(false)
  const [createConfirmation, setCreateConfirmation]= useState(false)
  const [createConfirmationLoading, setCreateConfirmationLoading] = useState(false)

  const formatCurrency = (value) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    const parts = numericValue.split('.');
    let formatted = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    if (parts[1]) {
      formatted += '.' + parts[1].slice(0, 2);
    }
    return formatted;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'target_cost') {
      const rawValue = value.replace(/[^0-9.]/g, '');
      setFormData((prev) => ({
        ...prev,
        [name]: rawValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
    setImageName(file ? file.name : null);
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
    setImageName(null);
  };

  const handleAddLink = () => {
    if (linkInput.trim() !== '' && isValidUrl(linkInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        support_links: [...prev.support_links, linkInput.trim()],
      }));
      setLinkInput('');
    } else {
      alert('Please enter a valid URL.');
    }
  };

  const updateLink = (index, newValue) => {
    const updated = [...formData.support_links];
    updated[index] = newValue;
    setFormData((prev) => ({ ...prev, support_links: updated }));
  };

  const removeLink = (index) => {
    const filtered = formData.support_links.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, support_links: filtered }));
  };

  const handleSubmit = async () => {
    setCreateConfirmationLoading(true);
  
    const formToSubmit = new FormData();
    formToSubmit.append('title', formData.title);
    formToSubmit.append('description', formData.description);
    formToSubmit.append('target_cost', parseFloat(formData.target_cost));
    
    formData.support_links.forEach(link => {
      formToSubmit.append('support_links', link);
    });
    
    if (formData.image) {
      formToSubmit.append('image', formData.image);
    }
    
    console.log(formToSubmit)

    try {
      const response = await axios.post(`${API_BASE_URL}/create-donation-drives`, formToSubmit, {
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
  

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    loading ? (
      <CircularLoading />
    ) : (
      <div className="p-6 px-24">
        <button
          className="flex gap-2 mb-3 flex-row items-center cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <MoveLeft className="text-primary" />
          <p className="text-primary font-satoshi-medium text-lg">Back to donations</p>
        </button>

        <h1 className="font-satoshi-bold text-5xl mb-6">Create a Donation</h1>

        <div className="flex flex-col gap-4">
          <div className="border border-gray-400 p-6 rounded-3xl w-full flex flex-row gap-4">
            <div className="flex flex-col flex-1">
              <label className="block mb-1 font-satoshi-medium">
                Title <span className="text-red-600">*</span>
              </label>
              <input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-2xl p-2"
                placeholder=""
              />
            </div>
            <div className="flex flex-col flex-1">
              <label className="block mb-1 font-satoshi-medium">
                Target Amount <span className="text-red-600">*</span>
              </label>
              <div className="flex items-center border border-gray-300 rounded-2xl">
                <span className="pl-2 text-gray-500">₱</span>
                <input
                  type="text"
                  name="target_cost"
                  value={formatCurrency(formData.target_cost)}
                  onChange={handleInputChange}
                  className="w-full border-none outline-none p-2"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
          <div className="h-70 grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-400 rounded-3xl p-6">
            <div className="flex flex-col">
              <label className="block mb-1 font-satoshi-medium">
                Description <span className="text-red-600">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-2xl p-2 h-full resize-none"
                placeholder="Describe your event here..."
              />
            </div>
            <div className="flex flex-col">
              <div className="flex flex-row justify-between">
                <label className="block mb-1 font-satoshi-medium">Image (optional)</label>
                {formData.image === null ? (
                  <></>
                ) : (
                  <div className="flex flex-row gap-1 items-center text-red-700 rounded-3xl hover:bg-gray-100 px-2 py-1 cursor-pointer">
                    <X className="stroke-1" size={20} />
                    <button
                      className="font-satoshi-light text-sm cursor-pointer"
                      onClick={() => {
                        removeImage();
                      }}
                    >
                      Remove Image
                    </button>
                  </div>
                )}
              </div>
              <div className="flex-1 border border-dashed border-gray-300 hover:border-primary rounded-2xl relative overflow-hidden">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  title=""
                  accept="image/*"
                />
                {formData.image === null ? (
                  <div className="flex flex-col items-center justify-center h-full p-4 pointer-events-none z-0">
                    <UploadCloud className="text-primary" />
                    <h2 className="text-gray-500 text-center">Drag and drop file here or</h2>
                    <h2 className="text-primary underline">
                      {imageName === null ? 'choose file' : imageName}
                    </h2>
                  </div>
                ) : (
                  <div className="absolute inset-0 z-0">
                    <img
                      src={URL.createObjectURL(formData.image)}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="p-6 border border-gray-400 rounded-3xl">
            <label className="block mb-1 font-satoshi-medium">Links</label>

            <div className="flex gap-2 w-1/2 mb-4">
              <input
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                className="w-full border border-gray-300 rounded-2xl p-2"
                placeholder="Add a link"
              />
              <button
                type="button"
                onClick={handleAddLink}
                className="bg-primary text-white p-2 rounded-full h-10 w-10 text-xl font-bold flex items-center justify-center cursor-pointer hover:bg-hover"
              >
                <Plus size={24} className="stroke-2" />
              </button>
            </div>

            <div className="space-y-2 w-1/2">
              {formData.support_links.map((link, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={link}
                    onChange={(e) => updateLink(idx, e.target.value)}
                    className="w-full border border-gray-300 rounded-2xl p-2"
                  />
                  <button
                    type="button"
                    onClick={() => removeLink(idx)}
                    className="text-primary border border-gray-300 p-2 rounded-full h-10 w-10 text-xl font-bold flex items-center justify-center cursor-pointer hover:bg-gray-300"
                  >
                    <Trash2 size={24} className="stroke-2" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="text-right">
            <button
              onClick={() => {
                setShowSubmitModal(true);
              }}
              className="bg-primary text-white text-lg px-10 py-3 rounded-2xl cursor-pointer hover:bg-hover"
            >
              {submitLoading ? <CircularLoading /> : 'Submit'}
            </button>
          </div>
        </div>
        {showSubmitModal && (
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
                      setShowSubmitModal(false)
                      setTransitionComplete(false)
                      // window.location.reload()
                      navigate(-1)
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
                      onClick={() => setShowSubmitModal(false)}
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
  );
}

export default AdminCreateDonationDrive;