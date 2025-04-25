import React from 'react';
import { Calendar } from 'lucide-react';

const AdminNewsletterCard = ({ title, image, date_posted, context, tags = [] }) => {
  console.log("Tags:", tags); // Debugging line to check the tags array
  return (
    <div className="flex w-full bg-whitey border border-disabled shadow-sm p-4 gap-4 h-[179px]">
      
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
              className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded-full"
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
