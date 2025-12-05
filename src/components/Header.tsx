import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import UserButton from '@/components/auth/UserButton';
import SOSButton from '@/components/SOSButton';
import { User, Shield, Menu, X } from 'lucide-react';
import UserProfile from '@/components/UserProfile';

const Header: React.FC = () => {
  const { user } = useAuth();
  const { data: isAdmin } = useIsAdmin();
  const location = useLocation();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/map', label: 'Map' },
    { path: '/community', label: 'Community', protected: true },
    { path: '/contribute', label: 'Contribute', protected: true },
    { path: '/premium', label: 'Premium' },
    { path: '/certification', label: 'Certification', protected: true },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="text-lg font-semibold text-slate-900 flex items-center">
              <span className="text-emerald-600 mr-1">She-Safe</span>
              <span>Nomad</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path}>
                  <Button
                    variant={isActive(link.path) ? 'default' : 'ghost'}
                    size="sm"
                    className={isActive(link.path) ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                  >
                    {link.label}
                  </Button>
                </Link>
              ))}
              {isAdmin && (
                <Link to="/admin">
                  <Button
                    variant={isActive('/admin') ? 'default' : 'ghost'}
                    size="sm"
                    className={`${isActive('/admin') ? 'bg-red-600 hover:bg-red-700' : 'text-red-600 hover:text-red-700'}`}
                  >
                    <Shield className="h-4 w-4 mr-1" />
                    Admin
                  </Button>
                </Link>
              )}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Emergency SOS Button - Only visible when signed in */}
              {user && <SOSButton variant="header" />}

              {user ? (
                <div className="hidden md:flex items-center space-x-3">
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
                <Link to="/auth" className="hidden md:block">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    Sign In
                  </Button>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t pt-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block"
                >
                  <Button
                    variant={isActive(link.path) ? 'default' : 'ghost'}
                    size="sm"
                    className={`w-full justify-start ${isActive(link.path) ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                  >
                    {link.label}
                  </Button>
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block"
                >
                  <Button
                    variant={isActive('/admin') ? 'default' : 'ghost'}
                    size="sm"
                    className={`w-full justify-start ${isActive('/admin') ? 'bg-red-600 hover:bg-red-700' : 'text-red-600'}`}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Admin
                  </Button>
                </Link>
              )}
              <div className="border-t pt-4 mt-4">
                {user ? (
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowProfile(true);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full justify-start"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                    <UserButton />
                  </div>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block"
                  >
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </nav>
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
