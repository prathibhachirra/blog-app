import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../store/authStore'
import { useNavigate } from 'react-router'
import { toast } from 'react-hot-toast'

function AuthorDashboard() {

   const currentUser = useAuth((state)=>state.currentUser)

   const navigate = useNavigate()

   const [articles,setArticles]=useState([])

   const [loading,setLoading]=useState(false)

   const [error,setError]=useState(null)

   const BACKEND_URL = import.meta.env.VITE_API_URL

   const getArticles=useCallback(async()=>{

    if (!currentUser?._id) return

    setLoading(true)

    setError(null)

    try {

    const resObj=await axios.get(
      `${BACKEND_URL}/author-api/articles/${currentUser._id}`,
      {withCredentials:true}
    )

    const res=resObj.data.payload

    setArticles(res)

    } catch (err) {

      setError(err.response?.data?.message || err.response?.data?.error || "Failed to load articles")

    } finally {

      setLoading(false)

    }
    
  }, [BACKEND_URL, currentUser?._id])

  useEffect(() => {

    getArticles()

  }, [getArticles])

  const openArticle = (artObj) => {

    navigate(`/article/${artObj._id}`, { state: artObj })
  }

  const toggleArticleStatus = async (artObj) => {

    const nextStatus = !artObj.isArticleActive

    if (!nextStatus && !window.confirm("Soft delete this article?")) return

    try {

      const res = await axios.patch(
        `${BACKEND_URL}/author-api/articles/${artObj._id}/status`,
        { isArticleActive: nextStatus },
        { withCredentials: true }
      )

      const updatedArticle = res.data.article

      setArticles((prev) =>
        prev.map((article) =>
          article._id === artObj._id ? updatedArticle : article
        )
      )

      toast.success(nextStatus ? "Article restored" : "Article soft deleted")

    } catch (err) {

      toast.error(err.response?.data?.message || "Could not update article")
    }
  }

  return (

    <div className="min-h-screen bg-slate-50 px-5 py-8">

      <div className="mx-auto max-w-6xl">

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="min-w-0">
          <p className="safe-text text-sm font-semibold uppercase tracking-wide text-blue-600">
            Author Workspace
          </p>

          <h1 className="safe-text text-3xl font-bold text-slate-900">
            Your Articles
          </h1>
        </div>

        <button
          onClick={getArticles}
          className="w-fit rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition duration-300 hover:border-blue-200 hover:text-blue-700"
        >
          Refresh Articles
        </button>

      </div>

      {loading && (
        <p className="rounded-lg bg-white p-6 text-center text-blue-600 shadow-sm">
          Loading articles...
        </p>
      )}

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-600">
          {error}
        </p>
      )}

      {!loading && !error && articles.length === 0 && (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
          <h2 className="text-xl font-semibold text-slate-900">
            No articles yet
          </h2>

          <p className="mt-2 text-slate-500">
            Start writing your first article to see it here.
          </p>
        </div>
      )}

      {!loading && !error && articles.length > 0 && (
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">

          {
            articles.map((artObj)=>(

              <article
                key={artObj._id}
                className={`min-w-0 flex min-h-72 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg ${
                  artObj.isArticleActive ? "" : "opacity-75"
                }`}
              >

                <div className="mb-4 flex min-w-0 flex-wrap items-center justify-between gap-3">
                  <span className="safe-text max-w-full rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700">
                    {artObj.category || "Article"}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      artObj.isArticleActive
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {artObj.isArticleActive ? "Active" : "Deleted"}
                  </span>
                </div>

                <h2 className="safe-text mb-3 text-2xl font-bold leading-snug text-slate-900">
                  {artObj.title}
                </h2>

                <p className="safe-text mb-6 line-clamp-4 flex-1 text-sm leading-7 text-slate-600">
                  {artObj.content}
                </p>

                <div className="mt-auto grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    className="rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-blue-700"
                    onClick={() => openArticle(artObj)}
                  >
                    Read
                  </button>

                  <button
                    className={`rounded-lg px-4 py-3 text-sm font-semibold text-white transition duration-300 ${
                      artObj.isArticleActive
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                    onClick={() => toggleArticleStatus(artObj)}
                  >
                    {artObj.isArticleActive ? "Delete" : "Restore"}
                  </button>
                </div>
                
              </article>
            ))
          }

       </div>
      )}

      </div>

    </div>
  )
}

export default AuthorDashboard
