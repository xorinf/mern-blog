import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useAuth } from "../store/authStore";

import {
  articleCardClass,
  articleTitle,
  articleExcerpt,
  articleMeta,
  ghostBtn,
  loadingClass,
  errorClass,
  emptyStateClass,
  articleStatusActive,
  articleStatusDeleted,
  tagClass,
} from "../styles/common";

function AuthorArticles() {
  const navigate = useNavigate();
  const user = useAuth((state) => state.currentUser);

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const getAuthorArticles = async () => {
      setLoading(true);

      try {
        //read articles of current author
        const res = await axios.get("/author-api/articles", { withCredentials: true });
        //update articles state
        setArticles(res.data.payload);
      } catch (err) {
        console.log(err);
        setError(err.response?.data?.message || "Failed to fetch articles");
      } finally {
        setLoading(false);
      }
    };

    getAuthorArticles();
  }, [user]);

  const openArticle = (article) => {
    navigate(`/article/${article._id}`, {
      state: article,
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
    });
  };

  if (loading) return <p className={loadingClass}>Loading articles...</p>;
  if (error) return <p className={errorClass}>{error}</p>;

  if (articles.length === 0) {
    return <div className={emptyStateClass}>You haven't published any articles yet.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {articles.map((article) => (
        <div key={article._id} className="bg-[#f5f5f7] rounded-2xl overflow-hidden hover:bg-[#ebebf0] transition-colors duration-200 flex flex-col cursor-pointer relative" onClick={() => openArticle(article)}>
          {article.imageUrl && (
            <div className="w-full h-40 bg-gray-200 overflow-hidden">
              <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
            </div>
          )}
          
          <div className="p-7 flex flex-col gap-2 flex-1">
            {/* Status Badge */}
            <span className={article.isArticleActive ? articleStatusActive : articleStatusDeleted}>
              {article.isArticleActive ? "ACTIVE" : "DELETED"}
            </span>

            <p className={tagClass}>{article.category}</p>

            <p className={articleTitle}>{article.title}</p>

            <p className={articleExcerpt}>{article.content?.slice(0, 60)}...</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AuthorArticles;