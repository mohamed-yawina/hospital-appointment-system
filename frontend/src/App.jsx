// App.jsx
import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import LoadingSpinner from './components/LoadingSpinner'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import DashboardPatient from './pages/DashboardPatient'
import DashboardDoctor from './pages/DashboardDoctor'
import DashboardAdmin from './pages/DashboardAdmin'
import DoctorsList from './pages/DoctorsList'
import Navbar from './components/Navbar'

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AuthProvider>
      {loading && <LoadingSpinner />}
      
      <Routes>
        {/* Landing page - a son propre navbar intégré */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth pages - avec AuthNavbar intégré */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Pages internes - avec Navbar global */}
        <Route path="/doctors" element={
          <>
            <Navbar />
            <DoctorsList />
          </>
        } />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <>
              <Navbar />
              <RoleBasedDashboard />
            </>
          </PrivateRoute>
        } />
      </Routes>
    </AuthProvider>
  )
}

function RoleBasedDashboard() {
  const role = localStorage.getItem('role')
  
  if (role === 'PATIENT') return <DashboardPatient />
  if (role === 'MEDECIN') return <DashboardDoctor />
  if (role === 'ADMINISTRATEUR') return <DashboardAdmin />
  
  return <Navigate to="/login" />
}

export default App