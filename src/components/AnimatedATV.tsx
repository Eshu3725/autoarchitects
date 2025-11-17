import { useEffect, useState } from 'react';

const AnimatedATV = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; delay: number }>>([]);

  useEffect(() => {
    // Generate dust particles
    const particleArray = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      delay: Math.random() * 2,
    }));
    setParticles(particleArray);
  }, []);

  return (
    <div 
      className="relative w-full h-full flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Dust Particles Container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="dust-particle"
            style={{
              animationDelay: `${particle.delay}s`,
              top: `${50 + Math.random() * 30}%`,
              left: `${10 + Math.random() * 20}%`,
            }}
          />
        ))}
      </div>

      {/* ATV SVG */}
      <svg
        viewBox="0 0 400 300"
        className={`w-full h-full transition-transform duration-700 ${
          isHovered ? 'scale-105' : 'scale-100'
        }`}
        style={{ filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3))' }}
      >
        {/* Ground Shadow */}
        <ellipse
          cx="200"
          cy="260"
          rx="120"
          ry="15"
          fill="rgba(0, 0, 0, 0.2)"
          className="animate-pulse"
        />

        {/* Rear Suspension Spring */}
        <g className="suspension-rear">
          <line x1="120" y1="200" x2="120" y2="220" stroke="#64748b" strokeWidth="3" />
          <path
            d="M 115 200 Q 120 205 115 210 Q 120 215 115 220"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2"
          />
        </g>

        {/* Front Suspension Spring */}
        <g className="suspension-front">
          <line x1="280" y1="200" x2="280" y2="220" stroke="#64748b" strokeWidth="3" />
          <path
            d="M 275 200 Q 280 205 275 210 Q 280 215 275 220"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2"
          />
        </g>

        {/* Main Chassis Frame */}
        <g className="chassis">
          {/* Lower frame */}
          <path
            d="M 100 210 L 300 210 L 290 190 L 110 190 Z"
            fill="url(#metalGradient)"
            stroke="#475569"
            strokeWidth="2"
          />
          
          {/* Upper frame */}
          <path
            d="M 150 190 L 250 190 L 240 160 L 160 160 Z"
            fill="url(#metalGradient)"
            stroke="#475569"
            strokeWidth="2"
          />
          
          {/* Roll cage bars */}
          <line x1="160" y1="160" x2="160" y2="190" stroke="#64748b" strokeWidth="3" />
          <line x1="240" y1="160" x2="240" y2="190" stroke="#64748b" strokeWidth="3" />
          <line x1="200" y1="150" x2="200" y2="190" stroke="#64748b" strokeWidth="4" />
          
          {/* Diagonal support */}
          <line x1="150" y1="190" x2="170" y2="160" stroke="#64748b" strokeWidth="2" />
          <line x1="250" y1="190" x2="230" y2="160" stroke="#64748b" strokeWidth="2" />
        </g>

        {/* Seat */}
        <rect
          x="170"
          y="165"
          width="60"
          height="25"
          rx="5"
          fill="#1e293b"
          stroke="#0f172a"
          strokeWidth="2"
        />

        {/* Engine Block */}
        <rect
          x="180"
          y="195"
          width="40"
          height="30"
          rx="3"
          fill="url(#engineGradient)"
          stroke="#475569"
          strokeWidth="2"
        />
        
        {/* Engine Details */}
        <circle cx="190" cy="210" r="3" fill="#ef4444" className="engine-light" />
        <circle cx="210" cy="210" r="3" fill="#ef4444" className="engine-light" style={{ animationDelay: '0.5s' }} />

        {/* Rear Wheel */}
        <g className="wheel-rear">
          <circle
            cx="120"
            cy="230"
            r="35"
            fill="url(#tireGradient)"
            stroke="#1e293b"
            strokeWidth="4"
          />
          <circle cx="120" cy="230" r="20" fill="url(#rimGradient)" stroke="#64748b" strokeWidth="2" />
          
          {/* Spokes */}
          <g className="spokes-rear">
            <line x1="120" y1="210" x2="120" y2="250" stroke="#94a3b8" strokeWidth="2" />
            <line x1="100" y1="230" x2="140" y2="230" stroke="#94a3b8" strokeWidth="2" />
            <line x1="106" y1="216" x2="134" y2="244" stroke="#94a3b8" strokeWidth="2" />
            <line x1="106" y1="244" x2="134" y2="216" stroke="#94a3b8" strokeWidth="2" />
          </g>
        </g>

        {/* Front Wheel */}
        <g className="wheel-front">
          <circle
            cx="280"
            cy="230"
            r="35"
            fill="url(#tireGradient)"
            stroke="#1e293b"
            strokeWidth="4"
          />
          <circle cx="280" cy="230" r="20" fill="url(#rimGradient)" stroke="#64748b" strokeWidth="2" />
          
          {/* Spokes */}
          <g className="spokes-front">
            <line x1="280" y1="210" x2="280" y2="250" stroke="#94a3b8" strokeWidth="2" />
            <line x1="260" y1="230" x2="300" y2="230" stroke="#94a3b8" strokeWidth="2" />
            <line x1="266" y1="216" x2="294" y2="244" stroke="#94a3b8" strokeWidth="2" />
            <line x1="266" y1="244" x2="294" y2="216" stroke="#94a3b8" strokeWidth="2" />
          </g>
        </g>

        {/* Steering Handlebar */}
        <g className={`handlebar ${isHovered ? 'handlebar-turn' : ''}`}>
          <path
            d="M 260 175 Q 270 170 280 175"
            fill="none"
            stroke="#64748b"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="255" cy="177" r="4" fill="#ef4444" />
          <circle cx="285" cy="177" r="4" fill="#ef4444" />
        </g>

        {/* Headlight */}
        <circle cx="290" cy="195" r="8" fill="#fbbf24" className="headlight" />
        <circle cx="290" cy="195" r="12" fill="#fbbf24" opacity="0.3" className="headlight-glow" />

        {/* Exhaust Pipe */}
        <path
          d="M 170 220 Q 150 225 140 230"
          fill="none"
          stroke="#64748b"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="138" cy="231" r="3" fill="#94a3b8" />

        {/* Exhaust Smoke */}
        <g className="exhaust-smoke">
          <circle cx="130" cy="230" r="3" fill="#94a3b8" opacity="0.6" />
          <circle cx="125" cy="228" r="4" fill="#94a3b8" opacity="0.4" />
          <circle cx="120" cy="225" r="5" fill="#94a3b8" opacity="0.2" />
        </g>

        {/* Energy Accent Lines */}
        <line x1="200" y1="165" x2="220" y2="165" stroke="#ef4444" strokeWidth="2" className="energy-line" />
        <line x1="190" y1="200" x2="210" y2="200" stroke="#ef4444" strokeWidth="2" className="energy-line" style={{ animationDelay: '0.3s' }} />

        {/* Gradients */}
        <defs>
          <linearGradient id="metalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>

          <linearGradient id="engineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="50%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          <radialGradient id="tireGradient">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="70%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </radialGradient>

          <radialGradient id="rimGradient">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="50%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#94a3b8" />
          </radialGradient>
        </defs>
      </svg>

      {/* Speed Lines (appear on hover) */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="speed-line"
              style={{
                top: `${40 + i * 8}%`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes rotate-wheel {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes bounce-suspension {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        @keyframes dust-float {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0);
          }
          20% {
            opacity: 0.6;
          }
          100% {
            opacity: 0;
            transform: translate(-100px, -30px) scale(1.5);
          }
        }

        @keyframes pulse-light {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        @keyframes glow-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }

        @keyframes smoke-rise {
          0% {
            opacity: 0.6;
            transform: translate(0, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-20px, -15px) scale(1.8);
          }
        }

        @keyframes energy-pulse {
          0%, 100% { opacity: 1; stroke-width: 2px; }
          50% { opacity: 0.5; stroke-width: 3px; }
        }

        @keyframes speed-line-move {
          from {
            transform: translateX(0);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          to {
            transform: translateX(-200px);
            opacity: 0;
          }
        }

        .wheel-rear, .wheel-front {
          transform-origin: center;
          animation: rotate-wheel 2s linear infinite;
        }

        .spokes-rear, .spokes-front {
          transform-origin: center;
          animation: rotate-wheel 2s linear infinite;
        }

        .suspension-rear, .suspension-front {
          animation: bounce-suspension 1.5s ease-in-out infinite;
        }

        .suspension-front {
          animation-delay: 0.2s;
        }

        .dust-particle {
          position: absolute;
          width: 8px;
          height: 8px;
          background: radial-gradient(circle, rgba(148, 163, 184, 0.8), transparent);
          border-radius: 50%;
          animation: dust-float 3s ease-out infinite;
        }

        .engine-light {
          animation: pulse-light 1s ease-in-out infinite;
        }

        .headlight {
          animation: pulse-light 2s ease-in-out infinite;
        }

        .headlight-glow {
          animation: glow-pulse 2s ease-in-out infinite;
        }

        .exhaust-smoke circle {
          animation: smoke-rise 2s ease-out infinite;
        }

        .exhaust-smoke circle:nth-child(2) {
          animation-delay: 0.3s;
        }

        .exhaust-smoke circle:nth-child(3) {
          animation-delay: 0.6s;
        }

        .energy-line {
          animation: energy-pulse 1.5s ease-in-out infinite;
        }

        .handlebar {
          transform-origin: 270px 175px;
          transition: transform 0.5s ease-out;
        }

        .handlebar-turn {
          transform: rotate(-5deg);
        }

        .speed-line {
          position: absolute;
          width: 60px;
          height: 2px;
          background: linear-gradient(to left, transparent, #ef4444, transparent);
          animation: speed-line-move 0.8s ease-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AnimatedATV;

