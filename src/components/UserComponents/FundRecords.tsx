import { useEffect, useState } from "react";
import axios from "axios";

type FundRecord = {
  _id: string;
  source: string;
  description: string;
  amount: number;
  date: string;
  imageUrl?: string;
};

const FundRecords = () => {
  const [records, setRecords] = useState<FundRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<FundRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await axios.get<FundRecord[]>("http://localhost:3000/api/admin/funds");
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
    <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto">
      <h1 className="font-extrabold text-2xl md:text-3xl mb-6 border-b-4 border-[#62DC87] inline-block">
        FUND RECORDS
      </h1>

      {loading ? (
        <p className="text-gray-600">Loading fund records...</p>
      ) : records.length === 0 ? (
        <p className="text-gray-600">No fund records found.</p>
      ) : (
        <>
          {/* Records Grid */}
          <div className="space-y-4 mb-6">
            {records.map((record) => (
              <div
                key={record._id}
                onClick={() => setSelectedRecord(record)}
                className="bg-white shadow-md hover:shadow-xl rounded-lg p-4 md:p-5 cursor-pointer transition-all duration-200 border border-gray-200 hover:border-[#62DC87]"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Image */}
                  <div className="flex-shrink-0">
                    {record.imageUrl ? (
                      <img
                        src={record.imageUrl}
                        alt="Fund"
                        className="w-full sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No Image</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                      <h3 className="font-bold text-lg text-gray-800">{record.source}</h3>
                      <span className="text-sm text-gray-500 sm:text-right">
                        {new Date(record.date).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {record.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase text-gray-500 font-medium">Amount</span>
                      <span className="font-bold text-xl text-green-700">
                        ₱{record.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total Card */}
          <div className="bg-gradient-to-r from-[#62DC87] to-[#4FC76F] rounded-lg shadow-lg p-5 md:p-6">
            <div className="flex items-center justify-between">
              <span className="text-white font-bold text-lg md:text-xl">TOTAL FUNDS:</span>
              <span className="text-white font-extrabold text-2xl md:text-3xl">
                ₱{total.toLocaleString()}
              </span>
            </div>
          </div>
        </>
      )}

      {/* MODAL */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative">
            <h2 className="text-xl font-bold mb-4 border-b pb-2 text-gray-800">
              {selectedRecord.source}
            </h2>

            {/* IMAGE DISPLAY */}
            {selectedRecord.imageUrl && (
              <img
                src={selectedRecord.imageUrl}
                alt="Fund"
                className="w-full h-48 object-cover rounded-md mb-4"
              />
            )}

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