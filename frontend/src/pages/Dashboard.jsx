import React from 'react';
import { Flame, ArrowRight, GitBranch, Target, AlertTriangle } from 'lucide-react';
import FramerGlowCard from '../components/common/FramerGlowCard';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#000000] text-[#e2e2e2] p-4 md:p-10 font-sans relative overflow-hidden">
      {/* Background Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
      <div className="fixed inset-0 z-0 pointer-events-none bg-black/80 backdrop-blur-3xl"></div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-8">
          <div>
            <p className="text-[#cfc4c5] text-[13px] font-medium tracking-widest uppercase mb-2">Developer Dashboard</p>
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight">
              Your progress <br/>
              <span className="text-zinc-500">is accelerating.</span>
            </h1>
          </div>
          <button className="flex items-center gap-2 border border-white/10 px-5 py-2.5 rounded-full backdrop-blur-md w-fit hover:border-white/20 transition-colors">
            <Flame className="w-5 h-5 text-orange-500 fill-orange-500/20" />
            <span className="text-sm font-semibold text-white">14 Day Streak</span>
          </button>
        </header>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[320px]">
          
          {/* Card 1: Top Job Match (Spans 2 columns) */}
          <div className="md:col-span-2 h-full">
            <FramerGlowCard className="h-full">
              <div className="flex flex-col justify-between h-full">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl border border-blue-500/30 flex items-center justify-center">
                      <Target className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="font-semibold text-white text-lg">Top AI Job Match</span>
                  </div>
                  <button className="text-[11px] font-bold px-3 py-1.5 border border-white/10 rounded-full text-[#cfc4c5] tracking-wider">
                    HIGH CONFIDENCE
                  </button>
                </div>
                
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">SDE-1 at Flipkart</h2>
                  <div className="flex items-baseline gap-2 mb-8">
                    <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">85%</span>
                    <span className="text-[#cfc4c5] font-medium text-lg">Match</span>
                  </div>
                  <button className="flex items-center gap-2 px-7 py-3.5 bg-white text-black rounded-full font-bold text-sm hover:bg-zinc-200 transition-transform active:scale-95">
                    View Roadmap <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </FramerGlowCard>
          </div>

          {/* Card 2: GitHub Score */}
          <div className="h-full">
            <FramerGlowCard className="h-full">
              <div className="flex flex-col justify-between h-full">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl border border-violet-500/30 flex items-center justify-center">
                    <GitBranch className="w-5 h-5 text-violet-400" />
                  </div>
                  <span className="font-semibold text-white text-[13px] uppercase tracking-wider">GitHub Profile Score</span>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center relative mt-4">
                  {/* Circular Progress SVG */}
                  <div className="w-32 h-32 relative flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
                      <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray="351" strokeDashoffset="98" className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" strokeLinecap="round" />
                    </svg>
                    <div className="text-center">
                      <span className="text-4xl font-bold text-white tracking-tighter">72</span>
                      <span className="text-[11px] font-bold text-zinc-500 block -mt-1">/ 100</span>
                    </div>
                  </div>
                </div>

                <button className="mt-6 p-3 border border-red-500/30 rounded-xl flex items-start gap-3 w-full text-left">
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                  <p className="text-[13px] text-red-200 leading-snug">3 critical improvements found in your latest repos.</p>
                </button>
              </div>
            </FramerGlowCard>
          </div>

          {/* Card 3: Skill Gap Analysis (Spans all 3 columns for a wide detailed view) */}
          <div className="md:col-span-3 h-[280px]">
             <FramerGlowCard className="h-full">
                <div className="flex flex-col md:flex-row justify-between items-center h-full gap-8 pl-2">
                   <div className="flex-1">
                      <span className="font-semibold text-[#cfc4c5] text-[13px] uppercase tracking-widest block mb-4">Skill Gap Analysis</span>
                      <h3 className="text-2xl font-semibold text-white mb-1">Priority Target:</h3>
                      <p className="text-zinc-400 text-lg">Missing: <span className="text-white font-bold">System Design fundamentals.</span></p>
                      <div className="flex gap-3 mt-8">
                        <button className="px-4 py-2 rounded-full text-[13px] font-medium text-white border border-white/10 hover:border-white/30 transition-colors">Caching</button>
                        <button className="px-4 py-2 rounded-full text-[13px] font-medium text-white border border-white/10 hover:border-white/30 transition-colors">Load Balancing</button>
                        <button className="px-4 py-2 rounded-full text-[13px] font-medium text-white border border-white/10 hover:border-white/30 transition-colors">Microservices</button>
                      </div>
                   </div>
                   
                   {/* Abstract radar chart visual */}
                   <div className="w-48 h-48 relative flex items-center justify-center opacity-90 pr-8">
                     <div className="absolute inset-0 border border-blue-500/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
                     <div className="absolute w-36 h-36 border border-violet-500/20 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                     <svg width="120" height="120" viewBox="0 0 100 100" className="drop-shadow-[0_0_20px_rgba(139,92,246,0.5)] z-10">
                       <polygon points="50,10 90,40 75,90 25,90 10,40" fill="rgba(139, 92, 246, 0.15)" stroke="#8b5cf6" strokeWidth="2" />
                       <polygon points="50,30 70,50 60,80 40,80 30,50" fill="rgba(56, 189, 248, 0.3)" stroke="#38bdf8" strokeWidth="2" />
                     </svg>
                   </div>
                </div>
             </FramerGlowCard>
          </div>

        </div>
      </div>
    </div>
  );
}
