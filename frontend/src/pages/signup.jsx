import { useState } from "react";
import { Link } from "react-router-dom";
import { SignupValidation } from "../validations/authvalidations";
import { useAppModal } from "../components/modal/ModalContext";

export default function Signup() {
  const { showModal } = useAppModal();
  const [userDetail, setUserDetail] = useState({
    email: "",
    user_name: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setUserDetail((prev) => ({
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
      await SignupValidation.validate(userDetail, {
        abortEarly: false,
      });

      setErrors({});

      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userDetail),
        },
      );

      // Convert response to JSON
      const data = await response.json();

      // Handle API error
      if (!response.ok) {
        showModal({
          type: "error",
          message: data.message,
        });

        return;
      }
      setUserDetail({
        email: "",
        user_name: "",
        password: "",
        confirmPassword: "",
      });

      showModal({
        type: "success",
        message: data.message,
        navigateRoute: "/",
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        const validationErrors = {};

        error.inner.forEach((err) => {
          if (err.path) {
            validationErrors[err.path] = err.message;
          }
        });

        setErrors(validationErrors);
      } else {
        showModal({
          type: "error",
          message: error.message,
        });
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black px-5 py-10">
      <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-md sm:p-8">
        {/* Title */}
        <h1 className="mb-2 text-center text-3xl font-bold tracking-wide text-white">
          Create Account
        </h1>

        <p className="mb-8 text-center text-sm text-gray-400">
          Create your account to get started
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="mb-2 block text-sm text-gray-300">Username</label>

            <input
              type="text"
              placeholder="Enter your username"
              value={userDetail.user_name}
              onChange={(e) => handleChange("user_name", e.target.value)}
              className="w-full rounded-lg border border-gray-500 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />

            {errors.user_name && (
              <p className="mt-1 text-sm text-red-500">{errors.user_name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm text-gray-300">Email</label>

            <input
              type="email"
              placeholder="email@gmail.com"
              value={userDetail.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full rounded-lg border border-gray-500 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm text-gray-300">Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={userDetail.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className="w-full rounded-lg border border-gray-500 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />

            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Confirm your password"
              value={userDetail.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              className="w-full rounded-lg border border-gray-500 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />

            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            className="mt-3 w-full rounded-lg bg-blue-600 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-700 active:scale-[0.98]"
          >
            Create Account
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            to="/"
            className="font-semibold text-blue-400 hover:text-blue-300 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
