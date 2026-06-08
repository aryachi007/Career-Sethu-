import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link2, X, Loader2 } from 'lucide-react';
import FramerGlowCard from '../components/common/FramerGlowCard';

export default function Onboarding() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    college: '',
    gradYear: '',
    targetRole: '',
    targetCompany: '',
    githubUrl: ''
  });

  const [skills, setSkills] = useState(['React', 'JavaScript', 'Python']);
  const [skillInput, setSkillInput] = useState('');

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

  const [loadingState, setLoadingState] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setLoadingState('Saving profile...');
    
    try {
      // Step A: Save User
      const userPayload = {
        name: formData.fullName,
        college: formData.college,
        targetRole: formData.targetRole,
        targetCompany: formData.targetCompany,
        githubUrl: formData.githubUrl,
        skills
      };

      const userResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userPayload)
      });

      if (!userResponse.ok) {
        throw new Error('User creation failed');
      }

      const user = await userResponse.json();

      // Step B: Analyze GitHub if URL is provided
      if (formData.githubUrl && formData.githubUrl.trim() !== '') {
        setLoadingState('Analyzing GitHub profile...');
        try {
          const githubResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/github/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user._id })
          });
          if (!githubResponse.ok) {
            console.warn('GitHub analysis failed during onboarding, continuing...');
          }
        } catch (githubErr) {
          console.warn('Failed to call GitHub analysis:', githubErr);
        }
      }

      // Step C: Analyze Skill Gap
      setLoadingState('Analyzing skill gaps...');
      try {
        const skillGapResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/skill-gap/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user._id })
        });
        if (!skillGapResponse.ok) {
          console.warn('Skill gap analysis failed during onboarding, continuing...');
        }
      } catch (skillGapErr) {
        console.warn('Failed to call Skill Gap analysis:', skillGapErr);
      }
      
      // Step D: Generate Roadmap
      setLoadingState('Generating AI roadmap...');
      const roadmapResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/roadmaps/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id })
      });

      if (!roadmapResponse.ok) {
        throw new Error('Roadmap generation failed');
      }

      await roadmapResponse.json();
      setLoadingState('Roadmap generated!');
      
      // Store user ID in localStorage for persistence
      localStorage.setItem('careerSethuUserId', user._id);
      
      // Navigate to dashboard
      navigate('/dashboard', { state: { userId: user._id } });
    } catch (error) {
      console.error("Failed to process onboarding:", error);
      alert(`Error: ${error.message || 'Network error'}. Please check the console.`);
    } finally {
      setIsGenerating(false);
      setLoadingState('');
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#e2e2e2] flex items-center justify-center p-4 md:p-12 relative overflow-hidden font-sans w-full">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
      <div className="fixed inset-0 z-0 pointer-events-none bg-black/80 backdrop-blur-3xl"></div>

      <div className="relative z-10 w-full max-w-[440px]">
        <FramerGlowCard>
          <div className="flex flex-col gap-6 p-2">
            <header className="flex flex-col gap-1 items-center text-center">
              <span className="text-[13px] font-medium text-[#cfc4c5] uppercase tracking-widest mb-2">Step 1 of 2</span>
              <h1 className="text-3xl md:text-[40px] leading-tight font-bold text-[#e2e2e2] tracking-tight">Complete your profile.</h1>
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
                {isGenerating ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> {loadingState}</>
                ) : (
                  "Generate AI Roadmap"
                )}
              </button>
            </form>
          </div>
        </FramerGlowCard>
      </div>
    </div>
  );
}
