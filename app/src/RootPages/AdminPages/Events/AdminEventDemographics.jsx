import React from 'react'
import { useParams } from 'react-router-dom'

function AdminEventDemographics() {
    const {eventid} = useParams()
    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL
    return (
    <div>  
      {eventid}
    </div>
  )
}

export default AdminEventDemographics
