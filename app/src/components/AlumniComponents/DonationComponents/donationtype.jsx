import React from 'react'
import {BanknoteIcon, Package} from'lucide-react'

function DonationType({
    donationType,
    isMonetaryTypeOpen,
    isInKindTypeOpen,
    setIsMonetaryTypeOpen,
    setIsInKindTypeOpen
}) {
    // Monetary donation button
    if (donationType == 'monetary') {
        return (
            // Changes to color-primary when clicked
            <button className={`cursor-pointer flex flex-col w-40 rounded-3xl outline-2 px-5 py-6 gap-7 items-baseline ${isMonetaryTypeOpen ? 'outline-primary' : 'outline-black'}`}
            onClick={() => {
                setIsMonetaryTypeOpen(true);
                setIsInKindTypeOpen(false);
              }}
            > 
                <h1 className={`${isMonetaryTypeOpen ? 'text-primary' : 'text-black'}`}><BanknoteIcon size={45}/></h1>
                <h1 className={`${isMonetaryTypeOpen ? 'font-satoshi-bold' : 'font-satoshi-medium'} text-xl `}>Monetary</h1>
            </button>
        )
    }

    //In-kind donation button
    if (donationType == 'inKind') {
        return (
            // Changes to color-primary when clicked
            <button className={`cursor-pointer flex flex-col w-40 rounded-3xl outline-2 px-5 py-6 gap-7 items-baseline ${isInKindTypeOpen ? 'outline-primary' : 'outline-black'}`}
            onClick={() => {
                setIsMonetaryTypeOpen(false);
                setIsInKindTypeOpen(true);
                console.log("Inkinnd open")
              }}
            > 
                <h1 className={`${isInKindTypeOpen ? 'text-primary' : 'text-black'}`}><Package size={45}/></h1>
                <h1 className={`${isInKindTypeOpen ? 'font-satoshi-bold' : 'font-satoshi-medium'} text-xl `}>In-kind</h1>
            </button>
        )
    }

    return null;
}

export default DonationType