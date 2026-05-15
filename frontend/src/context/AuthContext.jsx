import React, { createContext, useState, useEffect } from 'react'
import authService from '../services/authService'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password)
      const { token, id, name, email: userEmail, role } = response
      
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify({ id, name, email: userEmail, role }))
      localStorage.setItem('role', role)
      
      setUser({ id, name, email: userEmail, role })
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erreur de connexion' }
    }
  }

  const register = async (userData) => {
    try {
      const response = await authService.register(userData)
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Erreur d\'inscription' }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('role')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}