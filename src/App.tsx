import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import './styles/index.css';
import './styles/global.css';

import LoginPage from "./pages/LoginPage";
import Index from "./pages/Dashboard/Index"; // dashboard
import AttendancePage from "./pages/Attendance/AttendancePage";
import TasksPage from "./pages/Task/TasksPage";
import LeavePage from "./pages/Leave/LeavePage";
import NotFoundPage from "./pages/NotFoundPage";


const App = () => {
    return(
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<Index />} />
                <Route path="/attendance" element={<AttendancePage />} />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/leave" element={<LeavePage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
};

export default App;