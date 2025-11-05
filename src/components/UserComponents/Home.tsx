import { NavLink } from "react-router-dom"

const Home = () => {
  return (
    <div className="relative min-h-screen flex flex-col bg-cover bg-center" 
      style={{ backgroundImage: "url('/background-1.png')" }}>

      {/* Main Content */}
      <section className="flex-1 grid grid-cols-1 lg:grid-cols-2 items-center gap-8 px-6 md:px-12 lg:px-32 py-12">
        {/* Left Section */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg p-6 flex flex-col lg:flex-row items-center text-center lg:text-left">
          <img 
            src="/samplePic.png" 
            alt="Profile Image" 
            className="w-40 h-40 lg:w-64 lg:h-64 rounded-full object-cover border-4 border-white shadow-md"
          />
          <div className="mt-4 lg:mt-0 lg:ml-6">
            <h3 className="font-bold italic text-2xl lg:text-3xl text-gray-800">
              Leo Mativag Belando
            </h3>
            <p className="text-gray-700 font-medium mt-2 text-sm lg:text-base">
              Barangay Captain of Iba, Silang, Cavite
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg p-6 text-justify text-gray-800 font-medium leading-relaxed">
          <p className="text-base lg:text-lg">
            Iba is a barangay in the municipality of Silang, in the province of Cavite. 
            Its population as determined by the 2020 Census was 5,148. This represented 
            1.74% of the total population of Silang. The barangay continues to grow, 
            promoting community development, livelihood, and a sustainable environment 
            for its residents.
          </p>
        </div>
      </section>
    </div>
  )
}

export default Home
