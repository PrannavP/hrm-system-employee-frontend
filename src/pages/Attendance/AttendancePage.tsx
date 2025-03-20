import SideNavBar from "../../components/SideNavBar";
import withAuthRedirect from "../../hocs/withAuthRedirect";

const AttendancePage:React.FC = () => {
    return(
        <div className="flex">
            <SideNavBar />
            <div className="flex-1 p-6">
                <h1 className="text-2xl text-blue-500">Employee Attendance Page</h1>
            </div>
        </div>
    )
};

const AuthRedirectedAttendance = withAuthRedirect(AttendancePage);
export default AuthRedirectedAttendance;