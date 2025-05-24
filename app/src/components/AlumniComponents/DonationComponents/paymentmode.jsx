import React, { useState } from 'react';
import maya from "../../../assets/maya_logo.png";

function PaymentMode({ submitMayaDonation, tokentype }) {
  const [activeButton, setActiveButton] = useState('qr'); // 'qr' is now the default

  const handlePayWithMaya = () => {
    setActiveButton('maya');
    submitMayaDonation();
  };

  const handlePayViaQR = () => {
    setActiveButton('qr');
  };

  return (
    <div className='outline-2 rounded-3xl outline-neutral-400 py-8 px-8 w-full'>
      <h1 className='text-lg font-satoshi-medium pb-3'>Choose a Payment Method</h1>
      <div className='flex gap-4 md:flex-row flex-col'>
        {/* Pay via QR Button */}
        <button
          onClick={handlePayViaQR}
          className={`flex-1 py-3 rounded-2xl border-2 ${activeButton === 'qr' ? 'border-primary' : 'border-gray-300'} text-primary font-satoshi-bold cursor-pointer`}
        >
          Pay via QR
        </button>

{/* Pay with Maya Button */}
<button
  onClick={handlePayWithMaya}
  disabled={tokentype === "guest"}
  className={`flex items-center justify-center gap-2 flex-1 py-3 cursor-pointer rounded-2xl border-2 
    ${activeButton === 'maya' ? 'border-primary' : 'border-gray-300'} 
    ${tokentype === "guest" ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'} 
    text-gray-700 font-satoshi-bold`}
>
  Pay with
  <img src={maya} alt='maya logo' className='h-4 mt-1.5' />
</button>

      </div>
    </div>
  );
}

export default PaymentMode;
