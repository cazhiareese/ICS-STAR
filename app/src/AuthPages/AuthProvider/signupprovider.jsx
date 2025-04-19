import { AppProvider } from "../AuthContext/signupcontext.jsx";
import AdminInfo from "../SignupSteps/admininformation.jsx"
import MainPanel from "../SignupSteps/mainpanel.jsx"
import PersonalInformation from "../SignupSteps/personalinformation.jsx"
import StudentInformation from "../SignupSteps/studentinformation.jsx"
import Success from "../SignupSteps/successpage.jsx"


function SignupProvider() {
    return (
        <AppProvider>
            <AdminInfo />
            <MainPanel />
            <PersonalInformation/>
            <StudentInformation/>
            <Success/>
        </AppProvider>
    );
}

export default SignupProvider;
