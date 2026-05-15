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
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'
import api from '../services/api'
import doctorService from '../services/doctorService'
import appointmentService from '../services/appointmentService'

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

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    const token = localStorage.getItem('token');
    console.log('🔑 Token présent:', token ? 'OUI' : 'NON');
    
    setLoading(true)
    try {
        const [usersRes, doctorsRes, appointmentsRes, specialtiesRes] = await Promise.all([
            api.get('/admin/users'),
            doctorService.getAllDoctors(),
            appointmentService.getMyAppointments(),
            api.get('/specialties')
        ])

      setUsers(usersRes.data || [])
      setDoctors(doctorsRes || [])
      setAppointments(appointmentsRes || [])
      setSpecialties(specialtiesRes.data || [])

      const savedReviews = localStorage.getItem('patientReviews')
      if (savedReviews) {
        const allReviews = JSON.parse(savedReviews)
        setReviews(allReviews)
      }

      calculateStats(usersRes.data || [], doctorsRes || [], appointmentsRes || [], specialtiesRes.data || [])
     } catch (error) {
        console.error('Erreur détaillée:', error.response?.data)
        showMessage('Erreur lors du chargement des données', 'error')
    }finally {
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
      upcomingAppointments: appointmentsList.filter(a => a.status === 'CONFIRME' && new Date(a.date) > now).length,
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
      CONFIRME: { bg: 'bg-green-100', text: 'text-green-700', label: 'Confirmé' },
      ANNULE: { bg: 'bg-red-100', text: 'text-red-700', label: 'Annulé' },
      TERMINE: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Terminé' }
    }
    const style = config[status] || config.CONFIRME
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>{style.label}</span>
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = !selectedRole || user.role === selectedRole
    return matchesSearch && matchesRole
  })

  const filteredAppointments = appointments.filter(apt => {
    return apt.patient?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           apt.doctor?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  })

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
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Médecin</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Spécialité</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredAppointments.map((apt) => (
                        <tr key={apt.id} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3 text-sm text-gray-600">{apt.id}</td>
                          <td className="px-4 py-3 font-medium text-gray-800">{apt.patient?.user?.name || 'N/A'}</td>
                          <td className="px-4 py-3 text-gray-800">Dr. {apt.doctor?.user?.name || 'N/A'}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{apt.doctor?.specialty?.name || 'Généraliste'}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {new Date(apt.date).toLocaleDateString('fr-FR')} à {new Date(apt.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="px-4 py-3">{getStatusBadge(apt.status)}</td>
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