import { useState } from "react";
import { useAppModal } from "../components/modal/ModalContext";
import { LoginValidation } from "../validations/authvalidations";

export default function Login() {
  const { showModal } = useAppModal();
  const [userDetail, setUserDetail] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

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
      await LoginValidation.validate(userDetail, {
        abortEarly: false,
      });

      setErrors({});

      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_API_URL}/api/auth/login`,
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

      const token = data?.data?.token;
      const role = data?.data?.role;


      // Save token
      if (token) {
        localStorage.setItem("token", token);
      }

      // Save role
      if (role) {
        localStorage.setItem("role", role);
      }

      // Decide where to navigate
      const navigateRoute = role === "ADMIN" ? "/admin" : "/user";
      setUserDetail({
        email: "",
        password: "",
      });

      showModal({
        type: "success",
        message: data.message,
        navigateRoute: navigateRoute,
      });
    } catch (error) {
      if (error?.name === "ValidationError") {
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black px-5">
      <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-md sm:p-8">
        {/* Title */}
        <h1 className="mb-8 text-center text-3xl font-bold tracking-wide text-white">
          Login Page
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-2 block text-sm text-gray-300">
              Email
            </label>

            <input
              id="email"
              type="email"
              value={userDetail.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="email@gmail.com"
              className="w-full rounded-lg border border-gray-500 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm text-gray-300"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={userDetail.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-gray-500 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />

            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="mt-2 w-full rounded-lg bg-blue-600 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-700 active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>

        {/* Signup */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="font-semibold text-blue-400 hover:text-blue-300 hover:underline"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
