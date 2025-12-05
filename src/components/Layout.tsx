import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import SOSButton from './SOSButton';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Main layout component that wraps all pages with header and SOS button
 */
const Layout: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Outlet />
      </main>
      {/* Floating SOS button for authenticated users */}
      {user && <SOSButton variant="floating" />}
    </div>
  );
};

export default Layout;
