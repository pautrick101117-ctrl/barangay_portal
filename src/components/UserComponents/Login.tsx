import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";

interface DecodedToken {
  exp: number;
}

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [status, setStatus] = useState({ message: "", type: "" }); // type: 'error' | 'success'
  const [loading, setLoading] = useState(false);

  // Prevent access if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        const now = Date.now() / 1000;
        if (decoded.exp > now) navigate("/dashboard");
        else localStorage.removeItem("token");
      } catch {
        localStorage.removeItem("token");
      }
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ message: "", type: "" });
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/v1/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        setStatus({ message: "Login successful! Redirecting...", type: "success" });
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        setStatus({ message: data.message || "Invalid username or password", type: "error" });
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setStatus({ message: "Server error. Please try again later.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#62DC87] min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-4xl w-full flex flex-col md:flex-row bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden">
        {/* Left Branding Section */}
        <div className="flex flex-col items-center md:items-start justify-center bg-green-500 text-white md:w-1/2 p-8 gap-4">
          <NavLink to="/">
            <img src="/logo.png" alt="logo icon" className="w-28 h-28 md:w-36 md:h-36" />
          </NavLink>
          <h2 className="text-2xl md:text-4xl font-bold">BARANGAY IBA</h2>
          <p className="text-sm md:text-base">Silang, Cavite</p>
          <p className="mt-4 text-white/90 text-center md:text-left">
            Welcome to the Barangay Iba portal. Access services, updates, and community resources.
          </p>
        </div>

        {/* Right Login Form Section */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center items-center gap-6 relative">
          <img
            src="/background-1.png"
            alt="background"
            className="absolute inset-0 w-full h-full object-cover -z-10 rounded-r-3xl opacity-20"
          />

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-sm flex flex-col gap-4 bg-white/80 backdrop-blur-md p-6 rounded-xl shadow"
          >
            <h3 className="text-xl font-semibold text-center">Login to Your Account</h3>

            <div className="relative">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-10 py-2 rounded-md border focus:ring-2 focus:ring-green-400 outline-none"
              />
              <img src="/usernameIcon.png" alt="icon" className="absolute left-2 top-2 w-5 h-5" />
            </div>

            <div className="relative">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-10 py-2 rounded-md border focus:ring-2 focus:ring-green-400 outline-none"
              />
              <img src="/lockIcon.png" alt="icon" className="absolute left-2 top-2 w-5 h-5" />
            </div>

            <button
              type="submit"
              className="bg-green-500 text-white font-semibold py-2 rounded-full hover:bg-green-600 transition duration-200 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Logging in..." : "LOGIN"}
            </button>

            {status.message && (
              <p
                className={`text-center mt-2 font-medium ${
                  status.type === "error" ? "text-red-600" : "text-green-600"
                }`}
              >
                {status.message}
              </p>
            )}

            <p className="text-center font-medium mt-2">OR</p>

            <NavLink
              to="/register"
              className="bg-gray-200 text-gray-800 font-semibold text-center py-2 rounded-full hover:bg-gray-300 transition"
            >
              CREATE ONE!
            </NavLink>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
