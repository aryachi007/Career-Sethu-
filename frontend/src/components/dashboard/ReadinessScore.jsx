import React from 'react';
import { Target } from 'lucide-react';
import FramerGlowCard from '../common/FramerGlowCard';

export default function ReadinessScore({ score, gapPercentage }) {
  // If score is undefined, default to 0
  const displayScore = score || 0;
  const dashOffset = 351 - (351 * displayScore) / 100;

  return (
    <FramerGlowCard className="h-full">
      <div className="flex flex-col justify-between h-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl border border-cyan-500/30 flex items-center justify-center">
            <Target className="w-5 h-5 text-cyan-400" />
          </div>
          <span className="font-semibold text-white text-[13px] uppercase tracking-wider">Job Readiness</span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center relative mt-6">
          <div className="w-32 h-32 relative flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
              <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray="351" strokeDashoffset={dashOffset} className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-1000 ease-out" strokeLinecap="round" />
            </svg>
            <div className="text-center">
              <span className="text-4xl font-bold text-white tracking-tighter">{displayScore}</span>
              <span className="text-[11px] font-bold text-zinc-500 block -mt-1">/ 100</span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-[14px] text-zinc-400">
            Skill Gap: <strong className="text-orange-400">{gapPercentage || 100}%</strong>
          </p>
        </div>
      </div>
    </FramerGlowCard>
  );
}
