import { NavLink, useNavigate } from "react-router-dom";
import {
    RxDashboard,
    RxClock,
    RxCheckbox,
    RxCalendar,
    RxExit,
} from "react-icons/rx";

const SideNavBar: React.FC = () => {
    const navigate = useNavigate();

    const logoutFnc = () => {
        // Perform any logout logic here (e.g., clearing tokens, user data, etc.)
        // Redirect to the login page
        navigate("/login");
    };

    const linkClass =
        "flex items-center text-lg font-medium hover:text-gray-500";
    const activeClass = "text-blue-600 font-bold";

    return (
        <div className="h-screen w-64 bg-white text-black flex flex-col border-r border-gray-300">
            <div className="flex items-center justify-center h-20 border-b border-gray-300">
                <h1 className="text-2xl font-bold">Employee Portal</h1>
            </div>
            <nav className="flex-1 ml-1 px-4 py-6">
                <ul>
                    <li className="mb-4">
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) =>
                                `${linkClass} ${isActive ? activeClass : ""}`
                            }
                        >
                            <RxDashboard className="mr-2 text-black" />
                            Dashboard
                        </NavLink>
                    </li>
                    <li className="mb-4">
                        <NavLink
                            to="/attendance"
                            className={({ isActive }) =>
                                `${linkClass} ${isActive ? activeClass : ""}`
                            }
                        >
                            <RxClock className="mr-2 text-black" />
                            Attendance
                        </NavLink>
                    </li>
                    <li className="mb-4">
                        <NavLink
                            to="/tasks"
                            className={({ isActive }) =>
                                `${linkClass} ${isActive ? activeClass : ""}`
                            }
                        >
                            <RxCheckbox className="mr-2 text-black" />
                            Tasks
                        </NavLink>
                    </li>
                    <li className="mb-4">
                        <NavLink
                            to="/leave"
                            className={({ isActive }) =>
                                `${linkClass} ${isActive ? activeClass : ""}`
                            }
                        >
                            <RxCalendar className="mr-2 text-black" />
                            Leave Management
                        </NavLink>
                    </li>
                </ul>
            </nav>
            <div className="mt-auto flex items-center justify-center h-20 border-t border-gray-300">
                <button
                    onClick={logoutFnc}
                    className="button flex items-center text-lg font-medium hover:text-gray-500"
                >
                    <RxExit className="mr-2 text-black" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default SideNavBar;
