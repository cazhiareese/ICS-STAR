import React, { useRef, useState } from 'react';
import { CloudUpload } from 'lucide-react';

function PaymentProof(
    {fileInputRef,
    fileName,
    setFileName,
    onFileSubmit,
    
    }
) {


    // Triggered when a user selects a file through the file picker.
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            onFileSubmit(file);
        }
    };

    // Triggered when a file is dragged and dropped into the upload area.
    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            setFileName(file.name);
            onFileSubmit(file);
        }
    };

    // Allows drag and rop files to browser
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    // opens native file picker dialog
    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    return (
        <div className='outline-2 rounded-3xl outline-neutral-400 py-8 px-8 w-full'>
            <h1 className='font-satoshi-medium pb-3'>Proof of payment <span className='text-error'>*</span></h1>

            <div
                className='flex flex-col bg-neutral-100 rounded-3xl justify-center items-center py-10 gap-2'
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                <h1 className='text-primary'>
                    <CloudUpload size={30} />
                </h1>
                {/* Drag and drop indicator */}
                <h1 className='text-neutral-500 font-satoshi-regular'>
                    Drag and drop files here or
                </h1>
                {/* File upload button */}
                <button
                    onClick={triggerFileInput}
                    className='text-primary underline font-satoshi-regular cursor-pointer'
                >
                    Choose file
                </button>
                {/* File name indicator */}
                {fileName && (
                    <p className='text-neutral-700 text-sm font-satoshi-regular mt-2'>
                        Selected: {fileName}
                    </p>
                )}
                <input
                    type='file'
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className='hidden'
                />
            </div>
        </div>
    );
}

export default PaymentProof;
