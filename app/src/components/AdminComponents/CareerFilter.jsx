import React, {useEffect, useState} from 'react'
import { Calendar, Filter, Search, X } from 'lucide-react';

function CareerFilterModal ({filters, setterFunction})
{
    const [open, setOpen] = useState(false);
    const [creatorInput, setCreatorInput] = useState('')
    const[creatorValue, setCreatorValue] = useState('')

    const handleCreatorInputChange = (e) => {
        const value = e.target.value;
        setCreatorInput(value);
    
        if (value.length === 0) {
            setterFunction('');
        }
    };
    
    const handleCreatorSearch = (e) => {
        if (e.key === 'Enter') {
            setterFunction(creatorInput); // Always apply current input
        }
    };

    return(
    <div>
    <div>
        <button 
            onClick={() => setOpen(!open)}
            className='border border-disabled rounded-3xl px-5 py-2 flex gap-2 items-center cursor-pointer bg-whitey font-satoshi-bold hover:border-hover duration-150 ease-in'>
            <Filter className='text-primary'/>
            <p className='text-primary fsont-satoshi-medium text-sm'> Filter</p>
        </button>
    </div>
        {
        open && 
            (
                <div className="absolute z-10 mt-2 w-90 origin-top-right rounded-2xl border border-gray-200 bg-white shadow-xl p-4">
                <div className="text-black flex flex-col gap-2">
                    {
                        filters.map(({label,value}, index) => {
                            if (value === 'creator'){
                                return(
                                    <div key={`filter-${value}-${index}`}>
                                    <h1 className='font-satoshi-medium'>{label}</h1>
                                    {
                                    <div className="flex items-center justify-center flex-row gap-2 pt-2">
                                    <div className="relative w-full justify-center items-center flex">
                                        <input
                                            type="search"
                                            className="bg-white text-black border h-12 border-gray-300 focus:border-primary focus:outline-none rounded-2xl w-11/12 pl-10 pr-4 py-2"
                                            placeholder="Enter Creator Name"
                                            value={creatorInput}
                                            onChange={handleCreatorInputChange} // Update input value
                                            onKeyDown={handleCreatorSearch} // Handle enter key press
                                        />
                                        <span className="absolute left-8 top-1/2 transform -translate-y-1/2 text-primary">
                                        <Search size={18} strokeWidth={2} />
                                        </span>
                                    </div>
                                    </div>
                                        
                                    }
                                </div>
                                );
                            }
                        })
                    }
                </div>
                </div>
            )
    }
    </div>
    )
}

export default CareerFilterModal