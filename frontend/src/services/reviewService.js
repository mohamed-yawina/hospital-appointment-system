import api from './api'

const reviewService = {
  /** Avis validés (landing page, public) */
  getPublishedReviews: async () => {
    const response = await api.get('/reviews')
    return response.data
  },

  /** Patient connecté */
  getMyReviews: async () => {
    const response = await api.get('/reviews/me')
    return response.data
  },

  createReview: async ({ doctorId, appointmentId, commentaire, note }) => {
    const payload = { doctorId, commentaire, note }
    if (appointmentId != null) payload.appointmentId = appointmentId
    const response = await api.post('/reviews', payload)
    return response.data
  },

  /** Administrateur : tous les avis */
  getAllReviewsAdmin: async () => {
    const response = await api.get('/admin/reviews')
    return response.data
  },

  validateReview: async (reviewId) => {
    const response = await api.put(`/admin/reviews/${reviewId}/validate`)
    return response.data
  },

  deleteReview: async (reviewId) => {
    await api.delete(`/admin/reviews/${reviewId}`)
  },
}

export default reviewService
