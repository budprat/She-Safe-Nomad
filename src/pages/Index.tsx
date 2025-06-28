
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import HomePage from '@/components/HomePage';
import MapPage from '@/components/MapPage';
import CommunityPage from '@/components/CommunityPage';
import ContributePage from '@/components/ContributePage';
import PremiumPage from '@/components/PremiumPage';
import CertificationPage from '@/components/CertificationPage';
import AuthPage from '@/components/auth/AuthPage';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth page if user is not authenticated and trying to access protected pages
  const protectedPages = ['contribute', 'community', 'certification'];
  if (!user && protectedPages.includes(currentPage)) {
    setCurrentPage('auth');
  }

  // Show auth page if currentPage is 'auth'
  if (currentPage === 'auth') {
    return <AuthPage />;
  }

  // Redirect authenticated users away from auth page
  if (user && currentPage === 'auth') {
    setCurrentPage('home');
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'map':
        return <MapPage />;
      case 'community':
        return <CommunityPage />;
      case 'contribute':
        return <ContributePage />;
      case 'premium':
        return <PremiumPage />;
      case 'certification':
        return <CertificationPage />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      {renderPage()}
    </div>
  );
};

export default Index;
