import { NavLink } from "react-router-dom"

export default function Home() {
  return (
    <div
      className="relative min-h-screen flex flex-col bg-cover bg-center"
      style={{ backgroundImage: "url('/background-1.png')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Main Content */}
      <section className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-2 items-center gap-12 px-6 md:px-16 lg:px-32 py-20">
        {/* Left Section Placeholder (add hero text or images later) */}
        <div className="text-white space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg leading-tight">
            Welcome to Barangay Iba
          </h1>
          <p className="max-w-md text-lg md:text-xl text-white/90 leading-relaxed">
            Your gateway to community services, updates, and local initiatives.
          </p>

          <NavLink
            to="/about"
            className="inline-block bg-white text-gray-900 font-semibold px-6 py-3 rounded-xl shadow hover:bg-gray-200 transition-all"
          >
            News & Updates
          </NavLink>
        </div>

        {/* Right Section */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-8 text-gray-800 font-medium leading-relaxed border border-white/50">
          <p className="text-lg lg:text-xl">
            Iba is a barangay in the municipality of Silang, in the province of Cavite. Its
            population as determined by the 2020 Census was <span className="font-semibold">5,148</span>.
            This represented <span className="font-semibold">1.74%</span> of the total population of Silang.
            <br /><br />
            The barangay continues to grow, promoting community development, livelihood, and a
            sustainable environment for its residents.
          </p>
        </div>
      </section>
    </div>
  )
}
