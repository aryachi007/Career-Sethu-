import React from 'react';
// Statically import the engineered logo from the local assets directory
import logoImg from '../../assets/logo.jpg';

export default function Logo({ className = '', showText = true, size = 'md' }) {
  // Maintain precise size mappings for seamless layout integration
  const logoSizes = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-20 h-20 rounded-2xl'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-3xl'
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Engineered Logo Image Wrapper with Cybernetic Drop Shadow */}
      <div className={`${logoSizes[size]} shrink-0 overflow-hidden bg-zinc-900 border border-white/10 shadow-[0_0_15px_rgba(34,211,238,0.25)] transition-transform duration-300 hover:scale-105`}>
        <img 
          src={logoImg} 
          alt="Career Sethu Core" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Core Typography Hierarchy */}
      {showText && (
        <span className={`${textSizes[size]} font-black tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent`}>
          Career<span className="text-cyan-400 font-black ml-0.5">Sethu</span>
        </span>
      )}
    </div>
  );
}
