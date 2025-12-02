import { useState } from "react";
import { NavLink } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
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
    <header className="bg-[#62dc87b9] shadow-md sticky top-0 z-20">
      <div className="flex justify-between items-center px-4 sm:px-8 py-3 sm:py-5">
        {/* === LOGO & TITLE === */}
        <NavLink
          to="/"
          className="flex items-center gap-2 sm:gap-3 hover:opacity-90 transition-opacity"
        >
          <img
            src="/logo.png"
            alt="logo icon"
            className="w-12 h-12 sm:w-16 sm:h-16"
          />
          <div className="text-center sm:text-left leading-tight">
            <h3 className="font-extrabold text-base sm:text-xl relative after:content-[''] after:absolute after:bg-black after:bottom-[1px] after:left-0 after:right-[15px] sm:after:right-[40px] after:h-[1px]">
              BARANGAY. IBA
            </h3>
            <h5 className="text-xs sm:text-sm">SILANG, CAVITE</h5>
          </div>
        </NavLink>

        {/* === DESKTOP NAV BUTTONS === */}

        <div className="hidden sm:flex items-center gap-4">
            {
            isLoggedIn ? <NavLink
              to="/dashboard"
              className="bg-gray-50 px-6 font-bold py-2 rounded-md hover:bg-gray-200 text-sm sm:text-base transition"
            >
              DASHBOARD
            </NavLink> : ''
            }

          <NavLink
            to="/news"
            className="bg-white/80 px-6 py-2 font-bold rounded-md hover:bg-gray-200 text-sm sm:text-base transition"
          >
            NEWS & UPDATES
          </NavLink>
            
          <NavLink
            to="/contact"
            className="bg-white/80 px-6 py-2 font-bold rounded-md hover:bg-gray-200 text-sm sm:text-base transition"
          >
            CONTACT US
          </NavLink>

          {!isLoggedIn ? (
            <NavLink
              to="/login"
              className="bg-gray-50 px-6 font-bold py-2 rounded-md hover:bg-gray-200 text-sm sm:text-base transition"
            >
              LOGIN
            </NavLink> 
          ) : ''}

          {/* === ADMIN LOGIN BUTTON === */}
          
        </div>

        {/* === MOBILE MENU ICON === */}
        <button
          className="sm:hidden p-2 text-black"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* === MOBILE DROPDOWN === */}
      {menuOpen && (
        <div className="sm:hidden bg-white shadow-inner border-t border-gray-200">
          <nav className="flex flex-col items-center py-3">
            <NavLink
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className="py-2 px-4 w-full text-center font-semibold hover:bg-gray-100 transition"
            >
              CONTACT US
            </NavLink>

            {isLoggedIn ? (
              <NavLink
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="py-2 px-4 w-full text-center font-semibold hover:bg-gray-100 transition"
              >
                DASHBOARD
              </NavLink>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="py-2 px-4 w-full text-center font-semibold hover:bg-gray-100 transition"
              >
                LOGIN
              </NavLink>
            )}

            {/* ADMIN LOGIN MOBILE */}
            <NavLink
              to="/admin-login"
              onClick={() => setMenuOpen(false)}
              className="py-2 px-4 w-full text-center font-semibold hover:bg-gray-100 transition"
            >
              ADMIN LOGIN
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
