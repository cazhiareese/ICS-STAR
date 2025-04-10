import React, { useContext, useState, useEffect } from "react";
import { Paperclip } from 'lucide-react';

function DonationMainView({ driveId }) {
    console.log(driveId.driveid);

    // const [image, setImage] = useState("null")
    const [driveDetails, setDriveDetails] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem("token"); // if required
    
        fetch(`https://ics-star-api.vercel.app/one-donation-drive/${driveId.driveid}`, {
          headers: {
            Authorization: `Bearer ${token}`, // only if the API requires auth
          },
        })
          .then((res) => res.json())
          .then((data) => {
            setDriveDetails(data);
            console.log("Drive details:", data);
          })
          .catch((err) => {
            console.error("Error f   etching drive details:", err);
          });
      }, [driveId]);
    
      if (!driveDetails) return <p>Loading drive...</p>;

    return (
        <div className="flex flex-col lg:w-4xl md:w-100 h-180 border border-gray-300 rounded-2xl items-center overflow-scroll">
            <div className="lg:w-3xl w-100 min-h-50 border mx-auto mt-10 rounded-4xl bg-primary">
                {<img src={driveDetails.image_url} alt="Preview" className="w-40 h-auto rounded shadow" />}
            </div>
            <div className="lg:w-3xl w-80 pt-15 ">
                <label className="font-satoshi-black text-3xl">{driveDetails.title}</label>
            </div>
            <div className="lg:w-3xl w-80 font-satoshi-regular ">
                <label>{ new Date(driveDetails.created_at).toLocaleDateString("en-CA")}</label>
            </div>
            <div className="lg:w-3xl w-80 pt-5 font-satoshi-light text-gray-400">
                <label>Description</label>
            </div>
            <div className="flex flex-wrap lg:w-3xl md:w-80 pt-2 text-black font-satoshi-regular">
                <label>{driveDetails.description}</label>
            </div>

            <div className="lg:w-3xl w-80 font-satoshi-bold pt-10">
                <label>Relevant Links</label>
            </div>
            <div className="w-[80%] border border-gray-300 mb-5">

            </div>
            {driveDetails.links != null && 
        
                <div className="flex space-y-3 items-center flex-col mx-auto lg:w-2xl md:60 font-satoshi-regular text-primary">
            
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
        
        <div className="flex space-y-3 items-center flex-col mx-auto lg:w-2xl md:60 font-satoshi-regular text-primary">
    
            No Attached Links at the moment
        </div>
        }
            
                
            
            
        </div>
    );
}

export default DonationMainView;