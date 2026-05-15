// services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false  // ← Important
})

// Intercepteur pour ajouter le token (UNIQUEMENT s'il existe)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('📤 Token envoyé:', token.substring(0, 50) + '...')
      console.log('📤 Headers:', config.headers)
    } else {
      console.warn('⚠️ Aucun token trouvé')
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Intercepteur pour les erreurs
api.interceptors.response.use(
  (response) => {
    console.log(`📥 ${response.status} ${response.config.url}`, response.data)
    return response
  },
  (error) => {
    console.error('❌ API Error:', error.response?.status, error.response?.data)
    if (error.response?.status === 403) {
      console.error('🔒 Erreur 403 - Vérifie que l\'utilisateur est connecté avec le bon rôle')
    }
    return Promise.reject(error)
  }
)

export default api