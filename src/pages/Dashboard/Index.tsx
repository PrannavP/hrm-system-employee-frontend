import SideNavBar from "../../components/SideNavBar";
import CheckInOutComponent from "./CheckInOutComponent";

const Index = () => {
    return(
        <div className="flex">
            <SideNavBar />
            <div className="flex-1 p-6">
                <h1 className="text-3xl text-black font-semibold">Dashboard</h1>
                <div className="mt-6">
                    <CheckInOutComponent />
                </div>
            </div>
        </div>
    );
};

export default Index;