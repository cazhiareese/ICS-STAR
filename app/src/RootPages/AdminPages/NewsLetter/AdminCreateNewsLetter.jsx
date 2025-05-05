import React, { useState, useEffect, useRef } from 'react';
import { MoveLeft, Plus, Upload, X, ChevronDown, CheckCircle, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import FilterDropdown from '../../../components/AdminComponents/newsletterfilterdropdown';
import CircularLoading from '../../../components/LoadingComponents/circularloading';

function AdminEditNewsletter() {
  const { newsletter_id } = useParams(); // Get newsletter ID from URL params
  const option = newsletter_id ? "edit" : "create"; // Dynamically set option based on presence of newsletter_id

  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState('');
  const [fileError, setFileError] = useState(''); // For file validation errors
  const [errorMessage, setErrorMessage] = useState(''); // For server errors

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [link, setLink] = useState('');
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagDropdownOpen, setTagDropdownOpen] = useState(false);
  const [allAlumni, setAllAlumni] = useState(false);
  const [image, setImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(null); // Store original image URL
  const [careerList, setCareerList] = useState([]);
  const [linklist, setLinkList] = useState([]);
  const [dateList, setDateList] = useState([]);
  const [jobList, setJobList] = useState([]); // Added for sendtoJob field

  const [titleError, setTitleError] = useState(false);
  const [contentError, setContentError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [newsletter, setNewsletter] = useState(null);

  useEffect(() => {
    const fetchNewsletter = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/newsletter/${newsletter_id}`
        );
        const news = response.data;
        setNewsletter(news);
        setTitle(news.title || '');
        setContent(news.content || '');
        setLinkList(news.links || []);
        setSelectedTags(news.tags || []);
        setImage(news.image || null);
        setOriginalImage(news.image || null); // Store original image URL
        setFileName(news.image ? 'Current Image' : '');
        setAllAlumni(news.sendAll || false);
        setCareerList(news.sendEmployment || []);
        setDateList(news.sendtoBatch || []);
        setJobList(news.sendtoJob || []); // Added for sendtoJob
      } catch (err) {
        const error = err.response?.status === 404
          ? 'Newsletter not found'
          : err.response?.status === 422
          ? 'Invalid newsletter ID format'
          : 'Failed to fetch newsletter';
        console.error(error);
        setErrorMessage(error);
      }
    };

    if (option === "edit" && newsletter_id) {
      fetchNewsletter();
    }
  }, [newsletter_id, option]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/newsletter/tags`
        );
        setTags(response.data || []);
      } catch (err) {
        console.error('Failed to fetch tags:', err.message);
        setErrorMessage('Failed to fetch tags');
      }
    };
    fetchTags();
  }, []);

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0] || e.dataTransfer?.files[0]; // Support both input and drag-and-drop
    setFileError(''); // Reset error

    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setFileError('Only JPEG, PNG, and GIF images are allowed.');
        setImage(null);
        setFileName('');
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setFileError('File size exceeds 5MB limit.');
        setImage(null);
        setFileName('');
        return;
      }

      setImage(file);
      setFileName(file.name);
    } else {
      setImage(null);
      setFileName('');
    }
  };

  const triggerFileSelect = () => {
    setFileError(''); // Reset error
    fileInputRef.current.click();
  };

  const handleLinkAdd = () => {
    if (link.trim() !== '' && isValidUrl(link.trim())) {
      setLinkList((prev) => {
        const updatedList = [...prev, link.trim()];
        setLink(''); // Clear the input field after adding the link
        return updatedList;
      });
    } else {
      alert('Please enter a valid URL.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if title and content are empty
    const titleIsValid = title.trim() !== '';
    const contentIsValid = content.trim() !== '';

    setTitleError(!titleIsValid);
    setContentError(!contentIsValid);
    setErrorMessage(''); // Reset error message on new submission

    if (titleIsValid && contentIsValid) {
      setIsModalOpen(true); // Open confirmation modal
    }
  };

  const handleModalConfirm = async () => {
    setModalLoading(true);

    const payload = new FormData();
    payload.append('title', title);
    payload.append('content', content);
    if (image && image !== originalImage) {
      // Only append image if it's a new file (not the original URL)
      if (typeof image !== 'string') {
        payload.append('image', image);
      }
    }
    payload.append('sendEmail', 'true'); // Always true as per current logic
    payload.append('sendAll', allAlumni.toString());
    if (linklist.length > 0) {
      payload.append('links', linklist.join(',')); // Comma-separated string
    }
    if (selectedTags.length > 0) {
      payload.append('tags', selectedTags.join(',')); // Comma-separated string
    }
    if (dateList.length > 0) {
      payload.append('sendtoBatch', dateList.join(',')); // Comma-separated string
    }
    if (careerList.length > 0) {
      payload.append('sendEmployment', careerList.join(',')); // Comma-separated string
    }
    if (jobList.length > 0) {
      payload.append('sendtoJob', jobList.join(',')); // Comma-separated string
    }

    // Log FormData for debugging
    for (const [key, value] of payload.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/admin/newsletter`;
      const url = option === "edit" ? `${baseUrl}/edit/${newsletter_id}` : `${baseUrl}/create`;
      const method = option === "edit" ? axios.put : axios.post;

      
      const token = localStorage.getItem('token');
      const response = await method(url, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

      console.log(`Newsletter ${option === "edit" ? 'updated' : 'created'}:`, response.data);
      setModalSuccess(true); // Show success state
    } catch (err) {
      const errorMsg = err.response?.status === 404
        ? 'Newsletter not found'
        : err.response?.status === 400
        ? `Failed to upload image: ${err.response?.data?.error || 'Invalid file'}`
        : err.response?.status === 500
        ? 'Server error: Unable to process newsletter. There may be an issue with the image upload.'
        : err.response?.status === 422
        ? `Invalid data format: ${err.response?.data?.message || 'Check the submitted data'}`
        : `Failed to ${option === "edit" ? 'update' : 'create'} newsletter`;
      console.error('Error:', err.message, err.response?.data);
      setErrorMessage(errorMsg);
      setIsModalOpen(false); // Close modal on error
    } finally {
      setModalLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setErrorMessage(''); // Clear error message when closing modal
    if (modalSuccess) {
      setModalSuccess(false);
      navigate('/admin/newsletter'); // Redirect after successful edit or create
    }
  };

  const formData = {
    title,
    content,
    linklist,
    selectedTags,
    allAlumni,
    image,
    careerList,
    dateList,
    jobList, // Added for sendtoJob
  };

  return (
    <div className="px-30 py-6 overflow-y-auto">
      {/* Back Button */}
      <button
        className="flex gap-2 mb-3 flex-row items-center cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <MoveLeft className="text-primary" />
        <p className="text-primary font-satoshi-medium text-lg">Back</p>
      </button>

      {/* Title */}
      <h1 className="font-satoshi-bold text-5xl mb-6">
        {option === "edit" ? "Edit a Newsletter" : "Create a Newsletter"}
      </h1>

      {/* Display Error Message */}
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {errorMessage}
        </div>
      )}

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        {/* Title Input */}
        <div className="p-6 border rounded-3xl border-gray-400">
          <label className="block mb-1 font-satoshi-medium">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className={`w-full border ${titleError ? 'border-red-500' : 'border-gray-300'} rounded-2xl p-2 outline-none font-satoshi-regular`}
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Content Input */}
        <div className="p-6 border rounded-3xl border-gray-400">
          <label className="block mb-1 font-satoshi-medium">
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            className={`w-full border ${titleError ? 'border-red-500' : 'border-gray-300'} rounded-2xl p-2 outline-none resize-none h-40 font-satoshi-regular scrollbar-blue`}
            placeholder="Content of the newsletter"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* Links and Tags */}
        <div className="flex gap-4 flex-wrap md:flex-nowrap">
          {/* Links */}
          <div className="flex-1 p-6 border border-gray-400 rounded-3xl">
            <label className="block basis-[65%] mb-1 font-satoshi-medium">Links (Optional)</label>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded-2xl p-2 outline-none font-satoshi-regular"
                placeholder="Enter link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
              <button
                type="button"
                className="bg-primary text-white p-2 rounded-full h-10 w-10 text-xl font-bold flex items-center justify-center cursor-pointer hover:bg-hover"
                onClick={handleLinkAdd}
              >
                <Plus size={24} className='stroke-2' />
              </button>
            </div>

            {/* List of added links */}
            <div className="mt-2 flex flex-col gap-2">
              {linklist.map((item, index) => {
                const shortItem = item.length > 200 ? item.slice(0, 200) + '...' : item;
                return (
                  <div
                    key={index}
                    className="flex gap-2 items-center"
                  >
                    <span
                      className="text-black font-satoshi-regular border border-gray-300 rounded-2xl px-3 py-2 w-full overflow-hidden text-ellipsis whitespace-nowrap"
                      title={item} // Full link on hover
                    >
                      {shortItem}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setLinkList((prev) => prev.filter((_, i) => i !== index));
                      }}
                      className="text-primary border border-gray-300 p-2 rounded-full h-10 w-10 text-xl font-bold flex items-center justify-center cursor-pointer hover:bg-gray-300"
                    >
                      <Trash2 size={24} className="stroke-2" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          <div className="flex-1 p-6 border border-gray-400 rounded-3xl relative">
            <label className="basis-[35%] mb-1 font-satoshi-medium">Tags (Optional)</label>
            <div
              className="w-full border border-gray-300 rounded-2xl p-2 outline-none flex justify-between items-center cursor-pointer font-satoshi-regular"
              onClick={() => setTagDropdownOpen((prev) => !prev)}
            >
              <span className="text-gray-600">
                {selectedTags.length > 0 ? selectedTags.join(', ') : 'Select tags'}
              </span>
              <ChevronDown size={18} className="text-gray-600" />
            </div>
            {tagDropdownOpen && (
              <div className="absolute w-160 mt-1 bg-white border border-gray-300 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto font-satoshi-regular">
                {tags.map((tag) => (
                  <label key={tag} className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100">
                    <input
                      type="checkbox"
                      value={tag}
                      checked={selectedTags.includes(tag)}
                      onChange={(e) => setSelectedTags((prev) =>
                        prev.includes(tag)
                          ? prev.filter((selectedTag) => selectedTag !== tag)
                          : [...prev, tag]
                      )}
                      className="rounded-sm"
                    />
                    {tag}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Email Send Options */}
        <div className="flex flex-wrap md:flex-nowrap gap-4">
          <div className="basis-[65%] p-6 border border-gray-400 rounded-3xl">
            <label className="block mb-2 font-satoshi-medium">Who to send?</label>
            <div className="flex items-center gap-2 mb-3 font-satoshi-regular">
              <input
                type="checkbox"
                checked={allAlumni}
                onChange={(e) => setAllAlumni(e.target.checked)}
              />
              <span>All Alumni</span>
            </div>
            <FilterDropdown 
              setCareerList={setCareerList} 
              setDateList={setDateList} 
              setJobList={setJobList} // Added for sendtoJob
              disabled={allAlumni} 
            />
          </div>

          {/* Image Upload */}
          <div className="basis-[35%] p-6 border border-gray-400 rounded-3xl">
            <label className="block mb-1 font-satoshi-medium">Image (Optional)</label>
            <div
              className="border border-dashed border-gray-400 rounded-2xl text-center flex flex-col items-center justify-center p-6 cursor-pointer"
              onClick={triggerFileSelect}
              onDrop={(e) => {
                e.preventDefault();
                handleFileChange(e);
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              {image ? (
                <div className="relative">
                  <img
                    src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                    alt="Selected"
                    className="w-32 h-32 object-cover rounded-lg mb-4"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering file select
                      setImage(null);
                      setFileName('');
                      setFileError('');
                    }}
                    className="absolute bottom-32 left-28 bg-red-500 text-white rounded-full p-1"
                    type="button"
                  >
                    <X size={11} />
                  </button>
                </div>
              ) : (
                <Upload className="text-primary mb-2" />
              )}
              <p className="text-gray-600 text-sm mb-2 font-satoshi-regular">
                Drag and drop file here or <span className="text-primary">Choose file</span>
              </p>
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            {fileName && (
              <p className="mt-2 text-sm text-gray-600">Selected: {fileName}</p>
            )}
            {fileError && (
              <p className="mt-2 text-sm text-red-500">{fileError}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-right">
          <button
            type="submit"
            className="bg-primary text-white px-6 py-2 rounded-lg"
          >
            Submit
          </button>
        </div>
      </form>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="flex flex-col justify-center items-center bg-white p-6 rounded-3xl shadow-lg w-[400px] min-h-[250px]">
            {modalLoading ? (
              <div className="h-full">
                <CircularLoading />
              </div>
            ) : modalSuccess ? (
              <>
                <div className="text-success">
                  <CheckCircle size={48} />
                </div>
                <p className="text-xl font-satoshi-medium mt-4 text-center">
                  Successfully {option === "edit" ? "updated" : "created"} newsletter!
                </p>
                <button
                  className="bg-success text-white px-4 py-2 rounded-3xl w-full mt-6 cursor-pointer"
                  onClick={handleModalClose}
                >
                  Close
                </button>
              </>
            ) : (
              <div>
                <p className="text-xl font-satoshi-medium text-center mt-4">
                  Are you sure you want to {option === "edit" ? "update" : "create"} this newsletter?
                </p>
                <div className="pt-8 font-satoshi-medium flex gap-3 mt-6 w-ful h-full justify-center">
                  <button
                    className="bg-white text-primary px-4 py-2 rounded-3xl w-25 outline outline-1 outline-primary cursor-pointer"
                    onClick={handleModalClose}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-success text-white px-4 py-2 rounded-3xl w-25 cursor-pointer"
                    onClick={handleModalConfirm}
                  >
                    Create
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default AdminEditNewsletter;