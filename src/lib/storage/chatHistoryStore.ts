import { ChatSession, ChatSettings, Message } from '@/types/chat';

const LEGACY_STORAGE_KEY = 'charan_chat_sessions_v1';
const SETTINGS_STORAGE_KEY = 'charan_chat_settings_v1';

export const DEFAULT_SETTINGS: ChatSettings = {
  aiProvider: 'gemini',
  apiKey: '',
  modelName: 'gemini-2.5-flash',
  webSearchMode: 'auto',
  theme: 'dark',
  streamResponse: true,
  temperature: 0.7,
  userPreferredName: '',
  accuracyLevel: 'balanced',
  toneStyle: 'professional',
  isPlagiarismFreeStrict: true,
  activeWorkspace: 'general',
};

function getStorageKey(userId?: string | null): string {
  if (userId) {
    return `charan_chat_sessions_user_${userId}`;
  }
  return 'charan_chat_sessions_guest';
}

export function loadSavedSessions(userId?: string | null): ChatSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const targetKey = getStorageKey(userId);
    let raw = localStorage.getItem(targetKey);

    // Migration fallback from legacy key
    if (!raw) {
      const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyRaw) {
        localStorage.setItem(targetKey, legacyRaw);
        raw = legacyRaw;
      }
    }

    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load chat sessions:', e);
    return [];
  }
}

export function saveSessions(sessions: ChatSession[], userId?: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    const targetKey = getStorageKey(userId);
    localStorage.setItem(targetKey, JSON.stringify(sessions));

    // Also trigger async sync to MongoDB if user is logged in
    if (userId) {
      saveSessionsToMongoDB(sessions, userId).catch(() => {});
    }
  } catch (e) {
    console.error('Failed to save chat sessions:', e);
  }
}

export function loadSavedSettings(): ChatSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: ChatSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save chat settings:', e);
  }
}

export function createNewSession(initialTitle?: string): ChatSession {
  const newSession: ChatSession = {
    id: 'session_' + Math.random().toString(36).substring(2, 9),
    title: initialTitle || 'New Conversation',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messages: [],
  };
  return newSession;
}

// --- MONGODB CLOUD SYNC HELPERS ---

export async function syncUserToMongoDB(user: any, settings?: ChatSettings): Promise<void> {
  if (!user || !user.uid) return;
  try {
    await fetch('/api/user/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        settings: settings || DEFAULT_SETTINGS,
      }),
    });
  } catch (err) {
    console.warn('MongoDB User Sync Error:', err);
  }
}

export async function fetchSessionsFromMongoDB(userId: string): Promise<ChatSession[]> {
  if (!userId) return [];
  try {
    const res = await fetch(`/api/sessions?userId=${encodeURIComponent(userId)}`);
    if (!res.ok) return [];
    const data = await res.json();
    if (data.success && Array.isArray(data.sessions)) {
      return data.sessions;
    }
    return [];
  } catch (err) {
    console.warn('MongoDB Fetch Sessions Error:', err);
    return [];
  }
}

export async function saveSessionsToMongoDB(sessions: ChatSession[], userId: string): Promise<void> {
  if (!userId || !sessions) return;
  try {
    await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, sessions }),
    });
  } catch (err) {
    console.warn('MongoDB Save Sessions Error:', err);
  }
}

export async function deleteSessionFromMongoDB(userId: string, sessionId?: string): Promise<void> {
  if (!userId) return;
  try {
    const url = sessionId
      ? `/api/sessions?userId=${encodeURIComponent(userId)}&sessionId=${encodeURIComponent(sessionId)}`
      : `/api/sessions?userId=${encodeURIComponent(userId)}`;
    await fetch(url, { method: 'DELETE' });
  } catch (err) {
    console.warn('MongoDB Delete Session Error:', err);
  }
}
