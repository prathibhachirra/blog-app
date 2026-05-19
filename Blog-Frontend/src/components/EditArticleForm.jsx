import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

function EditArticle() {

  const location = useLocation();

  const navigate = useNavigate();

  const { id } = useParams();

  const [article, setArticle] = useState(location.state || null);

  const [loading, setLoading] = useState(true);

  const BACKEND_URL = import.meta.env.VITE_API_URL;

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
          `${BACKEND_URL}/author-api/articles/by-id/${id}`,
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

  }, [BACKEND_URL, article, id, setValue]);

  // Update article
  const updateArticle = async (data) => {

    try {

      if (!article && !id) {

        toast.error("Article not available");

        return;
      }

      const articleId = article?._id || id;

      const res = await axios.put(
        `${BACKEND_URL}/author-api/articles`,
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

    <div className="min-h-screen bg-gray-100 flex justify-center items-center py-10 px-5">

      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-4xl">

        <h2 className="text-4xl font-extrabold text-blue-500 text-center mb-10">
          Edit Article
        </h2>

        {loading ? (

          <p className="text-center text-xl text-blue-500">
            Loading article...
          </p>

        ) : (

          <form onSubmit={handleSubmit(updateArticle)}>

            {/* Title */}
            <div className="mb-6">

              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Title
              </label>

              <input
                className="w-full border border-gray-300 rounded-2xl p-4 outline-none focus:border-blue-500"
                {...register("title", { required: "Title required" })}
              />

              {errors.title && (
                <p className="text-red-500 mt-2">
                  {errors.title.message}
                </p>
              )}

            </div>

            {/* Category */}
            <div className="mb-6">

              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Category
              </label>

              <select
                className="w-full border border-gray-300 rounded-2xl p-4 outline-none focus:border-blue-500"
                {...register("category", { required: "Category required" })}
              >

                <option value="">
                  Select category
                </option>

                <option value="technology">
                  Technology
                </option>

                <option value="programming">
                  Programming
                </option>

                <option value="ai">
                  AI
                </option>

                <option value="web-development">
                  Web Development
                </option>

              </select>

              {errors.category && (
                <p className="text-red-500 mt-2">
                  {errors.category.message}
                </p>
              )}

            </div>

            {/* Content */}
            <div className="mb-8">

              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Content
              </label>

              <textarea
                rows="14"
                className="w-full border border-gray-300 rounded-2xl p-4 outline-none focus:border-blue-500"
                {...register("content", { required: "Content required" })}
              />

              {errors.content && (
                <p className="text-red-500 mt-2">
                  {errors.content.message}
                </p>
              )}

            </div>

            <button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl transition duration-300"
              disabled={loading || !article}
            >
              {loading ? "Loading..." : "Update Article"}
            </button>

          </form>
        )}

      </div>

    </div>
  );
}

export default EditArticle;
