import React from 'react';
import { Outlet, NavLink, BrowserRouter, useInRouterContext } from 'react-router-dom';
import { LayoutDashboard, Map, Briefcase, BrainCircuit, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/common/Logo';

function SidebarContent() {
  const { user, logout } = useAuth();

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

            <NavLink 
              to="/settings" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                  isActive 
                    ? 'bg-white/10 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Settings className="w-5 h-5" /> Settings
            </NavLink>
          </nav>
        </div>
        
        {/* User Profile Snippet at Bottom */}
        <div className="mt-auto p-6 border-t border-white/5 flex flex-col gap-3">
          <NavLink 
            to="/profile"
            className={({ isActive }) => 
              `flex items-center gap-3 p-2 rounded-xl transition-all duration-200 w-full ${
                isActive ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            {user?.photoUrl ? (
              <img 
                src={user.photoUrl} 
                alt={user.name} 
                className="w-10 h-10 rounded-full border border-white/10 shrink-0 object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`; }}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-cyan-900/40 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{user?.name || 'SaaS User'}</p>
              <p className="text-xs text-zinc-500 truncate">{user?.email || 'Free Plan'}</p>
            </div>
          </NavLink>

          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs w-full justify-center border border-red-500/10"
          >
            <LogOut className="w-4 h-4" /> Log Out
          </button>
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
