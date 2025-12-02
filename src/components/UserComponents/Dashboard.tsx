import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface Project {
  _id: string;
  title: string;
  description: string;
  votes: number;
  status: string;
}

interface VoteStatus {
  hasVoted: boolean;
  votedProject: Project | null;
  currentMonth: string;
}

interface DecodedToken {
  id: string;
  username: string;
  exp: number;
}

const Dashboard = () => {
  const [complaint, setComplaint] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [voteStatus, setVoteStatus] = useState<VoteStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const API_URL = "http://localhost:3000/api/admin";

  const getCurrentUserId = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;

      const decoded = jwtDecode<DecodedToken>(token);
      const now = Date.now() / 1000;
      if (decoded.exp < now) {
        localStorage.removeItem("token");
        return null;
      }

      return decoded.id;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const getAxiosInstance = () => {
    const userId = getCurrentUserId();
    return axios.create({
      headers: userId ? { "x-user-id": userId } : {},
    });
  };

  useEffect(() => {
    const userId = getCurrentUserId();
    setIsAuthenticated(!!userId);
    
    fetchProjects();
    if (userId) {
      fetchVoteStatus();
    }
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get<Project[]>(`${API_URL}/projects/active`);
      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  const fetchVoteStatus = async () => {
    try {
      const axiosInstance = getAxiosInstance();
      const res = await axiosInstance.get<VoteStatus>(`${API_URL}/projects/vote-status`);
      setVoteStatus(res.data);
    } catch (err) {
      console.error("Error fetching vote status:", err);
    }
  };
  const handleVote = async (projectId: string) => {
    if (!isAuthenticated) {
      alert("Please log in to vote!");
      return;
    }

    const confirmMessage =
      voteStatus?.votedProject?._id === projectId
        ? "Are you sure you want to cancel your vote for this project?"
        : "Confirm your vote for this project?";

    if (!window.confirm(confirmMessage)) return;

    setLoading(true);
    try {
      const axiosInstance = getAxiosInstance();
      const res = await axiosInstance.post(`${API_URL}/projects/vote`, { projectId });
      
      if (res.data.cancelled) {
        alert("Your vote has been cancelled.");
      } else {
        alert("Vote recorded successfully!");
      }

      await fetchProjects();
      await fetchVoteStatus();
      setSelectedProject(null);
    } catch (err: any) {
      console.error("Error voting:", err);
      alert(err.response?.data?.message || "Failed to record vote");
    } finally {
      setLoading(false);
    }
  };


  const handleSubmitComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaint.trim()) return;

    setLoading(true);
    try {
      await axios.post(`${API_URL}/complaints`, {
        name: "Anonymous",
        email: "anonymous@example.com",
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-extrabold text-3xl md:text-4xl mb-2 border-b-4 border-[#62DC87] inline-block">
          BARANGAY SYSTEM
        </h1>
        <p className="text-sm text-gray-600 mt-2 mb-8">
          Share your concerns and vote for community projects
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Complaints Box */}
          <section className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
            <div className="bg-[#62DC87] text-black font-bold px-6 py-4">
              📝 COMPLAINTS BOX
            </div>

            <form onSubmit={handleSubmitComplaint} className="p-6 space-y-4">
              <textarea
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                placeholder="Type your complaint here..."
                className="w-full border border-gray-300 rounded-lg p-4 resize-none h-40 focus:outline-none focus:ring-2 focus:ring-[#62DC87] focus:border-transparent"
                disabled={loading}
              />

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#62DC87] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#4bb96b] transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "✉️ SUBMIT"}
                </button>
                <button
                  type="button"
                  onClick={() => setComplaint("")}
                  className="flex-1 sm:flex-none bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                >
                  🔄 CLEAR
                </button>
              </div>
            </form>
          </section>

          {/* Project Voting */}
          <section className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
            <div className="bg-[#62DC87] text-black font-bold px-6 py-4">
              🗳️ PROJECT VOTING
            </div>

            <div className="p-6">
              {!isAuthenticated ? (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
                  <p className="text-blue-800 font-semibold mb-2">
                    🔐 Please log in to vote
                  </p>
                  <a
                    href="/login"
                    className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    Go to Login
                  </a>
                </div>
              ) : voteStatus?.hasVoted ? (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg mb-4">
                  <p className="text-green-800 font-semibold mb-1">
                    ✅ You voted for: {voteStatus.votedProject?.title}
                  </p>
                  <p className="text-sm text-green-700">
                    You can change your vote by selecting another project
                  </p>
                </div>
              ) : (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg mb-4">
                  <p className="text-yellow-800 font-semibold">
                    ℹ️ You can vote for one project this month
                  </p>
                </div>
              )}

              {projects.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No active projects available for voting</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {projects.map((project) => (
                    <div
                      key={project._id}
                      onClick={() => setSelectedProject(project)}
                      className={`relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg border-2 ${
                        voteStatus?.votedProject?._id === project._id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-[#62DC87]'
                      }`}
                    >
                      {voteStatus?.votedProject?._id === project._id && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                          ✓ Your Vote
                        </div>
                      )}
                      
                      <h3 className="font-bold text-base mb-2 pr-16 line-clamp-2">
                        {project.title}
                      </h3>
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-300">
                        <span className="text-xs text-gray-500">
                          👥 {project.votes} {project.votes === 1 ? 'vote' : 'votes'}
                        </span>
                        <span className="text-xs font-semibold text-[#62DC87]">
                          Click to view
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative animate-fadeIn">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-3 right-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold transition-colors"
            >
              ✕
            </button>

            <div className="p-6">
              <h3 className="text-2xl font-bold mb-3 pr-8">{selectedProject.title}</h3>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              <div className="flex items-center justify-between mb-6 p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Total Votes:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {selectedProject.votes}
                </span>
              </div>

              {isAuthenticated && (
                <button
                  onClick={() => handleVote(selectedProject._id)}
                  disabled={loading}
                  className={`w-full py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 ${
                    voteStatus?.votedProject?._id === selectedProject._id
                      ? 'bg-red-500 hover:bg-red-600 text-white' // red for cancel
                      : 'bg-[#62DC87] hover:bg-[#4bb96b] text-white'
                  }`}
                >
                  {loading
                    ? "Processing..."
                    : voteStatus?.votedProject?._id === selectedProject._id
                    ? "❌ Cancel Vote"
                    : "🗳️ Vote for This Project"}
                </button>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;