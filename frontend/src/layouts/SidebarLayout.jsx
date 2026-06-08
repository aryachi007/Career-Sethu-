import React from 'react';
import { Outlet, NavLink, BrowserRouter, useInRouterContext } from 'react-router-dom';
import { LayoutDashboard, Map, Briefcase, BrainCircuit, User } from 'lucide-react';
import Logo from '../components/common/Logo';

function SidebarContent() {
  return (
    <div className="flex min-h-screen bg-[#000000] text-[#e2e2e2] font-sans overflow-hidden">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-white/10 bg-[#09090b]/80 backdrop-blur-xl flex flex-col z-20 shrink-0">
        <div className="p-6">
          <div className="mb-10">
            <Logo size="md" />
          </div>

          <nav className="flex flex-col gap-2">
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                  isActive 
                    ? 'bg-white/10 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <LayoutDashboard className="w-5 h-5" /> Dashboard
            </NavLink>
            
            <NavLink 
              to="/roadmaps" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                  isActive 
                    ? 'bg-white/10 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Map className="w-5 h-5" /> Roadmaps
            </NavLink>

            <NavLink 
              to="/jobs" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                  isActive 
                    ? 'bg-white/10 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Briefcase className="w-5 h-5" /> Jobs
            </NavLink>

            <NavLink 
              to="/skills" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                  isActive 
                    ? 'bg-white/10 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <BrainCircuit className="w-5 h-5" /> Skills
            </NavLink>

            <NavLink 
              to="/profile" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                  isActive 
                    ? 'bg-white/10 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <User className="w-5 h-5" /> Profile
            </NavLink>
          </nav>
        </div>
        
        {/* User Profile Snippet at Bottom */}
        <div className="mt-auto p-6 border-t border-white/5">
          <NavLink 
            to="/profile"
            className={({ isActive }) => 
              `flex items-center gap-3 p-2 rounded-xl transition-all duration-200 w-full ${
                isActive ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 font-bold border border-white/10 shrink-0">
              S
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Sethu User</p>
              <p className="text-xs text-zinc-500">Free Plan</p>
            </div>
          </NavLink>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 relative h-screen overflow-y-auto overflow-x-hidden">
         {/* The Outlet acts as a placeholder where Dashboard, Roadmaps, etc. will render */}
         <Outlet />
      </main>

    </div>
  );
}

export default function SidebarLayout() {
  const hasRouter = typeof useInRouterContext === 'function' ? useInRouterContext() : false;

  if (!hasRouter) {
    return (
      <BrowserRouter>
        <SidebarContent />
      </BrowserRouter>
    );
  }

  return <SidebarContent />;
}
