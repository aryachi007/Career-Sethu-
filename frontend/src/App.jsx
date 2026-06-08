import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Roadmaps from './pages/Roadmaps';
import Jobs from './pages/Jobs';
import Skills from './pages/Skills';
import Profile from './pages/Profile';
import SidebarLayout from './layouts/SidebarLayout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        
        <Route element={<SidebarLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/roadmaps" element={<Roadmaps />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
