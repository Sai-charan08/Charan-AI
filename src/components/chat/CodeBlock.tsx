'use client';

import React, { useState } from 'react';
import { Check, Copy, Code2 } from 'lucide-react';

interface CodeBlockProps {
  language: string;
  value: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language, value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="relative my-4 overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900/90 shadow-xl font-mono text-sm">
      {/* Header bar */}
      <div className="flex items-center justify-between bg-slate-800/80 px-4 py-2 border-b border-slate-700/50 text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <Code2 className="h-3.5 w-3.5 text-cyan-400" />
          <span className="font-semibold uppercase tracking-wider text-cyan-300">
            {language || 'text'}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1.5 rounded-md bg-slate-700/50 px-2.5 py-1 text-xs text-slate-300 transition-all hover:bg-slate-700 hover:text-white active:scale-95"
          title="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>

      {/* Code Area */}
      <div className="overflow-x-auto p-4 text-slate-200 leading-relaxed">
        <pre className="m-0 font-mono text-sm leading-relaxed whitespace-pre">
          <code>{value}</code>
        </pre>
      </div>
    </div>
  );
};
