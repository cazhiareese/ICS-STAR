import React from 'react'

function DonationOptions(
    {
        isAnonymous,
        setIsAnonymous
    }
) {
    const handleChange = (e) => {
        setIsAnonymous(e.target.checked);
        // console.log(isAnonymous);
    };
    return (
        <div className='outline-2 rounded-3xl outline-neutral-400 py-8 px-8 w-full'>
            <h1 className='font-satoshi-medium pb-3'>Donation Options</h1>
            <label className="flex items-center gap-2 ml-5">
                {/* TODO: modify checkbox */}
                <input type="checkbox" checked={isAnonymous} onChange={handleChange} className="bg-primary w-4 h-4"/> 
                <span className='font-satoshi-regular'>Make my donation anonymous</span>
            </label>
        </div>
    )
}

export default DonationOptions