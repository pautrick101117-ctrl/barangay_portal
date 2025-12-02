import { useState, useEffect, type FormEvent } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface Suggestion {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
}

interface DecodedToken {
  id: string;
  username: string;
  exp: number;
}

interface SubmissionStatus {
  allowed: boolean;
  message?: string;
  hasSubmitted: boolean;
  canSubmit: boolean;
  canUpdate: boolean;
  currentDate: string;
  nextSubmissionWindow: string;
  testingMode?: boolean; // Added
}

const ProjectSuggestion: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus | null>(null);
  const [userSuggestion, setUserSuggestion] = useState<Suggestion | null>(null);

  const API_URL = "http://localhost:3000/api/admin/project-suggestions";

  const getCurrentUserId = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;

      const decoded = jwtDecode<DecodedToken>(token);
      const now = Date.now() / 1000;
      if (decoded.exp < now) {
        localStorage.removeItem("token");
        return null;
      }

      return decoded.id;
    } catch (error) {
      console.error("Error decoding token:", error);
      localStorage.removeItem("token");
      return null;
    }
  };

  const getAxiosInstance = () => {
    const userId = getCurrentUserId();
    return axios.create({
      headers: userId ? { "x-user-id": userId } : {},
    });
  };

  const fetchSuggestions = async () => {
    try {
      const res = await axios.get<Suggestion[]>(API_URL);
      setSuggestions(res.data);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  };

  const fetchSubmissionStatus = async () => {
    try {
      const axiosInstance = getAxiosInstance();
      const res = await axiosInstance.get<SubmissionStatus>(`${API_URL}/status`);
      console.log("📊 Submission Status:", res.data); // Debug log
      setSubmissionStatus(res.data);
    } catch (err) {
      console.error("Error fetching submission status:", err);
    }
  };

  const fetchUserSuggestion = async () => {
    try {
      const axiosInstance = getAxiosInstance();
      const res = await axiosInstance.get(`${API_URL}/my-suggestion`);
      if (res.data.suggestion) {
        setUserSuggestion(res.data.suggestion);
        setTitle(res.data.suggestion.title);
        setDescription(res.data.suggestion.description);
      }
    } catch (err) {
      console.error("Error fetching user suggestion:", err);
    }
  };

  const checkAuth = () => {
    const userId = getCurrentUserId();
    setIsAuthenticated(!!userId);
    return !!userId;
  };

  useEffect(() => {
    fetchSuggestions();
    fetchSubmissionStatus();
    
    if (checkAuth()) {
      fetchUserSuggestion();
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title || !description) {
      return alert("Please fill in all fields.");
    }

    const userId = getCurrentUserId();
    if (!userId) {
      return alert("Please log in to submit a suggestion.");
    }

    if (!submissionStatus?.canSubmit && !submissionStatus?.canUpdate) {
      return alert(submissionStatus?.message || "Submission window is closed.");
    }

    setLoading(true);
    try {
      const axiosInstance = getAxiosInstance();
      
      if (userSuggestion) {
        // Update existing suggestion
        await axiosInstance.put(API_URL, { title, description });
        alert("Suggestion updated successfully! 🎉");
      } else {
        // Create new suggestion
        await axiosInstance.post(API_URL, { title, description });
        alert("Suggestion submitted successfully! 🎉");
      }
      
      await fetchUserSuggestion();
      await fetchSuggestions();
      await fetchSubmissionStatus();
    } catch (err: any) {
      console.error("Error submitting suggestion:", err);
      alert(err.response?.data?.message || "Failed to submit suggestion.");
    } finally {
      setLoading(false);
    }
  };

  // Use backend's submission status instead of calculating on frontend
  const formatTimeWindow = () => {
    if (!submissionStatus) {
      return "⏳ Loading status...";
    }

    // Show testing mode indicator
    if (submissionStatus.testingMode) {
      if (submissionStatus.canSubmit || submissionStatus.canUpdate) {
        return "🟢 Submission window is OPEN (Testing Mode)";
      } else {
        return "🔴 Submission window is CLOSED (Testing Mode)";
      }
    }

    // Production mode
    if (submissionStatus.canSubmit || submissionStatus.canUpdate) {
      return "🟢 Submission window is OPEN";
    } else if (submissionStatus.allowed === false && submissionStatus.message?.includes("9:00 AM")) {
      return "🟡 Today is submission day, but outside 9 AM - 5 PM window";
    } else {
      return "🔴 Submission window is CLOSED";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="font-extrabold text-3xl md:text-4xl mb-2 border-b-4 border-[#62DC87] inline-block">
            PROJECT SUGGESTION
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            📅 Submissions accepted on the 1st of each month, 9:00 AM - 5:00 PM
          </p>
          {submissionStatus?.testingMode && (
            <p className="text-xs text-orange-600 mt-1 font-semibold">
              🧪 TESTING MODE ACTIVE
            </p>
          )}
        </div>

        {/* Submission Status Banner */}
        {submissionStatus && (
          <div className={`mb-6 p-4 rounded-lg border-l-4 ${
            submissionStatus.canSubmit || submissionStatus.canUpdate
              ? 'bg-green-50 border-green-400'
              : 'bg-red-50 border-red-400'
          }`}>
            <p className="font-semibold text-sm">
              {formatTimeWindow()}
            </p>
            {submissionStatus.message && (
              <p className="text-sm mt-1 text-gray-700">{submissionStatus.message}</p>
            )}
            
            {/* Debug info (optional - remove in production) */}
            {submissionStatus.testingMode && (
              <div className="mt-2 text-xs text-gray-600 bg-white p-2 rounded">
                <p>🔍 Debug Info:</p>
                <p>• Can Submit: {submissionStatus.canSubmit ? '✅' : '❌'}</p>
                <p>• Can Update: {submissionStatus.canUpdate ? '✅' : '❌'}</p>
                <p>• Has Submitted: {submissionStatus.hasSubmitted ? '✅' : '❌'}</p>
              </div>
            )}
          </div>
        )}

        {/* Suggestion Form */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            💡 {userSuggestion ? 'Update Your Suggestion' : 'Submit Your Suggestion'}
          </h2>

          {!isAuthenticated ? (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
              <p className="text-blue-800 font-semibold mb-2">
                🔐 Please log in to submit a suggestion
              </p>
              <a
                href="/login"
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Go to Login
              </a>
            </div>
          ) : !submissionStatus?.canSubmit && !submissionStatus?.canUpdate ? (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <p className="text-yellow-800 font-semibold mb-2">
                ⏰ Submission window is currently closed
              </p>
              <p className="text-sm text-yellow-700">
                {submissionStatus?.message || 'Please check back on the 1st of the month between 9 AM and 5 PM'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {userSuggestion && (
                <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
                  ℹ️ You can update your suggestion during the submission window
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  placeholder="Enter your project title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#62DC87] focus:border-transparent"
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Describe your project idea in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 resize-none h-32 focus:outline-none focus:ring-2 focus:ring-[#62DC87] focus:border-transparent"
                  disabled={loading}
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#62DC87] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#4bb96b] transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading 
                    ? "Processing..." 
                    : userSuggestion 
                    ? "💾 UPDATE SUGGESTION" 
                    : "✨ SUBMIT SUGGESTION"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (userSuggestion) {
                      setTitle(userSuggestion.title);
                      setDescription(userSuggestion.description);
                    } else {
                      setTitle("");
                      setDescription("");
                    }
                  }}
                  className="flex-1 sm:flex-none bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all disabled:opacity-50"
                  disabled={loading}
                >
                  🔄 RESET
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Suggested Projects List */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            📋 Community Suggestions
          </h2>

          {suggestions.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-200">
              <p className="text-gray-600 italic">
                No suggestions yet. Be the first to submit!
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {suggestions.map((s) => (
                <div
                  key={s._id}
                  className="bg-white shadow-md rounded-xl p-5 hover:shadow-xl transition-all border-l-4 border-[#62DC87] hover:border-l-8"
                >
                  <h3 className="font-bold text-lg mb-2 text-gray-800">{s.title}</h3>
                  <p className="text-gray-600 mb-3 line-clamp-3 text-sm">{s.description}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-200">
                    <span>📅</span>
                    <span>{new Date(s.createdAt).toLocaleDateString()}</span>
                    {s.updatedAt && (
                      <span className="ml-auto text-blue-600">(Updated)</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectSuggestion;