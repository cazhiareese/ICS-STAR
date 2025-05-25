import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MoveLeft } from 'lucide-react'
import SortModal from '../../../components/AdminComponents/sortmodal'
import OrderToggle from '../../../components/AdminComponents/ordertoggle'
import EventDemographicTable from '../../../components/AdminComponents/EventDemographicTable'
import axios from 'axios'

function AdminEventDemographics() {
  const navigate = useNavigate()
  const { eventid } = useParams()
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL
  const [demographics, setDemographics] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchDemographics(token) {
    const response = await axios.get(`${API_BASE_URL}/api/admin/events/demographics/${eventid}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
    console.log(response)
    setDemographics(response.data)
  }

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");
      setLoading(true)
      try {
        await fetchDemographics(token)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])
  return (
    <div className='h-screen w-full p-6 flex flex-col px-32 bg-white'>
      {/* Back */}
      <button className="flex gap-2 mb-3 flex-row items-center cursor-pointer" onClick={() => navigate(-1)}>
        <MoveLeft className='text-primary' />
        <p className='text-primary font-satoshi-medium text-lg'>Back to event details</p>
      </button>
      <h1 className='font-satoshi-bold text-black text-5xl'>Demographics</h1>
      {/* Sorting */}
      <div className='flex flex-row justify-end'>
        {/* <SortModal filters={['RSVP Count', 'Batch']} selectedFilter='RSVP Count' onSelect={() => {}}/>
        <OrderToggle direction='asc' onToggle={() => {}}/> */}
      </div>
      <div className='w-full h-full overflow-auto border border-gray-300 rounded-3xl mt-4 items-center justify-center'>
        <EventDemographicTable data={demographics} />
      </div>
    </div>
  )
}

export default AdminEventDemographics
