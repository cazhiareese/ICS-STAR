import React, { useState, useEffect, useMemo, useRef   } from "react";
import SearchBar from "../../components/searchbar";
import AlumniCareerFilter from "../../components/careerfilter";
import AlumniAffiliationFilter from "../../components/alumaffiliation";
import AlumniSkillsFilter from "../../components/skillsfilter";
import AlumniIndustryFilter from "../../components/industryFilter";
import AlumniLocationFilter from "../../components/locationfilter";
import AlumniSearchCard from "../../components/alumnisearchcard";
import { X, ChevronDown, Calendar, Search, Filter } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker.css";
import YearPicker from "../../components/datepicker";
import { motion } from "framer-motion";
import axios from 'axios';



function AlumniSearch() {
  const [selectedBatchYear, setSelectedBatchYear] = useState(""); // Separate state for Batch Year
  const [selectedGraduationYear, setSelectedGraduationYear] = useState(""); // Separate state for Graduation Year
  
  const [isBatchExpanded, setIsBatchExpanded] = useState(false);
  const [isGraduateExpanded, setIsGraduateExpanded] = useState(false);
  const [isCareerExpanded, setIsCareerExpanded] = useState(false);
  const [isAffiliationExpanded, setIsAffiliationExpanded] = useState(false);
  const [isSkillsExpanded, setIsSkillsExpanded] = useState(false);
  const [isIndustryExpanded, setIsIndustryExpanded] = useState(false);
  const [isLocationExpanded, setIsLocationExpanded] = useState(false);
  
  const [careerList, setCareerList] = useState([]); // State for career list
  const [affiliationList, setAffiliationList] = useState([]); // State for affiliation list
  const [skillsList, setSkillsList] = useState([]); // State for skills list
  const [industryList, setIndustryList] = useState([]); 
  const [location, setLocation] = useState([]); 

  const memoizedCareerList = useMemo(() => careerList, [careerList]);
  const memoizedAffiliationList = useMemo(() => affiliationList, [affiliationList]);
  const memoizedSkillsList = useMemo(() => skillsList, [skillsList]);
  const memoizedIndustryList = useMemo(() => industryList, [industryList]);
  const memoizedLocation = useMemo(() => location, [location]);

  const [careerInput, setCareerInput] = useState(""); // State for storing current input
  const [affiliationInput, setAffiliationInput] = useState(""); // State for storing current input
  const [skillsInput, setSkillsInput] = useState(""); // State for storing current input
  const [industryInput, setIndustryInput] = useState("");
  const [locationInput, setLocationInput] = useState("");

  const [alumniList, setAlumniList] = useState([]);
  
  const [isFilterOpen, setIsFilterOpen] = useState(false); // State for mobile filter toggle

  const hasMounted = useRef(false);


  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  //Dummy data
  const alumni = 
  {
    full_name: "Kiefer Tayawa",
    graduation_year: 2022,
    job_title: "Software Engineer",
    skills: [
      "Machine Learning",
      "Python Programming"
    ],
    location: "Cebu",
    email: "kiper@gmail.com",
    image: "https://i.pinimg.com/originals/09/f3/3e/09f33ecb3753807c45c29a3155aa1773.jpg"
  }

  // useEffect(() => {
  //   setAlumniList([alumni, alumni, alumni]);
  // }, [alumniList]);



  const search = () => {
      let filters = {}; // Initialize filter object

      if (selectedBatchYear != "") {
          filters.batch = selectedBatchYear;
      }
      if (selectedGraduationYear !== "") {
          filters.graduation_year = selectedGraduationYear;
      }
      if (Array.isArray(careerList) && careerList.length > 0) {
          filters.job_title = careerList;
      }
      if (Array.isArray(affiliationList) && affiliationList.length > 0) {
          filters.affiliations = affiliationList;
      }
      if (Array.isArray(skillsList) && skillsList.length > 0) {
          filters.skills = skillsList;
      }
      if (Array.isArray(industryList) && industryList.length > 0) {
          filters.industry = industryList;
      }
      if (Array.isArray(location) && location.length > 0) {
          filters.city = location;
      }

      if (Object.keys(filters).length > 0){
        // Pass filters to buildSearchUrl and make API call
        let apiUrl = buildSearchUrl(filters);
        console.log(apiUrl);
        return apiUrl;
      }
      
  };

  useEffect(() => {
    if (!hasMounted.current) {
        hasMounted.current = true;
        return;  // Skip the first render
    }

    const fetchData = async () => {
        let searchAPIURL = search();  // Get API URL based on the filters
        try {
            const response = await axios.get(searchAPIURL);
            setAlumniList((prevList) => {
                if (JSON.stringify(prevList) !== JSON.stringify(response.data)) {
                    return response.data;
                }
                return prevList;
            });
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching alumni data:", error);
            setAlumniList([]);
        }
    };

    fetchData();  // Fetch data when dependencies change

}, [
    selectedBatchYear, 
    selectedGraduationYear, 
    memoizedCareerList, 
    memoizedAffiliationList, 
    memoizedSkillsList, 
    memoizedIndustryList, 
    memoizedLocation
]);

  const buildSearchUrl = (filters) => {
      let baseUrl = "https://ics-star-api.vercel.app/alumni/search";
      let queryParams = new URLSearchParams(filters).toString();
      return queryParams ? `${baseUrl}?${queryParams}` : baseUrl;
  }

  

  const removeSkill = (index) => {
    // Create a new array excluding the career at the given index
    const updatedSkillList = skillsList.filter((_, i) => i !== index);
    
    // Update the state with the new list
    setSkillsList(updatedSkillList);
  };

  const removeLocation = (index) => {
    // Create a new array excluding the career at the given index
    const updatedLocationList = location.filter((_, i) => i !== index);
    
    // Update the state with the new list
    setLocation(updatedLocationList);
  };

  const removeCareer = (index) => {
    // Create a new array excluding the career at the given index
    const updatedCareerList = careerList.filter((_, i) => i !== index);
    
    // Update the state with the new list
    setCareerList(updatedCareerList);
  };

  const removeAffiliation = (index) => {
    // Create a new array excluding the Affiliation at the given index
    const updatedAffiliationList = affiliationList.filter((_, i) => i !== index);
    
    // Update the state with the new list
    setAffiliationList(updatedAffiliationList);
  };

  const removeIndustry = (index) => {
    // Create a new array excluding the Industry at the given index
    const updatedIndustryList = industryList.filter((_, i) => i !== index);
    
    // Update the state with the new list
    setIndustryList(updatedIndustryList);
  };

  const resetAllFilters = () => {
    setSelectedBatchYear("");
    setSelectedGraduationYear("");
    setSkillsList([]);
    setCareerList([]);
    setAffiliationList([]);
    setIndustryList([]);
    setLocation([]);
    setAlumniList([]);
  }

 
  
  return (
    <div className="flex flex-col ">
      <motion.div
        className="fixed bottom-0 left-0 w-full bg-gray-100 z-50 p-5 shadow-lg rounded-t-2xl lg:hidden overflow-y-auto"
        style={{ maxHeight: "100vh", height: "100%" }}
        initial={{ y: "100vh" }}
        animate={{ y: isFilterOpen ? "0vh" : "100vh" }}
        exit={{ y: "100vh" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >


       <div className=" flex lg:hidden flex-col w-full pt-3">
          <div className="flex flex-row">
            <h1 className="font-satoshi-bold text-4xl flex-4/12">Filters</h1>
            
            <button onClick={toggleFilter} className="cursor-pointer hover:text-primary rounded-full bg-white w-12 h-12 flex items-center justify-center">
              <X size={30} />
            </button>
          </div>

          {/* Alumni Batch Filter */}
          <div className="flex flex-col shadow mt-14 rounded-lg gap-3 bg-white">
            <div className="flex flex-row px-5 py-3" onClick={() => setIsBatchExpanded(!isBatchExpanded)}>
              <motion.h1
                className="flex-1/2 font-satoshi-medium"
                initial={{ fontWeight: 500, fontSize: "1.00rem" }}
                animate={{
                  fontWeight: isBatchExpanded ? 600 : 500, // Bold when expanded
                  fontSize: isBatchExpanded ? "1.50rem" : "1.25rem", // lg: 1.25rem, sm: 0.875rem
                }}
                transition={{ duration: 0.2 }}
              >
                Batch of Alumni
              </motion.h1>

              <motion.button
                className="cursor-pointer hover:text-primary"
                animate={{ rotate: isBatchExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={30} />
              </motion.button>
            </div>

            {/* Year Picker for Batch */}
            <motion.div
              className="overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: isBatchExpanded ? "auto" : 0, opacity: isBatchExpanded ? 1 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="px-5 pb-5 flex items-center justify-center flex-row gap-2">
                <Calendar className="text-primary hidden md:block" />
                <YearPicker
                  selectedYear={selectedBatchYear} // Using separate state for Batch Year
                  setSelectedYear={setSelectedBatchYear}
                />
              </div>

                {/* Buttons for skip and next for mobile*/}
                <div onClick={() => {
                  setIsGraduateExpanded(true);
                  setIsBatchExpanded(false);
                }} className="flex lg:hidden justify-between px-5 pb-3">
                <button
                  onClick={() => {setSelectedBatchYear(""); 
                    setIsGraduateExpanded(true);
                    setIsBatchExpanded(false);}}
                  className="text-black px-4 py-2 rounded-lg underline font-satoshi-medium cursor-pointer hover:text-gray-500"
                >
                  Skip
                </button>

                <button onClick={() => {
                  setIsGraduateExpanded(true);
                  setIsBatchExpanded(false);
                }} className="bg-primary text-white px-4 py-2 rounded-2xl hover:bg-primary-dark hover:bg-blue-950 cursor-pointer">
                  Next
                </button>
              </div>
            </motion.div>

             
          </div>

          {/* Alumni Graduate Filter */}
          <div className="flex flex-col shadow mt-5 rounded-lg gap-3 bg-white">
            <div className="flex flex-row px-5 py-3" onClick={() => setIsGraduateExpanded(!isGraduateExpanded)}>
              <motion.h1
                className="flex-1/2 font-satoshi-medium"
                initial={{ fontWeight: 500, fontSize: "1.00rem" }}
                animate={{
                  fontWeight: isGraduateExpanded ? 600 : 500, // Bold when expanded
                  fontSize: isGraduateExpanded ? "1.50rem" : "1.25rem", // lg: 1.25rem, sm: 0.875rem
                }}
                transition={{ duration: 0.2 }}
              >
                Year Alumni Graduated
              </motion.h1>

              <motion.button
                className="cursor-pointer hover:text-primary"
                animate={{ rotate: isGraduateExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={30} />
              </motion.button>
            </div>

            {/* Year Picker for Graduation */}
            <motion.div
              className="overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: isGraduateExpanded ? "auto" : 0, opacity: isGraduateExpanded ? 1 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="px-5 pb-5 flex items-center justify-center flex-row gap-2">
                <Calendar className="text-primary hidden md:block" />
                <YearPicker
                  selectedYear={selectedGraduationYear} 
                  setSelectedYear={setSelectedGraduationYear}
                />
              </div>

              {/* Buttons for skip and next for mobile*/}
              <div className="flex lg:hidden justify-between px-5 pb-3">
                <button
                  onClick={() => {setSelectedGraduationYear(""); 
                    setIsCareerExpanded(true);
                    setIsGraduateExpanded(false);}}
                  className="text-black px-4 py-2 rounded-lg underline font-satoshi-medium cursor-pointer hover:text-gray-500"
                >
                  Skip
                </button>

                <button onClick={() => {
                  setIsCareerExpanded(true);
                  setIsGraduateExpanded(false);
                }} className="bg-primary text-white px-4 py-2 rounded-2xl hover:bg-primary-dark hover:bg-blue-950 cursor-pointer">
                  Next
                </button>
              </div>
            </motion.div>
          </div>

          <AlumniCareerFilter
            isCareerExpanded={isCareerExpanded}
            setIsCareerExpanded={setIsCareerExpanded}
            careerInput={careerInput}
            setCareerInput={setCareerInput}
            careerList={careerList}
            setCareerList={setCareerList}
            setIsAffiliationExpanded={setIsAffiliationExpanded}
          />

          <AlumniAffiliationFilter
            isAffiliationExpanded={isAffiliationExpanded}
            setIsAffiliationExpanded={setIsAffiliationExpanded}
            affiliationInput={affiliationInput}
            setAffiliationInput={setAffiliationInput}
            affiliationList={affiliationList}
            setAffiliationList={setAffiliationList}
            setIsSkillsExpanded={setIsSkillsExpanded}

          />

          <AlumniSkillsFilter
            isSkillsExpanded={isSkillsExpanded}
            setIsSkillsExpanded={setIsSkillsExpanded}
            skillsInput={skillsInput}
            setSkillsInput={setSkillsInput}
            skillsList={skillsList}
            setSkillsList={setSkillsList}
            setIsLocationExpanded={setIsLocationExpanded}
          />

          <AlumniLocationFilter
            isLocationExpanded={isLocationExpanded}
            setIsLocationExpanded={setIsLocationExpanded}
            locationInput={locationInput}
            setLocationInput={setLocationInput}
            location={location}
            setLocation={setLocation}
            setIsIndustryExpanded={setIsIndustryExpanded}
          />

          <AlumniIndustryFilter
            isIndustryExpanded={isIndustryExpanded}
            setIsIndustryExpanded={setIsIndustryExpanded}
            industryInput={industryInput}
            setIndustryInput={setIndustryInput}
            industryList={industryList}
            setIndustryList={setIndustryList}
          />


          
        </div>

        <div className="flex lg:hidden justify-between px-5 pb-3 mt-20">
          <button
            onClick={() => {
              resetAllFilters();
              setIsBatchExpanded(false);
              setIsGraduateExpanded(false);
              setIsCareerExpanded(false);
              setIsAffiliationExpanded(false);
              setIsSkillsExpanded(false);
              setIsIndustryExpanded(false);
              setIsLocationExpanded(false);
            }} 
            className="text-black px-4 py-2 font-satoshi-medium cursor-pointer rounded-2xl bg-white shadow-2xl"
          >
            Clear All
          </button>

          <button onClick={() => {
            setIsFilterOpen(false);
            setIsBatchExpanded(false);
            setIsGraduateExpanded(false);
            setIsCareerExpanded(false);
            setIsAffiliationExpanded(false);
            setIsSkillsExpanded(false);
            setIsIndustryExpanded(false);
            setIsLocationExpanded(false);
        
          }} className="bg-primary text-white px-4 py-2 rounded-2xl hover:bg-primary-dark hover:bg-blue-950 cursor-pointer shadow-2xl">
            Confirm
          </button>
        </div>
      </motion.div>
      {/* Search bar */}
      <div className="flex flex-col w-full mt-28 shadow-md pb-8 items-center rounded-full ">
        <div className="flex flex-row gap-5 w-full items-center justify-center">
          <SearchBar 
            selectedBatchYear={selectedBatchYear}
            selectedGraduationYear={selectedGraduationYear}
            careerList={careerList}
            affiliationList={affiliationList}
            skillsList={skillsList}
            industryList={industryList}
            location={location}
          />
          
          <button onClick={toggleFilter} className="flex flex-center h-14 cursor-pointer rounded-2xl outline-gray-300 outline-2 bg-gray-100 text-primary w-12 justify-center items-center text-center lg:hidden">
              <Filter size={20} />
          </button>
          
          
        </div>
      </div>

      {/* Filter Bar and Alumni Cards */}
      <div className="flex flex-row pt-10 md:justify-left justify-center">
        {/* Filter Bar */}
        <div className=" hidden lg:flex flex-col pr-6 border-r-2 border-gray-300 w-1/4">
          <div className="flex flex-row">
            <h1 className="font-satoshi-bold text-4xl flex-4/12">Filters</h1>
            <button className="mr-2 underline font-satoshi-medium mt-4 cursor-pointer hover:text-primary" onClick={resetAllFilters}>
              Reset All
            </button>
            <button className="mt-4 cursor-pointer hover:text-primary">
              <X size={24} />
            </button>
          </div>

          {/* Alumni Batch Filter */}
          <div className="flex flex-col shadow mt-14 rounded-lg gap-3">
            <div className="flex flex-row px-5 py-3" onClick={() => setIsBatchExpanded(!isBatchExpanded)}>
              <motion.h1
                className="flex-1/2 font-satoshi-medium"
                initial={{ fontWeight: 500, fontSize: "1.00rem" }}
                animate={{
                  fontWeight: isBatchExpanded ? 600 : 500, // Bold when expanded
                  fontSize: isBatchExpanded ? "1.50rem" : "1.25rem", // lg: 1.25rem, sm: 0.875rem
                }}
                transition={{ duration: 0.2 }}
              >
                Batch of Alumni
              </motion.h1>

              <motion.button
                className="cursor-pointer hover:text-primary"
                animate={{ rotate: isBatchExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={30} />
              </motion.button>
            </div>

            {/* Year Picker for Batch */}
            <motion.div
              className="overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: isBatchExpanded ? "auto" : 0, opacity: isBatchExpanded ? 1 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="px-5 pb-5 flex items-center justify-center flex-row gap-2">
                <Calendar className="text-primary" />
                <YearPicker
                  selectedYear={selectedBatchYear} // Using separate state for Batch Year
                  setSelectedYear={setSelectedBatchYear}
                />
              </div>
            </motion.div>
          </div>

          {/* Alumni Graduate Filter */}
          <div className="flex flex-col shadow mt-5 rounded-lg gap-3">
            <div className="flex flex-row px-5 py-3" onClick={() => setIsGraduateExpanded(!isGraduateExpanded)}>
              <motion.h1
                className="flex-1/2 font-satoshi-medium"
                initial={{ fontWeight: 500, fontSize: "1.00rem" }}
                animate={{
                  fontWeight: isGraduateExpanded ? 600 : 500, // Bold when expanded
                  fontSize: isGraduateExpanded ? "1.50rem" : "1.25rem", // lg: 1.25rem, sm: 0.875rem
                }}
                transition={{ duration: 0.2 }}
              >
                Year Alumni Graduated
              </motion.h1>

              <motion.button
                className="cursor-pointer hover:text-primary"
                animate={{ rotate: isGraduateExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={30} />
              </motion.button>
            </div>

            {/* Year Picker for Graduation */}
            <motion.div
              className="overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: isGraduateExpanded ? "auto" : 0, opacity: isGraduateExpanded ? 1 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="px-5 pb-5 flex items-center justify-center flex-row gap-2">
                <Calendar className="text-primary" />
                <YearPicker
                  selectedYear={selectedGraduationYear} 
                  setSelectedYear={setSelectedGraduationYear}
                />
              </div>
            </motion.div>
          </div>

          <AlumniCareerFilter
            isCareerExpanded={isCareerExpanded}
            setIsCareerExpanded={setIsCareerExpanded}
            careerInput={careerInput}
            setCareerInput={setCareerInput}
            careerList={careerList}
            setCareerList={setCareerList}
          />

          <AlumniAffiliationFilter
            isAffiliationExpanded={isAffiliationExpanded}
            setIsAffiliationExpanded={setIsAffiliationExpanded}
            affiliationInput={affiliationInput}
            setAffiliationInput={setAffiliationInput}
            affiliationList={affiliationList}
            setAffiliationList={setAffiliationList}
          />

          <AlumniSkillsFilter
            isSkillsExpanded={isSkillsExpanded}
            setIsSkillsExpanded={setIsSkillsExpanded}
            skillsInput={skillsInput}
            setSkillsInput={setSkillsInput}
            skillsList={skillsList}
            setSkillsList={setSkillsList}
          />

          <AlumniLocationFilter
            isLocationExpanded={isLocationExpanded}
            setIsLocationExpanded={setIsLocationExpanded}
            locationInput={locationInput}
            setLocationInput={setLocationInput}
            location={location}
            setLocation={setLocation}
          />

          <AlumniIndustryFilter
            isIndustryExpanded={isIndustryExpanded}
            setIsIndustryExpanded={setIsIndustryExpanded}
            industryInput={industryInput}
            setIndustryInput={setIndustryInput}
            industryList={industryList}
            setIndustryList={setIndustryList}
          />
        </div>

        

        
        <div className="w-2/3 flex flex-col md:pl-10">
          {/* career filters */}
          {(careerList.length > 0 || skillsList.length > 0 || affiliationList.length > 0 || industryList.length > 0 || location.length > 0 
          || selectedBatchYear != "" || selectedGraduationYear != "" ) && (
            <div className="flex flex-row flex-wrap mt-5 pl-10 mb-4 gap-2 items-center">
              {(selectedBatchYear !== "") && <div className="flex flex-row bg-primary rounded-full h-7 items-center px-2">
                <h1 className="text-white font-satoshi-light truncate md:text-md text-sm max-w-36">Batch {selectedBatchYear}</h1>
                <button onClick={() => setSelectedBatchYear("")}>
                  <X className="text-white ml-2" size={20} />
                </button>
              </div>}

              {(selectedGraduationYear !== "") && (<div className="flex flex-row bg-primary rounded-full h-7 items-center px-2">
                <h1 className="text-white font-satoshi-light truncate md:text-md text-sm max-w-36">Graduated in {selectedBatchYear}</h1>
                <button onClick={() => setSelectedGraduationYear("")}>
                  <X className="text-white ml-2" size={20} />
                </button>
              </div>)}
              
              {careerList.map((career, index) => (
                <div key={`career-${index}`} className="flex flex-row bg-primary rounded-full h-7 items-center px-2">
                  <h1 className="text-white font-satoshi-light truncate md:text-md text-sm max-w-36">{career}</h1>
                  <button onClick={() => removeCareer(index)}>
                    <X className="text-white ml-2" size={20} />
                  </button>
                </div>
              ))}

              {affiliationList.map((Affiliation, index) => (
                <div key={index} className="flex flex-row bg-primary rounded-full h-7 items-center px-2">
                  <h1 className="text-white font-satoshi-light truncate md:text-md text-sm max-w-36">{Affiliation}</h1>
                  <button onClick={() => removeAffiliation(index)}>
                    <X className="text-white ml-2" size={20} />
                  </button>
                </div>
              ))}

              {skillsList.map((skill, index) => (
                <div key={`skill-${index}`} className="flex flex-row bg-primary rounded-full h-7 items-center px-2">
                  <h1 className="text-white font-satoshi-light truncate md:text-md text-sm max-w-36">{skill}</h1>
                  <button onClick={() => removeSkill(index)}>
                    <X className="text-white ml-2" size={20} />
                  </button>
                </div>
              ))}

              {location.map((loc, index) => (
                <div key={index} className="flex flex-row bg-primary rounded-full h-7 items-center px-2">
                  <h1 className="text-white font-satoshi-light truncate md:text-md text-sm max-w-36">{loc}</h1>
                  <button onClick={() => removeLocation(index)}>
                    <X className="text-white ml-2" size={20} />
                  </button>
                </div>
              ))}   

              {industryList.map((Industry, index) => (
                <div key={index} className="flex flex-row bg-primary rounded-full h-7 items-center px-2">
                  <h1 className="text-white font-satoshi-light truncate md:text-md text-sm max-w-36">{Industry}</h1>
                  <button onClick={() => removeIndustry(index)}>
                    <X className="text-white ml-2" size={20} />
                  </button>
                </div>
              ))}

              
              
            </div>
          )}

          <h1 className="md:text-3xl text-2xl font-satoshi-medium text-gray-500 pl-10 py-6 lg:text-left text-center">{alumniList.length} Search Results</h1>

          {/* Mapping of alumni cards */}
          <div className="flex flex-row flex-wrap gap-24 items-center justify-center">
            {alumniList.map((alumni, index) => (
              <AlumniSearchCard
                key={index}
                full_name={alumni.full_name}
                graduation_year={alumni.graduation_year}
                job_title={alumni.job_title}
                skills={alumni.skills}
                location={alumni.location}
                email={alumni.email}
                image={alumni.image}
              />
            ))}
          </div>

            

        </div>

      </div>
    </div>
  );
}

export default AlumniSearch;
