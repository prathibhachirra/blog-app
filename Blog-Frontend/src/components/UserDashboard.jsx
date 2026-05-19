import { useAuth } from "../store/authStore";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useEffect, useState } from "react";

function UserProfile() {

  const logout = useAuth((state) => state.logout);

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

  }, []);

  // convert UTC → IST
  const formatDateIST = (date) => {

    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const onLogout = async () => {

    await logout();

    toast.success("Logged out successfully");

    navigate("/login");
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
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-10 bg-white shadow-lg rounded-3xl p-6">

        <div className="flex items-center gap-4">

          <img
            src={currentUser?.ProfileImageUrl}
            className="w-16 h-16 rounded-full object-cover border-4 border-blue-500"
            alt=""
          />

          <div>

            <p className="text-2xl font-bold text-gray-800">
              Welcome, {currentUser?.firstName}
            </p>

            <p className="text-gray-500">
              Explore the latest articles
            </p>

          </div>

        </div>

        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-2xl transition duration-300"
          onClick={onLogout}
        >
          Logout
        </button>

      </div>

      {/* Articles */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

        {articles.map((articleObj) => (

          <div
            className="bg-white rounded-3xl shadow-xl p-6 flex flex-col hover:scale-105 transition duration-300"
            key={articleObj._id}
          >

            {/* Category */}
            <p className="text-blue-500 font-bold uppercase mb-3">
              {articleObj.category}
            </p>

            {/* Title */}
            <h2 className="text-2xl font-extrabold text-gray-800 mb-4">
              {articleObj.title}
            </h2>

            {/* Content */}
            <p className="text-gray-600 leading-7 mb-6">
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