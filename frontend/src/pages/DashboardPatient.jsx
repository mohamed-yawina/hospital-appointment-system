import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { pdf } from '@react-pdf/renderer'
import {
  CalendarIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  XMarkIcon,
  CheckCircleIcon,
  PlusCircleIcon,
  TrashIcon,
  SparklesIcon,
  TrophyIcon,
  ShieldCheckIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'
import appointmentService from '../services/appointmentService'
import doctorService from '../services/doctorService'
import AppointmentPDF from '../components/AppointmentPDF'

/* ─── Design tokens ──────────────────────────────────────────────────── */
const style = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --c-bg:       #f0f4f9;
    --c-surface:  #ffffff;
    --c-border:   #e2e9f3;
    --c-text:     #0d1b2e;
    --c-muted:    #6b7d95;
    --c-accent:   #1a5cf6;
    --c-accent2:  #7c3aed;
    --c-green:    #059669;
    --c-red:      #dc2626;
    --c-gold:     #d97706;
    --r-card:     18px;
    --shadow-sm:  0 1px 4px rgba(13,27,46,.06), 0 4px 16px rgba(13,27,46,.04);
    --shadow-md:  0 4px 20px rgba(13,27,46,.10);
    --shadow-lg:  0 12px 40px rgba(26,92,246,.18);
  }

  .dp-root * { box-sizing: border-box; font-family: 'DM Sans', sans-serif; }
  .dp-root h1, .dp-root h2, .dp-root h3, .dp-root .syne { font-family: 'Syne', sans-serif; }

  .dp-header {
    background: linear-gradient(135deg, #0d1b2e 0%, #1a3260 50%, #1e1b4b 100%);
    position: relative; overflow: hidden;
  }
  .dp-header::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse at 80% 20%, rgba(26,92,246,.35) 0%, transparent 60%),
                radial-gradient(ellipse at 10% 80%, rgba(124,58,237,.25) 0%, transparent 60%);
  }
  .dp-header-grid {
    position: absolute; inset: 0; opacity: .06;
    background-image: linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  .stat-card {
    background: var(--c-surface); border-radius: var(--r-card);
    border: 1px solid var(--c-border); padding: 24px;
    box-shadow: var(--shadow-sm);
    transition: transform .25s ease, box-shadow .25s ease;
  }
  .stat-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }
  .stat-icon {
    width: 52px; height: 52px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    transition: transform .25s ease;
  }
  .stat-card:hover .stat-icon { transform: scale(1.1) rotate(-4deg); }

  .tab-bar { background: var(--c-surface); border-radius: var(--r-card); border: 1px solid var(--c-border); overflow: hidden; }
  .tab-btn {
    display: flex; align-items: center; gap: 8px; padding: 16px 20px;
    font-size: 14px; font-weight: 500; color: var(--c-muted);
    border: none; background: none; cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: color .2s, border-color .2s, background .2s;
    white-space: nowrap;
  }
  .tab-btn:hover { color: var(--c-text); background: #f7f9fc; }
  .tab-btn.active { color: var(--c-accent); border-bottom-color: var(--c-accent); }
  .tab-badge {
    font-size: 11px; font-weight: 600; padding: 2px 7px; border-radius: 20px;
    background: #e8eeff; color: var(--c-accent);
  }
  .tab-btn.active .tab-badge { background: var(--c-accent); color: #fff; }

  .apt-card {
    background: var(--c-surface); border-radius: 14px;
    border: 1px solid var(--c-border); padding: 18px 20px;
    box-shadow: var(--shadow-sm);
    transition: box-shadow .2s, transform .2s;
  }
  .apt-card:hover { box-shadow: var(--shadow-md); transform: translateX(3px); }
  .apt-card.upcoming { border-left: 3px solid var(--c-accent); }
  .apt-card.past { border-left: 3px solid var(--c-border); }

  .doc-card {
    background: var(--c-surface); border-radius: var(--r-card);
    border: 1px solid var(--c-border); overflow: hidden;
    box-shadow: var(--shadow-sm);
    transition: box-shadow .25s, transform .25s, border-color .25s;
  }
  .doc-card:hover { box-shadow: var(--shadow-md); transform: translateY(-3px); border-color: #c7d9ff; }
  .doc-avatar {
    width: 56px; height: 56px; border-radius: 14px;
    background: linear-gradient(135deg, var(--c-accent), var(--c-accent2));
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 22px; font-weight: 700;
    font-family: 'Syne', sans-serif;
    transition: transform .25s;
    flex-shrink: 0;
  }
  .doc-card:hover .doc-avatar { transform: scale(1.06) rotate(-3deg); }

  .search-wrap { position: relative; }
  .search-wrap input {
    width: 100%; padding: 12px 16px 12px 46px;
    border: 1.5px solid var(--c-border); border-radius: 12px;
    font-size: 14px; color: var(--c-text); background: var(--c-surface);
    transition: border-color .2s, box-shadow .2s; outline: none;
  }
  .search-wrap input:focus { border-color: var(--c-accent); box-shadow: 0 0 0 3px rgba(26,92,246,.12); }
  .search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); }

  .btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 20px; border-radius: 10px; font-weight: 600; font-size: 14px;
    background: linear-gradient(135deg, var(--c-accent), var(--c-accent2));
    color: #fff; border: none; cursor: pointer;
    box-shadow: 0 4px 14px rgba(26,92,246,.3);
    transition: opacity .2s, transform .2s, box-shadow .2s;
  }
  .btn-primary:hover { opacity: .92; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(26,92,246,.38); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .btn-ghost {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 14px; border-radius: 9px; font-size: 13px; font-weight: 500;
    border: 1.5px solid var(--c-border); background: none; cursor: pointer; color: var(--c-muted);
    transition: background .2s, color .2s, border-color .2s;
  }
  .btn-ghost:hover { background: #f3f4f6; color: var(--c-text); }
  .btn-danger { color: var(--c-red); border-color: #fee2e2; }
  .btn-danger:hover { background: #fef2f2; border-color: #fca5a5; color: var(--c-red); }
  .btn-purple { color: var(--c-accent2); border-color: #ede9fe; }
  .btn-purple:hover { background: #f5f3ff; border-color: #c4b5fd; color: var(--c-accent2); }

  .badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; letter-spacing: .02em;
  }
  .badge-green { background: #d1fae5; color: #065f46; }
  .badge-blue  { background: #dbeafe; color: #1e40af; }
  .badge-red   { background: #fee2e2; color: #991b1b; }
  .badge-gray  { background: #f3f4f6; color: #6b7280; }

  .stars { display: flex; gap: 2px; }

  .modal-overlay {
    position: fixed; inset: 0; z-index: 50;
    background: rgba(13,27,46,.55); backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center; padding: 16px;
    animation: fadeIn .2s ease;
  }
  .modal-box {
    background: var(--c-surface); border-radius: 22px;
    max-width: 460px; width: 100%; padding: 28px;
    box-shadow: 0 24px 80px rgba(13,27,46,.25);
    animation: scaleIn .22s ease;
  }

  .toast {
    position: fixed; top: 88px; right: 20px; z-index: 100;
    padding: 14px 18px; border-radius: 13px;
    display: flex; align-items: center; gap: 10px;
    font-size: 13px; font-weight: 500; max-width: 360px;
    box-shadow: 0 8px 30px rgba(0,0,0,.18);
    animation: slideDown .3s cubic-bezier(.34,1.56,.64,1);
  }
  .toast-success { background: #064e3b; color: #a7f3d0; }
  .toast-error   { background: #7f1d1d; color: #fecaca; }

  .section-label {
    font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase;
    color: var(--c-muted); margin-bottom: 12px; display: flex; align-items: center; gap: 6px;
  }

  .date-input {
    width: 100%; padding: 10px 14px; border: 1.5px solid var(--c-border); border-radius: 10px;
    font-size: 14px; outline: none; color: var(--c-text);
    transition: border-color .2s, box-shadow .2s;
  }
  .date-input:focus { border-color: var(--c-accent); box-shadow: 0 0 0 3px rgba(26,92,246,.1); }

  .sel {
    padding: 11px 16px; border: 1.5px solid var(--c-border); border-radius: 12px;
    font-size: 14px; background: var(--c-surface); color: var(--c-text); outline: none; cursor: pointer;
    transition: border-color .2s;
  }
  .sel:focus { border-color: var(--c-accent); }

  .ta {
    width: 100%; padding: 12px 14px; border: 1.5px solid var(--c-border); border-radius: 12px;
    font-size: 14px; resize: none; outline: none; color: var(--c-text); line-height: 1.6;
    transition: border-color .2s, box-shadow .2s;
  }
  .ta:focus { border-color: var(--c-accent); box-shadow: 0 0 0 3px rgba(26,92,246,.1); }

  .review-card {
    background: var(--c-surface); border-radius: 14px; padding: 20px;
    border: 1px solid var(--c-border); box-shadow: var(--shadow-sm);
    transition: box-shadow .2s;
  }
  .review-card:hover { box-shadow: var(--shadow-md); }

  .empty-state {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 64px 24px; text-align: center;
  }
  .empty-icon-wrap {
    width: 88px; height: 88px; border-radius: 50%;
    background: linear-gradient(135deg, #e8eeff, #ede9fe);
    display: flex; align-items: center; justify-content: center; margin-bottom: 20px;
  }

  .spinner-ring {
    width: 64px; height: 64px; position: relative; margin: 0 auto;
  }
  .spinner-ring::before {
    content: ''; position: absolute; inset: 0; border-radius: 50%;
    border: 4px solid #e2e9f3;
  }
  .spinner-ring::after {
    content: ''; position: absolute; inset: 0; border-radius: 50%;
    border: 4px solid transparent; border-top-color: var(--c-accent);
    animation: spin .75s linear infinite;
  }

  @keyframes spin     { to { transform: rotate(360deg); } }
  @keyframes fadeIn   { from { opacity: 0; } to { opacity: 1; } }
  @keyframes scaleIn  { from { transform: scale(.94); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  @keyframes slideDown { from { transform: translateY(-16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
`

function StatusBadge({ status, date }) {
  const isPast = new Date(date) < new Date()
  if (status === 'CONFIRME' && !isPast) return <span className="badge badge-green"><CheckCircleIcon style={{width:12,height:12}}/>Confirmé</span>
  if (status === 'CONFIRME' && isPast)  return <span className="badge badge-gray"><ClockIcon style={{width:12,height:12}}/>Passé</span>
  if (status === 'ANNULE')              return <span className="badge badge-red"><XMarkIcon style={{width:12,height:12}}/>Annulé</span>
  if (status === 'TERMINE')             return <span className="badge badge-blue"><CheckCircleIcon style={{width:12,height:12}}/>Terminé</span>
  return null
}

function Stars({ rating, size = 14 }) {
  return (
    <span className="stars">
      {[1,2,3,4,5].map(i =>
        i <= rating
          ? <StarSolidIcon key={i} style={{width:size,height:size,color:'#d97706'}}/>
          : <StarIcon key={i} style={{width:size,height:size,color:'#d1d5db'}}/>
      )}
    </span>
  )
}

function DashboardPatient() {
  const [appointments, setAppointments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [appointmentDate, setAppointmentDate] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [specialties, setSpecialties] = useState([])
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [selectedAppointmentForReview, setSelectedAppointmentForReview] = useState(null)
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' })
  const [reviews, setReviews] = useState([])
  const [activeTab, setActiveTab] = useState('appointments')
  const [upcomingAppointments, setUpcomingAppointments] = useState([])
  const [pastAppointments, setPastAppointments] = useState([])
  const [isBooking, setIsBooking] = useState(false)

  useEffect(() => { fetchData() }, [])

  useEffect(() => {
    const now = new Date()
    setUpcomingAppointments(appointments.filter(a => a.status === 'CONFIRME' && new Date(a.date) > now))
    setPastAppointments(appointments.filter(a => a.status === 'TERMINE' || a.status === 'ANNULE' || (a.status === 'CONFIRME' && new Date(a.date) < now)))
  }, [appointments])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [appointmentsData, doctorsData] = await Promise.all([
        appointmentService.getMyAppointments(),
        doctorService.getAllDoctors()
      ])
      setAppointments(appointmentsData || [])
      setDoctors(doctorsData || [])
      setSpecialties([...new Set(doctorsData.map(d => d.specialty?.name).filter(Boolean))])
      const saved = localStorage.getItem('patientReviews')
      if (saved) setReviews(JSON.parse(saved))
    } catch (error) {
      console.error('Erreur chargement:', error)
      showMessage('Erreur lors du chargement des données', 'error')
    } finally {
      setTimeout(() => setLoading(false), 600)
    }
  }

  const showMessage = (msg, type = 'success') => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(''), 4000)
  }

  const isAvailableThisWeek = (doctor) => {
    if (!doctor.availability) return false
    try {
      const availability = JSON.parse(doctor.availability)
      const today = new Date()
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      const currentDay = dayNames[today.getDay()]
      return availability[currentDay] && availability[currentDay].length > 0
    } catch {
      return false
    }
  }

  const getPatientCount = (doctorId) => {
    return appointments.filter(a => a.doctor?.id === doctorId && a.status === 'TERMINE').length
  }

  const handleBookAppointment = async () => {
    if (!appointmentDate) {
      showMessage('Veuillez sélectionner une date et heure', 'error')
      return
    }
    
    if (isBooking) return
    
    setIsBooking(true)
    
    try {
      const response = await appointmentService.createAppointment({ 
        doctorId: selectedDoctor.id, 
        date: appointmentDate 
      })
      
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const blob = await pdf(
        <AppointmentPDF 
          appointment={response} 
          doctor={selectedDoctor} 
          patient={user} 
        />
      ).toBlob()

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `rendez-vous_${response.id}_${new Date().toISOString().split('T')[0]}.pdf`
      link.click()
      URL.revokeObjectURL(url)
      
      showMessage('Rendez-vous réservé ! Le PDF a été téléchargé.', 'success')
      setSelectedDoctor(null)
      setAppointmentDate('')
      fetchData()
    } catch (error) {
      console.error('Erreur réservation:', error)
      showMessage(error.response?.data?.message || 'Erreur lors de la réservation', 'error')
    } finally {
      setIsBooking(false)
    }
  }

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) return
    try {
      await appointmentService.cancelAppointment(id)
      showMessage('Rendez-vous annulé avec succès', 'success')
      fetchData()
    } catch (error) {
      console.error('Erreur annulation:', error)
      showMessage('Erreur lors de l\'annulation', 'error')
    }
  }

  const handleSubmitReview = () => {
    if (!reviewData.comment.trim()) {
      showMessage('Veuillez écrire un commentaire', 'error')
      return
    }
    const newReview = {
      id: Date.now(),
      doctorId: selectedAppointmentForReview.doctor.id,
      doctorName: selectedAppointmentForReview.doctor.user.name,
      doctorSpecialty: selectedAppointmentForReview.doctor.specialty?.name,
      doctorAvatar: selectedAppointmentForReview.doctor.user.name?.charAt(0) || 'D',
      patientName: JSON.parse(localStorage.getItem('user'))?.name,
      rating: reviewData.rating,
      comment: reviewData.comment,
      date: new Date().toISOString(),
      appointmentId: selectedAppointmentForReview.id
    }
    const updated = [newReview, ...reviews]
    setReviews(updated)
    localStorage.setItem('patientReviews', JSON.stringify(updated))
    setShowReviewModal(false)
    setReviewData({ rating: 5, comment: '' })
    setSelectedAppointmentForReview(null)
    showMessage('Merci pour votre avis !', 'success')
  }

  const filteredDoctors = doctors.filter(d => {
    const query = searchTerm.toLowerCase()
    const matchesSearch = (d.user?.name?.toLowerCase().includes(query) || d.specialty?.name?.toLowerCase().includes(query))
    const matchesSpecialty = !selectedSpecialty || d.specialty?.name === selectedSpecialty
    return matchesSearch && matchesSpecialty
  })

  const getAverageRating = (id) => {
    const doctorReviews = reviews.filter(r => r.doctorId === id)
    return doctorReviews.length ? (doctorReviews.reduce((sum, r) => sum + r.rating, 0) / doctorReviews.length).toFixed(1) : null
  }

  const avgReview = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '—'

  if (loading) {
    return (
      <div className="dp-root" style={{minHeight:'100vh', background:'var(--c-bg)', display:'flex', alignItems:'center', justifyContent:'center'}}>
        <style>{style}</style>
        <div style={{textAlign:'center'}}>
          <div className="spinner-ring" style={{marginBottom:20}}/>
          <p className="syne" style={{color:'var(--c-text)', fontWeight:600, fontSize:16}}>Chargement de votre espace santé</p>
          <p style={{color:'var(--c-muted)', fontSize:13, marginTop:4}}>Préparation de vos données…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dp-root" style={{minHeight:'100vh', background:'var(--c-bg)'}}>
      <style>{style}</style>

      {message && (
        <div className={`toast ${messageType === 'success' ? 'toast-success' : 'toast-error'}`}>
          {messageType === 'success'
            ? <CheckCircleIcon style={{width:18,height:18,flexShrink:0}}/>
            : <XMarkIcon style={{width:18,height:18,flexShrink:0}}/>}
          <span style={{flex:1}}>{message}</span>
          <button onClick={() => setMessage('')} style={{background:'none',border:'none',cursor:'pointer',color:'inherit',opacity:.7}}>
            <XMarkIcon style={{width:14,height:14}}/>
          </button>
        </div>
      )}

      <div className="dp-header">
        <div className="dp-header-grid"/>
        <div style={{position:'relative', maxWidth:1200, margin:'0 auto', padding:'36px 24px'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:16}}>
            <div>
              <p style={{color:'rgba(255,255,255,.5)', fontSize:13, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:8}}>
                Espace patient
              </p>
              <h1 className="syne" style={{color:'#fff', fontSize:36, fontWeight:800, lineHeight:1.1, margin:0}}>
                Tableau de bord
              </h1>
              <p style={{color:'rgba(255,255,255,.6)', fontSize:14, marginTop:8}}>
                Gérez vos rendez-vous médicaux en toute simplicité
              </p>
            </div>
            <div style={{
              display:'flex', alignItems:'center', gap:8, padding:'10px 16px',
              background:'rgba(255,255,255,.1)', borderRadius:12, backdropFilter:'blur(8px)',
              border:'1px solid rgba(255,255,255,.15)'
            }}>
              <ShieldCheckIcon style={{width:16,height:16,color:'rgba(255,255,255,.8)'}}/>
              <span style={{color:'rgba(255,255,255,.8)', fontSize:13, fontWeight:500}}>Données sécurisées</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{maxWidth:1200, margin:'0 auto', padding:'32px 24px'}}>

        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(230px,1fr))', gap:20, marginBottom:28}}>
          {[
            { label:'Total rendez-vous', value:appointments.length, sub:`${appointments.length} consultation(s)`, subColor:'var(--c-green)', icon:<CalendarIcon style={{width:24,height:24,color:'#fff'}}/>, grad:'linear-gradient(135deg,#1a5cf6,#2563eb)' },
            { label:'RDV à venir', value:upcomingAppointments.length, sub:'Prochainement', subColor:'var(--c-accent)', icon:<ClockIcon style={{width:24,height:24,color:'#fff'}}/>, grad:'linear-gradient(135deg,#059669,#10b981)' },
            { label:'Médecins disponibles', value:doctors.length, sub:`${specialties.length} spécialités`, subColor:'var(--c-accent2)', icon:<UserGroupIcon style={{width:24,height:24,color:'#fff'}}/>, grad:'linear-gradient(135deg,#7c3aed,#8b5cf6)' },
            { label:'Avis donnés', value:reviews.length, sub:`Note moy. ${avgReview}/5`, subColor:'var(--c-gold)', icon:<StarIcon style={{width:24,height:24,color:'#fff'}}/>, grad:'linear-gradient(135deg,#d97706,#f59e0b)' },
          ].map((s,i) => (
            <div key={i} className="stat-card">
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                <div>
                  <p style={{color:'var(--c-muted)', fontSize:12, fontWeight:500, marginBottom:6}}>{s.label}</p>
                  <p className="syne" style={{fontSize:34, fontWeight:800, color:'var(--c-text)', margin:0, lineHeight:1}}>{s.value}</p>
                  <p style={{fontSize:11, color:s.subColor, marginTop:8, fontWeight:600}}>{s.sub}</p>
                </div>
                <div className="stat-icon" style={{background:s.grad}}>{s.icon}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="tab-bar" style={{marginBottom:20}}>
          <div style={{display:'flex', overflowX:'auto', borderBottom:'1px solid var(--c-border)'}}>
            {[
              { id:'appointments', label:'Mes rendez-vous', icon:<CalendarIcon style={{width:16,height:16}}/>, count:appointments.length },
              { id:'doctors', label:'Trouver un médecin', icon:<MagnifyingGlassIcon style={{width:16,height:16}}/>, count:doctors.length },
              { id:'reviews', label:'Mes avis', icon:<ChatBubbleLeftRightIcon style={{width:16,height:16}}/>, count:reviews.length },
            ].map(t => (
              <button key={t.id} className={`tab-btn ${activeTab===t.id?'active':''}`} onClick={() => setActiveTab(t.id)}>
                {t.icon}
                <span>{t.label}</span>
                {t.count > 0 && <span className="tab-badge">{t.count}</span>}
              </button>
            ))}
          </div>
        </div>

        <div style={{background:'var(--c-surface)', borderRadius:'var(--r-card)', border:'1px solid var(--c-border)', boxShadow:'var(--shadow-sm)', padding:28}}>

          {activeTab === 'appointments' && (
            <div>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, flexWrap:'wrap', gap:12}}>
                <h2 className="syne" style={{fontSize:20, fontWeight:700, color:'var(--c-text)', margin:0, display:'flex', alignItems:'center', gap:8}}>
                  <CalendarIcon style={{width:22,height:22,color:'var(--c-accent)'}}/>
                  Historique des rendez-vous
                </h2>
                <button className="btn-primary" onClick={() => setActiveTab('doctors')} style={{padding:'8px 16px', fontSize:13}}>
                  <PlusCircleIcon style={{width:15,height:15}}/>
                  Nouveau rendez-vous
                </button>
              </div>

              {appointments.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon-wrap">
                    <CalendarIcon style={{width:38,height:38,color:'var(--c-accent)'}}/>
                  </div>
                  <h3 className="syne" style={{fontSize:18, fontWeight:700, color:'var(--c-text)', margin:'0 0 8px'}}>Aucun rendez-vous</h3>
                  <p style={{color:'var(--c-muted)', fontSize:14, marginBottom:20}}>Vous n'avez pas encore de rendez-vous programmé</p>
                  <button className="btn-primary" onClick={() => setActiveTab('doctors')}>
                    <MagnifyingGlassIcon style={{width:16,height:16}}/> Trouver un médecin
                  </button>
                </div>
              ) : (
                <div>
                  {upcomingAppointments.length > 0 && (
                    <div style={{marginBottom:28}}>
                      <p className="section-label"><SparklesIcon style={{width:13,height:13}}/>À venir</p>
                      <div style={{display:'flex', flexDirection:'column', gap:10}}>
                        {upcomingAppointments.map(apt => (
                          <div key={apt.id} className="apt-card upcoming">
                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12}}>
                              <div style={{display:'flex', alignItems:'center', gap:12}}>
                                <div className="doc-avatar" style={{width:44,height:44,fontSize:17,borderRadius:12}}>
                                  {apt.doctor?.user?.name?.charAt(0) || 'D'}
                                </div>
                                <div>
                                  <div style={{display:'flex', alignItems:'center', gap:8, flexWrap:'wrap'}}>
                                    <span style={{fontWeight:600, color:'var(--c-text)', fontSize:14}}>Dr. {apt.doctor?.user?.name}</span>
                                    <StatusBadge status={apt.status} date={apt.date}/>
                                  </div>
                                  <p style={{color:'var(--c-muted)', fontSize:12, margin:'4px 0 0'}}>
                                    {apt.doctor?.specialty?.name || 'Généraliste'} &nbsp;·&nbsp;
                                    📅 {new Date(apt.date).toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})} &nbsp;⏰ {new Date(apt.date).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}
                                  </p>
                                </div>
                              </div>
                              <button className="btn-ghost btn-danger" onClick={() => handleCancelAppointment(apt.id)}>
                                <TrashIcon style={{width:14,height:14}}/>Annuler
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {pastAppointments.length > 0 && (
                    <div>
                      <p className="section-label"><ClockIcon style={{width:13,height:13}}/>Passés</p>
                      <div style={{display:'flex', flexDirection:'column', gap:10}}>
                        {pastAppointments.map(apt => (
                          <div key={apt.id} className="apt-card past">
                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12}}>
                              <div style={{display:'flex', alignItems:'center', gap:12}}>
                                <div style={{
                                  width:44, height:44, borderRadius:12,
                                  background:'#e5e7eb', display:'flex', alignItems:'center', justifyContent:'center',
                                  color:'#9ca3af', fontWeight:700, fontFamily:'Syne, sans-serif'
                                }}>
                                  {apt.doctor?.user?.name?.charAt(0) || 'D'}
                                </div>
                                <div>
                                  <div style={{display:'flex', alignItems:'center', gap:8, flexWrap:'wrap'}}>
                                    <span style={{fontWeight:600, color:'var(--c-text)', fontSize:14}}>Dr. {apt.doctor?.user?.name}</span>
                                    <StatusBadge status={apt.status} date={apt.date}/>
                                  </div>
                                  <p style={{color:'var(--c-muted)', fontSize:12, margin:'4px 0 0'}}>
                                    {apt.doctor?.specialty?.name || 'Généraliste'} &nbsp;·&nbsp;
                                    📅 {new Date(apt.date).toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})} &nbsp;⏰ {new Date(apt.date).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}
                                  </p>
                                </div>
                              </div>
                              {!reviews.find(r => r.appointmentId === apt.id) && apt.status === 'TERMINE' && (
                                <button className="btn-ghost btn-purple" onClick={() => { 
                                  setSelectedAppointmentForReview(apt)
                                  setShowReviewModal(true) 
                                }}>
                                  <StarIcon style={{width:14,height:14}}/>Donner un avis
                                </button>
                              )}
                              {reviews.find(r => r.appointmentId === apt.id) && (
                                <span className="badge badge-green" style={{padding:'6px 12px'}}>
                                  <StarSolidIcon style={{width:12,height:12}}/> Avis donné
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'doctors' && (
            <div>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, flexWrap:'wrap', gap:12}}>
                <h2 className="syne" style={{fontSize:20, fontWeight:700, color:'var(--c-text)', margin:0, display:'flex', alignItems:'center', gap:8}}>
                  <MagnifyingGlassIcon style={{width:22,height:22,color:'var(--c-accent)'}}/>
                  Trouver un médecin
                </h2>
                <div style={{display:'flex', alignItems:'center', gap:6, color:'var(--c-muted)', fontSize:13}}>
                  <FunnelIcon style={{width:14,height:14}}/>
                  {filteredDoctors.length} médecin{filteredDoctors.length > 1 ? 's' : ''} disponible{filteredDoctors.length > 1 ? 's' : ''}
                </div>
              </div>

              <div style={{display:'flex', gap:12, marginBottom:24, flexWrap:'wrap'}}>
                <div className="search-wrap" style={{flex:'1 1 260px'}}>
                  <MagnifyingGlassIcon className="search-icon" style={{width:18,height:18,color:'var(--c-muted)'}}/>
                  <input
                    type="text"
                    placeholder="Rechercher par nom ou spécialité…"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
                <select className="sel" value={selectedSpecialty} onChange={e => setSelectedSpecialty(e.target.value)}>
                  <option value="">Toutes les spécialités</option>
                  {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {filteredDoctors.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon-wrap">
                    <UserGroupIcon style={{width:38,height:38,color:'var(--c-muted)'}}/>
                  </div>
                  <h3 className="syne" style={{fontSize:18,fontWeight:700,color:'var(--c-text)',margin:'0 0 8px'}}>Aucun médecin trouvé</h3>
                  <p style={{color:'var(--c-muted)',fontSize:14}}>Essayez de modifier vos critères de recherche</p>
                </div>
              ) : (
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:18}}>
                  {filteredDoctors.map(doctor => {
                    const avg = getAverageRating(doctor.id)
                    const isSelected = selectedDoctor?.id === doctor.id
                    return (
                      <div key={doctor.id} className="doc-card">
                        <div style={{padding:20}}>
                          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12}}>
                            <div style={{display:'flex', gap:14, alignItems:'flex-start'}}>
                              <div style={{position:'relative'}}>
                                <div className="doc-avatar">
                                  {doctor.user?.name?.charAt(0) || 'D'}
                                </div>
                                {avg && (
                                  <div style={{
                                    position:'absolute', bottom:-4, right:-4, width:18, height:18,
                                    background:'#d97706', borderRadius:'50%',
                                    display:'flex', alignItems:'center', justifyContent:'center',
                                    border:'2px solid #fff'
                                  }}>
                                    <StarSolidIcon style={{width:9,height:9,color:'#fff'}}/>
                                  </div>
                                )}
                              </div>
                              <div>
                                <h3 className="syne" style={{fontSize:15,fontWeight:700,color:'var(--c-text)',margin:'0 0 2px'}}>
                                  Dr. {doctor.user?.name}
                                </h3>
                                <p style={{color:'var(--c-accent)',fontSize:12,fontWeight:600,margin:'0 0 4px'}}>
                                  {doctor.specialty?.name || 'Généraliste'}
                                </p>
                                {avg && <Stars rating={Math.floor(parseFloat(avg))} size={12}/>}
                                {avg && <span style={{fontSize:11,color:'var(--c-muted)',marginLeft:4}}>{avg}/5</span>}
                              </div>
                            </div>
                            {isSelected
                              ? <button style={{background:'none',border:'none',cursor:'pointer',color:'var(--c-muted)',padding:4}} onClick={() => setSelectedDoctor(null)}>
                                  <XMarkIcon style={{width:18,height:18}}/>
                                </button>
                              : <button className="btn-primary" style={{padding:'8px 14px',fontSize:12,flexShrink:0}} onClick={() => setSelectedDoctor(doctor)}>
                                  Prendre RDV
                                </button>
                            }
                          </div>

                          <div style={{marginTop:14, paddingTop:14, borderTop:'1px solid var(--c-border)', display:'flex', gap:16, justifyContent:'space-between'}}>
                            <span style={{fontSize:11,color:'var(--c-muted)',display:'flex',alignItems:'center',gap:4}}>
                              <CalendarIcon style={{width:12,height:12}}/>
                              {isAvailableThisWeek(doctor) ? '✅ Disponible' : '❌ Complet'}
                            </span>
                            <span style={{fontSize:11,color:'var(--c-muted)',display:'flex',alignItems:'center',gap:4}}>
                              <UserGroupIcon style={{width:12,height:12}}/>
                              {getPatientCount(doctor.id)} patient{getPatientCount(doctor.id) > 1 ? 's' : ''}
                            </span>
                          </div>

                          {isSelected && (
                            <div style={{marginTop:16, paddingTop:16, borderTop:'1px solid var(--c-border)', animation:'scaleIn .2s ease'}}>
                              <label style={{display:'block', fontSize:13, fontWeight:600, color:'var(--c-text)', marginBottom:8}}>
                                Sélectionnez une date et heure
                              </label>
                              <input
                                type="datetime-local"
                                value={appointmentDate}
                                onChange={e => setAppointmentDate(e.target.value)}
                                min={new Date().toISOString().slice(0,16)}
                                className="date-input"
                                style={{marginBottom:12}}
                              />
                              <div style={{display:'flex', gap:10}}>
                                <button 
                                  className="btn-primary" 
                                  style={{flex:1,justifyContent:'center',background:'linear-gradient(135deg,#059669,#10b981)',boxShadow:'0 4px 14px rgba(5,150,105,.3)'}} 
                                  onClick={handleBookAppointment}
                                  disabled={isBooking}
                                >
                                  {isBooking ? 'Réservation...' : 'Confirmer'}
                                </button>
                                <button 
                                  className="btn-ghost" 
                                  style={{flex:1,justifyContent:'center'}} 
                                  onClick={() => {
                                    setSelectedDoctor(null)
                                    setAppointmentDate('')
                                  }}
                                >
                                  Annuler
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <h2 className="syne" style={{fontSize:20,fontWeight:700,color:'var(--c-text)',margin:'0 0 24px',display:'flex',alignItems:'center',gap:8}}>
                <ChatBubbleLeftRightIcon style={{width:22,height:22,color:'var(--c-accent)'}}/>
                Mes avis
              </h2>

              {reviews.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon-wrap">
                    <StarIcon style={{width:38,height:38,color:'var(--c-gold)'}}/>
                  </div>
                  <h3 className="syne" style={{fontSize:18,fontWeight:700,color:'var(--c-text)',margin:'0 0 8px'}}>Aucun avis pour le moment</h3>
                  <p style={{color:'var(--c-muted)',fontSize:14,marginBottom:20}}>Partagez votre expérience après vos consultations</p>
                  <button className="btn-primary" onClick={() => setActiveTab('appointments')}>
                    <CalendarIcon style={{width:16,height:16}}/> Voir mes rendez-vous
                  </button>
                </div>
              ) : (
                <div style={{display:'flex',flexDirection:'column',gap:12}}>
                  {reviews.map(review => (
                    <div key={review.id} className="review-card">
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
                        <div style={{display:'flex',gap:12,alignItems:'center'}}>
                          <div className="doc-avatar" style={{width:44,height:44,fontSize:17,borderRadius:12}}>
                            {review.doctorAvatar}
                          </div>
                          <div>
                            <h3 style={{fontWeight:600,color:'var(--c-text)',fontSize:14,margin:'0 0 2px'}}>Dr. {review.doctorName}</h3>
                            <p style={{color:'var(--c-muted)',fontSize:11,margin:0}}>{review.doctorSpecialty || 'Généraliste'}</p>
                          </div>
                        </div>
                        <Stars rating={review.rating} size={15}/>
                      </div>
                      <p style={{color:'var(--c-text)',fontSize:13,lineHeight:1.6,margin:'0 0 8px'}}>{review.comment}</p>
                      <p style={{color:'var(--c-muted)',fontSize:11}}>
                        Posté le {new Date(review.date).toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showReviewModal && selectedAppointmentForReview && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <div style={{width:44,height:44,borderRadius:12,background:'linear-gradient(135deg,#d97706,#f59e0b)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <StarIcon style={{width:22,height:22,color:'#fff'}}/>
                </div>
                <h3 className="syne" style={{fontSize:18,fontWeight:700,color:'var(--c-text)',margin:0}}>Donner mon avis</h3>
              </div>
              <button style={{background:'none',border:'none',cursor:'pointer',color:'var(--c-muted)',padding:6,borderRadius:8}} onClick={() => { setShowReviewModal(false); setSelectedAppointmentForReview(null); setReviewData({rating:5,comment:''}) }}>
                <XMarkIcon style={{width:20,height:20}}/>
              </button>
            </div>

            <div style={{background:'var(--c-bg)',borderRadius:12,padding:14,marginBottom:18}}>
              <p style={{fontSize:11,color:'var(--c-muted)',marginBottom:2}}>Consultation avec</p>
              <p style={{fontWeight:600,color:'var(--c-text)',fontSize:14,margin:'0 0 2px'}}>Dr. {selectedAppointmentForReview.doctor?.user?.name}</p>
              <p style={{fontSize:12,color:'var(--c-muted)',margin:0}}>
                Le {new Date(selectedAppointmentForReview.date).toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})}
              </p>
            </div>

            <label style={{display:'block',fontSize:13,fontWeight:600,color:'var(--c-text)',marginBottom:10}}>Votre note</label>
            <div style={{display:'flex',gap:10,justifyContent:'center',marginBottom:20}}>
              {[1,2,3,4,5].map(s => (
                <button key={s} style={{background:'none',border:'none',cursor:'pointer',padding:4,transition:'transform .15s'}}
                  onClick={() => setReviewData({...reviewData,rating:s})}>
                  {s <= reviewData.rating
                    ? <StarSolidIcon style={{width:36,height:36,color:'#d97706'}}/>
                    : <StarIcon style={{width:36,height:36,color:'#d1d5db'}}/>}
                </button>
              ))}
            </div>

            <label style={{display:'block',fontSize:13,fontWeight:600,color:'var(--c-text)',marginBottom:8}}>Votre commentaire</label>
            <textarea
              value={reviewData.comment}
              onChange={e => setReviewData({...reviewData,comment:e.target.value})}
              placeholder="Comment s'est passée votre consultation ?"
              rows={4}
              className="ta"
              style={{marginBottom:18}}
            />

            <div style={{display:'flex',gap:10}}>
              <button className="btn-primary" style={{flex:1,justifyContent:'center'}} onClick={handleSubmitReview}>
                Publier mon avis
              </button>
              <button className="btn-ghost" style={{flex:1,justifyContent:'center'}} onClick={() => { setShowReviewModal(false); setSelectedAppointmentForReview(null) }}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardPatient