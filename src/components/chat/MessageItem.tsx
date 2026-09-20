'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, Volume2, RotateCcw, FileText, Globe, ThumbsUp, ThumbsDown, FileDown, Table } from 'lucide-react';
import { Message } from '@/types/chat';
import { CodeBlock } from './CodeBlock';
import { SourceCitations } from './SourceCitations';
import { AIImageCard } from './AIImageCard';
import { isImageGenerationQuery } from '@/lib/ai/imageGenerator';
import { downloadAsPDF, downloadAsCSV, downloadAsJSON, downloadAsTXT } from '@/lib/export/exportUtils';

import { useAuth } from '@/lib/auth/AuthContext';

interface MessageItemProps {
  message: Message;
  onRegenerate?: () => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message, onRegenerate }) => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  const isAssistant = message.role === 'assistant';
  const showImageCard = isAssistant && isImageGenerationQuery(message.content);

  const userDisplayName = user && !user.isAnonymous ? (user.displayName || user.email?.split('@')[0] || 'You') : 'You';
  const authorLabel = isAssistant ? 'Charan AI' : userDisplayName;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleSpeak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(message.content);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleExportPDF = () => {
    downloadAsPDF('Charan AI Report', message.content);
  };

  const handleExportCSV = () => {
    downloadAsCSV('charan_ai_data', message.content);
  };

  const handleExportJSON = () => {
    downloadAsJSON('charan_ai_data', message.content);
  };

  const handleExportTXT = () => {
    downloadAsTXT('charan_ai_export', message.content);
  };


  return (
    <div className={`group flex w-full space-x-3 my-5 ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      {/* Assistant Avatar */}
      {isAssistant && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold text-xs shadow-sm">
          A
        </div>
      )}

      {/* Message Content Area */}
      <div className={`flex flex-col max-w-[90%] sm:max-w-[85%] ${isAssistant ? 'items-start' : 'items-end'}`}>
        {/* Author Header */}
        <div className="flex items-center space-x-2 pb-1.5 text-xs text-slate-400">
          <span className="font-semibold text-slate-300">
            {authorLabel}
          </span>
          {message.isWebSearchUsed && (
            <span className="flex items-center space-x-1 rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] text-amber-400 border border-amber-500/30 font-medium">
              <Globe className="h-3 w-3" />
              <span>Sources Verified</span>
            </span>
          )}
        </div>

        {/* User File Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {message.attachments.map((file) => (
              <div
                key={file.id}
                className="flex items-center space-x-1.5 rounded-lg border border-slate-700 bg-[#1c2230] px-2.5 py-1 text-xs text-slate-200"
              >
                <FileText className="h-3.5 w-3.5 text-amber-400" />
                <span className="truncate max-w-[150px] font-medium">{file.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={`rounded-2xl px-5 py-4 shadow-lg ${
            isAssistant
              ? 'border border-slate-800/90 bg-[#181d28]/90 text-slate-200 backdrop-blur-md'
              : 'border border-slate-700/60 bg-[#1f2634] text-slate-100'
          }`}
        >
          {isAssistant ? (
            <div className="prose max-w-none text-slate-200 text-sm leading-relaxed">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <CodeBlock
                        language={match[1]}
                        value={String(children).replace(/\n$/, '')}
                      />
                    ) : (
                      <code className="rounded bg-[#141822] px-1.5 py-0.5 font-mono text-xs font-semibold text-amber-400 border border-slate-700/50" {...props}>
                        {children}
                      </code>
                    );
                  },
                  img({ src, alt }: any) {
                    return <AIImageCard prompt={alt || 'AI Artwork'} overrideUrl={src} />;
                  },
                }}
              >
                {message.content || ''}
              </ReactMarkdown>

              {/* AI Image Generation Output Card */}
              {showImageCard && <AIImageCard prompt={message.content} />}

              {message.isStreaming && (
                <span className="inline-block h-4 w-2 ml-1 bg-amber-400 animate-pulse rounded-sm align-middle"></span>
              )}
            </div>
          ) : (
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
          )}

          {/* Web Source Citations */}
          {isAssistant && message.sources && message.sources.length > 0 && (
            <SourceCitations sources={message.sources} />
          )}
        </div>

        {/* Assistant Action Bar */}
        {isAssistant && !message.isStreaming && (
          <div className="flex items-center space-x-1.5 mt-2 opacity-0 transition-opacity group-hover:opacity-100 flex-wrap gap-y-1">
            <button
              onClick={handleCopy}
              className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              title="Copy message"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            </button>

            <button
              onClick={handleSpeak}
              className={`rounded p-1 transition-colors ${
                isSpeaking ? 'text-amber-400 bg-amber-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
              title="Read aloud"
            >
              <Volume2 className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={handleExportPDF}
              className="flex items-center space-x-1 rounded px-1.5 py-0.5 text-[11px] text-slate-400 hover:bg-slate-800 hover:text-amber-400 transition-colors border border-slate-800"
              title="Export response as PDF document"
            >
              <FileDown className="h-3.5 w-3.5" />
              <span>PDF</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center space-x-1 rounded px-1.5 py-0.5 text-[11px] text-slate-400 hover:bg-slate-800 hover:text-emerald-400 transition-colors border border-slate-800"
              title="Export response or tables as Excel/CSV"
            >
              <Table className="h-3.5 w-3.5" />
              <span>Excel</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="flex items-center space-x-1 rounded px-1.5 py-0.5 text-[11px] text-slate-400 hover:bg-slate-800 hover:text-blue-400 transition-colors border border-slate-800"
              title="Export response as JSON file"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>JSON</span>
            </button>

            <button
              onClick={handleExportTXT}
              className="flex items-center space-x-1 rounded px-1.5 py-0.5 text-[11px] text-slate-400 hover:bg-slate-800 hover:text-purple-400 transition-colors border border-slate-800"
              title="Export response as TXT file"
            >
              <FileDown className="h-3.5 w-3.5" />
              <span>TXT</span>
            </button>


            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                title="Regenerate response"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            )}

            <div className="h-3 w-px bg-slate-800 mx-1"></div>

            <button
              onClick={() => setFeedback(feedback === 'up' ? null : 'up')}
              className={`rounded p-1 transition-colors ${
                feedback === 'up' ? 'text-emerald-400 bg-emerald-950/40' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
              title="Good response"
            >
              <ThumbsUp className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
              className={`rounded p-1 transition-colors ${
                feedback === 'down' ? 'text-rose-400 bg-rose-950/40' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
              title="Bad response"
            >
              <ThumbsDown className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
