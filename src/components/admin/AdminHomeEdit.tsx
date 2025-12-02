import { useEffect, useState } from "react";
import axios from "axios";

interface HomeData {
  _id?: string;
  title: string;
  subTitle: string;
  content: string;
  backgroundUrl: string;
}

function AdminHomeEdit() {
  const [homeData, setHomeData] = useState<HomeData>({
    title: "",
    subTitle: "",
    content: "",
    backgroundUrl: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch home data on mount
  useEffect(() => {
    const fetchHome = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/home");
        setHomeData(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load home data.");
      } finally {
        setLoading(false);
      }
    };
    fetchHome();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setHomeData({ ...homeData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("title", homeData.title);
      formData.append("subTitle", homeData.subTitle);
      formData.append("content", homeData.content);

      if (file) {
        formData.append("background", file); // name matches backend multer
      }

      let res;
      if (homeData._id) {
        res = await axios.put(`http://localhost:3000/api/home/${homeData._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccess("Home content updated successfully!");
      } else {
        res = await axios.post("http://localhost:3000/api/home", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccess("Home content created successfully!");
      }

      setHomeData(res.data);
      setFile(null);
    } catch (err) {
      console.error(err);
      setError("Failed to save home data.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-gray-700">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6">Edit Home Page Content</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={homeData.title}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Subtitle</label>
          <input
            type="text"
            name="subTitle"
            value={homeData.subTitle}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Content</label>
          <textarea
            name="content"
            value={homeData.content}
            onChange={handleChange}
            rows={6}
            className="w-full border px-4 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Background Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border px-4 py-2 rounded"
          />
          {homeData.backgroundUrl && (
            <img
              src={homeData.backgroundUrl}
              alt="Current background"
              className="mt-2 w-48 h-32 object-cover rounded"
            />
          )}
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white font-semibold px-6 py-2 rounded shadow hover:bg-green-600 transition"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Home Content"}
        </button>
      </form>
    </div>
  );
}

export default AdminHomeEdit;
