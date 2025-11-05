import { useState, useEffect } from "react";
import axios from "axios";

type NewsArticle = {
  _id: string;
  title: string;
  date: string;
  imageUrl: string;
  imagePublicId: string;
  description: string;
};

const AdminNewsPage = () => {
  const [newsList, setNewsList] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imagePublicId, setImagePublicId] = useState<string>(""); // store public_id
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/admin/news"
      );
      setNewsList(res.data);
    } catch (err) {
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  };

  // Upload image to Cloudinary
  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );
    formData.append("folder", "barangayImage");

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        formData
      );
      return { url: res.data.secure_url, public_id: res.data.public_id };
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalImageUrl = imagePreview;
    let finalPublicId = imagePublicId;

    // Upload new image if selected
    if (imageFile) {
      const uploaded = await uploadToCloudinary(imageFile);
      if (uploaded) {
        finalImageUrl = uploaded.url;
        finalPublicId = uploaded.public_id;
      }
    }

    try {
      if (editingId) {
        // UPDATE NEWS
        const res = await axios.put(
          `http://localhost:3000/api/admin/news/${editingId}`,
          {
            title,
            description,
            date,
            imageUrl: finalImageUrl,
            imagePublicId: finalPublicId,
          }
        );

        setNewsList((prev) =>
          prev.map((n) => (n._id === editingId ? res.data.updated : n))
        );
        setEditingId(null);
      } else {
        // ADD NEWS
        const res = await axios.post(
          "http://localhost:3000/api/admin/news",
          {
            title,
            description,
            date,
            imageUrl: finalImageUrl,
            imagePublicId: finalPublicId,
          }
        );
        setNewsList((prev) => [res.data, ...prev]);
      }

      // Reset form
      setTitle("");
      setDescription("");
      setDate("");
      setImageFile(null);
      setImagePreview("");
      setImagePublicId("");
    } catch (err) {
      console.error("Error saving news:", err);
    }
  };

  const handleEdit = (news: NewsArticle) => {
    setEditingId(news._id);
    setTitle(news.title);
    setDescription(news.description);
    setDate(news.date.split("T")[0]);
    setImagePreview(news.imageUrl);
    setImagePublicId(news.imagePublicId);
    setImageFile(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this news article?")) return;
    try {
      await axios.delete(
        `http://localhost:3000/api/admin/news/${id}`
      );
      setNewsList((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Error deleting news:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">News & Updates</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-md p-4 mb-6 flex flex-col gap-3">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border px-3 py-2 rounded"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setImageFile(e.target.files[0]);
              setImagePreview(URL.createObjectURL(e.target.files[0]));
            }
          }}
          className="border px-3 py-2 rounded"
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="w-48 h-48 object-cover rounded-md mb-2"
          />
        )}
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border px-3 py-2 rounded"
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border px-3 py-2 rounded"
          required
        />

        <div className="flex gap-2">
          <button
            type="submit"
            className={`px-4 py-2 text-white rounded ${
              editingId ? "bg-blue-500 hover:bg-blue-600" : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {editingId ? "Update News" : "Add News"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setTitle("");
                setDescription("");
                setDate("");
                setImageFile(null);
                setImagePreview("");
                setImagePublicId("");
              }}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* NEWS GRID */}
      {loading ? (
        <p>Loading news...</p>
      ) : newsList.length === 0 ? (
        <p>No news articles found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsList.map((news) => (
            <div key={news._id} className="bg-white rounded-2xl shadow hover:shadow-lg transition cursor-pointer overflow-hidden">
              <img src={news.imageUrl} alt={news.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-1">{news.title}</h2>
                <p className="text-sm text-gray-500">{new Date(news.date).toLocaleDateString()}</p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEdit(news)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(news._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminNewsPage;
