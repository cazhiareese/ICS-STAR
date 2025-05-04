import React from 'react';
import maya from "../../../assets/maya_logo.png";

function PaymentMode({}) {
  return (
    <div className='outline-2 rounded-3xl outline-neutral-400 py-8 px-8 w-full'>
      <h1 className='text-lg font-satoshi-medium pb-3'>Choose a Payment Method</h1>
      <div className='flex gap-4'>
        {/* Pay via QR Button */}
        <button className='flex-1 py-3 rounded-2xl border-2 border-primary text-primary font-satoshi-bold cursor-pointer'>
          Pay via QR
        </button>

        {/* Pay with Maya Button */}
        <button className='flex items-center justify-center gap-2 flex-1 py-3 cursor-pointer rounded-2xl border-2 border-gray-300 text-gray-700 font-satoshi-bold hover:bg-gray-100'>
          Pay with
          <img src={maya} alt='maya logo' className='h-4 mt-1.5' />
        </button>
      </div>
    </div>
  );
}

export default PaymentMode;
