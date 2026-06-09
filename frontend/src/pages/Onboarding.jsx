import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link2, X, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import FramerGlowCard from '../components/common/FramerGlowCard';
import Logo from '../components/common/Logo';

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, loginWithGoogle, isFirebaseConfigured, updateUserSession } = useAuth();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStage, setCurrentStage] = useState(null);
  const [completedStages, setCompletedStages] = useState([]);
  
  const progressStages = [
    { id: 'profile', label: 'Creating Profile' },
    { id: 'github', label: 'Analyzing GitHub' },
    { id: 'skillGap', label: 'Calculating Skill Gap' },
    { id: 'roadmap', label: 'Generating Roadmap' },
    { id: 'jobs', label: 'Finding Job Matches' }
  ];

  const [formData, setFormData] = useState({
    fullName: '',
    college: '',
    gradYear: '',
    targetRole: '',
    targetCompany: '',
    githubUrl: ''
  });

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');

  // 1. Redirect if already authenticated and root route is visited
  useEffect(() => {
    if (user) {
      const isOnboardingIncomplete = !user.college || !user.targetRole;
      if (isOnboardingIncomplete) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  // 2. Prefill name from Google user profile
  useEffect(() => {
    if (user && !formData.fullName) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || ''
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim() !== '') {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    setIsGenerating(true);
    setCompletedStages([]);
    
    try {
      // Step A: Update User Details via PUT
      setCurrentStage('profile');
      const userPayload = {
        name: formData.fullName,
        college: formData.college,
        targetRole: formData.targetRole,
        targetCompany: formData.targetCompany,
        githubUrl: formData.githubUrl,
        skills
      };

      const userResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userPayload)
      });

      if (!userResponse.ok) throw new Error('Profile update failed');
      const updatedUser = await userResponse.json();
      if (updateUserSession) {
        updateUserSession(updatedUser);
      }
      setCompletedStages(prev => [...prev, 'profile']);

      // Step B: Analyze GitHub if URL is provided
      setCurrentStage('github');
      if (formData.githubUrl && formData.githubUrl.trim() !== '') {
        try {
          const githubResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/github/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user._id })
          });
          if (!githubResponse.ok) console.warn('GitHub analysis failed');
        } catch (githubErr) {
          console.warn('Failed to call GitHub analysis:', githubErr);
        }
      }
      setCompletedStages(prev => [...prev, 'github']);

      // Step C: Analyze Skill Gap
      setCurrentStage('skillGap');
      try {
        const skillGapResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/skill-gap/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user._id })
        });
        if (!skillGapResponse.ok) console.warn('Skill gap analysis failed');
      } catch (skillGapErr) {
        console.warn('Failed to call Skill Gap analysis:', skillGapErr);
      }
      setCompletedStages(prev => [...prev, 'skillGap']);
      
      // Step D: Generate Roadmap
      setCurrentStage('roadmap');
      try {
        const roadmapResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/roadmaps/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user._id })
        });
        if (!roadmapResponse.ok) throw new Error('Roadmap generation failed');
      } catch (err) {
        console.warn('Roadmap error:', err);
      }
      setCompletedStages(prev => [...prev, 'roadmap']);

      // Step E: Generate Job Matches
      setCurrentStage('jobs');
      try {
        const jobsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/job-matches/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user._id })
        });
        if (!jobsResponse.ok) console.warn('Job matching failed');
      } catch (err) {
        console.warn('Job match error:', err);
      }
      setCompletedStages(prev => [...prev, 'jobs']);
      
      // Navigate to dashboard
      navigate('/dashboard', { state: { userId: user._id } });
    } catch (error) {
      console.error("Failed to process onboarding:", error);
      alert(`Error: ${error.message || 'Network error'}. Please check the console.`);
      setIsGenerating(false);
    }
  };

  // RENDER VIEW A: Google Auth Entry Portal (Not authenticated)
  if (!user) {
    return (
      <div className="min-h-screen bg-[#000000] text-[#e2e2e2] flex items-center justify-center p-4 md:p-12 relative overflow-hidden font-sans w-full">
        {/* Background Decorative Grid */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-20 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="fixed inset-0 z-0 pointer-events-none bg-black/80 backdrop-blur-3xl"></div>

        <div className="relative z-10 w-full max-w-[440px] text-center">
          <Logo size="lg" className="justify-center mb-8" showText={true} />
          
          <FramerGlowCard>
            <div className="flex flex-col gap-6 p-4">
              <header className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5 justify-center text-cyan-400 bg-cyan-400/10 border border-cyan-500/20 px-3 py-1 rounded-full text-xs font-semibold w-fit mx-auto mb-2">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>SaaS Career Copilot</span>
                </div>
                <h1 className="text-3xl md:text-[34px] leading-tight font-bold text-[#e2e2e2] tracking-tight">
                  Design Your Tech Career Pathway.
                </h1>
                <p className="text-sm text-[#cfc4c5] mt-1 px-2 leading-relaxed">
                  Connect your profile, analyze your skill gaps, and generate customized roadmaps optimized for your dream companies.
                </p>
              </header>

              <div className="flex flex-col gap-3 mt-4">
                {/* Sign In Button */}
                <button 
                  onClick={loginWithGoogle}
                  className="flex items-center justify-center gap-3 w-full px-6 py-4 rounded-2xl bg-white text-black hover:bg-zinc-200 transition-all duration-300 font-bold shadow-[0_0_30px_rgba(255,255,255,0.15)] group"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69a5.74 5.74 0 0 1-2.49 3.77v3.1h3.99c2.34-2.16 3.68-5.32 3.68-8.72z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.99-3.1c-1.11.74-2.53 1.19-3.97 1.19-3.05 0-5.64-2.06-6.57-4.83H1.47v3.2A11.97 11.97 0 0 0 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.43 14.35A7.16 7.16 0 0 1 5 12c0-.83.14-1.64.43-2.35V6.45H1.47A11.98 11.98 0 0 0 0 12c0 2.16.57 4.2 1.47 6l3.96-3.65z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.28 2.69 1.47 6.45l3.96 3.2c.93-2.77 3.52-4.83 6.57-4.83z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="text-[11px] text-zinc-500 mt-2 px-4 leading-normal">
                  {!isFirebaseConfigured && (
                    <span className="text-amber-500/80 font-medium">
                      Sandbox Mode: Authenticating through Mock Identity system.
                    </span>
                  )}
                  {isFirebaseConfigured && (
                    <span>Secured with industry-standard Google Firebase Auth policies.</span>
                  )}
                </div>
              </div>
            </div>
          </FramerGlowCard>
        </div>
      </div>
    );
  }

  // RENDER VIEW B: Onboarding Form (Authenticated, profile incomplete)
  return (
    <div className="min-h-screen bg-[#000000] text-[#e2e2e2] flex items-center justify-center p-4 md:p-12 relative overflow-hidden font-sans w-full font-sans">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
      <div className="fixed inset-0 z-0 pointer-events-none bg-black/80 backdrop-blur-3xl"></div>

      <div className="relative z-10 w-full max-w-[440px]">
        <Logo size="lg" className="justify-center mb-6" showText={true} />
        <FramerGlowCard>
          <div className="flex flex-col gap-6 p-2">
            {isGenerating ? (
              <div className="py-8 px-4 flex flex-col items-center">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-6" />
                <h2 className="text-xl font-bold text-white mb-6">Building your career intelligence...</h2>
                <div className="w-full space-y-4">
                  {progressStages.map((stage) => {
                    const isCompleted = completedStages.includes(stage.id);
                    const isActive = currentStage === stage.id;
                    return (
                      <div key={stage.id} className="flex items-center gap-4 text-sm font-medium">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                          isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' :
                          isActive ? 'bg-blue-500/20 border-blue-500 text-blue-400 animate-pulse' :
                          'border-zinc-700 text-zinc-600'
                        }`}>
                          {isCompleted ? <Sparkles className="w-3.5 h-3.5" /> : isActive ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full" />}
                        </div>
                        <span className={isCompleted ? 'text-emerald-400' : isActive ? 'text-blue-400' : 'text-zinc-600'}>
                          {stage.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <>
                <header className="flex flex-col gap-1 items-center text-center">
                  <span className="text-[13px] font-medium text-[#cfc4c5] uppercase tracking-widest mb-2">Step 1 of 2</span>
                  <h1 className="text-3xl md:text-[40px] leading-tight font-bold text-[#e2e2e2] tracking-tight">Complete profile.</h1>
                  <p className="text-[15px] text-[#cfc4c5] mt-1">Let AI build your perfect career roadmap.</p>
                </header>

                <form className="flex flex-col gap-3 w-full mt-2" onSubmit={handleSubmit}>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Full Name" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-[15px] text-[#e2e2e2] placeholder:text-[#cfc4c5]/60 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-colors backdrop-blur-sm" />
                  <input type="text" name="college" value={formData.college} onChange={handleInputChange} placeholder="College / Degree" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-[15px] text-[#e2e2e2] placeholder:text-[#cfc4c5]/60 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-colors backdrop-blur-sm" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input type="text" name="gradYear" value={formData.gradYear} onChange={handleInputChange} placeholder="Grad Year" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-[15px] text-[#e2e2e2] placeholder:text-[#cfc4c5]/60 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-colors backdrop-blur-sm" />
                    <input type="text" name="targetRole" value={formData.targetRole} onChange={handleInputChange} placeholder="Target Role" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-[15px] text-[#e2e2e2] placeholder:text-[#cfc4c5]/60 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-colors backdrop-blur-sm" />
                  </div>
                  <input type="text" name="targetCompany" value={formData.targetCompany} onChange={handleInputChange} placeholder="Target Dream Company" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-[15px] text-[#e2e2e2] placeholder:text-[#cfc4c5]/60 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-colors backdrop-blur-sm" />
                  
                  <div className="relative flex items-center">
                    <Link2 className="absolute left-4 w-5 h-5 text-[#cfc4c5]" />
                    <input type="url" name="githubUrl" value={formData.githubUrl} onChange={handleInputChange} placeholder="GitHub Profile URL" className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-[15px] text-[#e2e2e2] placeholder:text-[#cfc4c5]/60 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-colors backdrop-blur-sm" />
                  </div>

                  <div className="flex flex-col gap-2 mt-2">
                    <label className="text-[13px] font-medium text-[#cfc4c5] uppercase ml-1">Current Skills (Press Enter to add)</label>
                    <div className="w-full min-h-[48px] bg-white/5 border border-white/10 rounded-lg p-2 flex flex-wrap gap-2 items-center focus-within:border-white/40 focus-within:ring-1 focus-within:ring-white/40 transition-colors backdrop-blur-sm">
                      {skills.map((skill, index) => (
                        <span key={index} className="inline-flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full text-[13px] font-medium text-[#e2e2e2]">
                          {skill} 
                          <button type="button" onClick={() => removeSkill(skill)} className="text-[#cfc4c5] hover:text-[#ffb4ab] transition-colors"><X className="w-3.5 h-3.5" /></button>
                        </span>
                      ))}
                      <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={handleAddSkill} placeholder="Add a skill..." className="flex-1 bg-transparent border-none outline-none text-[15px] text-[#e2e2e2] placeholder:text-[#cfc4c5]/50 min-w-[120px] p-1" />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isGenerating}
                    className="mt-4 flex items-center justify-center gap-2 w-full px-8 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-[14px] font-semibold text-white hover:opacity-90 transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    Generate AI Roadmap
                  </button>
                </form>
              </>
            )}
          </div>
        </FramerGlowCard>
      </div>
    </div>
  );
}
