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
    { path: "/news", label: "NEWS & UPDATES" },
    { path: "/faqs", label: "FAQS" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-200 relative">
      {/* ==== SIDEBAR ==== */}
      <aside
        className={`fixed md:static top-0 left-0 h-screen w-[220px] bg-[#62DC87] text-black flex flex-col justify-between p-4 transition-transform duration-300 z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* TOP SECTION */}
        <div>
          <div className="flex flex-col items-center mb-6">
            <img src="/logo.png" alt="Barangay Logo" className="w-20 h-20 mb-2" />
            <h2 className="font-extrabold text-center text-sm">BARANGAY SYSTEM</h2>
          </div>

          <nav className="flex flex-col gap-2">
            {navLinks.map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => setIsOpen(false)}
                className="bg-gray-100 px-3 py-2 font-semibold rounded text-center hover:bg-gray-300"
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* BOTTOM SECTION */}
        <div className="text-center mt-6">
          <button
            onClick={handleLogout}
            className="bg-gray-100 px-3 py-2 font-semibold rounded hover:bg-gray-300 w-full"
          >
            LOG OUT
          </button>
          <p className="mt-3 font-bold text-sm">
            BARANGAY. IBA
            <br />
            SILANG, CAVITE
          </p>
        </div>
      </aside>

      {/* ==== HAMBURGER MENU ==== */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-[#62DC87] p-2 rounded-md shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* ==== MAIN CONTENT ==== */}
      <main className="flex-1 p-6 md:ml-0 overflow-y-auto">
        <Outlet />
      </main>

      {/* ==== BACKDROP for MOBILE ==== */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default NavLayout;
