import React, { useState, useEffect, useMemo, useRef   } from "react";
import {ArrowLeft} from'lucide-react'
import DonationType from '../../../components/AlumniComponents/DonationComponents/donationtype';
import MonetaryAmountInput from "../../../components/AlumniComponents/DonationComponents/monetaryAmountInput";
import DonationInstructions from "../../../components/AlumniComponents/DonationComponents/donationInstructions";
import PaymentProof from "../../../components/AlumniComponents/DonationComponents/paymentProof";
import DonationOptions from "../../../components/AlumniComponents/DonationComponents/donationOptions";
import DonationDetailsInput from "../../../components/AlumniComponents/DonationComponents/donationDetailsInput";

function Donationform() {
    // UseState for checking if the buttons are activated
    const [isMonetaryTypeOpen, setIsMonetaryTypeOpen] = useState(true);
    const [isInKindTypeOpen, setIsInKindTypeOpen] = useState(false);

    // MONETARY TYPE
    // Money donation amount
    const [monetaryAmountInput, setMonetaryAmountInput] = useState(0);

    // File handling
    const fileInputRef = useRef(null);
    const [fileName, setFileName] = useState('');

    // Anonymous donation?
    const [isAnonymous, setIsAnonymous] = useState(false);

    // IN-KIND TYPE
    const [donationDetailsInput, setDonationDetailsInput] = useState("");

    return (
        <div className='flex flex-row mx-48 my-16 gap-5'>
            {/* Make a Donation Part */}
            <div className='flex flex-col w-7/12'>
                {/* Back button */}
                <button className='text-primary flex gap-5 cursor-pointer'>
                    <ArrowLeft size={25}/>
                    <span className='font-satoshi-medium text-primary text-xl'>Back</span>
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
                {isMonetaryTypeOpen && (
                    /* Monetary donation contents */
                    <div className='flex flex-col gap-5'>
                        {/* Monetary Donation Inputs */}
                        <MonetaryAmountInput
                            monetaryAmountInput={monetaryAmountInput}
                            setMonetaryAmountInput={setMonetaryAmountInput}
                        />

                        {/* Donation Instruction */}
                        <DonationInstructions donationType={"monetary"}/>

                        {/* Proof of payment */}
                        <PaymentProof fileInputRef={fileInputRef} fileName={fileName} setFileName={setFileName}/>

                        {/* Donation Options */}
                        <DonationOptions isAnonymous={isAnonymous} setIsAnonymous={setIsAnonymous}/>

                        {/* Submit Button */}
                        <button className="rounded-2xl justify-center bg-primary font-satoshi-medium text-white text-md w-1/3 h-12 ml-auto cursor-pointer">
                            Submit
                        </button>
                    </div>
                )}

                {isInKindTypeOpen && (
                    /* Monetary donation contents */
                    <div className='flex flex-col gap-5'>
                        {/* Donation Details Input */}
                        <DonationDetailsInput
                            donationDetailsInput={donationDetailsInput}
                            setDonationDetailsInput={setDonationDetailsInput}
                        />

                        {/* Donation Instruction */}
                        <DonationInstructions donationType={"inKind"}/>

                        {/* Submit Button */}
                        <button className="rounded-2xl justify-center bg-primary font-satoshi-medium text-white text-md w-1/3 h-12 ml-auto cursor-pointer">
                            Submit
                        </button>
                    </div>
                    
                )}

                
            </div>
            {/* PLACEHOLDER FOR MAR's COMPONENT */}
            <div className="outline-2 rounded-3xl outline-neutral-400 py-8 px-8 w-1/3 h-full">
                SAMPLE
            </div>
        </div>
    )
}

export default Donationform;