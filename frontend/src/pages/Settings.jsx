import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Briefcase, 
  Settings as SettingsIcon, 
  Bell, 
  ShieldAlert, 
  Check, 
  Trash2, 
  LogOut, 
  Loader2, 
  FileText, 
  Sparkles,
  Camera,
  Laptop
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
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

export default function Settings() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Data States
  const [profile, setProfile] = useState({
    name: '',
    college: '',
    targetRole: '',
    targetCompany: '',
    githubUrl: '',
    skills: []
  });
  const [email, setEmail] = useState('sethu.user@example.com');
  const [accountStatus, setAccountStatus] = useState('Free Plan');
  const [hasResume, setHasResume] = useState(false);
  
  // UI States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  
  // Preference States (Local UI only)
  const [selectedTheme, setSelectedTheme] = useState('glassmorphic');
  const [notifications, setNotifications] = useState({
    roadmaps: true,
    jobs: true,
    security: false
  });
  
  // Modal States
  const [activeModal, setActiveModal] = useState(null); // 'logout' | 'delete' | null
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const userId = localStorage.getItem('careerSethuUserId') || user?._id;
    if (!userId) {
      navigate('/onboarding');
      return;
    }

    if (user?.email) {
      setEmail(user.email);
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/dashboard/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch data');
        return res.json();
      })
      .then(data => {
        if (data && data.profile) {
          setProfile({
            name: data.profile.name || user?.name || '',
            college: data.profile.college || '',
            targetRole: data.profile.targetRole || '',
            targetCompany: data.profile.targetCompany || '',
            githubUrl: data.profile.githubUrl || '',
            skills: data.profile.skills || []
          });
          setHasResume(!!data.resumeAnalysis);
          if (data.profile.email) {
            setEmail(data.profile.email);
          }
          if (data.profile.githubUrl) {
            setAccountStatus('Verified Member');
          }
        }
      })
      .catch(err => {
        console.error('Error fetching settings:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate, user]);

  // Form Handlers
  const handleInputChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!profile.skills.includes(skillInput.trim())) {
        setProfile({
          ...profile,
          skills: [...profile.skills, skillInput.trim()]
        });
      }
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(s => s !== skillToRemove)
    });
  };

  // Save Preferences to API
  const handleSavePreferences = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    
    const userId = localStorage.getItem('careerSethuUserId') || user?._id;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      
      if (!response.ok) throw new Error('Failed to save settings');
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save preferences. Please check server logs.');
    } finally {
      setSaving(false);
    }
  };

  // Logout Action
  const handleLogoutConfirm = async () => {
    setActiveModal(null);
    await logout();
    navigate('/');
  };

  // Delete Account Action
  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    const userId = localStorage.getItem('careerSethuUserId') || user?._id;
    try {
      await logout();
      // Simulated DB delete
      setTimeout(() => {
        setIsDeleting(false);
        setActiveModal(null);
        navigate('/');
      }, 1500);
    } catch (err) {
      console.error(err);
      setIsDeleting(false);
      alert('Failed to delete account.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000000] text-[#e2e2e2] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-cyan-400" />
          <p className="text-zinc-400 font-medium font-sans">Accessing Control Panel...</p>
        </div>
      </div>
    );
  }

  // Get dynamic user initial
  const userInitial = profile.name ? profile.name.charAt(0).toUpperCase() : 'S';

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto w-full font-sans text-white bg-transparent select-none">
      
      {/* Top Header */}
      <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <span className="text-xs font-bold tracking-widest uppercase text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20 flex items-center gap-1.5">
              <SettingsIcon className="w-3.5 h-3.5" /> System Console
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
            System Preferences
          </h1>
        </div>
        
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-2 rounded-2xl backdrop-blur-md">
          <div className="px-4 py-2 text-center border-r border-white/5">
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Plan Tier</div>
            <div className="text-sm font-bold text-cyan-400 mt-0.5">{accountStatus}</div>
          </div>
          <div className="px-4 py-2 text-center">
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Node Status</div>
            <div className="text-sm font-bold text-emerald-400 mt-0.5">Online</div>
          </div>
        </div>
      </header>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Account Profile Pic & Status Details */}
        <div className="space-y-6 lg:col-span-1">
          <FramerGlowCard>
            <div className="flex flex-col items-center text-center p-2 relative group">
              <div className="relative mb-6">
                {/* Holographic Ring */}
                <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-cyan-400 via-violet-500 to-amber-400 p-[3px] shadow-[0_0_25px_rgba(34,211,238,0.25)] relative">
                  <div className="w-full h-full bg-zinc-950 rounded-full flex items-center justify-center border border-black overflow-hidden">
                    {user?.photoUrl ? (
                      <img 
                        src={user.photoUrl} 
                        alt={profile.name} 
                        className="w-full h-full rounded-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.onerror = null; e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${profile.name}`; }}
                      />
                    ) : (
                      <span className="text-3xl font-extrabold text-zinc-300 group-hover:scale-105 transition-transform duration-500">{userInitial}</span>
                    )}
                  </div>
                </div>
                {/* Camera Overlay Icon */}
                <div className="absolute bottom-0 right-0 bg-white/10 border border-white/20 p-2 rounded-full backdrop-blur-md cursor-pointer hover:bg-white/20 hover:scale-110 transition-all duration-300">
                  <Camera className="w-4 h-4 text-white" />
                </div>
              </div>

              <h2 className="text-xl font-bold tracking-tight text-white mb-1">{profile.name}</h2>
              <span className="text-xs font-mono text-zinc-500">{email}</span>

              <div className="w-full border-t border-white/5 my-6"></div>

              {/* Account Metrics */}
              <div className="w-full text-left space-y-4 px-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500 font-medium">Node Account Type</span>
                  <span className="text-cyan-400 font-bold bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20 text-xs">Standard</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500 font-medium">Identity Auth</span>
                  <span className="text-zinc-400 font-semibold">Local Storage</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500 font-medium">Node Security Tier</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1 text-xs">
                    Verified
                  </span>
                </div>
              </div>
            </div>
          </FramerGlowCard>
        </div>

        {/* Center/Right Column: Career Preferences, Integrations, UI toggles */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card A: Career Preferences & Dynamic Skills Ingestion */}
          <FramerGlowCard>
            <div className="p-2">
              <div className="flex items-center gap-2.5 mb-6">
                <Briefcase className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold tracking-tight text-white">Target Mission Parameters</h3>
              </div>
              
              <form onSubmit={handleSavePreferences} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">Full Profile Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={profile.name} 
                      onChange={handleInputChange} 
                      placeholder="e.g. Sethu User" 
                      required 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[14px] text-[#e2e2e2] placeholder:text-[#cfc4c5]/40 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all duration-300 backdrop-blur-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">Institution / College</label>
                    <input 
                      type="text" 
                      name="college" 
                      value={profile.college} 
                      onChange={handleInputChange} 
                      placeholder="e.g. AMC Engineering College" 
                      required 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[14px] text-[#e2e2e2] placeholder:text-[#cfc4c5]/40 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all duration-300 backdrop-blur-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">Target Career Role</label>
                    <input 
                      type="text" 
                      name="targetRole" 
                      value={profile.targetRole} 
                      onChange={handleInputChange} 
                      placeholder="e.g. Frontend Engineer" 
                      required 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[14px] text-[#e2e2e2] placeholder:text-[#cfc4c5]/40 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all duration-300 backdrop-blur-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">Dream Company Destination</label>
                    <input 
                      type="text" 
                      name="targetCompany" 
                      value={profile.targetCompany} 
                      onChange={handleInputChange} 
                      placeholder="e.g. Google" 
                      required 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[14px] text-[#e2e2e2] placeholder:text-[#cfc4c5]/40 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all duration-300 backdrop-blur-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">Skills Matrix (Press Enter to Inject)</label>
                  <div className="w-full min-h-[48px] bg-white/5 border border-white/10 rounded-xl p-2.5 flex flex-wrap gap-2 items-center focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/50 transition-all duration-300 backdrop-blur-sm">
                    {profile.skills.map((skill, index) => (
                      <span key={index} className="inline-flex items-center gap-1.5 bg-white/10 border border-white/5 px-3 py-1.5 rounded-lg text-[13px] font-semibold text-zinc-200">
                        {skill} 
                        <button 
                          type="button" 
                          onClick={() => handleRemoveSkill(skill)} 
                          className="text-zinc-500 hover:text-red-400 transition-colors"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <input 
                      type="text" 
                      value={skillInput} 
                      onChange={(e) => setSkillInput(e.target.value)} 
                      onKeyDown={handleAddSkill} 
                      placeholder="Inject a skill..." 
                      className="flex-1 bg-transparent border-none outline-none text-[14px] text-[#e2e2e2] placeholder:text-[#cfc4c5]/30 min-w-[120px] p-1"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-5 mt-4">
                  <div className="text-xs text-zinc-500 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> System syncs updates automatically
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={saving}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 text-[13px] font-bold text-black hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                  >
                    {saving ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                    ) : saveSuccess ? (
                      <><Check className="w-4 h-4" /> Parameters Updated</>
                    ) : (
                      "Save Preferences"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </FramerGlowCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card B: Preferences UI Controls (Theme & Notifications) */}
            <FramerGlowCard>
              <div className="p-1 h-full flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-5">
                  <Laptop className="w-5 h-5 text-zinc-400" />
                  <h4 className="text-md font-bold text-white tracking-tight">Theme Matrix (UI only)</h4>
                </div>
                
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'glassmorphic', label: 'Glass', color: 'from-cyan-500/20 to-violet-500/20' },
                    { id: 'cyberpunk', label: 'Neon', color: 'from-fuchsia-500/20 to-amber-500/20' },
                    { id: 'classic', label: 'Carbon', color: 'from-zinc-800 to-zinc-900' }
                  ].map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-300 ${
                        selectedTheme === theme.id 
                          ? 'border-cyan-400 bg-white/5 shadow-[0_0_10px_rgba(34,211,238,0.15)]' 
                          : 'border-white/5 hover:border-white/25 hover:bg-white/5'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${theme.color} mb-2 border border-white/10`} />
                      <span className="text-[11px] font-bold text-zinc-300">{theme.label}</span>
                    </button>
                  ))}
                </div>

                <div className="border-t border-white/5 my-5" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Bell className="w-4 h-4 text-cyan-400" />
                      <div>
                        <div className="text-[13px] font-bold text-white leading-tight">AI Insights Alerts</div>
                        <div className="text-[10px] text-zinc-500">Notify when target gap updates</div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notifications.roadmaps} 
                        onChange={() => setNotifications({ ...notifications, roadmaps: !notifications.roadmaps })} 
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500 peer-checked:after:bg-black"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Briefcase className="w-4 h-4 text-violet-400" />
                      <div>
                        <div className="text-[13px] font-bold text-white leading-tight">Pipeline Matches</div>
                        <div className="text-[10px] text-zinc-500">Notify of top matched opportunities</div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notifications.jobs} 
                        onChange={() => setNotifications({ ...notifications, jobs: !notifications.jobs })} 
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500 peer-checked:after:bg-black"></div>
                    </label>
                  </div>
                </div>
              </div>
            </FramerGlowCard>

            {/* Card C: Core Integrations Status */}
            <FramerGlowCard>
              <div className="p-1 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <h4 className="text-md font-bold text-white tracking-tight">External Nodes Status</h4>
                  </div>
                  
                  <div className="space-y-4">
                    {/* GitHub Connection */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-3">
                        <Github className="w-5 h-5 text-zinc-300" />
                        <div>
                          <div className="text-[13px] font-bold text-white">GitHub Connection</div>
                          <div className="text-[11px] text-zinc-500 truncate max-w-[120px] md:max-w-[180px]">
                            {profile.githubUrl ? profile.githubUrl.replace('https://github.com/', '') : 'Not Configured'}
                          </div>
                        </div>
                      </div>
                      
                      {profile.githubUrl ? (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                          Synced
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-zinc-500 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                          Empty
                        </span>
                      )}
                    </div>

                    {/* Resume Upload */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-zinc-300" />
                        <div>
                          <div className="text-[13px] font-bold text-white">ATS Resume Index</div>
                          <div className="text-[11px] text-zinc-500">
                            {hasResume ? 'Document Compiled' : 'No document uploaded'}
                          </div>
                        </div>
                      </div>
                      
                      {hasResume ? (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                          Analyzed
                        </span>
                      ) : (
                        <button 
                          onClick={() => navigate('/dashboard')}
                          className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 rounded-lg"
                        >
                          Upload
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-zinc-500 mt-4 leading-normal">
                  Connect third-party accounts to allow real-time compilation of career readiness vectors.
                </div>
              </div>
            </FramerGlowCard>
          </div>

          {/* Card D: System Termination / Log Out & Destruction Zone */}
          <FramerGlowCard className="border-red-500/20">
            <div className="p-2">
              <div className="flex items-center gap-2 mb-4">
                <ShieldAlert className="w-5 h-5 text-red-400" />
                <h4 className="text-md font-bold text-white tracking-tight">Danger Actions Matrix</h4>
              </div>
              <p className="text-[13px] text-zinc-500 mb-5 leading-normal">
                Executing actions here terminates your local session or completely deletes your identity dossier from the secure cluster.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => setActiveModal('logout')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-xs font-bold text-zinc-300 duration-300"
                >
                  <LogOut className="w-4 h-4 text-zinc-500" /> Terminate Session
                </button>
                <button 
                  onClick={() => setActiveModal('delete')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 transition-all text-xs font-bold text-red-400 duration-300"
                >
                  <Trash2 className="w-4 h-4" /> Purge Account Identity
                </button>
              </div>
            </div>
          </FramerGlowCard>

        </div>
      </div>

      {/* Confirmation Modal */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e0e10] border border-white/10 rounded-3xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-3 text-white mb-4">
              <ShieldAlert className={`w-6 h-6 ${activeModal === 'delete' ? 'text-red-400' : 'text-amber-400'}`} />
              <h3 className="text-xl font-bold">
                {activeModal === 'delete' ? 'Destructive Action Confirmation' : 'Session Termination Check'}
              </h3>
            </div>
            
            <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
              {activeModal === 'delete' 
                ? 'Are you absolutely sure you want to purge your identity? This will remove all calculated roadmaps, skill matrices, and analysis benchmarks from our cluster. This action is final.' 
                : 'Are you sure you want to log out of Career Sethu? Your progress is securely saved in the database.'}
            </p>
            
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setActiveModal(null)}
                disabled={isDeleting}
                className="px-5 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-xs font-bold text-zinc-400"
              >
                Cancel Action
              </button>
              
              {activeModal === 'delete' ? (
                <button 
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="px-5 py-2 rounded-xl bg-red-500 text-black hover:bg-red-400 transition-all text-xs font-bold flex items-center gap-1.5"
                >
                  {isDeleting ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Purging...</>
                  ) : (
                    "Confirm Purge"
                  )}
                </button>
              ) : (
                <button 
                  onClick={handleLogoutConfirm}
                  className="px-5 py-2 rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 transition-all text-xs font-bold"
                >
                  Terminate Session
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
