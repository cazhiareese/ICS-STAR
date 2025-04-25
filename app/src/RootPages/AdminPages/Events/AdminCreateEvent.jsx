import React, { useState, useEffect } from 'react'
import { MoveLeft, UploadCloud } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import MultiDatePicker from '../../../components/AdminComponents/MultiDatePicker'

function AdminCreateEvent() {
  const navigate = useNavigate()
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL

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
  })

  const [linkInput, setLinkInput] = useState('')
  const [imageName, setImageName] = useState(null)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      image: file
    }))
    setImageName(file.name)
  }

  const handleAddLink = () => {
    if (linkInput.trim() !== '') {
      setFormData(prev => ({
        ...prev,
        links: [...prev.links, linkInput]
      }))
      setLinkInput('')
    }
  }

  const handleMultiChange = (e, field) => {
    const options = Array.from(e.target.selectedOptions, option => option.value)
    setFormData(prev => ({
      ...prev,
      [field]: options
    }))
  }

  useEffect(() => {
    console.log("formData updated:", formData)
  }, [formData])
  

  const options = ["Batch", "Affiliation", "Employment Status", "Job Fields"];
  const [filterOpen, setFilterOpen] = useState(false)
  const [activeOptionIndex, setActiveOptionIndex] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null)
  const [tagsDropdownOpen, setTagsDropdownOpen] = useState(false)
  const [customTag, setCustomTag] = useState('')
  

  const handleSubmit = async () => {
    const payload = new FormData()

    payload.append('title', formData.title)
    payload.append('location', formData.location)
    payload.append('description', formData.description)

    if (formData.image) payload.append('image', formData.image)

    payload.append('date', formData.date)
    payload.append('time', formData.time)    
    payload.append('tags', formData.tags.join(', '))
    payload.append('links', formData.links.join(', '))
    payload.append('isAll', String(formData.isAll))
    payload.append('batch', formData.batch.join(', '))
    payload.append('employmentStatus', formData.employmentStatus)
    payload.append('job', formData.job.join(', '))
    payload.append('affiliation', formData.affiliation.join(', '))
    payload.append('sendEmail', String(formData.sendEmail))

    console.log(formData.date)
    console.log(formData.time)

    try {
      const res = await axios.post(`${API_BASE_URL}/api/admin/events/create`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      console.log(res)
      if (res.data.message === 'success') {
        alert('Event created successfully!')
        navigate(-1)
      } 
    } catch (err) {
      console.error(err)
      alert('Something went wrong.')
    }
  }

  return (
    <div className='p-6'>
      <button className="flex gap-2 mb-3 flex-row items-center cursor-pointer" onClick={() => navigate(-1)}>
        <MoveLeft className='text-primary' />
        <p className='text-primary font-satoshi-medium text-lg'>Back to events</p>
      </button>

      <h1 className='font-satoshi-bold text-5xl mb-6'>Create an Event</h1>

      {/* Title and location */}
      <div className='flex flex-col gap-4'>
        <div className="flex flex-row gap-4">
          <div className='border border-gray-400 p-6 rounded-3xl w-2/3'>
            <label className="block mb-1 font-satoshi-medium">Title <span className='text-red-600'>*</span></label>
            <input name="title" value={formData.title} onChange={handleInputChange} className="w-full border border-gray-300 rounded-2xl p-2" placeholder="" />
          </div>
          <div className='border border-gray-400 p-6 rounded-3xl w-full'>
            <label className="block mb-1 font-satoshi-medium">Location <span className='text-red-600'>*</span></label>
            <input name="location" value={formData.location} onChange={handleInputChange} className="w-full border border-gray-300 rounded-2xl p-2" placeholder="" />
          </div>
        </div>
        
        {/* Date, time, tags */}
        <div className="flex flex-row gap-4">
          {/* Date and time */}
          <div className='flex flex-row items-center p-6 border border-gray-400 rounded-3xl gap-1 w-3/5'>
            {/* Date */}
            <div className='flex-1'>
              <label className="block mb-1 font-satoshi-medium">Date <span className='text-red-600'>*</span></label>
              <MultiDatePicker
                initialDates={formData.date && formData.time
                  ? formData.date.split(',').map((d, i) => {
                      const t = formData.time.split(',')[i]?.trim() || "00:00"
                      return `${d.trim()} ${t}`
                    }).join(', ')
                  : ''
                }
                onApply={({ date, time }) =>
                  setFormData(prev => ({
                    ...prev,
                    date,
                    time
                  }))
                }
              />
              {/* <input type="text" name="date" value={formData.date} onChange={handleInputChange} className="w-full border border-gray-300 rounded-2xl p-2" placeholder="YYYY-MM-DD" /> */}
            </div>
            {/* Time */}
            {/* <div className='flex-1'>
              <label className="block mb-1 font-satoshi-medium">Time <span className='text-red-600'>*</span></label>
              <input type="text" name="time" value={formData.time} onChange={handleInputChange} className="w-full border border-gray-300 rounded-2xl p-2" placeholder="08:00" />
            </div> */}
          </div>

          {/* Tags */}
          <div className='p-6 border border-gray-400 rounded-3xl w-2/5'>
            <div className="relative">
              <label className="block font-satoshi-medium">Tags (Optional)</label>
              <div 
                className="border border-gray-300 rounded-3xl px-3 py-2 mt-1 cursor-pointer text-ellipsis whitespace-nowrap overflow-hidden"
                onClick={() => setTagsDropdownOpen(!tagsDropdownOpen)}
              >
                {formData.tags.length > 0 ? formData.tags.join(', ') : <div className='flex flex-row justify-between'><h2>Select Tags</h2><span className="ml-2">▾</span></div>}
              </div>

              {tagsDropdownOpen && (
                <div className="font-satoshi-regular absolute z-90 bg-white border border-gray-300 rounded-3xl shadow-md mt-1 w-full p-3 space-y-2">
                  {['Seminar', 'Webinar', 'Training', 'Hackathon', 'Meetup', 'Networking'].map((tag) => (
                    <label key={tag} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className='accent-primary cursor-pointer'
                        checked={formData.tags.includes(tag)}
                        onChange={() => {
                          setFormData((prev) => ({
                            ...prev,
                            tags: prev.tags.includes(tag)
                              ? prev.tags.filter((t) => t !== tag)
                              : [...prev.tags, tag]
                          }))
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
                            tags: [...prev.tags, customTag.trim()]
                          }))
                          setCustomTag('')
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-400 rounded-3xl p-6">
          <div className='flex flex-col'>
            <label className="block mb-1 font-satoshi-medium">Description <span className='text-red-600'>*</span></label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full border border-gray-300 rounded-2xl p-2 h-32 resize-none" placeholder="Describe your event here..." />
          </div>
          {/* Image */}
          <div className='flex flex-col'>
            <label className="block mb-1 font-medium">Image (optional)</label>
            <div className="flex-1 border border-dashed border-gray-300 hover:border-primary rounded-2xl relative overflow-hidden">
              <input
                type="file"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                title=""
                accept="image/*"
              />
              <div className="flex flex-col items-center justify-center h-full p-4 pointer-events-none z-0">
                <UploadCloud className='text-primary'/>
                <h2 className="text-gray-500 text-center">Drag and drop file here or</h2>
                <h2 className='text-primary underline'>{imageName === null ? 'choose file' : imageName}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className='p-6 border border-gray-400 rounded-3xl'>
          <label className="block mb-1 font-satoshi-medium">Links</label>
          <div className="flex gap-2 w-1/2">
            <input value={linkInput} onChange={(e) => setLinkInput(e.target.value)} className="w-full border border-gray-300 rounded-2xl p-2" placeholder="Add a link" />
            <button type="button" onClick={handleAddLink} className="bg-primary text-white px-3 rounded-full h-10 w-10 text-xl font-bold flex items-center justify-center">+</button>
          </div>
          {/* {formData.links.length > 0 && (
            <ul className="mt-2 list-disc pl-6 text-sm text-gray-700">
              {formData.links.map((link, idx) => (
                <li key={idx}>{link}</li>
              ))}
            </ul>
          )} */}
        </div>

        <div className='p-6 border border-gray-400 rounded-3xl space-y-2'>
          <h2 className='font-satoshi-medium'>Visibility and Invitations</h2>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="isAll" className='accent-primary cursor-pointer' checked={formData.isAll} onChange={handleInputChange} />
            <label>All Alumni</label>
          </div>

          <div className="relative inline-block text-left">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex flex-row justify-between px-4 py-2 rounded-3xl border border-gray-300 text-black cursor-pointer w-80 font-satoshi-regular"
            >
              <p>Filter by</p>
              <span className="ml-2">▾</span>
            </button>

            {filterOpen && (
              <div className="absolute z-50 bottom-full mb-2 w-56 rounded-2xl bg-white shadow-xl border text-gray-900">
                <ul className="py-4 space-y-2 rounded-2xl relative">
                  {options.map((option, idx) => (
                    <li
                      key={idx}
                      onClick={() => setActiveFilter(option)}
                      className="px-4 py-2 hover:bg-primary hover:text-white cursor-pointer relative"
                    >
                      {option}
                      
                    </li>
                  ))}
                </ul>
                {activeFilter != null && (
                  <div className="absolute left-full top-0 ml-2 w-60 h-full bg-white border shadow-lg rounded-2xl z-50">
                    {activeFilter === 'Batch' ? (
                      <>
                        <h2>Batch of Alumni</h2>
                      </>
                    ) : activeFilter === 'Affiliation' ? (
                      <></>
                    ) : activeFilter === 'Employment Status' ? (
                      <></>
                    ) : activeFilter === 'Job Fields' ? (
                      <></>
                    ) : (
                      <></>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" name="sendEmail" className='accent-primary cursor-pointer' checked={formData.sendEmail} onChange={handleInputChange} />
            <label>Send email invites</label>
          </div>
        </div>

        <div className="text-right">
          <button onClick={handleSubmit} className="bg-primary text-white text-lg px-10 py-3 rounded-2xl cursor-pointer hover:bg-hover">Submit</button>
        </div>
      </div>
    </div>
  )
}

export default AdminCreateEvent
