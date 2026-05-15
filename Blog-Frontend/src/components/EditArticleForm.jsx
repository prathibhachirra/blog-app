import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

import {
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
} from "../styles/common";

function EditArticle() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [article, setArticle] = useState(location.state || null);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Load article
  useEffect(() => {
    const loadArticle = async () => {
      try {
        if (article) {
          setValue("title", article.title);
          setValue("category", article.category);
          setValue("content", article.content);
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `https://capstone-project-blog-app-46tv.onrender.com/author-api/articles/${id}`,
          { withCredentials: true }
        );

        if (!res.data?.payload) {
          throw new Error("Invalid response from server");
        }

        const fetchedArticle = res.data.payload;

        setArticle(fetchedArticle);

        setValue("title", fetchedArticle.title);
        setValue("category", fetchedArticle.category);
        setValue("content", fetchedArticle.content);
      } catch (err) {
        console.error(err);
        toast.error("Could not load article");
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [article, id, setValue]);

  // Update article
  const updateArticle = async (data) => {
    try {
      if (!article && !id) {
        toast.error("Article not available");
        return;
      }

      const articleId = article?._id || id;

      const res = await axios.put(
        "https://capstone-project-blog-app-46tv.onrender.com/author-api/articles",
        { ...data, articleId },
        { withCredentials: true }
      );

      if (!res.data?.payload) {
        throw new Error("Update failed: no data returned");
      }

      const updatedArticle = res.data.payload;

      setArticle(updatedArticle);

      toast.success("Article updated successfully");

      navigate(`/article/${updatedArticle._id}`, {
        state: updatedArticle,
      });
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || err.message || "Update failed"
      );
    }
  };

  return (
    <div className={`${formCard} mt-10`}>
      <h2 className={formTitle}>Edit Article</h2>

      {loading ? (
        <p>Loading article...</p>
      ) : (
        <form onSubmit={handleSubmit(updateArticle)}>
          {/* Title */}
          <div className={formGroup}>
            <label className={labelClass}>Title</label>

            <input
              className={inputClass}
              {...register("title", { required: "Title required" })}
            />

            {errors.title && (
              <p className={errorClass}>{errors.title.message}</p>
            )}
          </div>

          {/* Category */}
          <div className={formGroup}>
            <label className={labelClass}>Category</label>

            <select
              className={inputClass}
              {...register("category", { required: "Category required" })}
            >
              <option value="">Select category</option>
              <option value="technology">Technology</option>
              <option value="programming">Programming</option>
              <option value="ai">AI</option>
              <option value="web-development">Web Development</option>
            </select>

            {errors.category && (
              <p className={errorClass}>{errors.category.message}</p>
            )}
          </div>

          {/* Content */}
          <div className={formGroup}>
            <label className={labelClass}>Content</label>

            <textarea
              rows="14"
              className={inputClass}
              {...register("content", { required: "Content required" })}
            />

            {errors.content && (
              <p className={errorClass}>{errors.content.message}</p>
            )}
          </div>

          <button className={submitBtn} disabled={loading || !article}>
            {loading ? "Loading..." : "Update Article"}
          </button>
        </form>
      )}
    </div>
  );
}

export default EditArticle;
