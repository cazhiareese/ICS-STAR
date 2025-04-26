import React, { useEffect, useState } from 'react';
import { MoveLeft, Plus, Upload, X, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FilterDropdown from '../../../components/AdminComponents/newsletterfilterdropdown';

function AdminCreateNewsletter() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [link, setLink] = useState('');
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagDropdownOpen, setTagDropdownOpen] = useState(false);
  const [allAlumni, setAllAlumni] = useState(false);
  const [image, setImage] = useState(null);
  const [careerList, setCareerList] = useState([]);
  const [linklist, setLinkList] = useState([]);
  const [dateList, setDateList] = useState([]);

  console.log(dateList, careerList, selectedTags, linklist,image);

  useEffect(() => {
    const tags = ['Tag1', 'Tag2', 'Tag3', 'Tag4', 'Tag5', 'Tag6'];
    setTags(tags);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      console.log(image);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const handleTagChange = (e) => {
    const value = e.target.value;
    setSelectedTags((prevSelectedTags) =>
      prevSelectedTags.includes(value)
        ? prevSelectedTags.filter((tag) => tag !== value)
        : [...prevSelectedTags, value]
    );
  };

  const toggleTagDropdown = () => {
    setTagDropdownOpen((prev) => !prev);
  };

  const handleLinkAdd = () => {
    if (link.trim() !== '') {
      setLinkList((prev) => {
        const updatedList = [...prev, link.trim()];
        setLink(''); // Clear the input field after adding the link
        return updatedList;
      });
    }
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
            <label className="block basis-[65%] mb-1 font-satoshi-medium">Links (Optional)</label>
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
                onClick={handleLinkAdd}
              >
                <Plus size={18} />
              </button>
            </div>

            {/* List of added links */}
            <div className="mt-4 flex flex-col gap-2">
              {linklist.map((item, index) => {
                const shortItem = item.length > 200 ? item.slice(0, 200) + '...' : item;
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between border border-gray-200 rounded-lg p-2"
                  >
                    <span
                      className="text-primary text-sm overflow-hidden text-ellipsis whitespace-nowrap max-w-[calc(100%-2rem)]"
                      title={item} // Full link on hover
                    >
                      {shortItem}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setLinkList((prev) => prev.filter((_, i) => i !== index));
                      }}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <X size={18} />
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
              className="w-full border border-gray-300 rounded-2xl p-2 outline-none flex justify-between items-center cursor-pointer"
              onClick={toggleTagDropdown}
            >
              <span className="text-gray-600">
                {selectedTags.length > 0 ? selectedTags.join(', ') : 'Select tags'}
              </span>
              <ChevronDown size={18} className="text-gray-600" />
            </div>

            {tagDropdownOpen && (
              <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                {tags.map((tag) => (
                  <label key={tag} className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100">
                    <input
                      type="checkbox"
                      value={tag}
                      checked={selectedTags.includes(tag)}
                      onChange={handleTagChange}
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
            <div className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                checked={allAlumni}
                onChange={(e) => setAllAlumni(e.target.checked)}
              />
              <span>All Alumni</span>
            </div>
            <FilterDropdown setCareerList={setCareerList} setDateList={setDateList} />
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
                    className="absolute bottom-32 left-28 bg-red-500 text-white rounded-full p-1"
                    type="button"
                  >
                    <X size={11} />
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
