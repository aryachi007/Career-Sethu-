import React from 'react';
import { CheckCircle2, Circle, Lock, BookOpen, Terminal, Trophy } from 'lucide-react';
import FramerGlowCard from '../components/common/FramerGlowCard';

export default function Roadmaps() {
  const milestones = [
    {
      id: 1,
      phase: 'Phase 1',
      title: 'System Design Fundamentals',
      status: 'active',
      icon: <BookOpen className="w-5 h-5 text-cyan-400" />,
      tasks: [
        { name: 'Client-Server Architecture', completed: true },
        { name: 'Load Balancing & Caching', completed: true },
        { name: 'Database Sharding (In Progress)', completed: false },
      ]
    },
    {
      id: 2,
      phase: 'Phase 2',
      title: 'Advanced React & Performance',
      status: 'locked',
      icon: <Terminal className="w-5 h-5 text-zinc-500" />,
      tasks: [
        { name: 'Virtual DOM Deep Dive', completed: false },
        { name: 'useMemo & useCallback optimization', completed: false },
        { name: 'Build a custom React renderer', completed: false },
      ]
    },
    {
      id: 3,
      phase: 'Phase 3',
      title: 'Flipkart Mock Interviews',
      status: 'locked',
      icon: <Trophy className="w-5 h-5 text-zinc-500" />,
      tasks: [
        { name: 'Machine Coding Round (UI)', completed: false },
        { name: 'Problem Solving (DSA)', completed: false },
        { name: 'Hiring Manager Fit', completed: false },
      ]
    }
  ];

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto w-full font-sans">
      
      {/* Header */}
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[13px] font-bold tracking-widest uppercase text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20">
            Active Target
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">SDE-1 at Flipkart</h1>
        
        {/* Progress Bar */}
        <div className="flex items-center gap-4 max-w-md">
          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 w-[20%] rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
          </div>
          <span className="text-sm font-semibold text-zinc-400 shrink-0">20% Complete</span>
        </div>
      </header>

      {/* Vertical Timeline */}
      <div className="relative pl-4 md:pl-8">
        {/* Glowing vertical line */}
        <div className="absolute left-[27px] md:left-[43px] top-4 bottom-0 w-[2px] bg-gradient-to-b from-cyan-400 via-violet-500 to-white/5 rounded-full"></div>

        <div className="space-y-12 relative z-10">
          {milestones.map((milestone, index) => (
            <div key={milestone.id} className="relative flex flex-col md:flex-row gap-6 md:gap-8 group">
              
              {/* Timeline Node Icon */}
              <div className={`w-10 h-10 shrink-0 rounded-full border-2 flex items-center justify-center mt-4 transition-colors duration-300 z-10 ${
                milestone.status === 'active' 
                  ? 'bg-zinc-900 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]' 
                  : 'bg-zinc-900 border-zinc-700'
              }`}>
                {milestone.status === 'active' ? (
                  <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                ) : (
                  <Lock className="w-4 h-4 text-zinc-600" />
                )}
              </div>

              {/* Card Content */}
              <div className={`flex-1 transition-all duration-500 ${milestone.status === 'locked' ? 'opacity-50 grayscale hover:grayscale-0 hover:opacity-100' : ''}`}>
                <FramerGlowCard>
                  <div className="flex flex-col gap-4">
                    
                    {/* Card Header */}
                    <div className="flex items-center gap-3">
                      {milestone.icon}
                      <span className="text-sm font-bold tracking-widest text-zinc-400 uppercase">{milestone.phase}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">{milestone.title}</h3>
                    
                    {/* Tasks List (Using button/span to avoid bg-transparent override issues inside the card) */}
                    <div className="flex flex-col gap-3 mt-2">
                      {milestone.tasks.map((task, i) => (
                        <button key={i} className="flex items-center gap-3 text-left group/task">
                          {task.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                          ) : (
                            <Circle className="w-5 h-5 text-zinc-600 group-hover/task:text-cyan-400 transition-colors shrink-0" />
                          )}
                          <span className={`text-[15px] font-medium ${task.completed ? 'text-zinc-500 line-through' : 'text-zinc-300'}`}>
                            {task.name}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Action Button */}
                    {milestone.status === 'active' && (
                      <button className="mt-4 w-fit px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm font-semibold transition-all">
                        Continue Learning
                      </button>
                    )}

                  </div>
                </FramerGlowCard>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
