
import React, { useState } from 'react';
import Header from '@/components/Header';
import HomePage from '@/components/HomePage';
import MapPage from '@/components/MapPage';
import CommunityPage from '@/components/CommunityPage';
import ContributePage from '@/components/ContributePage';
import PremiumPage from '@/components/PremiumPage';
import CertificationPage from '@/components/CertificationPage';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('home');

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
