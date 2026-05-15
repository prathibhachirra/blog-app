import Login from './components/Login'
import RootLayout from "./components/RootLayout"
import Home from "./components/Home"
import Register from './components/Register'
import AddArticle from './components/AddArticle'
import UserDashboard from "./components/UserDashboard"
import AuthorDashboard from "./components/AuthorDashboard"
import AdminDashboard from "./components/AdminDashboard"
import Unauthorized from './components/Unauthorized'
import ArticlePage from './components/ArticlePage'
import EditArticleForm from './components/EditArticleForm'
import {createBrowserRouter,RouterProvider} from 'react-router'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import {Toaster} from 'react-hot-toast'

function App() {

  const routerObj=createBrowserRouter([
    {
      path:"/",
      element:<RootLayout/>,
      errorElement:<ErrorBoundary/>,
      children:[
        {
          path:"home",
          element:<Home/>,
        },
        {
      path:"register",
      element:<Register/>,
        },
        {
        path:"login",
        element:<Login/>,
        },
        {
          path:"user-dashboard",
          element:
          <ProtectedRoute allowedRoles={["USER"]}>
            <UserDashboard/>
          </ProtectedRoute>
        },
        {
          path:"author-dashboard",
          element:
          <ProtectedRoute allowedRoles={["AUTHOR"]}>
            <AuthorDashboard/>
          </ProtectedRoute>  
        },
        {
          path:"add-article",
          element:
          <ProtectedRoute allowedRoles={["AUTHOR"]}>
            <AddArticle/>
          </ProtectedRoute>  
        },
        {
          path:"admin-dashboard",
          element:<AdminDashboard/>
        },
        {
          path:"article/:id",
          element:<ArticlePage/>
        },
        {
          path:"article/:id/edit",
          element:
            <ProtectedRoute allowedRoles={["AUTHOR"]}>
              <EditArticleForm />
            </ProtectedRoute>
        },
        {
          path:"unauthorized",
          element:<Unauthorized/>
        }
      ]
    }
  ])
  return (
    <div>
      <Toaster position='top-center' reverseOrder={false}/>
      <RouterProvider router={routerObj}/>     
    </div>
  )
}

export default App