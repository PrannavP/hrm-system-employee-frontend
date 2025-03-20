import SideNavBar from "../../components/SideNavBar";
import withAuthRedirect from "../../hocs/withAuthRedirect";

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

const AuthRedirectedTasks = withAuthRedirect(TasksPage);
export default AuthRedirectedTasks;