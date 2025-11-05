import { useEffect, useState } from "react";
import axios from "axios";

type FundRecord = {
  _id: string;
  source: string;
  description: string;
  amount: number;
  date: string;
};

const FundRecords = () => {
  const [records, setRecords] = useState<FundRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<FundRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await axios.get<FundRecord[]>("https://barangay-portal-server.onrender.com/api/admin/funds");
        setRecords(res.data);
      } catch (err) {
        console.error("Error fetching fund records:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  const total = records.reduce((acc, r) => acc + r.amount, 0);

  return (
    <div className="p-4 relative">
      <h1 className="font-extrabold text-2xl mb-6 border-b-4 border-[#62DC87] inline-block">
        FUND RECORDS
      </h1>

      {loading ? (
        <p>Loading fund records...</p>
      ) : records.length === 0 ? (
        <p>No fund records found.</p>
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#62DC87] text-black">
                <tr>
                  <th className="py-3 px-4 font-bold border-b border-gray-300">DATE</th>
                  <th className="py-3 px-4 font-bold border-b border-gray-300">SOURCE</th>
                  <th className="py-3 px-4 font-bold border-b border-gray-300">DESCRIPTION</th>
                  <th className="py-3 px-4 font-bold border-b border-gray-300 text-right">
                    AMOUNT (₱)
                  </th>
                </tr>
              </thead>

              <tbody>
                {records.map((record) => (
                  <tr
                    key={record._id}
                    onClick={() => setSelectedRecord(record)}
                    className="hover:bg-gray-100 transition-colors border-b border-gray-200 cursor-pointer"
                  >
                    <td className="py-3 px-4 whitespace-nowrap">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">{record.source}</td>
                    <td className="py-3 px-4 max-w-xs truncate">{record.description}</td>
                    <td className="py-3 px-4 text-right font-semibold text-green-700">
                      {record.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr className="bg-gray-100 font-bold text-black">
                  <td colSpan={3} className="py-3 px-4 text-right">
                    TOTAL:
                  </td>
                  <td className="py-3 px-4 text-right text-green-700">
                    ₱{total.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* MODAL */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-[90%] max-w-md relative">
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

export default FundRecords;
