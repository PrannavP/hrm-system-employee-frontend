import SideNavBar from "../components/SideNavBar";

const TasksPage:React.FC = () => {
    return(
        <div className="flex">
            <SideNavBar />
            <div className="flex-1 p-6">
                <h1 className="text-2xl text-blue-500">Employee Tasks Page</h1>
            </div>
        </div>
    );
};

export default TasksPage;