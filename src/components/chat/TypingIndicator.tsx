'use client';

import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start space-x-3 my-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/20">
        <Bot className="h-5 w-5" />
      </div>
      <div className="flex items-center space-x-2 rounded-2xl border border-slate-700/50 bg-slate-800/80 px-4 py-3 text-slate-300 shadow-lg">
        <Sparkles className="h-4 w-4 animate-spin text-cyan-400" />
        <span className="text-sm font-medium text-slate-300">Charan AI is thinking...</span>
        <div className="flex space-x-1 pl-1">
          <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400 [animation-delay:-0.3s]" />
          <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400 [animation-delay:-0.15s]" />
          <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400" />
        </div>
      </div>
    </div>
  );
};
