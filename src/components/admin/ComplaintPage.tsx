import { useEffect, useState } from "react";
import axios from "axios";

interface Complaint {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

const ComplaintPage = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch complaints on mount
  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get<Complaint[]>(
        "http://localhost:3000/api/admin/complaints" // ✅ admin route
      );
      // Sort newest first
      setComplaints(
        res.data.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
    } catch (err) {
      console.error("Error fetching complaints:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this complaint?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/admin/complaints/${id}`); // ✅ admin route
      setComplaints((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Error deleting complaint:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Submitted Complaints</h1>

      {loading ? (
        <p>Loading complaints...</p>
      ) : complaints.length === 0 ? (
        <p>No complaints submitted yet.</p>
      ) : (
        <div className="space-y-4">
          {complaints.map((c) => (
            <div
              key={c._id}
              className="bg-white shadow-md rounded-md p-4 flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2"
            >
              <div>
                <p className="text-gray-800 mb-1">{c.message}</p>
                <p className="text-gray-500 text-sm">
                  {new Date(c.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(c._id)}
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

export default ComplaintPage;
