import React, { useEffect, useState } from "react";
import TaskTable from "../components/TaskTable";
import { FetchAPI } from "../utils/FetchApi";

export default function UserDashboard() {
  const [summary, setSummary] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
  });

  const [filters, setFilters] = useState({
    status: "",
    priority: "",
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

      const url =
        `${import.meta.env.VITE_PUBLIC_API_URL}/api/user/dashboard` +
        (params.toString() ? `?${params.toString()}` : "");

      const response = await FetchAPI(url, {
        method: "GET",
      });

      const dashboardSummary = response?.summary || {};
      const tasks = response?.tasks || [];

      // Summary
      setSummary({
        totalTasks: dashboardSummary.totalTasks || 0,
        pendingTasks: dashboardSummary.pendingTasks || 0,
        inProgressTasks: dashboardSummary.inProgressTasks || 0,
        completedTasks: dashboardSummary.completedTasks || 0,
      });

      // Table
      setTaskTableData({
        columns: dashboardSummary.taskColumns || [],
        data: tasks,
        actions: [],
        pagination: {
          page: 1,
          limit: 10,
          total: tasks.length,
          totalPages: Math.ceil(tasks.length / 10),
        },
        loading: false,
      });
    } catch (error) {
      console.error("Failed to fetch dashboard:", error);

      setTaskTableData((prev) => ({
        ...prev,
        loading: false,
        data: [],
      }));
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [filters.status, filters.priority]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      priority: "",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>

        <p className="mt-1 text-gray-500">Manage your assigned tasks.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Total Tasks</p>

          <p className="mt-2 text-3xl font-bold">{summary.totalTasks}</p>
        </div>

        {/* Pending */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Pending</p>

          <p className="mt-2 text-3xl font-bold text-yellow-600">
            {summary.pendingTasks}
          </p>
        </div>

        {/* In Progress */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">In Progress</p>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            {summary.inProgressTasks}
          </p>
        </div>

        {/* Completed */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Completed</p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {summary.completedTasks}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          {/* Status */}
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Status
            </label>

            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {/* Priority */}
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Priority
            </label>

            <select
              name="priority"
              value={filters.priority}
              onChange={handleFilterChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
            >
              <option value="">All Priority</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          {/* Clear */}
          <button
            onClick={clearFilters}
            className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Task Table */}
      <TaskTable
        tableState={taskTableData}
        setTableState={setTaskTableData}
        showView={false}
        showUpdate={false}
        showDelete={false}
      />
    </div>
  );
}
