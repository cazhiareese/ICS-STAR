import React from 'react'
import logo from '../assets/Subtract.png'

function IcsStarLogo() {
  return (
    <div className="text-xl font-bold flex items-center">
      <img src={logo} alt="Logo" className="h-6 mr-2" /> 
      <span className="text-2xl pl-2 font-satoshi-black text-primary tracking-wide"> ICS - STAR </span> {/* Custom Font & Color */}
  </div>
  )
}

export default IcsStarLogo
