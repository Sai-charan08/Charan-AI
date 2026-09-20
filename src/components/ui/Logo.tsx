'use client';

import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const containerDimensions =
    size === 'sm' ? 'w-7 h-7 rounded-xl' : size === 'lg' ? 'w-12 h-12 rounded-2xl' : 'w-9 h-9 rounded-xl';
  
  const textSize =
    size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-base';

  const cFontSize =
    size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg';

  return (
    <div className={`flex items-center space-x-2.5 select-none ${className}`}>
      {/* Golden Container with stylized "C" inside */}
      <div className={`relative flex items-center justify-center ${containerDimensions} bg-gradient-to-br from-[#251f12] via-[#1a160d] to-[#0e0c08] border border-amber-500/50 shadow-[0_0_18px_rgba(245,158,11,0.3)] group cursor-pointer transition-all duration-300 hover:border-amber-400 hover:shadow-[0_0_24px_rgba(245,158,11,0.5)]`}>
        {/* Glow backdrop behind letter C */}
        <div className="absolute inset-0 rounded-xl bg-amber-500/10 blur-sm group-hover:bg-amber-500/20 transition-all" />

        {/* Stylized SVG Capital "C" */}
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-3/5 h-3/5 text-amber-400 transform group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] relative z-10"
        >
          <path
            d="M23 10.5C21.2 8.3 18.5 7 15.5 7C10.8 7 7 10.8 7 15.5C7 20.2 10.8 24 15.5 24C18.5 24 21.2 22.7 23 20.5"
            stroke="url(#charanCGlow)"
            strokeWidth="3.8"
            strokeLinecap="round"
          />
          {/* Subtle Sparkle dot on C */}
          <circle cx="23" cy="9" r="1.5" fill="#ffffff" />
          <defs>
            <linearGradient id="charanCGlow" x1="7" y1="7" x2="23" y2="24" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fbbf24" />
              <stop offset="1" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold tracking-tight text-white ${textSize}`}>
            Charan <span className="text-amber-400 font-serif italic">AI</span>
          </span>
        </div>
      )}
    </div>
  );
};
