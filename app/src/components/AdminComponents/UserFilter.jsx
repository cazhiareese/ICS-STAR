import React, {useEffect, useState} from 'react'
import YearPicker from '../AlumniComponents/datepicker';
import { Calendar, Filter, Search, X } from 'lucide-react';

function FilterModal({filters, setterFunction}){
    const [open, setOpen] = useState(false);

    //batchFilter
    const [batchOpen, setBatchOpen] = useState(false);
    const [selectedBatchYear, setSelectedBatchYear] = useState('')

    //gradFilter
    const [selectedGraduationYear, setSelectedGraduationYear] = useState('')
    const [gradOpen, setGradOpen] = useState(false);

    //career filter
    const [jobOpen, setJobOpen] = useState(false)
    const [jobInput, setJobInput] = useState('')
    const [selectedJob, setSelectedJob] = useState('')

    //location filter
    const[locationOpen, setLocationOpen] = useState(false);
    const [locationInput, setLocationInput] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');

    //standing filter
    const standings = [
        "freshman",
        "old freshman",
        "sophomore",
        "junior",
        "senior",
        "graduating"
      ];
    const [standingOpen, setStandingOpen] = useState(false)
    const [selectedStanding, setSelectedStanding] = useState('')
    const [filterList, setFilterList] = useState([]);

    const handleFilterChange = (newFilter) => {
        setFilterList((prevFilters) => {
          const existingIndex = prevFilters.findIndex(f => f.field === newFilter.field);
          if (newFilter.value === '') {
            return prevFilters.filter(f => f.field !== newFilter.field);
          }
          if (existingIndex !== -1) {
            const updated = [...prevFilters];
            updated[existingIndex] = newFilter;
            return updated;
          } else {
            return [...prevFilters, newFilter];
          }
        });
    };
 
    useEffect(() => {
        handleFilterChange({ field: 'batch', value: selectedBatchYear });
    }, [selectedBatchYear])
    useEffect(() => {
        handleFilterChange({field: 'graduation_year', value: selectedGraduationYear});
    }, [selectedGraduationYear])
    useEffect(() => {
        handleFilterChange({field: 'city', value: selectedLocation});
    }, [selectedLocation])
    useEffect(() => {
        handleFilterChange({field:'job_title', value: selectedJob})
    }, [selectedJob])
    useEffect(() => {
        handleFilterChange({field:'standing', value: selectedStanding})
    }, [selectedStanding])


    useEffect(() => {
        setterFunction(filterList)
    }, [filterList])

    const handleLocationSearch = (e) => {
        if (e.key === 'Enter') {
          setSelectedLocation(locationInput);
        }
    };
    
    const handleJobSearch = (e) => {
        if (e.key === 'Enter') {
          setSelectedJob(jobInput);
        }
    };

    const handleRemove = (field) =>{
        switch (field){
            case 'batch':
                setSelectedBatchYear('');
                break;
            case 'graduation_year':
                setSelectedGraduationYear('');
                break;
            case 'job_title':
                setSelectedJob('');
                break;
            case 'city':
                setSelectedLocation('');
                break;
            case 'standing':
                setSelectedStanding('');
                break;
            default:
                break;
        }
    }

    const handleClearAll = (e) =>{
        setSelectedBatchYear('');
        setSelectedGraduationYear('');
        setSelectedJob('');
        setSelectedLocation('');
    }


    return(
        <div>
            <button 
                onClick={() => setOpen(!open)}
                className='border border-disabled rounded-3xl px-5 py-2 flex gap-2 items-center cursor-pointer'>
              <Filter className='text-primary'/>
              <p className='text-primary fsont-satoshi-medium text-sm'> Filter</p>
            </button>
            

            {open &&(
            <div className="absolute z-10 mt-2 w-90 origin-top-right rounded-lg bg-white shadow-xl">
            <div className="py-2 text-sm text-black">
            <div>
                {
                    filterList && 
                    filterList.map(({field,value})=>{
                        const fieldLabel = filters.find((f) => f.value === field)?.label || field;
                        return (
                            <div>
                            <p>{fieldLabel}: {value}</p>
                            <button onClick={() => handleRemove(field)}>
                                <X  size={20} />
                            </button>
                            </div>
                        )
                    })
                }
            </div>
            
            {filters.map(({label,value}, index) => 
                {
                    if (value === 'batch') {
                        return (
                            <div key={`filter-${value}-${index}`}>
                                <h1>{label}</h1>
                                <button onClick={() => setBatchOpen(!batchOpen)}>Toggle</button>
                                {batchOpen && (
                                <div className="px-5 pb-5 flex items-center justify-center flex-row gap-2">
                                    <YearPicker
                                    selectedYear={selectedBatchYear}
                                    setSelectedYear={setSelectedBatchYear}
                                    />
                                    <Calendar className="text-primary hidden md:block" />
                                </div>
                                )}
                            </div>
                        );
                    } else if (value === 'graduation_year') {
                        return (
                            <div key={`filter-${value}-${index}`}>
                                <h1>{label}</h1>
                                <button onClick={() => setGradOpen(!gradOpen)}>Toggle</button>
                                {gradOpen && (
                                <div className="px-5 pb-5 flex items-center justify-center flex-row gap-2">
                                    <YearPicker
                                    selectedYear={selectedGraduationYear}
                                    setSelectedYear={setSelectedGraduationYear}
                                    />
                                    <Calendar className="text-primary hidden md:block" />
                                </div>
                                )}
                            </div>
                        );
                    } else if (value === 'city') {
                        return (
                            <div key={`filter-${value}-${index}`}>
                                <h1>{label}</h1>
                                <button onClick={() => setLocationOpen(!locationOpen)}>Toggle</button>
                                {
                                    locationOpen && (
                                        <div className="px-5 flex items-center justify-center flex-row gap-2">
                                        <div className="relative w-full justify-center items-center flex">
                                            <input
                                                type="search"
                                                className="bg-white text-black border h-12 border-gray-300 focus:border-primary focus:outline-none rounded-2xl w-11/12 pl-10 pr-4 py-2"
                                                placeholder="Enter City"
                                                value={locationInput}
                                                onChange={(e) => setLocationInput(e.target.value)} // Update input value
                                                onKeyDown={handleLocationSearch} // Handle enter key press
                                            />
                                            <span className="absolute left-8 top-1/2 transform -translate-y-1/2 text-primary">
                                            <Search size={18} strokeWidth={2} />
                                            </span>
                                        </div>
                                        </div>
                                    )
                                }
                            </div>
                    );
                    } else if (value === 'job_title') {
                        return (
                            <div key={`filter-${value}-${index}`}>
                                <h1>{label}</h1>
                                <button onClick={() => setJobOpen(!jobOpen)}>Toggle</button>
                                {
                                    jobOpen && (
                                        <div className="px-5 flex items-center justify-center flex-row gap-2">
                                        <div className="relative w-full justify-center items-center flex">
                                            <input
                                                type="search"
                                                className="bg-white text-black border h-12 border-gray-300 focus:border-primary focus:outline-none rounded-2xl w-11/12 pl-10 pr-4 py-2"
                                                placeholder="Enter Career"
                                                value={jobInput}
                                                onChange={(e) => setJobInput(e.target.value)} // Update input value
                                                onKeyDown={handleJobSearch} // Handle enter key press
                                            />
                                            <span className="absolute left-8 top-1/2 transform -translate-y-1/2 text-primary">
                                            <Search size={18} strokeWidth={2} />
                                            </span>
                                        </div>
                                        </div>
                                    )
                                }
                            </div>
                        );
                    }else if (value==='standing'){
                        return (
                            <div key={`filter-${value}-${index}`}>
                                <h1>{label}</h1>
                                <button onClick={() => setStandingOpen(!standingOpen)}>Toggle</button>
                                {
                                    standingOpen && <div className="flex flex-wrap gap-3">
                                    {standings.map((standing) => (
                                        <button
                                        key={standing}
                                        onClick={() => setSelectedStanding(standing)}
                                        className={`px-4 py-2 rounded-full border transition-colors duration-200
                                            ${
                                            selectedStanding === standing
                                                ? 'bg-primary text-white border-primary'
                                                : 'bg-white text-black border-gray-300 hover:border-primary'
                                            }`}
                                        >
                                        {standing}
                                        </button>
                                    ))}
                                
                                    </div>
                                }
                            </div>
                        )
                    }
                }
            )
        }
        <div>
            <button onClick={() => handleClearAll()}>Clear all</button>
        </div>
        </div>
        </div>
        )
        }
        
        </div>
       
    )
}


export default FilterModal