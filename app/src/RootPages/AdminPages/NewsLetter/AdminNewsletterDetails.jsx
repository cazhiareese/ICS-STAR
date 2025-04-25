import {useEffect, useState} from 'react'
import { MoveLeft, Pencil, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function AdminNewsletterDetails() {
  const navigate = useNavigate();
  const [newsletter, setNewsletter] = useState(null);

  useEffect(() => {
    const longContext = `Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
    
    Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
    
    Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibussem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
    
    Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.

    Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.`;
  
    const dummy = {
      title: 'Sample Title',
      image: null,
      date_posted: '2025-04-26',
      context: longContext,
      tags: ['Tag1', 'Tag2', 'Tag3', 'Tag4', 'Tag5'],
      link: ['http://example.com', 'http://example2.com', 'http://example3.com']
    };
  
    setNewsletter(dummy);
  }, []);
  
  console.log("Newsletters:", newsletter); // Debugging line to check the newsletter object

  return (
    <div className="p-6 h-screen w-full flex flex-col">
      
      {/* Header Row: Back + Action Buttons */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        {/* Back Button */}
        <button
          className="flex gap-2 flex-row items-center cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <MoveLeft className="text-primary" />
          <p className="text-primary font-satoshi-medium text-lg">Back to events</p>
        </button>

        {/* Action Buttons (Edit + Delete) */}
        <div className="flex gap-2">
          {/* Edit Button */}
          <button className="bg-primary rounded-3xl px-6 py-2 flex flex-row items-center gap-2 justify-center text-white shadow-lg cursor-pointer">
            <Pencil />
            <p className="font-satoshi-regular text-lg">Edit NewsLetter</p>
          </button>

          {/* Delete Button */}
          <button className="bg-red-700 rounded-3xl px-6 py-2 flex flex-row items-center gap-2 justify-center text-white shadow-lg cursor-pointer">
            <Trash2 />
            <p className="font-satoshi-regular text-lg">Delete NewsLetter</p>
          </button>
        </div>
      </div>

      {/* Rest of the content */}
      {/* ... */}

    </div>
  )
}

export default AdminNewsletterDetails;
