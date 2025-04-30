import React, { useContext, useState, useEffect } from "react";
import { Paperclip } from 'lucide-react';

function DonationMainView({ driveDetails, driveId, type, landing }) {
    // const [image, setImage] = useState("null")
    
    if (!driveDetails) return <p>Loading drive...</p>;

    return (

    //cyrus conditional rendering for landing page and specific, dont adjust the props and the condition
        
<div
  className={`flex flex-col w-full rounded-2xl items-center overflow-y-auto h-full sm:justify-center ${
    landing === true ? "sm:w-110" : landing === false ? "sm:w-full" : "sm:w-85"
  }`}
>


            <div className="w-[90%] sm:h-50 sm:max-h-85 border mx-auto rounded-4xl bg-primary sm:mt-0 mt-5 ">
                {<img src={driveDetails.image_url} alt="" className="w-full h-full object-cover rounded-4xl" />}
            </div>
            
            <div className="lg:w-[95%] w-[90%] pt-15">
                <label className="font-satoshi-black text-3xl">{driveDetails.title}</label>
            </div>
            <div className="lg:w-[95%] w-[90%] font-satoshi-regular ">
                <label>{ new Date(driveDetails.created_at).toLocaleDateString("en-CA")}</label>
            </div>

            {/* Place here */}
            {type== "monetary" &&
            (driveDetails.fund_percentage != null ? (<>
            <div className="flex justify-between items-center mb-2 pt-5 mr-auto pl-3">
                <h2 className="text-2xl font-satoshi-black text-primary">
                  {driveDetails.fund_percentage}% Funded
                </h2>
                
              </div>
        
              {/* Raised Amount */}
              <p className="font-medium text-primary font-satoshi-light mr-auto pl-3">
                ₱{driveDetails.total_amount_donated.toLocaleString()} raised of <label className="text-gray-500">₱{driveDetails.target_cost.toLocaleString()}</label>
              </p>
        
              {/* Progress Bar */}
              <div className="relative my-2 h-2 bg-gray-200 rounded font-satoshi-light w-full">
                <div
                  className="bg-blue-900 h-full rounded-full transition-all duration-300"
                  style={{ width: `${driveDetails.fund_percentage}%` }}
                ></div>
              </div>
        
              {/* Donation Count */}
              <p className="text-sm text-primary mb-4 ml-auto w-25">
                {driveDetails.donation_count} Donations
              </p>
              </>): (<>
              <div className="flex flex-col justify-between mb-2 pt-5 mr-auto pl-3">
                <h2 className="text-2xl font-satoshi-regular text-primary">
                ₱{driveDetails.total_amount_donated.toLocaleString()} <label className="text-black">raised</label>
                </h2>
                <h2 className="text-2xl font-satoshi-regular text-primary">
                {driveDetails.in_kind_count.toLocaleString()} in-kind<label className="text-black"> goods</label>
                </h2>
                
              </div>
        
              </>))
            }

            

            {/* END */}
            <div className="lg:w-[95%] w-[90%] pt-5 font-satoshi-light text-gray-400 ">
                <label>Description</label>
            </div>
            <div className="flex flex-wrap lg:w-[95%] w-[90%] pt-2 text-black font-satoshi-regular">
                <label>{driveDetails.description}</label>
            </div>

            <div className="lg:w-[95%] w-[90%] font-satoshi-bold pt-10">
                <label>Relevant Links</label>
            </div>
            <div className="w-[80%] border border-gray-300 mb-5">

            </div>
            {driveDetails.links != null && 
        
                <div className="flex space-y-3 items-center flex-col mx-auto lg:w-2xl lg:60 font-satoshi-regular text-primary">
            
                {driveDetails.links.map((link, index) => (
                    <div key={index} className="flex flex-row space-x-2 items-center">
                    <Paperclip />
                    <label className="break-all text-blue-600 cursor-pointer hover:underline">
                        <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                    </label>
                    </div>
                ))}
                </div>
            }

        {driveDetails.links == null && 
        
        <div className="flex space-y-3 items-center flex-col mx-auto lg:w-[60%] md:60 font-satoshi-regular text-primary mb-10">
            No Attached Links at the moment
        </div>
        }
            
                
            
            
        </div>

        
    );
}

export default DonationMainView;