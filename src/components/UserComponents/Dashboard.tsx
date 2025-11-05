import { useState, useEffect } from "react";
import axios from "axios";

interface Project {
  _id: string;
  title: string;
  description: string;
}

const Dashboard = () => {
  const [complaint, setComplaint] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get<Project[]>(
          "http://localhost:3000/api/admin/projects"
        );
        setProjects(res.data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    fetchProjects();
  }, []);

  // Submit complaint
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaint.trim()) return;

    setLoading(true);
    try {
      await axios.post("http://localhost:3000/api/admin/complaints", {
        name: "Anonymous", // Replace with actual user name if available
        email: "anonymous@example.com", // Replace with actual user email if available
        message: complaint,
      });
      alert("Complaint submitted successfully!");
      setComplaint("");
    } catch (err) {
      console.error("Error submitting complaint:", err);
      alert("Failed to submit complaint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="font-extrabold text-xl mb-4 border-b-2 border-black inline-block">
        BARANGAY SYSTEM
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* === Complaints Box === */}
        <section className="bg-white shadow-md rounded-md">
          <div className="bg-[#62DC87] text-black font-bold px-4 py-2 rounded-t-md">
            COMPLAINTS BOX
          </div>

          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
            <textarea
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
              placeholder="Type your complaint here..."
              className="border border-gray-400 rounded-md p-2 resize-none h-40 text-gray-800"
              disabled={loading}
            />

            <div className="flex justify-center gap-4">
              <button
                type="submit"
                className="bg-gray-200 px-6 py-2 rounded-md font-semibold hover:bg-gray-300"
                disabled={loading}
              >
                {loading ? "Submitting..." : "SUBMIT"}
              </button>
              <button
                type="button"
                onClick={() => setComplaint("")}
                className="bg-gray-200 px-6 py-2 rounded-md font-semibold hover:bg-gray-300"
              >
                CANCEL
              </button>
            </div>
          </form>
        </section>

        {/* === Project Voting === */}
        <section className="bg-white shadow-md rounded-md p-4">
          <h2 className="font-bold text-lg mb-4 text-center border-b border-gray-300 pb-2">
            PROJECT VOTING
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {projects.length > 0 ? (
              projects.map((project) => (
                <div
                  key={project._id}
                  onClick={() => setSelectedProject(project)}
                  className="bg-gray-200 h-24 flex flex-col items-center justify-center font-semibold hover:bg-gray-300 rounded-md cursor-pointer p-2"
                >
                  <p className="text-sm font-bold truncate w-full text-center">
                    {project.title}
                  </p>
                  <p className="text-xs text-gray-600 text-center line-clamp-2">
                    {project.description}
                  </p>
                </div>
              ))
            ) : (
              <p className="col-span-2 text-center text-gray-500">
                No projects available
              </p>
            )}
          </div>
        </section>
      </div>

      {/* === Modal for Full Project Details === */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full">
            <h3 className="text-lg font-bold mb-2">{selectedProject.title}</h3>
            <p className="text-gray-700 mb-4 whitespace-pre-line">
              {selectedProject.description}
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedProject(null)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
