import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
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
import { useAuth } from "../store/authStore";

function WriteArticle() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const currentUser = useAuth((state) => state.currentUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  //save article
  const submitArticle = async (articleObj) => {
    setLoading(true);
    setApiError(null);

    const formData = new FormData();
    formData.append("title", articleObj.title);
    formData.append("category", articleObj.category);
    formData.append("content", articleObj.content);
    formData.append("author", currentUser._id);

    if (articleObj.image?.[0]) {
      formData.append("image", articleObj.image[0]);
    }

    try {
      const res = await axios.post("/author-api/article", formData, { withCredentials: true });
      reset();
      navigate("/author-profile/articles");
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to publish article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={formCard}>
      <h2 className={formTitle}>Write New Article</h2>

      {apiError && <p className={errorClass}>{apiError}</p>}

      <form onSubmit={handleSubmit(submitArticle)}>
        {/* Title */}
        <div className={formGroup}>
          <label className={labelClass}>Title</label>

          <input
            type="text"
            className={inputClass}
            placeholder="Enter article title"
            {...register("title", {
              required: "Title is required",
              minLength: {
                value: 5,
                message: "Title must be at least 5 characters",
              },
            })}
          />

          {errors.title && <p className={errorClass}>{errors.title.message}</p>}
        </div>

        {/* Category */}
        <div className={formGroup}>
          <label className={labelClass}>Category</label>

          <select
            className={inputClass}
            {...register("category", {
              required: "Category is required",
            })}
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

        {/* Image Upload */}
        <div className={formGroup}>
          <label className={labelClass}>Article Banner Image (Optional)</label>
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
            placeholder="Write your article content..."
            {...register("content", {
              required: "Content is required",
              minLength: {
                value: 50,
                message: "Content must be at least 50 characters",
              },
            })}
          />

          {errors.content && <p className={errorClass}>{errors.content.message}</p>}
        </div>

        {/* Submit */}
        <button className={submitBtn} type="submit" disabled={loading}>
          {loading ? "Publishing..." : "Publish Article"}
        </button>

        {loading && <p className={loadingClass}>Publishing article...</p>}
      </form>
    </div>
  );
}

export default WriteArticle;