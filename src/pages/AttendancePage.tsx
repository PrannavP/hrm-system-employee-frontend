import SideNavBar from "../components/SideNavBar";

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

export default AttendancePage;