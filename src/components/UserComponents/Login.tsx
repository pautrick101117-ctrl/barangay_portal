import { NavLink, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode"

interface DecodedToken {
  exp: number
}

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ username: "", password: "" })

  // ✅ Prevent access if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token)
        const now = Date.now() / 1000
        if (decoded.exp > now) navigate("/dashboard")
        else localStorage.removeItem("token")
      } catch {
        localStorage.removeItem("token")
      }
    }
  }, [navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch("http://localhost:3000/api/v1/login", { //https://barangay-portal-server.onrender.com/api/v1/login
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      console.log(data)

      if (res.ok) {
        localStorage.setItem("token", data.token)
        navigate("/dashboard") // ✅ redirect here after login
      } else {
        console.error(data.message || "Login failed")
      }
    } catch (error) {
      console.error("Error logging in:", error)
    }
  }

  return (
    <div className="bg-[#62DC87] min-h-screen flex flex-col">
      <div className="flex justify-end p-2">
        <NavLink to="/admin">
          <img src="/adminLoginIcon.png" alt="admin icon" className="w-14 h-14" />
        </NavLink>
      </div>

      <div className="flex flex-col md:flex-row flex-1">
        <div className="flex flex-col gap-2 items-center md:items-start min-w-fit px-4 md:px-5">
          <NavLink to={'/'}>
            <img src="/logo.png" alt="logo icon" className="w-[100px] h-[100px] md:w-[140px] md:h-[140px]" />
          </NavLink>
          <div className="text-center md:text-left">
            <h3 className="relative font-extrabold text-lg md:text-[25px] after:content-[''] after:absolute after:bg-black after:bottom-[2px] md:after:bottom-[4px] after:left-0 after:right-[20px] md:after:right-[50px] after:h-[1px]">
              BARANGAY. IBA
            </h3>
            <h5 className="text-sm md:text-base">SILANG, CAVITE</h5>
          </div>
        </div>

        <div className="relative h-[calc(100vh-150px)] md:h-[calc(100vh-91px)] w-full z-10 flex items-center justify-center">
          <img src="/background-1.png" alt="background image" className="absolute inset-0 w-full h-full object-cover -z-10" />

          <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center py-8 md:py-10 gap-5 w-[90%] max-w-sm">
            <img src="/logo.png" alt="logo icon" className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] bg-green-400 rounded-full" />

            <div className="relative flex items-center w-full">
              <img src="/usernameIcon.png" alt="icon" className="absolute left-2 w-5 h-5" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="w-full text-gray-800 pl-10 py-2 rounded-md bg-[#ffffffa4]"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div className="relative flex items-center w-full">
              <img src="/lockIcon.png" alt="icon" className="absolute left-2 w-5 h-5" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full text-gray-800 pl-10 py-2 rounded-md bg-[#ffffffa4]"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="bg-[#dddddd] font-semibold hover:text-gray-600 w-full py-2 rounded-full">
              LOGIN
            </button>
            <p className="font-medium">OR</p>
            <NavLink to="/register" className="bg-[#dddddd] font-semibold hover:text-gray-600 text-center w-full py-2 rounded-full">
              CREATE ONE!
            </NavLink>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
