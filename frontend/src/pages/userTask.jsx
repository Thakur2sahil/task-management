import React, { useEffect, useState } from "react";
import { FetchAPI } from "../utils/FetchApi";

export default function UserTask() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const response = await FetchAPI(
        `${import.meta.env.VITE_PUBLIC_API_URL}/api/task/user`,
        {
          method: "GET",
        },
      );

      setTasks(response.tasks || []);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      setUpdatingId(taskId);

      const response = await FetchAPI(
        `${import.meta.env.VITE_PUBLIC_API_URL}/api/task/${taskId}/status`,
        {
          method: "PATCH",
          body: {
            status,
          },
        },
      );

      // Update only the changed task
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status: response.task?.status || status,
              }
            : task,
        ),
      );
    } catch (error) {
      console.error("Failed to update task status:", error);
      alert(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "TODO":
        return "bg-gray-100 text-gray-700";

      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-700";

      case "COMPLETED":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatStatus = (status) => {
    if (status === "IN_PROGRESS") {
      return "In Progress";
    }

    if (status === "TODO") {
      return "Todo";
    }

    if (status === "COMPLETED") {
      return "Completed";
    }

    return status;
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-gray-500">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>

        <p className="mt-1 text-gray-500">
          View your assigned tasks and update their status.
        </p>
      </div>

      {/* Tasks */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  ID
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Task
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Description
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Priority
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Due Date
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <tr key={task.id} className="transition hover:bg-gray-50">
                    {/* ID */}
                    <td className="px-6 py-4 text-sm text-gray-700">
                      #{task.id}
                    </td>

                    {/* Title */}
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{task.title}</p>
                    </td>

                    {/* Description */}
                    <td className="max-w-xs px-6 py-4">
                      <p className="truncate text-sm text-gray-500">
                        {task.description || "No description"}
                      </p>
                    </td>

                    {/* Priority */}
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          task.priority === "HIGH"
                            ? "bg-red-100 text-red-700"
                            : task.priority === "MEDIUM"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>

                    {/* Due Date */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "No due date"}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <select
                        value={task.status}
                        disabled={
                          updatingId === task.id || task.status === "COMPLETED"
                        }
                        onChange={(e) =>
                          handleStatusChange(task.id, e.target.value)
                        }
                        className={`rounded-lg border-0 px-3 py-2 text-sm font-medium outline-none ${getStatusStyle(
                          task.status,
                        )} ${
                          updatingId === task.id
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-pointer"
                        }`}
                      >
                        <option value="PENDING">Pending</option>

                        <option value="IN_PROGRESS">In Progress</option>

                        <option value="COMPLETED">Completed</option>
                      </select>

                      {updatingId === task.id && (
                        <span className="ml-2 text-xs text-gray-400">
                          Updating...
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No tasks assigned to you.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
