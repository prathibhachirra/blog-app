import { useForm } from "react-hook-form";
import { useAuth } from "../store/authStore";
import { useNavigate } from "react-router";
import { useEffect, useRef } from "react";
import { toast } from 'react-hot-toast'

function Login() {

  const { register, handleSubmit, formState: { errors } } = useForm();

  const login = useAuth((state) => state.login)
  const userAuthenticate = useAuth((state) => state.userAuthenticate)
  const currentUser = useAuth((state) => state.currentUser)

  const navigate = useNavigate()

  const redirectedOnce = useRef(false)

  const onLogin = async (userCredObj) => {
    await login(userCredObj)
  };

  useEffect(() => {

    if (!userAuthenticate || !currentUser || redirectedOnce.current) return

    redirectedOnce.current = true

    if (currentUser.role === "USER") {
      toast.success("Loggedin successfully")
      navigate("/user-dashboard")
      return
    }

    if (currentUser.role === "AUTHOR") {
      navigate("/author-dashboard")
      return
    }

  }, [userAuthenticate, currentUser, navigate])

  return (

    <div className="min-h-screen bg-white flex justify-center items-center">

      <form
        onSubmit={handleSubmit(onLogin)}
        className="bg-blue-400 shadow-2xl rounded-3xl p-10 w-[90%] max-w-md"
      >

        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="bg-white p-3 w-full mb-4 rounded-lg outline-none"
          {...register("email", { required: true })}
        />

        {errors.email && (
          <p className="text-red-200 mb-3">
            Email required
          </p>
        )}

        <input
          type="password"
          placeholder="Password"
          className="bg-white p-3 w-full mb-5 rounded-lg outline-none"
          {...register("password", { required: true })}
        />

        {errors.password && (
          <p className="text-red-200 mb-3">
            Password required
          </p>
        )}

        <button
          className="bg-white hover:bg-gray-100 text-blue-500 font-bold px-6 py-3 w-full rounded-full transition duration-300"
        >
          Login
        </button>

      </form>

    </div>
  );
}

export default Login;