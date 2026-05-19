import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";

function AddArticle() {

  const { register, handleSubmit, formState:{errors} } = useForm();

  const navigate = useNavigate();

  const BACKEND_URL = import.meta.env.VITE_API_URL;

  const onAddArticle = async (data) => {

    try {

      const res = await axios.post(
        `${BACKEND_URL}/author-api/articles`,
        data,
        { withCredentials: true }
      );

      toast.success("Article published successfully!");

      navigate("/author-dashboard");

    } catch (err) {

      toast.error("Failed to publish article");

      console.error(err);
    }
  };

  return (

    <div className="min-h-screen bg-gray-100 flex justify-center items-center py-10 px-5">

      <form
        onSubmit={handleSubmit(onAddArticle)}
        className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-3xl"
      >

        <h1 className="text-4xl font-extrabold text-blue-500 text-center mb-10">
          Add Article
        </h1>

        {/* Title */}
        <div className="mb-6">

          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Title
          </label>

          <input
            type="text"
            placeholder="Enter article title"
            className="w-full border border-gray-300 rounded-2xl p-4 outline-none focus:border-blue-500"
            {...register("title",{required:true})}
          />

          {errors.title && (
            <p className="text-red-500 mt-2">
              Title required
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
            {...register("category",{required:true})}
          >

            <option value="">
              Select Category
            </option>

            <option value="technology">
              Technology
            </option>

            <option value="education">
              Education
            </option>

            <option value="sports">
              Sports
            </option>

          </select>

          {errors.category && (
            <p className="text-red-500 mt-2">
              Category required
            </p>
          )}

        </div>

        {/* Content */}
        <div className="mb-8">

          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Content
          </label>

          <textarea
            placeholder="Write your article content..."
            className="w-full border border-gray-300 rounded-2xl p-4 outline-none focus:border-blue-500"
            rows="10"
            {...register("content",{required:true})}
          ></textarea>

          {errors.content && (
            <p className="text-red-500 mt-2">
              Content required
            </p>
          )}

        </div>

        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl transition duration-300">
          Publish Article
        </button>

      </form>

    </div>
  );
}

export default AddArticle;