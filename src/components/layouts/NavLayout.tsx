import { Outlet } from "react-router-dom";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NavLayout = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navLinks = [
    { path: "/", label: "HOME" },
    { path: "/dashboard", label: "DASHBOARD" },
    { path: "/about", label: "ABOUT" },
    { path: "/fund-records", label: "FUND RECORDS" },
    { path: "/project-suggestion", label: "PROJECT SUGGESTION" },
    { path: "/faqs", label: "FAQS" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* === SIDEBAR === */}
      <aside
        className={`fixed md:static top-0 left-0 h-screen w-[240px] bg-white border-r border-gray-300 shadow-md flex flex-col justify-between px-5 py-6 transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* TOP LOGO */}
        <div>
          <div className="flex flex-col items-center mb-8">
            <img src="/logo.png" alt="Barangay Logo" className="w-24 h-24 mb-3" />
            <h2 className="font-extrabold text-center text-base tracking-wide text-green-600">
              BARANGAY SYSTEM
            </h2>
          </div>

          {/* NAV LINKS */}
          <nav className="flex flex-col gap-3">
            {navLinks.map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg font-semibold text-sm transition-all
                  ${
                    isActive
                      ? "bg-green-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* BOTTOM SECTION */}
        <div className="text-center">
          <button
            onClick={handleLogout}
            className="bg-red-100 text-red-600 px-4 py-2 w-full rounded-lg font-semibold hover:bg-red-200 transition"
          >
            LOG OUT
          </button>

          <p className="mt-6 font-bold text-sm text-gray-700">
            BARANGAY IBA <br />
            SILANG, CAVITE
          </p>
        </div>
      </aside>

      {/* === MOBILE MENU BUTTON === */}
      <button
        className="md:hidden fixed top-4 left-4 z-[60] bg-green-500 text-white p-2 rounded-md shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* === MAIN CONTENT === */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <Outlet />
      </main>

      {/* === BACKDROP === */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default NavLayout;
