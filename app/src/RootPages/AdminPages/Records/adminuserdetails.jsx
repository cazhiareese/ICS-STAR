import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { MoveLeft } from 'lucide-react';

function AdminUserDetails() {
    const navigate = useNavigate()
    const { userid } = useParams();
    useEffect(() => {
        console.log(userid);
    }, [userid])
    // const [user, setUser] = useState(null);

  return (
    <div className='p-6'>
        <button className='flex text-primary font-satoshi-regular cursor-pointer' onClick={() => {navigate(-1)}}>
            <MoveLeft/>
            <p>Back</p>
        </button>
        <h1 className='text-primary font-satoshi-bold text-3xl'>Records</h1>
    </div>
  )
}

export default AdminUserDetails
