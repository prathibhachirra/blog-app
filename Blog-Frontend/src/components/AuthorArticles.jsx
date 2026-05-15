import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useAuth } from "../store/authStore";

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

        const res = await axios.get(
          `https://capstone-project-blog-app-46tv.onrender.com/author-api/articles/${user._id}`,
          { withCredentials: true }
        );

        setArticles(res.data.payload);

      } catch (err) {

        console.log(err);

        setError(err.response?.data?.error || "Failed to fetch articles");

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

  const editArticle = (article) => {

    navigate(`/article/${article._id}/edit`, {
      state: article,
    });
  };

  const deleteArticle = async (articleId) => {

    if (!window.confirm("Delete this article?")) return;

    try {

      await axios.patch(
        `https://capstone-project-blog-app-46tv.onrender.com/author-api/articles/${articleId}/status`,
        { isArticleActive: false },
        { withCredentials: true }
      );

      setArticles((prev) =>
        prev.filter((article) => article._id !== articleId)
      );

    } catch (err) {

      console.error(err);

      setError(err.response?.data?.error || "Delete failed");
    }
  };

  if (loading) {

    return (
      <p className="text-center text-2xl mt-20 text-blue-500">
        Loading articles...
      </p>
    );
  }

  if (error) {

    return (
      <p className="text-center text-2xl mt-20 text-red-500">
        {error}
      </p>
    );
  }

  if (articles.length === 0) {

    return (
      <div className="text-center text-2xl text-blue-500 mt-20">
        You haven't published any articles yet.
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-white py-10 px-5">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

        {articles.map((article) => (

          <div
            key={article._id}
            className="bg-blue-400 rounded-3xl shadow-2xl p-6 flex flex-col"
          >

            {/* Status */}
            <span
              className={`self-start px-4 py-1 rounded-full text-sm font-bold mb-4 ${
                article.isArticleActive
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {article.isArticleActive ? "ACTIVE" : "DELETED"}
            </span>

            {/* Category */}
            <p className="text-white font-semibold mb-2 uppercase">
              {article.category}
            </p>

            {/* Title */}
            <h1 className="text-3xl font-bold text-white mb-4">
              {article.title}
            </h1>

            {/* Content */}
            <p className="text-white leading-7 mb-6">
              {article.content.slice(0, 100)}...
            </p>

            {/* Buttons */}
            <div className="mt-auto flex flex-col gap-3">

              <button
                className="bg-white text-blue-500 font-bold py-3 rounded-full hover:bg-gray-100 transition duration-300"
                onClick={() => openArticle(article)}
              >
                Read Article →
              </button>

              <button
                className="bg-yellow-400 text-white font-bold py-3 rounded-full hover:bg-yellow-500 transition duration-300"
                onClick={() => editArticle(article)}
              >
                Edit
              </button>

              <button
                className="bg-red-500 text-white font-bold py-3 rounded-full hover:bg-red-600 transition duration-300"
                onClick={() => deleteArticle(article._id)}
              >
                Delete
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default AuthorArticles;