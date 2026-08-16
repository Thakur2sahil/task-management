import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FetchAPI } from "../utils/FetchApi";
import { TaskValidation } from "../validations/taskvalidations";
import { useAppModal } from "../components/modal/ModalContext";

export default function AddTask() {
  const navigate = useNavigate();
  const { showModal } = useAppModal();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "MEDIUM",
    status: "IN_PROGRESS",
    deadline: "",
  });

  const [assignUser, setAssignUser] = useState([]);

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "",
    status: "",
    deadline: "",
  });

  const [loading, setLoading] = useState(false);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await FetchAPI(
          `${import.meta.env.VITE_PUBLIC_API_URL}/api/user`,
          {
            method: "GET",
          },
        );

        setAssignUser(response.data || []);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate form
      await TaskValidation.validate(formData, {
        abortEarly: false,
      });

      // Clear validation errors
      setErrors({});

      setLoading(true);

      const response = await FetchAPI(
        `${import.meta.env.VITE_PUBLIC_API_URL}/api/task/add`,
        {
          method: "POST",
          body: formData,
        },
      );

      showModal({
        type: "success",
        message: response.message,
        navigateRoute: "/admin",
      });
    } catch (error) {
      if (error?.name === "ValidationError") {
        const validationErrors = {};

        error.inner.forEach((err) => {
          if (err.path && !validationErrors[err.path]) {
            validationErrors[err.path] = err.message;
          }
        });

        setErrors(validationErrors);
      } else {
        console.error("Failed to create task:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Add Task</h1>

          <p className="mt-1 text-sm text-gray-500">
            Create a new task and assign it to a team member.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Task Title
              </label>

              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter task title"
                className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition focus:ring-2 ${
                  errors.title
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                }`}
              />

              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Description
              </label>

              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Enter task description"
                rows={4}
                className={`w-full resize-none rounded-lg border px-4 py-2.5 text-sm outline-none transition focus:ring-2 ${
                  errors.description
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                }`}
              />

              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Assigned To + Priority */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Assigned To */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Assigned To
                </label>

                <select
                  value={formData.assignedTo}
                  onChange={(e) => handleChange("assignedTo", e.target.value)}
                  className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 ${
                    errors.assignedTo
                      ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                  }`}
                >
                  <option value="">Select user</option>

                  {assignUser.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.user_name}
                    </option>
                  ))}
                </select>

                {errors.assignedTo && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.assignedTo}
                  </p>
                )}
              </div>

              {/* Priority */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Priority
                </label>

                <select
                  value={formData.priority}
                  onChange={(e) => handleChange("priority", e.target.value)}
                  className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 ${
                    errors.priority
                      ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                  }`}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>

                {errors.priority && (
                  <p className="mt-1 text-sm text-red-500">{errors.priority}</p>
                )}
              </div>
            </div>

            {/* Status + Deadline */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Status */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Status
                </label>

                <select
                  value={formData.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 ${
                    errors.status
                      ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                  }`}
                >
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>

                {errors.status && (
                  <p className="mt-1 text-sm text-red-500">{errors.status}</p>
                )}
              </div>

              {/* Deadline */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Deadline
                </label>

                <input
                  type="date"
                  value={formData.deadline}
                  min={(() => {
                    const date = new Date();

                    return `${date.getFullYear()}-${String(
                      date.getMonth() + 1,
                    ).padStart(2, "0")}-${String(date.getDate()).padStart(
                      2,
                      "0",
                    )}`;
                  })()}
                  onChange={(e) => handleChange("deadline", e.target.value)}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition focus:ring-2 ${
                    errors.deadline
                      ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                  }`}
                />

                {errors.deadline && (
                  <p className="mt-1 text-sm text-red-500">{errors.deadline}</p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 border-t border-gray-100 pt-6">
              <button
                type="button"
                onClick={() => navigate("/tasks")}
                disabled={loading}
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
