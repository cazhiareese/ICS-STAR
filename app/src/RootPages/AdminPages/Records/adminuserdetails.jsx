import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { MoveLeft, Check, ShieldAlert, MapPin, Phone, IdCard, GraduationCap  } from 'lucide-react';

function AdminUserDetails() {
  const navigate = useNavigate()
  const { userid } = useParams();
  useEffect(() => {
      console.log(userid);
  }, [userid])
  // const [user, setUser] = useState(null);

  function makeAlumni() {
    alert("Made alumni")
  }

  const skills = ['Artificial Intelligence', 'Cybersecurity', 'Web Development']
  const affiliations = [
    {
      "organization": "Young Software Engineers' Society",
      "role": "Resident Member"
    },
    {
      "organization": "Young Software Engineers' Society",
      "role": "Resident Member"
    },
    {
      "organization": "Young Software Engineers' Society",
      "role": "Resident Member"
    }
  ]
  const scholarships = ["DOST Scholarship", "UPLB SLAS"]
  return (
    <div className='p-6 overflow-auto h-screen'>
      {/* Back */}
      <button className="flex gap-2 mb-3 flex-row items-center cursor-pointer" onClick={() => navigate(-1)}>
        <MoveLeft className='text-primary'/> 
        <p className='text-primary font-satoshi-medium text-lg'>Back</p>
      </button>
      {/* Records and confirmation button*/}
      <div className='flex justify-between items-center mb-5'>
        <h1 className='text-primary font-satoshi-bold text-3xl'>Records</h1>
        <button className='flex items-center bg-success text-white text-md font-satoshi-regular gap-2 rounded-3xl px-4 py-2 cursor-pointer' onClick={() => {makeAlumni()}}>
          <Check className='' size={20}/>
          <p> Make Alumni</p>
        </button>
      </div>
      {/* Basic information */}
      <div className='flex flex-row border border-gray-300 rounded-xl w-full p-6 mb-6'>
        <div className='border border-black rounded-full h-30 w-30'></div>
        <div className='flex flex-col justify-center ml-8'>
          <h2 className='font-satoshi-bold text-3xl'>Kiefer Tayawa</h2>
          <p className='font-satoshi-light'>kltayawa@up.edu.ph</p>
        </div>
        <button className='flex flex-row gap-2 ml-auto text-error font-satoshi-medium'>
          <p>View Report Logs</p>
          <ShieldAlert/>
        </button>
      </div>
      {/* Personal information */}
      <h2 className='font-satoshi-medium text-xl'> PERSONAL INFORMATION</h2>
      <div className='border-t border-gray-300 flex flex-row justify-between text-lg py-5 w-full mb-5'>
      {/* Personal information cards */}
        {/* Location */}
        <div className='flex flex-col'>
          <div className='flex items-center'>
            <MapPin/>
            <h3 className='font-satoshi-light ml-1'>Location</h3>
          </div>
          <h3 className='font-satoshi-medium ml-7'> Manila, PH</h3>
        </div>
        {/* Mobile Number */}
        <div className='flex flex-col'>
          <div className='flex items-center'>
            <MapPin/>
            <h3 className='font-satoshi-light ml-1'>Mobile Number</h3>
          </div>
          <h3 className='font-satoshi-medium ml-7'> 09123456789</h3>
        </div>
        {/* Student Number */}
        <div className='flex flex-col'>
          <div className='flex items-center'>
            <MapPin/>
            <h3 className='font-satoshi-light ml-1'>Student Number</h3>
          </div>
          <h3 className='font-satoshi-medium ml-7'> 1234-56789 </h3>
        </div>
        {/* Graduating Class */}
        <div className='flex flex-col'>
          <div className='flex items-center'>
            <MapPin/>
            <h3 className='font-satoshi-light ml-1'>Graduating Class</h3>
          </div>
          <h3 className='font-satoshi-medium ml-7'> 2022 - 1st Semester</h3>
        </div>
      </div>
      {/* SKILLS AND INTERESTS */}
      <h2 className='font-satoshi-medium text-xl'> SKILLS AND INTERESTS</h2>
      <div className='border-t border-gray-300 flex flex-row gap-3 py-5 mb-5'>
        {skills.map((skill, index) => (
          <div key={index} className="rounded-4xl p-2 border-2 w-fit border-black">
            <p className='font-satoshi-medium'> {skill} </p>
          </div>
        ))}
      </div>
      {/* AFFILIATIONS */}
      <h2 className='font-satoshi-medium text-xl'> SKILLS AND INTERESTS</h2>
      <div className='border-t border-gray-300 grid grid-cols-2 w-full gap-3 py-5 mb-5'>
        {affiliations.map((affiliation, index) => (
          <div key={index} className="">
            <p className='font-satoshi-medium'> {affiliation.organization} </p>
            <p className='font-satoshi-light'> {affiliation.role}</p>
          </div>
        ))}
      </div>
      {/* SCHOLARSHIPS */}
      <h2 className='font-satoshi-medium text-xl'> SCHOLARSHIPS </h2>
      <div className='border-t border-gray-300 grid grid-cols-2 w-full gap-3 py-5 mb-5'>
        {scholarships.map((scholarship, index) => (
          <div key={index} className="">
            <p className='font-satoshi-medium'> {scholarship} </p>
          </div>
        ))}
      </div>
    </div>
    
  )
}

export default AdminUserDetails
