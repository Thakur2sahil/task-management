import React from "react";
import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        {/* Error Code */}
        <div className="text-8xl font-extrabold text-red-600">
          403
        </div>

        {/* Title */}
        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          Access Denied
        </h1>

        {/* Description */}
        <p className="mt-3 text-gray-500">
          You don't have permission to access this page.
          Please contact an administrator if you believe this is a mistake.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Go Back
          </button>

          <button
            onClick={() => navigate("/")}
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}