import React from 'react';

const AdminNewsletterCard = ({ title, image, date_posted, context }) => {
  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl shadow p-4 flex flex-col gap-3">
      <img
        className="w-full h-40 object-cover rounded-xl"
        src={image}
        alt={title}
      />
      <h2 className="text-xl font-satoshi-bold text-black">{title}</h2>
      <p className="text-sm text-gray-500">{date_posted}</p>
      <p className="text-sm text-gray-700">{context}</p>
    </div>
  );
};

export default AdminNewsletterCard;
