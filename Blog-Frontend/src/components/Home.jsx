import React from "react";
import { useNavigate } from "react-router";

function Home() {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">

      <div className="bg-blue-400 shadow-2xl rounded-3xl p-12 text-center w-[90%] max-w-4xl">

        <h1 className="text-6xl font-extrabold text-white mb-6">
          Welcome to My Blog
        </h1>

        <p className="text-xl text-white mb-10 max-w-2xl mx-auto leading-8">
          Share your thoughts, ideas, and stories with the world.
          Connect with people through modern blogging.
        </p>

        <button
          onClick={() => navigate("/register")}
          className="bg-white hover:bg-gray-100 text-blue-500 font-bold px-10 py-4 rounded-full text-lg shadow-lg transition duration-300"
        >
          Get Started
        </button>

      </div>

    </div>
  );
}

export default Home;