import { useState, useEffect, type FormEvent } from "react";
import axios from "axios";

interface Project {
  _id: string;
  title: string;
  description: string;
}

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  // Fetch projects on load
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/admin/projects", {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });

      // Handle both array and { projects: [...] }
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
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/admin/projects/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Projects for Voting</h1>
      <p className="text-gray-700 mb-6">
        Add or remove projects that residents can vote on.
      </p>

      {/* Add Project Form */}
      <form onSubmit={handleAddProject} className="mb-6 space-y-3">
        <input
          type="text"
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
        <textarea
          placeholder="Project Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Project
        </button>
      </form>

      {/* Project List */}
      {projects.length === 0 ? (
        <p className="text-gray-500">No projects found.</p>
      ) : (
        <ul className="space-y-3">
          {projects.map((project) => (
            <li
              key={project._id}
              className="border p-4 rounded flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold">{project.title}</h2>
                <p className="text-gray-600">{project.description}</p>
              </div>
              <button
                onClick={() => handleDeleteProject(project._id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProjectsPage;
