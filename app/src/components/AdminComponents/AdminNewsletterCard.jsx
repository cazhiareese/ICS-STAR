import React from 'react';
import { Calendar } from 'lucide-react';

const AdminNewsletterCard = ({ title, image, date_posted, context, tags = [] }) => {
    console.log("Tags:", tags); // Debugging line to check the tags array
  return (
    <div className="flex w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-4 gap-4">
      
      {/* Left Side Image */}
      <img
        src={image}
        alt={title}
        className="w-28 h-28 rounded-xl object-cover"
      />

      {/* Right Side Content */}
      <div className="flex flex-col flex-1">
        {/* Title and Date */}
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-satoshi-bold text-black">{title}</h2>
          <div className="flex items-center text-gray-400 text-sm">
            <Calendar className="w-4 h-4 mr-1" />
            {date_posted}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {context}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
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
