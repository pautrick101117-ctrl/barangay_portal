import { NavLink, useNavigate } from "react-router-dom"
import { useState } from "react"

const Register = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    contactNumber: "",
    address: "",
    username: "",
    password: "",
    confirmPassword: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      console.error("Passwords do not match")
      return
    }

    try {
      const res = await fetch("http://localhost:3000/api/v1/register", { //https://barangay-portal-server.onrender.com/api/v1/register
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      console.log(data)

      if (res.ok) {
        navigate("/login")
      } else {
        console.error(data.message || "Registration failed")
      }
    } catch (error) {
      console.error("Error registering:", error)
    }
  }

  return (
    <div className="bg-[#62DC87] min-h-screen flex flex-col">

      <div className="flex justify-end p-2">
        <NavLink to="/admin">
          <img src="/adminLoginIcon.png" alt="admin icon" className="w-12 h-12 sm:w-14 sm:h-14" />
        </NavLink>
      </div>

      <div className="flex flex-col md:flex-row flex-1">
        
        <div className="flex flex-col gap-2 items-center md:items-start min-w-fit px-4 md:px-5 mb-6 md:mb-0">
          <NavLink to={'/'}>
            <img src="/logo.png" alt="logo icon" className="w-[90px] h-[90px] sm:w-[100px] sm:h-[100px] md:w-[140px] md:h-[140px]" />
          </NavLink>
          <div className="text-center md:text-left">
            <h3 className="relative font-extrabold text-base sm:text-lg md:text-[25px] after:content-[''] after:absolute after:bg-black after:bottom-[2px] md:after:bottom-[4px] after:left-0 after:right-[20px] md:after:right-[50px] after:h-[1px]">
              BARANGAY. IBA
            </h3>
            <h5 className="text-xs sm:text-sm md:text-base">SILANG, CAVITE</h5>
          </div>
        </div>

        <div className="relative h-full md:h-[calc(100vh-91px)] w-full z-10 flex items-center justify-center">
          <img src="/background-1.png" alt="background image" className="absolute inset-0 w-full h-full object-cover -z-10" />

          <form onSubmit={handleSubmit} className="bg-[#62dc87c8] w-full max-w-[700px] py-8 sm:py-10 px-6 sm:px-10 md:px-20 rounded-lg">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
              <label className="flex flex-col">
                <span className="font-semibold text-sm mb-1">FIRST NAME</span>
                <input type="text" name="firstName" className="px-2 py-1 rounded-md border border-gray-300 text-gray-800"
                  value={formData.firstName} onChange={handleChange} />
              </label>

              <label className="flex flex-col">
                <span className="font-semibold text-sm mb-1">LAST NAME</span>
                <input type="text" name="lastName" className="px-2 py-1 rounded-md border border-gray-300 text-gray-800"
                  value={formData.lastName} onChange={handleChange} />
              </label>

              <label className="flex flex-col">
                <span className="font-semibold text-sm mb-1">MIDDLE NAME</span>
                <input type="text" name="middleName" className="px-2 py-1 rounded-md border border-gray-300 text-gray-800"
                  value={formData.middleName} onChange={handleChange} />
              </label>

              <label className="flex flex-col">
                <span className="font-semibold text-sm mb-1">CONTACT NUMBER</span>
                <input type="text" name="contactNumber" className="px-2 py-1 rounded-md border border-gray-300 text-gray-800"
                  value={formData.contactNumber} onChange={handleChange} />
              </label>
            </div>

            <div className="flex flex-col gap-4 mt-6">
              <label className="flex flex-col">
                <span className="font-semibold text-sm mb-1">ADDRESS</span>
                <input type="text" name="address" className="px-2 py-1 rounded-md border border-gray-300 text-gray-800"
                  value={formData.address} onChange={handleChange} />
              </label>

              <label className="flex flex-col">
                <span className="font-semibold text-sm mb-1">USERNAME</span>
                <input type="text" name="username" className="px-2 py-1 rounded-md border border-gray-300 text-gray-800"
                  value={formData.username} onChange={handleChange} />
              </label>

              <label className="flex flex-col">
                <span className="font-semibold text-sm mb-1">PASSWORD</span>
                <input type="password" name="password" className="px-2 py-1 rounded-md border border-gray-300 text-gray-800"
                  value={formData.password} onChange={handleChange} />
              </label>

              <label className="flex flex-col">
                <span className="font-semibold text-sm mb-1">CONFIRM PASSWORD</span>
                <input type="password" name="confirmPassword" className="px-2 py-1 rounded-md border border-gray-300 text-gray-800"
                  value={formData.confirmPassword} onChange={handleChange} />
              </label>
            </div>

            <div className="w-full text-center mt-6">
              <button type="submit" className="bg-[#eaeaea] hover:bg-[#d3d3d3] rounded-full w-full sm:w-auto sm:px-20 md:px-40 py-2 text-[18px] font-semibold">
                REGISTER
              </button>
              <p className="font-semibold mt-2 text-sm sm:text-base">
                ALREADY HAVE AN ACCOUNT? CLICK{" "}
                <NavLink to="/login" className="text-blue-700">HERE!</NavLink>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
