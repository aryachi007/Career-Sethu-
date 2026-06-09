import React from 'react';
import { useOutletContext } from 'react-router-dom';

import ProfileOverview from '../components/dashboard/ProfileOverview';
import ReadinessScore from '../components/dashboard/ReadinessScore';
import MissingSkills from '../components/dashboard/MissingSkills';
import GithubAnalysisCard from '../components/dashboard/GithubAnalysisCard';
import ResumeAnalysisCard from '../components/dashboard/ResumeAnalysisCard';
import AiRoadmap from '../components/dashboard/AiRoadmap';
import JobMatchesCard from '../components/dashboard/JobMatchesCard';

export default function Dashboard() {
  const { dashboardData, refreshDashboard } = useOutletContext();
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
            <MissingSkills skillGap={skillGap} />
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

          {/* Bottom Row: Job Matches (12) */}
          <div className="md:col-span-12 h-[600px]">
            <JobMatchesCard jobMatches={dashboardData.jobMatches} userId={profile._id} refreshDashboard={refreshDashboard} />
          </div>
          
        </div>
      </div>
    </div>
  );
}
