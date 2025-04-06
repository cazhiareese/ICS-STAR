import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        fileName: "",
        fileSize: "",
        file: null,
        value: "",
        academicYear: "",
        selectedYear: "",
        selectedTerm: "",
        image: "",
        type: "",
        confirmPassword: ""
    });

    const updateUserData = (field, value) => {
        setUserData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const [currentSection, setCurrentSection] = useState("0")

    const [userType, setUserType] = useState("Undefined")
    return (
        <AppContext.Provider value={{ updateUserData, userType, setUserType, userData, setUserData, currentSection, setCurrentSection}}>
            {children}
        </AppContext.Provider>
    );
}


export function useAppContext() {
   
    return useContext(AppContext);
}
