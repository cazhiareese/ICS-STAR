import React, { useState, useEffect, useMemo, useRef   } from "react";
import {ArrowLeft} from'lucide-react'
import DonationType from '../../../components/AlumniComponents/DonationComponents/donationtype';
import MonetaryAmountInput from "../../../components/AlumniComponents/DonationComponents/monetaryAmountInput";
import DonationInstructions from "../../../components/AlumniComponents/DonationComponents/donationInstructions";
import PaymentProof from "../../../components/AlumniComponents/DonationComponents/paymentProof";

function Donationform() {
    // UseState for checking if the buttons are activated
    const [isMonetaryTypeOpen, setIsMonetaryTypeOpen] = useState(true);
    const [isInKindTypeOpen, setIsInKindTypeOpen] = useState(false);

    // Money donation amount
    const [monetaryAmountInput, setMonetaryAmountInput] = useState(0);

    return (
        <div className='flex flex-row mx-48 my-16'>
            {/* Make a Donation Part */}
            <div className='flex flex-col w-7/12'>
                {/* Back button */}
                <button className='text-primary flex gap-5'>
                    <ArrowLeft size={30}/>
                    <span className='font-satoshi-medium text-primary text-2xl'>Back</span>
                </button>

                {/* Make a donation title */}
                <h1 className='font-satoshi-bold text-black text-4xl pt-10'>Make a donation</h1>

                {/* Donation Type Picker */}
                <h1 className='font-satoshi-bold text-black text-lg pt-10 pb-5'>Donation Type</h1>
                {/* Buttons for Donation Types */}
                <div className='flex flex-row gap-7 pb-5'>
                    {/* Monetary Donation Type Button */}
                    <DonationType donationType={"monetary"} 
                        isInKindTypeOpen={isInKindTypeOpen}
                        isMonetaryTypeOpen={isMonetaryTypeOpen}
                        setIsInKindTypeOpen={setIsInKindTypeOpen}
                        setIsMonetaryTypeOpen={setIsMonetaryTypeOpen}
                        />

                    {/* In-kind Donation Type Button */}
                    <DonationType donationType={"inKind"}
                        isInKindTypeOpen={isInKindTypeOpen}
                        isMonetaryTypeOpen={isMonetaryTypeOpen}
                        setIsInKindTypeOpen={setIsInKindTypeOpen}
                        setIsMonetaryTypeOpen={setIsMonetaryTypeOpen}
                    />
                </div>
                {/* Monetary donation contents */}
                <div className='flex flex-col gap-5'>
                    {/* Monetary Donation Inputs */}
                    <MonetaryAmountInput
                        monetaryAmountInput={monetaryAmountInput}
                        setMonetaryAmountInput={setMonetaryAmountInput}
                    />

                    {/* Donation Instruction */}
                    <DonationInstructions/>

                    {/* Proof of payment */}
                    <PaymentProof/>
                </div>
            </div>
        </div>
    )
}

export default Donationform;