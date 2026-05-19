import { useCallback, useEffect, useState } from 'react'
import { primaryBtn,secondaryBtn } from '../styles/common'
import axios from 'axios'
import { useAuth } from '../store/authStore'
import { useNavigate } from 'react-router'
import { toast } from 'react-hot-toast'

function AuthorDashboard() {

   const currentUser = useAuth((state)=>state.currentUser)

   const logout = useAuth((state)=>state.logout)

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

  const onLogout = async () => {

    await logout()

    toast.success("Logged out successfully")

    navigate("/login")
  }

  return (

    <div className="min-h-screen bg-slate-50 px-5 py-8">

      <div className="mx-auto max-w-6xl">

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Author Workspace
          </p>

          <h1 className="text-3xl font-bold text-slate-900">
            Your Articles
          </h1>
        </div>

        <div className="flex flex-wrap gap-3">

        <button onClick={() => navigate('/add-article')} className={primaryBtn}>
          Add Article
        </button>

        <button onClick={getArticles} className={primaryBtn}>
          All Articles
        </button>

        <button onClick={onLogout} className={secondaryBtn}>
          Logout
        </button>

        </div>

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
                className="flex min-h-72 flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700">
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

                <h2 className="mb-3 text-2xl font-bold leading-snug text-slate-900">
                  {artObj.title}
                </h2>

                <p className="mb-6 line-clamp-4 flex-1 text-sm leading-7 text-slate-600">
                  {artObj.content}
                </p>

                <button
                  className="mt-auto rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-blue-700"
                  onClick={() => openArticle(artObj)}
                >
                  Read Article
                </button>
                
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
