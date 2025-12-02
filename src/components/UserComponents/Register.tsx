import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    contactNumber: "",
    address: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [status, setStatus] = useState({ message: "", type: "" }); // 'error' | 'success'
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ message: "", type: "" });

    if (formData.password !== formData.confirmPassword) {
      setStatus({ message: "Passwords do not match", type: "error" });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/v1/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ message: "Registration successful! Redirecting to login...", type: "success" });
        setTimeout(() => navigate("/login"), 1200);
      } else {
        setStatus({ message: data.message || "Registration failed", type: "error" });
      }
    } catch (error) {
      console.error("Error registering:", error);
      setStatus({ message: "Server error. Please try again later.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#62DC87] min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-5xl w-full flex flex-col md:flex-row bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden">
        {/* Left Branding Section */}
        <div className="flex flex-col items-center md:items-start justify-center bg-green-500 text-white md:w-1/2 p-8 gap-4">
          <NavLink to="/">
            <img src="/logo.png" alt="logo icon" className="w-28 h-28 md:w-36 md:h-36" />
          </NavLink>
          <h2 className="text-2xl md:text-4xl font-bold">BARANGAY IBA</h2>
          <p className="text-sm md:text-base">Silang, Cavite</p>
          <p className="mt-4 text-white/90 text-center md:text-left">
            Register to access community services, updates, and resources.
          </p>
        </div>

        {/* Right Register Form Section */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center items-center gap-6 relative">
          <img
            src="/background-1.png"
            alt="background"
            className="absolute inset-0 w-full h-full object-cover -z-10 rounded-r-3xl opacity-20"
          />

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg flex flex-col gap-4 bg-white/80 backdrop-blur-md p-6 rounded-xl shadow"
          >
            <h3 className="text-xl font-semibold text-center">Create an Account</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["firstName","lastName","middleName","contactNumber"].map((field) => (
                <label key={field} className="flex flex-col">
                  <span className="font-semibold text-sm mb-1">{field.replace(/([A-Z])/g,' $1').toUpperCase()}</span>
                  <input
                    type="text"
                    name={field}
                    value={formData[field as keyof typeof formData]}
                    onChange={handleChange}
                    className="px-2 py-1 rounded-md border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none"
                  />
                </label>
              ))}
            </div>

            <label className="flex flex-col mt-4">
              <span className="font-semibold text-sm mb-1">ADDRESS</span>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="px-2 py-1 rounded-md border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none"
              />
            </label>

            <label className="flex flex-col mt-4">
              <span className="font-semibold text-sm mb-1">USERNAME</span>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="px-2 py-1 rounded-md border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none"
              />
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <label className="flex flex-col">
                <span className="font-semibold text-sm mb-1">PASSWORD</span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="px-2 py-1 rounded-md border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none"
                />
              </label>
              <label className="flex flex-col">
                <span className="font-semibold text-sm mb-1">CONFIRM PASSWORD</span>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="px-2 py-1 rounded-md border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none"
                />
              </label>
            </div>

            <button
              type="submit"
              className="bg-green-500 text-white font-semibold py-2 rounded-full hover:bg-green-600 transition disabled:opacity-50 mt-4"
              disabled={loading}
            >
              {loading ? "Registering..." : "REGISTER"}
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

            <p className="text-center mt-3 font-medium text-sm">
              Already have an account?{" "}
              <NavLink to="/login" className="text-blue-700 underline">
                Login here
              </NavLink>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
