export type MessageRole = 'user' | 'assistant' | 'system';

export type UserIntent =
  | 'greeting'
  | 'identity'
  | 'general'
  | 'coding'
  | 'educational'
  | 'research'
  | 'current_events'
  | 'ambiguous'
  | 'medical'
  | 'legal'
  | 'political'
  | 'casual'
  | 'safety_refusal';

export interface WebSource {
  id: string;
  title: string;
  url: string;
  snippet: string;
  domain: string;
  isTrusted: boolean;
  score?: number;
}

export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  content: string;
  previewUrl?: string;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  intent?: UserIntent;
  sources?: WebSource[];
  attachments?: FileAttachment[];
  isWebSearchUsed?: boolean;
  isError?: boolean;
  isStreaming?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
  systemPromptOverride?: string;
}

export type WorkspaceType = 'general' | 'visual' | 'rag' | 'code';

export interface ChatSettings {
  aiProvider: 'gemini' | 'openai' | 'deepseek' | 'fallback' | 'omni_rag';
  apiKey: string;
  modelName: string;
  webSearchMode: 'auto' | 'on' | 'off';
  theme: 'dark' | 'light' | 'system';
  streamResponse: boolean;
  temperature: number;
  userPreferredName?: string;
  accuracyLevel?: 'strict' | 'balanced' | 'creative';
  toneStyle?: 'professional' | 'friendly' | 'humanized' | 'concise';
  isPlagiarismFreeStrict?: boolean;
  activeWorkspace?: WorkspaceType;
}

