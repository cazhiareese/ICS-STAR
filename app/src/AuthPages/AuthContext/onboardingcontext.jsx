import { createContext, useContext, useState } from "react";

const OnboardingContext = createContext();

export function OnboardingProvider({ children }) {
    const [currentSection, setCurrentSection] = useState(0);

    return (
        <OnboardingContext.Provider value={{ currentSection, setCurrentSection }}>
            {children}
        </OnboardingContext.Provider>
    );
}

// Ensure function is wrapped properly
export function useOnboardingContext() {
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error("useOnboardingContext must be used within an OnboardingProvider");
    }
    return context;
}
