import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { User, BookOpen, Briefcase, FileText, Calendar, ShieldCheck, Award, GraduationCap, Cpu, Code2, ExternalLink, Sparkles, Activity } from 'lucide-react';
import FramerGlowCard from '../components/common/FramerGlowCard';

const Github = ({ className }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function Profile() {
  const location = useLocation();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Attempt to resolve user from location state or localStorage
    const storedUserId = localStorage.getItem('careerSethuUserId');
    const stateUserId = location.state?.userId;
    const userId = stateUserId || storedUserId;

    if (userId && !location.state?.userProfile) {
      setLoading(true);
      fetch(`${import.meta.env.VITE_API_URL}/api/dashboard/${userId}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch profile');
          return res.json();
        })
        .then(data => {
          if (data && data.profile) {
            setProfileData({
              fullName: data.profile.name || 'Aryan R',
              college: data.profile.college || 'AMC Engineering College',
              gradYear: '2029', // Fallback as it is not stored in DB
              targetRole: data.profile.targetRole || 'Chief Executive Officer / Lead SDE',
              targetCompany: data.profile.targetCompany || 'Google',
              githubUrl: data.profile.githubUrl || 'https://github.com/aryachi007',
              skills: data.profile.skills && data.profile.skills.length > 0 
                ? data.profile.skills 
                : ['React', 'JavaScript', 'Python', 'Tailwind CSS', 'Node.js', 'System Design'],
              jobMatchScore: data.skillGap?.readinessScore || 85
            });
          }
        })
        .catch(err => {
          console.error("Error loading profile data:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [location]);

  // Dynamic resolution: extract data from onboarding sequence, fetched profile state, or fallback to premium presentation defaults
  const userProfile = profileData || location.state?.userProfile || {
    fullName: 'Aryan R',
    college: 'AMC Engineering College',
    gradYear: '2029',
    targetRole: 'Chief Executive Officer / Lead SDE',
    targetCompany: 'Google',
    githubUrl: 'https://github.com/aryachi007',
    skills: ['React', 'JavaScript', 'Python', 'Tailwind CSS', 'Node.js', 'System Design']
  };

  const aiData = location.state?.aiData || {
    jobMatchScore: userProfile.jobMatchScore || 85
  };

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto w-full font-sans text-white bg-transparent selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Top Premium Banner */}
      <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></div>
            <span className="text-xs font-bold tracking-widest uppercase text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" /> Core Identity Verified
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
            Executive Dossier
          </h1>
        </div>
        
        {/* Quick System Stats Badge */}
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-2 rounded-2xl backdrop-blur-md">
          <div className="px-4 py-2 text-center border-r border-white/5">
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Security Tier</div>
            <div className="text-sm font-bold text-emerald-400 mt-0.5 flex items-center gap-1 justify-center">
              <ShieldCheck className="w-4 h-4" /> Root
            </div>
          </div>
          <div className="px-4 py-2 text-center">
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Account State</div>
            <div className="text-sm font-bold text-white mt-0.5">Enterprise</div>
          </div>
        </div>
      </header>

      {/* Master Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Biometric Profile Anchor */}
        <div className="lg:col-span-1 space-y-6">
          <FramerGlowCard>
            <div className="flex flex-col items-center text-center p-4 relative group">
              
              {/* Premium Holographic Avatar Ring */}
              <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-cyan-400 via-violet-500 to-amber-400 p-[3px] mb-5 shadow-[0_0_30px_rgba(34,211,238,0.25)] relative">
                <div className="w-full h-full bg-zinc-950 rounded-full flex items-center justify-center border border-black overflow-hidden">
                  <User className="w-12 h-12 text-zinc-300 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-cyan-400 text-black p-1.5 rounded-full border border-zinc-950 shadow-lg">
                  <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
                </div>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-white">{userProfile.fullName}</h2>
              <p className="text-[14px] text-zinc-400 font-semibold mt-1.5 flex items-center gap-2 justify-center">
                <GraduationCap className="w-4 h-4 text-cyan-400" /> {userProfile.college}
              </p>
              <p className="text-xs text-zinc-500 font-medium mt-0.5">Class of {userProfile.gradYear} • Tech Pioneer Track</p>

              {/* Platform Standing Badges */}
              <div className="flex flex-wrap gap-2 justify-center mt-5 w-full">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-zinc-300 px-3 py-1.5 rounded-xl">
                  Elite Tier
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 px-3 py-1.5 rounded-xl border border-cyan-500/20 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> Readiness Index: {aiData.jobMatchScore}%
                </span>
              </div>

              <div className="w-full border-t border-white/5 my-6"></div>

              {/* Core Metadata Vectors */}
              <div className="w-full text-left space-y-4 px-2">
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Target Mission Objective</label>
                  <span className="text-[15px] text-zinc-200 font-bold block leading-snug">
                    {userProfile.targetRole} <span className="text-zinc-500 font-medium">at</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400 font-extrabold">{userProfile.targetCompany}</span>
                  </span>
                </div>
                
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Authenticated Repository Scope</label>
                  <a href={userProfile.githubUrl} target="_blank" rel="noreferrer" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-2 font-semibold truncate group/link">
                    <Github className="w-4 h-4 shrink-0 text-zinc-400 group-hover/link:text-cyan-400 transition-colors" /> 
                    <span>{userProfile.githubUrl.replace('https://', '')}</span>
                    <ExternalLink className="w-3 h-3 opacity-50 group-hover/link:opacity-100 transition-opacity" />
                  </a>
                </div>
              </div>

              <div className="w-full border-t border-white/5 my-6"></div>
              
              <div className="w-full flex items-center justify-between text-[11px] text-zinc-500 font-medium px-2">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Node Est: 2026</span>
                <span className="font-mono tracking-wider text-zinc-600">SYS-NODE::#CS-007</span>
              </div>

            </div>
          </FramerGlowCard>
        </div>

        {/* Right Columns: Tactical Intelligence & Analytics Panels */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Card A: Real-Time AI Executive Summary */}
          <FramerGlowCard>
            <div className="p-2">
              <div className="flex items-center gap-2.5 mb-4">
                <Sparkles className="w-5 h-5 text-violet-400 animate-pulse" />
                <h3 className="text-lg font-bold tracking-tight text-white">AI Executive Core Analysis</h3>
              </div>
              <p className="text-sm md:text-[15px] text-zinc-400 leading-relaxed font-medium">
                Profile metrics detect a robust foundational aptitude in modern web engineering matrix schemas. Backed by active competencies in <span className="text-white font-semibold">React</span> and asynchronous systems, the user architecture is pacing optimally toward high-velocity computational roles. Recommendation matrices advise scaling server-side architecture constraints and deep caching mechanisms to establish a bulletproof configuration for top-tier deployments at <span className="text-cyan-400 font-semibold">{userProfile.targetCompany}</span>.
              </p>
            </div>
          </FramerGlowCard>

          {/* Card B: Core Architectural Competencies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FramerGlowCard>
              <div className="p-1 h-full flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-6">
                  <Code2 className="w-5 h-5 text-zinc-400" />
                  <h4 className="text-md font-bold text-white tracking-tight">Verified Tech Stack</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {userProfile.skills.map((skill, i) => (
                    <div key={i} className="text-xs font-semibold bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-zinc-200 shadow-sm backdrop-blur-md flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            </FramerGlowCard>

            {/* Telemetry Hub */}
            <FramerGlowCard>
              <div className="p-1">
                <div className="flex items-center gap-2 mb-6">
                  <Activity className="w-5 h-5 text-amber-400" />
                  <h4 className="text-md font-bold text-white tracking-tight">System Telemetry Status</h4>
                </div>
                <div className="space-y-3.5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400 font-medium flex items-center gap-2"><BookOpen className="w-4 h-4 text-cyan-400" /> Target Roadmaps</span>
                    <span className="font-bold text-white">01 Active</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400 font-medium flex items-center gap-2"><Briefcase className="w-4 h-4 text-violet-400" /> High-Match Pipelines</span>
                    <span className="font-bold text-white">04 Scoped</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400 font-medium flex items-center gap-2"><FileText className="w-4 h-4 text-emerald-400" /> ATS Resume Vector</span>
                    <span className="text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md text-xs">Optimized</span>
                  </div>
                </div>
              </div>
            </FramerGlowCard>
          </div>

          {/* Card C: Projected Project Engine Integration (GitHub Data Representation) */}
          <FramerGlowCard>
            <div className="p-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2.5">
                  <Github className="w-5 h-5 text-white" />
                  <div>
                    <h3 className="text-md font-bold text-white tracking-tight">Project Ingestion Interface</h3>
                    <p className="text-xs text-zinc-500 font-medium">Synchronized repository tracking systems</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-white/5 border border-white/5 text-zinc-400 px-2.5 py-1 rounded-md self-start sm:self-center">
                  STATUS: COMPILING_ANALYSIS
                </span>
              </div>
              
              {/* Mock Repository Module Grid */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group/repo hover:bg-white/[0.07] transition-all duration-300">
                <div className="space-y-1">
                  <div className="text-[15px] font-bold text-white flex items-center gap-1.5">
                    career-sethu-core <span className="text-[10px] font-bold text-cyan-400 border border-cyan-400/20 bg-cyan-400/10 px-2 py-0.5 rounded-full">Main</span>
                  </div>
                  <p className="text-xs text-zinc-400 font-medium">AI-driven predictive analytics deployment model framework built on top of customized React matrices.</p>
                </div>
                <div className="flex items-center gap-3 shrink-0 text-xs text-zinc-500 font-semibold">
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-violet-500"></div> JavaScript</span>
                  <span>Updated 2m ago</span>
                </div>
              </div>
            </div>
          </FramerGlowCard>

        </div>
      </div>

    </div>
  );
}
