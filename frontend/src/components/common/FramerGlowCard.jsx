import React, { useRef, useState } from 'react';

export default function FramerGlowCard({ children, className = '' }) {
  const cardRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`relative overflow-hidden rounded-[24px] bg-[#111113] border border-white/5 shadow-2xl ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        transform: isHovering 
          ? 'perspective(1000px) scale3d(1.02, 1.02, 1.02)' 
          : 'perspective(1000px) scale3d(1, 1, 1)',
        transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)'
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500 z-0"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(500px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.15), transparent 40%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-[24px] transition-opacity duration-500 z-10"
        style={{
          opacity: isHovering ? 1 : 0,
          boxShadow: `inset 0 0 0 1px rgba(255, 255, 255, 0.3)`,
          maskImage: `radial-gradient(350px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent 50%)`,
          WebkitMaskImage: `radial-gradient(350px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent 50%)`,
        }}
      />
      <div className="relative z-20 h-full w-full [&_div]:!bg-transparent [&_span]:!bg-transparent p-6">
        {children}
      </div>
    </div>
  );
}
