import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

import ProfileOverview from '../components/dashboard/ProfileOverview';
import ReadinessScore from '../components/dashboard/ReadinessScore';
import MissingSkills from '../components/dashboard/MissingSkills';
import GithubAnalysisCard from '../components/dashboard/GithubAnalysisCard';
import ResumeAnalysisCard from '../components/dashboard/ResumeAnalysisCard';
import AiRoadmap from '../components/dashboard/AiRoadmap';

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // 1. Get userId from location state (just signed up) or localStorage (returning user)
    const storedUserId = localStorage.getItem('careerSethuUserId');
    const stateUserId = location.state?.userId;
    const userId = stateUserId || storedUserId;

    if (!userId) {
      // If no user context, send back to onboarding
      navigate('/onboarding');
      return;
    }

    // 2. Fetch the aggregated dashboard data
    const fetchDashboard = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/dashboard/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to load dashboard data');
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        console.error('Error fetching dashboard:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, [location, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#000000] text-[#e2e2e2] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
          <p className="text-zinc-400 font-medium">Aggregating Intelligence...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-[#000000] text-[#e2e2e2] flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-400 font-medium mb-4">Error: {error}</p>
          <button onClick={() => navigate('/onboarding')} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm">
            Return to Onboarding
          </button>
        </div>
      </div>
    );
  }

  const { profile, roadmap, skillGap, resumeAnalysis, githubAnalysis } = dashboardData;

  return (
    <div className="min-h-screen bg-[#000000] text-[#e2e2e2] p-4 md:p-10 font-sans relative overflow-hidden">
      {/* Background Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
      <div className="fixed inset-0 z-0 pointer-events-none bg-black/80 backdrop-blur-3xl"></div>

      <div className="relative z-10 max-w-[1400px] mx-auto space-y-8 h-[calc(100vh-80px)] overflow-y-auto custom-scrollbar pr-4">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-4">
          <div>
            <p className="text-[#cfc4c5] text-[13px] font-medium tracking-widest uppercase mb-2">Career Intelligence</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              Welcome back, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-500">{profile.name}</span>
            </h1>
          </div>
        </header>

        {/* CSS Grid Dashboard Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(300px,auto)] pb-10">
          
          {/* Top Row: Profile (4) + Readiness (4) + Missing Skills (4) */}
          <div className="md:col-span-4 h-[300px]">
            <ProfileOverview profile={profile} />
          </div>
          <div className="md:col-span-4 h-[300px]">
            <ReadinessScore score={skillGap?.readinessScore} gapPercentage={skillGap?.skillGapPercentage} />
          </div>
          <div className="md:col-span-4 h-[300px]">
            <MissingSkills missingSkills={skillGap?.missingSkills} />
          </div>

          {/* Middle Row: AI Roadmap (8) + GitHub/Resume (4) */}
          <div className="md:col-span-8 h-[500px]">
             <AiRoadmap roadmap={roadmap} />
          </div>
          
          <div className="md:col-span-4 flex flex-col gap-6 h-[500px]">
            <div className="flex-1 h-1/2">
               <GithubAnalysisCard githubAnalysis={githubAnalysis} />
            </div>
            <div className="flex-1 h-1/2">
               <ResumeAnalysisCard resumeAnalysis={resumeAnalysis} />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
