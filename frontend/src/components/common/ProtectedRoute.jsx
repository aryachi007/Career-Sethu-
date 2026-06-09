import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000000] text-[#e2e2e2] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
          <p className="text-zinc-400 font-medium">Validating Identity...</p>
        </div>
      </div>
    );
  }

  // 1. Not logged in -> Redirect to landing page / login
  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // Helper check for incomplete onboarding
  const isOnboardingIncomplete = !user.college || !user.targetRole;

  // 2. Onboarding incomplete -> Only allow /onboarding, redirect others to /onboarding
  if (isOnboardingIncomplete) {
    if (location.pathname !== '/onboarding') {
      return <Navigate to="/onboarding" replace />;
    }
  } else {
    // 3. Onboarding complete -> Redirect away from /onboarding to /dashboard
    if (location.pathname === '/onboarding') {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}
