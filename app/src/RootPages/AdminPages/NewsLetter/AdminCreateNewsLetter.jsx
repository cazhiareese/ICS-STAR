import React, { useState } from 'react';
import { MoveLeft, Plus, Upload, X } from 'lucide-react';  // Import the X icon from lucide-react
import { useNavigate } from 'react-router-dom';
import FilterDropdown from '../../../components/AdminComponents/newsletterfilterdropdown';

function AdminCreateNewsletter() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [link, setLink] = useState('');
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [allAlumni, setAllAlumni] = useState(false);
  const [filterBy, setFilterBy] = useState('');
  const [image, setImage] = useState(null); // Store the uploaded image
  const [careerList, setCareerList] = useState([]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Create a URL for the selected image to show preview
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Create a URL for the dropped image to show preview
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Allow drop by preventing default behavior
  };

  const handleRemoveImage = () => {
    setImage(null); // Remove the image by setting the state to null
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
      <h1 className="font-satoshi-bold text-5xl mb-6">Create a Newsletter</h1>

      <form className="flex flex-col gap-6">
        {/* Title Input */}
        <div className="p-6 border border-gray-400 rounded-3xl">
          <label className="block mb-1 font-satoshi-medium">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-2xl p-2 outline-none"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Content Input */}
        <div className="p-6 border border-gray-400 rounded-3xl">
          <label className="block mb-1 font-satoshi-medium">
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-2xl p-2 outline-none resize-none h-40"
            placeholder="Content of the newsletter"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* Links and Tags */}
        <div className="flex gap-4 flex-wrap md:flex-nowrap">
          {/* Links */}
          <div className="flex-1 p-6 border border-gray-400 rounded-3xl">
            <label className="block mb-1 font-satoshi-medium">Links (Optional)</label>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded-2xl p-2 outline-none"
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
          <div className="flex-1 p-6 border border-gray-400 rounded-3xl">
            <label className="block mb-1 font-satoshi-medium">Tags (Optional)</label>
            <select
              className="w-full border border-gray-300 rounded-2xl p-2 outline-none"
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
            >
              <option value="">Select tag</option>
              <option value="Event">Event</option>
              <option value="Update">Update</option>
              <option value="Reminder">Reminder</option>
            </select>
          </div>
        </div>

        {/* Email Send Options */}
        <div className="flex flex-wrap md:flex-nowrap gap-4">
          <div className="basis-[65%] p-6 border border-gray-400 rounded-3xl">
            <label className="block mb-2 font-satoshi-medium">Who to send?</label>
            <div className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                checked={allAlumni}
                onChange={(e) => setAllAlumni(e.target.checked)}
              />
              <span>All Alumni</span>
            </div>
            <FilterDropdown setCareerList={setCareerList} />
          </div>

          {/* Image Upload */}
          <div className="basis-[35%] p-6 border border-gray-400 rounded-3xl">
            <label className="block mb-1 font-satoshi-medium">Image (Optional)</label>
            <div
              className="border border-dashed border-gray-400 rounded-2xl text-center flex flex-col items-center justify-center p-6"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {image ? (
                <div className="relative">
                  <img
                    src={image}
                    alt="Selected"
                    className="w-32 h-32 object-cover rounded-lg mb-4"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute bottom-32 left-29 bg-red-500 text-white rounded-full p-1"
                    type="button"
                  >
                    <X size={11} /> {/* Use the X icon from lucide-react */}
                  </button>
                </div>
              ) : (
                <Upload className="text-primary mb-2" />
              )}
              <p className="text-gray-600 text-sm mb-2">Drag and drop file here or</p>
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
