import { useEffect, useState } from "react";
import axios from "axios";
import {
  loadingClass,
  errorClass,
  emptyStateClass,
  headingClass,
} from "../styles/common";

function AdminArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/admin-api/articles", { withCredentials: true });
        setArticles(res.data.payload);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch articles");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const toggleStatus = async (articleId) => {
    try {
      const res = await axios.patch(`/admin-api/articles/status/${articleId}`, {}, { withCredentials: true });
      // update local state
      setArticles((prev) =>
        prev.map((a) => (a._id === articleId ? { ...a, isArticleActive: res.data.payload.isArticleActive } : a))
      );
    } catch (err) {
      console.log("Toggle error:", err);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
    });
  };

  if (loading) return <p className={loadingClass}>Loading articles...</p>;
  if (error) return <p className={errorClass}>{error}</p>;
  if (articles.length === 0) return <div className={emptyStateClass}>No articles found.</div>;

  return (
    <div>
      <h2 className={`${headingClass} mb-6`}>All Articles</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e8e8ed] text-left text-[#6e6e73]">
              <th className="py-3 px-4 font-medium">Title</th>
              <th className="py-3 px-4 font-medium">Author</th>
              <th className="py-3 px-4 font-medium">Date</th>
              <th className="py-3 px-4 font-medium">Status</th>
              <th className="py-3 px-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article._id} className="border-b border-[#f5f5f7] hover:bg-[#f5f5f7] transition">
                <td className="py-3 px-4 text-[#1d1d1f] font-medium max-w-[250px] truncate">
                  {article.title}
                </td>
                <td className="py-3 px-4 text-[#6e6e73]">
                  {article.author?.firstName} {article.author?.lastName || ""}
                </td>
                <td className="py-3 px-4 text-[#6e6e73] whitespace-nowrap">
                  {formatDate(article.createdAt)}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      article.isArticleActive
                        ? "bg-[#34c759]/20 text-[#248a3d]"
                        : "bg-[#ff3b30]/20 text-[#cc2f26]"
                    }`}
                  >
                    {article.isArticleActive ? "Active" : "Blocked"}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => toggleStatus(article._id)}
                    className={`text-xs font-medium px-4 py-1.5 rounded-full transition ${
                      article.isArticleActive
                        ? "bg-[#ff3b30] text-white hover:bg-[#d62c23]"
                        : "bg-[#34c759] text-white hover:bg-[#248a3d]"
                    }`}
                  >
                    {article.isArticleActive ? "Block" : "Restore"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminArticles;
