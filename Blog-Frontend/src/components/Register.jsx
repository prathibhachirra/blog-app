import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from 'axios'
import { useNavigate } from 'react-router'
import { loadingClass, errorClass } from "../styles/common";

function Register() {

  const { register, handleSubmit, formState: { errors } } = useForm();

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState(null)

  const [preview, setPreview] = useState(null)

  const navigate = useNavigate()

  const BACKEND_URL = import.meta.env.VITE_API_URL

  const onRegister = async (newUser) => {

    setLoading(true)

    const formData = new FormData();

    let { role, ProfileImageUrl, ...userObj } = newUser;

    Object.keys(userObj).forEach((key) => {
      formData.append(key, userObj[key]);
    });

    formData.append("ProfileImageUrl", ProfileImageUrl[0]);

    try {

      if (newUser.role === "user") {

        let resObj = await axios.post(
          `${BACKEND_URL}/user-api/users`,
          formData,
          { withCredentials: true }
        )

        if (resObj.status === 201) {
          navigate("/login")
        }
      }

      if (newUser.role === "author") {

        let resObj = await axios.post(
          `${BACKEND_URL}/author-api/users`,
          formData,
          { withCredentials: true }
        )

        if (resObj.status === 201) {
          navigate("/login")
        }
      }

    } catch (err) {

      setError(err)

    } finally {

      setLoading(false)
    }
  };

  if (loading === true) {

    return <p className={loadingClass}></p>
  }

  if (error) {

    return <p className={errorClass}>{error.message}</p>
  }

  return (

    <div className="min-h-screen bg-white flex justify-center items-center py-10">

      <form
        onSubmit={handleSubmit(onRegister)}
        className="bg-blue-400 shadow-2xl rounded-3xl p-10 w-[90%] max-w-md"
      >

        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Register
        </h1>

        <p className="text-lg text-white mb-3 font-semibold">
          Select Role
        </p>

        <div className="flex gap-8 mb-5 text-white">

          <label className="flex items-center gap-2">

            <input
              type="radio"
              value="user"
              {...register("role", { required: true })}
            />

            User

          </label>

          <label className="flex items-center gap-2">

            <input
              type="radio"
              value="author"
              {...register("role", { required: true })}
            />

            Author

          </label>

        </div>

        {errors.role && (
          <p className="text-red-200 mb-2">
            Role required
          </p>
        )}

        <input
          type="text"
          placeholder="First name"
          className="bg-white p-3 w-full mb-4 rounded-lg outline-none"
          {...register("firstName", { required: true })}
        />

        {errors.firstName && (
          <p className="text-red-200 mb-2">
            First name required
          </p>
        )}

        <input
          type="text"
          placeholder="Last name"
          className="bg-white p-3 w-full mb-4 rounded-lg outline-none"
          {...register("lastName", { required: true })}
        />

        {errors.lastName && (
          <p className="text-red-200 mb-2">
            Last name required
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="bg-white p-3 w-full mb-4 rounded-lg outline-none"
          {...register("email", { required: true })}
        />

        {errors.email && (
          <p className="text-red-200 mb-2">
            Email required
          </p>
        )}

        <input
          type="password"
          placeholder="Password"
          className="bg-white p-3 w-full mb-4 rounded-lg outline-none"
          {...register("password", {
            required: true,
            minLength: 6
          })}
        />

        {errors.password && (
          <p className="text-red-200 mb-2">
            Password min 6 chars
          </p>
        )}

        <input
          type="file"
          accept="image/png, image/jpeg"
          className="bg-white p-2 w-full rounded-lg"
          {...register("ProfileImageUrl")}

          onChange={(e) => {

            const file = e.target.files[0];

            if (file) {

              if (!["image/jpeg", "image/png"].includes(file.type)) {

                setError("Only JPG or PNG allowed");

                return;
              }

              if (file.size > 2 * 1024 * 1024) {

                setError("File size must be less than 2MB");

                return;
              }

              const previewUrl = URL.createObjectURL(file);

              setPreview(previewUrl);

              setError(null);
            }
          }}
        />

        {preview && (

          <div className="mt-5 flex justify-center">

            <img
              src={preview}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-full border-4 border-white"
            />

          </div>
        )}

        <button
          className="bg-white hover:bg-gray-100 text-blue-500 font-bold px-6 py-3 w-full rounded-full mt-8 transition duration-300"
        >
          Register
        </button>

      </form>

    </div>
  );
}

export default Register;