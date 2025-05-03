import React, { useState, useEffect, useMemo, useRef } from "react";
import SearchBar from "../../components/AlumniComponents/searchbar";
import AlumniCareerFilter from "../../components/AlumniComponents/careerfilter";
import AlumniAffiliationFilter from "../../components/AlumniComponents/alumaffiliation";
import AlumniSkillsFilter from "../../components/AlumniComponents/skillsfilter";
import AlumniIndustryFilter from "../../components/AlumniComponents/industryFilter";
import AlumniLocationFilter from "../../components/AlumniComponents/locationfilter";
import AlumniSearchCard from "../../components/AlumniComponents/alumnisearchcard";
import { X, ChevronDown, Calendar, Search, Filter } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker.css";
import YearPicker from "../../components/AlumniComponents/datepicker";
import { motion } from "framer-motion";
import axios from 'axios';
import SeeAllAffiliationModal from "../../components/AlumniComponents/seeAllModal";
import SeeAllLocationModal from "../../components/AlumniComponents/seeAllLocationModal";
import SeeAllCareerModal from "../../components/AlumniComponents/seeAllCareerModal";
import SeeAllIndustryModal from "../../components/AlumniComponents/seeAllIndustryModal";
import SeeAllSkillsModal from "../../components/AlumniComponents/seeAllSkillsModal";

function AlumniSearch() {
  // State for expanding animations
  const [isBatchExpanded, setIsBatchExpanded] = useState(false);
  const [isGraduateExpanded, setIsGraduateExpanded] = useState(false);
  const [isCareerExpanded, setIsCareerExpanded] = useState(false);
  const [isAffiliationExpanded, setIsAffiliationExpanded] = useState(false);
  const [isSkillsExpanded, setIsSkillsExpanded] = useState(false);
  const [isIndustryExpanded, setIsIndustryExpanded] = useState(false);
  const [isLocationExpanded, setIsLocationExpanded] = useState(false);
  const [isALumniInfoExpanded, setIsAlumniInfoExpanded] = useState(false);
  const [isAlumniProfessionExpanded, setIsAlumniProfessionExpanded] = useState(false);

  // State for filter containers
  const [selectedBatchYear, setSelectedBatchYear] = useState("");
  const [selectedGraduationYear, setSelectedGraduationYear] = useState("");
  const [careerList, setCareerList] = useState([]);
  const [affiliationList, setAffiliationList] = useState([]);
  const [skillsList, setSkillsList] = useState([]);
  const [industryList, setIndustryList] = useState([]);
  const [location, setLocation] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [yearError, setYearError] = useState("");
  const [tags, setTags] = useState([]); // New state for unified tags

  const memoizedCareerList = useMemo(() => careerList, [careerList]);
  const memoizedAffiliationList = useMemo(() => affiliationList, [affiliationList]);
  const memoizedSkillsList = useMemo(() => skillsList, [skillsList]);
  const memoizedIndustryList = useMemo(() => industryList, [industryList]);
  const memoizedLocation = useMemo(() => location, [location]);

  const [careerInput, setCareerInput] = useState("");
  const [affiliationInput, setAffiliationInput] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [industryInput, setIndustryInput] = useState("");
  const [locationInput, setLocationInput] = useState("");

  const [alumniList, setAlumniList] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const hasMounted = useRef(false);
  const [loading, setLoading] = useState(false);

  // For see all modal opener
  const [isSeeAllAffiliationOpen, setIsSeeAllAffiliationOpen] = useState(false);
  const [isSeeAllLocationOpen, setIsSeeAllLocationOpen] = useState(false);
  const [isSeeAllCareerOpen, setIsSeeAllCareerOpen] = useState(false);
  const [isSeeAllIndustryOpen, setIsSeeAllIndustryOpen] = useState(false);
  const [isSeeAllSkillOpen, setIsSeeAllSkillOpen] = useState(false);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
    setIsAlumniInfoExpanded(true);
    setIsBatchExpanded(true);
  };

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  // Validation function to check for year overlap
  const validateYears = (batchYear, gradYear) => {
    if (batchYear && gradYear && batchYear === gradYear) {
      setYearError("Batch Year and Graduation Year cannot be the same.");
      return false;
    }
    if (batchYear && gradYear && parseInt(batchYear) > parseInt(gradYear)) {
      setYearError("Batch Year cannot be later than Graduation Year.");
      return false;
    }
    setYearError("");
    return true;
  };

  // Modified setSelectedBatchYear to include validation and tag update
  const handleBatchYearChange = (year) => {
    if (validateYears(year, selectedGraduationYear)) {
      setSelectedBatchYear(year);
      if (year) {
        setTags((prevTags) => [
          ...prevTags.filter((tag) => tag.type !== "batch"),
          { type: "batch", value: `Batch ${year}` },
        ]);
      } else {
        setTags((prevTags) => prevTags.filter((tag) => tag.type !== "batch"));
      }
    } else {
      setSelectedBatchYear("");
      setTags((prevTags) => prevTags.filter((tag) => tag.type !== "batch"));
    }
  };

  // Modified setSelectedGraduationYear to include validation and tag update
  const handleGraduationYearChange = (year) => {
    if (validateYears(selectedBatchYear, year)) {
      setSelectedGraduationYear(year);
      if (year) {
        setTags((prevTags) => [
          ...prevTags.filter((tag) => tag.type !== "graduation"),
          { type: "graduation", value: `Graduated in ${year}` },
        ]);
      } else {
        setTags((prevTags) => prevTags.filter((tag) => tag.type !== "graduation"));
      }
    } else {
      setSelectedGraduationYear("");
      setTags((prevTags) => prevTags.filter((tag) => tag.type !== "graduation"));
    }
  };

  // Modified setCareerList to update tags
  const handleSetCareerList = (newList) => {
    setCareerList(newList);
    setTags((prevTags) => [
      ...prevTags.filter((tag) => tag.type !== "career"),
      ...newList.map((career, index) => ({ type: "career", value: career, index })),
    ]);
  };

  // Modified setAffiliationList to update tags
  const handleSetAffiliationList = (newList) => {
    setAffiliationList(newList);
    setTags((prevTags) => [
      ...prevTags.filter((tag) => tag.type !== "affiliation"),
      ...newList.map((affiliation, index) => ({ type: "affiliation", value: affiliation, index })),
    ]);
  };

  // Modified setSkillsList to update tags
  const handleSetSkillsList = (newList) => {
    setSkillsList(newList);
    setTags((prevTags) => [
      ...prevTags.filter((tag) => tag.type !== "skill"),
      ...newList.map((skill, index) => ({ type: "skill", value: skill, index })),
    ]);
  };

  // Modified setIndustryList to update tags
  const handleSetIndustryList = (newList) => {
    setIndustryList(newList);
    setTags((prevTags) => [
      ...prevTags.filter((tag) => tag.type !== "industry"),
      ...newList.map((industry, index) => ({ type: "industry", value: industry, index })),
    ]);
  };

  // Modified setLocation to update tags
  const handleSetLocation = (newList) => {
    setLocation(newList);
    setTags((prevTags) => [
      ...prevTags.filter((tag) => tag.type !== "location"),
      ...newList.map((loc, index) => ({ type: "location", value: loc, index })),
    ]);
  };

  const search = () => {
    let filters = {};
    if (selectedBatchYear !== "") {
      filters.batch = selectedBatchYear;
    }
    if (selectedGraduationYear !== "") {
      filters.graduation_year = selectedGraduationYear;
    }
    if (Array.isArray(careerList) && careerList.length > 0) {
      filters.job_title = careerList;
    }
    if (Array.isArray(affiliationList) && affiliationList.length > 0) {
      filters.affiliation = affiliationList;
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

    if (Object.keys(filters).length > 0) {
      let apiUrl = buildSearchUrl(filters);
      console.log(apiUrl);
      return apiUrl;
    }
  };

 

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    const fetchData = async () => {
      let searchAPIURL = search();
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    selectedBatchYear,
    selectedGraduationYear,
    memoizedCareerList,
    memoizedAffiliationList,
    memoizedSkillsList,
    memoizedIndustryList,
    memoizedLocation,
  ]);

  const buildSearchUrl = (filters) => {
    let baseUrl = `${API_BASE_URL}/alumni/search`;
    let queryParams = new URLSearchParams(filters).toString();
    return queryParams ? `${baseUrl}?${queryParams}` : baseUrl;
  };

  const removeSkill = (index) => {
    const updatedSkillList = skillsList.filter((_, i) => i !== index);
    handleSetSkillsList(updatedSkillList);
  };

  const removeLocation = (index) => {
    const updatedLocationList = location.filter((_, i) => i !== index);
    handleSetLocation(updatedLocationList);
  };

  const removeCareer = (index) => {
    const updatedCareerList = careerList.filter((_, i) => i !== index);
    handleSetCareerList(updatedCareerList);
  };

  const removeAffiliation = (index) => {
    const updatedAffiliationList = affiliationList.filter((_, i) => i !== index);
    handleSetAffiliationList(updatedAffiliationList);
  };

  const removeIndustry = (index) => {
    const updatedIndustryList = industryList.filter((_, i) => i !== index);
    handleSetIndustryList(updatedIndustryList);
  };

  const removeTag = (tag) => {
    switch (tag.type) {
      case "batch":
        setSelectedBatchYear("");
        setTags((prevTags) => prevTags.filter((t) => t.type !== "batch"));
        break;
      case "graduation":
        setSelectedGraduationYear("");
        setTags((prevTags) => prevTags.filter((t) => t.type !== "graduation"));
        break;
      case "career":
        removeCareer(tag.index);
        break;
      case "affiliation":
        removeAffiliation(tag.index);
        break;
      case "skill":
        removeSkill(tag.index);
        break;
      case "industry":
        removeIndustry(tag.index);
        break;
      case "location":
        removeLocation(tag.index);
        break;
      default:
        break;
    }
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
    setYearError("");
    setTags([]);
  };

  return (
    <div className="flex flex-col">
      {/* See all modals */}
      <SeeAllAffiliationModal
        isOpen={isSeeAllAffiliationOpen}
        setIsOpen={setIsSeeAllAffiliationOpen}
        setAffiliationList={handleSetAffiliationList}
        affiliationList={affiliationList}
      />
      <SeeAllLocationModal
        isOpen={isSeeAllLocationOpen}
        setIsOpen={setIsSeeAllLocationOpen}
        setLocationList={handleSetLocation}
        locationList={location}
      />
      <SeeAllCareerModal
        isOpen={isSeeAllCareerOpen}
        setIsOpen={setIsSeeAllCareerOpen}
        setCareerList={handleSetCareerList}
        CareerList={careerList}
      />
      <SeeAllIndustryModal
        isOpen={isSeeAllIndustryOpen}
        setIsOpen={setIsSeeAllIndustryOpen}
        setIndustryList={handleSetIndustryList}
        IndustryList={industryList}
      />
      <SeeAllSkillsModal
        isOpen={isSeeAllSkillOpen}
        setIsOpen={setIsSeeAllSkillOpen}
        setSkillList={handleSetSkillsList}
        SkillList={skillsList}
      />

      <motion.div
        className="fixed bottom-0 left-0 w-full bg-gray-100 z-50 p-5 shadow-lg rounded-t-2xl lg:hidden overflow-y-auto"
        style={{ maxHeight: "100vh", height: "100%" }}
        initial={{ y: "100vh" }}
        animate={{ y: isFilterOpen ? "0vh" : "100vh" }}
        exit={{ y: "100vh" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="flex lg:hidden flex-col w-full pt-3">
          <div className="flex flex-row">
            <h1 className="font-satoshi-bold text-4xl flex-4/12">Filters</h1>
            <button
              onClick={toggleFilter}
              className="cursor-pointer hover:text-primary rounded-full bg-white w-12 h-12 flex items-center justify-center"
            >
              <X size={30} />
            </button>
          </div>
          {/* MOBILE VIEW FILTER */}
          <div className="flex flex-col shadow mt-14 rounded-lg gap-3 items-center h-auto">
            <div className="flex flex-row py-3 w-11/12" onClick={() => setIsAlumniInfoExpanded(!isALumniInfoExpanded)}>
              <motion.h1
                className="font-satoshi-medium justify"
                initial={{ fontWeight: 500, fontSize: "1.00rem" }}
                animate={{
                  fontWeight: isALumniInfoExpanded ? 500 : 500,
                  fontSize: isALumniInfoExpanded ? "1.00rem" : "1.25rem",
                }}
                transition={{ duration: 0.2 }}
              >
                Alumni Information
              </motion.h1>
              <motion.button
                className="cursor-pointer hover:text-primary ml-auto"
                animate={{ rotate: isALumniInfoExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={30} />
              </motion.button>
            </div>
            <motion.div
              className={`overflow-hidden w-11/12 justify-center ${isALumniInfoExpanded ? "pb-6" : ""}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: isALumniInfoExpanded ? "auto" : 0, opacity: isALumniInfoExpanded ? 1 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {/* Alumni Batch Filter */}
              <div className="flex flex-col shadow rounded-lg gap-3 bg-white">
                <div className="flex flex-row px-5 py-3" onClick={() => setIsBatchExpanded(!isBatchExpanded)}>
                  <motion.h1
                    className="flex-1/2 font-satoshi-medium"
                    initial={{ fontWeight: 500, fontSize: "1.00rem" }}
                    animate={{
                      fontWeight: isBatchExpanded ? 600 : 500,
                      fontSize: isBatchExpanded ? "1.50rem" : "1.25rem",
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    Batch of Alumni
                  </motion.h1>
                  <span className="text-sm font-satoshi-medium text-gray-400 pt-2 pr-2">{selectedBatchYear}</span>
                  <motion.button
                    className="cursor-pointer hover:text-primary"
                    animate={{ rotate: isBatchExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={30} />
                  </motion.button>
                </div>
                <motion.div
                  className="overflow-hidden"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: isBatchExpanded ? "auto" : 0, opacity: isBatchExpanded ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="px-5 pb-5 flex items-center justify-center flex-row gap-2">
                    <Calendar className="text-primary hidden md:block" />
                    <YearPicker
                      selectedYear={selectedBatchYear}
                      setSelectedYear={handleBatchYearChange}
                      restrictedYear={selectedGraduationYear}
                    />
                  </div>
                  {yearError && isBatchExpanded && (
                    <p className="text-red-500 text-sm px-5">{yearError}</p>
                  )}
                  <div
                    onClick={() => {
                      setIsGraduateExpanded(true);
                      setIsBatchExpanded(false);
                    }}
                    className="flex lg:hidden justify-between px-5 pb-3"
                  >
                    <button
                      onClick={() => {
                        setSelectedBatchYear("");
                        setIsGraduateExpanded(true);
                        setIsBatchExpanded(false);
                      }}
                      className="text-black px-4 py-2 rounded-lg underline font-satoshi-medium cursor-pointer hover:text-gray-500"
                    >
                      Skip
                    </button>
                    <button
                      onClick={() => {
                        setIsGraduateExpanded(true);
                        setIsBatchExpanded(false);
                      }}
                      className="bg-primary text-white px-4 py-2 rounded-2xl hover:bg-primary-dark hover:bg-blue-950 cursor-pointer"
                    >
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
                      fontWeight: isGraduateExpanded ? 600 : 500,
                      fontSize: isGraduateExpanded ? "1.50rem" : "1.25rem",
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    Year Alumni Graduated
                  </motion.h1>
                  <span className="text-sm font-satoshi-medium text-gray-400 pt-5 pr-2">{selectedGraduationYear}</span>
                  <motion.button
                    className="cursor-pointer hover:text-primary"
                    animate={{ rotate: isGraduateExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={30} />
                  </motion.button>
                </div>
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
                      setSelectedYear={handleGraduationYearChange}
                      restrictedYear={selectedBatchYear}
                    />
                  </div>
                  {yearError && isGraduateExpanded && (
                    <p className="text-red-500 text-sm px-5">{yearError}</p>
                  )}
                  <div className="flex lg:hidden justify-between px-5 pb-3">
                    <button
                      onClick={() => {
                        setSelectedGraduationYear("");
                        setIsAffiliationExpanded(true);
                        setIsGraduateExpanded(false);
                      }}
                      className="text-black px-4 py-2 rounded-lg underline font-satoshi-medium cursor-pointer hover:text-gray-500"
                    >
                      Skip
                    </button>
                    <button
                      onClick={() => {
                        setIsAffiliationExpanded(true);
                        setIsGraduateExpanded(false);
                      }}
                      className="bg-primary text-white px-4 py-2 rounded-2xl hover:bg-primary-dark hover:bg-blue-950 cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                </motion.div>
              </div>
              <AlumniAffiliationFilter
                isAffiliationExpanded={isAffiliationExpanded}
                setIsAffiliationExpanded={setIsAffiliationExpanded}
                affiliationInput={affiliationInput}
                setAffiliationInput={setAffiliationInput}
                affiliationList={affiliationList}
                setAffiliationList={handleSetAffiliationList}
                setIsLocationExpanded={setIsLocationExpanded}
                isSeeAllAffiliationOpen={isSeeAllAffiliationOpen}
                setIsSeeAllAffiliationOpen={setIsSeeAllAffiliationOpen}
              />
              <AlumniLocationFilter
                isLocationExpanded={isLocationExpanded}
                setIsLocationExpanded={setIsLocationExpanded}
                locationInput={locationInput}
                setLocationInput={setLocationInput}
                location={location}
                setLocation={handleSetLocation}
                setIsIndustryExpanded={setIsIndustryExpanded}
                setIsAlumniProfessionExpanded={setIsAlumniProfessionExpanded}
                setIsCareerExpanded={setIsCareerExpanded}
                setIsAlumniInfoExpanded={setIsAlumniInfoExpanded}
                setIsSeeAllLocationOpen={setIsSeeAllLocationOpen}
              />
            </motion.div>
          </div>
          <div className="flex flex-col shadow mt-5 rounded-lg gap-3 items-center h-auto">
            <div className="flex flex-row py-3 w-11/12" onClick={() => setIsAlumniProfessionExpanded(!isAlumniProfessionExpanded)}>
              <motion.h1
                className="font-satoshi-medium justify"
                initial={{ fontWeight: 500, fontSize: "1.00rem" }}
                animate={{
                  fontWeight: isAlumniProfessionExpanded ? 500 : 500,
                  fontSize: isAlumniProfessionExpanded ? "1.00rem" : "1.25rem",
                }}
                transition={{ duration: 0.2 }}
              >
                Alumni Profession
              </motion.h1>
              <motion.button
                className="cursor-pointer hover:text-primary ml-auto"
                animate={{ rotate: isAlumniProfessionExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={30} />
              </motion.button>
            </div>
            <motion.div
              className={`overflow-hidden w-11/12 justify-center ${isAlumniProfessionExpanded ? "pb-6" : ""}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: isAlumniProfessionExpanded ? "auto" : 0, opacity: isAlumniProfessionExpanded ? 1 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <AlumniCareerFilter
                isCareerExpanded={isCareerExpanded}
                setIsCareerExpanded={setIsCareerExpanded}
                careerInput={careerInput}
                setCareerInput={setCareerInput}
                careerList={careerList}
                setCareerList={handleSetCareerList}
                setIsIndustryExpanded={setIsIndustryExpanded}
                setIsSeeAllCareerOpen={setIsSeeAllCareerOpen}
              />
              <AlumniIndustryFilter
                isIndustryExpanded={isIndustryExpanded}
                setIsIndustryExpanded={setIsIndustryExpanded}
                industryInput={industryInput}
                setIndustryInput={setIndustryInput}
                industryList={industryList}
                setIndustryList={handleSetIndustryList}
                setIsSkillsExpanded={setIsSkillsExpanded}
                setIsAlumniProfessionExpanded={setIsAlumniProfessionExpanded}
                setIsSeeAllIndustryOpen={setIsSeeAllIndustryOpen}
              />
            </motion.div>
          </div>
          <AlumniSkillsFilter
            isSkillsExpanded={isSkillsExpanded}
            setIsSkillsExpanded={setIsSkillsExpanded}
            skillsInput={skillsInput}
            setSkillsInput={setSkillsInput}
            skillsList={skillsList}
            setSkillsList={handleSetSkillsList}
            setIsLocationExpanded={setIsLocationExpanded}
            setIsSeeAllSkillOpen={setIsSeeAllSkillOpen}
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
              setIsAlumniInfoExpanded(false);
              setIsAlumniProfessionExpanded(false);
            }}
            className="text-black px-4 py-2 font-satoshi-medium cursor-pointer rounded-2xl bg-white shadow-2xl"
          >
            Clear All
          </button>
          <button
            onClick={() => {
              setIsFilterOpen(false);
              setIsBatchExpanded(false);
              setIsGraduateExpanded(false);
              setIsCareerExpanded(false);
              setIsAffiliationExpanded(false);
              setIsSkillsExpanded(false);
              setIsIndustryExpanded(false);
              setIsLocationExpanded(false);
            }}
            className="bg-primary text-white px-4 py-2 rounded-2xl hover:bg-primary-dark hover:bg-blue-950 cursor-pointer shadow-2xl"
          >
            Confirm
          </button>
        </div>
      </motion.div>
      <div className="flex flex-col w-full mt-8 shadow-md pb-8 items-center rounded-full">
        <div className="flex flex-row gap-5 w-full items-center justify-center">
          <SearchBar
            selectedBatchYear={selectedBatchYear}
            selectedGraduationYear={selectedGraduationYear}
            careerList={careerList}
            affiliationList={affiliationList}
            skillsList={skillsList}
            industryList={industryList}
            location={location}
            setSearchInput={setSearchInput}
            searchInput={searchInput}
            setLoading={setLoading}
            setAlumniList={setAlumniList}
          />
          <button
            onClick={toggleFilter}
            className="flex flex-center h-14 cursor-pointer rounded-2xl outline-gray-300 outline-2 bg-gray-100 text-primary w-12 justify-center items-center text-center lg:hidden"
          >
            <Filter size={20} />
          </button>
        </div>
      </div>
      {/* Desktop */}
      <div className="flex flex-row md:justify-left justify-center h-screen">
        <div className="hidden lg:flex flex-col pr-6 border-r-2 border-gray-300 w-1/4 pt-16 h-screen">
          <div className="flex flex-row">
            <h1 className="font-satoshi-bold text-4xl flex-4/12">Filters</h1>
            <button
              className="mr-2 underline font-satoshi-medium mt-4 cursor-pointer hover:text-primary"
              onClick={() => {
                resetAllFilters();
                setIsBatchExpanded(false);
                setIsGraduateExpanded(false);
                setIsCareerExpanded(false);
                setIsAffiliationExpanded(false);
                setIsSkillsExpanded(false);
                setIsIndustryExpanded(false);
                setIsLocationExpanded(false);
                setIsAlumniProfessionExpanded(false);
                setIsAlumniInfoExpanded(false);
              }}
            >
              Reset All
            </button>
            <button className="mt-4 cursor-pointer hover:text-primary">
              <X size={24} />
            </button>
          </div>
          <div className="flex flex-col shadow-lg mt-14 rounded-lg gap-3 items-center h-auto">
            <div className="flex flex-row py-3 w-11/12" onClick={() => setIsAlumniInfoExpanded(!isALumniInfoExpanded)}>
              <motion.h1
                className="font-satoshi-medium justify"
                initial={{ fontWeight: 500, fontSize: "1.00rem" }}
                animate={{
                  fontWeight: isALumniInfoExpanded ? 500 : 500,
                  fontSize: isALumniInfoExpanded ? "1.00rem" : "1.25rem",
                }}
                transition={{ duration: 0.2 }}
              >
                Alumni Information
              </motion.h1>
              <motion.button
                className="cursor-pointer hover:text-primary ml-auto"
                animate={{ rotate: isALumniInfoExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={30} />
              </motion.button>
            </div>
            <motion.div
              className={`overflow-hidden w-11/12 justify-center ${isALumniInfoExpanded ? "pb-6" : ""}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: isALumniInfoExpanded ? "auto" : 0, opacity: isALumniInfoExpanded ? 1 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="flex flex-col shadow-md rounded-lg gap-3">
                <div className="flex flex-row px-5 py-3" onClick={() => setIsBatchExpanded(!isBatchExpanded)}>
                  <motion.h1
                    className="flex-1/2 font-satoshi-medium"
                    initial={{ fontWeight: 500, fontSize: "1.25rem" }}
                    animate={{
                      fontWeight: isBatchExpanded ? 600 : 500,
                      fontSize: isBatchExpanded ? "1.50rem" : "1.25rem",
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    Batch of Alumni
                  </motion.h1>
                  <span className="text-sm font-satoshi-medium text-gray-400 pt-2 pr-2">{selectedBatchYear}</span>
                  <motion.button
                    className="cursor-pointer hover:text-primary"
                    animate={{ rotate: isBatchExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={30} />
                  </motion.button>
                </div>
                <motion.div
                  className="overflow-hidden"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: isBatchExpanded ? "auto" : 0, opacity: isBatchExpanded ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="px-5 pb-5 flex items-center justify-center flex-row gap-2">
                    <h1>
                      <Calendar size={20} className="text-primary" />
                    </h1>
                    <YearPicker
                      selectedYear={selectedBatchYear}
                      setSelectedYear={handleBatchYearChange}
                      restrictedYear={selectedGraduationYear}
                    />
                  </div>
                  {yearError && isBatchExpanded && (
                    <p className="text-red-500 text-sm px-5">{yearError}</p>
                  )}
                </motion.div>
              </div>
              <div className="flex flex-col shadow-md mt-5 rounded-lg gap-3">
                <div className="flex flex-row px-5 py-3" onClick={() => setIsGraduateExpanded(!isGraduateExpanded)}>
                  <motion.h1
                    className="flex-1/2 font-satoshi-medium"
                    initial={{ fontWeight: 500, fontSize: "1.00rem" }}
                    animate={{
                      fontWeight: isGraduateExpanded ? 600 : 500,
                      fontSize: isGraduateExpanded ? "1.50rem" : "1.25rem",
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    Year Alumni Graduated
                  </motion.h1>
                  <span className="text-sm font-satoshi-medium text-gray-400 pt-5 pr-2">{selectedGraduationYear}</span>
                  <motion.button
                    className="cursor-pointer hover:text-primary"
                    animate={{ rotate: isGraduateExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={30} />
                  </motion.button>
                </div>
                <motion.div
                  className="overflow-hidden"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: isGraduateExpanded ? "auto" : 0, opacity: isGraduateExpanded ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="px-5 pb-5 flex items-center justify-center flex-row gap-2">
                    <h1>
                      <Calendar size={20} className="text-primary" />
                    </h1>
                    <YearPicker
                      selectedYear={selectedGraduationYear}
                      setSelectedYear={handleGraduationYearChange}
                      restrictedYear={selectedBatchYear}
                    />
                  </div>
                  {yearError && isGraduateExpanded && (
                    <p className="text-red-500 text-sm px-5">{yearError}</p>
                  )}
                </motion.div>
              </div>
              <AlumniAffiliationFilter
                isAffiliationExpanded={isAffiliationExpanded}
                setIsAffiliationExpanded={setIsAffiliationExpanded}
                affiliationInput={affiliationInput}
                setAffiliationInput={setAffiliationInput}
                affiliationList={affiliationList}
                setAffiliationList={handleSetAffiliationList}
                isSeeAllAffiliationOpen={isSeeAllAffiliationOpen}
                setIsSeeAllAffiliationOpen={setIsSeeAllAffiliationOpen}
              />
              <AlumniLocationFilter
                isLocationExpanded={isLocationExpanded}
                setIsLocationExpanded={setIsLocationExpanded}
                locationInput={locationInput}
                setLocationInput={setLocationInput}
                location={location}
                setLocation={handleSetLocation}
                setIsSeeAllLocationOpen={setIsSeeAllLocationOpen}
              />
            </motion.div>
          </div>
          <div className="flex flex-col shadow-lg mt-5 rounded-lg gap-3 items-center h-auto">
            <div className="flex flex-row py-3 w-11/12" onClick={() => setIsAlumniProfessionExpanded(!isAlumniProfessionExpanded)}>
              <motion.h1
                className="font-satoshi-medium justify"
                initial={{ fontWeight: 500, fontSize: "1.00rem" }}
                animate={{
                  fontWeight: isAlumniProfessionExpanded ? 500 : 500,
                  fontSize: isAlumniProfessionExpanded ? "1.00rem" : "1.25rem",
                }}
                transition={{ duration: 0.2 }}
              >
                Alumni Profession
              </motion.h1>
              <motion.button
                className="cursor-pointer hover:text-primary ml-auto"
                animate={{ rotate: isAlumniProfessionExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={30} />
              </motion.button>
            </div>
            <motion.div
              className={`overflow-hidden w-11/12 justify-center ${isAlumniProfessionExpanded ? "pb-6" : ""}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: isAlumniProfessionExpanded ? "auto" : 0, opacity: isAlumniProfessionExpanded ? 1 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <AlumniCareerFilter
                isCareerExpanded={isCareerExpanded}
                setIsCareerExpanded={setIsCareerExpanded}
                careerInput={careerInput}
                setCareerInput={setCareerInput}
                careerList={careerList}
                setCareerList={handleSetCareerList}
                setIsSeeAllCareerOpen={setIsSeeAllCareerOpen}
              />
              <AlumniIndustryFilter
                isIndustryExpanded={isIndustryExpanded}
                setIsIndustryExpanded={setIsIndustryExpanded}
                industryInput={industryInput}
                setIndustryInput={setIndustryInput}
                industryList={industryList}
                setIndustryList={handleSetIndustryList}
                setIsSeeAllIndustryOpen={setIsSeeAllIndustryOpen}
              />
            </motion.div>
          </div>
          <AlumniSkillsFilter
            isSkillsExpanded={isSkillsExpanded}
            setIsSkillsExpanded={setIsSkillsExpanded}
            skillsInput={skillsInput}
            setSkillsInput={setSkillsInput}
            skillsList={skillsList}
            setSkillsList={handleSetSkillsList}
            setIsSeeAllSkillOpen={setIsSeeAllSkillOpen}
          />
        </div>
        {/* General Tags Filter */}
        <div className="w-2/3 flex flex-col md:pl-10">
          {tags.length > 0 && (
            <div className="flex flex-row flex-wrap mt-5 pl-10 mb-4 gap-2 items-center">
              {tags.map((tag, index) => (
                <div key={`${tag.type}-${tag.index || index}`} className="flex flex-row bg-primary rounded-full h-7 items-center px-2">
                  <h1 className="text-white font-satoshi-light truncate md:text-md text-sm max-w-36">{tag.value}</h1>
                  <button onClick={() => removeTag(tag)}>
                    <X className="text-white ml-2" size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
          {!loading && Array.isArray(alumniList) && (
            <h1 className="md:text-3xl text-xl font-satoshi-medium text-gray-500 pl-10 py-6 lg:text-left text-center">
              {alumniList.length} Search Results
            </h1>
          )}
          {loading && (
            <h1 className="md:text-3xl text-xl font-satoshi-medium text-gray-400 pl-10 py-6 lg:text-left text-center">
              Searching...
            </h1>
          )}
          <div className="flex flex-row flex-wrap gap-24 items-center justify-center h-screen overflow-y-auto scrollbar-left">
            {Array.isArray(alumniList) &&
              alumniList.map((alumnus, index) => (
                <AlumniSearchCard
                  key={index}
                  full_name={alumnus.full_name}
                  graduation_year={alumnus.graduation_year}
                  job_title={alumnus.job_title}
                  skills={alumnus.skills}
                  location={alumnus.location}
                  email={alumnus.email}
                  picture={alumnus.picture}
                  user_id={alumnus.user_id}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlumniSearch;