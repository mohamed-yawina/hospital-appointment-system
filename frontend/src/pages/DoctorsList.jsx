import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import doctorService from '../services/doctorService'
import appointmentService from '../services/appointmentService'
import DoctorAvailabilityCalendar from '../components/DoctorAvailabilityCalendar'
import { doctorEmail, doctorName } from '../utils/doctorPatient'

function DoctorsList() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDoctorId, setSelectedDoctorId] = useState(null)
  const [availabilities, setAvailabilities] = useState([])
  const [loadingAvail, setLoadingAvail] = useState(false)
  const [appointmentDate, setAppointmentDate] = useState('')
  const [slotPickerOpen, setSlotPickerOpen] = useState(false)
  const [message, setMessage] = useState('')
  const { user } = useContext(AuthContext)

  useEffect(() => {
    fetchDoctors()
  }, [])

  useEffect(() => {
    if (!selectedDoctorId) {
      setAvailabilities([])
      setAppointmentDate('')
      setSlotPickerOpen(false)
      return
    }
    setSlotPickerOpen(true)
    let cancelled = false
    setLoadingAvail(true)
    doctorService
      .getAvailabilities(selectedDoctorId)
      .then((list) => {
        if (!cancelled) setAvailabilities(list || [])
      })
      .catch(() => {
        if (!cancelled) setAvailabilities([])
      })
      .finally(() => {
        if (!cancelled) setLoadingAvail(false)
      })
    return () => {
      cancelled = true
    }
  }, [selectedDoctorId])

  const fetchDoctors = async () => {
    try {
      const data = await doctorService.getAllDoctors()
      setDoctors(data || [])
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBookAppointment = async (doctorId) => {
    if (!appointmentDate) {
      setMessage('Choisissez un créneau dans le planning.')
      return
    }

    try {
      await appointmentService.createAppointment({
        doctorId,
        date: appointmentDate,
      })
      setMessage(
        'Demande enregistrée. Elle sera traitée après confirmation éventuelle par le médecin.'
      )
      setSelectedDoctorId(null)
      setAppointmentDate('')
      setTimeout(() => setMessage(''), 4000)
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
        {doctors.map((doctor) => (
          <div key={doctor.id} className="doctor-card">
            <h3>Dr. {doctorName(doctor)}</h3>
            <p>Spécialité: {doctor.specialty?.name || 'Non définie'}</p>
            <p>Email: {doctorEmail(doctor)}</p>
            {user && user.role === 'PATIENT' && (
              <>
                {selectedDoctorId === doctor.id ? (
                  <div style={{ marginTop: 10 }}>
                    {loadingAvail ? (
                      <p>Chargement des créneaux…</p>
                    ) : availabilities.length === 0 ? (
                      <p style={{ color: '#c00', fontSize: 14 }}>
                        Aucune disponibilité publiée pour ce médecin.
                      </p>
                    ) : (
                      <>
                        <DoctorAvailabilityCalendar
                          availabilities={availabilities}
                          selectedIso={appointmentDate}
                          doctorName={doctorName(doctor)}
                          open={slotPickerOpen}
                          onOpenChange={setSlotPickerOpen}
                          loading={loadingAvail}
                          onSelectSlot={(iso) => setAppointmentDate(iso)}
                        />
                        <button
                          type="button"
                          className="book-btn"
                          style={{ marginTop: 12, width: '100%' }}
                          disabled={!appointmentDate}
                          onClick={() => handleBookAppointment(doctor.id)}
                        >
                          Demander ce créneau
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDoctorId(null)
                        setAppointmentDate('')
                        setSlotPickerOpen(false)
                      }}
                      style={{ background: '#6c757d', marginTop: 8, width: '100%' }}
                    >
                      Annuler
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="book-btn"
                    onClick={() => {
                      setSelectedDoctorId(doctor.id)
                      setAppointmentDate('')
                      setSlotPickerOpen(true)
                    }}
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
