import { useEffect, useState } from 'react'
import { MoveLeft, Pencil, Trash2, CalendarDays, Link } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import CircularLoading from '../../../components/LoadingComponents/circularloading';
import NewsletterModal from '../../../components/AdminComponents/Adminnewslettermodal'

function AdminNewsletterDetails() {
  const { id } = useParams() // Get newsletter ID from URL params
  const navigate = useNavigate()
  const [newsletter, setNewsletter] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const option = "delete"

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  useEffect(() => {
    const fetchNewsletter = async () => {
      try {
        const token = localStorage.getItem('token');
        setLoading(true)
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/newsletter/${id}`, {headers: {Authorization: `Bearer ${token}`}}
        )
        setNewsletter(response.data)
        setLoading(false)
      } catch (err) {
        setError(
          err.response?.status === 404
            ? 'Newsletter not found'
            : err.response?.status === 422
            ? 'Invalid newsletter ID format'
            : 'Failed to fetch newsletter'
        )
        setLoading(false)
      }
    }

    if (id) {
      fetchNewsletter()
    }
  }, [id])

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen w-full'>
        <CircularLoading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 min-h-screen w-full flex items-center justify-center">
        <p className="text-red-700">{error}</p>
      </div>
    )
  }

  if (!newsletter) return null

  return (
    <div className="p-6 min-h-screen w-full flex flex-col">
      {/* Header Row */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <button
          className="flex gap-2 flex-row items-center cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <MoveLeft className="text-primary" />
          <p className="text-primary font-satoshi-medium text-lg">Back</p>
        </button>

        <div className="flex gap-2">
          <button
            className="bg-primary rounded-3xl px-6 py-2 flex flex-row items-center gap-2 justify-center text-white shadow-lg cursor-pointer"
            onClick={() => navigate("edit-newsletter")}
          >
            <Pencil />
            <p className="font-satoshi-regular text-lg">Edit</p>
          </button>
          <button
            className="bg-red-700 rounded-3xl px-6 py-2 flex flex-row items-center gap-2 justify-center text-white shadow-lg cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <Trash2 />
            <p className="font-satoshi-regular text-lg">Delete</p>
          </button>
        </div>
      </div>

      {/* Card */}
      <div className="flex justify-center w-full">
        <div className="bg-whitey rounded-[20px] border border-disabled p-6 flex flex-col gap-4 w-[1350px]">
          {newsletter.image ? (
            <img
              src={newsletter.image}
              alt={newsletter.title}
              className="w-full h-[500px] object-cover rounded-xl"
            />
          ) : (
            <div className="w-full h-[500px] bg-primary rounded-xl flex items-center justify-center text-white font-bold text-2xl">
              No Image Available
            </div>
          )}

          <h1 className="text-[40px] font-satoshi-bold">{newsletter.title}</h1>

          <div className="flex items-center gap-2 text-black font-satoshi-regular">
            <CalendarDays className="w-5 h-5" />
            <p className="font-satoshi-regular">
              {new Date(newsletter.date_posted).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {newsletter.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="text-black whitespace-pre-line leading-relaxed font-satoshi-regular w-full">
            {newsletter.content}
          </div>

          {newsletter.links?.length > 0 && (
            <div className="flex flex-col gap-2 mt-4">
              <h2 className="text-l font-satoshi-medium text-black">
                Relevant Links:
              </h2>
              {newsletter.links.map((link, index) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline break-all flex items-center gap-2 font-satoshi-regular"
                >
                  <Link className="w-4 h-4" />
                  {link}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
      <NewsletterModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        option={option}
        id={id}
      />
    </div>
  )
}

export default AdminNewsletterDetails