import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const adminToken = localStorage.getItem("adminToken");

  // ⚡ REDIRECT IF ALREADY LOGGED IN
  if (adminToken) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("https://barangay-portal-server.onrender.com/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // STORE JWT INSTEAD OF "true"
        localStorage.setItem("adminToken", data.token);
        navigate("/admin/dashboard"); // REDIRECT AFTER SUCCESS
      } else {
        setError(data.error || "Invalid email or password.");
      }
    } catch (err) {
      setError("Server error. Try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 outline-none w-full"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 outline-none w-full"
            required
          />

          <button
            type="submit"
            className="bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition w-full"
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-2 bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-300 transition w-full"
          >
            ← Back to Home
          </button>
        </form>
      </div>
    </div>
  );

};

export default AdminLogin;
