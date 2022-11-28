import { useState } from 'react'
import { Routes, Route, Navigate } from "react-router-dom"
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
// import Register from './pages/Register'

function App() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <Routes>
        <Route path="/" element={ <Login/> } />
        <Route path="/login" element={ <Login/> } />
        <Route path="/register" element={ <Register/> } />
      </Routes>
    </div>
  )
}

export default App
