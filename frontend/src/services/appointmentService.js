import api from './api'

const appointmentService = {
  // Récupérer tous les rendez-vous du patient/médecin connecté
  getMyAppointments: async () => {
    const response = await api.get('/appointments')
    return response.data
  },

  // Récupérer un rendez-vous par son ID
  getAppointmentById: async (appointmentId) => {
    const response = await api.get(`/appointments/${appointmentId}`)
    return response.data
  },

  // Créer un rendez-vous
  createAppointment: async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData)
    return response.data
  },

  // Ajouter/modifier les notes et prescription
  addConsultationNotes: async (appointmentId, data) => {
    const response = await api.post(`/appointments/${appointmentId}/notes`, data)
    return response.data
  },

  // Annuler un rendez-vous (médecin/admin)
  cancelAppointmentById: async (appointmentId) => {
    const response = await api.put(`/appointments/${appointmentId}/cancel`)
    return response.data
  },

  // Annuler un rendez-vous (patient)
  cancelAppointment: async (appointmentId) => {
    const response = await api.delete(`/appointments/${appointmentId}`)
    return response.data
  },

  // Modifier le statut d'un rendez-vous
  updateAppointmentStatus: async (appointmentId, status) => {
    const response = await api.put(`/appointments/${appointmentId}/status`, { status })
    return response.data
  },

  // Changer le statut d'une consultation (médecin)
  changeAppointmentStatus: async (appointmentId, status) => {
    const response = await api.put(`/appointments/${appointmentId}/status`, { status })
    return response.data
  }
}

export default appointmentService