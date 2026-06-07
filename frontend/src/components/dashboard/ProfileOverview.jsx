import React from 'react';
import { User, Target, Building2, Code2 } from 'lucide-react';
import FramerGlowCard from '../common/FramerGlowCard';

export default function ProfileOverview({ profile }) {
  if (!profile) return null;

  return (
    <FramerGlowCard className="h-full">
      <div className="flex flex-col h-full gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl border border-blue-500/30 flex items-center justify-center">
            <User className="w-5 h-5 text-blue-400" />
          </div>
          <span className="font-semibold text-white text-[13px] uppercase tracking-wider">Profile Overview</span>
        </div>

        <div className="mt-2 space-y-4 flex-1">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">{profile.name}</h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-[#cfc4c5]">
              <Target className="w-4 h-4 text-zinc-400" />
              <span className="text-[15px]">Target: <strong className="text-white font-medium">{profile.targetRole || "Not specified"}</strong></span>
            </div>
            
            <div className="flex items-center gap-3 text-[#cfc4c5]">
              <Building2 className="w-4 h-4 text-zinc-400" />
              <span className="text-[15px]">Company: <strong className="text-white font-medium">{profile.targetCompany || "Any"}</strong></span>
            </div>

            <div className="flex items-start gap-3 text-[#cfc4c5]">
              <Code2 className="w-4 h-4 text-zinc-400 mt-0.5" />
              <div className="flex-1">
                <span className="text-[15px] block mb-2">Current Skills:</span>
                <div className="flex flex-wrap gap-2">
                  {profile.skills?.length > 0 ? profile.skills.map((skill, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-white">
                      {skill}
                    </span>
                  )) : (
                    <span className="text-xs text-zinc-500">None added</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FramerGlowCard>
  );
}
