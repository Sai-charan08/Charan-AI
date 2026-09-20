'use client';

import React, { useState } from 'react';
import { Plus, Settings, PanelLeft, LogIn, LogOut, Smartphone } from 'lucide-react';
import { ChatSettings } from '@/types/chat';
import { useAuth } from '@/lib/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { Logo } from '@/components/ui/Logo';

interface HeaderProps {
  onNewChat: () => void;
  onOpenSettings: () => void;
  onToggleSidebar: () => void;
  onOpenInstallApp?: () => void;
  isSidebarOpen?: boolean;
  settings: ChatSettings;
  onUpdateSettings: (newSettings: Partial<ChatSettings>) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNewChat,
  onOpenSettings,
  onToggleSidebar,
  onOpenInstallApp,
  isSidebarOpen = true,
  settings,
  onUpdateSettings,
}) => {
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');

  const openAuth = (tab: 'signin' | 'signup' = 'signin') => {
    setAuthTab(tab);
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-[#30363d]/60 bg-[#0d1117]/80 px-4 sm:px-6 backdrop-blur-xl select-none">
        {/* Left: Sidebar Toggle & Logo */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleSidebar}
            className="rounded-lg p-1.5 text-[#8b949e] hover:bg-[#21262d] hover:text-[#f0f6fc] transition-colors"
            title="Toggle Sidebar"
          >
            <PanelLeft className="h-5 w-5" />
          </button>

          <div className={isSidebarOpen ? "lg:hidden" : "flex"}>
            <Logo size="sm" />
          </div>
        </div>



        {/* Right: Actions & User Auth */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {onOpenInstallApp && (
            <button
              onClick={onOpenInstallApp}
              className="flex items-center space-x-1.5 rounded-lg bg-amber-500/10 border border-amber-500/40 px-2.5 py-1.5 text-xs font-semibold text-amber-400 transition-all hover:bg-amber-500/20 hover:border-amber-500/60 active:scale-95 shadow-sm"
              title="Install Charan AI Mobile & Laptop App"
            >
              <Smartphone className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
              <span>Install App</span>
            </button>
          )}

          <button
            onClick={onNewChat}
            className="flex items-center space-x-1.5 rounded-lg bg-[#161b22] border border-[#30363d] px-3 py-1.5 text-xs font-medium text-[#c9d1d9] transition-all hover:bg-[#21262d] hover:text-[#f0f6fc] hover:border-[#484f58] active:scale-95"
          >
            <Plus className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">New Chat</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="rounded-lg p-1.5 text-[#8b949e] hover:bg-[#21262d] hover:text-[#f0f6fc] transition-colors"
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>


          {/* User Auth Section */}
          {user && !user.isAnonymous ? (
            <div className="relative pl-1 border-l border-[#30363d]/60">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-2 px-2.5 py-1 rounded-xl bg-[#161b22] hover:bg-[#202530] border border-[#30363d] transition-all cursor-pointer"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} className="w-5 h-5 rounded-full border border-amber-500/40" />
                ) : (
                  <div className="w-5.5 h-5.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-[10px] font-bold">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-semibold text-gray-200 hidden md:inline max-w-[110px] truncate">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Online" />
              </button>

              {/* Profile Card Popover */}
              {isProfileMenuOpen && (
                <div
                  className="absolute right-0 top-12 z-50 w-72 rounded-2xl bg-[#16181f] border border-[#2e3442] shadow-2xl p-4 text-white animate-fadeIn"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center space-x-3 pb-3 border-b border-[#252a36]">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || 'User'} className="w-10 h-10 rounded-full border border-amber-500/50" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center text-sm font-bold">
                        {(user.displayName || user.email || 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <div className="flex flex-col truncate">
                      <span className="text-sm font-bold text-white truncate">
                        {user.displayName || 'Charan User'}
                      </span>
                      <span className="text-xs text-gray-400 truncate">
                        {user.email || 'No email associated'}
                      </span>
                    </div>
                  </div>

                  <div className="py-3 space-y-2 text-xs">
                    <div className="flex justify-between items-center text-gray-400">
                      <span>Account Status</span>
                      <span className="text-amber-400 font-medium px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                        {user.email?.includes('gmail') ? 'Google Verified' : 'Registered User'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-gray-400">
                      <span>Chat Cloud Storage</span>
                      <span className="text-emerald-400 font-medium">Active & Saved</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      logout();
                    }}
                    className="w-full mt-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-medium text-xs transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out Account
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openAuth('signin')}
              className="flex items-center space-x-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black px-3 py-1.5 text-xs font-semibold transition-all shadow-sm active:scale-95"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab={authTab}
      />
    </>
  );
};

