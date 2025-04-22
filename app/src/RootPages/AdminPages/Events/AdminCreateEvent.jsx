import React from 'react'
import { MoveLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function AdminCreateEvent() {
  const navigate = useNavigate()
  return (
    <div className='p-6'>
        {/* Back */}
      <button className="flex gap-2 mb-3 flex-row items-center cursor-pointer" onClick={() => navigate(-1)}>
        <MoveLeft className='text-primary'/> 
        <p className='text-primary font-satoshi-medium text-lg'>Back to events</p>
      </button>
      {/* Create an Event */}
      <h1 className='font-satoshi-bold text-5xl mb-6'>Create an Event</h1>
      {/* Create event form */}
      <div className='flex flex-col gap-4'>
      {/* Title and Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className='border border-gray-400 p-6 rounded-3xl'>
          <label className="block mb-1 font-satoshi-medium">Title <span className="text-red-500">*</span></label>
          <input className="w-full border border-gray-300 rounded-2xl p-2" placeholder="Event title" />
        </div>
        <div className='border border-gray-400 p-6 rounded-3xl'>
          <label className="block mb-1 font-satoshi-medium">Location <span className="text-red-500">*</span></label>
          <input className="w-full border border-gray-300 rounded-2xl p-2" placeholder="Event location" />
        </div>
      </div>

      {/* Date, Time, Tags */}
      <div className="grid grid-cols-1 md:grid-cols-[40rem_auto] gap-4 ">
        {/* Date and Time */}
        <div className='flex flex-row p-6 border border-gray-400 rounded-3xl gap-4'>
          <div className='flex-1'>
            <label className="block mb-1 font-medium">Date <span className="text-red-500">*</span></label>
            <input type="text" className="w-full border border-gray-300 rounded-2xl p-2" placeholder="MM/DD/YYYY" />
          </div>
          <div className='flex-1'>
            <label className="block mb-1 font-medium">Time <span className="text-red-500">*</span></label>
            <input type="time" className="w-full border border-gray-300 rounded-2xl p-2" />
          </div>
        </div>
        {/* Tags */}
        <div className='p-6 border border-gray-400 rounded-3xl'>
          <label className="block mb-1 font-satoshi-medium">Tags (Optional)</label>
          <select className="w-full border border-gray-300 rounded-2xl p-2">
            <option>Select tags</option>
          </select>
        </div>
      </div>

      {/* Description and Image */}
      <div className="grid grid-cols-1 md:grid-cols-[45rem_auto] gap-4 border border-gray-400 rounded-3xl p-6">
        <div className='flex flex-col'>
          <label className="block mb-1 font-medium">Description <span className="text-red-500">*</span></label>
          <textarea className="w-full border border-primary rounded-2xl p-2 h-32 resize-none" placeholder="Describe your event here..." />
        </div>
        <div className='flex flex-col w-full'>
          <label className="block mb-1 font-medium">Image (Optional)</label>
          <div className="border-2 border-dashed border-gray-400 bg-white rounded-2xl p-4 text-center flex-1 flex flex-col items-center justify-center">
            <p className="text-gray-400">Drag and drop file here or</p>
            <button className="text-blue-600 underline mt-2">Choose file</button>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className='p-6 border border-gray-400 rounded-3xl'>
        <label className="block mb-1 font-medium">Links (Optional)</label>
        <div className="flex gap-2 w-2/5">
          <input className="w-full border border-primary rounded-2xl p-2" placeholder="Add a link" />
          <button className="bg-primary text-white px-3 rounded-full h-10 w-10 text-xl font-bold flex items-center justify-center">+</button>
        </div>
      </div>

      {/* Visibility and Invitations */}
      <div className="">
        <label className="block font-satoshi-light mb-1">Visibility and Invitations</label>
        <div className="p-6 border border-gray-400 rounded-3xl space-y-2">
          <h2 className='font-satoshi-medium'>Who can RSVP?</h2>
          <div className="flex items-center gap-2">
            <input type="checkbox" className="form-checkbox" />
            <label>All Alumni</label>
          </div>
          <div className="flex items-center gap-2">
            <select className="border border-gray-300 rounded-2xl p-2">
              <option>Filter by</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" className="form-checkbox" />
            <label>Send email invites</label>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-right">
        <button className="bg-primary text-white text-lg px-10 py-3 rounded-2xl">Submit</button>
      </div>
      </div>
    </div>
  )
}

export default AdminCreateEvent
