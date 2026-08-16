import React, { useEffect, useState } from "react";
import TaskTable from "../components/TaskTable";
import { FetchAPI } from "../utils/FetchApi";

export default function AdminDashboard() {
  const [summary, setSummary] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
  });

  const [tasks, setTasks] = useState([]);

  const [users, setUsers] = useState([]);

  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    assignedTo: "",
  });

  const [taskTableData, setTaskTableData] = useState({
    columns: [],
    data: [],
    actions: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
    loading: true,
  });

  const fetchDashboard = async () => {
    try {
      setTaskTableData((prev) => ({
        ...prev,
        loading: true,
      }));

      const params = new URLSearchParams();

      if (filters.status) {
        params.append("status", filters.status);
      }

      if (filters.priority) {
        params.append("priority", filters.priority);
      }

      if (filters.assignedTo) {
        params.append("assignedTo", filters.assignedTo);
      }

      const queryString = params.toString();

      const url =
        `${import.meta.env.VITE_PUBLIC_API_URL}/api/admin/dashboard` +
        (queryString ? `?${queryString}` : "");

      const response = await FetchAPI(url, {
        method: "GET",
      });

      console.log("Dashboard:", response);

      const dashboardTasks = response?.tasks || [];
      const dashboardSummary = response?.summary || {};

      setTasks(dashboardTasks);

      setSummary({
        totalTasks: dashboardSummary.totalTasks || 0,
        pendingTasks: dashboardSummary.pendingTasks || 0,
        inProgressTasks: dashboardSummary.inProgressTasks || 0,
        completedTasks: dashboardSummary.completedTasks || 0,
      });

      // Get users from tasks
      const uniqueUsers = [];

      dashboardTasks.forEach((task) => {
        if (
          task.assignedTo &&
          !uniqueUsers.some((user) => user.id === task.assignedTo)
        ) {
          uniqueUsers.push({
            id: task.assignedTo,
            name: task.assignee_user_name || `User ${task.assignedTo}`,
          });
        }
      });

      setUsers(uniqueUsers);

      setTaskTableData((prev) => ({
        ...prev,

        // Keep your API table columns
        columns: response?.summary?.taskColumns || prev.columns,

        data: dashboardTasks,

        pagination: {
          ...prev.pagination,
          page: 1,
          total: dashboardTasks.length,
          totalPages: Math.ceil(dashboardTasks.length / prev.pagination.limit),
        },

        loading: false,
      }));
    } catch (error) {

      setTaskTableData((prev) => ({
        ...prev,
        loading: false,
        data: [],
      }));
    }
  };

  // Fetch when filters change
  useEffect(() => {
    fetchDashboard();
  }, [filters.status, filters.priority, filters.assignedTo]);

  // =========================
  // Filter Change
  // =========================

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // Clear Filters
  // =========================

  const clearFilters = () => {
    setFilters({
      status: "",
      priority: "",
      assignedTo: "",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

        <p className="mt-1 text-gray-500">Manage and monitor all tasks.</p>
      </div>

      {/* =========================
                Stats
            ========================= */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Total Tasks</p>

          <p className="mt-2 text-3xl font-bold">{summary.totalTasks}</p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Pending</p>

          <p className="mt-2 text-3xl font-bold">{summary.pendingTasks}</p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">In Progress</p>

          <p className="mt-2 text-3xl font-bold">{summary.inProgressTasks}</p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Completed</p>

          <p className="mt-2 text-3xl font-bold">{summary.completedTasks}</p>
        </div>
      </div>

      {/* =========================
                Filters
            ========================= */}

      <div className="rounded-xl bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* Status */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Status
            </label>

            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5"
            >
              <option value="">All Status</option>

              <option value="PENDING">Pending</option>

              <option value="IN_PROGRESS">In Progress</option>

              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {/* Priority */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Priority
            </label>

            <select
              name="priority"
              value={filters.priority}
              onChange={handleFilterChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5"
            >
              <option value="">All Priority</option>

              <option value="LOW">Low</option>

              <option value="MEDIUM">Medium</option>

              <option value="HIGH">High</option>
            </select>
          </div>

          {/* Assigned To */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Assigned To
            </label>

            <select
              name="assignedTo"
              value={filters.assignedTo}
              onChange={handleFilterChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5"
            >
              <option value="">All Users</option>

              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          {/* Clear */}

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-700 hover:bg-gray-100"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Result count */}

      <div className="text-sm text-gray-500">
        Showing{" "}
        <span className="font-semibold text-gray-900">{tasks.length}</span>{" "}
        tasks
      </div>

      {/* Task Table */}

      <TaskTable tableState={taskTableData} setTableState={setTaskTableData} />
    </div>
  );
}
