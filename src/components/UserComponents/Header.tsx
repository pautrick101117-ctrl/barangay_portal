import { useState } from "react";
import { NavLink } from "react-router-dom";
import {jwtDecode } from "jwt-decode";
import { Menu, X } from "lucide-react";

interface DecodedToken {
  exp: number;
}

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem("token");
  let isLoggedIn = false;

  if (token) {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const now = Date.now() / 1000;
      if (decoded.exp > now) {
        isLoggedIn = true;
      } else {
        localStorage.removeItem("token");
      }
    } catch {
      localStorage.removeItem("token");
    }
  }

  return (
    <header className="bg-gradient-to-r from-green-400/80 to-green-500/90 shadow-md sticky top-0 z-50">
      <div className="flex justify-between items-center px-4 sm:px-8 py-3 sm:py-4">
        {/* Logo & Title */}
        <NavLink
          to="/"
          className="flex items-center gap-2 sm:gap-3 hover:opacity-90 transition-opacity"
        >
          <img
            src="/logo.png"
            alt="logo icon"
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full shadow-sm"
          />
          <div className="text-center sm:text-left leading-tight">
            <h3 className="font-extrabold text-base sm:text-xl relative after:content-[''] after:absolute after:bg-black after:bottom-0 after:left-0 after:right-10 sm:after:right-16 after:h-[2px]">
              BARANGAY IBA
            </h3>
            <h5 className="text-xs sm:text-sm text-gray-800">SILANG, CAVITE</h5>
          </div>
        </NavLink>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center gap-4">
          {isLoggedIn && (
            <NavLink
              to="/dashboard"
              className="bg-white/90 px-6 py-2 font-bold rounded-md hover:bg-gray-100 text-sm sm:text-base transition"
            >
              DASHBOARD
            </NavLink>
          )}
          <NavLink
            to="/news"
            className="bg-white/80 px-6 py-2 font-bold rounded-md hover:bg-gray-100 text-sm sm:text-base transition"
          >
            NEWS & UPDATES
          </NavLink>



          <NavLink
            to="/contact"
            className="bg-white/80 px-6 py-2 font-bold rounded-md hover:bg-gray-100 text-sm sm:text-base transition"
          >
            CONTACT US
          </NavLink>
          {!isLoggedIn && (
            <NavLink
              to="/login"
              className="bg-white/90 px-6 py-2 font-bold rounded-md hover:bg-gray-100 text-sm sm:text-base transition"
            >
              LOGIN
            </NavLink>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="sm:hidden p-2 text-black rounded-md hover:bg-gray-200 transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden bg-white shadow-lg border-t border-gray-200 animate-slide-down">
          <nav className="flex flex-col items-center py-4">
            <NavLink
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className="py-2 px-6 w-full text-center font-semibold hover:bg-gray-100 transition"
            >
              CONTACT US
            </NavLink>


            {isLoggedIn ? (
              <NavLink
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="py-2 px-6 w-full text-center font-semibold hover:bg-gray-100 transition"
              >
                DASHBOARD
              </NavLink>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="py-2 px-6 w-full text-center font-semibold hover:bg-gray-100 transition"
              >
                LOGIN
              </NavLink>
            )}

            <NavLink
              to="/news"
              onClick={() => setMenuOpen(false)}
              className="py-2 px-6 w-full text-center font-semibold hover:bg-gray-100 transition"
            >
              NEWS & UPDATES
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
