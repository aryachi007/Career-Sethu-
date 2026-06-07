import React from 'react';
import { FileText, CheckCircle2, AlertCircle, Briefcase } from 'lucide-react';
import FramerGlowCard from '../common/FramerGlowCard';

export default function ResumeAnalysisCard({ resumeAnalysis }) {
  if (!resumeAnalysis) {
    return (
      <FramerGlowCard className="h-full">
        <div className="flex flex-col items-center justify-center h-full text-center p-6 opacity-70">
          <FileText className="w-12 h-12 text-zinc-600 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No Resume Uploaded</h3>
          <p className="text-sm text-zinc-400">Upload your resume to get automated ATS screening and skill extraction.</p>
        </div>
      </FramerGlowCard>
    );
  }

  return (
    <FramerGlowCard className="h-full">
      <div className="flex flex-col h-full gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl border border-emerald-500/30 flex items-center justify-center">
              <FileText className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="font-semibold text-white text-[13px] uppercase tracking-wider">Resume ATS Analysis</span>
          </div>
          <span className="text-xs text-zinc-500 truncate max-w-[120px]">{resumeAnalysis.fileName}</span>
        </div>

        <div className="mt-2 overflow-y-auto pr-2 custom-scrollbar flex-1 space-y-5">
          
          {resumeAnalysis.experience?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-4 h-4 text-zinc-400" />
                <span className="text-sm text-white font-medium">Recent Experience</span>
              </div>
              <p className="text-sm text-zinc-400 pl-6 border-l-2 border-white/10 ml-2 py-1">
                {resumeAnalysis.experience[0]}
              </p>
            </div>
          )}

          {resumeAnalysis.strengths?.length > 0 && (
            <div>
              <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-2 block">Resume Strengths</span>
              <ul className="space-y-2">
                {resumeAnalysis.strengths.slice(0, 2).map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-emerald-200/80">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {resumeAnalysis.weaknesses?.length > 0 && (
            <div>
              <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-2 block">ATS Warnings</span>
              <ul className="space-y-2">
                {resumeAnalysis.weaknesses.slice(0, 2).map((weak, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-amber-200/80">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
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
