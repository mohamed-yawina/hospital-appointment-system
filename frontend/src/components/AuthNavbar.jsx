// components/AuthNavbar.jsx
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bars3Icon, XMarkIcon, HomeIcon } from '@heroicons/react/24/outline'

function AuthNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    navigate('/')
    setTimeout(() => {
      const element = document.getElementById(sectionId)
      if (element) {
        const offset = 80
        const elementPosition = element.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - offset
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
      }
    }, 100)
    setIsMobileMenuOpen(false)
  }

   const sectionLinks = [
    { id: "hero", label: "Accueil", icon: <HomeIcon className="w-5 h-5" /> },
    { id: "features", label: "Fonctionnalités", icon: <HomeIcon className="w-5 h-5" /> },
    { id: "how-it-works", label: "Comment ça marche", icon: <HomeIcon className="w-5 h-5" /> },
    { id: "testimonials", label: "Avis", icon: <HomeIcon className="w-5 h-5" /> },
  ]


  return (
    <>
      <style>{`
        .auth-navbar {
          position: sticky;
          top: 0;
          z-index: 50;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid transparent;
        }
        
        .auth-navbar.scrolled {
          background: rgba(255, 255, 255, 0.98);
          border-bottom: 1px solid #e2e8f0;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }
        
        .auth-nav-link {
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
        
        .auth-nav-link:hover {
          color: #2563eb;
          background: #eff6ff;
        }
        
        /* Bouton Connexion - Outline style */
        .btn-login-auth {
          background: transparent;
          color: #2563eb;
          border: 2px solid #2563eb;
          padding: 8px 24px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.875rem;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-block;
        }
        
        .btn-login-auth:hover {
          background: #2563eb;
          color: white;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }
        
        /* Bouton Inscription - Gradient style */
        .btn-register-auth {
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          color: white;
          padding: 8px 24px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.875rem;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
          text-decoration: none;
          display: inline-block;
        }
        
        .btn-register-auth:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(37, 99, 235, 0.3);
        }
        
        .mobile-menu-auth {
          border-top: 1px solid #e2e8f0;
          padding: 16px 0;
          animation: slideDownAuth 0.2s ease;
        }
        
        @keyframes slideDownAuth {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .mobile-nav-link-auth {
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
        
        .mobile-nav-link-auth:hover {
          background: #eff6ff;
          color: #2563eb;
        }
        
        .mobile-btn-login {
          display: block;
          text-align: center;
          padding: 12px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.875rem;
          text-decoration: none;
          background: transparent;
          color: #2563eb;
          border: 2px solid #2563eb;
          transition: all 0.2s;
        }
        
        .mobile-btn-login:hover {
          background: #2563eb;
          color: white;
        }
        
        .mobile-btn-register {
          display: block;
          text-align: center;
          padding: 12px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.875rem;
          text-decoration: none;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          color: white;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
          transition: all 0.2s;
        }
        
        .mobile-btn-register:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }
      `}</style>

      <nav className={`auth-navbar${isScrolled ? ' scrolled' : ''}`}>
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


            {/* Desktop Auth Buttons - DIFFÉRENCIÉS */}
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login" className="btn-login-auth">
                Connexion
              </Link>
              <Link to="/register" className="btn-register-auth">
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
            <div className="md:hidden mobile-menu-auth">
              {sectionLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="mobile-nav-link-auth"
                >
                  {link.icon}
                  <span>{link.label}</span>
                </button>
              ))}
              
              
              {/* Mobile Auth Buttons - DIFFÉRENCIÉS */}
              <div className="mt-4 space-y-3 px-2 pt-2 border-t border-gray-100">
                <Link
                  to="/login"
                  className="mobile-btn-login"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="mobile-btn-register"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Inscription
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}

export default AuthNavbar