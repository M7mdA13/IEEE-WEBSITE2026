import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'

function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn')
  return isLoggedIn ? children : <Navigate to="/login" replace />
}

function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return savedTheme || (prefersDark ? 'dark' : 'light')
  })

  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark')

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard toggleTheme={toggleTheme} theme={theme} />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
