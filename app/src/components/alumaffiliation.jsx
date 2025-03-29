import { motion } from "framer-motion";
import { ChevronDown, Search, X } from "lucide-react"; // Assuming you're using React Feather for icons

const AlumniAffiliationFilter = ({
  isAffiliationExpanded,
  setIsAffiliationExpanded,
  affiliationInput,
  setAffiliationInput,
  affiliationList,
  setAffiliationList,
}) => {

    const affiliations = [
        "Young Software Engineers' Society",
        "Alliance of Computer Science Students",
        "Computer Science Society",
        "Mathematical Science Society",
        "El Gamma Penumbra"
    ]

    // Handle the enter key press
  const handleAffiliationSearch = (e) => {
    if (e.key === "Enter" && affiliationInput.trim()) {
      setAffiliationList([...affiliationList, affiliationInput]); // Add the input to AffiliationList
      setAffiliationInput(""); // Clear the input field after submitting
    }
  };

  const removeAffiliation = (index) => {
    // Create a new array excluding the Affiliation at the given index
    const updatedAffiliationList = affiliationList.filter((_, i) => i !== index);
    
    // Update the state with the new list
    setAffiliationList(updatedAffiliationList);
  };

  // Filter affiliationss based on user input
  const filteredaffiliations = affiliations.filter(affiliation => affiliation.toLowerCase().includes(affiliationInput.toLowerCase()));

  return (

    

    <div className="flex flex-col shadow mt-5 rounded-lg">
      <div className="flex flex-row px-5 py-3" onClick={() => setIsAffiliationExpanded(!isAffiliationExpanded)}>
        <motion.h1
          className="flex-1/2 font-satoshi-medium"
          initial={{ fontWeight: 500, fontSize: "1.00rem" }}
          animate={{
            fontWeight: isAffiliationExpanded ? 600 : 500, // Bold when expanded
            fontSize: isAffiliationExpanded ? "1.25rem" : "1.00rem", // lg: 1.25rem, sm: 0.875rem
          }}
          transition={{ duration: 0.2 }}
        >
          Alumni Affiliation
        </motion.h1>

        <motion.button
          className="cursor-pointer hover:text-primary"
          animate={{ rotate: isAffiliationExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={30} />
        </motion.button>
      </div>

      {/* Alumni Affiliation */}
      <motion.div
        className="overflow-hidden"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isAffiliationExpanded ? "auto" : 0, opacity: isAffiliationExpanded ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="px-5 flex items-center justify-center flex-row gap-2">
          <div className="relative w-full justify-center items-center flex">
            <input
              type="search"
              className="bg-white text-black border h-12 border-gray-300 focus:border-primary focus:outline-none rounded-2xl w-11/12 pl-10 pr-4 py-2"
              placeholder="Enter type of Affiliation"
              value={affiliationInput}
              onChange={(e) => setAffiliationInput(e.target.value)} // Update input value
              onKeyDown={handleAffiliationSearch} // Handle enter key press
            />
            <span className="absolute left-8 top-1/2 transform -translate-y-1/2 text-primary">
              <Search size={18} strokeWidth={2} />
            </span>
          </div>
        </div>

        {/* Affiliation Tags */}
        {affiliationList.length > 0 && (
          <div className="flex flex-row flex-wrap mt-5 pl-10 mb-4 gap-2 items-center">
            {affiliationList.map((Affiliation, index) => (
              <div key={index} className="flex flex-row bg-primary rounded-full h-auto items-center px-2">
                <h1 className="text-white font-satoshi-light truncate text-sm">{Affiliation}</h1>
                <button onClick={() => removeAffiliation(index)}>
                  <X className="text-white ml-2" size={20} />
                </button>
              </div>
            ))}
          </div>
        )}


        <div className="flex flex-row px-12 pb-3 pt-5">
          <h1 className="flex-1 text-gray-400">Suggestions</h1>
          <button>
            <h1 className="underline text-primary">See all</h1>
          </button>
        </div>

        {/* affiliations Suggestions */}
        <ul>
          {affiliationInput === "" ? (
            affiliations.slice(0, 4).map((affiliations, index) => (
              !affiliationList.includes(affiliations) && ( // Check if affiliations is not already in AffiliationList
                <div key={index} className="cursor-pointer py-2 bg-gray-100 mb-3 mx-12 rounded-full h-10">
                  <button
                    className="pl-5 font-satoshi-medium w-full h-full text-left cursor-pointer"
                    onClick={() => setAffiliationList([...affiliationList, affiliations])}
                  >
                    {affiliations}
                  </button>
                </div>
              )
            ))
          ) : (
            filteredaffiliations.map((affiliations, index) => (
              !affiliationList.includes(affiliations) && ( // Check if affiliations is not already in AffiliationList
                <div key={index} className="cursor-pointer py-2 bg-gray-100 mb-3 mx-12 rounded-full h-10">
                  <button
                    className="pl-5 font-satoshi-medium w-full h-full text-left cursor-pointer"
                    onClick={() => setAffiliationList([...affiliationList, affiliations])}
                  >
                    {affiliations}
                  </button>
                </div>
              )
            ))
          )}
        </ul>
      </motion.div>
    </div>
  );
};

export default AlumniAffiliationFilter;
