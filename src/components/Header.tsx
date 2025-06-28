
import React from 'react';
import { Shield, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import UserButton from '@/components/auth/UserButton';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user } = useAuth();

  const navigationItems = [
    { id: 'home', label: 'Home' },
    { id: 'map', label: 'Safety Map' },
    { id: 'community', label: 'Community', requiresAuth: true },
    { id: 'contribute', label: 'Contribute', requiresAuth: true },
    { id: 'premium', label: 'Premium' },
    { id: 'certification', label: 'Certification' },
  ];

  const handleNavClick = (pageId: string, requiresAuth?: boolean) => {
    if (requiresAuth && !user) {
      onNavigate('auth');
    } else {
      onNavigate(pageId);
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => onNavigate('home')}
          >
            <Shield className="h-8 w-8 text-pink-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">Safe Travels</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  currentPage === item.id
                    ? 'text-pink-600 border-b-2 border-pink-600'
                    : 'text-gray-700 hover:text-pink-600'
                }`}
                onClick={() => handleNavClick(item.id, item.requiresAuth)}
              >
                {item.label}
                {item.requiresAuth && !user && (
                  <span className="ml-1 text-xs text-gray-400">*</span>
                )}
              </button>
            ))}
          </nav>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <UserButton onNavigate={onNavigate} />
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  onClick={() => onNavigate('auth')}
                  className="text-gray-700 hover:text-pink-600"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => onNavigate('auth')}
                  className="bg-pink-600 hover:bg-pink-700 text-white"
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  className={`px-3 py-2 text-left text-sm font-medium transition-colors ${
                    currentPage === item.id
                      ? 'text-pink-600 bg-pink-50'
                      : 'text-gray-700 hover:text-pink-600 hover:bg-gray-50'
                  }`}
                  onClick={() => handleNavClick(item.id, item.requiresAuth)}
                >
                  {item.label}
                  {item.requiresAuth && !user && (
                    <span className="ml-1 text-xs text-gray-400">*</span>
                  )}
                </button>
              ))}
              
              {!user && (
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                  <Button
                    variant="ghost"
                    onClick={() => handleNavClick('auth')}
                    className="justify-start text-gray-700 hover:text-pink-600"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => handleNavClick('auth')}
                    className="justify-start bg-pink-600 hover:bg-pink-700 text-white"
                  >
                    Get Started
                  </Button>
                </div>
              )}
              
              {user && (
                <div className="pt-4 border-t border-gray-200">
                  <UserButton onNavigate={onNavigate} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
