import api from './api'

const appointmentService = {
  getMyAppointments: async () => {
    const response = await api.get('/appointments')
    return response.data
  },

  getAppointmentById: async (appointmentId) => {
    const response = await api.get(`/appointments/${appointmentId}`)
    return response.data
  },

  createAppointment: async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData)
    return response.data
  },

  addConsultationNotes: async (appointmentId, data) => {
    const response = await api.post(`/appointments/${appointmentId}/notes`, data)
    return response.data
  },

  cancelAppointmentById: async (appointmentId) => {
    const response = await api.put(`/appointments/${appointmentId}/cancel`)
    return response.data
  },

  cancelAppointment: async (appointmentId) => {
    const response = await api.delete(`/appointments/${appointmentId}`)
    return response.data
  },

  updateAppointmentStatus: async (appointmentId, status) => {
    const response = await api.put(`/appointments/${appointmentId}/status`, { status })
    return response.data
  },

  changeAppointmentStatus: async (appointmentId, status) => {
    const response = await api.put(`/appointments/${appointmentId}/status`, { status })
    return response.data
  },

  /** Médecin / admin : passe EN_ATTENTE → CONFIRME */
  confirmAppointment: async (appointmentId) => {
    const response = await api.put(`/appointments/${appointmentId}/confirm`)
    return response.data
  },

  /** Reprogramme (patient, médecin ou admin) */
  rescheduleAppointment: async (appointmentId, payload) => {
    const response = await api.put(`/appointments/${appointmentId}/reschedule`, payload)
    return response.data
  },
}

export default appointmentService
