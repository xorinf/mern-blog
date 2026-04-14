import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router";
import {
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
  loadingClass,
} from "../styles/common";

function EditArticle() {
  const navigate = useNavigate();
  const location = useLocation();
  const article = location.state;

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: article?.title || "",
      category: article?.category || "",
      content: article?.content || "",
    },
  });

  const updateArticle = async (articleObj) => {
    setLoading(true);
    setApiError(null);

    const formData = new FormData();
    formData.append("_id", article._id);
    formData.append("title", articleObj.title);
    formData.append("category", articleObj.category);
    formData.append("content", articleObj.content);
    formData.append("author", article.author?._id || article.author);
    formData.append("isArticleActive", article.isArticleActive);

    if (articleObj.image?.[0]) {
      formData.append("image", articleObj.image[0]);
    }

    try {
      const res = await axios.put("/author-api/article", formData, { withCredentials: true });
      navigate(`/article/${article._id}`, { state: res.data.payload });
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to update article");
    } finally {
      setLoading(false);
    }
  };

  if (!article) {
    return (
      <div className="text-center text-[#a1a1a6] py-16">
        No article data found. Please select an article to edit.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      <div className={formCard}>
        <h2 className={formTitle}>Edit Article</h2>

        {apiError && <p className={errorClass}>{apiError}</p>}

        <form onSubmit={handleSubmit(updateArticle)}>
          {/* Title */}
          <div className={formGroup}>
            <label className={labelClass}>Title</label>
            <input
              type="text"
              className={inputClass}
              {...register("title", {
                required: "Title is required",
                minLength: { value: 5, message: "Title must be at least 5 characters" },
              })}
            />
            {errors.title && <p className={errorClass}>{errors.title.message}</p>}
          </div>

          {/* Category */}
          <div className={formGroup}>
            <label className={labelClass}>Category</label>
            <select
              className={inputClass}
              {...register("category", { required: "Category is required" })}
            >
              <option value="">Select category</option>
              <option value="FICTION">Fiction</option>
              <option value="FANTASY">Fantasy</option>
              <option value="BIO">Biography</option>
              <option value="THRILLER">Thriller</option>
              <option value="EDU">Education</option>
              <option value="HORROR">Horror</option>
              <option value="SMUT">Smut</option>
            </select>
            {errors.category && <p className={errorClass}>{errors.category.message}</p>}
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Update Banner Image (Optional)</label>
            <input
              type="file"
              className={inputClass}
              accept="image/png, image/jpeg"
              {...register("image", {
                validate: {
                  fileSize: (files) => {
                    if (!files?.[0]) return true;
                    return files[0].size <= 2 * 1024 * 1024 || "Max size 2MB";
                  },
                },
              })}
            />
            {errors.image && <p className={errorClass}>{errors.image.message}</p>}
          </div>

          {/* Content */}
          <div className={formGroup}>
            <label className={labelClass}>Content</label>
            <textarea
              rows="8"
              className={inputClass}
              {...register("content", {
                required: "Content is required",
                minLength: { value: 50, message: "Content must be at least 50 characters" },
              })}
            />
            {errors.content && <p className={errorClass}>{errors.content.message}</p>}
          </div>

          {/* Submit */}
          <button className={submitBtn} type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Article"}
          </button>

          {loading && <p className={loadingClass}>Updating article...</p>}
        </form>
      </div>
    </div>
  );
}

export default EditArticle;