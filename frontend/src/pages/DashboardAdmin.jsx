import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  UserGroupIcon,
  PlusCircleIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon,
  CheckCircleIcon,
  XMarkIcon,
  CalendarIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  ShieldCheckIcon,
  TrophyIcon,
  ClockIcon,
  StarIcon,
  FunnelIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'
import api from '../services/api'
import doctorService from '../services/doctorService'
import reviewService from '../services/reviewService'
import appointmentService from '../services/appointmentService'
import { doctorName, patientName, patientEmail } from '../utils/doctorPatient'

const APPOINTMENT_STATUSES = [
  { value: 'EN_ATTENTE', label: 'En attente' },
  { value: 'CONFIRME', label: 'Confirmé' },
  { value: 'TERMINE', label: 'Terminé' },
  { value: 'ANNULE', label: 'Annulé' }
]

function DashboardAdmin() {
  const [users, setUsers] = useState([])
  const [doctors, setDoctors] = useState([])
  const [specialties, setSpecialties] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')
  const [activeTab, setActiveTab] = useState('users')
  const [showUserModal, setShowUserModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'PATIENT' })
  const [showSpecialtyModal, setShowSpecialtyModal] = useState(false)
  const [editingSpecialty, setEditingSpecialty] = useState(null)
  const [specialtyName, setSpecialtyName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    upcomingAppointments: 0,
    totalSpecialties: 0,
    averageRating: 0
  })
  const [reviews, setReviews] = useState([])
  const [updatingAppointmentId, setUpdatingAppointmentId] = useState(null)

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      const usersRes = await api.get('/admin/users').catch((e) => {
        console.error('Admin utilisateurs:', e.response?.status, e.response?.data ?? e.message)
        return { data: [] }
      })
      const doctorsRes = await doctorService.getAllDoctors().catch((e) => {
        console.error('Médecins:', e.response?.status, e.response?.data ?? e.message)
        return []
      })
      const appointmentsRes = await api.get('/admin/appointments').catch((e) => {
        console.error('Rendez-vous admin:', e.response?.status, e.response?.data ?? e.message)
        const errMsg = e.response?.data?.message
        if (errMsg) {
          showMessage(errMsg, 'error')
        }
        return { data: [] }
      })
      const specialtiesRes = await api.get('/specialties').catch((e) => {
        console.error('Spécialités:', e.response?.status, e.response?.data ?? e.message)
        return { data: [] }
      })
      const reviewsRes = await reviewService.getAllReviewsAdmin().catch((e) => {
        console.error('Avis admin:', e.response?.status, e.response?.data ?? e.message)
        const errMsg = e.response?.data?.message
        if (errMsg) showMessage(errMsg, 'error')
        return []
      })

      const usersList = Array.isArray(usersRes.data) ? usersRes.data : []
      const doctorsList = Array.isArray(doctorsRes) ? doctorsRes : []
      const appointmentsList = Array.isArray(appointmentsRes.data) ? appointmentsRes.data : []
      const specialtiesList = Array.isArray(specialtiesRes.data) ? specialtiesRes.data : []

      setUsers(usersList)
      setDoctors(doctorsList)
      setAppointments(appointmentsList)
      setSpecialties(specialtiesList)
      setReviews(Array.isArray(reviewsRes) ? reviewsRes : [])

      calculateStats(usersList, doctorsList, appointmentsList, specialtiesList)
    } catch (error) {
      console.error('Erreur chargement admin:', error.response?.data ?? error)
      showMessage('Erreur lors du chargement des données', 'error')
    } finally {
      setTimeout(() => setLoading(false), 600)
    }
  }

  const calculateStats = (usersList, doctorsList, appointmentsList, specialtiesList) => {
    const now = new Date()
    setStats({
      totalUsers: usersList.length,
      totalDoctors: usersList.filter(u => u.role === 'MEDECIN').length,
      totalPatients: usersList.filter(u => u.role === 'PATIENT').length,
      totalAppointments: appointmentsList.length,
      completedAppointments: appointmentsList.filter(a => a.status === 'TERMINE').length,
      cancelledAppointments: appointmentsList.filter(a => a.status === 'ANNULE').length,
      upcomingAppointments: appointmentsList.filter(
        (a) =>
          (a.status === 'CONFIRME' || a.status === 'EN_ATTENTE') &&
          new Date(a.date) > now
      ).length,
      totalSpecialties: specialtiesList.length,
      averageRating: 4.8
    })
  }

  const showMessage = (msg, type = 'success') => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(''), 4000)
  }

  const handleAddUser = async () => {
    if (!userForm.name || !userForm.email || !userForm.password) {
      showMessage('Veuillez remplir tous les champs', 'error')
      return
    }
    try {
      await api.post('/auth/register', userForm)
      showMessage('Utilisateur ajouté avec succès', 'success')
      setShowUserModal(false)
      setUserForm({ name: '', email: '', password: '', role: 'PATIENT' })
      fetchAllData()
    } catch (error) {
      showMessage(error.response?.data?.message || 'Erreur lors de l\'ajout', 'error')
    }
  }

  const handleUpdateUser = async () => {
    if (!editingUser) return
    try {
      await api.put(`/admin/users/${editingUser.id}`, { ...editingUser, ...userForm })
      showMessage('Utilisateur modifié avec succès', 'success')
      setShowUserModal(false)
      setEditingUser(null)
      setUserForm({ name: '', email: '', password: '', role: 'PATIENT' })
      fetchAllData()
    } catch (error) {
      showMessage(error.response?.data?.message || 'Erreur lors de la modification', 'error')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return
    try {
      await api.delete(`/admin/users/${userId}`)
      showMessage('Utilisateur supprimé avec succès', 'success')
      fetchAllData()
    } catch (error) {
      showMessage('Erreur lors de la suppression', 'error')
    }
  }

  const handleAddSpecialty = async () => {
    if (!specialtyName.trim()) {
      showMessage('Veuillez entrer un nom de spécialité', 'error')
      return
    }
    try {
      await api.post('/admin/specialties', specialtyName, {
        headers: { 'Content-Type': 'text/plain' }
      })
      showMessage('Spécialité ajoutée avec succès', 'success')
      setShowSpecialtyModal(false)
      setSpecialtyName('')
      fetchAllData()
    } catch (error) {
      showMessage(error.response?.data?.message || 'Erreur lors de l\'ajout', 'error')
    }
  }

  const handleUpdateSpecialty = async () => {
    if (!editingSpecialty || !specialtyName.trim()) return
    try {
      await api.put(`/admin/specialties/${editingSpecialty.id}`, specialtyName, {
        headers: { 'Content-Type': 'text/plain' }
      })
      showMessage('Spécialité modifiée avec succès', 'success')
      setShowSpecialtyModal(false)
      setEditingSpecialty(null)
      setSpecialtyName('')
      fetchAllData()
    } catch (error) {
      showMessage('Erreur lors de la modification', 'error')
    }
  }

  const handleValidateReview = async (reviewId) => {
    try {
      await reviewService.validateReview(reviewId)
      showMessage('Avis validé — visible sur la page d’accueil', 'success')
      fetchAllData()
    } catch (error) {
      showMessage(error.response?.data?.message || 'Erreur lors de la validation', 'error')
    }
  }

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Supprimer définitivement cet avis ?')) return
    try {
      await reviewService.deleteReview(reviewId)
      showMessage('Avis supprimé', 'success')
      fetchAllData()
    } catch (error) {
      showMessage(error.response?.data?.message || 'Erreur lors de la suppression', 'error')
    }
  }

  const handleDeleteSpecialty = async (specialtyId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette spécialité ?')) return
    try {
      await api.delete(`/admin/specialties/${specialtyId}`)
      showMessage('Spécialité supprimée avec succès', 'success')
      fetchAllData()
    } catch (error) {
      showMessage('Erreur lors de la suppression', 'error')
    }
  }

  const getRoleBadge = (role) => {
    const config = {
      PATIENT: { bg: 'bg-green-100', text: 'text-green-700', label: '👤 Patient' },
      MEDECIN: { bg: 'bg-blue-100', text: 'text-blue-700', label: '👨‍⚕️ Médecin' },
      ADMINISTRATEUR: { bg: 'bg-purple-100', text: 'text-purple-700', label: '👑 Admin' }
    }
    const style = config[role] || config.PATIENT
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>{style.label}</span>
  }

  const getStatusBadge = (status) => {
    const config = {
      EN_ATTENTE: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'En attente' },
      CONFIRME: { bg: 'bg-green-100', text: 'text-green-700', label: 'Confirmé' },
      ANNULE: { bg: 'bg-red-100', text: 'text-red-700', label: 'Annulé' },
      TERMINE: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Terminé' }
    }
    const style = config[status] || config.EN_ATTENTE
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>{style.label}</span>
  }

  const refreshAppointmentsStats = (appointmentsList) => {
    calculateStats(users, doctors, appointmentsList, specialties)
  }

  const handleAppointmentStatusChange = async (apt, newStatus) => {
    if (!newStatus || newStatus === apt.status) return

    if (newStatus === 'ANNULE') {
      const ok = window.confirm(
        `Annuler le rendez-vous #${apt.id} (${patientName(apt.patient) || 'patient'}) ?`
      )
      if (!ok) return
    }

    setUpdatingAppointmentId(apt.id)
    try {
      let updated
      if (newStatus === 'ANNULE') {
        updated = await appointmentService.cancelAppointmentById(apt.id)
      } else if (newStatus === 'CONFIRME' && apt.status === 'EN_ATTENTE') {
        updated = await appointmentService.confirmAppointment(apt.id)
      } else {
        updated = await appointmentService.updateAppointmentStatus(apt.id, newStatus)
      }

      const nextList = appointments.map((a) => (a.id === apt.id ? updated : a))
      setAppointments(nextList)
      refreshAppointmentsStats(nextList)
      const mailTo = patientEmail(updated?.patient) || patientEmail(apt.patient)
      if (newStatus === 'CONFIRME' || newStatus === 'ANNULE') {
        showMessage(
          mailTo
            ? `Statut mis à jour. Notification email destinée à : ${mailTo} (boîte du patient, pas celle de l'admin)`
            : 'Statut mis à jour (email patient introuvable en base)',
          'success'
        )
      } else {
        showMessage('Statut du rendez-vous mis à jour', 'success')
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        'Impossible de modifier le statut'
      showMessage(typeof msg === 'string' ? msg : 'Erreur lors de la mise à jour du statut', 'error')
    } finally {
      setUpdatingAppointmentId(null)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = !selectedRole || user.role === selectedRole
    return matchesSearch && matchesRole
  })

  const filteredAppointments = appointments.filter((apt) => {
    const q = searchTerm.trim().toLowerCase()
    if (!q) return true
    const p = (patientName(apt.patient) || '').toLowerCase()
    const d = (doctorName(apt.doctor) || '').toLowerCase()
    return p.includes(q) || d.includes(q)
  })

  const filteredReviews = reviews.filter((r) => {
    const q = searchTerm.trim().toLowerCase()
    if (!q) return true
    const p = (patientName(r.patient) || '').toLowerCase()
    const d = (doctorName(r.doctor) || '').toLowerCase()
    const c = (r.commentaire || '').toLowerCase()
    return p.includes(q) || d.includes(q) || c.includes(q)
  })

  const renderStars = (note) => (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) =>
        i <= note ? (
          <StarSolidIcon key={i} className="w-4 h-4 text-yellow-400" />
        ) : (
          <StarIcon key={i} className="w-4 h-4 text-gray-300" />
        )
      )}
    </span>
  )

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
          <p className="mt-6 text-gray-600 font-medium">Chargement de l'espace administrateur...</p>
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
                Espace administrateur
              </p>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Tableau de bord
              </h1>
              <p className="mt-2 text-blue-100">Supervision complète de la plateforme</p>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
              <ShieldCheckIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Administrateur</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Utilisateurs</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalUsers}</p>
                <p className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                  <UserGroupIcon className="w-3 h-3" />
                  {stats.totalDoctors} médecins, {stats.totalPatients} patients
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <UserGroupIcon className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Rendez-vous</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalAppointments}</p>
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                  <CheckCircleIcon className="w-3 h-3" />
                  {stats.completedAppointments} terminés
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <CalendarIcon className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Spécialités</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalSpecialties}</p>
                <p className="text-xs text-purple-600 mt-2 flex items-center gap-1">
                  <StarIcon className="w-3 h-3" />
                  Domaines médicaux
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <ChartBarIcon className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Taux complétion</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {Math.round((stats.completedAppointments / (stats.totalAppointments || 1)) * 100)}%
                </p>
                <p className="text-xs text-yellow-600 mt-2 flex items-center gap-1">
                  <TrophyIcon className="w-3 h-3" />
                  Performance globale
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <TrophyIcon className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 mb-6">
          <div className="border-b border-gray-100">
            <nav className="flex flex-wrap gap-2 px-6" aria-label="Tabs">
              {[
                { id: 'users', label: '👥 Utilisateurs', icon: <UserGroupIcon className="w-5 h-5" /> },
                { id: 'specialties', label: '🏥 Spécialités', icon: <StarIcon className="w-5 h-5" /> },
                { id: 'appointments', label: '📅 Rendez-vous', icon: <CalendarIcon className="w-5 h-5" /> },
                { id: 'reviews', label: '💬 Avis', icon: <ChatBubbleLeftRightIcon className="w-5 h-5" /> },
                { id: 'statistics', label: '📊 Statistiques', icon: <ChartBarIcon className="w-5 h-5" /> }
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
            {/* Tab: Utilisateurs */}
            {activeTab === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <UserGroupIcon className="w-6 h-6 text-blue-600" />
                    Gestion des utilisateurs
                  </h2>
                  <div className="flex gap-3">
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Tous les rôles</option>
                      <option value="PATIENT">Patients</option>
                      <option value="MEDECIN">Médecins</option>
                      <option value="ADMINISTRATEUR">Administrateurs</option>
                    </select>
                    <button
                      onClick={() => {
                        setEditingUser(null)
                        setUserForm({ name: '', email: '', password: '', role: 'PATIENT' })
                        setShowUserModal(true)
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                    >
                      <PlusCircleIcon className="w-4 h-4" />
                      Ajouter
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Nom</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Rôle</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3 text-sm text-gray-600">{user.id}</td>
                          <td className="px-4 py-3 font-medium text-gray-800">{user.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                          <td className="px-4 py-3">{getRoleBadge(user.role)}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingUser(user)
                                  setUserForm({ name: user.name, email: user.email, password: '', role: user.role })
                                  setShowUserModal(true)
                                }}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                                disabled={user.role === 'ADMINISTRATEUR'}
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredUsers.length === 0 && (
                  <div className="text-center py-12">
                    <UserGroupIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Aucun utilisateur trouvé</p>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Spécialités */}
            {activeTab === 'specialties' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <StarIcon className="w-6 h-6 text-blue-600" />
                    Gestion des spécialités
                  </h2>
                  <button
                    onClick={() => {
                      setEditingSpecialty(null)
                      setSpecialtyName('')
                      setShowSpecialtyModal(true)
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <PlusCircleIcon className="w-4 h-4" />
                    Ajouter une spécialité
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {specialties.map((specialty) => (
                    <div key={specialty.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition group">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                            <StarIcon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{specialty.name}</h3>
                            <p className="text-xs text-gray-500">ID: {specialty.id}</p>
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                          <button
                            onClick={() => {
                              setEditingSpecialty(specialty)
                              setSpecialtyName(specialty.name)
                              setShowSpecialtyModal(true)
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSpecialty(specialty.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {specialties.length === 0 && (
                  <div className="text-center py-12">
                    <StarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Aucune spécialité enregistrée</p>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Rendez-vous */}
            {activeTab === 'appointments' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <CalendarIcon className="w-6 h-6 text-blue-600" />
                    Supervision des rendez-vous
                  </h2>
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher par patient ou médecin..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Patient</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Email patient</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Médecin</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Spécialité</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Statut</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredAppointments.map((apt) => (
                        <tr key={apt.id} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3 text-sm text-gray-600">{apt.id}</td>
                          <td className="px-4 py-3 font-medium text-gray-800">{patientName(apt.patient) || 'N/A'}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{patientEmail(apt.patient) || '—'}</td>
                          <td className="px-4 py-3 text-gray-800">Dr. {doctorName(apt.doctor) || 'N/A'}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{apt.doctor?.specialty?.name || 'Généraliste'}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {new Date(apt.date).toLocaleDateString('fr-FR')} à {new Date(apt.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="px-4 py-3">{getStatusBadge(apt.status)}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <select
                                value={apt.status}
                                disabled={updatingAppointmentId === apt.id}
                                onChange={(e) => handleAppointmentStatusChange(apt, e.target.value)}
                                className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 min-w-[8.5rem]"
                                aria-label={`Changer le statut du rendez-vous ${apt.id}`}
                              >
                                {APPOINTMENT_STATUSES.map((s) => (
                                  <option key={s.value} value={s.value}>
                                    {s.label}
                                  </option>
                                ))}
                              </select>
                              {updatingAppointmentId === apt.id && (
                                <ArrowPathIcon className="w-4 h-4 text-blue-600 animate-spin" />
                              )}
                              {apt.status === 'EN_ATTENTE' && (
                                <button
                                  type="button"
                                  disabled={updatingAppointmentId === apt.id}
                                  onClick={() => handleAppointmentStatusChange(apt, 'CONFIRME')}
                                  className="text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 px-2 py-1 rounded-lg disabled:opacity-50"
                                >
                                  Confirmer
                                </button>
                              )}
                              {apt.status !== 'ANNULE' && apt.status !== 'TERMINE' && (
                                <button
                                  type="button"
                                  disabled={updatingAppointmentId === apt.id}
                                  onClick={() => handleAppointmentStatusChange(apt, 'ANNULE')}
                                  className="text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 px-2 py-1 rounded-lg disabled:opacity-50"
                                >
                                  Annuler
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredAppointments.length === 0 && (
                  <div className="text-center py-12">
                    <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Aucun rendez-vous trouvé</p>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Avis */}
            {activeTab === 'reviews' && (
              <div>
                <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-600" />
                    Modération des avis
                  </h2>
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher un avis..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                    />
                  </div>
                </div>

                <p className="text-sm text-gray-500 mb-4">
                  Validez un avis pour l’afficher dans la section « Avis » de la page d’accueil. Les avis en attente ne sont pas publics.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Patient</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Médecin</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Note</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Commentaire</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Statut</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredReviews.map((r) => (
                        <tr key={r.id} className="hover:bg-gray-50 transition align-top">
                          <td className="px-4 py-3 text-sm text-gray-600">{r.id}</td>
                          <td className="px-4 py-3 font-medium text-gray-800">{patientName(r.patient) || '—'}</td>
                          <td className="px-4 py-3 text-gray-800">
                            Dr. {doctorName(r.doctor) || '—'}
                            <span className="block text-xs text-gray-500">{r.doctor?.specialty?.name || ''}</span>
                          </td>
                          <td className="px-4 py-3">{renderStars(r.note)}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 max-w-xs">{r.commentaire}</td>
                          <td className="px-4 py-3">
                            {r.validated ? (
                              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                Publié
                              </span>
                            ) : (
                              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                                En attente
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2 flex-wrap">
                              {!r.validated && (
                                <button
                                  type="button"
                                  onClick={() => handleValidateReview(r.id)}
                                  className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 flex items-center gap-1"
                                >
                                  <CheckCircleIcon className="w-4 h-4" />
                                  Valider
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteReview(r.id)}
                                className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-medium rounded-lg hover:bg-red-200 flex items-center gap-1"
                              >
                                <TrashIcon className="w-4 h-4" />
                                Supprimer
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredReviews.length === 0 && (
                  <div className="text-center py-12">
                    <ChatBubbleLeftRightIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Aucun avis à modérer</p>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Statistiques */}
            {activeTab === 'statistics' && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <ChartBarIcon className="w-6 h-6 text-blue-600" />
                  Statistiques détaillées
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Utilisateurs */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <UserGroupIcon className="w-5 h-5 text-blue-600" />
                      Utilisateurs
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total utilisateurs</span>
                        <span className="font-bold text-gray-800">{stats.totalUsers}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Médecins</span>
                        <span className="font-bold text-blue-600">{stats.totalDoctors}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Patients</span>
                        <span className="font-bold text-green-600">{stats.totalPatients}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Administrateurs</span>
                        <span className="font-bold text-purple-600">{stats.totalUsers - stats.totalDoctors - stats.totalPatients}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rendez-vous */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-emerald-600" />
                      Rendez-vous
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total RDV</span>
                        <span className="font-bold text-gray-800">{stats.totalAppointments}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Terminés</span>
                        <span className="font-bold text-green-600">{stats.completedAppointments}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Annulés</span>
                        <span className="font-bold text-red-600">{stats.cancelledAppointments}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">À venir</span>
                        <span className="font-bold text-blue-600">{stats.upcomingAppointments}</span>
                      </div>
                    </div>
                  </div>

                  {/* Spécialités */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <StarIcon className="w-5 h-5 text-purple-600" />
                      Spécialités
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Nombre de spécialités</span>
                        <span className="font-bold text-gray-800">{stats.totalSpecialties}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Médecins par spécialité</span>
                        <span className="font-bold text-gray-800">{Math.round(stats.totalDoctors / (stats.totalSpecialties || 1))}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Note moyenne</span>
                        <span className="font-bold text-yellow-600">{stats.averageRating}/5</span>
                      </div>
                    </div>
                  </div>

                  {/* Performance */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <TrophyIcon className="w-5 h-5 text-yellow-600" />
                      Performance
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Taux de complétion</span>
                        <span className="font-bold text-green-600">
                          {Math.round((stats.completedAppointments / (stats.totalAppointments || 1)) * 100)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Taux d'annulation</span>
                        <span className="font-bold text-red-600">
                          {Math.round((stats.cancelledAppointments / (stats.totalAppointments || 1)) * 100)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">RDV/médecin</span>
                        <span className="font-bold text-blue-600">
                          {Math.round(stats.totalAppointments / (stats.totalDoctors || 1))}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Utilisateur */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 transform animate-scale-in shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <UserGroupIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  {editingUser ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
                </h3>
              </div>
              <button onClick={() => setShowUserModal(false)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nom complet</label>
                <input
                  type="text"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Jean Dupont"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="jean@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {editingUser ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe'}
                </label>
                <input
                  type="password"
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Rôle</label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PATIENT">Patient</option>
                  <option value="MEDECIN">Médecin</option>
                  <option value="ADMINISTRATEUR">Administrateur</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={editingUser ? handleUpdateUser : handleAddUser}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg hover:shadow-lg transition-all font-semibold"
              >
                {editingUser ? 'Modifier' : 'Ajouter'}
              </button>
              <button
                onClick={() => setShowUserModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-all font-semibold"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Spécialité */}
      {showSpecialtyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 transform animate-scale-in shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <StarIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  {editingSpecialty ? 'Modifier la spécialité' : 'Ajouter une spécialité'}
                </h3>
              </div>
              <button onClick={() => setShowSpecialtyModal(false)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nom de la spécialité</label>
              <input
                type="text"
                value={specialtyName}
                onChange={(e) => setSpecialtyName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Cardiologie"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={editingSpecialty ? handleUpdateSpecialty : handleAddSpecialty}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg hover:shadow-lg transition-all font-semibold"
              >
                {editingSpecialty ? 'Modifier' : 'Ajouter'}
              </button>
              <button
                onClick={() => setShowSpecialtyModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-all font-semibold"
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

export default DashboardAdmin