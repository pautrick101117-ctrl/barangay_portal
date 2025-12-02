import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";

interface HomeData {
  title: string;
  subTitle: string;
  content: string;
  backgroundUrl: string;
}

export default function Home() {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/home");
        setHomeData(res.data);
      } catch (err) {
        console.error("Failed to fetch home data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHome();
  }, []);

  if (loading) return <div className="p-10 text-gray-700">Loading...</div>;

  if (!homeData)
    return <div className="p-10 text-red-600">No home content available.</div>;

  return (
    <div
      className="relative min-h-screen flex flex-col bg-cover bg-center"
      style={{ backgroundImage: `url(${homeData.backgroundUrl})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Main Content */}
      <section className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-2 items-center gap-12 px-6 md:px-16 lg:px-32 py-20">
        {/* Left Section */}
        <div className="text-white space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg leading-tight">
            {homeData.title}
          </h1>
          <p className="max-w-md text-lg md:text-xl text-white/90 leading-relaxed">
            {homeData.subTitle}
          </p>

          <NavLink
            to="/about"
            className="inline-block bg-white text-gray-900 font-semibold px-6 py-3 rounded-xl shadow hover:bg-gray-200 transition-all"
          >
            Learn More...
          </NavLink>
        </div>

        {/* Right Section */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-8 text-gray-800 font-medium leading-relaxed border border-white/50">
          <p className="text-lg lg:text-xl">{homeData.content}</p>
        </div>
      </section>
    </div>
  );
}
