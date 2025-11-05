import { useState, useEffect, useRef } from "react";
import axios from "axios";

interface Official {
  _id: string;
  name: string;
  position: string;
  term: string;
  imageUrl?: string;
  imagePublicId?: string;
}

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const OfficialsPage = () => {
  const [officials, setOfficials] = useState<Official[]>([]);
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [term, setTerm] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchOfficials = async () => {
      try {
        const res = await axios.get<Official[]>(
          "https://barangay-portal-server.onrender.com/api/admin/officials"
        );
        setOfficials(res.data);
      } catch (err) {
        console.error("Error fetching officials:", err);
      }
    };
    fetchOfficials();
  }, []);

  // ⬆️ Upload image to Cloudinary first
  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData
    );

    return {
      url: res.data.secure_url,
      publicId: res.data.public_id,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let uploadedImage = { url: "", publicId: "" };

      if (image) {
        uploadedImage = await uploadToCloudinary(image);
      }

      const payload = {
        name,
        position,
        term,
        imageUrl: uploadedImage.url,
        imagePublicId: uploadedImage.publicId,
      };

      if (editingId) {
        const res = await axios.put<{ updated: Official }>(
          `https://barangay-portal-server.onrender.com/api/admin/officials/${editingId}`,
          payload
        );
        setOfficials((prev) =>
          prev.map((o) => (o._id === editingId ? res.data.updated : o))
        );
        setEditingId(null);
      } else {
        const res = await axios.post<Official>(
          "https://barangay-portal-server.onrender.com/api/admin/officials",
          payload
        );
        setOfficials((prev) => [res.data, ...prev]);
      }

      setName("");
      setPosition("");
      setTerm("");
      setImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Error saving official:", err);
    }
  };

  const handleEdit = (official: Official) => {
    setEditingId(official._id);
    setName(official.name);
    setPosition(official.position);
    setTerm(official.term);
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this official?")) return;
    try {
      await axios.delete(
        `https://barangay-portal-server.onrender.com/api/admin/officials/${id}`
      );
      setOfficials((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      console.error("Error deleting official:", err);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-2 sm:mb-4">Barangay Officials</h1>
      <p className="text-gray-700 mb-4 sm:mb-6">
        Add, edit, or remove barangay officials here.
      </p>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-md p-4 sm:p-6 mb-6 flex flex-col sm:flex-row sm:flex-wrap gap-3"
      >
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 flex-1 w-full sm:w-auto"
          required
        />
        <input
          type="text"
          placeholder="Position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 flex-1 w-full sm:w-auto"
          required
        />
        <input
          type="text"
          placeholder="Term (e.g. 2023-2026)"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 flex-1 w-full sm:w-auto"
          required
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
          className="border border-gray-300 rounded-md px-3 py-2 flex-1 w-full sm:w-auto"
        />
        <div className="flex gap-2 flex-wrap">
          <button
            type="submit"
            className={`${
              editingId
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-green-500 hover:bg-green-600"
            } text-white px-4 py-2 rounded-md`}
          >
            {editingId ? "Update Official" : "Add Official"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setName("");
                setPosition("");
                setTerm("");
                setImage(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* TABLE */}
      <div className="bg-white shadow-md rounded-md overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Position</th>
              <th className="px-4 py-2 text-left">Term</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {officials.length > 0 ? (
              officials.map((o) => (
                <tr key={o._id} className="border-t">
                  <td className="px-4 py-2">
                    <img
                      src={o.imageUrl || "https://via.placeholder.com/50"}
                      alt={o.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-4 py-2">{o.name}</td>
                  <td className="px-4 py-2">{o.position}</td>
                  <td className="px-4 py-2">{o.term}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(o)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(o._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 py-4">
                  No officials found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OfficialsPage;
