import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  User, 
  BookOpen, 
  Briefcase, 
  FileText, 
  Calendar, 
  ShieldCheck, 
  Award, 
  GraduationCap, 
  Cpu, 
  Code2, 
  ExternalLink, 
  Sparkles, 
  Activity,
  BarChart3,
  TrendingUp,
  Map,
  Zap,
  Globe,
  Loader2
} from 'lucide-react';
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
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem('careerSethuUserId');
    const stateUserId = location.state?.userId;
    const userId = stateUserId || storedUserId;

    if (!userId) {
      navigate('/onboarding');
      return;
    }

    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/api/dashboard/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch profile');
        return res.json();
      })
      .then(data => {
        setDashboardData(data);
      })
      .catch(err => {
        console.error("Error loading profile data:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [location, navigate]);

  // Extract variables with defaults
  const user = dashboardData?.profile || {
    name: 'Aryan R',
    college: 'AMC Engineering College',
    targetRole: 'Chief Executive Officer / Lead SDE',
    targetCompany: 'Google',
    githubUrl: 'https://github.com/aryachi007',
    skills: ['React', 'JavaScript', 'Python', 'Tailwind CSS', 'Node.js', 'System Design']
  };

  const skillGap = dashboardData?.skillGap || {
    readinessScore: 85,
    skillGapPercentage: 15,
  };

  const githubAnalysis = dashboardData?.githubAnalysis || null;
  const resumeAnalysis = dashboardData?.resumeAnalysis || null;

  // Calculate Job Matches Generated count
  const getJobMatchesCount = () => {
    if (!dashboardData?.jobMatches) return 4; // fallback
    const { applyNow = [], applyAfterUpskilling = [], longTermGoals = [] } = dashboardData.jobMatches;
    return applyNow.length + applyAfterUpskilling.length + longTermGoals.length;
  };

  // Roadmaps Count
  const getRoadmapsCount = () => {
    return dashboardData?.roadmap ? 1 : 0;
  };

  // Format last analysis date
  const getFormattedDate = () => {
    const dateStr = skillGap.updatedAt || dashboardData?.lastUpdated;
    if (!dateStr) return 'June 9, 2026';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000000] text-[#e2e2e2] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-cyan-400" />
          <p className="text-zinc-400 font-medium font-sans">Compiling Profile Dossier...</p>
        </div>
      </div>
    );
  }



  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto w-full font-sans text-white bg-transparent select-none">
      
      {/* Top Profile Header */}
      <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
            <span className="text-xs font-bold tracking-widest uppercase text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Professional Dossier
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
            Talent Blueprint
          </h1>
        </div>
        
        {/* Quick System Stats Badge */}
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-2 rounded-2xl backdrop-blur-md">
          <div className="px-4 py-2 text-center border-r border-white/5">
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Account Plan</div>
            <div className="text-sm font-bold text-cyan-400 mt-0.5 flex items-center gap-1 justify-center">
              <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/20" /> Free Plan
            </div>
          </div>
          <div className="px-4 py-2 text-center">
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Index State</div>
            <div className="text-sm font-bold text-white mt-0.5">Verified</div>
          </div>
        </div>
      </header>

      {/* Bento Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* 1. Header Card (Bento Left Anchor) */}
        <FramerGlowCard className="lg:col-span-1">
          <div className="flex flex-col items-center text-center p-2 relative group">
            
            {/* Holographic Avatar Ring */}
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-cyan-400 via-violet-500 to-amber-400 p-[3px] mb-5 shadow-[0_0_30px_rgba(34,211,238,0.2)] relative">
              <div className="w-full h-full bg-zinc-950 rounded-full flex items-center justify-center border border-black overflow-hidden">
                {user.photoUrl ? (
                  <img 
                    src={user.photoUrl} 
                    alt={user.name} 
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`; }}
                  />
                ) : (
                  <span className="text-3xl font-extrabold text-zinc-300">{user.name ? user.name.charAt(0).toUpperCase() : 'S'}</span>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-cyan-400 text-black p-1.5 rounded-full border border-zinc-950 shadow-lg">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-white">{user.name}</h2>
            <p className="text-[14px] text-zinc-400 font-semibold mt-1.5 flex items-center gap-2 justify-center">
              <GraduationCap className="w-4 h-4 text-cyan-400" /> {user.college}
            </p>
            <p className="text-xs text-zinc-500 font-medium mt-0.5">Class of 2029 • Tech Pioneer</p>

            <div className="flex flex-wrap gap-2 justify-center mt-5 w-full">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-zinc-400 px-3 py-1.5 rounded-xl">
                Free Tier
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 px-3 py-1.5 rounded-xl border border-cyan-500/20 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> Score: {skillGap.readinessScore}%
              </span>
            </div>

            <div className="w-full border-t border-white/5 my-6"></div>

            <div className="w-full text-left space-y-4 px-2">
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Target Mission Objective</label>
                <span className="text-[15px] text-zinc-200 font-bold block leading-snug">
                  {user.targetRole} <span className="text-zinc-500 font-medium">at</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400 font-extrabold">{user.targetCompany}</span>
                </span>
              </div>
              
              {user.githubUrl && (
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Repository Ingestion Node</label>
                  <a href={user.githubUrl} target="_blank" rel="noreferrer" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-2 font-semibold truncate group/link">
                    <Github className="w-4 h-4 shrink-0 text-zinc-400 group-hover/link:text-cyan-400 transition-colors" /> 
                    <span>{user.githubUrl.replace('https://', '')}</span>
                    <ExternalLink className="w-3 h-3 opacity-50 group-hover/link:opacity-100 transition-opacity" />
                  </a>
                </div>
              )}
            </div>

            <div className="w-full border-t border-white/5 my-6"></div>
            
            <div className="w-full flex items-center justify-between text-[11px] text-zinc-500 font-medium px-2">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Node Est: 2026</span>
              <span className="font-mono tracking-wider text-zinc-600">ID::#CS-007</span>
            </div>

          </div>
        </FramerGlowCard>

        {/* Right Bento Area (Span 2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 2. Career Overview & Verified Skills */}
          <FramerGlowCard>
            <div className="p-2">
              <div className="flex items-center gap-2 mb-4">
                <Code2 className="w-5 h-5 text-violet-400" />
                <h3 className="text-lg font-bold tracking-tight text-white">Target Career Core Parameters</h3>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed font-medium mb-6">
                Analyzing skill benchmarks to bridge the delta towards <span className="text-white font-bold">{user.targetRole}</span> at <span className="text-cyan-400 font-bold">{user.targetCompany}</span>. Below are your verified capabilities currently ingested in the engine:
              </p>
              
              <div className="flex flex-wrap gap-2.5">
                {user.skills && user.skills.length > 0 ? (
                  user.skills.map((skill, i) => (
                    <div key={i} className="text-xs font-semibold bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl text-zinc-200 shadow-sm backdrop-blur-md flex items-center gap-2 hover:border-cyan-500/30 transition-all duration-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                      {skill}
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-zinc-500">No skills mapped yet. Add some in Settings page!</span>
                )}
              </div>
            </div>
          </FramerGlowCard>

          {/* 3. Analytics Bento Grid - 3 small boxes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Readiness Score Card */}
            <FramerGlowCard>
              <div className="p-1 flex flex-col justify-between h-full min-h-[140px]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Readiness Score</span>
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="mt-4">
                  <div className="text-4xl font-extrabold text-white">{skillGap.readinessScore}%</div>
                  <div className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-cyan-400" /> Target role compatibility
                  </div>
                </div>
              </div>
            </FramerGlowCard>

            {/* Skill Gap Card */}
            <FramerGlowCard>
              <div className="p-1 flex flex-col justify-between h-full min-h-[140px]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Skill Gap Delta</span>
                  <Activity className="w-4 h-4 text-rose-400" />
                </div>
                <div className="mt-4">
                  <div className="text-4xl font-extrabold text-white">
                    {skillGap.skillGapPercentage ?? (100 - skillGap.readinessScore)}%
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-1">
                    Missing parameter ratio
                  </div>
                </div>
              </div>
            </FramerGlowCard>

            {/* GitHub Skill Level Card */}
            <FramerGlowCard>
              <div className="p-1 flex flex-col justify-between h-full min-h-[140px]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">GitHub Skill Level</span>
                  <Github className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-extrabold text-white truncate">
                    {githubAnalysis?.estimatedSkillLevel || 'Not Synced'}
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-1.5">
                    Evaluated from public repositories
                  </div>
                </div>
              </div>
            </FramerGlowCard>
            
          </div>

          {/* 4. Secondary Analytics Box (Matches + Roadmaps) & Activity Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Counts Card */}
            <FramerGlowCard>
              <div className="p-1 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <h4 className="text-md font-bold text-white tracking-tight">AI Generated Metrics</h4>
                  </div>
                  
                  <div className="space-y-4 py-2">
                    <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2.5">
                      <span className="text-zinc-400 font-semibold flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-cyan-400" /> Job Matches Generated
                      </span>
                      <span className="font-extrabold text-white text-base">{getJobMatchesCount()} Matches</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-zinc-400 font-semibold flex items-center gap-2">
                        <Map className="w-4 h-4 text-violet-400" /> AI Roadmaps Generated
                      </span>
                      <span className="font-extrabold text-white text-base">{getRoadmapsCount()} Active</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-[11px] text-zinc-500 border-t border-white/5 pt-3 mt-3 leading-normal">
                  All counts compile automatically as you update target variables.
                </div>
              </div>
            </FramerGlowCard>

            {/* Ingestion Activity Status Card */}
            <FramerGlowCard>
              <div className="p-1 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="w-5 h-5 text-emerald-400" />
                    <h4 className="text-md font-bold text-white tracking-tight">Engine Activity Log</h4>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500">Last Telemetry Run</span>
                      <span className="font-semibold text-zinc-300">{getFormattedDate()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500">ATS Resume Vector</span>
                      <span className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                        resumeAnalysis ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-zinc-500 bg-white/5'
                      }`}>
                        {resumeAnalysis ? 'Ingested' : 'Missing'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500">GitHub Node Link</span>
                      <span className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                        githubAnalysis ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-zinc-500 bg-white/5'
                      }`}>
                        {githubAnalysis ? 'Linked' : 'Not Connected'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-zinc-500 border-t border-white/5 pt-3 mt-3 leading-normal">
                  Dossier sync updates with each onboarding check or profile save.
                </div>
              </div>
            </FramerGlowCard>

          </div>

          {/* 5. Subscription Plan Card (Bento Bottom) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Free Plan Status */}
            <FramerGlowCard className="border-cyan-500/10">
              <div className="p-2 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-5 h-5 text-cyan-400" />
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Free Member Tier</h4>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                    You are utilizing the baseline Career Sethu compiler. Access includes standard skills gap analysis and a single static roadmap blueprint.
                  </p>
                </div>
                <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mt-6">
                  Account Status: ACTIVE_FREE
                </div>
              </div>
            </FramerGlowCard>

            {/* Pro Plan Teaser */}
            <FramerGlowCard className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-violet-500/20 relative group hover:border-violet-500/40 transition-all duration-300">
              <div className="p-2 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-violet-400 animate-pulse" />
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">Upgrade to Pro Matrix</h4>
                    </div>
                    <span className="text-[10px] font-bold text-violet-400 bg-violet-400/15 border border-violet-400/20 px-2 py-0.5 rounded-full">
                      $9 / mo
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                    Unlock infinite AI roadmap iterations, real-time job pipeline feeds, deep ATS keyword injection scoring, and prioritized server build speeds.
                  </p>
                </div>
                
                <button 
                  onClick={() => alert("Payment engine disabled: Sandbox demonstration.")}
                  className="mt-6 w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-xs font-bold text-white hover:opacity-90 transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)]"
                >
                  Initiate Upgrade Protocol
                </button>
              </div>
            </FramerGlowCard>

          </div>

        </div>
      </div>

    </div>
  );
}
