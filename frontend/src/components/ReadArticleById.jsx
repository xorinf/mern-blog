import { useParams, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../store/authStore";
import {
  articlePageWrapper,
  articleHeader,
  articleCategory,
  articleMainTitle,
  articleAuthorRow,
  authorInfo,
  articleContent,
  articleFooter,
  articleActions,
  editBtn,
  deleteBtn,
  loadingClass,
  errorClass,
  inputClass,
  submitBtn,
  commentsWrapper,
  commentCard,
  commentHeader,
  commentUserRow,
  avatar,
  commentUser,
  commentTime,
  commentText,
} from "../styles/common.js";
import { useForm } from "react-hook-form";

function ReadArticleById() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();

  const user = useAuth((state) => state.currentUser);

  const [article, setArticle] = useState(location.state || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (article) return;

    const getArticle = async () => {
      setLoading(true);

      try {
        const res = await axios.get(`/user-api/article/${id}`, { withCredentials: true });
        setArticle(res.data.payload);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load article");
      } finally {
        setLoading(false);
      }
    };

    getArticle();
  }, [id]);

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // delete & restore article (author only)
  const toggleArticleStatus = async () => {
    const newStatus = !article.isArticleActive;
    const confirmMsg = newStatus ? "Restore this article?" : "Delete this article?";
    if (!window.confirm(confirmMsg)) return;

    try {
      if (newStatus) {
        // restore
        const res = await axios.patch(
          `/author-api/article/restore/${id}`,
          {},
          { withCredentials: true }
        );
        setArticle(res.data.payload);
      } else {
        // soft delete via PUT (set isArticleActive to false)
        const res = await axios.put(
          `/author-api/article`,
          { ...article, isArticleActive: false },
          { withCredentials: true }
        );
        setArticle(res.data.payload);
      }
    } catch (err) {
      console.log("ERROR:", err.response);
      setError(err.response?.data?.message || "Operation failed");
    }
  };

  //edit article
  const editArticle = (articleObj) => {
    navigate("/edit-article", { state: articleObj });
  };

  //post comment by user
  const addComment = async (commentObj) => {
    try {
      commentObj.article_id = article._id;
      const res = await axios.put("/user-api/comment", commentObj, { withCredentials: true });
      if (res.status === 201) {
        setArticle(res.data.payload);
        reset();
      }
    } catch (err) {
      console.log("Comment error:", err);
      setError(err.response?.data?.message || "Failed to add comment");
    }
  };

  if (loading) return <p className={loadingClass}>Loading article...</p>;
  if (error) return <p className={errorClass}>{error}</p>;
  if (!article) return null;

  return (
    <div className={articlePageWrapper}>
      {/* Header */}
      <div className={articleHeader}>
        <span className={articleCategory}>{article.category}</span>

        <h1 className={`${articleMainTitle} uppercase`}>{article.title}</h1>

        <div className={articleAuthorRow}>
          <div className={authorInfo}>✍️ {article.author?.firstName || "Author"}</div>

          <div>{formatDate(article.createdAt)}</div>
        </div>
      </div>

      {article.imageUrl && (
        <div className="w-full mb-8 rounded-2xl overflow-hidden aspect-[16/9] bg-gray-100">
          <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Content */}
      <div className={articleContent}>{article.content}</div>

      {/* AUTHOR actions */}
      {user?.role === "AUTHOR" && (
        <div className={articleActions}>
          <button className={editBtn} onClick={() => editArticle(article)}>
            Edit
          </button>

          <button className={deleteBtn} onClick={toggleArticleStatus}>
            {article.isArticleActive ? "Delete" : "Restore"}
          </button>
        </div>
      )}

      {/* USER comment form */}
      {user?.role === "USER" && (
        <div className="mt-8">
          <form onSubmit={handleSubmit(addComment)} className="flex gap-3">
            <input
              type="text"
              {...register("comment", { required: true })}
              className={`${inputClass} flex-1`}
              placeholder="Write your comment here..."
            />
            <button type="submit" className={submitBtn + " w-auto px-6"}>
              Add Comment
            </button>
          </form>
        </div>
      )}

      {/* Comments */}
      <div className={commentsWrapper}>
        <h3 className="text-lg font-semibold text-[#1d1d1f]">
          Comments ({article.comments?.length || 0})
        </h3>

        {article.comments?.length === 0 && (
          <p className="text-[#a1a1a6] text-sm text-center">No comments yet</p>
        )}

        {article.comments?.map((commentObj, index) => {
          const name =
            commentObj.user?.firstName
              ? `${commentObj.user.firstName} ${commentObj.user.lastName || ""}`
              : commentObj.user?.email || "User";
          const firstLetter = name.charAt(0).toUpperCase();

          return (
            <div key={index} className={commentCard}>
              {/* Header */}
              <div className={commentHeader}>
                <div className={commentUserRow}>
                  <div className={avatar}>{firstLetter}</div>

                  <div>
                    <p className={commentUser}>{name}</p>
                    <p className={commentTime}>{formatDate(commentObj.createdAt || new Date())}</p>
                  </div>
                </div>
              </div>

              {/* Comment */}
              <p className={commentText}>{commentObj.comment}</p>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className={articleFooter}>Last updated: {formatDate(article.updatedAt)}</div>
    </div>
  );
}

export default ReadArticleById;