import { useState, useEffect, type FormEvent } from "react";
import axios from "axios";

interface Project {
  _id: string;
  title: string;
  description: string;
  votes: number;
  status: string;
  monthPosted: string;
}

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/admin/projects", {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });

      if (Array.isArray(res.data)) {
        setProjects(res.data);
      } else if (Array.isArray(res.data.projects)) {
        setProjects(res.data.projects);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
    }
  };

  const handleAddProject = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:3000/api/admin/projects",
        { title, description },
        { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
      );
      setTitle("");
      setDescription("");
      fetchProjects();
      alert("Project added successfully!");
    } catch (error) {
      console.error("Error adding project:", error);
      alert("Failed to add project");
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    
    try {
      await axios.delete(`http://localhost:3000/api/admin/projects/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      fetchProjects();
      alert("Project deleted successfully!");
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project");
    }
  };

  const filteredProjects = projects.filter(p => {
    if (filter === "all") return true;
    return p.status === filter;
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      upcoming: "bg-blue-100 text-blue-800",
      active: "bg-green-100 text-green-800",
      past: "bg-gray-100 text-gray-800"
    };
    return badges[status as keyof typeof badges] || badges.upcoming;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 border-b-4 border-[#62DC87] inline-block">
          Manage Projects
        </h1>
        <p className="text-gray-600 mt-2 mb-6">
          Add, view, and manage projects for community voting
        </p>

        {/* Add Project Form */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">➕ Add New Project</h2>
          <form onSubmit={handleAddProject} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Title
              </label>
              <input
                type="text"
                placeholder="Enter project title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#62DC87] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Description
              </label>
              <textarea
                placeholder="Enter project description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 p-3 rounded-lg resize-none focus:ring-2 focus:ring-[#62DC87] focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#62DC87] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#4bb96b] transition-all shadow-md hover:shadow-lg"
            >
              Add Project
            </button>
          </form>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white shadow-md rounded-xl p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {["all", "upcoming", "active", "past"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === status
                    ? "bg-[#62DC87] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                {status !== "all" && ` (${projects.filter(p => p.status === status).length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Project List */}
        {filteredProjects.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <p className="text-gray-500">No projects found in this category.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <div
                key={project._id}
                className="bg-white shadow-md rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <h2 className="text-lg font-bold text-gray-800 flex-1">
                        {project.title}
                      </h2>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3 text-sm">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="text-gray-600">
                        👥 <strong>{project.votes}</strong> votes
                      </span>
                      <span className="text-gray-600">
                        📅 Posted: {new Date(project.monthPosted).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteProject(project._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium text-sm"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;