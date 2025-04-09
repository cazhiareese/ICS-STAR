import React from 'react'

function DonationInstructions() {
    return (
        <div className='outline-2 rounded-3xl outline-neutral-400 py-10 px-10 w-full'>
            {/* Donation Instruction */}
            <h1 className='text-2xl font-satoshi-bold pb-3'>Donation Instructions</h1>
            {/* Ordered Steps */}
            <ol>
                <li className='font-satoshi-regular text-md'>1. Scan the QR Code and send your donation.</li>
                {/* QR code */}
                <img src="sample" alt="Placeholder" className="w-40 h-40 rounded-3xl outline my-5 ml-20" />
                <li className='font-satoshi-regular text-md'>2. Take a screenshot of your transaction and upload it as proof of payment.</li>
                <li className='font-satoshi-regular text-md'>3. After submitting this form, wait for the admin to acknowledge your donation.</li>
            </ol>

        </div>
    )
}

export default DonationInstructions