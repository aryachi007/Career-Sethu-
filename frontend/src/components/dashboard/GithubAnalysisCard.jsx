import React from 'react';
import { GitBranch, Star, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';
import FramerGlowCard from '../common/FramerGlowCard';

export default function GithubAnalysisCard({ githubAnalysis }) {
  if (!githubAnalysis) {
    return (
      <FramerGlowCard className="h-full">
        <div className="flex flex-col items-center justify-center h-full text-center p-6 opacity-70">
          <GitBranch className="w-12 h-12 text-zinc-600 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No GitHub Connected</h3>
          <p className="text-sm text-zinc-400">Connect your GitHub account in settings to receive code analysis and skill verification.</p>
        </div>
      </FramerGlowCard>
    );
  }

  return (
    <FramerGlowCard className="h-full">
      <div className="flex flex-col h-full gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl border border-violet-500/30 flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-violet-400" />
            </div>
            <span className="font-semibold text-white text-[13px] uppercase tracking-wider">GitHub Analysis</span>
          </div>
          <span className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-medium border border-violet-500/30">
            {githubAnalysis.estimatedSkillLevel}
          </span>
        </div>

        <div className="flex gap-6 mt-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-zinc-400" />
            <span className="text-white font-medium">{githubAnalysis.repoCount} Repos</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="text-sm">@{githubAnalysis.githubUsername}</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
          {githubAnalysis.strengths?.length > 0 && (
            <div>
              <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-2 block">Strengths</span>
              <ul className="space-y-2">
                {githubAnalysis.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-emerald-200/80">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {githubAnalysis.weaknesses?.length > 0 && (
            <div className="mt-2">
              <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-2 block">Areas for Improvement</span>
              <ul className="space-y-2">
                {githubAnalysis.weaknesses.map((weak, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-red-200/80">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{weak}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </FramerGlowCard>
  );
}
