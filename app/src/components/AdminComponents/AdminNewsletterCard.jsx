import React from 'react';
import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminNewsletterCard = ({ title, image, date_posted, context, tags = [], id }) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex w-full bg-whitey border border-disabled shadow-sm p-4 gap-4 h-[179px] cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`newsletter-details` + '/' + id)}
    >
      {/* Left Side Image */}
      <div
        className={`w-55 h-35 rounded-[20px] object-cover flex items-center justify-center ${
          !image ? 'bg-primary' : ''
        }`}
      >
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full rounded-xl object-cover"
          />
        ) : (
          <span className="text-white text-lg font-semibold">No Image</span>
        )}
      </div>

      {/* Right Side Content */}
      <div className="flex flex-col flex-1">
        {/* Title and Date */}
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-[20px] font-satoshi-bold text-black">{title}</h2>
          <div className="flex items-center text-gray-400 text-sm">
            <Calendar className="w-4 h-4 mr-1" />
            {date_posted}
          </div>
        </div>

        {/* Description */}
        <p className="text-black text-[16px] line-clamp-3 mb-3 font-satoshi-regular">
          {context}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-100 text-primary text-xs font-medium px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminNewsletterCard;
