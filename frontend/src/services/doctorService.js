import api from './api'

const doctorService = {
  getAllDoctors: async () => {
    const response = await api.get('/doctors')
    return response.data
  },

  getDoctorById: async (id) => {
    const response = await api.get(`/doctors/${id}`)
    return response.data
  },

  getDoctorsBySpecialty: async (specialty) => {
    const response = await api.get(`/doctors/specialty/${specialty}`)
    return response.data
  },

  /** Créneaux réels backend (Availability) */
  getAvailabilities: async (doctorId) => {
    const response = await api.get(`/doctors/${doctorId}/availabilities`)
    return response.data
  },

  addAvailability: async (doctorId, { dateDebut, dateFin }) => {
    const response = await api.post(`/doctors/${doctorId}/availabilities`, {
      dateDebut,
      dateFin,
    })
    return response.data
  },

  deleteAvailability: async (doctorId, availabilityId) => {
    await api.delete(`/doctors/${doctorId}/availabilities/${availabilityId}`)
  },
}

export default doctorService
