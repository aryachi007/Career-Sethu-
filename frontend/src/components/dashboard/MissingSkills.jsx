import React from 'react';
import { AlertTriangle } from 'lucide-react';
import FramerGlowCard from '../common/FramerGlowCard';

export default function MissingSkills({ skillGap }) {
  const missingSkills = skillGap?.missingSkills;
  const readinessScore = skillGap?.readinessScore;

  const hasData = skillGap && Array.isArray(missingSkills);
  const isFullyQualified = hasData && readinessScore >= 95;

  return (
    <FramerGlowCard className="h-full">
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl border border-orange-500/30 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
          </div>
          <span className="font-semibold text-white text-[13px] uppercase tracking-wider">Critical Missing Skills</span>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {!hasData ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-70 p-4">
              <p className="text-zinc-500 text-sm mb-2">No Skill Gap Data Available</p>
            </div>
          ) : isFullyQualified ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-emerald-400 text-sm font-medium">You have all the required skills!</p>
            </div>
          ) : missingSkills.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center">
              <p className="text-zinc-500 text-sm">No critical missing skills identified.</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {missingSkills.map((skill, idx) => (
                <span key={idx} className="px-3 py-1.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-[13px] text-orange-200">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </FramerGlowCard>
  );
}
