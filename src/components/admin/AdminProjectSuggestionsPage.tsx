import { useEffect, useState } from "react";
import axios from "axios";

interface Suggestion {
  _id: string;
  title: string;
  description: string;
  date: string;
}

const AdminProjectSuggestionsPage: React.FC = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:3000/api/admin/project-suggestions";

  // Fetch suggestions
  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const res = await axios.get<Suggestion[]>(API_URL, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      setSuggestions(res.data);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  // Delete suggestion
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this suggestion?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      setSuggestions((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Error deleting suggestion:", err);
      alert("Failed to delete suggestion.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Project Suggestions</h1>

      {loading ? (
        <p>Loading suggestions...</p>
      ) : suggestions.length === 0 ? (
        <p className="text-gray-500">No suggestions submitted yet.</p>
      ) : (
        <div className="space-y-4">
          {suggestions.map((s) => (
            <div
              key={s._id}
              className="bg-white shadow-md rounded-md p-4 flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2"
            >
              <div>
                <h3 className="font-bold text-lg">{s.title}</h3>
                <p className="text-gray-700">{s.description}</p>
              </div>
              <button
                onClick={() => handleDelete(s._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 mt-2 md:mt-0"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProjectSuggestionsPage;
