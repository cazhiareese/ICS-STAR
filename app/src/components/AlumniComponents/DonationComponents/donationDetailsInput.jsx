import React from 'react'

function DonationDetailsInput(
    {
        donationDetailsInput,
        setDonationDetailsInput
    }
) {

    const handleChange = (e) => {
        setDonationDetailsInput(e.target.value);
    };
    return (
        <div className='outline-2 rounded-3xl outline-neutral-400 py-8 px-8 w-full'>
            <h1 className='text-lg font-satoshi-medium pb-3'>Donation Details</h1>
            {/* Input Box */}
            <div className="relative w-full h-28">
                
            <textarea
                type="text"
                className="bg-white font-satoshi-medium text-md w-full h-32 pl-10 pr-4 py-2 rounded-2xl text-black border border-neutral-400 focus:border-primary focus:outline-none focus:ring-0"
                placeholder="List your donations or services"
                onChange={handleChange}
            />

            </div>
        </div>
    )
}

export default DonationDetailsInput