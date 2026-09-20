'use client';

import React from 'react';
import { ExternalLink, Globe, ShieldCheck } from 'lucide-react';
import { WebSource } from '@/types/chat';

interface SourceCitationsProps {
  sources: WebSource[];
}

export const SourceCitations: React.FC<SourceCitationsProps> = ({ sources }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-4 rounded-xl border border-cyan-500/20 bg-cyan-950/10 p-4 backdrop-blur-sm">
      <div className="flex items-center space-x-2 pb-3 border-b border-cyan-500/20 text-xs font-semibold uppercase tracking-wider text-cyan-400">
        <Globe className="h-4 w-4" />
        <span>Web References & Sources ({sources.length})</span>
      </div>
      <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
        {sources.map((source) => (
          <a
            key={source.id}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col justify-between rounded-lg border border-slate-700/50 bg-slate-900/60 p-3 transition-all hover:border-cyan-500/50 hover:bg-slate-800/80 hover:shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="flex items-center space-x-1 font-mono text-cyan-400 font-medium">
                  {source.isTrusted && <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 inline" />}
                  <span>{source.domain}</span>
                </span>
                <ExternalLink className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100 text-cyan-400" />
              </div>
              <h4 className="text-sm font-medium text-slate-200 line-clamp-1 group-hover:text-cyan-300">
                {source.title}
              </h4>
              {source.snippet && (
                <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {source.snippet}
                </p>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
