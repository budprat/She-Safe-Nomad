
import React from 'react';
import { Shield, Menu, User, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Header = ({ currentPage, onNavigate }: HeaderProps) => {
  return (
    <header className="bg-white shadow-lg border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <Shield className="h-8 w-8 text-emerald-600 mr-3" />
            <span className="text-xl font-bold text-slate-900">SafeHer</span>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => onNavigate('map')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'map' 
                  ? 'text-emerald-600 border-b-2 border-emerald-600 pb-1' 
                  : 'text-slate-600 hover:text-emerald-600'
              }`}
            >
              Safety Map
            </button>
            <button 
              onClick={() => onNavigate('community')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'community' 
                  ? 'text-emerald-600 border-b-2 border-emerald-600 pb-1' 
                  : 'text-slate-600 hover:text-emerald-600'
              }`}
            >
              Community
            </button>
            <button 
              onClick={() => onNavigate('contribute')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'contribute' 
                  ? 'text-emerald-600 border-b-2 border-emerald-600 pb-1' 
                  : 'text-slate-600 hover:text-emerald-600'
              }`}
            >
              Contribute
            </button>
            <button 
              onClick={() => onNavigate('premium')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'premium' 
                  ? 'text-emerald-600 border-b-2 border-emerald-600 pb-1' 
                  : 'text-slate-600 hover:text-emerald-600'
              }`}
            >
              Premium
            </button>
            <button 
              onClick={() => onNavigate('certification')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'certification' 
                  ? 'text-emerald-600 border-b-2 border-emerald-600 pb-1' 
                  : 'text-slate-600 hover:text-emerald-600'
              }`}
            >
              Business
            </button>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </Button>
            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
              Sign In
            </Button>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Join Now
            </Button>
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
