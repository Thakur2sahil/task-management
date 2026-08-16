import { Link, Outlet, useLocation } from "react-router-dom";

export default function AdminLayout() {
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
    },
    {
      name: "Create Task",
      path: "/admin/add-task",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-gray-900 text-white">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-gray-700 px-6">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const active = location.pathname === item.path;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`block rounded-lg px-4 py-3 transition ${
                      active
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 w-full border-t border-gray-700 p-4">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              window.location.href = "/";
            }}
            className="w-full rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen p-6">
        <Outlet />
      </main>
    </div>
  );
}
