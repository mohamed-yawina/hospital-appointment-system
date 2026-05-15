import React from 'react'

function LoadingSpinner() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&display=swap');

        /* Overlay principal */
        .ls-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 32px;
          background: linear-gradient(135deg, #0a0f1a 0%, #0a1a2f 50%, #0a0f1a 100%);
          animation: ls-fadeOut 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          animation-delay: 2.2s;
          font-family: 'Inter', sans-serif;
        }

        /* Effet de particules en arrière-plan */
        .ls-particles {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .ls-particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: rgba(26, 92, 246, 0.6);
          border-radius: 50%;
          animation: ls-float 8s infinite linear;
        }

        /* 15 particules animées */
        ${Array.from({ length: 15 }, (_, i) => `
          .ls-particle:nth-child(${i + 1}) {
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 5}s;
            animation-duration: ${5 + Math.random() * 5}s;
            opacity: ${0.2 + Math.random() * 0.5};
          }
        `).join('\n')}

        /* Anneaux extérieurs */
        .ls-ring-wrap {
          position: relative;
          width: 140px;
          height: 140px;
        }

        .ls-ring-outer {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid rgba(26, 92, 246, 0.1);
          border-top-color: #1a5cf6;
          border-right-color: #7c3aed;
          animation: ls-spin 1.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
          filter: drop-shadow(0 0 8px rgba(26, 92, 246, 0.3));
        }

        .ls-ring-middle {
          position: absolute;
          inset: 12px;
          border-radius: 50%;
          border: 1.5px solid rgba(124, 58, 237, 0.15);
          border-bottom-color: #7c3aed;
          animation: ls-spin-rev 1.4s linear infinite;
        }

        .ls-ring-inner {
          position: absolute;
          inset: 28px;
          border-radius: 50%;
          border: 1.5px solid rgba(26, 92, 246, 0.15);
          border-left-color: #1a5cf6;
          animation: ls-spin 1s linear infinite;
        }

        /* Centre lumineux */
        .ls-center {
          position: absolute;
          inset: 42px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(26, 92, 246, 0.2) 0%, rgba(124, 58, 237, 0.1) 100%);
          backdrop-filter: blur(2px);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: ls-pulse 1.5s ease-in-out infinite;
        }

        /* Logo cœur */
        .ls-heart-wrapper {
          position: relative;
          width: 32px;
          height: 32px;
          animation: ls-heartbeat 1.4s ease-in-out infinite;
        }

        .ls-heart {
          width: 100%;
          height: 100%;
          fill: none;
          stroke: url(#heartGradient);
          stroke-width: 1.8;
          stroke-linecap: round;
          stroke-linejoin: round;
          filter: drop-shadow(0 0 12px rgba(26, 92, 246, 0.8));
        }

        /* Vague ECG améliorée */
        .ls-ecg-wrap {
          position: relative;
          width: 280px;
          height: 48px;
          overflow: hidden;
          margin-top: 8px;
        }

        .ls-ecg {
          width: 560px;
          height: 48px;
          animation: ls-ecg-scroll 2s linear infinite;
        }

        .ls-ecg-path {
          fill: none;
          stroke: url(#ecgGradient);
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
          filter: drop-shadow(0 0 4px rgba(26, 92, 246, 0.5));
        }

        /* Masques de fondu */
        .ls-ecg-wrap::before,
        .ls-ecg-wrap::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          width: 60px;
          z-index: 1;
          pointer-events: none;
        }

        .ls-ecg-wrap::before {
          left: 0;
          background: linear-gradient(to right, #0a0f1a, transparent);
        }

        .ls-ecg-wrap::after {
          right: 0;
          background: linear-gradient(to left, #0a0f1a, transparent);
        }

        /* Texte de marque */
        .ls-wordmark {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
        }

        .ls-brand {
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #ffffff 0%, #a78bfa 50%, #60a5fa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .ls-tagline {
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          background: linear-gradient(135deg, #94a3b8, #64748b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Dots animés */
        .ls-dots {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .ls-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1a5cf6, #7c3aed);
          animation: ls-blink 1.4s ease-in-out infinite both;
        }

        .ls-dot:nth-child(1) { animation-delay: 0s; }
        .ls-dot:nth-child(2) { animation-delay: 0.2s; }
        .ls-dot:nth-child(3) { animation-delay: 0.4s; }

        /* Barre de progression */
        .ls-progress {
          width: 200px;
          height: 2px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          overflow: hidden;
          margin-top: 8px;
        }

        .ls-progress-bar {
          height: 100%;
          width: 0%;
          background: linear-gradient(90deg, #1a5cf6, #7c3aed);
          border-radius: 10px;
          animation: ls-progress 2.2s ease-out forwards;
        }

        /* Pourcentage de chargement */
        .ls-percentage {
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          letter-spacing: 1px;
          margin-top: 8px;
        }

        /* Animations */
        @keyframes ls-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes ls-spin-rev {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }

        @keyframes ls-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.8;
          }
        }

        @keyframes ls-heartbeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.3); }
          35% { transform: scale(1.2); }
          45% { transform: scale(1.3); }
          60% { transform: scale(1); }
        }

        @keyframes ls-ecg-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-280px); }
        }

        @keyframes ls-blink {
          0%, 80%, 100% {
            opacity: 0.2;
            transform: scale(0.8);
          }
          40% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        @keyframes ls-float {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-100px) translateX(20px);
            opacity: 0;
          }
        }

        @keyframes ls-progress {
          0% { width: 0%; }
          20% { width: 15%; }
          40% { width: 35%; }
          60% { width: 65%; }
          80% { width: 85%; }
          100% { width: 100%; }
        }

        @keyframes ls-fadeOut {
          0% {
            opacity: 1;
            visibility: visible;
          }
          100% {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
          }
        }

        /* Effet de brillance sur le logo */
        @keyframes ls-shine {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>

      <div className="ls-overlay" role="status" aria-label="Chargement HospitalApp">

        {/* Particules en arrière-plan */}
        <div className="ls-particles">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="ls-particle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${1 + Math.random() * 3}px`,
                height: `${1 + Math.random() * 3}px`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 7}s`,
                opacity: 0.2 + Math.random() * 0.5
              }}
            />
          ))}
        </div>

        {/* Gradients SVG */}
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1a5cf6" />
              <stop offset="50%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
            <linearGradient id="ecgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1a5cf6" stopOpacity="0" />
              <stop offset="20%" stopColor="#1a5cf6" />
              <stop offset="50%" stopColor="#7c3aed" />
              <stop offset="80%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Anneaux + Cœur */}
        <div className="ls-ring-wrap">
          <div className="ls-ring-outer" />
          <div className="ls-ring-middle" />
          <div className="ls-ring-inner" />
          <div className="ls-center">
            <div className="ls-heart-wrapper">
              <svg viewBox="0 0 24 24" className="ls-heart">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Ligne ECG animée */}
        <div className="ls-ecg-wrap" aria-hidden="true">
          <svg viewBox="0 0 560 48" className="ls-ecg" preserveAspectRatio="none">
            <path
              className="ls-ecg-path"
              d="
                M0,24 L60,24
                Q68,24 70,20 Q72,16 74,24
                L85,24
                L92,24 L96,5 L100,43 L104,24
                L115,24
                Q123,24 125,18 Q129,10 133,24
                L155,24
                L162,24 L166,5 L170,43 L174,24
                L185,24
                Q193,24 195,18 Q199,10 203,24
                L225,24
                
                M280,24 L340,24
                Q348,24 350,20 Q352,16 354,24
                L365,24
                L372,24 L376,5 L380,43 L384,24
                L395,24
                Q403,24 405,18 Q409,10 413,24
                L435,24
                L442,24 L446,5 L450,43 L454,24
                L465,24
                Q473,24 475,18 Q479,10 483,24
                L505,24
              "
            />
          </svg>
        </div>

        {/* Marque et indicateurs */}
        <div className="ls-wordmark">
          <p className="ls-brand">
            Health<span>Now</span>
          </p>
          <p className="ls-tagline">
            CHARGEMENT
            <span className="ls-dots">
              <span className="ls-dot" />
              <span className="ls-dot" />
              <span className="ls-dot" />
            </span>
          </p>
        </div>

        {/* Barre de progression */}
        <div className="ls-progress">
          <div className="ls-progress-bar" />
        </div>

        {/* Pourcentage (optionnel) */}
        <div className="ls-percentage">
          <span id="loading-percent">100</span>%
        </div>
      </div>

      {/* Script pour animer le pourcentage */}
      <script dangerouslySetInnerHTML={{
        __html: `
          const percentElement = document.getElementById('loading-percent');
          if (percentElement) {
            let percent = 0;
            const interval = setInterval(() => {
              percent += 4;
              if (percent >= 100) {
                percent = 100;
                clearInterval(interval);
              }
              percentElement.textContent = percent;
            }, 88);
          }
        `
      }} />
    </>
  )
}

export default LoadingSpinner