import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import LandingPage from './pages/LandingPage';
import ScannerPage from './pages/ScannerPage';
import ResultsPage from './pages/ResultsPage';
import AwarenessHubPage from './pages/AwarenessHubPage';
import AboutPage from './pages/AboutPage';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-text-primary selection:bg-primary selection:text-white">
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#182235',
            color: '#F9FAFB',
            border: '1px solid #26344d',
            fontSize: '13px'
          }
        }}
      />

      {/* Global Top Navigation */}
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/scanner" element={<ScannerPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/awareness" element={<AwarenessHubPage />} />
          <Route path="/history" element={<Navigate to="/scanner" replace />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
