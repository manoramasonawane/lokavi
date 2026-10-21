import React from 'react';
import { User, SystemStatus } from '../api.js';
import { LogOut, LogIn, UserPlus } from 'lucide-react';

interface NavbarProps {
  user: User | null;
  status: SystemStatus | null;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onLogout: () => void;
  onNavigate: (view: string) => void;
  activeView: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenAuth,
  onLogout,
  onNavigate,
  activeView,
}) => {
  return (
    <header className="bg-white/90 backdrop-blur-xs border-b border-[#E8E6E0] sticky top-0 z-30 transition-colors">
      <div className="h-15 px-4 sm:px-6 flex items-center justify-between gap-6 max-w-7xl mx-auto w-full">
        {/* Brand Zone */}
        <div 
          onClick={() => onNavigate('dashboard')} 
          className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
        >
          <div className="w-8 h-8 rounded-xl bg-[#354D43] text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs group-hover:bg-[#2A3E36] transition-colors">
            R
          </div>
          <div className="flex items-center gap-0.5">
            <span className="font-bold text-base tracking-tight text-[#252B3A]">
              ResearchMate
            </span>
            <span className="text-[#8FA998] font-bold text-base">.ai</span>
          </div>
        </div>

        {/* Quick View Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 text-xs font-medium">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'papers', label: 'Literature' },
            { id: 'trends', label: 'Trends' },
            { id: 'matrix', label: 'Matrix' },
            { id: 'projects', label: 'Workspaces' },
          ].map((tab) => {
            const isActive = activeView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#EFF4F0] text-[#354D43] font-semibold border-b-2 border-[#8FA998]'
                    : 'text-[#737B89] hover:text-[#252B3A] hover:bg-[#F8F7F3]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* User Account / Session Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-[#252B3A] leading-tight">{user.fullName}</p>
                <p className="text-[11px] text-[#737B89] truncate max-w-[180px] leading-tight">
                  {user.institution || user.email}
                </p>
              </div>

              <div 
                className="w-8 h-8 rounded-full bg-[#EFF4F0] border border-[#E8E6E0] text-[#354D43] flex items-center justify-center text-xs font-bold font-mono shadow-2xs"
                title={`${user.fullName} (${user.email})`}
              >
                {user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>

              <button
                onClick={onLogout}
                title="Log out"
                className="p-1.5 rounded-lg text-[#737B89] hover:text-[#252B3A] hover:bg-[#F2F0EB] transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl text-[#252B3A] hover:bg-[#F2F0EB] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-[#737B89]" />
                <span>Log In</span>
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-[#354D43] hover:bg-[#2A3E36] text-white shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create Account</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
