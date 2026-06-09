import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { BrainCircuit, CheckCircle2, TrendingUp, PlayCircle, ExternalLink, Code2 } from 'lucide-react';
import FramerGlowCard from '../components/common/FramerGlowCard';

export default function Skills() {
  const { dashboardData } = useOutletContext();
  const { profile, skillGap } = dashboardData || {};

  const currentSkills = profile?.skills?.map(skill => ({
    name: skill,
    level: Math.floor(Math.random() * 40) + 60 // Mocking mastery level between 60-100% since backend doesn't provide it
  })) || [];

  const missingSkills = skillGap?.missingSkills || [];

  const courses = missingSkills.slice(0, 4).map((skill, index) => ({
    id: index,
    title: `Mastering ${skill}`,
    platform: 'Recommended',
    type: 'Interactive Course',
    time: 'Self-paced'
  }));

  if (!dashboardData) {
    return (
      <div className="p-6 md:p-10 max-w-7xl mx-auto w-full font-sans">
        <FramerGlowCard>
          <div className="text-center py-20 text-zinc-400">
            No skill data available. Please generate one during onboarding.
          </div>
        </FramerGlowCard>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full font-sans">
      
      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <BrainCircuit className="w-5 h-5 text-emerald-400" />
          <span className="text-[13px] font-bold tracking-widest uppercase text-emerald-400">Skill Intelligence</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">Level up your stack.</h1>
        <p className="text-lg text-zinc-400 max-w-2xl">
          Based on your target of {profile?.targetRole || 'your dream role'} at {profile?.targetCompany || 'your target company'}, here are the critical skills you need to develop.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Current Arsenal & Targets */}
        <div className="lg:col-span-1 space-y-6">
          <FramerGlowCard>
            <div className="flex flex-col h-full">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-zinc-400" /> Current Arsenal
              </h3>
              <div className="space-y-5">
                {currentSkills.length > 0 ? currentSkills.map((skill, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-zinc-300 font-medium">{skill.name}</span>
                      <span className="text-zinc-500">{skill.level}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-zinc-400 rounded-full" 
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-zinc-500">No skills added to your profile.</p>
                )}
              </div>
            </div>
          </FramerGlowCard>

          <FramerGlowCard>
            <div className="flex flex-col h-full">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" /> Priority Targets
              </h3>
              <ul className="space-y-3">
                {missingSkills.length > 0 ? missingSkills.map((skill, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm text-zinc-300 bg-white/5 p-3 rounded-lg border border-white/5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                    {skill}
                  </li>
                )) : (
                  <p className="text-sm text-zinc-500">No missing skills found. You're fully ready!</p>
                )}
              </ul>
            </div>
          </FramerGlowCard>
        </div>

        {/* Right Column: Recommended Courses Grid */}
        <div className="lg:col-span-2">
          <h3 className="text-xl font-bold text-white mb-6">Recommended Learning Path</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {courses.map((course) => (
              <FramerGlowCard key={course.id}>
                <div className="flex flex-col h-full justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                        {course.platform}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                        {course.time}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-white leading-snug">{course.title}</h4>
                    <p className="text-sm text-zinc-400 mt-2 flex items-center gap-1.5">
                      <PlayCircle className="w-4 h-4" /> {course.type}
                    </p>
                  </div>
                  
                  <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold rounded-lg transition-colors border border-white/5">
                    Start Course <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </FramerGlowCard>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
