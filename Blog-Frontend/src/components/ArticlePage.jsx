import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "../store/authStore";
import axios from "axios";
import { toast } from "react-hot-toast";

function ArticlePage() {

  const { id } = useParams();

  const currentUser = useAuth((state) => state.currentUser);

  const navigate = useNavigate();

  const [article, setArticle] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const [comment, setComment] = useState("");

  const BACKEND_URL = import.meta.env.VITE_API_URL;

  // Fetch article
  useEffect(() => {

    const getArticle = async () => {

      setLoading(true);

      try {

        const res = await axios.get(
          `${BACKEND_URL}/author-api/articles/${id}`,
          { withCredentials: true }
        );

        setArticle(res.data.payload);

      } catch (err) {

        setError(err.response?.data?.message || err.response?.data?.error || "Failed to load article");

      } finally {

        setLoading(false);
      }
    };

    getArticle();

  }, [BACKEND_URL, id]);

  // Add Comment
  const addComment = async () => {

    try {

      if (!comment.trim()) {

        toast.error("Comment cannot be empty");

        return;
      }

      if (currentUser?.role !== "USER") {

        toast.error("Only users can add comments");

        return;
      }

      const res = await axios.put(
        `${BACKEND_URL}/user-api/articles`,
        {
          comment,
          articleId: id,
          user: currentUser?._id,
        },
        { withCredentials: true }
      );

      const updatedArticle = res.data.payload;

      setArticle(updatedArticle);

      setComment("");

      toast.success("Comment added");

    } catch (err) {

      console.error(err);

      toast.error(err.response?.data?.message || err.response?.data?.error || "Failed to add comment");
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

  const canComment = currentUser?.role === "USER";

  const getCommentUserName = (user) => {

    if (!user) return "User";

    const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");

    return fullName || user.email || "User";
  };

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

      setError(err.response?.data?.message || err.response?.data?.error || "Update failed");
    }
  };

  return (

    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-5">

      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-white p-5 shadow-xl sm:p-8 lg:p-10">

        {/* Top buttons */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-5 py-2 rounded-full font-semibold hover:bg-blue-600 transition duration-300"
          >
            Back
          </button>

          {canEdit && (

            <div className="flex flex-wrap gap-3">

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
        <div className="overflow-hidden rounded-2xl border bg-gray-50 p-5 shadow-md sm:p-8 lg:p-10">

          <p className="mb-3 break-words text-sm font-bold uppercase text-blue-500">
            {article.category}
          </p>

          <h1 className="mb-6 break-words text-3xl font-extrabold leading-tight text-gray-800 sm:text-4xl lg:text-5xl">
            {article.title}
          </h1>

          <p className="whitespace-pre-wrap break-words text-base leading-8 text-gray-700 sm:text-lg sm:leading-10">
            {article.content}
          </p>

        </div>

        {/* Comment Input */}
        {canComment && (
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">

          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a Comment"
            className="w-full rounded-2xl border bg-white px-5 py-3 outline-none"
          />

          <button
            className="rounded-2xl bg-blue-500 px-6 py-3 font-bold text-white transition duration-300 hover:bg-blue-600"
            onClick={addComment}
          >
            Add
          </button>

        </div>
        )}

        {/* Comments */}
        <div className="mt-12">

          <h3 className="text-3xl font-bold text-gray-800 mb-6">
            Comments
          </h3>

          {article.comments && article.comments.length > 0 ? (

            article.comments.map((cmt, index) => (

              <div
                key={index}
                className="mb-4 overflow-hidden rounded-2xl border bg-white p-5 shadow-sm"
              >

                <p className="mb-2 break-words font-bold uppercase text-blue-500">
                  {getCommentUserName(cmt.user)}
                </p>

                <p className="break-words text-gray-700">
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
