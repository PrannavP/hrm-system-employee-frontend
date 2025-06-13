import SideNavBar from "../../components/SideNavBar";
import withAuthRedirect from "../../hocs/withAuthRedirect";
import { useState } from "react";
import LeavesTabComponent from "./LeavesTabComponent";
import AskLeavesTabComponent from "./AskLeavesComponent";

const LeavePage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"leaves" | "askLeaves">("leaves");

    return (
        <div className="flex">
            <SideNavBar />
            <div className="flex-1 p-6">
                {/* Header */}
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Leaves Management</h1>

                {/* Tab Buttons */}
                <div className="flex gap-2 mb-8 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab("leaves")}
                        className={`button flex-1 py-3 px-6 text-center font-medium transition-colors ${
                            activeTab === "leaves"
                                ? "border-b-2 border-blue-600 text-blue-600"
                                : "text-gray-600 hover:text-blue-600"
                        }`}
                    >
                        Leaves
                    </button>

                    <button
                        onClick={() => setActiveTab("askLeaves")}
                        className={`button flex-1 py-3 px-6 text-center font-medium transition-colors ${
                            activeTab === "askLeaves"
                                ? "border-b-2 border-blue-600 text-blue-600"
                                : "text-gray-600 hover:text-blue-600"
                        }`}
                    >
                        Ask Leaves
                    </button>
                </div>

                {/* Content */}
                <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
                    {activeTab === "leaves" ? <LeavesTabComponent /> : <AskLeavesTabComponent />}
                </div>
            </div>
        </div>
    );
};

const AuthRedirectedLeave = withAuthRedirect(LeavePage);
export default AuthRedirectedLeave;