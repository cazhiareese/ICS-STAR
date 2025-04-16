import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft } from 'lucide-react';
import DonationType from '../../../components/AlumniComponents/DonationComponents/donationtype';
import MonetaryAmountInput from "../../../components/AlumniComponents/DonationComponents/monetaryAmountInput";
import DonationInstructions from "../../../components/AlumniComponents/DonationComponents/donationInstructions";
import PaymentProof from "../../../components/AlumniComponents/DonationComponents/paymentProof";
import DonationOptions from "../../../components/AlumniComponents/DonationComponents/donationOptions";
import DonationDetailsInput from "../../../components/AlumniComponents/DonationComponents/donationDetailsInput";
import check from "../../../assets/check.png";
import axios from "axios";
import CircularLoading from "../../../components/LoadingComponents/circularloading";
import { useParams } from "react-router-dom";
import DonationMainView from "../../../components/donationMainView";
// import DonationDeets from "../../../components/donationMainView.jsx";

function Donationform() {
    //const drive_id = "fe78d9ab-8baa-4872-80fa-94b0ffae0b97" //TODO: To be removed later
    const id = useParams(); // Get the drive_id from the URL params
    const drive_id = id.driveid; // Extract the drive_id from the params
    const formattedDate = new Date().toLocaleDateString();
    console.log(drive_id)
    // UseState for checking if the buttons are activated
    const [isMonetaryTypeOpen, setIsMonetaryTypeOpen] = useState(true);
    const [isInKindTypeOpen, setIsInKindTypeOpen] = useState(false);
    const [isMonetaryType, setIsMonetaryType] = useState(true);
    const [isInKindType, setIsInKindType] = useState(false);
    const [monetaryAmountInput, setMonetaryAmountInput] = useState(0);
    const fileInputRef = useRef(null);
    const [fileName, setFileName] = useState('');
    const [file, setFile] = useState(null);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [donationDetailsInput, setDonationDetailsInput] = useState(null);
    const [donationSuccess, setDonationSuccess] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [summary, setSummary] = useState({});
    const [summaryLoading, setSummaryLoading] = useState(true);
    const [driveDetails, setDriveDetails] = useState(null);

    const formatDate = (date) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(date).toLocaleDateString(undefined, options);
    };
    const handleFileSubmit = (file) => {
        setFile(file);
    };

    useEffect(() => {
        if (summary.donation_drive && summary.date && summary.user && summary.status) {
            setSummaryLoading(false); // Stop loading once summary data is available
        }

        
    }, [summary]);

        
    
        useEffect(() => {
            const token = localStorage.getItem("token");
    
            fetch(`https://ics-star-api.vercel.app/one-donation-drive/${drive_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    setDriveDetails(data);
                    console.log("Drive details:", data);
                })
                .catch((err) => {
                    console.error("Error fetching drive details:", err);
                });
        }, [drive_id]);

    // Submitting Monetary Donations
    const submitMonetaryDonation = async () => {
        // Ensure that all required fields are not empty
        if (monetaryAmountInput <= 0 || file == null) {
            alert("Please enter a valid amount and upload a proof of payment.");
            return;
        }
        setSubmitting(true);
        const formData = new FormData();
        const token = localStorage.getItem("token");

        formData.append('monetary_donation', true);
        formData.append('in_kind_donation', false);
        formData.append('amount', monetaryAmountInput);
        formData.append('is_anonymous', isAnonymous);

        if (file != null) {
            formData.append('proof', file);
        }

        try {
            const response = await axios.post(`https://ics-star-api.vercel.app/make-donation/${drive_id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                setDonationSuccess(true);
                setSummaryLoading(true); // Start loading for the summary
                setSummary(response.data); // Set summary after successful donation
                setIsMonetaryTypeOpen(false);
                setIsInKindTypeOpen(false);
                setSubmitting(false);
            } else {
                setSubmitting(false);
            }
        } catch (error) {
            console.error("Error submitting donation:", error);
            setSubmitting(false);
        }
    };

    const submitInKindDonation = async () => {
        // Ensure that all required fields are not empty
        if (donationDetailsInput == null) {
            alert("Please enter a donation description.");
            return;
        }
        setSubmitting(true);
        const formData = new FormData();
        const token = localStorage.getItem("token");

        formData.append('monetary_donation', false);
        formData.append('in_kind_donation', true);
        formData.append('description', donationDetailsInput);

        try {
            const response = await axios.post(`https://ics-star-api.vercel.app/make-donation/${drive_id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                setDonationSuccess(true);
                setSummaryLoading(true); // Start loading for the summary
                setSummary(response.data); // Set summary after successful donation
                setIsMonetaryTypeOpen(false);
                setIsInKindTypeOpen(false);
                setSubmitting(false);
            } else {
                setSubmitting(false);
            }
        } catch (error) {
            console.error("Error submitting donation:", error);
            setSubmitting(false);
        }
    };

    return (
        <>
            {!donationSuccess ? (
                <div className='flex lg:flex-row flex-col xl:mx-48 mx-12 my-16 gap-20'>
                    {/* Make a Donation Part */}
                    <div className='flex flex-col lg:w-7/12 w-full'>
                        {/* Back button */}
                        <button className='text-primary flex gap-5 cursor-pointer'>
                            <ArrowLeft size={25} />
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
                                setIsInKindType={setIsInKindType}
                                setIsMonetaryType={setIsMonetaryType}
                            />

                            {/* In-kind Donation Type Button */}
                            <DonationType donationType={"inKind"}
                                isInKindTypeOpen={isInKindTypeOpen}
                                isMonetaryTypeOpen={isMonetaryTypeOpen}
                                setIsInKindTypeOpen={setIsInKindTypeOpen}
                                setIsMonetaryTypeOpen={setIsMonetaryTypeOpen}
                                setIsInKindType={setIsInKindType}
                                setIsMonetaryType={setIsMonetaryType}
                            />
                        </div>

                        {isMonetaryTypeOpen && (
                            <div className='flex flex-col gap-5'>
                                <MonetaryAmountInput
                                    monetaryAmountInput={monetaryAmountInput}
                                    setMonetaryAmountInput={setMonetaryAmountInput}
                                />
                                <DonationInstructions donationType={"monetary"} />
                                <PaymentProof
                                    fileInputRef={fileInputRef}
                                    fileName={fileName}
                                    setFileName={setFileName}
                                    onFileSubmit={handleFileSubmit}
                                />
                                <DonationOptions isAnonymous={isAnonymous} setIsAnonymous={setIsAnonymous} />
                                
                                {/* Small screen support */}
                                <div className="outline-2 rounded-3xl outline-neutral-400 p-3 lg:w-1/3 w-full h-full lg:hidden block">
                                    {/* <DonationDeets/> */}
                                    {isMonetaryType && (
                                        <DonationMainView driveDetails={driveDetails} driveId = {drive_id} type="monetary"/>
                                    )}

                                    {!isMonetaryType && (
                                        <DonationMainView driveDetails={driveDetails} driveId = {drive_id}/>
                                    )}
                                    
                                </div>
                                
                                {/* Submit Button */}
                                {submitting ? (
                                    <div className="ml-auto">
                                        <CircularLoading />
                                    </div>
                                ) : (
                                    <button
                                        onClick={submitMonetaryDonation}
                                        className="rounded-2xl justify-center bg-primary font-satoshi-medium text-white text-md w-1/3 h-12 ml-auto cursor-pointer"
                                    >
                                        Submit
                                    </button>
                                )}
                            </div>
                        )}

                        {isInKindTypeOpen && (
                            <div className='flex flex-col gap-5'>
                                <DonationDetailsInput
                                    donationDetailsInput={donationDetailsInput}
                                    setDonationDetailsInput={setDonationDetailsInput}
                                />
                                <DonationInstructions donationType={"inKind"} />

                                {/* Small screen support */}
                                <div className="outline-2 rounded-3xl outline-neutral-400 p-3 lg:w-1/3 w-full h-full lg:hidden block">
                                    {/* <DonationDeets/> */}
                                    {isMonetaryType && (
                                        <DonationMainView driveDetails={driveDetails} driveId = {drive_id} type="monetary"/>
                                    )}

                                    {!isMonetaryType && (
                                        <DonationMainView driveDetails={driveDetails} driveId = {drive_id}/>
                                    )}
                                    
                                </div>
                                {/* Submit Button */}
                                
                                {submitting ? (
                                    <div className="ml-auto">
                                        <CircularLoading />
                                    </div>
                                ) : (
                                    <button
                                        onClick={submitInKindDonation}
                                        className="rounded-2xl justify-center bg-primary font-satoshi-medium text-white text-md w-1/3 h-12 ml-auto cursor-pointer"
                                    >
                                        Submit
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                    {/* PLACEHOLDER FOR MAR's COMPONENT */}
                    <div className="outline-2 rounded-3xl outline-neutral-400 p-3 lg:w-1/3 w-full h-full lg:block hidden">
                        {/* <DonationDeets/> */}
                        {isMonetaryType && (
                            <DonationMainView driveDetails={driveDetails} driveId = {drive_id} type="monetary"/>
                        )}

                        {!isMonetaryType && (
                            <DonationMainView driveDetails={driveDetails} driveId = {drive_id}/>
                        )}
                        
                    </div>
                </div>
            ) : (
                <div className="flex justify-center items-center w-full h-full my-30">
                    <div className="flex flex-col w-1/2 items-center">
                        <img className="w-15 h-15 rounded-full" src={check} alt="check" />
                        <h1 className="font-satoshi-bold text-3xl pt-5">Donation Submitted</h1>
                        <p className="font-satoshi-light text-lg pt-5 w-2/3 text-center">Your donation will be reflected once it has been reviewed and verified by our admin team.</p>

                        <div className="flex flex-col w-full items-start mx-10">
                            <h1 className="font-satoshi-bold text-xl pt-5 text-left border-b-1 border-neutral-300 w-full pb-3">Donation Summary</h1>

                            <div className="flex flex-row w-full pt-5 items-center pl-20">
                                <div className="w-1/2">
                                    <ol className="font-satoshi-regular space-y-4">
                                        <li>Donation Drive</li>
                                        <li>Date</li>
                                        <li>User</li>
                                        <li>Status</li>
                                        <li>{isMonetaryType ? "Amount" : "Description"}</li>
                                    </ol>
                                </div>

                                <div className="w-1/2">
                                    {!summaryLoading ? (
                                        <ol className="font-satoshi-regular space-y-4">
                                            <li>{summary.donation_drive}</li>
                                            <li>{formatDate(summary.date)}</li>
                                            <li>{summary.user}</li>
                                            <li>{summary.status}</li>
                                            <li>{isMonetaryType ? `₱ ${monetaryAmountInput}` : donationDetailsInput}</li>
                                        </ol>
                                    ) : (
                                        <div className="flex justify-center items-center">
                                            <CircularLoading />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button className="mt-10 rounded-2xl justify-center bg-primary font-satoshi-medium text-white text-md w-1/4 h-12 ml-auto cursor-pointer">
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Donationform;
