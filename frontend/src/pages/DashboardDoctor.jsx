import React, { useState, useEffect, useCallback } from 'react'
import {
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XMarkIcon,
  PlusCircleIcon,
  EyeIcon,
  SparklesIcon,
  TrophyIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
  PencilIcon,
  PrinterIcon
} from '@heroicons/react/24/outline'
import appointmentService from '../services/appointmentService'
import doctorService from '../services/doctorService'
import { patientEmail, patientName } from '../utils/doctorPatient'

function DashboardDoctor() {
  const [appointments, setAppointments] = useState([])
  const [doctorInfo, setDoctorInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')
  const [activeTab, setActiveTab] = useState('schedule')
  const [availabilitySlots, setAvailabilitySlots] = useState([])
  const [newSlotRange, setNewSlotRange] = useState({ dateDebut: '', dateFin: '' })
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [showConsultModal, setShowConsultModal] = useState(false)
  const [consultNotes, setConsultNotes] = useState('')
  const [consultPrescription, setConsultPrescription] = useState('')
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [selectedStatusAppointment, setSelectedStatusAppointment] = useState(null)
  const [newStatus, setNewStatus] = useState('')
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() - d.getDay() + (d.getDay() === 0 ? -6 : 1))
    return d
  })
  const [stats, setStats] = useState({ total: 0, completed: 0, upcoming: 0, cancelled: 0, rating: 4.8 })
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedAppointmentDetails, setSelectedAppointmentDetails] = useState(null)

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const now = new Date()
    setStats({
      total: appointments.length,
      completed: appointments.filter(a => a.status === 'TERMINE').length,
      upcoming: appointments.filter(a => a.status === 'CONFIRME' && new Date(a.date) > now).length,
      cancelled: appointments.filter(a => a.status === 'ANNULE').length,
      rating: 4.8
    })
  }, [appointments])

  const fetchData = async () => {
    setLoading(true)
    try {
      let apts = []
      let docs = []
      try {
        apts = await appointmentService.getMyAppointments()
      } catch (e) {
        console.error('RDV médecin:', e.response?.status, e.response?.data ?? e.message)
      }
      try {
        docs = await doctorService.getAllDoctors()
      } catch (e) {
        console.error('Liste médecins:', e.response?.status, e.response?.data ?? e.message)
      }

      const emailNorm = String(user.email || '').trim().toLowerCase()
      setAppointments(Array.isArray(apts) ? apts : [])
      const doc = Array.isArray(docs)
        ? docs.find((d) => String(d.email || '').trim().toLowerCase() === emailNorm)
        : null
      setDoctorInfo(doc || null)

      if (doc?.id) {
        const slots = await doctorService.getAvailabilities(doc.id).catch(() => [])
        setAvailabilitySlots(Array.isArray(slots) ? slots : [])
      } else {
        setAvailabilitySlots([])
        if (emailNorm && Array.isArray(docs) && docs.length > 0 && !doc) {
          showMessage(
            'Aucun profil médecin ne correspond à votre compte. Vérifiez en base (dtype = Doctor et email).',
            'error'
          )
        }
      }
    } catch (error) {
      console.error('Erreur chargement:', error)
      showMessage('Erreur lors du chargement des données', 'error')
    } finally {
      setTimeout(() => setLoading(false), 600)
    }
  }

  const handleAddAvailabilityRange = async () => {
    if (!doctorInfo?.id) {
      showMessage('Médecin non trouvé', 'error')
      return
    }
    if (!newSlotRange.dateDebut || !newSlotRange.dateFin) {
      showMessage('Choisissez début et fin du créneau', 'error')
      return
    }
    try {
      await doctorService.addAvailability(doctorInfo.id, newSlotRange)
      showMessage('Créneau ajouté', 'success')
      setNewSlotRange({ dateDebut: '', dateFin: '' })
      const slots = await doctorService.getAvailabilities(doctorInfo.id)
      setAvailabilitySlots(slots || [])
    } catch (e) {
      console.error(e)
      showMessage(
        e.response?.data?.message || 'Impossible d’ajouter le créneau',
        'error'
      )
    }
  }

  const handleDeleteAvailability = async (slotId) => {
    if (!doctorInfo?.id) return
    if (!window.confirm('Supprimer ce créneau ?')) return
    try {
      await doctorService.deleteAvailability(doctorInfo.id, slotId)
      showMessage('Créneau supprimé', 'success')
      const slots = await doctorService.getAvailabilities(doctorInfo.id)
      setAvailabilitySlots(slots || [])
    } catch (e) {
      showMessage(e.response?.data?.message || 'Suppression impossible', 'error')
    }
  }

  const handleConfirmPendingAppointment = async (apt) => {
    try {
      await appointmentService.confirmAppointment(apt.id)
      showMessage('Rendez-vous confirmé', 'success')
      await fetchData()
    } catch (e) {
      showMessage(e.response?.data?.message || 'Confirmation impossible', 'error')
    }
  }

  const showMessage = (msg, type = 'success') => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(''), 4000)
  }

  const handleValidateConsultation = async () => {
    if (!consultNotes.trim() && !consultPrescription.trim()) {
      showMessage('Veuillez ajouter des notes ou une prescription', 'error')
      return
    }

    try {
      await appointmentService.updateAppointmentStatus(selectedAppointment.id, 'TERMINE')
      await appointmentService.addConsultationNotes(selectedAppointment.id, {
        notes: consultNotes,
        prescription: consultPrescription
      })
      
      showMessage('Consultation validée avec succès !', 'success')
      setShowConsultModal(false)
      setConsultNotes('')
      setConsultPrescription('')
      await fetchData()
    } catch (error) {
      console.error('Erreur validation:', error)
      showMessage(error.response?.data?.message || 'Erreur lors de la validation', 'error')
    }
  }

  const handleCancelAppointment = async (appointment) => {
    if (window.confirm(`Êtes-vous sûr de vouloir annuler la consultation avec ${patientName(appointment.patient)} ?`)) {
      try {
        await appointmentService.cancelAppointmentById(appointment.id)
        showMessage('Consultation annulée avec succès', 'success')
        await fetchData()
      } catch (error) {
        console.error('Erreur annulation:', error)
        showMessage('Erreur lors de l\'annulation', 'error')
      }
    }
  }

  const handleViewDetails = async (appointment) => {
    try {
      const details = await appointmentService.getAppointmentById(appointment.id)
      setSelectedAppointmentDetails(details)
      setShowDetailsModal(true)
    } catch (error) {
      console.error('Erreur chargement détails:', error)
      showMessage('Erreur lors du chargement des détails', 'error')
    }
  }

  const handleEditNotes = async (appointment) => {
    setSelectedAppointment(appointment)
    setConsultNotes(appointment.consultationNotes || '')
    setConsultPrescription(appointment.prescription || '')
    setShowConsultModal(true)
  }

  const handleChangeStatus = async () => {
    if (!newStatus) {
      showMessage('Veuillez sélectionner un statut', 'error')
      return
    }

    try {
      await appointmentService.updateAppointmentStatus(selectedStatusAppointment.id, newStatus)
      showMessage(`Statut de la consultation modifié avec succès`, 'success')
      setShowStatusModal(false)
      setSelectedStatusAppointment(null)
      setNewStatus('')
      await fetchData()
    } catch (error) {
      console.error('Erreur changement statut:', error)
      showMessage('Erreur lors du changement de statut', 'error')
    }
  }

  const openStatusModal = (appointment) => {
    setSelectedStatusAppointment(appointment)
    setNewStatus(appointment.status)
    setShowStatusModal(true)
  }

  const weekDays = useCallback(() => {
    const days = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(currentWeekStart)
      d.setDate(currentWeekStart.getDate() + i)
      days.push(d)
    }
    return days
  }, [currentWeekStart])

  const changeWeek = (dir) => {
    const d = new Date(currentWeekStart)
    d.setDate(d.getDate() + dir * 7)
    setCurrentWeekStart(d)
  }

  const getAppointmentsForDay = (date) => {
    return appointments.filter(a => {
      const aptDate = new Date(a.date)
      return aptDate.toDateString() === date.toDateString() && a.status !== 'ANNULE'
    })
  }

  const formatDate = (date, options = {}) => {
    return new Date(date).toLocaleDateString('fr-FR', options)
  }

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }

  const uniquePatients = [...new Set(appointments.map(a => a.patient?.id).filter(Boolean))].length
  const weekDaysArray = weekDays()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-pulse"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <SparklesIcon className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Chargement de votre espace médecin...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Toast notification */}
      {message && (
        <div className={`fixed top-24 right-6 z-50 p-4 rounded-xl shadow-lg flex items-center gap-3 backdrop-blur-md animate-slide-down ${
          messageType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {messageType === 'success' ? <CheckCircleIcon className="w-5 h-5" /> : <XMarkIcon className="w-5 h-5" />}
          <p className="text-sm font-medium">{message}</p>
          <button onClick={() => setMessage('')} className="opacity-70 hover:opacity-100">
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -ml-32 -mb-32"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-sm font-semibold text-blue-200 uppercase tracking-wider mb-2">
                Espace médecin
              </p>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Tableau de bord
              </h1>
              <p className="mt-2 text-blue-100">Gérez vos consultations et votre planning</p>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
              <ShieldCheckIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Dr. {user.name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total consultations</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.total}</p>
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                  <TrophyIcon className="w-3 h-3" />
                  {Math.round((stats.completed / (stats.total || 1)) * 100)}% complétées
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <CalendarIcon className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">À venir</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.upcoming}</p>
                <p className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                  <ClockIcon className="w-3 h-3" />
                  Prochainement
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <ClockIcon className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Terminées</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.completed}</p>
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                  <CheckCircleIcon className="w-3 h-3" />
                  Consultations faites
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <CheckCircleIcon className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Annulées</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.cancelled}</p>
                <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                  <XMarkIcon className="w-3 h-3" />
                  Consultations annulées
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <XMarkIcon className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Patients</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{uniquePatients}</p>
                <p className="text-xs text-purple-600 mt-2 flex items-center gap-1">
                  <UserGroupIcon className="w-3 h-3" />
                  Patients uniques
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <UserGroupIcon className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 mb-6">
          <div className="border-b border-gray-100">
            <nav className="flex flex-wrap gap-2 px-6" aria-label="Tabs">
              {[
                { id: 'schedule', label: '📅 Planning', icon: <CalendarIcon className="w-5 h-5" /> },
                { id: 'availability', label: '⚙️ Disponibilités', icon: <ClockIcon className="w-5 h-5" /> },
                { id: 'patients', label: '👥 Gestion consultations', icon: <UserGroupIcon className="w-5 h-5" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-4 border-b-2 transition-all duration-200 font-medium ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="inline sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6">
            {/* Tab: Planning */}
            {activeTab === 'schedule' && (
              <div>
                <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <CalendarIcon className="w-6 h-6 text-blue-600" />
                    Planning des consultations
                  </h2>
                  <div className="flex items-center gap-2">
                    <button onClick={() => changeWeek(-1)} className="p-2 rounded-lg hover:bg-gray-100 transition">
                      <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-medium text-gray-600">
                      Semaine du {formatDate(weekDaysArray[0], { day: 'numeric', month: 'short' })} au {formatDate(weekDaysArray[6], { day: 'numeric', month: 'short' })}
                    </span>
                    <button onClick={() => changeWeek(1)} className="p-2 rounded-lg hover:bg-gray-100 transition">
                      <ChevronRightIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-3 overflow-x-auto">
                  {weekDaysArray.map((day, idx) => {
                    const dayAppointments = getAppointmentsForDay(day)
                    const isToday = day.toDateString() === new Date().toDateString()
                    
                    return (
                      <div key={idx} className={`rounded-xl p-3 min-w-[110px] ${isToday ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'}`}>
                        <div className="text-center mb-3">
                          <p className={`text-sm font-semibold ${isToday ? 'text-blue-600' : 'text-gray-600'}`}>
                            {day.toLocaleDateString('fr-FR', { weekday: 'short' })}
                          </p>
                          <p className={`text-xs ${isToday ? 'text-blue-500 font-bold' : 'text-gray-400'}`}>
                            {day.getDate()}
                          </p>
                        </div>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {dayAppointments.length === 0 ? (
                            <p className="text-xs text-gray-400 text-center py-4">Aucun rendez-vous</p>
                          ) : (
                            dayAppointments.map(apt => (
                              <div key={apt.id} className="bg-white rounded-lg p-2 shadow-sm border border-gray-100">
                                <p className="text-xs font-semibold text-blue-600">{formatTime(apt.date)}</p>
                                <p className="text-xs text-gray-800 font-medium mt-1 truncate">
                                  {patientName(apt.patient)}
                                </p>
                                {apt.status === 'EN_ATTENTE' && (
                                  <>
                                    <p className="text-xs text-amber-700 text-center mt-1 font-medium">
                                      En attente
                                    </p>
                                    <button
                                      type="button"
                                      onClick={() => handleConfirmPendingAppointment(apt)}
                                      className="w-full mt-2 py-1 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 transition"
                                    >
                                      Confirmer
                                    </button>
                                  </>
                                )}
                                {apt.status === 'CONFIRME' && new Date(apt.date) < new Date() && (
                                  <button
                                    onClick={() => {
                                      setSelectedAppointment(apt)
                                      setConsultNotes(apt.consultationNotes || '')
                                      setConsultPrescription(apt.prescription || '')
                                      setShowConsultModal(true)
                                    }}
                                    className="w-full mt-2 py-1 bg-green-500 text-white rounded text-xs font-semibold hover:bg-green-600 transition"
                                  >
                                    Valider
                                  </button>
                                )}
                                {apt.status === 'CONFIRME' && new Date(apt.date) > new Date() && (
                                  <p className="text-xs text-green-600 text-center mt-2">À venir</p>
                                )}
                                {apt.status === 'TERMINE' && (
                                  <p className="text-xs text-blue-600 text-center mt-2">Consulté</p>
                                )}
                                {apt.status === 'ANNULE' && (
                                  <p className="text-xs text-red-600 text-center mt-2">Annulé</p>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Tab: Disponibilités (intervalles backend) */}
            {activeTab === 'availability' && (
              <div className="max-w-3xl">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <ClockIcon className="w-6 h-6 text-blue-600" />
                  Fenêtres de disponibilité
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Définissez des plages (début / fin). Les patients ne pourront réserver que dans ces
                  intervalles ; chaque créneau affiché côté patient est découpé par pas de 30 minutes.
                </p>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-100">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <PlusCircleIcon className="w-5 h-5 text-blue-600" />
                    Nouvelle plage horaire
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Début
                      </label>
                      <input
                        type="datetime-local"
                        value={newSlotRange.dateDebut}
                        onChange={(e) =>
                          setNewSlotRange({ ...newSlotRange, dateDebut: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fin</label>
                      <input
                        type="datetime-local"
                        value={newSlotRange.dateFin}
                        onChange={(e) =>
                          setNewSlotRange({ ...newSlotRange, dateFin: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddAvailabilityRange}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-lg hover:shadow-lg transition-all font-medium"
                  >
                    Ajouter cette disponibilité
                  </button>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Mes plages actuelles</h3>
                  {availabilitySlots.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      Aucune plage. Ajoutez au moins une disponibilité pour que les patients puissent
                      réserver.
                    </p>
                  ) : (
                    <ul className="divide-y divide-gray-100 rounded-xl border border-gray-100 overflow-hidden">
                      {[...availabilitySlots]
                        .sort(
                          (a, b) =>
                            new Date(a.dateDebut).getTime() -
                            new Date(b.dateDebut).getTime()
                        )
                        .map((slot) => (
                          <li
                            key={slot.id}
                            className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-white hover:bg-gray-50"
                          >
                            <span className="text-sm text-gray-800">
                              Du{' '}
                              <strong>
                                {new Date(slot.dateDebut).toLocaleString('fr-FR')}
                              </strong>{' '}
                              au{' '}
                              <strong>
                                {new Date(slot.dateFin).toLocaleString('fr-FR')}
                              </strong>
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeleteAvailability(slot.id)}
                              className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-red-50"
                            >
                              <XMarkIcon className="w-4 h-4" />
                              Supprimer
                            </button>
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {/* Tab: Gestion des consultations */}
            {activeTab === 'patients' && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <UserGroupIcon className="w-6 h-6 text-blue-600" />
                  Gestion des consultations
                </h2>

                {appointments.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <UserGroupIcon className="w-12 h-12 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Aucune consultation</h3>
                    <p className="text-gray-500">Vous n'avez pas encore de consultations programmées</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((apt) => {
                      const isPast = new Date(apt.date) < new Date()
                      const isPending = apt.status === 'EN_ATTENTE'
                      const isUpcoming = apt.status === 'CONFIRME' && !isPast
                      const isCompleted = apt.status === 'TERMINE'
                      const isCancelled = apt.status === 'ANNULE'

                      let statusBadge = null
                      if (isCompleted) {
                        statusBadge = { label: '✅ Terminé', color: 'bg-blue-100 text-blue-700', icon: <CheckCircleIcon className="w-3 h-3" /> }
                      } else if (isCancelled) {
                        statusBadge = { label: '❌ Annulé', color: 'bg-red-100 text-red-700', icon: <XMarkIcon className="w-3 h-3" /> }
                      } else if (isPending) {
                        statusBadge = { label: '⏳ Demande à confirmer', color: 'bg-amber-100 text-amber-800', icon: <ClockIcon className="w-3 h-3" /> }
                      } else if (isUpcoming) {
                        statusBadge = { label: '📅 Confirmé', color: 'bg-green-100 text-green-700', icon: <CheckCircleIcon className="w-3 h-3" /> }
                      } else {
                        statusBadge = { label: '⏳ En attente', color: 'bg-yellow-100 text-yellow-700', icon: <ClockIcon className="w-3 h-3" /> }
                      }
                      
                      return (
                        <div
                          key={apt.id}
                          className={`group rounded-xl p-4 border transition-all duration-300 hover:shadow-md ${
                            isCancelled ? 'bg-red-50/30 border-red-100' :
                            isCompleted ? 'bg-gradient-to-r from-green-50 to-white border-green-100' :
                            'bg-gradient-to-r from-blue-50 to-white border-blue-100'
                          }`}
                        >
                          <div className="flex flex-wrap justify-between items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-md ${
                                  isCancelled ? 'bg-gradient-to-br from-red-500 to-rose-500' :
                                  isCompleted ? 'bg-gradient-to-br from-green-500 to-emerald-500' :
                                  'bg-gradient-to-br from-blue-500 to-purple-500'
                                }`}>
                                  {patientName(apt.patient)?.charAt(0) || 'P'}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-800">
                                    {patientName(apt.patient) || 'Patient'}
                                  </h3>
                                  <p className="text-xs text-gray-500">
                                    {patientEmail(apt.patient) || 'Email non disponible'}
                                  </p>
                                </div>
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${statusBadge.color}`}>
                                  {statusBadge.icon}
                                  {statusBadge.label}
                                </span>
                              </div>
                              <div className="ml-14">
                                <div className="flex items-center gap-4 text-sm flex-wrap">
                                  <span className="text-gray-600">
                                    📅 {formatDate(apt.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                  </span>
                                  <span className="text-gray-600">
                                    ⏰ {formatTime(apt.date)}
                                  </span>
                                </div>
                                {apt.consultationNotes && (
                                  <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                                    <span className="font-semibold">Notes:</span> {apt.consultationNotes}
                                  </div>
                                )}
                                {apt.prescription && (
                                  <div className="mt-1 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                                    <span className="font-semibold">Prescription:</span> {apt.prescription}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                              <button
                                onClick={() => handleViewDetails(apt)}
                                className="px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition flex items-center gap-1"
                              >
                                <EyeIcon className="w-4 h-4" />
                                Détails
                              </button>

                              {apt.status === 'EN_ATTENTE' && (
                                <button
                                  type="button"
                                  onClick={() => handleConfirmPendingAppointment(apt)}
                                  className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition flex items-center gap-1"
                                >
                                  <CheckCircleIcon className="w-4 h-4" />
                                  Confirmer le RDV
                                </button>
                              )}
                              
                              <button
                                onClick={() => openStatusModal(apt)}
                                className="px-3 py-1.5 text-sm text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition flex items-center gap-1"
                              >
                                <ClockIcon className="w-4 h-4" />
                                Changer statut
                              </button>
                              
                              {!isCompleted && !isCancelled && (
                                <button
                                  onClick={() => handleEditNotes(apt)}
                                  className="px-3 py-1.5 text-sm text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition flex items-center gap-1"
                                >
                                  <PencilIcon className="w-4 h-4" />
                                  Modifier
                                </button>
                              )}
                              
                              {apt.status === 'CONFIRME' && isPast && !isCompleted && (
                                <button
                                  onClick={() => {
                                    setSelectedAppointment(apt)
                                    setConsultNotes(apt.consultationNotes || '')
                                    setConsultPrescription(apt.prescription || '')
                                    setShowConsultModal(true)
                                  }}
                                  className="px-3 py-1.5 text-sm text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition flex items-center gap-1"
                                >
                                  <CheckCircleIcon className="w-4 h-4" />
                                  Valider
                                </button>
                              )}
                              
                              {!isCancelled && !isCompleted && (
                                <button
                                  onClick={() => handleCancelAppointment(apt)}
                                  className="px-3 py-1.5 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition flex items-center gap-1"
                                >
                                  <XMarkIcon className="w-4 h-4" />
                                  Annuler
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Consultation */}
      {showConsultModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 transform animate-scale-in shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <DocumentTextIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  {selectedAppointment.status === 'TERMINE' ? 'Modifier la consultation' : 'Valider la consultation'}
                </h3>
              </div>
              <button onClick={() => setShowConsultModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Patient</p>
                    <p className="font-semibold text-gray-800">{patientName(selectedAppointment.patient)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-semibold text-gray-800">
                      {formatDate(selectedAppointment.date, { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Heure</p>
                    <p className="font-semibold text-gray-800">{formatTime(selectedAppointment.date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="font-semibold text-gray-800">{patientEmail(selectedAppointment.patient)}</p>
                  </div>
                </div>
              </div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">Notes de consultation</label>
              <textarea
                value={consultNotes}
                onChange={(e) => setConsultNotes(e.target.value)}
                placeholder="Résumé de la consultation, symptômes, diagnostic..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-4"
              />

              <label className="block text-sm font-semibold text-gray-700 mb-2">Prescription / Recommandations</label>
              <textarea
                value={consultPrescription}
                onChange={(e) => setConsultPrescription(e.target.value)}
                placeholder="Médicaments prescrits, examens complémentaires, recommandations..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleValidateConsultation}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
              >
                {selectedAppointment.status === 'TERMINE' ? 'Enregistrer les modifications' : 'Valider la consultation'}
              </button>
              <button onClick={() => setShowConsultModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-all duration-300 font-semibold">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Détails Consultation */}
      {showDetailsModal && selectedAppointmentDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 transform animate-scale-in shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <DocumentTextIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Détails de la consultation</h3>
              </div>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Patient</p>
                    <p className="font-semibold text-gray-800">{patientName(selectedAppointmentDetails.patient)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Statut</p>
                    <p className="font-semibold text-gray-800">
                      {selectedAppointmentDetails.status === 'TERMINE' && '✅ Terminé'}
                      {selectedAppointmentDetails.status === 'CONFIRME' && '📅 Confirmé'}
                      {selectedAppointmentDetails.status === 'ANNULE' && '❌ Annulé'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-semibold text-gray-800">
                      {formatDate(selectedAppointmentDetails.date, { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Heure</p>
                    <p className="font-semibold text-gray-800">{formatTime(selectedAppointmentDetails.date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold text-gray-800">{patientEmail(selectedAppointmentDetails.patient)}</p>
                  </div>
                </div>
              </div>

              {selectedAppointmentDetails.consultationNotes && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    <DocumentTextIcon className="w-4 h-4" />
                    Notes de consultation
                  </h4>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">{selectedAppointmentDetails.consultationNotes}</p>
                </div>
              )}

              {selectedAppointmentDetails.prescription && (
                <div className="bg-green-50 rounded-xl p-4">
                  <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4" />
                    Prescription / Recommandations
                  </h4>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">{selectedAppointmentDetails.prescription}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowDetailsModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-all duration-300 font-semibold">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Changer statut */}
      {showStatusModal && selectedStatusAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 transform animate-scale-in shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <ClockIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Changer le statut</h3>
              </div>
              <button onClick={() => setShowStatusModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
                    {patientName(selectedStatusAppointment.patient)?.charAt(0) || 'P'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{patientName(selectedStatusAppointment.patient)}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(selectedStatusAppointment.date, { day: 'numeric', month: 'long' })} à {formatTime(selectedStatusAppointment.date)}
                    </p>
                  </div>
                </div>
              </div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">Nouveau statut</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="EN_ATTENTE">⏳ En attente validation</option>
                <option value="CONFIRME">✅ Confirmé</option>
                <option value="TERMINE">🏁 Terminé</option>
                <option value="ANNULE">❌ Annulé</option>
              </select>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700">
                  <span className="font-semibold">ℹ️ Information :</span> Le changement de statut sera visible immédiatement par le patient.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleChangeStatus}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
              >
                Modifier le statut
              </button>
              <button
                onClick={() => setShowStatusModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-all duration-300 font-semibold"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-slide-down { animation: slide-down 0.3s ease-out; }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-scale-in { animation: scale-in 0.2s ease-out; }
      `}</style>
    </div>
  )
}

export default DashboardDoctor