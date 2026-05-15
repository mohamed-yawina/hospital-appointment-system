import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import doctorService from '../services/doctorService'
import appointmentService from '../services/appointmentService'

function DoctorsList() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [appointmentDate, setAppointmentDate] = useState('')
  const [message, setMessage] = useState('')
  const { user } = useContext(AuthContext)

  useEffect(() => {
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    try {
      const data = await doctorService.getAllDoctors()
      setDoctors(data)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBookAppointment = async (doctorId) => {
    if (!appointmentDate) {
      setMessage('Veuillez sélectionner une date')
      return
    }

    try {
      await appointmentService.createAppointment({
        doctorId: doctorId,
        date: appointmentDate
      })
      setMessage('Rendez-vous réservé avec succès !')
      setSelectedDoctor(null)
      setAppointmentDate('')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage(error.response?.data?.message || 'Erreur lors de la réservation')
    }
  }

  if (loading) return <div>Chargement...</div>

  return (
    <div>
      <h1>Nos Médecins</h1>
      {message && <div className="alert alert-success">{message}</div>}
      <div className="doctors-grid">
        {doctors.map(doctor => (
          <div key={doctor.id} className="doctor-card">
            <h3>Dr. {doctor.user?.name}</h3>
            <p>Spécialité: {doctor.specialty?.name || 'Non définie'}</p>
            <p>Email: {doctor.user?.email}</p>
            {user && user.role === 'PATIENT' && (
              <>
                {selectedDoctor === doctor.id ? (
                  <div>
                    <input 
                      type="datetime-local" 
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      style={{ width: '100%', marginBottom: '10px' }}
                    />
                    <button onClick={() => handleBookAppointment(doctor.id)}>
                      Confirmer
                    </button>
                    <button 
                      onClick={() => setSelectedDoctor(null)}
                      style={{ background: '#6c757d', marginTop: '5px' }}
                    >
                      Annuler
                    </button>
                  </div>
                ) : (
                  <button 
                    className="book-btn"
                    onClick={() => setSelectedDoctor(doctor.id)}
                  >
                    Prendre RDV
                  </button>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default DoctorsList