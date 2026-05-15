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

  updateAvailability: async (doctorId, availability) => {
    const response = await api.put(`/doctors/${doctorId}/availability`, availability)
    return response.data
  }
}

export default doctorService