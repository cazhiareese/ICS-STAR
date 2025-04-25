import React, { useEffect, useState } from 'react';
import { Plus, MoveLeft, MoveRight } from 'lucide-react';
import AdminNewsletterCard from '../../../components/AdminComponents/AdminNewsletterCard';
import axios from 'axios';
import EventsTable from '../../../components/AdminComponents/EventsTable';
import CircularLoading from '../../../components/LoadingComponents/circularloading';
import { Navigate, useNavigate } from 'react-router-dom';

function AdminNewsletter() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(48);
  const [newsletter, setNewsletter] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const dummy = {
      title: 'Sample Title',
      image: null,
      date_posted: '2025-04-26',
      context: 'This is a sample context description for the dummy data.'
    };

    const tags = ['Tag1', 'Tag2', 'Tag3', 'Tag4', 'Tag5'];
    setTags(tags);
    const duplicatedData = Array(4).fill().map(() => ({ ...dummy }));

    setNewsletter(duplicatedData);
  }, []);

  return (
    <div className='h-screen w-full p-6 flex flex-col'>
      {/* Header */}
      <div className='flex flex-row justify-between mb-10'>
        <h1 className='font-satoshi-bold text-5xl text-black'>Newsletter</h1>
        <button
          className='flex flex-row items-center justify-center gap-2 font-satoshi-regular text-white bg-primary px-6 py-3 rounded-2xl hover:bg-hover cursor-pointer'
          onClick={() => {}}
        >
          <Plus /> New Newsletter
        </button>
      </div>

      {/* Page controls */}
      <div className='flex flex-col w-full lg:w-auto lg:flex-row items-center lg:justify-between lg:ml-5 gap-2 lg:gap-0'>
        <div className='w-full lg:w-auto  min-w-xs'></div>
        <div className='items-center gap-2 text-md font-satoshi-regular hidden lg:flex'>
          <MoveLeft className='cursor-pointer' onClick={() => {}} />
          <p> Page </p>
          <input
            type='text'
            value={page}
            onChange={() => {}}
            className='w-9 text-center border border-disabled rounded-md outline-none text-primary font-satoshi-bold'
          />
          <p>of {totalPages}</p>
          <MoveRight className='cursor-pointer' onClick={() => {}} />
        </div>
      </div>

      {/* Card display section */}
      <div className="flex flex-col items-center w-full mt-4">
      <div className="flex flex-col  w-full max-w-full px-5 ">
          {newsletter.map((item, index) => (
            <AdminNewsletterCard
  key={index}
  title={item.title}
  image={item.image}
  date_posted={item.date_posted}
  context={item.context}
  tags={tags}
/>

          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminNewsletter;
