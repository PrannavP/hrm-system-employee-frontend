import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SideNavBar from "../../components/SideNavBar";
import { getEmployeeAssignedTasks, updateTaskStatus } from "../../services/api";

type Task = {
    id: number;
    title: string;
    description: string;
    assigned_to: number;
    assigned_by: number;
    priority: string;
    status: string;
    start_date: string;
    due_date: string;
    completed_at: string | null;
    remarks: string;
    created_at: string;
    updated_at: string;
};

const EditTaskPage: React.FC = () => {
    const { assigned_to, task_id } = useParams();
    const [task, setTask] = useState<Task | null>(null);
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTask = async () => {
            setLoading(true);
            try {
                const response = await getEmployeeAssignedTasks(Number(assigned_to), Number(task_id));
                if (response.data.tasks && response.data.tasks.length > 0) {
                    setTask(response.data.tasks[0]);
                    setStatus(response.data.tasks[0].status);
                }
            } catch (error) {
                console.error("Error fetching task:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTask();
    }, [assigned_to, task_id]);

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatus(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (!task) {
                alert("Task not found.");
                return;
            }
            await updateTaskStatus(task.id, status);
            alert("Task status updated successfully!");
        } catch (error) {
            console.error("Failed to update task status:", error);
            alert("Failed to update status. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="flex font-sans bg-gray-100 min-h-screen">
                <div className="w-64 flex-shrink-0">
                    <SideNavBar />
                </div>
                <div className="flex-grow flex items-center justify-center">
                    <div className="p-8 text-center text-gray-500">Loading...</div>
                </div>
            </div>
        );
    }

    if (!task) {
        return (
            <div className="flex font-sans bg-gray-100 min-h-screen">
                <div className="w-64 flex-shrink-0">
                    <SideNavBar />
                </div>
                <div className="flex-grow flex items-center justify-center">
                    <div className="p-8 text-center text-red-500">Task not found.</div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex font-sans bg-gray-100 min-h-screen">
            <div className="w-64 flex-shrink-0 h-screen sticky top-0">
                <SideNavBar />
            </div>
            <div className="flex-grow flex items-center justify-center p-6">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg border border-gray-200"
                >
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Task Status</h2>
                    <div className="mb-4">
                        <label className="block text-gray-600 mb-1">Title</label>
                        <input
                            type="text"
                            value={task.title}
                            disabled
                            className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-700"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-600 mb-1">Description</label>
                        <textarea
                            value={task.description}
                            disabled
                            className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-700"
                        />
                    </div>
                    <div className="mb-4 flex gap-4">
                        <div className="flex-1">
                            <label className="block text-gray-600 mb-1">Priority</label>
                            <input
                                type="text"
                                value={task.priority}
                                disabled
                                className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-700"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-gray-600 mb-1">Start Date</label>
                            <input
                                type="text"
                                value={new Date(task.start_date).toLocaleDateString()}
                                disabled
                                className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-700"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-gray-600 mb-1">Due Date</label>
                            <input
                                type="text"
                                value={new Date(task.due_date).toLocaleDateString()}
                                disabled
                                className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-700"
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-600 mb-1">Remarks</label>
                        <input
                            type="text"
                            value={task.remarks}
                            disabled
                            className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-700"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-600 mb-1">Status</label>
                        <select
                            value={status}
                            onChange={handleStatusChange}
                            className="w-full px-3 py-2 border rounded text-gray-700"
                            required
                        >
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                            <option value="In Progress">In Progress</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        Update Status
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditTaskPage;