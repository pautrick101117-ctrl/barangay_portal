import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) navigate("/admin-login");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  // ✅ Added Complaints link
  const menuItems = [
    { name: "Dashboard", to: "/admin/dashboard" },
    { name: "Manage Projects", to: "/admin/projects" },
    { name: "Project Suggestions", to: "/admin/project-suggestions" },
    { name: "Barangay Officials", to: "/admin/officials" },
    { name: "Fund Records", to: "/admin/funds" },
    { name: "Edit Home", to: "/admin/homeEdit" },
    { name: "News & Updates", to: "/admin/news" },
    { name: "Complaints", to: "/admin/complaints" }, // <-- NEW
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex fixed top-0 left-0 h-full w-64 bg-green-600 text-white flex-col justify-between p-4 z-20">
        <div>
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Panel</h2>
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded ${isActive ? "bg-green-700" : "hover:bg-green-500"}`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="bg-white text-green-700 font-semibold rounded-lg px-3 py-2 hover:bg-gray-200 transition mt-4"
        >
          Logout
        </button>
      </aside>

      {/* MOBILE FLOATING BUTTON */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-green-600 text-white rounded-lg shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* MOBILE SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-green-600 text-white flex flex-col justify-between p-4
          transform transition-transform duration-300 ease-in-out z-40
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div>
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Panel</h2>
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 rounded ${isActive ? "bg-green-700" : "hover:bg-green-500"}`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
        <button
          onClick={() => { handleLogout(); setSidebarOpen(false); }}
          className="bg-white text-green-700 font-semibold rounded-lg px-3 py-2 hover:bg-gray-200 transition mt-4"
        >
          Logout
        </button>
      </aside>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* MAIN CONTENT */}
      <main className="md:ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
