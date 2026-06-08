import React from 'react';

export default function Logo({ className = '', showText = true, size = 'md' }) {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-3xl'
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Geometric Bridge + Arrow SVG Icon */}
      <svg 
        className={`${iconSizes[size]} shrink-0 drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]`} 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* The Sethu (Bridge) Foundations */}
        <path 
          d="M4 22C10 16 22 16 28 22" 
          stroke="url(#logoGrad)" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
        />
        <path 
          d="M8 24C12 20 20 20 24 24" 
          stroke="url(#logoGrad)" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          opacity="0.5"
        />
        {/* Ascending Career Vector Arrow */}
        <path 
          d="M13 19L24 8M24 8H17M24 8V15" 
          stroke="url(#logoGrad)" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="logoGrad" x1="4" y1="8" x2="28" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#22d3ee" /> {/* Cyan */}
            <stop offset="100%" stopColor="#8b5cf6" /> {/* Violet */}
          </linearGradient>
        </defs>
      </svg>

      {/* Brand Text Core Typography */}
      {showText && (
        <span className={`${textSizes[size]} font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent`}>
          Career<span className="text-cyan-400 font-black ml-1">Sethu</span>
        </span>
      )}
    </div>
  );
}
