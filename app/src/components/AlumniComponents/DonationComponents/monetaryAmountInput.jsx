import React from 'react'


function MonetaryAmountInput({
    monetaryAmountInput,
    setMonetaryAmountInput,
    paymentError
}) {
    // Handle change in input of amount
    const handleChange = (e) => {
        setMonetaryAmountInput(e.target.value);
    };

    return (
        <div className='outline-2 rounded-3xl outline-neutral-400 py-8 px-8 w-full'>
            <h1 className='text-lg font-satoshi-medium pb-3'>Enter Amount <span className='text-error'>*</span></h1>
            {/* Input Box */}
            <div className="relative w-full h-14">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black text-xl">₱</span>
                <input
                    type="number"
                    className="bg-white font-satoshi-medium text-lg w-full h-full pl-10 pr-4 py-2 rounded-2xl text-black border border-neutral-400 focus:border-primary focus:outline-none focus:ring-0"
                    onChange={handleChange}
                />
            </div>
            {paymentError && (<h1 className='text-error text-sm font-satoshi-regular justify-start w-full flex pt-1'>Please enter a valid amount.</h1>)}
        </div>
    )
}

export default MonetaryAmountInput