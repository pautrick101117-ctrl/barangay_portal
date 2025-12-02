import { useState, useEffect } from "react";
import axios from "axios";

type NewsArticle = {
  _id: string;
  title: string;
  date: string;
  imageUrl?: string | null;
  description: string;
};

const News = () => {
  const [newsList, setNewsList] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/admin/news");
        setNewsList(res.data);
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Failed to load news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="p-6 md:p-12 bg-gray-50 min-h-screen">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800">
        LATEST NEWS
      </h1>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      ) : error ? (
        <p className="text-red-600 text-center">{error}</p>
      ) : newsList.length === 0 ? (
        <p className="text-gray-600 text-center">No news articles found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsList.map((news) => (
            <div
              key={news._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition cursor-pointer overflow-hidden transform hover:-translate-y-1 hover:scale-105"
              onClick={() => setSelectedNews(news)}
            >
              <img
                src={news.imageUrl || "/sampleNewsPic.png"}
                alt={news.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/sampleNewsPic.png";
                }}
              />
              <div className="p-4">
                <h2 className="text-lg md:text-xl font-semibold mb-1 text-gray-800">
                  {news.title}
                </h2>
                <p className="text-sm text-gray-500">
                  {new Date(news.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {selectedNews && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative animate-fadeIn p-6">
            <button
              onClick={() => setSelectedNews(null)}
              className="absolute -top-4 -right-4 bg-white text-red-500 hover:bg-red-500 hover:text-white font-bold text-2xl rounded-full w-10 h-10 shadow-lg flex items-center justify-center transition"
              aria-label="Close"
            >
              ✕
            </button>
            <img
              src={selectedNews.imageUrl || "/sampleNewsPic.png"}
              alt={selectedNews.title}
              className="w-full h-56 object-cover rounded-xl mb-4"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/sampleNewsPic.png";
              }}
            />
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">
              {selectedNews.title}
            </h2>
            <p className="text-sm text-gray-500 mb-3">
              {new Date(selectedNews.date).toLocaleDateString()}
            </p>
            <p className="text-gray-700 leading-relaxed">{selectedNews.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;
