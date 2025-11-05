import { useState, useEffect } from "react";
import axios from "axios";

type FundRecord = {
  _id: string;
  source: string;
  description: string;
  amount: number;
  date: string;
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

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await axios.get("https://barangay-portal-server.onrender.com/api/admin/funds");
      setRecords(res.data);
    } catch (err) {
      console.error("Error fetching funds:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { source, description, amount: Number(amount), date };
    try {
      if (editingId) {
        await axios.put(`https://barangay-portal-server.onrender.com/api/admin/funds/${editingId}`, payload);
        setRecords((prev) =>
          prev.map((r) => (r._id === editingId ? { ...r, ...payload } : r))
        );
        setEditingId(null);
      } else {
        const res = await axios.post("https://barangay-portal-server.onrender.com/api/admin/funds", payload);
        setRecords((prev) => [res.data, ...prev]);
      }

      setSource("");
      setDescription("");
      setAmount("");
      setDate("");
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
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      await axios.delete(`https://barangay-portal-server.onrender.com/api/admin/funds/${id}`);
      setRecords((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Error deleting record:", err);
    }
  };

  const total = records.reduce((acc, r) => acc + r.amount, 0);

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-4">Fund Records</h1>
      <p className="text-gray-700 mb-6">Update barangay fund records.</p>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-md p-4 mb-6 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-end"
      >
        <input
          type="text"
          placeholder="Source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="border px-3 py-2 rounded flex-1"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border px-3 py-2 rounded flex-1"
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
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
        <div className="flex gap-2 flex-wrap">
          <button
            type="submit"
            className={`px-4 py-2 text-white rounded ${
              editingId ? "bg-blue-500 hover:bg-blue-600" : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {editingId ? "Update Record" : "Add Record"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setSource("");
                setDescription("");
                setAmount("");
                setDate("");
              }}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* TABLE */}
      {loading ? (
        <p>Loading records...</p>
      ) : records.length === 0 ? (
        <p>No fund records found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-md">
          <table className="w-full text-left border-collapse min-w-[600px] md:min-w-full">
            <thead className="bg-[#62DC87] text-black">
              <tr>
                <th className="py-2 px-3 border-b">Date</th>
                <th className="py-2 px-3 border-b">Source</th>
                <th className="py-2 px-3 border-b">Description</th>
                <th className="py-2 px-3 border-b text-right">Amount (₱)</th>
                <th className="py-2 px-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr
                  key={r._id}
                  className="border-b hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => setSelectedRecord(r)}
                >
                  <td className="py-2 px-3">{new Date(r.date).toLocaleDateString()}</td>
                  <td className="py-2 px-3">{r.source}</td>
                  <td className="py-2 px-3 max-w-xs truncate">{r.description}</td>
                  <td className="py-2 px-3 text-right font-semibold text-green-700">
                    ₱{r.amount.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(r);
                      }}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(r._id);
                      }}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-bold">
                <td colSpan={3} className="text-right px-3 py-2">
                  TOTAL:
                </td>
                <td className="text-right px-3 py-2 text-green-700">
                  ₱{total.toLocaleString()}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative">
            <h2 className="text-xl font-bold mb-4 border-b pb-2 text-gray-800">
              {selectedRecord.source}
            </h2>
            <p className="text-sm text-gray-500 mb-2">
              {new Date(selectedRecord.date).toLocaleDateString()}
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">{selectedRecord.description}</p>
            <div className="text-right font-semibold text-green-700 text-lg mb-6">
              ₱{selectedRecord.amount.toLocaleString()}
            </div>
            <button
              onClick={() => setSelectedRecord(null)}
              className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full px-3 py-1 text-sm font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FundsPage;
