'use client';

import React, { useState, useRef, KeyboardEvent } from 'react';
import { Plus, ArrowUp, Mic, Globe, StopCircle, FileText, X, Image as ImageIcon, Sparkles, Database } from 'lucide-react';
import { FileAttachment, ChatSettings } from '@/types/chat';

interface MessageInputProps {
  onSendMessage: (message: string, isWebSearchForced: boolean, attachments: FileAttachment[]) => void;
  isGenerating: boolean;
  onStopGeneration?: () => void;
  settings?: ChatSettings;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  isGenerating,
  onStopGeneration,
  settings,
}) => {
  const [input, setInput] = useState('');
  const [isWebSearchForced, setIsWebSearchForced] = useState(false);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const activeWs = settings?.activeWorkspace || 'general';

  const getWorkspacePlaceholder = () => {
    if (isListening) return "Listening... Speak your prompt...";
    switch (activeWs) {
      case 'visual':
        return "Describe an image to generate or design (e.g. Cyberpunk dark UI mockup)...";
      case 'rag':
        return "Upload or paste documents, PDFs, or CSV spreadsheets for RAG analysis...";
      case 'code':
        return "Describe code to write, debug, or architect (React 19, Next.js 15, Python, SQL)...";
      case 'general':
      default:
        return "Message Charan AI... (Study roadmaps, Fitness, Civics, Science)";
    }
  };


  const handleSend = () => {
    if ((!input.trim() && attachments.length === 0) || isGenerating) return;
    onSendMessage(input, isWebSearchForced, attachments);
    setInput('');
    setAttachments([]);
    setIsPlusMenuOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const attachment: FileAttachment = {
          id: Math.random().toString(36).substring(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          content: text || `[Attached File: ${file.name}]`,
        };
        setAttachments((prev) => [...prev, attachment]);
      };
      reader.readAsText(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsPlusMenuOpen(false);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleToggleVoice = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser. Please try Chrome or Edge.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInput(transcript);
        }
      };

      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
    } catch (err) {
      console.error('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 pb-6 pt-2">
      {/* Plus Menu Popover */}
      {isPlusMenuOpen && (
        <div
          className="absolute left-6 bottom-20 z-50 w-64 rounded-2xl bg-[#161822] border border-[#2c3242] shadow-2xl p-2.5 text-white animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-3 py-1 mb-1">
            Charan Studio Shortcuts
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-[#202535] hover:text-amber-400 transition-colors"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Upload Document / Code File</span>
          </button>
          <button
            onClick={() => {
              setInput('Generate an image of ');
              setIsPlusMenuOpen(false);
            }}
            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-[#202535] hover:text-amber-400 transition-colors"
          >
            <ImageIcon className="w-4 h-4 text-amber-400" />
            <span>Generate AI Visual Image</span>
          </button>
          <button
            onClick={() => {
              setInput('Help me analyze and summarize key data insights from: ');
              fileInputRef.current?.click();
            }}
            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-[#202535] hover:text-blue-400 transition-colors"
          >
            <Database className="w-4 h-4 text-blue-400" />
            <span>Analyze Dataset (Vector RAG)</span>
          </button>
          <button
            onClick={() => {
              setIsWebSearchForced(!isWebSearchForced);
              setIsPlusMenuOpen(false);
            }}
            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-[#202535] hover:text-emerald-400 transition-colors border-t border-[#232838] mt-1 pt-2"
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>{isWebSearchForced ? 'Disable Search Override' : 'Force Live Web Search'}</span>
          </button>
        </div>
      )}

      {/* Floating Pill Container (Matching Screenshot) */}
      <div className="floating-input-pill flex flex-col rounded-full p-2 pl-4 pr-2 shadow-2xl transition-all border border-slate-700/60 focus-within:border-amber-500/50">
        {/* File Attachments Bar */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-1.5 px-3 pt-1 pb-1.5 border-b border-slate-800/80">
            {attachments.map((file) => (
              <div
                key={file.id}
                className="flex items-center space-x-1.5 rounded-full border border-slate-700 bg-slate-800 px-2.5 py-0.5 text-xs text-slate-200"
              >
                <FileText className="h-3.5 w-3.5 text-amber-400" />
                <span className="truncate max-w-[150px] font-medium">{file.name}</span>
                <button
                  onClick={() => removeAttachment(file.id)}
                  className="rounded-full p-0.5 text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          {/* Left: Plus Attachment Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            multiple
            className="hidden"
          />
          <button
            onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all ${
              isPlusMenuOpen ? 'bg-amber-500 text-black rotate-45' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
            title="Attach file or select AI action"
          >
            <Plus className="h-5 w-5 transition-transform duration-200" />
          </button>

          {/* Center: Textarea Input */}
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={getWorkspacePlaceholder()}
            rows={1}
            className={`w-full resize-none bg-transparent px-3 py-1 text-sm sm:text-base text-slate-100 placeholder-slate-400 focus:outline-none max-h-32 min-h-[38px] leading-relaxed ${
              isListening ? 'placeholder-amber-400 font-medium' : ''
            }`}
          />

          {/* Right: Web Search Toggle, Mic & Glowing Send Button */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setIsWebSearchForced(!isWebSearchForced)}
              className={`flex items-center space-x-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-all ${
                isWebSearchForced
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                  : 'bg-slate-800/60 text-slate-400 border border-slate-700/50 hover:text-slate-200'
              }`}
              title="Toggle Web Search"
            >
              <Globe className={`h-3 w-3 ${isWebSearchForced ? 'text-amber-400' : ''}`} />
              <span className="hidden sm:inline font-mono uppercase">{isWebSearchForced ? 'Search On' : 'Search Auto'}</span>
            </button>

            <button
              onClick={handleToggleVoice}
              className={`hidden sm:flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                isListening
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50 animate-pulse'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title={isListening ? "Stop listening" : "Voice Input (Speech-to-Text)"}
            >
              <Mic className="h-4 w-4" />
            </button>

            {isGenerating ? (
              <button
                onClick={onStopGeneration}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-600 text-white shadow-lg transition-all hover:bg-rose-500 active:scale-95"
              >
                <StopCircle className="h-5 w-5" />
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={!input.trim() && attachments.length === 0}
                className="glowing-send-btn flex h-10 w-10 items-center justify-center rounded-full text-slate-950 font-bold shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                title="Send message"
              >
                <ArrowUp className="h-5 w-5 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

