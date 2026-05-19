import { useAuth } from "../store/authStore";
import { useNavigate } from "react-router";
import axios from "axios";
import { useEffect, useState } from "react";

function UserProfile() {

  const currentUser = useAuth((state) => state.currentUser);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const [articles, setArticles] = useState([]);

  const BACKEND_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {

    const getArticles = async () => {

      setLoading(true);

      try {

        const res = await axios.get(
          `${BACKEND_URL}/user-api/articles`,
          { withCredentials: true }
        );

        setArticles(res.data.payload);

      } catch (err) {

        setError(err.response?.data?.error || "Something went wrong");

      } finally {

        setLoading(false);
      }
    };

    getArticles();

  }, [BACKEND_URL]);

  // convert UTC → IST
  const formatDateIST = (date) => {

    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const navigateToArticleByID = (articleObj) => {

    navigate(`/article/${articleObj._id}`, {
      state: articleObj,
    });
  };

  if (loading) {

    return (
      <p className="text-center text-2xl mt-20 text-blue-500">
        Loading articles...
      </p>
    );
  }

  return (

    <div className="min-h-screen bg-gray-100 py-10 px-5">

      {error && (
        <p className="text-center text-red-500 text-xl mb-6">
          {error}
        </p>
      )}

      {/* Top Section */}
      <div className="mx-auto mb-10 flex max-w-7xl flex-col justify-between gap-4 rounded-3xl bg-white p-6 shadow-lg sm:flex-row sm:items-center">

        <div className="flex min-w-0 items-center gap-4">

          <img
            src={currentUser?.ProfileImageUrl}
            className="w-16 h-16 rounded-full object-cover border-4 border-blue-500"
            alt=""
          />

          <div className="min-w-0">

            <p className="safe-text text-2xl font-bold text-gray-800">
              Welcome, {currentUser?.firstName}
            </p>

            <p className="safe-text text-gray-500">
              Explore the latest articles
            </p>

          </div>

        </div>

      </div>

      {/* Articles */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

        {articles.map((articleObj) => (

          <div
            className="flex min-w-0 flex-col overflow-hidden rounded-3xl bg-white p-6 shadow-xl transition duration-300 hover:scale-[1.02]"
            key={articleObj._id}
          >

            {/* Category */}
            <p className="safe-text text-blue-500 font-bold uppercase mb-3">
              {articleObj.category}
            </p>

            {/* Title */}
            <h2 className="safe-text text-2xl font-extrabold text-gray-800 mb-4">
              {articleObj.title}
            </h2>

            {/* Content */}
            <p className="safe-text text-gray-600 leading-7 mb-6">
              {articleObj.content.slice(0, 100)}...
            </p>

            {/* Date */}
            <p className="text-sm text-gray-400 mb-6">
              {formatDateIST(articleObj.createdAt)}
            </p>

            {/* Button */}
            <button
              className="mt-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-2xl transition duration-300"
              onClick={() => navigateToArticleByID(articleObj)}
            >
              Read Article →
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}

export default UserProfile;
