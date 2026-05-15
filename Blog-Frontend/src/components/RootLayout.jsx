import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { Outlet } from 'react-router'
import { useEffect } from 'react'
import { useAuth } from '../store/authStore'

function RootLayout() {
  const checkAuth = useAuth((state)=>state.checkAuth)
  const loading = useAuth((state)=>state.loading)

  useEffect(()=>{
    if (typeof checkAuth === 'function') {
      checkAuth()
    }
  },[checkAuth])
  return (
    <div>
      <div className='bg-amber-100'>
        <Header/>
        </div>
        <div className='min-h-screen bg-blue-100' >
        <Outlet/>
        </div>
        <Footer/>
    </div>
  )
}

export default RootLayout