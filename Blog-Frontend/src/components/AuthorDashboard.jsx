import { useState } from 'react'
import { primaryBtn,secondaryBtn,articleCardClass,articleGrid } from '../styles/common'
import axios from 'axios'
import { useAuth } from '../store/authStore'
import { useNavigate } from 'react-router'
import { toast } from 'react-hot-toast'


function AuthorDashboard() {
   const currentUser = useAuth((state)=>state.currentUser)
   const logout = useAuth((state)=>state.logout)
   const navigate = useNavigate()
  const [articles,setArticles]=useState([])
  const getArticles=async()=>{
    const resObj=await axios.get("https://capstone-project-blog-app-46tv.onrender.com/author-api/articles",{withCredentials:true})
    const res=resObj.data.payload
    
  const authorArticles = res.filter(
    (artObj)=> artObj.author === currentUser._id
  )
    setArticles(authorArticles)
    
  }

  const openArticle = (artObj) => {
    navigate(`/article/${artObj._id}`, { state: artObj })
  }

  const onLogout = async () => {
    await logout()
    toast.success("Logged out successfully")
    navigate("/login")
  }

  return (
    <div>
      <div className="mb-4 flex gap-3">
        <button onClick={() => navigate('/add-article')} className={primaryBtn}>Add Article</button>
        <button onClick={getArticles} className={primaryBtn}>All Articles</button>
        <button onClick={onLogout} className={secondaryBtn}>Logout</button>
      </div>
      <div className={articleGrid}>
          {
            articles.map((artObj)=>(
              <div key={artObj._id} className={articleCardClass}>
                <h2>{artObj.title}</h2>
                <p>{artObj.content}</p>
                <button className={secondaryBtn} onClick={() => openArticle(artObj)}>Read Article</button>
                
              </div>
            ))
          }
       </div>
    </div>
  )
}
export default AuthorDashboard



