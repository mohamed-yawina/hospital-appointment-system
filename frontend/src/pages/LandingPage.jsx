import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CalendarIcon,
  UserGroupIcon,
  BellIcon,
  ShieldCheckIcon,
  ClockIcon,
  ChartBarIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  SparklesIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  HomeIcon,
  XMarkIcon,
  Bars3Icon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'

function LandingPage() {
  const [revealedSections, setRevealedSections] = useState({})
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
      
      // Detect active section for highlighting
      const sections = ['hero', 'features', 'specialties', 'how-it-works', 'testimonials']
      let currentSection = 'hero'
      
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = section
            break
          }
        }
      }
      setActiveSection(currentSection)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
          setRevealedSections(prev => ({ ...prev, [entry.target.id]: true }))
        }
      })
    }, observerOptions)

    setTimeout(() => {
      document.querySelectorAll('.reveal-section').forEach((el) => {
        observer.observe(el)
      })
    }, 100)

    return () => observer.disconnect()
  }, [])

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
      
      navigate('/', { replace: true })
    }
    setIsMobileMenuOpen(false)
  }

  const sectionLinks = [
    { id: "hero", label: "Accueil", icon: <HomeIcon className="w-5 h-5" /> },
    { id: "features", label: "Fonctionnalités", icon: <ChartBarIcon className="w-5 h-5" /> },
    { id: "specialties", label: "Spécialités", icon: <UserGroupIcon className="w-5 h-5" /> },
    { id: "how-it-works", label: "Comment ça marche", icon: <CalendarIcon className="w-5 h-5" /> },
    { id: "testimonials", label: "Avis", icon: <ChatBubbleLeftRightIcon className="w-5 h-5" /> },
  ]

  const features = [
    {
      icon: <CalendarIcon className="w-6 h-6" />,
      color: '#1a56db',
      bg: '#eff4ff',
      title: "Prise de RDV en ligne",
      description: "Réservez vos consultations 24h/24, 7j/7 en quelques clics"
    },
    {
      icon: <UserGroupIcon className="w-6 h-6" />,
      color: '#7c3aed',
      bg: '#f5f3ff',
      title: "Médecins qualifiés",
      description: "Accédez à une large gamme de spécialités médicales"
    },
    {
      icon: <BellIcon className="w-6 h-6" />,
      color: '#059669',
      bg: '#ecfdf5',
      title: "Notifications automatiques",
      description: "Recevez des rappels par email et SMS"
    },
    {
      icon: <ShieldCheckIcon className="w-6 h-6" />,
      color: '#dc2626',
      bg: '#fef2f2',
      title: "Sécurisé & Confidentiel",
      description: "Vos données médicales sont protégées"
    },
    {
      icon: <ClockIcon className="w-6 h-6" />,
      color: '#d97706',
      bg: '#fffbeb',
      title: "Gain de temps",
      description: "Évitez les longues files d'attente"
    },
    {
      icon: <ChartBarIcon className="w-6 h-6" />,
      color: '#0891b2',
      bg: '#ecfeff',
      title: "Suivi personnalisé",
      description: "Consultez votre historique médical"
    }
  ]

  const testimonials = [
    {
      name: "Marie Lambert",
      role: "Patiente",
      initials: "ML",
      content: "Application formidable ! Je peux prendre RDV en quelques minutes sans me déplacer.",
      rating: 5,
      date: "Il y a 2 jours"
    },
    {
      name: "Dr. Jean Martin",
      role: "Médecin Cardiologue",
      initials: "JM",
      content: "La gestion des rendez-vous n'a jamais été aussi simple. Je recommande vivement !",
      rating: 5,
      date: "Il y a 1 semaine"
    },
    {
      name: "Sophie Dubois",
      role: "Patiente",
      initials: "SD",
      content: "Les rappels par SMS sont très pratiques. Plus jamais de rendez-vous oublié.",
      rating: 5,
      date: "Il y a 3 jours"
    }
  ]

  const stats = [
    { number: "5 000+", label: "Patients satisfaits", icon: "👥", trend: "+23%" },
    { number: "100+", label: "Médecins partenaires", icon: "🩺", trend: "+12%" },
    { number: "20+", label: "Spécialités médicales", icon: "🏥", trend: "+5%" },
    { number: "98%", label: "Taux de satisfaction", icon: "⭐", trend: "+2%" }
  ]

  const steps = [
    {
      num: "01",
      icon: <UserGroupIcon className="w-7 h-7" />,
      color: '#1a56db',
      bg: 'linear-gradient(135deg, #eff4ff, #e0e9ff)',
      title: "Créez votre compte",
      desc: "Inscrivez-vous gratuitement en quelques minutes",
      details: "Email, mot de passe, quelques clics suffisent"
    },
    {
      num: "02",
      icon: <CalendarIcon className="w-7 h-7" />,
      color: '#7c3aed',
      bg: 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
      title: "Choisissez un médecin",
      desc: "Sélectionnez un créneau qui vous convient",
      details: "Filtrez par spécialité, disponibilité et note"
    },
    {
      num: "03",
      icon: <CheckCircleIcon className="w-7 h-7" />,
      color: '#059669',
      bg: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
      title: "Confirmation instantanée",
      desc: "Recevez une confirmation par email et SMS",
      details: "Rappels automatiques 24h avant le RDV"
    }
  ]

  const specialties = [
    { name: "Cardiologie", icon: "❤️", count: 12 },
    { name: "Dermatologie", icon: "🧴", count: 8 },
    { name: "Pédiatrie", icon: "👶", count: 10 },
    { name: "Neurologie", icon: "🧠", count: 6 },
    { name: "Ophtalmologie", icon: "👁️", count: 7 },
    { name: "Gynécologie", icon: "🌸", count: 9 }
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', sans-serif;
          background: #ffffff;
          color: #1e293b;
          overflow-x: hidden;
        }

        /* Animations */
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Scroll reveal */
        .reveal-section {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.7s ease;
        }

        .reveal-section.revealed {
          opacity: 1;
          transform: translateY(0);
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #1d4ed8, #6d28d9);
        }

        /* Gradient text */
        .gradient-text {
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Navbar styles */
        .landing-navbar {
          position: sticky;
          top: 0;
          z-index: 50;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid transparent;
        }
        
        .landing-navbar.scrolled {
          background: rgba(255, 255, 255, 0.98);
          border-bottom: 1px solid #e2e8f0;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }
        
        .nav-link {
          position: relative;
          font-size: 0.875rem;
          font-weight: 500;
          color: #475569;
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 10px;
          transition: all 0.2s;
          cursor: pointer;
          background: none;
          border: none;
        }
        
        .nav-link:hover {
          color: #2563eb;
          background: #eff6ff;
        }
        
        .nav-link.active {
          color: #2563eb;
          background: #eff6ff;
          font-weight: 600;
        }
        
        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 50%;
          transform: translateX(-50%);
          width: 24px;
          height: 2px;
          background: #2563eb;
          border-radius: 2px;
        }
        
        .btn-primary-nav {
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          color: white;
          padding: 8px 20px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.875rem;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
        }
        
        .btn-primary-nav:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }
        
        .btn-secondary-nav {
          border: 1.5px solid #cbd5e1;
          color: #475569;
          padding: 8px 20px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.875rem;
          transition: all 0.2s;
          background: transparent;
        }
        
        .btn-secondary-nav:hover {
          border-color: #2563eb;
          color: #2563eb;
          background: #eff6ff;
        }

        .mobile-menu {
          border-top: 1px solid #e2e8f0;
          padding: 16px 0;
          animation: slideDown 0.2s ease;
        }
        
        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          text-decoration: none;
          color: #475569;
          font-weight: 500;
          transition: all 0.15s;
          cursor: pointer;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
        }
        
        .mobile-nav-link:hover,
        .mobile-nav-link.active {
          background: #eff6ff;
          color: #2563eb;
        }

        .animate-pulse-slow {
          animation: pulse 3s ease-in-out infinite;
        }
      `}</style>

      <div>
        {/* Navbar intégré à la Landing Page */}
        <nav className={`landing-navbar${isScrolled ? ' scrolled' : ''}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 lg:h-[72px]">

              {/* Logo */}
              <button onClick={() => scrollToSection('hero')} className="flex items-center gap-2 group bg-transparent border-0 cursor-pointer">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white text-lg shadow-md group-hover:scale-105 transition-transform">
                  🏥
                </div>
                <span className="font-bold text-xl text-gray-800">
                  Health<span className="text-blue-600">Now</span>
                </span>
              </button>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-1">
                {sectionLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className={`nav-link ${activeSection === link.id ? 'active' : ''}`}
                  >
                    {link.label}
                  </button>
                ))}
              </div>

              {/* Desktop Auth */}
              <div className="hidden md:flex items-center gap-3">
                <Link to="/login" className="btn-secondary-nav">
                  Connexion
                </Link>
                <Link to="/register" className="btn-primary-nav">
                  Inscription
                </Link>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="w-6 h-6 text-gray-600" />
                ) : (
                  <Bars3Icon className="w-6 h-6 text-gray-600" />
                )}
              </button>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden mobile-menu">
                {sectionLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className="mobile-nav-link"
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </button>
                ))}
                <Link
                  to="/doctors"
                  className="mobile-nav-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <UserGroupIcon className="w-5 h-5" />
                  <span>Médecins</span>
                </Link>
                
                <div className="mt-4 space-y-3 px-2 pt-2 border-t border-gray-100">
                  <Link
                    to="/login"
                    className="block text-center py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-blue-500 hover:text-blue-600 transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="block text-center py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-md hover:shadow-lg transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Inscription gratuite
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* ── HERO SECTION ── */}
        <section id="hero" className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/30" style={{ padding: '80px 24px 80px' }}>
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
            <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="relative max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div style={{ animation: 'fadeUp 0.7s ease forwards' }}>
                <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-6">
                  <SparklesIcon className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Plateforme de santé certifiée</span>
                </div>

                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6">
                  Gérez vos rendez-vous<br />
                  médicaux en toute{' '}
                  <span className="gradient-text">simplicité</span>
                </h1>

                <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg">
                  Prenez rendez-vous en ligne avec les meilleurs médecins. 
                  Simple, rapide et entièrement sécurisé. Plus de 5000 patients nous font confiance.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <Link 
                    to="/register" 
                    className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    Commencer maintenant
                    <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link 
                    to="/login" 
                    className="inline-flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 font-semibold py-4 px-8 rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
                  >
                    Se connecter
                  </Link>
                </div>

                <div className="flex items-center gap-6 flex-wrap">
                  <div className="flex items-center -space-x-2">
                    {['ML', 'JM', 'SD', 'PC', 'AD'].map((initial, i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-md"
                        style={{ zIndex: 5 - i }}
                      >
                        {initial}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <StarSolidIcon key={i} className="w-4 h-4 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">4.9 (245 avis)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HeartIcon className="w-5 h-5 text-red-500" />
                    <span className="text-sm text-gray-600">98% recommandent</span>
                  </div>
                </div>
              </div>

              <div className="relative" style={{ animation: 'fadeUp 0.7s ease forwards', animationDelay: '0.2s' }}>
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                      <CalendarIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Prochain rendez-vous</p>
                      <p className="font-semibold text-gray-800">Dr. Sophie Martin</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Spécialité</span>
                      <span className="text-sm font-semibold text-gray-800">Cardiologie</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Date & heure</span>
                      <span className="text-sm font-semibold text-gray-800">Demain, 14h30</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Cabinet</span>
                      <span className="text-sm font-semibold text-gray-800">Paris 8e</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium text-green-600">Confirmé</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <BellIcon className="w-3 h-3" />
                      <span>SMS envoyé</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS SECTION ── */}
        <section className="py-16 bg-white border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group cursor-pointer reveal-section">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-500 mb-1">{stat.label}</div>
                  <div className="text-xs text-green-600 font-semibold">{stat.trend}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES SECTION ── */}
        <section id="features" className="py-24 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 reveal-section">
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">Pourquoi nous choisir ?</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                Une plateforme complète pour<br />
                <span className="gradient-text">prendre soin de votre santé</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Tout ce dont vous avez besoin pour une gestion optimale de vos consultations médicales
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 reveal-section">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: feature.bg, color: feature.color }}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SPECIALTIES SECTION ── */}
        <section id="specialties" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12 reveal-section">
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">Spécialités médicales</p>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Plus de 20 spécialités à votre service
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {specialties.map((spec, index) => (
                <div key={index} className="text-center p-4 rounded-xl bg-gray-50 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 transition-all duration-300 cursor-pointer group reveal-section">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                    {spec.icon}
                  </div>
                  <p className="font-semibold text-gray-800 text-sm">{spec.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{spec.count} médecins</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how-it-works" className="py-24 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 reveal-section">
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">Processus simplifié</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                Comment ça fonctionne ?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                3 étapes simples pour prendre soin de votre santé
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {steps.map((step, index) => (
                <div key={index} className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group reveal-section">
                  <div className="absolute -top-4 left-8 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg" style={{ background: step.color }}>
                    {step.num}
                  </div>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-transform duration-300 group-hover:scale-110" style={{ background: step.bg, color: step.color }}>
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 text-center mb-3">{step.title}</h3>
                  <p className="text-gray-600 text-center mb-2">{step.desc}</p>
                  <p className="text-sm text-gray-400 text-center">{step.details}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section id="testimonials" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 reveal-section">
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">Ils parlent de nous</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                Ce que nos utilisateurs disent
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Des milliers de patients et médecins nous font confiance chaque jour
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 reveal-section">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarSolidIcon key={i} className="w-5 h-5 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4 italic">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {testimonial.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{testimonial.name}</p>
                      <p className="text-xs text-gray-500">{testimonial.role}</p>
                      <p className="text-xs text-gray-400 mt-1">{testimonial.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ PREVIEW ── */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12 reveal-section">
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">Questions fréquentes</p>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Vous avez des questions ?
              </h2>
            </div>
            <div className="space-y-4">
              {[
                { q: "Comment annuler un rendez-vous ?", a: "Connectez-vous à votre compte, allez dans \"Mes rendez-vous\" et cliquez sur \"Annuler\"." },
                { q: "Les données médicales sont-elles sécurisées ?", a: "Oui, toutes vos données sont cryptées et protégées conformément au RGPD." },
                { q: "Puis-je consulter un médecin en urgence ?", a: "Oui, notre plateforme propose des créneaux d'urgence disponibles 24h/24." }
              ].map((faq, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all reveal-section">
                  <h3 className="font-semibold text-gray-800 mb-2">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA SECTION ── */}
        <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center reveal-section">
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
              <SparklesIcon className="w-4 h-4" />
              <span className="text-sm font-semibold">Offre spéciale</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Prêt à simplifier vos rendez-vous médicaux ?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers de patients qui utilisent notre plateforme chaque jour
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 font-semibold py-4 px-8 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                Commencer gratuitement
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/doctors" className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white font-semibold py-4 px-8 rounded-xl hover:bg-white/10 transition-all duration-300">
                <ChatBubbleLeftRightIcon className="w-5 h-5" />
                Parler à un conseiller
              </Link>
            </div>
            <p className="text-sm text-white/70 mt-6">
              🔒 Sans engagement • Création gratuite • Assistance 24/7
            </p>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-sm">🏥</div>
                  <span className="font-bold text-lg">HospitalApp</span>
                </div>
                <p className="text-gray-400 text-sm">La meilleure solution pour vos rendez-vous médicaux en ligne.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Navigation</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><button onClick={() => scrollToSection('hero')} className="hover:text-white transition">Accueil</button></li>
                  <li><button onClick={() => scrollToSection('features')} className="hover:text-white transition">Fonctionnalités</button></li>
                  <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-white transition">Comment ça marche</button></li>
                  <li><Link to="/doctors" className="hover:text-white transition">Médecins</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Compte</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><Link to="/login" className="hover:text-white transition">Connexion</Link></li>
                  <li><Link to="/register" className="hover:text-white transition">Inscription</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Contact</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>📞 +33 1 23 45 67 89</li>
                  <li>✉️ contact@hospitalapp.com</li>
                  <li>📍 Paris, France</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
              <p>© 2026 HospitalApp — Tous droits réservés. Made with ❤️ pour la santé.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

export default LandingPage