import React, { useContext, useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { 
  Bars3Icon, 
  XMarkIcon, 
  UserCircleIcon,
  HomeIcon,
  UserGroupIcon,
  CalendarIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  HeartIcon
} from '@heroicons/react/24/outline'

function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsDropdownOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActiveLink = (path) => location.pathname === path

  const getUserInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getRoleIcon = () => {
    if (!user) return null
    switch(user.role) {
      case 'PATIENT': return <HeartIcon className="w-5 h-5 text-pink-500" />
      case 'MEDECIN': return <ClipboardDocumentListIcon className="w-5 h-5 text-green-500" />
      case 'ADMINISTRATEUR': return <ChartBarIcon className="w-5 h-5 text-purple-500" />
      default: return <UserCircleIcon className="w-5 h-5" />
    }
  }

  const getRoleLabel = () => {
    if (!user) return ''
    switch(user.role) {
      case 'PATIENT': return 'Patient'
      case 'MEDECIN': return 'Médecin'
      case 'ADMINISTRATEUR': return 'Administrateur'
      default: return ''
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .navbar-root {
          font-family: 'Inter', sans-serif;
          position: sticky;
          top: 0;
          z-index: 50;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid transparent;
        }
        
        .navbar-root.scrolled {
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
        
        .user-menu {
          position: relative;
        }
        
        .user-trigger {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 12px 6px 8px;
          border-radius: 12px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .user-trigger:hover {
          border-color: #2563eb;
          background: #eff6ff;
        }
        
        .user-avatar {
          width: 34px;
          height: 34px;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 0.75rem;
          font-weight: 700;
        }
        
        .user-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1e293b;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .user-role {
          font-size: 0.7rem;
          color: #94a3b8;
          font-weight: 500;
        }
        
        .dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 260px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.15);
          border: 1px solid #e2e8f0;
          overflow: hidden;
          animation: slideDown 0.2s ease;
          z-index: 100;
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
        
        .dropdown-header {
          padding: 16px;
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          border-bottom: 1px solid #e2e8f0;
        }
        
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          text-decoration: none;
          color: #475569;
          font-size: 0.875rem;
          transition: all 0.15s;
          cursor: pointer;
          width: 100%;
          background: none;
          border: none;
          text-align: left;
        }
        
        .dropdown-item:hover {
          background: #f8fafc;
          color: #2563eb;
        }
        
        .dropdown-divider {
          height: 1px;
          background: #e2e8f0;
          margin: 4px 0;
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
        }
        
        .mobile-nav-link:hover,
        .mobile-nav-link.active {
          background: #eff6ff;
          color: #2563eb;
        }
        
        .mobile-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
        }
        
        @media (max-width: 768px) {
          .navbar-root {
            backdrop-filter: blur(20px);
          }
        }
      `}</style>

      <nav className={`navbar-root${isScrolled ? ' scrolled' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-[72px]">

            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white text-lg shadow-md group-hover:scale-105 transition-transform">
                🏥
              </div>
              <span className="font-bold text-xl text-gray-800">
                Health<span className="text-blue-600">Now</span>
              </span>
            </Link>

            {/* Desktop Auth - avec menu utilisateur */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="user-menu">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="user-trigger"
                  >
                    <div className="user-avatar">
                      {getUserInitials(user.name)}
                    </div>
                    <div className="text-left">
                      <div className="user-name">{user.name}</div>
                      <div className="user-role">{getRoleLabel()}</div>
                    </div>
                    <svg className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isDropdownOpen && (
                    <div className="dropdown-menu">
                      <div className="dropdown-header">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                            {getUserInitials(user.name)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="dropdown-divider" />
                      <button onClick={handleLogout} className="dropdown-item text-red-600 hover:text-red-700 hover:bg-red-50">
                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                        <span>Déconnexion</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary">
                    Connexion
                  </Link>
                  <Link to="/register" className="btn-primary">
                    Inscription
                  </Link>
                </>
              )}
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
              <Link
                to="/dashboard"
                className={`mobile-nav-link ${isActiveLink('/dashboard') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <ChartBarIcon className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/doctors"
                className={`mobile-nav-link ${isActiveLink('/doctors') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <UserGroupIcon className="w-5 h-5" />
                <span>Médecins</span>
              </Link>
              <Link
                to="/"
                className="mobile-nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <HomeIcon className="w-5 h-5" />
                <span>Accueil</span>
              </Link>

              {user ? (
                <>
                  <div className="px-4 py-3 my-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="mobile-avatar">
                        {getUserInitials(user.name)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500">{getRoleLabel()}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMobileMenuOpen(false)
                    }}
                    className="mobile-nav-link w-full text-left text-red-600 hover:bg-red-50"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    <span>Déconnexion</span>
                  </button>
                </>
              ) : (
                <div className="mt-4 space-y-3 px-2">
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
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Click outside handler for dropdown */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </>
  )
}

export default Navbar