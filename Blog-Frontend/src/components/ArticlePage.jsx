import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { useAuth } from "../store/authStore";
import axios from "axios";
import { toast } from "react-hot-toast";

function ArticlePage() {

  const { id } = useParams();

  const currentUser = useAuth((state) => state.currentUser);

  const location = useLocation();

  const navigate = useNavigate();

  const [article, setArticle] = useState(location.state || null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const [comment, setComment] = useState("");

  const BACKEND_URL = import.meta.env.VITE_API_URL;

  // Fetch article
  useEffect(() => {

    if (article) return;

    const getArticle = async () => {

      setLoading(true);

      try {

        const res = await axios.get(
          `${BACKEND_URL}/author-api/articles/${id}`,
          { withCredentials: true }
        );

        setArticle(res.data.payload);

      } catch (err) {

        setError(err.response?.data?.error || "Failed to load article");

      } finally {

        setLoading(false);
      }
    };

    getArticle();

  }, [id, article]);

  // Add Comment
  const addComment = async () => {

    try {

      if (!comment.trim()) {

        toast.error("Comment cannot be empty");

        return;
      }

      const res = await axios.post(
        `${BACKEND_URL}/author-api/articles/${id}/comments`,
        {
          comment,
          userId: currentUser?._id,
        },
        { withCredentials: true }
      );

      const updatedArticle = res.data.payload || {
        ...article,
        comments: [
          ...(article.comments || []),
          {
            comment,
            user: currentUser,
          },
        ],
      };

      setArticle(updatedArticle);

      setComment("");

      toast.success("Comment added");

    } catch (err) {

      console.error(err);

      toast.error(err.response?.data?.error || "Failed to add comment");
    }
  };

  if (loading) {

    return (
      <p className="text-center text-2xl mt-20 text-blue-500">
        Loading article...
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

  if (!article) {

    return (
      <p className="text-center text-2xl mt-20 text-red-500">
        Article not found.
      </p>
    );
  }

  const canEdit =
    currentUser &&
    article.author &&
    (
      article.author === currentUser._id ||
      article.author._id === currentUser._id
    );

  const toggleArticleActive = async (newStatus) => {

    try {

      await axios.patch(
        `${BACKEND_URL}/author-api/articles/${id}/status`,
        { isArticleActive: newStatus },
        { withCredentials: true }
      );

      setArticle((prev) => ({
        ...prev,
        isArticleActive: newStatus
      }));

    } catch (err) {

      setError(err.response?.data?.error || "Update failed");
    }
  };

  return (

    <div className="min-h-screen bg-gray-100 py-10 px-5">

      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-10">

        {/* Top buttons */}
        <div className="mb-8 flex items-center justify-between gap-3">

          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-5 py-2 rounded-full font-semibold hover:bg-blue-600 transition duration-300"
          >
            ← Back
          </button>

          {canEdit && (

            <div className="flex gap-3">

              <button
                onClick={() =>
                  navigate(`/article/${id}/edit`, { state: article })
                }
                className="bg-yellow-400 text-white px-5 py-2 rounded-full font-semibold hover:bg-yellow-500 transition duration-300"
              >
                Edit
              </button>

              <button
                onClick={() =>
                  toggleArticleActive(!article.isArticleActive)
                }
                className={`px-5 py-2 rounded-full font-semibold text-white transition duration-300 ${
                  article.isArticleActive
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {article.isArticleActive ? "Delete" : "Restore"}
              </button>

            </div>
          )}

        </div>

        {/* Article Content */}
        <div className="bg-gray-50 rounded-3xl p-10 shadow-md border">

          <p className="text-blue-500 font-bold uppercase mb-3">
            {article.category}
          </p>

          <h1 className="text-5xl font-extrabold text-gray-800 mb-6 leading-tight">
            {article.title}
          </h1>

          <p className="text-gray-700 leading-10 whitespace-pre-wrap text-lg">
            {article.content}
          </p>

        </div>

        {/* Comment Input */}
        <div className="mt-10 flex gap-3">

          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a Comment"
            className="bg-white border rounded-2xl px-5 py-3 w-full outline-none"
          />

          <button
            className="bg-blue-500 text-white font-bold px-6 py-3 rounded-2xl hover:bg-blue-600 transition duration-300"
            onClick={addComment}
          >
            Add
          </button>

        </div>

        {/* Comments */}
        <div className="mt-12">

          <h3 className="text-3xl font-bold text-gray-800 mb-6">
            Comments
          </h3>

          {article.comments && article.comments.length > 0 ? (

            article.comments.map((cmt, index) => (

              <div
                key={index}
                className="bg-white border p-5 rounded-2xl mb-4 shadow-sm"
              >

                <p className="text-blue-500 font-bold mb-2 uppercase">
                  {cmt.user?.username || "User"}
                </p>

                <p className="text-gray-700">
                  {cmt.comment}
                </p>

              </div>
            ))

          ) : (

            <p className="text-gray-500 text-lg">
              No comments yet
            </p>
          )}

        </div>

      </div>

    </div>
  );
}

export default ArticlePage;