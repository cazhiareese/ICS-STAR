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
import Curve from "../../../assets/curve.png";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import DonationMainView from "../../../components/donationMainView";
import PaymentMode from "../../../components/AlumniComponents/DonationComponents/paymentmode";
// import DonationDeets from "../../../components/donationMainView.jsx";

function Donationform() {
    //const drive_id = "fe78d9ab-8baa-4872-80fa-94b0ffae0b97" //TODO: To be removed later
    const id = useParams(); // Get the drive_id from the URL params
    const drive_id = id.driveid; // Extract the drive_id from the params
    const formattedDate = new Date().toLocaleDateString();
    // console.log(drive_id)
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
    const [searchParams] = useSearchParams();
    const success = searchParams.get("success");
    const [summaryheader,setSummaryHeader] = useState("Your donation will be reflected once it has been reviewed and verified by our admin team.")

    const [error, setError] = useState(false);
    const [errorInKind, setErrorInKind] = useState(false);
    const [paymentError, setPaymentError] = useState(false);
    // BASE URL ENV
    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

      const User = localStorage.getItem("token");
      let tokentype = "guest";
      let userid = true;
      
      
      if (User) {
        try {
          const decoded = jwtDecode(User);
          tokentype = decoded.role;
          userid = decoded.sub;
          console.log("Decoded token:", decoded);
          console.log("User ID:", userid);
          console.log("Token type:", tokentype);
        } catch (error) {
          console.error("Invalid token:", error);
        }
      } else {
        console.log("No token found, defaulting to guest.");
      }

    const formatDate = (date) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(date).toLocaleDateString(undefined, options);
    };
    const handleFileSubmit = (file) => {
        setFile(file);
    };

    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/alumni/donations`);
    };

    useEffect(() => {
        if (summary.donation_drive && summary.date && summary.user && summary.status) {
            setSummaryLoading(false); // Stop loading once summary data is available
        }

        
    }, [summary]);

    
        useEffect(() => {
            const token = localStorage.getItem("token");
    
            fetch(`${API_BASE_URL}/one-donation-drive/${drive_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    setDriveDetails(data);
                    // console.log("Drive details:", data);
                })
                .catch((err) => {
                    console.error("Error fetching drive details:", err);
                });
        }, [drive_id]);

    // Submitting Monetary Donations
    const submitMonetaryDonation = async () => {
        // Ensure that all required fields are not empty
        if (monetaryAmountInput <= 0 || file == null) {
            setError(true);
            return;
        }
        setSubmitting(true);
        setError(false)
        const formData = new FormData();
        const token = localStorage.getItem("token");

        formData.append('monetary_donation', true);
        formData.append('in_kind_donation', false);
        formData.append('amount', monetaryAmountInput);
        formData.append('direct_maya', false); 
        formData.append('is_anonymous', isAnonymous);

        if (file != null) {
            formData.append('proof', file);
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/make-donation/${drive_id}`, formData, {
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

    const submitMayaDonation = async () => {
        if (monetaryAmountInput <= 0) {
            setPaymentError(true);
            return;
        }
        setPaymentError(false);
        setSubmitting(true);
        const formData = new FormData();
        const token = localStorage.getItem("token");
    
        formData.append('monetary_donation', 'true'); // Use strings
        formData.append('in_kind_donation', 'false');
        formData.append('direct_maya', 'true'); 
        formData.append('amount', String(monetaryAmountInput));
    
        try {
            // for (let pair of formData.entries()) {
            //     // console.log(`${pair[0]}: ${pair[1]}`);
            // }
    
            const response = await axios.post(`${API_BASE_URL}/make-donation/${drive_id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (response.status === 200 && response.data.redirectUrl) {
                // ✅ Automatically redirect
                localStorage.setItem("maya_donation_amount", String(monetaryAmountInput));

                window.location.href = response.data.redirectUrl;
            } else {
                console.warn("No redirect URL found in response");
            }
        } catch (error) {
            console.error("Error submitting donation:", error);
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        if (success === "true") {
          console.log("Payment successful");
          callMayaCallback();
        }
      }, [success]);
    



      const callMayaCallback = async () => {
        const token = localStorage.getItem("token");
        const amount = localStorage.getItem("maya_donation_amount");
    
        console.log("Maya Callback triggered with amount:", amount);
    
        const formData = new FormData();
        formData.append("amount", amount);  // Append the amount as form data
    
        try {
            const response = await axios.post(`${API_BASE_URL}/maya-callback?drive_id=${drive_id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'  
                }
            });
    
            if (response.status === 200) {
                console.log("Donation acknowledged:", response.data);
                setDonationSuccess(true);
                setSummaryLoading(true); // Start loading for the summary
                setSummary(response.data); // Set summary after successful donation
                setSummaryHeader("Your donation will be reflected shortly. Donations made through Maya are processed automatically and does not require admin verification.");
                setMonetaryAmountInput(amount)
                setIsMonetaryTypeOpen(false);
                setIsInKindTypeOpen(false);
                setSubmitting(false);
                localStorage.removeItem("amount");

            } else {
                console.warn("Callback response issue:", response);
            }
        } catch (error) {
            console.error("Error in Maya callback:", error);
        }
    };
    
    



    const submitInKindDonation = async () => {
        // Ensure that all required fields are not empty
        if (donationDetailsInput == null) {
            setErrorInKind(true);
            return;
        }
        setSubmitting(true);
        setErrorInKind(false);
        const formData = new FormData();
        const token = localStorage.getItem("token");

        formData.append('monetary_donation', false);
        formData.append('in_kind_donation', true);
        formData.append('direct_maya', 'false'); 
        formData.append('description', donationDetailsInput);

        try {
            const response = await axios.post(`${API_BASE_URL}/make-donation/${drive_id}`, formData, {
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
                        <button onClick={handleClick} className='text-primary flex gap-5 cursor-pointer'>
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

                            {tokentype !== "guest" && (
                            <DonationType
                                donationType={"inKind"}
                                isInKindTypeOpen={isInKindTypeOpen}
                                isMonetaryTypeOpen={isMonetaryTypeOpen}
                                setIsInKindTypeOpen={setIsInKindTypeOpen}
                                setIsMonetaryTypeOpen={setIsMonetaryTypeOpen}
                                setIsInKindType={setIsInKindType}
                                setIsMonetaryType={setIsMonetaryType}
                            />
                            )}

                        </div>

                        {isMonetaryTypeOpen && (
                            <div className='flex flex-col gap-5'>
                                <MonetaryAmountInput
                                    monetaryAmountInput={monetaryAmountInput}
                                    setMonetaryAmountInput={setMonetaryAmountInput}
                                    paymentError={paymentError}
                                />

                                <PaymentMode submitMayaDonation={submitMayaDonation}/>


                                <DonationInstructions donationType={"monetary"} />
                                <PaymentProof
                                    fileInputRef={fileInputRef}
                                    fileName={fileName}
                                    setFileName={setFileName}
                                    onFileSubmit={handleFileSubmit}
                                />
{tokentype !== "guest" && (
  <DonationOptions isAnonymous={isAnonymous} setIsAnonymous={setIsAnonymous} />
)}

                                
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

                                {error && (<h1 className='text-error font-satoshi-regular justify-center w-full flex'>Please fill out all the required fields</h1>)}
                                
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
                                        <DonationMainView driveDetails={driveDetails} driveId = {drive_id} type="monetary" landing={null}/>
                                    )}

                                    {!isMonetaryType && (
                                        <DonationMainView driveDetails={driveDetails} driveId = {drive_id} landing={null}/>
                                    )}
                                    
                                </div>
                                {errorInKind && (<h1 className='text-error font-satoshi-regular justify-center w-full flex'>Please fill out all the required fields</h1>)}
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
                    {/* donation details */}
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
                    <div className="flex flex-col md:w-1/2 w-2/3 items-center relative">
                        <img className="z-0 w-full md:h-full h-24" src={Curve} alt="check" />

                        <div className="flex flex-col md:w-10/12 w-11/12 items-center absolute z-10 top-2/3">
                            <img className="w-15 h-15 rounded-full" src={check} alt="check" />
                            <h1 className="font-satoshi-bold text-3xl pt-5 text-center">Donation Submitted</h1>
                            <p className="font-satoshi-light text-lg pt-5 md:w-2/3 w-full text-center">{summaryheader}</p>

                            <div className="flex flex-col w-full items-start mx-10">
                                <h1 className="font-satoshi-bold md:text-xl text-lg pt-5 md:text-left text-center border-b-1 border-neutral-300 w-full pb-3 ">Donation Summary</h1>

                                <div className="flex flex-col w-full pt-5 md:pl-20 space-y-4">
                                {summaryLoading ? (
                                    <div className="flex justify-center items-center">
                                        <CircularLoading />
                                    </div>
                                    ) : (
                                        <>
                                            <div className="flex flex-row">
                                                <div className="w-1/2 font-satoshi-regular md:text-md text-sm">Donation Drive</div>
                                                <div className="w-1/2 font-satoshi-regular md:text-md text-sm">{summary.donation_drive}</div>
                                            </div>
                                            <div className="flex flex-row">
                                                <div className="w-1/2 font-satoshi-regular md:text-md text-sm">Date</div>
                                                <div className="w-1/2 font-satoshi-regular md:text-md text-sm">{formatDate(summary.date)}</div>
                                            </div>
                                            <div className="flex flex-row">
                                                <div className="w-1/2 font-satoshi-regular md:text-md text-sm">User</div>
                                                <div className="w-1/2 font-satoshi-regular md:text-md text-sm">{summary.user}</div>
                                            </div>
                                            <div className="flex flex-row">
                                                <div className="w-1/2 font-satoshi-regular md:text-md text-sm">Status</div>
                                                <div className="w-1/2 font-satoshi-regular md:text-md text-sm">{summary.status}</div>
                                            </div>
                                            <div className="flex flex-row">
                                                <div className="w-1/2 font-satoshi-regular md:text-md text-sm">{isMonetaryType ? "Amount" : "Description"}</div>
                                                <div className="w-1/2 font-satoshi-regular md:text-md text-sm">
                                                    {isMonetaryType ? `₱ ${monetaryAmountInput}` : donationDetailsInput}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="flex items-center justify-center w-full mb-16">
                                    <button onClick={handleClick} className="mt-10 rounded-2xl justify-center bg-primary font-satoshi-medium text-white text-md md:w-1/4 w-1/3 h-12 md:ml-auto cursor-pointer">
                                        Done
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Donationform;