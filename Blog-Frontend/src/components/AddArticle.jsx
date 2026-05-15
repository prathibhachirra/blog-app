import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";

function AddArticle() {
  const { register, handleSubmit, formState:{errors} } = useForm();
  const navigate = useNavigate();

  const onAddArticle = async (data) => {
    try {
      const res = await axios.post("https://capstone-project-blog-app-46tv.onrender.com/author-api/articles", data, { withCredentials: true });
      toast.success("Article published successfully!");
      navigate("/author-dashboard");
    } catch (err) {
      toast.error("Failed to publish article");
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <form onSubmit={handleSubmit(onAddArticle)} className="bg-gray-200 p-10 w-96">

        <h1 className="text-3xl text-center mb-5">Add Article</h1>

        <input
          type="text"
          placeholder="Title"
          className="border p-2 w-full mb-3"
          {...register("title",{required:true})}
        />
        {errors.title && <p className="text-red-500">Title required</p>}

        <select
          className="border p-2 w-full mb-3"
          {...register("category",{required:true})}
        >
          <option value="">Select Category</option>
          <option value="technology">Technology</option>
          <option value="education">Education</option>
          <option value="sports">Sports</option>
        </select>
        {errors.category && <p className="text-red-500">Category required</p>}

        <textarea
          placeholder="Content"
          className="border p-2 w-full mb-5"
          rows="5"
          {...register("content",{required:true})}
        ></textarea>
        {errors.content && <p className="text-red-500">Content required</p>}

        <button className="bg-sky-500 text-white px-6 py-2 w-full">
          Publish Article
        </button>
      </form>
    </div>
  );
}

export default AddArticle;
