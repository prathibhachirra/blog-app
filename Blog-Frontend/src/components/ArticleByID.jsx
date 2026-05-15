import { useParams, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from "../store/authStore";
import { toast } from "react-hot-toast";

function ArticleByID() {

  const { id } = useParams();

  const location = useLocation();

  const navigate = useNavigate();

  const { register, handleSubmit } = useForm();

  const user = useAuth((state) => state.currentUser);

  const [article, setArticle] = useState(location.state || null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  useEffect(() => {

    if (article) return;

    const getArticle = async () => {

      setLoading(true);

      try {

        const res = await axios.get(
          `https://capstone-project-blog-app-46tv.onrender.com/user-api/article/${id}`,
          { withCredentials: true }
        );

        setArticle(res.data.payload);

      } catch (err) {

        setError(err.response?.data?.error);

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

  // delete & restore article
  const toggleArticleStatus = async () => {

    const newStatus = !article.isArticleActive;

    const confirmMsg = newStatus
      ? "Restore this article?"
      : "Delete this article?";

    if (!window.confirm(confirmMsg)) return;

    try {

      const res = await axios.patch(
        `https://capstone-project-blog-app-46tv.onrender.com/author-api/articles/${id}/status`,
        { isArticleActive: newStatus },
        { withCredentials: true }
      );

      setArticle(res.data.payload);

      toast.success(res.data.message);

    } catch (err) {

      const msg = err.response?.data?.message;

      if (err.response?.status === 400) {
        toast(msg);
      } else {
        setError(msg || "Operation failed");
      }
    }
  };

  // edit article
  const editArticle = (articleObj) => {
    navigate("/edit-article", { state: articleObj });
  };

  // add comment
  const addComment = async (commentObj) => {

    commentObj.articleId = article._id;

    let res = await axios.post(
      "https://capstone-project-blog-app-46tv.onrender.com/user-api/articles",
      commentObj,
      { withCredentials: true }
    );

    if (res.status === 200) {

      toast.success(res.data.message);

      setArticle(res.data.payload);
    }
  };

  // loading
  if (loading) {
    return (
      <p className="text-center text-2xl mt-20 text-blue-500">
        Loading article...
      </p>
    );
  }

  // error
  if (error) {
    return (
      <p className="text-center text-2xl mt-20 text-red-500">
        {error}
      </p>
    );
  }

  if (!article) return null;

  return (

    <div className="min-h-screen bg-white py-10 px-5">

      <div className="max-w-4xl mx-auto bg-blue-400 rounded-3xl shadow-2xl p-10">

        {/* Header */}
        <div className="mb-10">

          <span className="bg-white text-blue-500 px-4 py-2 rounded-full font-semibold text-sm">
            {article.category}
          </span>

          <h1 className="text-5xl font-extrabold text-white mt-6 uppercase leading-tight">
            {article.title}
          </h1>

          <div className="flex justify-between items-center mt-6 text-white">

            <div className="font-semibold">
              ✍️ {article.author?.firstName || "Author"}
            </div>

            <div>
              {formatDate(article.createdAt)}
            </div>

          </div>

        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl p-8 text-gray-700 text-lg leading-9 shadow-lg">

          {article.content}

        </div>

        {/* AUTHOR actions */}
        {user?.role === "AUTHOR" && (

          <div className="flex gap-5 mt-8">

            <button
              className="bg-white text-blue-500 font-bold px-6 py-3 rounded-full hover:bg-gray-100 transition duration-300"
              onClick={() => editArticle(article)}
            >
              Edit
            </button>

            <button
              className="bg-red-500 text-white font-bold px-6 py-3 rounded-full hover:bg-red-600 transition duration-300"
              onClick={toggleArticleStatus}
            >
              {article.isArticleActive ? "Delete" : "Restore"}
            </button>

          </div>
        )}

        {/* USER comment section */}
        {user?.role === "USER" && (

          <div className="mt-10">

            <form onSubmit={handleSubmit(addComment)}>

              <input
                type="text"
                {...register("comment")}
                placeholder="Write your comment here..."
                className="w-full bg-white p-4 rounded-2xl outline-none"
              />

              <button
                type="submit"
                className="bg-white text-blue-500 font-bold px-6 py-3 rounded-full mt-5 hover:bg-gray-100 transition duration-300"
              >
                Add Comment
              </button>

            </form>

          </div>
        )}

        {/* Comments */}
        <div className="mt-10">

          <h2 className="text-3xl font-bold text-white mb-6">
            Comments
          </h2>

          {article.comments.map((comment, index) => (

            <div
              key={index}
              className="bg-white p-6 rounded-2xl mb-5 shadow-md"
            >

              <p className="uppercase text-blue-500 font-bold mb-3">
                {comment.user?.email}
              </p>

              <p className="text-gray-700">
                {comment.comment}
              </p>

            </div>
          ))}

        </div>

        {/* Footer */}
        <div className="text-right text-white mt-10 text-sm">
          Last updated: {formatDate(article.updatedAt)}
        </div>

      </div>

    </div>
  );
}

export default ArticleByID;