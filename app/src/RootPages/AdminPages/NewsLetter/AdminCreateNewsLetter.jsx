import React, { useState } from 'react';
import { MoveLeft, Plus, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function AdminCreateNewsletter() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [link, setLink] = useState('');
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [allAlumni, setAllAlumni] = useState(false);
  const [filterBy, setFilterBy] = useState('');
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div className="p-6">
      {/* Back Button */}
      <button
        className="flex gap-2 mb-3 flex-row items-center cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <MoveLeft className="text-primary" />
        <p className="text-primary font-satoshi-medium text-lg">Back</p>
      </button>

      {/* Title */}
      <h1 className="font-satoshi-bold text-5xl mb-6">Create a Newsletter</h1>

      <form className="flex flex-col gap-6">

        {/* Title Input */}
        <div>
          <label className="block font-satoshi-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Content Input */}
        <div>
          <label className="block font-satoshi-medium text-gray-700 mb-1">
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none resize-none h-40"
            placeholder="Content of the newsletter"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* Links and Tags */}
        <div className="flex gap-4 flex-wrap md:flex-nowrap">
          {/* Links */}
          <div className="flex-1">
            <label className="block font-satoshi-medium text-gray-700 mb-1">
              Links (Optional)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 outline-none"
                placeholder="Enter link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
              <button
                type="button"
                className="bg-primary text-white rounded-full p-2"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="flex-1">
            <label className="block font-satoshi-medium text-gray-700 mb-1">
              Tags (Optional)
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none"
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
            >
              <option value="">Select tag</option>
              <option value="Event">Event</option>
              <option value="Update">Update</option>
              <option value="Reminder">Reminder</option>
              {/* Add more options as needed */}
            </select>
          </div>
        </div>

        {/* Email Send Options */}
        <div className="flex gap-4 flex-wrap md:flex-nowrap">
          {/* Who to Send */}
          <div className="flex-1 border border-gray-300 rounded-lg p-4">
            <label className="block font-satoshi-medium text-gray-700 mb-2">
              Who to send?
            </label>
            <div className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                checked={allAlumni}
                onChange={(e) => setAllAlumni(e.target.checked)}
              />
              <span>All Alumni</span>
            </div>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none"
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
            >
              <option value="">Filter by</option>
              <option value="Batch">Batch</option>
              <option value="Location">Location</option>
              <option value="Program">Program</option>
            </select>
          </div>

          {/* Image Upload */}
          <div className="flex-1 border border-dashed border-gray-400 rounded-lg p-4 flex flex-col items-center justify-center text-center">
            <Upload className="text-primary mb-2" />
            <p className="text-gray-600 text-sm">Drag and drop file here or</p>
            <label className="text-blue-600 font-medium cursor-pointer">
              Choose file
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
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
    </div>
  );
}

export default AdminCreateNewsletter;
