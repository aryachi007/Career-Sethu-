import React from 'react';
import { Search, MapPin, DollarSign, Building2, Briefcase, Sparkles } from 'lucide-react';
import FramerGlowCard from '../components/common/FramerGlowCard';

export default function Jobs() {
  const jobMatches = [
    { id: 1, role: 'SDE-1', company: 'Flipkart', match: 85, location: 'Bengaluru / Hybrid', salary: '₹18L - ₹24L', type: 'Full-time', active: true },
    { id: 2, role: 'Frontend Engineer', company: 'Cred', match: 92, location: 'Bengaluru / On-site', salary: '₹20L - ₹28L', type: 'Full-time', active: false },
    { id: 3, role: 'React Developer', company: 'Zomato', match: 78, location: 'Gurugram / Remote', salary: '₹15L - ₹22L', type: 'Full-time', active: false },
    { id: 4, role: 'Fullstack Intern', company: 'Razorpay', match: 95, location: 'Remote', salary: '₹60K/mo', type: 'Internship', active: false },
  ];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full font-sans">
      
      {/* Header & Search */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-5 h-5 text-violet-400" />
          <span className="text-[13px] font-bold tracking-widest uppercase text-violet-400">AI Job Matches</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-8">Curated for your profile.</h1>
        
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search roles, companies, or keywords..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all backdrop-blur-md"
            />
          </div>
          <button className="px-6 py-3.5 bg-white text-black rounded-xl font-bold text-sm hover:bg-zinc-200 transition-colors shrink-0">
            Update Filters
          </button>
        </div>
      </header>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        {jobMatches.map((job) => (
          <FramerGlowCard key={job.id}>
            <div className="flex flex-col h-full gap-6">
              
              {/* Card Top: Company & Match Score */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-zinc-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{job.role}</h3>
                    <p className="text-zinc-400 font-medium">{job.company}</p>
                  </div>
                </div>
                
                {/* Glowing Match Badge */}
                <div className={`px-3 py-1.5 rounded-full border flex items-center gap-1.5 ${
                  job.match >= 90 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 
                  job.match >= 80 ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' : 
                  'bg-amber-500/10 border-amber-500/20 text-amber-400'
                }`}>
                  <span className="font-bold text-sm">{job.match}%</span>
                  <span className="text-[11px] uppercase tracking-wider font-semibold opacity-80">Match</span>
                </div>
              </div>

              {/* Card Details: Salary, Location, Type */}
              <div className="flex flex-wrap gap-3 mt-auto">
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/5 px-3 py-1.5 rounded-lg text-sm text-zinc-300">
                  <MapPin className="w-4 h-4 text-zinc-500" /> {job.location}
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/5 px-3 py-1.5 rounded-lg text-sm text-zinc-300">
                  <DollarSign className="w-4 h-4 text-zinc-500" /> {job.salary}
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/5 px-3 py-1.5 rounded-lg text-sm text-zinc-300">
                  <Briefcase className="w-4 h-4 text-zinc-500" /> {job.type}
                </div>
              </div>

              {/* Card Actions */}
              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button className="flex-1 bg-violet-600 hover:bg-violet-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-[0_0_15px_rgba(139,92,246,0.3)] border border-violet-500/50">
                  Apply with Sethu
                </button>
                <button className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-semibold transition-colors border border-white/10">
                  View Details
                </button>
              </div>

            </div>
          </FramerGlowCard>
        ))}
      </div>

    </div>
  );
}
