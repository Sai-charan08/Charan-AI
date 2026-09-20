'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ChatSession,
  ChatSettings,
  Message,
  FileAttachment,
} from '@/types/chat';
import {
  loadSavedSessions,
  saveSessions,
  loadSavedSettings,
  saveSettings,
  createNewSession,
  DEFAULT_SETTINGS,
  syncUserToMongoDB,
  fetchSessionsFromMongoDB,
  deleteSessionFromMongoDB,
} from '@/lib/storage/chatHistoryStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { MessageInput } from '@/components/chat/MessageInput';
import { SettingsModal } from '@/components/ui/Modal';
import { useAuth } from '@/lib/auth/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [settings, setSettings] = useState<ChatSettings>(DEFAULT_SETTINGS);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize and reload sessions whenever user changes
  useEffect(() => {
    const loadedSettings = loadSavedSettings();
    setSettings(loadedSettings);

    const localSessions = loadSavedSessions(user?.uid);
    if (localSessions.length > 0) {
      setSessions(localSessions);
      setActiveSessionId(localSessions[0].id);
    } else {
      const initial = createNewSession('Project Gemini Sync');
      setSessions([initial]);
      setActiveSessionId(initial.id);
      saveSessions([initial], user?.uid);
    }

    // Sync user login data & fetch sessions from MongoDB cloud if logged in
    if (user && !user.isAnonymous) {
      syncUserToMongoDB(user, loadedSettings);

      fetchSessionsFromMongoDB(user.uid).then((mongoSessions) => {
        if (mongoSessions && mongoSessions.length > 0) {
          setSessions(mongoSessions);
          setActiveSessionId(mongoSessions[0].id);
          saveSessions(mongoSessions, user.uid);
        }
      });
    }
  }, [user?.uid]);

  // Save sessions to localStorage & MongoDB under user.uid when updated
  useEffect(() => {
    if (sessions.length > 0) {
      saveSessions(sessions, user?.uid);
    }
  }, [sessions, user?.uid]);

  // Enforce dark mode studio theme on documentElement
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    root.classList.remove('light-mode');
    root.classList.add('dark');
  }, []);

  const handleUpdateSettings = (newSettings: Partial<ChatSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveSettings(updated);
    if (user && !user.isAnonymous) {
      syncUserToMongoDB(user, updated);
    }
  };

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const messages = activeSession ? activeSession.messages : [];

  const handleNewChat = () => {
    const newSession = createNewSession('New Conversation');
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
  };

  const handleDeleteSession = (id: string) => {
    const updated = sessions.filter((s) => s.id !== id);
    if (user?.uid) {
      deleteSessionFromMongoDB(user.uid, id);
    }

    if (updated.length === 0) {
      const fresh = createNewSession('New Conversation');
      setSessions([fresh]);
      setActiveSessionId(fresh.id);
    } else {
      setSessions(updated);
      if (activeSessionId === id) {
        setActiveSessionId(updated[0].id);
      }
    }
  };

  const handleRenameSession = (id: string, newTitle: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: newTitle, updatedAt: Date.now() } : s))
    );
  };

  const handleClearAllSessions = () => {
    if (user?.uid) {
      deleteSessionFromMongoDB(user.uid);
    }
    const fresh = createNewSession('New Conversation');
    setSessions([fresh]);
    setActiveSessionId(fresh.id);
  };


  const handleSendMessage = async (
    userText: string,
    isWebSearchForced: boolean,
    attachments: FileAttachment[]
  ) => {
    if (!activeSession || isGenerating) return;

    // 1. Optimistic User Message Creation (0ms delay)
    const userMessageId = Math.random().toString(36).substring(2, 9);
    const userMessage: Message = {
      id: userMessageId,
      role: 'user',
      content: userText,
      timestamp: Date.now(),
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    const assistantMessageId = Math.random().toString(36).substring(2, 9);
    const assistantPlaceholder: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
    };

    const isFirstUserMsg = activeSession.messages.length === 0;
    const sessionTitle = isFirstUserMsg
      ? userText.slice(0, 28) + (userText.length > 28 ? '...' : '')
      : activeSession.title;

    const updatedUserMessages = [...activeSession.messages, userMessage];

    // Instantly show user message + assistant streaming placeholder in UI
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSession.id
          ? {
              ...s,
              title: sessionTitle,
              messages: [...updatedUserMessages, assistantPlaceholder],
              updatedAt: Date.now(),
            }
          : s
      )
    );

    setIsGenerating(true);
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          messages: updatedUserMessages,
          settings,
          searchOverride: isWebSearchForced ? true : undefined,
          attachments,
          stream: true,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to initiate real-time streaming response');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamedContent = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.replace(/^data: /, '').trim();
            if (dataStr === '[DONE]') break;

            try {
              const payload = JSON.parse(dataStr);

              if (payload.type === 'metadata') {
                setSessions((prev) =>
                  prev.map((s) =>
                    s.id === activeSession.id
                      ? {
                          ...s,
                          messages: s.messages.map((m) =>
                            m.id === assistantMessageId
                              ? {
                                  ...m,
                                  intent: payload.intent,
                                  sources: payload.sources,
                                  isWebSearchUsed: payload.isWebSearchUsed,
                                }
                              : m
                          ),
                        }
                      : s
                  )
                );
              } else if (payload.type === 'text') {
                streamedContent += payload.content;

                setSessions((prev) =>
                  prev.map((s) =>
                    s.id === activeSession.id
                      ? {
                          ...s,
                          messages: s.messages.map((m) =>
                            m.id === assistantMessageId
                              ? { ...m, content: streamedContent }
                              : m
                          ),
                        }
                      : s
                  )
                );
              }
            } catch (e) {
              // Ignore partial JSON parse
            }
          }
        }
      }

      // Mark streaming as completed
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSession.id
            ? {
                ...s,
                messages: s.messages.map((m) =>
                  m.id === assistantMessageId ? { ...m, isStreaming: false } : m
                ),
              }
            : s
        )
      );
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Stream generation stopped by user');
      } else {
        console.error('Streaming chat error:', err);
        setSessions((prev) =>
          prev.map((s) =>
            s.id === activeSession.id
              ? {
                  ...s,
                  messages: s.messages.map((m) =>
                    m.id === assistantMessageId
                      ? {
                          ...m,
                          content: m.content || "I couldn't complete that request because the service is temporarily unavailable. Please try again.",
                          isError: true,
                          isStreaming: false,
                        }
                      : m
                  ),
                }
              : s
          )
        );
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsGenerating(false);
    }
  };

  const handleRegenerateLast = () => {
    if (!activeSession || activeSession.messages.length < 2) return;
    const lastUserMsgIndex = activeSession.messages.map((m) => m.role).lastIndexOf('user');
    if (lastUserMsgIndex === -1) return;

    const trimmedMessages = activeSession.messages.slice(0, lastUserMsgIndex);
    const lastUserMsg = activeSession.messages[lastUserMsgIndex];

    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSession.id ? { ...s, messages: trimmedMessages } : s
      )
    );

    handleSendMessage(lastUserMsg.content, false, lastUserMsg.attachments || []);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#07090e] p-0 sm:p-4 selection:bg-amber-500 selection:text-slate-950">
      {/* Glowing Outer App Container Frame */}
      <div className="glowing-app-frame relative flex h-full w-full max-w-[1550px] sm:h-[calc(100vh-2rem)] sm:rounded-2xl overflow-hidden bg-[#11141b] text-slate-100">
        {/* Sidebar Drawer */}
        <Sidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={handleSelectSession}
          onNewChat={handleNewChat}
          onDeleteSession={handleDeleteSession}
          onRenameSession={handleRenameSession}
          onClearAllSessions={handleClearAllSessions}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
        />


        {/* Floating Middle-Left Sidebar Toggle Handle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-40 flex h-12 w-5 items-center justify-center rounded-r-xl border border-l-0 border-amber-500/40 bg-[#141620]/90 text-amber-400 backdrop-blur-md shadow-2xl hover:w-6 hover:bg-amber-500 hover:text-black transition-all cursor-pointer`}
          title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {isSidebarOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4 stroke-[2.5]" />
          )}
        </button>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col h-full overflow-hidden relative bg-[#20232b]">
          <Header
            onNewChat={handleNewChat}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isSidebarOpen={isSidebarOpen}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
          />

          <main className="flex-1 min-h-0 overflow-hidden relative flex flex-col justify-between">
            <ChatContainer
              messages={messages}
              isGenerating={isGenerating}
              onSelectPrompt={(prompt) => handleSendMessage(prompt, false, [])}
              onRegenerateLast={handleRegenerateLast}
              settings={settings}
            />

            <MessageInput
              onSendMessage={handleSendMessage}
              isGenerating={isGenerating}
              onStopGeneration={handleStopGeneration}
              settings={settings}
            />

          </main>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={(newSet) => handleUpdateSettings(newSet)}
      />
    </div>
  );
}
