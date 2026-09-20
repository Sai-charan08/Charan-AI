'use client';

import React, { useState } from 'react';
import { Download, Sparkles, Maximize2, X, RefreshCw } from 'lucide-react';
import { generateAIImageUrl } from '@/lib/ai/imageGenerator';

interface AIImageCardProps {
  prompt: string;
  initialSeed?: number;
  overrideUrl?: string;
}

export const AIImageCard: React.FC<AIImageCardProps> = ({ prompt, initialSeed, overrideUrl }) => {
  const [seed, setSeed] = useState<number>(initialSeed || Math.floor(Math.random() * 1000000));
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const imageUrl = overrideUrl || generateAIImageUrl(prompt, seed);

  const handleRegenerate = () => {
    setIsLoading(true);
    setSeed(Math.floor(Math.random() * 1000000));
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `charan_ai_art_${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      window.open(imageUrl, '_blank');
    }
  };

  return (
    <>
      <div className="my-3 overflow-hidden rounded-2xl border border-amber-500/40 bg-[#12151e] shadow-xl max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#171a26] border-b border-[#242938]">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-xs font-semibold text-amber-300">Charan AI Image Generator</span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={handleRegenerate}
              className="p-1 rounded-lg text-gray-400 hover:text-amber-400 hover:bg-[#202535] transition-colors"
              title="Generate new variation"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-1 rounded-lg text-gray-400 hover:text-amber-400 hover:bg-[#202535] transition-colors"
              title="Fullscreen"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Image Container */}
        <div className="relative aspect-square w-full bg-[#0d0f17] flex items-center justify-center overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0d0f17] z-10">
              <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-2" />
              <span className="text-xs text-amber-400 font-medium">Generating AI Visual...</span>
            </div>
          )}
          <img
            src={imageUrl}
            alt={prompt}
            onLoad={() => setIsLoading(false)}
            className={`w-full h-full object-cover transition-opacity duration-500 cursor-pointer ${
              isLoading ? 'opacity-0' : 'opacity-100 hover:scale-105 transition-transform'
            }`}
            onClick={() => setIsModalOpen(true)}
          />
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#151824] flex items-center justify-between gap-2 border-t border-[#232838]">
          <span className="text-[11px] text-gray-300 truncate max-w-[240px]" title={prompt}>
            "{prompt}"
          </span>
          <button
            onClick={handleDownload}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold transition-all shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Fullscreen Zoom Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full bg-[#20232b]"
          >
            <X className="w-6 h-6" />
          </button>
          <img src={imageUrl} alt={prompt} className="max-w-full max-h-[90vh] rounded-xl object-contain shadow-2xl" />
        </div>
      )}
    </>
  );
};
