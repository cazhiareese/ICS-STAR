import React, { useEffect, useState } from 'react';
import { Plus, MoveLeft, MoveRight } from 'lucide-react';
import AdminNewsletterCard from '../../../components/AdminComponents/AdminNewsletterCard';
import axios from 'axios';
import CircularLoading from '../../../components/LoadingComponents/circularloading';
import { useNavigate } from 'react-router-dom';

function AdminNewsletter() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newsletters, setNewsletters] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const limit = 5; // Number of newsletters per page, matching updated code

  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        setLoading(true);
        setError(null);

        const skip = (page - 1) * limit;
        const url = `${import.meta.env.VITE_BACKEND_URL}/api/admin/newsletter/get?skip=${skip}&limit=${limit}`;

        const response = await axios.get(url);
        const { news, total_count } = response.data;

        // Set newsletters directly, as API returns only non-deleted entries
        setNewsletters(news);

        // Calculate total pages using total_count (non-deleted newsletters only)
        setTotalPages(Math.max(1, Math.ceil(total_count / limit)));

        // Extract unique tags from newsletters
        const allTags = news.reduce((acc, newsletter) => {
          return [...acc, ...newsletter.tags];
        }, []);
        setTags([...new Set(allTags)]); // Remove duplicates

        setLoading(false);
      } catch (err) {
        setError('Failed to fetch newsletters');
        setLoading(false);
      }
    };

    fetchNewsletters();
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
        <CircularLoading />
      </div>
    );
  }

  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className='h-screen w-full p-6 flex flex-col'>
      {/* Header */}
      <div className='flex flex-row justify-between mb-10'>
        <h1 className='font-satoshi-bold text-5xl text-black'>Newsletter</h1>
        <button
          className='flex flex-row items-center justify-center gap-2 font-satoshi-bold text-white bg-primary px-6 py-3 rounded-2xl hover:bg-hover cursor-pointer'
          onClick={() => { navigate("/admin/newsletter/create-newsletter") }}
        >
          <Plus /> New Newsletter
        </button>
      </div>

      {/* Page controls */}
      <div className='flex flex-col w-full lg:w-auto lg:flex-row items-center lg:justify-between lg:ml-5 gap-2 lg:gap-0'>
        <div className='w-full lg:w-auto min-w-xs'></div>
        <div className='items-center gap-2 text-md font-satoshi-regular hidden lg:flex'>
          <MoveLeft
            className='cursor-pointer'
            onClick={() => handlePageChange(page - 1)}
          />
          <p> Page </p>
          <input
            type='text'
            value={page}
            onChange={(e) => {
              const newPage = parseInt(e.target.value);
              if (!isNaN(newPage)) handlePageChange(newPage);
            }}
            className='w-9 text-center border border-disabled rounded-md outline-none text-primary font-satoshi-bold'
          />
          <p>of {totalPages}</p>
          <MoveRight
            className='cursor-pointer'
            onClick={() => handlePageChange(page + 1)}
          />
        </div>
      </div>

      {/* Card display section */}
      <div className="flex flex-col items-center w-full mt-4">
        <div className="flex flex-col w-full max-w-full px-5">
          {newsletters.length === 0 ? (
            <p className="text-center">No newsletters found</p>
          ) : (
            newsletters.map((item) => (
              <AdminNewsletterCard
                key={item.newsletter_id}
                id={item.newsletter_id} // Pass newsletter_id as id prop
                title={item.title}
                image={item.image}
                date_posted={item.date_posted}
                context={item.content || 'No content available'} // Fallback for missing content
                tags={item.tags}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminNewsletter;