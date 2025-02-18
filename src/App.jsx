import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Register from './Register'
import axios from 'axios'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Layout'
import Home from './Home'
import Profile from './Profile'
import UsercontextProvider from './context/usercontext'
 import Chats from './Chat'
import Gaurd from './Gaurd'

function App() {
  axios.defaults.baseURL="http://localhost:3000"
  axios.defaults.withCredentials = true;// to can read token in cookies in front write this
  const routes= createBrowserRouter([{
    path: '/',element:<Layout/>,
    children:[
      {index:true,element:<Register/>},

      {path:"register",element:<Register/>},
      {path:"about",element:<h1>about</h1>},
      {path:"profile",element:<Profile/>},
      {path:"chat",element: <Gaurd><Chats/></Gaurd>},



    ]
  }])

   
  return (
  <>
  <UsercontextProvider>
  <RouterProvider  router={routes} >
    <Layout/>

  </RouterProvider>
  </UsercontextProvider>
      
  
 
 

  </>
  )
}

export default App
