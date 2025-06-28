import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { UserButton } from '@/components/auth/UserButton';
import { User } from 'lucide-react';
import UserProfile from '@/components/UserProfile';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Header = ({ currentPage, onNavigate }: HeaderProps) => {
  const { user } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <>
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-lg font-semibold text-slate-900">
            Women's Travel Safety
          </Link>

          <nav className="flex items-center space-x-6">
            <Button
              variant={currentPage === 'home' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onNavigate('home')}
            >
              Home
            </Button>
            <Button
              variant={currentPage === 'map' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onNavigate('map')}
            >
              Map
            </Button>
            <Button
              variant={currentPage === 'community' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onNavigate('community')}
            >
              Community
            </Button>
            <Button
              variant={currentPage === 'contribute' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onNavigate('contribute')}
            >
              Contribute
            </Button>
            <Button
              variant={currentPage === 'premium' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onNavigate('premium')}
            >
              Premium
            </Button>
            <Button
              variant={currentPage === 'certification' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onNavigate('certification')}
            >
              Certification
            </Button>
          </nav>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowProfile(true)}
                className="text-slate-600 hover:text-slate-900"
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <UserButton />
            </div>
          ) : (
            <Button
              onClick={() => onNavigate('auth')}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Sign In
            </Button>
          )}
        </div>
      </header>

      {/* User Profile Modal */}
      {showProfile && (
        <UserProfile onClose={() => setShowProfile(false)} />
      )}
    </>
  );
};

export default Header;
