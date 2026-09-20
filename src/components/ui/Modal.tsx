import React, { useState } from 'react';
import { X, Cpu, Globe, Sliders, ShieldCheck, Zap, User, Sparkles, Target, Feather } from 'lucide-react';
import { ChatSettings } from '@/types/chat';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ChatSettings;
  onSaveSettings: (newSettings: ChatSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [formData, setFormData] = useState<ChatSettings>(settings);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl border border-[#2e3442] bg-[#16181f] p-6 shadow-2xl text-white relative my-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Glow accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500/0 via-amber-400 to-amber-500/0" />

        <div className="flex items-center justify-between border-b border-[#252a36] pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
              <Cpu className="h-4 h-4 text-amber-400" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">Charan AI Settings & Persona</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-[#20232b] hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5 text-sm">

          {/* User Preferred Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5 flex items-center space-x-1.5">
              <User className="h-3.5 w-3.5 text-amber-400" />
              <span>How should Charan AI address you?</span>
            </label>
            <input
              type="text"
              value={formData.userPreferredName || ''}
              onChange={(e) => setFormData({ ...formData, userPreferredName: e.target.value })}
              placeholder="Enter Name"
              className="w-full rounded-xl border border-[#2a2f3d] bg-[#0e1015] px-3.5 py-2.5 text-white placeholder-gray-400 focus:border-amber-400 focus:outline-none transition-all"
            />

          </div>

          {/* Behavior & Tone Style */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5 flex items-center space-x-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Behavior & Tone Style</span>
            </label>
            <select
              value={formData.toneStyle || 'professional'}
              onChange={(e) => setFormData({ ...formData, toneStyle: e.target.value as any })}
              className="w-full rounded-xl border border-[#2a2f3d] bg-[#0e1015] px-3.5 py-2.5 text-white focus:border-amber-400 focus:outline-none transition-all"
            >
              <option value="professional">💼 Professional & Academic (Executive, precise, formal)</option>
              <option value="friendly">😊 Friendly & Conversational (Warm, encouraging, approachable)</option>
              <option value="humanized">🧑‍💻 Humanized & Plagiarism-Free (Relatable, fluid human flow)</option>
              <option value="concise">🚀 Concise & Direct (Bullet-pointed, zero fluff)</option>
            </select>
          </div>

          {/* Response Accuracy & Factuality */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5 flex items-center space-x-1.5">
              <Target className="h-3.5 w-3.5 text-amber-400" />
              <span>Response Accuracy & Factuality Level</span>
            </label>
            <select
              value={formData.accuracyLevel || 'balanced'}
              onChange={(e) => setFormData({ ...formData, accuracyLevel: e.target.value as any })}
              className="w-full rounded-xl border border-[#2a2f3d] bg-[#0e1015] px-3.5 py-2.5 text-white focus:border-amber-400 focus:outline-none transition-all"
            >
              <option value="strict">🎯 Strict Factuality & Zero Hallucination (Strict data & citations)</option>
              <option value="balanced">⚖️ Balanced Accuracy & Context (Default analytical balance)</option>
              <option value="creative">💡 Creative & Exploratory (Brainstorming & imaginative scenarios)</option>
            </select>
          </div>

          {/* AI Model Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5 flex items-center space-x-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              <span>AI Engine Model</span>
            </label>
            <select
              value={formData.aiProvider}
              onChange={(e) =>
                setFormData({ ...formData, aiProvider: e.target.value as any })
              }
              className="w-full rounded-xl border border-[#2a2f3d] bg-[#0e1015] px-3.5 py-2.5 text-white focus:border-amber-400 focus:outline-none transition-all"
            >
              <option value="gemini">Google Gemini 2.5 Flash (Multimodal Studio)</option>
              <option value="openai">OpenAI GPT-4o (Deep Reasoning & Analysis)</option>
              <option value="deepseek">DeepSeek R1 Engine (Logic, Math & Code)</option>
              <option value="omni_rag">Charan Omni-Domain RAG (Roadmaps, Civics & Health)</option>
              <option value="fallback">Charan Fast Engine (Sub-2s Local Speed)</option>
            </select>
          </div>

          {/* Plagiarism-Free Guarantee Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#2a2f3d] bg-[#0e1015]">
            <div className="flex items-center space-x-2.5">
              <Feather className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-white">100% Plagiarism-Free Humanized Phrasing</div>
                <div className="text-[11px] text-gray-400">Generates unique, original human phrasing without canned AI clichés.</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={formData.isPlagiarismFreeStrict !== false}
              onChange={(e) => setFormData({ ...formData, isPlagiarismFreeStrict: e.target.checked })}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
          </div>

          {/* Web Search Mode */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5 flex items-center space-x-1.5">
              <Globe className="h-3.5 w-3.5 text-amber-400" />
              <span>Real-Time Web Search</span>
            </label>
            <select
              value={formData.webSearchMode}
              onChange={(e) =>
                setFormData({ ...formData, webSearchMode: e.target.value as any })
              }
              className="w-full rounded-xl border border-[#2a2f3d] bg-[#0e1015] px-3.5 py-2.5 text-white focus:border-amber-400 focus:outline-none transition-all"
            >
              <option value="auto">Auto (Intelligent search detection per query)</option>
              <option value="on">Always On (Search live web for every response)</option>
              <option value="off">Off (Fast internal reasoning)</option>
            </select>
          </div>

          {/* Temperature Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center space-x-1.5">
                <Sliders className="h-3.5 w-3.5 text-amber-400" />
                <span>Response Creativity ({formData.temperature})</span>
              </label>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={formData.temperature}
              onChange={(e) =>
                setFormData({ ...formData, temperature: parseFloat(e.target.value) })
              }
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div className="pt-4 border-t border-[#252a36] flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#2a2f3d] px-4 py-2 text-xs font-semibold text-gray-300 hover:bg-[#20232b] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 px-4 py-2 text-xs font-semibold text-black shadow-md transition-all active:scale-95"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
