import { useState, useEffect, type FormEvent } from "react";
import axios from "axios";

interface Suggestion {
  _id: string;
  title: string;
  description: string;
  date: string;
}

const ProjectSuggestion: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const API_URL = "https://barangay-portal-server.onrender.com/api/admin/project-suggestions";

  // Fetch suggestions
  const fetchSuggestions = async () => {
    try {
      const res = await axios.get<Suggestion[]>(API_URL);
      setSuggestions(res.data);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  // Submit suggestion
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || !description) return alert("Please fill in all fields.");

    setLoading(true);
    try {
      await axios.post(API_URL, { title, description });
      setTitle("");
      setDescription("");
      fetchSuggestions(); // Refresh the list
    } catch (err) {
      console.error("Error submitting suggestion:", err);
      alert("Failed to submit suggestion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="font-extrabold text-2xl mb-6 border-b-4 border-[#62DC87] inline-block">
        PROJECT SUGGESTION
      </h1>

      {/* === Suggestion Form === */}
      <div className="bg-white shadow-md rounded-md p-6 mb-8">
        <h2 className="text-lg font-bold mb-4 text-gray-800">Submit Your Suggestion</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Project Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-400 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#62DC87]"
            disabled={loading}
          />

          <textarea
            placeholder="Describe your project idea..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-400 rounded-md p-2 resize-none h-32 focus:outline-none focus:ring-2 focus:ring-[#62DC87]"
            disabled={loading}
          />

          <div className="flex justify-center gap-4">
            <button
              type="submit"
              className="bg-[#62DC87] text-black px-6 py-2 rounded-md font-semibold hover:bg-[#4bb96b] transition"
              disabled={loading}
            >
              {loading ? "Submitting..." : "SUBMIT"}
            </button>

            <button
              type="button"
              onClick={() => {
                setTitle("");
                setDescription("");
              }}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md font-semibold hover:bg-gray-300 transition"
              disabled={loading}
            >
              CLEAR
            </button>
          </div>
        </form>
      </div>

      {/* === Suggested Projects List === */}
      <div>
        <h2 className="text-lg font-bold mb-4 text-gray-800">Recent Suggestions</h2>

        {suggestions.length === 0 ? (
          <p className="text-gray-600 italic">No suggestions yet. Be the first to submit!</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {suggestions.map((s) => (
              <div
                key={s._id}
                className="bg-white shadow-md rounded-md p-4 hover:shadow-lg transition border-l-4 border-[#62DC87]"
              >
                <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-gray-700 mb-3 line-clamp-3">{s.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectSuggestion;
