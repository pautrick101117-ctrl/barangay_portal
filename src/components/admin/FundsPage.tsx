import { useState, useEffect } from "react";
import axios from "axios";

type FundRecord = {
  _id: string;
  source: string;
  description: string;
  amount: number;
  date: string;
  imageUrl?: string;
};

const FundsPage = () => {
  const [records, setRecords] = useState<FundRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<FundRecord | null>(null);

  // Form state
  const [source, setSource] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [date, setDate] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // file
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/admin/funds");
      setRecords(res.data);
    } catch (err) {
      console.error("Error fetching funds:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("source", source);
    data.append("description", description);
    data.append("amount", String(amount));
    data.append("date", date);

    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      if (editingId) {
        const res = await axios.put(
          `http://localhost:3000/api/admin/funds/${editingId}`,
          data,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        setRecords((prev) =>
          prev.map((r) => (r._id === editingId ? res.data : r))
        );

        setEditingId(null);
      } else {
        const res = await axios.post(
          "http://localhost:3000/api/admin/funds/create",
          data,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        setRecords((prev) => [res.data, ...prev]);
      }

      // reset
      setSource("");
      setDescription("");
      setAmount("");
      setDate("");
      setImageFile(null);
      setPreview(null);
    } catch (err) {
      console.error("Error saving fund record:", err);
    }
  };

  const handleEdit = (record: FundRecord) => {
    setEditingId(record._id);
    setSource(record.source);
    setDescription(record.description);
    setAmount(record.amount);
    setDate(record.date.split("T")[0]);
    setPreview(record.imageUrl || null);
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/admin/funds/${id}`);
      setRecords((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Error deleting record:", err);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setSource("");
    setDescription("");
    setAmount("");
    setDate("");
    setPreview(null);
    setImageFile(null);
  };

  const total = records.reduce((acc, r) => acc + r.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2 border-b-4 border-[#62DC87] inline-block">
            Fund Records
          </h1>
          <p className="text-gray-600 mt-2">Manage and track barangay fund records</p>
        </div>

        {/* FORM */}
        <div className="bg-white shadow-lg rounded-xl p-4 md:p-6 mb-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4 text-gray-700">
            {editingId ? "✏️ Edit Record" : "➕ Add New Record"}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Source
                </label>
                <input
                  type="text"
                  placeholder="e.g., Municipal Grant"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#62DC87] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (₱)
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#62DC87] focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Row 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                placeholder="Enter details about this fund record..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#62DC87] focus:border-transparent resize-none"
                required
              />
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#62DC87] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#62DC87] focus:border-transparent file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:bg-[#62DC87] file:text-white hover:file:bg-[#4FC76F] file:cursor-pointer"
                />
              </div>
            </div>

            {/* Preview */}
            {preview && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <img
                  src={preview}
                  alt="preview"
                  className="w-20 h-20 object-cover rounded-lg border-2 border-[#62DC87]"
                />
                <span className="text-sm text-gray-600">Image preview</span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                className={`flex-1 px-6 py-3 text-white rounded-lg font-semibold transition-all ${
                  editingId
                    ? "bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-xl"
                    : "bg-[#62DC87] hover:bg-[#4FC76F] shadow-lg hover:shadow-xl"
                }`}
              >
                {editingId ? "💾 Update Record" : "➕ Add Record"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="flex-1 sm:flex-none px-6 py-3 bg-gray-400 text-white rounded-lg font-semibold hover:bg-gray-500 transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* RECORDS LIST */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading records...</p>
          </div>
        ) : records.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <p className="text-gray-600">No fund records found. Add your first record above!</p>
          </div>
        ) : (
          <>
            {/* Desktop/Tablet: Cards Grid */}
            <div className="space-y-4 mb-6">
              {records.map((r) => (
                <div
                  key={r._id}
                  className="bg-white shadow-md hover:shadow-xl rounded-xl p-4 md:p-5 transition-all duration-200 border border-gray-200 hover:border-[#62DC87]"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Image */}
                    <div 
                      className="flex-shrink-0 cursor-pointer"
                      onClick={() => setSelectedRecord(r)}
                    >
                      {r.imageUrl ? (
                        <img
                          src={r.imageUrl}
                          alt="Fund"
                          className="w-full sm:w-24 sm:h-24 md:w-28 md:h-28 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full sm:w-24 sm:h-24 md:w-28 md:h-28 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No Image</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div 
                        className="cursor-pointer"
                        onClick={() => setSelectedRecord(r)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                          <h3 className="font-bold text-lg md:text-xl text-gray-800">
                            {r.source}
                          </h3>
                          <span className="text-sm text-gray-500 sm:text-right whitespace-nowrap">
                            📅 {new Date(r.date).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {r.description}
                        </p>

                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs uppercase text-gray-500 font-medium">
                            Amount
                          </span>
                          <span className="font-bold text-xl md:text-2xl text-green-700">
                            ₱{r.amount.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(r);
                          }}
                          className="flex-1 sm:flex-none bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
                        >
                          ✏️ Edit
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(r._id);
                          }}
                          className="flex-1 sm:flex-none bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium text-sm"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Card */}
            <div className="bg-gradient-to-r from-[#62DC87] to-[#4FC76F] rounded-xl shadow-xl p-5 md:p-6 sticky bottom-4">
              <div className="flex items-center justify-between">
                <span className="text-white font-bold text-lg md:text-xl">
                  💰 TOTAL FUNDS:
                </span>
                <span className="text-white font-extrabold text-2xl md:text-3xl">
                  ₱{total.toLocaleString()}
                </span>
              </div>
            </div>
          </>
        )}

        {/* MODAL */}
        {selectedRecord && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg relative animate-fadeIn">
              <button
                onClick={() => setSelectedRecord(null)}
                className="absolute top-3 right-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold transition-colors"
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold mb-4 pr-8 text-gray-800">
                {selectedRecord.source}
              </h2>

              {selectedRecord.imageUrl && (
                <img
                  src={selectedRecord.imageUrl}
                  alt="Fund"
                  className="w-full h-56 object-cover rounded-xl mb-4 border-2 border-gray-200"
                />
              )}

              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-gray-500">
                  📅 {new Date(selectedRecord.date).toLocaleDateString()}
                </span>
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">
                {selectedRecord.description}
              </p>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-semibold">Amount:</span>
                  <span className="font-bold text-2xl text-green-700">
                    ₱{selectedRecord.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FundsPage;