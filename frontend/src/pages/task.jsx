import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FetchAPI } from "../utils/FetchApi";
import { useAppModal } from "../components/modal/ModalContext";

export default function Task({ formtype = "view" }) {
  const { showModal } = useAppModal();
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      setLoading(true);

      const response = await FetchAPI(
        `${import.meta.env.VITE_PUBLIC_API_URL}/api/task/${id}`,
        {
          method: "GET",
        },
      );

      setTask(response.tasks);
    } catch (error) {
      console.error("Failed to fetch task:", error);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // UPDATE
  // -------------------------

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const response = await FetchAPI(
        `${import.meta.env.VITE_PUBLIC_API_URL}/api/task/update/${id}`,
        {
          method: "PUT",
          body: {
            title: task?.title,
            description: task?.description,
            status: task?.status,
            priority: task?.priority,
            assignedTo: task?.assignedTo,
            dueDate: task?.dueDate,
          },
        },
      );

      setTask(response.task);

      showModal({
        type: "success",
        message: "Task updated successfully",
        navigateRoute: `/admin/task/view/${id}`,
      });
    } catch (error) {
      showModal({
        type: "errror",
        message: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  // -------------------------
  // DELETE
  // -------------------------

  const handleDelete = async () => {
    try {
      setSaving(true);

      await FetchAPI(`${import.meta.env.VITE_PUBLIC_API_URL}/api/task/delete/${id}`, {
        method: "DELETE",
      });

      showModal({
        type: "success",
        message: "Task deleted successfully",
        navigateRoute: `/admin`,
      });
      
    } catch (error) {
      showModal({
        type: "success",
        message: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  // -------------------------
  // LOADING
  // -------------------------

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Loading task?...</p>
      </div>
    );
  }

  // -------------------------
  // NOT FOUND
  // -------------------------

  if (!task) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Task not found</p>

        <button
          onClick={() => navigate("/admin")}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white"
        >
          Back
        </button>
      </div>
    );
  }

  // =====================================================
  // DELETE PAGE
  // =====================================================

  if (formtype === "delete") {
    return (
      <div className="mx-auto max-w-lg p-6">
        <div className="rounded-xl bg-white p-6 shadow">
          <h1 className="text-2xl font-bold text-gray-900">Delete Task</h1>

          <p className="mt-4 text-gray-600">
            Are you sure you want to delete this task?
          </p>

          <div className="mt-4 rounded-lg bg-gray-50 p-4">
            <p className="font-semibold">{task?.title}</p>

            <p className="mt-1 text-sm text-gray-500">
              {task?.description || "No description"}
            </p>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => navigate(`/admin/task/view/${id}`)}
              className="rounded-lg border border-gray-300 px-4 py-2"
            >
              Cancel
            </button>

            <button
              onClick={handleDelete}
              disabled={saving}
              className="rounded-lg bg-red-600 px-4 py-2 text-white disabled:opacity-50"
            >
              {saving ? "Deleting..." : "Delete Task"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // UPDATE PAGE
  // =====================================================

  if (formtype === "update") {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <div className="rounded-xl bg-white p-6 shadow">
          <h1 className="text-2xl font-bold text-gray-900">Update Task</h1>

          <form onSubmit={handleUpdate} className="mt-6 space-y-5">
            {/* TITLE */}
            <div>
              <label className="mb-2 block text-sm font-medium">Title</label>

              <input
                type="text"
                value={task?.title || ""}
                onChange={(e) =>
                  setTask((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
                required
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Description
              </label>

              <textarea
                value={task?.description || ""}
                onChange={(e) =>
                  setTask((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
              />
            </div>

            {/* STATUS */}
            <div>
              <label className="mb-2 block text-sm font-medium">Status</label>

              <select
                value={task?.status || "TODO"}
                onChange={(e) =>
                  setTask((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
              >
                <option value="PENDING">PENDING</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            {/* PRIORITY */}
            <div>
              <label className="mb-2 block text-sm font-medium">Priority</label>

              <select
                value={task?.priority || "MEDIUM"}
                onChange={(e) =>
                  setTask((prev) => ({
                    ...prev,
                    priority: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            {/* DUE DATE */}
            <div>
              <label className="mb-2 block text-sm font-medium">Due Date</label>

              <input
                type="date"
                value={
                  task?.dueDate
                    ? new Date(task?.dueDate).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setTask((prev) => ({
                    ...prev,
                    dueDate: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
              />
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate(`/admin/task/view/${id}`)}
                className="rounded-lg border border-gray-300 px-4 py-2"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
              >
                {saving ? "Saving..." : "Update Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // =====================================================
  // VIEW PAGE
  // =====================================================

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="rounded-xl bg-white p-6 shadow">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Task Details</h1>

          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
            {task?.status}
          </span>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <p className="text-sm text-gray-500">Title</p>

            <p className="mt-1 text-lg font-semibold">{task?.title}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Description</p>

            <p className="mt-1 text-gray-700">
              {task?.description || "No description"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Priority</p>

              <p className="mt-1 font-medium">{task?.priority}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Assigned To</p>

              <p className="mt-1 font-medium">
                {task?.assignee_user_name || "Unassigned"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">Due Date</p>

            <p className="mt-1 font-medium">
              {task?.dueDate
                ? new Date(task?.dueDate).toLocaleDateString()
                : "No due date"}
            </p>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={() => navigate(`/admin/task/update/${id}`)}
            className="rounded-lg bg-yellow-500 px-4 py-2 text-white"
          >
            Update
          </button>

          <button
            onClick={() => navigate(`/admin/task/delete/${id}`)}
            className="rounded-lg bg-red-600 px-4 py-2 text-white"
          >
            Delete
          </button>

          <button
            onClick={() => navigate("/admin")}
            className="rounded-lg border border-gray-300 px-4 py-2"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
