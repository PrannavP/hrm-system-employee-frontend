import SideNavBar from "../../components/SideNavBar";
import withAuthRedirect from "../../hocs/withAuthRedirect";
import CheckInOutComponent from "./CheckInOutComponent";
import EmployeeDetailsComponents from "./EmployeeDetailsComponents";

const Index:React.FC = () => {
    return(
        <div className="flex">
            <SideNavBar />
            <div className="flex-1 p-6">
                <h1 className="text-3xl text-black font-semibold">Dashboard</h1>
                <div className="mt-6">
                    <EmployeeDetailsComponents />
                    <CheckInOutComponent />
                </div>
            </div>
        </div>
    );
};

const AuthRedirectedIndex = withAuthRedirect(Index);
export default AuthRedirectedIndex;