import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, ChevronRight, Loader2, RefreshCw } from 'lucide-react';
import FramerGlowCard from '../common/FramerGlowCard';

export default function JobMatchesCard({ jobMatches, userId, refreshDashboard }) {
  const [activeTab, setActiveTab] = useState('applyNow');
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const tabs = [
    { id: 'applyNow', label: 'Apply Now' },
    { id: 'applyAfterUpskilling', label: 'Apply After Upskilling' },
    { id: 'longTermGoals', label: 'Long-Term Goals' },
  ];

  const handleGenerateMatches = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/job-matches/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (!res.ok) throw new Error("Failed to generate matches");
      
      // Use reactive state update instead of reload
      if (refreshDashboard) {
        await refreshDashboard();
      }
    } catch (error) {
      console.error(error);
      alert("Error generating job matches");
    } finally {
      setIsGenerating(false);
    }
  };

  const hasMatches = jobMatches && (
    jobMatches.applyNow?.length > 0 ||
    jobMatches.applyAfterUpskilling?.length > 0 ||
    jobMatches.longTermGoals?.length > 0
  );

  if (!hasMatches) {
    return (
      <FramerGlowCard className="h-full">
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
          <Briefcase className="w-12 h-12 text-blue-500/50 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">AI Job Match Engine</h3>
          <p className="text-sm text-zinc-400 max-w-sm mb-6">
            We will analyze your entire profile—Resume, GitHub, and Skill Gap—to find roles you are realisticly qualified for today and in the future.
          </p>
          <button 
            onClick={handleGenerateMatches}
            disabled={isGenerating}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-full transition-colors disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
            {isGenerating ? "Analyzing Jobs..." : "Generate Job Matches"}
          </button>
        </div>
      </FramerGlowCard>
    );
  }

  const activeMatches = jobMatches[activeTab] || [];

  return (
    <FramerGlowCard className="h-full">
      <div className="flex flex-col h-full gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl border border-blue-500/30 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-blue-400" />
            </div>
            <span className="font-semibold text-white text-[13px] uppercase tracking-wider">Realistic Job Matches</span>
          </div>
          <button 
            onClick={handleGenerateMatches} 
            disabled={isGenerating}
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
            Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-white/5 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-3 text-xs md:text-sm font-medium rounded-md transition-all ${
                activeTab === tab.id 
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 shadow-sm' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              {tab.label}
              <span className="ml-2 text-[10px] bg-black/30 px-1.5 py-0.5 rounded-full">
                {jobMatches[tab.id]?.length || 0}
              </span>
            </button>
          ))}
        </div>

        {/* Job List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
          {activeMatches.length === 0 ? (
            <div className="text-center py-10 text-zinc-500 text-sm">
              No recommendations in this category.
            </div>
          ) : (
            activeMatches.map((job, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-blue-500/30 transition-colors group">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">{job.jobTitle}</h3>
                    <p className="text-sm text-zinc-400">{job.company}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{job.matchScore}%</span>
                    </div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Match Score</span>
                    {job.confidenceScore && (
                      <span className="text-[10px] text-blue-400/80 mt-1">AI Confidence: {job.confidenceScore}%</span>
                    )}
                  </div>
                </div>

                <p className="text-sm text-emerald-200/90 mb-3 leading-relaxed border-l-2 border-emerald-500/30 pl-3 py-1">
                  {job.recommendation}
                </p>

                {job.nextAction && (
                  <div className="mb-4 bg-blue-500/10 border border-blue-500/20 rounded p-2 flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-blue-400 font-bold block mb-1">Next Action</span>
                      <span className="text-sm text-blue-100">{job.nextAction}</span>
                    </div>
                  </div>
                )}

                {job.missingSkills?.length > 0 && (
                  <div className="mb-3">
                    <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-2 block">Skill Gaps to close</span>
                    <div className="flex flex-wrap gap-2">
                      {job.missingSkills.map((skill, sIdx) => (
                        <span key={sIdx} className="px-2 py-1 rounded bg-orange-500/10 border border-orange-500/20 text-[11px] text-orange-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                  <span className="text-xs font-medium text-blue-300 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                    {job.applicationReadiness}
                  </span>
                  <button 
                    onClick={() => navigate('/jobs')}
                    className="flex items-center text-xs font-bold text-white hover:text-blue-400 transition-colors"
                  >
                    View Details <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </FramerGlowCard>
  );
}
