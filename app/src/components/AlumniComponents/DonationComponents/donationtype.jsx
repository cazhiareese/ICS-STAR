import React from 'react'
import {BanknoteIcon, Package} from'lucide-react'

function DonationType({donationType}) {
    // Monetary donation button
    if (donationType == 'monetary') {
        return (
            // TODO: Add color changed when clicked
            <button className='flex flex-col w-40 rounded-3xl outline-black outline-1 px-5 py-6 gap-7 items-baseline'> 
                <h1 className='text-black'><BanknoteIcon size={45}/></h1>
                <h1 className='text-xl font-satoshi-bold'>Monetary</h1>
            </button>
        )
    }

    //In-kind donation buttoo
    if (donationType == 'inKind') {
        return (
            // TODO: Add color changed when clicked
            <button className='flex flex-col w-40 rounded-3xl outline-black outline-1 px-5 py-6 gap-7 items-baseline'> 
                <h1 className='text-black'><Package size={45}/></h1>
                <h1 className='text-xl font-satoshi-bold'>In-kind</h1>
            </button>
        )
    }

    return null;
}

export default DonationType