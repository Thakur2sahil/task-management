import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/login";
import Signup from "./pages/signup";
import UserDashboard from "./pages/userDashboard";
import AdminDashboard from "./pages/adminDashboard";
import Unauthorized from "./pages/unauthorized";
import AdminLayout from "./components/layout/adminLayout";
import AddTask from "./pages/AddTask";
import Task from "./pages/task";
import UserLayout from "./components/layout/userLayout";
import UserTask from "./pages/userTask";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        {/* User routes */}
        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<UserDashboard />} />

          <Route path="task/view" element={<UserTask formtype="view" />} />

          {/* <Route path="task/update/:id" element={<Task formtype="update" />} />

          <Route path="task/delete/:id" element={<Task formtype="delete" />} /> */}
        </Route>

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />

          {/* Future admin pages */}
          <Route path="add-task" element={<AddTask />} />
          <Route path="task/view/:id" element={<Task formtype="view" />} />

          <Route path="task/update/:id" element={<Task formtype="update" />} />

          <Route path="task/delete/:id" element={<Task formtype="delete" />} />
        </Route>

        {/* Unauthorized */}
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
