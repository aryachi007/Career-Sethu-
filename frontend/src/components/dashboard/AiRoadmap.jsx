import React from 'react';
import { Map, BookOpen, Presentation } from 'lucide-react';
import FramerGlowCard from '../common/FramerGlowCard';

export default function AiRoadmap({ roadmap }) {
  if (!roadmap) {
    return (
      <FramerGlowCard className="h-full">
        <div className="flex flex-col items-center justify-center h-full text-center p-6 opacity-70">
          <Map className="w-12 h-12 text-zinc-600 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No Roadmap Generated</h3>
          <p className="text-sm text-zinc-400">Complete your profile to generate an AI roadmap.</p>
        </div>
      </FramerGlowCard>
    );
  }

  return (
    <FramerGlowCard className="h-full">
      <div className="flex flex-col h-full gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl border border-blue-500/30 flex items-center justify-center">
            <Map className="w-5 h-5 text-blue-400" />
          </div>
          <span className="font-semibold text-white text-[13px] uppercase tracking-wider">Your Career Roadmap</span>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">{roadmap.title}</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">{roadmap.overview}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
          {/* Projects */}
          {roadmap.projects?.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Presentation className="w-4 h-4 text-violet-400" />
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Recommended Projects</h3>
              </div>
              <ul className="space-y-3">
                {roadmap.projects.map((project, idx) => (
                  <li key={idx} className="bg-white/5 border border-white/10 rounded-lg p-3">
                    <h4 className="text-sm font-bold text-white mb-1">{project.name}</h4>
                    <p className="text-xs text-zinc-400">{project.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Timeline */}
          {roadmap.timeline?.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Action Plan</h3>
              </div>
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/20 before:to-transparent">
                {roadmap.timeline.map((phase, idx) => (
                  <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-black bg-emerald-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2" />
                    <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-2.5rem)] bg-white/5 border border-white/10 p-3 rounded-lg">
                      <h4 className="text-xs font-bold text-emerald-300 mb-1">{phase.phase}</h4>
                      <p className="text-xs text-zinc-400">{phase.goal}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </FramerGlowCard>
  );
}
