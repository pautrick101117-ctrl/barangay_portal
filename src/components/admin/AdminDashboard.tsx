import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    officials: 0,
    news: 0,
    funds: 0,
    complaints: 0,
    suggestions: 0,
  });

  const fetchStats = async () => {
    try {
      const [
        projectsRes,
        officialsRes,
        newsRes,
        fundsRes,
        complaintsRes,
        suggestionsRes,
      ] = await Promise.all([
        fetch("https://barangay-portal-server.onrender.com/api/admin/projects"),
        fetch("https://barangay-portal-server.onrender.com/api/admin/officials"),
        fetch("https://barangay-portal-server.onrender.com/api/admin/news"),
        fetch("https://barangay-portal-server.onrender.com/api/admin/funds"),
        fetch("https://barangay-portal-server.onrender.com/api/admin/complaints"),
        fetch("https://barangay-portal-server.onrender.com/api/admin/project-suggestions"),
      ]);

      const [
        projects,
        officials,
        news,
        funds,
        complaints,
        suggestions,
      ] = await Promise.all([
        projectsRes.json(),
        officialsRes.json(),
        newsRes.json(),
        fundsRes.json(),
        complaintsRes.json(),
        suggestionsRes.json(),
      ]);

      setStats({
        projects: projects.length,
        officials: officials.length,
        news: news.length,
        funds: funds.length,
        complaints: complaints.length,
        suggestions: suggestions.length,
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl md:text-3xl font-bold text-green-700 mb-3 md:mb-4">
        Welcome to the Admin Dashboard
      </h1>
      <p className="text-gray-700 text-sm md:text-base">
        Here you can manage barangay projects, officials, funds, news updates, complaints, and project suggestions.
      </p>

      {/* GRID PANEL */}
      <div className="mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4 md:gap-6">
        {Object.entries(stats).map(([key, value]) => (
          <div
            key={key}
            className="bg-green-100 p-4 rounded-lg shadow hover:scale-105 transition"
          >
            <h3 className="font-semibold text-green-800 text-base md:text-lg">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </h3>
            <p className="text-xl md:text-2xl font-bold text-green-700 mt-1 md:mt-2">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
