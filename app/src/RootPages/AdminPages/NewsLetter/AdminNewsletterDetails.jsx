import { useEffect, useState } from 'react'
import { MoveLeft, Pencil, Trash2, CalendarDays } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function AdminNewsletterDetails() {
  const navigate = useNavigate();
  const [newsletter, setNewsletter] = useState(null);

  useEffect(() => {
    const longContext = `Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis... (etc)`;

    const dummy = {
      title: 'Sample Title',
      image: null, // no image
      date_posted: '2025-04-26',
      context: longContext,
      tags: ['Tag1', 'Tag2', 'Tag3', 'Tag4', 'Tag5'],
      link: [
        'https://www.youtube.com/watch?v=oXdw4w9WgXcQ&pp=ygUJcmlnYnkgZG9n',
        'https://www.youtube.com/watch?v=oXdw4w9WgXcQ&pp=ygUJcmlnYnkgZG9n'
      ]
    };

    setNewsletter(dummy);
  }, []);

  if (!newsletter) return null;

  return (
    <div className="p-6 min-h-screen w-full flex flex-col">
      
      {/* Header Row */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        {/* Back Button */}
        <button
          className="flex gap-2 flex-row items-center cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <MoveLeft className="text-primary" />
          <p className="text-primary font-satoshi-medium text-lg">Back </p>
        </button>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button className="bg-primary rounded-3xl px-6 py-2 flex flex-row items-center gap-2 justify-center text-white shadow-lg cursor-pointer">
            <Pencil />
            <p className="font-satoshi-regular text-lg">Edit Newsletter</p>
          </button>
          <button className="bg-red-700 rounded-3xl px-6 py-2 flex flex-row items-center gap-2 justify-center text-white shadow-lg cursor-pointer">
            <Trash2 />
            <p className="font-satoshi-regular text-lg">Delete Newsletter</p>
          </button>
        </div>
      </div>

      {/* Card */}
      <div className="flex justify-center w-full">
      <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-6 w-[1350px] justify">
        {/* Image or Placeholder */}
        {newsletter.image ? (
          <img
            src={newsletter.image}
            alt="Newsletter"
            className="w-full h-[500px] object-cover rounded-xl"
          />
        ) : (
          <div className="w-full h-[500px] bg-blue-200 rounded-xl flex items-center justify-center text-blue-600 font-bold text-2xl">
            No Image Available
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl font-satoshi-bold">{newsletter.title}</h1>

        {/* Date */}
        <div className="flex items-center gap-2 text-gray-500">
          <CalendarDays className="w-5 h-5" />
          <p className="font-satoshi-regular">{new Date(newsletter.date_posted).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
          })}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {newsletter.tags.map((tag, index) => (
            <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
              {tag}
            </span>
          ))}
        </div>

        {/* Context */}
        <div className="text-gray-700 whitespace-pre-line leading-relaxed font-satoshi-regular">
          {newsletter.context}
        </div>

        {/* Links */}
        {newsletter.link.length > 0 && (
          <div className="flex flex-col gap-2 mt-4">
            <h2 className="text-lg font-satoshi-medium text-gray-800">Relevant Links:</h2>
            {newsletter.link.map((link, index) => (
              <a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-all"
              >
                {link}
              </a>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  )
}

export default AdminNewsletterDetails;
