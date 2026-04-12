import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import {
  pageWrapper,
  pageTitleClass,
  articleGrid,
  articleCardClass,
  articleTitle,
  articleExcerpt,
  articleMeta,
  ghostBtn,
  loadingClass,
  errorClass,
  emptyStateClass,
  tagClass,
} from "../styles/common";

function Articles() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getArticles = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/user-api/articles", { withCredentials: true });
        setArticles(res.data.payload);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch articles");
      } finally {
        setLoading(false);
      }
    };

    getArticles();
  }, []);

  const openArticle = (article) => {
    navigate(`/article/${article._id}`, { state: article });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
    });
  };

  if (loading) return <p className={loadingClass}>Loading articles...</p>;
  if (error) return <p className={errorClass}>{error}</p>;

  return (
    <div className={pageWrapper}>
      <h1 className={pageTitleClass}>Articles</h1>
      <p className="text-[#6e6e73] mb-8">Browse the latest published articles.</p>

      {articles.length === 0 ? (
        <div className={emptyStateClass}>No articles published yet.</div>
      ) : (
        <div className={articleGrid}>
          {articles.map((article) => (
            <div key={article._id} className={`${articleCardClass} flex flex-col`}>
              <div className="flex flex-col gap-2">
                <span className={tagClass}>{article.category}</span>
                <p className={articleTitle}>{article.title}</p>
                <p className={articleExcerpt}>{article.content?.slice(0, 80)}...</p>
                <p className={articleMeta}>
                  By {article.author?.firstName || "Author"} · {formatDate(article.createdAt)}
                </p>
              </div>
              <button className={`${ghostBtn} mt-auto pt-4`} onClick={() => openArticle(article)}>
                Read Article →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Articles;