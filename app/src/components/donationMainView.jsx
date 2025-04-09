import React, { useContext, useState } from "react";
import { Paperclip } from 'lucide-react';

function DonationMainView() {

    const [image, setImage] = useState("null")

    return (
        <div className="flex flex-col lg:w-4xl md:w-100 h-180 border border-gray-300 rounded-2xl items-center overflow-scroll">
            <div className="lg:w-3xl w-100 min-h-50 border mx-auto mt-10 rounded-4xl bg-primary">
                {/* {image} */}
            </div>
            <div className="lg:w-3xl w-80 pt-5 ">
                <label className="font-satoshi-black text-3xl">Donation Title</label>
            </div>
            <div className="lg:w-3xl w-80 font-satoshi-regular ">
                <label>Date Started</label>
            </div>
            <div className="lg:w-3xl w-80 pt-5 font-satoshi-light text-gray-400">
                <label>Description</label>
            </div>
            <div className="flex flex-wrap lg:w-3xl md:w-80 pt-2 text-black font-satoshi-regular">
                <label>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis velit at ligula tristique, ac aliquet lorem vehicula. Sed facilisis, ante sed consequat dictum, ante est tempor magna, vel condimentum justo ipsum non tortor. Morbi pharetra sapien at est tincidunt, et auctor lectus auctor. Duis ac erat non tortor efficitur malesuada.</label>
            </div>

            <div className="lg:w-3xl w-80 font-satoshi-bold pt-5">
                <label>Relevant Links</label>
            </div>
            <div className="w-[80%] border border-gray-300 mb-5">

            </div>

            <div className="flex space-y-3 items-center flex-col mx-auto lg:w-2xl md:60 font-satoshi-regular text-primary">
                <div className="flex flex-row space-x-2">
                    <Paperclip />
                    <label>https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=ygUJcmljayByb2xs0gcJCX4JAYcqIYzv</label>
                </div>
                <div className="flex flex-row space-x-2">
                    <Paperclip />
                    <label>https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=ygUJcmljayByb2xs0gcJCX4JAYcqIYzv</label>
                </div>
                <div className="flex flex-row space-x-2">
                    <Paperclip />
                    <label>https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=ygUJcmljayByb2xs0gcJCX4JAYcqIYzv</label>
                </div>
                <div className="flex flex-row space-x-2">
                    <Paperclip />
                    <label>https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=ygUJcmljayByb2xs0gcJCX4JAYcqIYzv</label>
                </div>
                <div className="flex flex-row space-x-2">
                    <Paperclip />
                    <label>https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=ygUJcmljayByb2xs0gcJCX4JAYcqIYzv</label>
                </div>
                <div className="flex flex-row space-x-2">
                    <Paperclip />
                    <label>https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=ygUJcmljayByb2xs0gcJCX4JAYcqIYzv</label>
                </div>
                
            </div>
            
        </div>
    );
}

export default DonationMainView;