import SideNavBar from "../../components/SideNavBar";
import CheckInOutComponent from "./CheckInOutComponent";

const Index = () => {
    return(
        <div className="flex">
            <SideNavBar />
            <div className="flex-1 p-6">
                <h1 className="text-2xl text-blue-500">Employee Dashboard Page</h1>
                <div>
                    <CheckInOutComponent />
                </div>
            </div>
        </div>
    );
};

export default Index;