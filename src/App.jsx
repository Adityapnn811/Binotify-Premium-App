import { useState } from 'react'
import { Routes, Route, Navigate } from "react-router-dom"
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import Songs from './pages/Songs'
import Subs from './pages/Subs'

function App() {  
    return (
        <Routes>
          <Route path="/" element={ <Login/> } />
          <Route path="/login" element={ <Login/> } />
          <Route path="/register" element={ <Register/> } />
          <Route path="/songs" element={ <Songs /> } />
          <Route path="/subscription" element={ <Subs/>} />
        </Routes>
    )
}

export default App
