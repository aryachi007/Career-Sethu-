import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Roadmaps from './pages/Roadmaps';
import Jobs from './pages/Jobs';
import Skills from './pages/Skills';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import SidebarLayout from './layouts/SidebarLayout';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Entry Portal */}
          <Route path="/" element={<Onboarding />} />
          
          {/* Protected Onboarding Flow */}
          <Route 
            path="/onboarding" 
            element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected Dashboard Console */}
          <Route element={
            <ProtectedRoute>
              <SidebarLayout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/roadmaps" element={<Roadmaps />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
