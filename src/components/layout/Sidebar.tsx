'use client';

import React, { useState, useEffect } from 'react';
import { Plus, MessageSquare, Trash2, Edit2, ChevronDown, PanelLeftClose, LogOut, User as UserIcon, Sparkles, Image as ImageIcon, FileText, Code2, Smartphone } from 'lucide-react';

import { ChatSession, ChatSettings, WorkspaceType } from '@/types/chat';
import { useAuth } from '@/lib/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { Logo } from '@/components/ui/Logo';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, newTitle: string) => void;
  onClearAllSessions: () => void;
  isOpen: boolean;
  onClose: () => void;
  settings: ChatSettings;
  onUpdateSettings: (newSettings: Partial<ChatSettings>) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onRenameSession,
  onClearAllSessions,
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  const { user, logout } = useAuth();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstallPWA, setCanInstallPWA] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const activeWs = settings.activeWorkspace || 'general';

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstallPWA(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setCanInstallPWA(false);
      }
      setDeferredPrompt(null);
    } else {
      alert('To install Charan AI on your phone or laptop:\n\n• On iOS (Safari): Tap Share button → "Add to Home Screen"\n• On Android (Chrome): Tap Menu (⋮) → "Install App"\n• On Laptop (Chrome/Edge): Click Install icon in address bar');
    }
  };


  const WORKSPACES: { id: WorkspaceType; label: string; icon: any }[] = [
    { id: 'general', label: 'General Workspace', icon: Sparkles },
    { id: 'visual', label: 'AI Visual Studio', icon: ImageIcon },
    { id: 'rag', label: 'Document & Data RAG', icon: FileText },
    { id: 'code', label: 'Code & Architecture', icon: Code2 },
  ];

  const currentWsLabel = WORKSPACES.find((w) => w.id === activeWs)?.label || 'General Workspace';

  const startEditing = (s: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(s.id);
    setEditTitle(s.title);
  };

  const handleSaveTitle = (id: string, e: React.FormEvent) => {
    e.preventDefault();
    if (editTitle.trim()) {
      onRenameSession(id, editTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Navigation - Exact Pitch Black #111318 */}
      <aside
        className={`sidebar-pitch-black fixed top-0 bottom-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out lg:static lg:z-auto ${
          isOpen
            ? 'w-64 p-4 opacity-100 translate-x-0'
            : '-translate-x-full w-64 p-4 lg:w-0 lg:p-0 lg:opacity-0 lg:overflow-hidden lg:border-0'
        }`}
      >
        {/* Header: Logo Only */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#1c1f28]">
          <Logo size="sm" />
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-[#8c92a0] hover:bg-[#1f222b] lg:hidden"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>

        {/* Embedded Active Workspace Section */}
        <div className="mt-3.5 p-2.5 rounded-2xl bg-[#161822] border border-[#242836]">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-2 py-1 mb-1">
            SELECT ACTIVE WORKSPACE
          </div>
          <div className="space-y-1">
            {WORKSPACES.map((ws) => {
              const Icon = ws.icon;
              const isSelected = activeWs === ws.id;
              return (
                <button
                  key={ws.id}
                  onClick={() => onUpdateSettings({ activeWorkspace: ws.id })}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm'
                      : 'text-gray-400 hover:bg-[#1f2330] hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-gray-400'}`} />
                    <span>{ws.label}</span>
                  </div>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>



        {/* New Chat Button (Exact screenshot style: New Chat   +) */}
        <button
          onClick={() => {
            onNewChat();
            onClose();
          }}
          className="mt-4 flex items-center justify-between rounded-xl border border-[#262933] bg-[#1a1c24] px-3.5 py-2.5 text-xs font-medium text-[#c5c9d3] transition-all hover:border-amber-500/50 hover:bg-[#1f222b] hover:text-white"
        >
          <span>New Chat</span>
          <Plus className="h-4 w-4 text-[#8c92a0]" />
        </button>

        {/* Conversations History List */}
        <div className="mt-5 flex-1 overflow-y-auto space-y-1.5 pr-0.5">
          {sessions.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#8c92a0]">
              No conversations yet.
            </div>
          ) : (
            sessions.map((session) => {
              const isActive = session.id === activeSessionId;
              const isEditing = session.id === editingId;

              return (
                <div
                  key={session.id}
                  onClick={() => {
                    onSelectSession(session.id);
                    onClose();
                  }}
                  className={`group relative flex items-center justify-between rounded-xl px-3 py-2.5 text-xs transition-all cursor-pointer ${
                    isActive
                      ? 'active-history-tab font-medium shadow-sm'
                      : 'text-[#9ea4b0] hover:bg-[#1a1c24] hover:text-[#e6e9f0]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    {isEditing ? (
                      <form onSubmit={(e) => handleSaveTitle(session.id, e)} className="flex-1">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onBlur={(e) => handleSaveTitle(session.id, e)}
                          autoFocus
                          className="w-full bg-[#0b0c10] px-1.5 py-0.5 rounded text-xs text-white border border-amber-500 focus:outline-none"
                        />
                      </form>
                    ) : (
                      <span className="truncate">{session.title}</span>
                    )}
                  </div>

                  {!isEditing && (
                    <div className="flex items-center space-x-1.5">
                      <MessageSquare className={`h-3.5 w-3.5 ${isActive ? 'text-amber-400' : 'text-[#5c6270] group-hover:text-[#8c92a0]'}`} />
                      <div className="hidden group-hover:flex items-center space-x-1">
                        <button
                          onClick={(e) => startEditing(session, e)}
                          className="rounded p-0.5 hover:text-amber-400 text-[#8c92a0]"
                          title="Rename"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteSession(session.id);
                          }}
                          className="rounded p-0.5 hover:text-rose-400 text-[#8c92a0]"
                          title="Delete"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* PWA Install App Button */}
        <button
          onClick={handleInstallPWA}
          className="mt-2 mb-2 w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-[#181b26] hover:bg-[#222736] border border-[#292e40] text-amber-400 text-xs font-semibold transition-all shadow-sm active:scale-95 cursor-pointer"
          title="Install Charan AI as native app on Mobile or Laptop"
        >
          <Smartphone className="w-3.5 h-3.5 text-amber-400" />
          <span>Install App (Mobile / Laptop)</span>
        </button>

        {/* User Account Footer */}
        <div className="pt-3 border-t border-[#1c1f28] mt-1 flex items-center justify-between">

          {user && !user.isAnonymous ? (
            <div className="flex items-center space-x-2 truncate">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} className="w-7 h-7 rounded-full border border-amber-500/30" />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/20 border border-amber-500/40 text-xs font-semibold text-amber-400">
                  {(user.displayName || user.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <div className="flex flex-col truncate">
                <span className="text-xs font-medium text-[#c5c9d3] truncate max-w-[110px]">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
                <span className="text-[10px] text-gray-500 truncate max-w-[110px]">
                  {user.email || 'Signed in'}
                </span>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center space-x-2 text-xs font-medium text-amber-400 hover:text-amber-300 transition-colors"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1e212b] border border-[#2b2f3d] text-xs font-semibold text-[#c5c9d3]">
                <UserIcon className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <span>Sign In / Sign Up</span>
            </button>
          )}

          <div className="flex items-center space-x-1">
            {user && !user.isAnonymous && (
              <button
                onClick={() => logout()}
                className="rounded p-1 text-[#5c6270] hover:text-rose-400 transition-colors"
                title="Sign Out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            )}

            {sessions.length > 1 && (
              <button
                onClick={onClearAllSessions}
                className="rounded p-1 text-[#5c6270] hover:text-rose-400 transition-colors"
                title="Clear history"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};
