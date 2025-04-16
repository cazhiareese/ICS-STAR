import { createContext, useContext, useState } from "react";

const OnboardingContext = createContext();      

export function OnboardingProvider({ children }) {
    const [currentSection, setCurrentSection] = useState(0);


    const [name, setName] = useState("___")
    const [email, setEmail] = useState("___")
    const [userType, setUserType] = useState("___")


    const [userData, setUserData] = useState({
        profilePicture: null,
        scholarshipList: [],
        affiliationList:[],
        roleList:[],
        jobTitle: "",
        companyName: "",
        industrySector: "",
        workType: "",
        employmentType: "employed",
        tenureStatus: "",
        sameAsBase: false,
        salaryRange: 11,
        remote: false,
        reason: [],
        workCountry: "",
        workCity: "",
        baseCity:"",
        baseCountry: "",
        sameWorkBase: false,
        skillsInterests: [],
        profilePictureFile: null,
        workMode: "Onsite",     // Onsite or Remote
        employerclass: "",
        suggestions: [
            "Artificial Intelligence",
            "Cybersecurity",
            "Web Development",
            "Game Development",
            "Machine Learning",
            "UI/UX Designing",
            "Mobile Development",
            "Frontend Developing",
        ]
    });

    const updateUserData = (field, value) => {
        setUserData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <OnboardingContext.Provider value={{ setUserData, userData, updateUserData, email, setEmail, currentSection, setCurrentSection, name, setName, userType, setUserType}}>
            {children}
        </OnboardingContext.Provider>
    );
}

//Ensure function is wrapped properly
export function useOnboardingContext() {           
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error("useOnboardingContext must be used within an OnboardingProvider");
    }
    return context;
}
