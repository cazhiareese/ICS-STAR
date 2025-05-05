import React, { useState, useEffect, useRef } from 'react';
import { MoveLeft, UploadCloud, X, Trash2, Plus, CheckCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import MultiDatePicker from '../../../components/AdminComponents/MultiDatePicker';
import CircularLoading from '../../../components/LoadingComponents/circularloading';
import EventFilterDropdown from '../../../components/AdminComponents/eventFilter';

function AdminCreateEvent({ purpose }) {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const { eventid } = useParams();

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    date: '',
    time: '',
    tags: [],
    description: '',
    image: null,
    links: [],
    isAll: false,
    batch: [],
    employmentStatus: '',
    job: [],
    affiliation: [],
    sendEmail: false,
  });

  const options = ['Batch', 'Affiliation', 'Employment Status', 'Job Fields'];
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [tagsDropdownOpen, setTagsDropdownOpen] = useState(false);
  const [customTag, setCustomTag] = useState('');
  const [tags, setTags] = useState([]);
  const [imageName, setImageName] = useState(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  const [linkInput, setLinkInput] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [token, setToken] = useState(null);

    const [affililationList, setAffiliationList] = useState([]);
    const [employmentStatus, setEmploymentStatus] = useState([]);

    const [dateList, setDateList] = useState([]);
    const [jobList, setJobList] = useState([]); // Added for sendtoJob field
    const [allAlumni, setAllAlumni] = useState(false);

  function handleAddLink() {
    if (linkInput.trim() !== '') {
      setFormData((prev) => ({
        ...prev,
        links: [...prev.links, linkInput.trim()],
      }));
      setLinkInput('');
    }
  }

  useEffect(() => {
    console.log(jobList)
    console.log(dateList)
    console.log(affililationList)
    console.log(employmentStatus)
    setFormData((prev) => ({
      ...prev,
      batch: formData.isAll ? [] : dateList,
      job: formData.isAll ? [] : jobList,
      affiliation: formData.isAll ? [] : affililationList,
      employmentStatus: formData.isAll ? null: employmentStatus
    }));
  }, [dateList, jobList, affililationList, employmentStatus, formData.isAll]);

  function updateLink(index, newValue) {
    const updated = [...formData.links];
    updated[index] = newValue;
    setFormData((prev) => ({ ...prev, links: updated }));
  }

  function removeLink(index) {
    const filtered = formData.links.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, links: filtered }));
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
    setImageName(file.name);
  };

  function removeImage() {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
    setImageName(null);
  }

  async function fetchTags() {
    try {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
      if (!storedToken) {
        throw new Error('No authentication token found');
      }
      const response = await axios.get(`${API_BASE_URL}/api/admin/events/get-tags`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      setTags(response.data.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  }

  useEffect(() => {
    async function fetchInitial() {
      setLoading(true);
      try {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
        if (!storedToken) {
          throw new Error('No authentication token found');
        }
        await fetchTags();
        if (purpose === 'edit' && eventid) {
          const res = await axios.get(`${API_BASE_URL}/api/admin/events/event-by-id/${eventid}`, {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          const data = res.data.data;
          const [date = '', time = ''] = data.datetime[0]?.split(' ') || [];
          setFormData({
            title: data.title,
            location: data.location,
            date,
            time,
            tags: data.tags || [],
            description: data.description,
            image: data.image,
            links: data.links || [],
            isAll: false,
            batch: [],
            employmentStatus: '',
            job: [],
            affiliation: [],
            sendEmail: false,
          });
          setImageName(data.image ? data.image.split('/').pop() || 'event-image' : null);
          console.log('Loaded links for editing:', data.links); // Debugging
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchInitial();
  }, [purpose, eventid]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setTagsDropdownOpen(false);
      }
    }

    if (tagsDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [tagsDropdownOpen]);

  useEffect(() => {
    console.log('Current formData.links:', formData.links); // Debugging
  }, [formData.links]);



  const handleSubmit = async () => {
    setSubmitLoading(true);
    const payload = new FormData();

    payload.append('title', formData.title);
    payload.append('location', formData.location);
    payload.append('description', formData.description);

    if (formData.image && formData.image instanceof File) {
      payload.append('image', formData.image);
    }

    console.log(formData.image)

    const dateArray = Array.isArray(formData.date) ? formData.date : [formData.date];
    const timeArray = Array.isArray(formData.time) ? formData.time : [formData.time];

    dateArray.forEach((d) => payload.append('date', d));
    timeArray.forEach((t) => payload.append('time', t));

    formData.tags.forEach((tag) => payload.append('tags', tag));
    console.log('Links before submission:', formData.links); // Debugging
    formData.links.forEach((link) => payload.append('links[]', link)); // Use links[] for array

    payload.append('isAll', String(formData.isAll));
    formData.batch.forEach((b) => payload.append('batch', b));
    payload.append('employmentStatus', formData.employmentStatus);
    formData.job.forEach((j) => payload.append('job', j));
    formData.affiliation.forEach((a) => payload.append('affiliation', a));
    payload.append('sendEmail', String(formData.sendEmail));

    // Log FormData contents
    for (let [key, value] of payload.entries()) {
      console.log(`FormData ${key}: ${value}`); // Debugging
    }

    try {
      let res;
      if (purpose === 'create') {
        res = await axios.post(`${API_BASE_URL}/api/admin/events/create`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      } else if (purpose === 'edit') {
        res = await axios.put(`${API_BASE_URL}/api/admin/events/edit/${eventid}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      console.log('API response:', res.data); // Debugging
      if (res.data.message === 'success') {
        setSubmitSuccess(true);
        alert(purpose === 'create' ? 'Event created successfully!' : 'Event successfully edited');
      }
    } catch (err) {
      console.error('Error submitting event:', err);
      alert('Something went wrong.');
    } finally {
      setSubmitLoading(false);
    }
  };

  return loading ? (
    <div className="h-screen w-full flex items-center justify-center">
      <CircularLoading />
    </div>
  ) : (
    <div className="p-6 px-24">
      <button
        className="flex gap-2 mb-3 flex-row items-center cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <MoveLeft className="text-primary" />
        <p className="text-primary font-satoshi-medium text-lg">Back to events</p>
      </button>

      <h1 className="font-satoshi-bold text-5xl mb-6">
        {purpose === 'create' ? 'Create' : 'Edit'} an Event
      </h1>

      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-4">
          <div className="bg-white border border-gray-400 p-6 rounded-3xl w-2/3">
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
          <div className="border border-gray-400 p-6 rounded-3xl w-full bg-white">
            <label className="block mb-1 font-satoshi-medium">
              Location <span className="text-red-600">*</span>
            </label>
            <input
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-2xl p-2"
              placeholder=""
            />
          </div>
        </div>

        <div className="flex flex-row gap-4">
          <div className="flex flex-row items-center p-6 border border-gray-400 rounded-3xl gap-1 w-3/5 bg-white">
            <div className="flex-1">
              <label className="block mb-1 font-satoshi-medium">
                Date <span className="text-red-600">*</span>
              </label>
              <MultiDatePicker
                initialDates={
                  formData.date && formData.time
                    ? formData.date.split(',').map((d, i) => {
                        const t = formData.time.split(',')[i]?.trim() || '00:00';
                        return `${d.trim()} ${t}`;
                      }).join(', ')
                    : ''
                }
                onApply={({ date, time }) =>
                  setFormData((prev) => ({
                    ...prev,
                    date,
                    time,
                  }))
                }
              />
            </div>
          </div>

          <div className="p-6 border border-gray-400 rounded-3xl w-2/5 bg-white">
            <div className="relative">
              <label className="block font-satoshi-medium">Tags (optional)</label>
              <div
                className="border border-gray-300 rounded-3xl px-3 py-2 mt-1 cursor-pointer text-ellipsis whitespace-nowrap overflow-hidden"
                onClick={() => setTagsDropdownOpen(!tagsDropdownOpen)}
              >
                {formData.tags.length > 0 ? (
                  formData.tags.join(', ')
                ) : (
                  <div className="flex flex-row justify-between">
                    <h2>Select Tags</h2>
                    <span className="ml-2">▾</span>
                  </div>
                )}
              </div>

              {tagsDropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="font-satoshi-regular absolute z-90 bg-white border border-gray-300 rounded-3xl shadow-md mt-1 w-full p-3 space-y-2 max-h-90 overflow-auto"
                >
                  {tags.map((tag) => (
                    <label key={tag} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="accent-primary cursor-pointer"
                        checked={formData.tags.includes(tag)}
                        onChange={() => {
                          setFormData((prev) => ({
                            ...prev,
                            tags: prev.tags.includes(tag)
                              ? prev.tags.filter((t) => t !== tag)
                              : [...prev.tags, tag],
                          }));
                        }}
                      />
                      <span>{tag}</span>
                    </label>
                  ))}

                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Others..."
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value)}
                      className="border px-2 py-1 rounded w-full"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customTag.trim() !== '' && !formData.tags.includes(customTag.trim())) {
                          setFormData((prev) => ({
                            ...prev,
                            tags: [...prev.tags, customTag.trim()],
                          }));
                          setCustomTag('');
                        }
                      }}
                      className="text-sm text-white rounded-xl bg-primary p-2"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="h-70 grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-400 bg-white rounded-3xl p-6">
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
                    src={
                      formData.image instanceof File
                        ? URL.createObjectURL(formData.image)
                        : formData.image
                    }
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border border-gray-400 bg-white rounded-3xl">
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
            {formData.links.map((link, idx) => (
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

        <div className="p-6 border border-gray-400 bg-white rounded-3xl space-y-2">
          <h2 className="font-satoshi-medium">Visibility and Invitations</h2>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isAll"
              className="accent-primary cursor-pointer"
              checked={formData.isAll}
              onChange={(e) => {
                handleInputChange(e);
                setAllAlumni(true); //set as true, all alumni na ito
              }}
              
            />
            <label>All Alumni</label>
          </div>
          <div className="relative inline-block text-left w-72">
          <EventFilterDropdown 
              setCareerList={setJobList} 
              setDateList={setDateList}
              setAffiliationList={setAffiliationList}
              setEmployment={setEmploymentStatus} 
              // setJobList={setJobList} // return lists sa lahat
              disabled={allAlumni} 
            />

          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="sendEmail"
              className="accent-primary cursor-pointer"
              checked={formData.sendEmail}
              onChange={handleInputChange}
            />
            <label>Send email invites</label>
          </div>
        </div>

        <div className="text-right">
          <button
            onClick={() => setShowSubmitModal(true)}
            className="bg-primary text-white text-lg px-10 py-3 rounded-2xl cursor-pointer hover:bg-hover"
          >
            {submitLoading ? <CircularLoading /> : 'Submit'}
          </button>
        </div>
      </div>

      {showSubmitModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 font-satoshi-regular">
          <div className="flex flex-col justify-center items-center bg-white p-6 rounded-3xl shadow-lg w-[400px] min-h-[250px]">
            {submitLoading ? (
              <div className="h-full">
                <CircularLoading />
              </div>
            ) : submitSuccess ? (
              <>
                <div className="text-success">
                  <CheckCircle size={48} />
                </div>
                <p className="text-xl font-satoshi-medium mt-4 text-center">
                  {purpose === 'create' ? 'Created event!' : 'Saved changes!'}
                </p>
                <button
                  className="bg-primary text-white px-4 py-2 rounded-3xl w-full mt-6 cursor-pointer"
                  onClick={() => {
                    setShowSubmitModal(false);
                    navigate(-1);
                  }}
                >
                  Close
                </button>
              </>
            ) : (
              <>
                <p className="text-xl font-satoshi-medium text-center mt-4">
                  {purpose === 'create'
                    ? `Create event "${formData.title}"?`
                    : `Save changes to "${formData.title}"?`}
                </p>
                <p className="text-gray-500 text-sm text-center mt-2">
                  Email invites will be sent automatically.
                </p>
                <div className="flex gap-3 mt-14 w-full h-full justify-center">
                  <button
                    className="border border-primary text-primary font-satoshi-medium px-4 py-2 rounded-3xl w-25 cursor-pointer"
                    onClick={() => setShowSubmitModal(false)}
                  >
                    Not yet
                  </button>
                  <button
                    className="bg-success font-satoshi-medium text-white px-4 py-2 rounded-3xl w-25 cursor-pointer"
                    onClick={handleSubmit}
                  >
                    {purpose === 'create' ? 'Create' : 'Save'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCreateEvent;