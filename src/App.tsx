import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import './styles/index.css';
import './styles/global.css';

import LoginPage from "./pages/LoginPage";
import Index from "./pages/Index"; // dashboard
import AttendancePage from "./pages/AttendancePage";
import TasksPage from "./pages/TasksPage";
import LeavePage from "./pages/LeavePage";
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