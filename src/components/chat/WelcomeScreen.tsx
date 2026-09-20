'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Image as ImageIcon, FileText, Globe, Code2, ArrowUpRight, ShieldCheck, Database, Layers, BookOpen, Landmark, Dumbbell, Palette, Cpu, FileSpreadsheet } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/lib/auth/AuthContext';
import { ChatSettings } from '@/types/chat';

interface WelcomeScreenProps {
  onSelectPrompt: (promptText: string) => void;
  settings?: ChatSettings;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSelectPrompt, settings }) => {
  const { user } = useAuth();
  const [greetingText, setGreetingText] = useState<string>('Good day');

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 4 && hour < 12) {
        setGreetingText('Good morning');
      } else if (hour >= 12 && hour < 17) {
        setGreetingText('Good afternoon');
      } else {
        setGreetingText('Good evening');
      }
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  const activeWs = settings?.activeWorkspace || 'general';

  // Customize header title, subtitle, and cards based on active workspace
  const getWorkspaceConfig = () => {
    switch (activeWs) {
      case 'visual':
        return {
          titleSuffix: 'AI Visual Studio',
          subtitle: 'Create photorealistic AI art, UI/UX concept designs, vector logos, and 3D scenes on demand.',
          pills: [
            { icon: Palette, text: 'Photorealistic AI Art', color: 'text-amber-400' },
            { icon: ImageIcon, text: 'UI & App Mockups', color: 'text-amber-400' },
            { icon: Sparkles, text: 'Vector Logos & Badges', color: 'text-amber-400' },
            { icon: ShieldCheck, text: 'Instant Concept Render', color: 'text-emerald-400' },
          ],
          capabilities: [
            {
              icon: ImageIcon,
              tag: 'Cyberpunk Art',
              title: 'Generate Cyberpunk City Art',
              subtitle: 'Futuristic neon metropolis with rainy reflections & volumetric lighting in 8K resolution.',
              prompt: 'Generate an image of a futuristic cyberpunk city with glowing neon lights and rainy reflections',
              color: 'from-amber-500/15 via-amber-600/5 to-transparent',
              borderColor: 'group-hover:border-amber-500/60',
              badgeBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
            },
            {
              icon: Palette,
              tag: 'UI Mockup Design',
              title: 'Sleek Dark Mobile App UI',
              subtitle: 'Glassmorphism dashboard design with golden accents, smooth charts & dark mode layout.',
              prompt: 'Design a sleek dark mode mobile app UI mockup for a fitness tracker with glassmorphism cards',
              color: 'from-amber-500/15 via-amber-600/5 to-transparent',
              borderColor: 'group-hover:border-amber-500/60',
              badgeBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
            },
            {
              icon: Sparkles,
              tag: 'Logo & Branding',
              title: 'Minimalist Tech Logo',
              subtitle: 'Modern vector emblem logo for an AI startup with clean geometric iconography.',
              prompt: 'Create a modern minimalist vector logo design for an AI technology company with a clean gold icon',
              color: 'from-amber-500/15 via-amber-600/5 to-transparent',
              borderColor: 'group-hover:border-amber-500/60',
              badgeBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
            },
            {
              icon: Layers,
              tag: '3D Render',
              title: 'Futuristic 3D Workstation',
              subtitle: 'Cinematic isometric 3D render of a high-tech AI laboratory with glowing holographic displays.',
              prompt: 'Photorealistic 3D render of a futuristic AI developer workstation with glowing holographic screens',
              color: 'from-amber-500/15 via-amber-600/5 to-transparent',
              borderColor: 'group-hover:border-amber-500/60',
              badgeBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
            },
          ],
        };

      case 'rag':
        return {
          titleSuffix: 'Document & Data RAG',
          subtitle: 'Upload PDFs, Excel spreadsheets, or CSV data files for 100% accurate vector search & tabular analysis.',
          pills: [
            { icon: Database, text: 'Local Vector RAG Engine', color: 'text-blue-400' },
            { icon: FileText, text: 'PDF Executive Summaries', color: 'text-blue-400' },
            { icon: FileSpreadsheet, text: 'Excel & CSV Data Extraction', color: 'text-emerald-400' },
            { icon: ShieldCheck, text: 'Zero Data Leakage', color: 'text-purple-400' },
          ],
          capabilities: [
            {
              icon: FileText,
              tag: 'PDF Executive Summary',
              title: 'Summarize PDF Document',
              subtitle: 'Extract core findings, key takeaways, and action points into structured bullet lists.',
              prompt: 'Help me analyze and summarize key executive insights from an uploaded PDF document',
              color: 'from-blue-500/15 via-blue-600/5 to-transparent',
              borderColor: 'group-hover:border-blue-500/60',
              badgeBg: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
            },
            {
              icon: FileSpreadsheet,
              tag: 'Excel Data Analytics',
              title: 'Spreadsheet Formula Analysis',
              subtitle: 'Inspect financial data, VLOOKUP/INDEX-MATCH formulas & monthly growth trends.',
              prompt: 'Analyze spreadsheet formulas, revenue trends, and tabular data insights from an Excel spreadsheet',
              color: 'from-blue-500/15 via-blue-600/5 to-transparent',
              borderColor: 'group-hover:border-blue-500/60',
              badgeBg: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
            },
            {
              icon: Database,
              tag: 'Semantic Q&A',
              title: 'Vector Document Q&A',
              subtitle: 'Query complex technical papers or legal contracts with exact citations & paragraph references.',
              prompt: 'Answer specific factual questions across uploaded research papers with exact source citations',
              color: 'from-blue-500/15 via-blue-600/5 to-transparent',
              borderColor: 'group-hover:border-blue-500/60',
              badgeBg: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
            },
            {
              icon: Layers,
              tag: 'CSV Table Export',
              title: 'Format & Clean CSV Data',
              subtitle: 'Convert unstructured text or raw CSV files into formatted Markdown & downloadable tables.',
              prompt: 'Clean, format, and structure raw CSV data into a clean Markdown table with totals',
              color: 'from-blue-500/15 via-blue-600/5 to-transparent',
              borderColor: 'group-hover:border-blue-500/60',
              badgeBg: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
            },
          ],
        };

      case 'code':
        return {
          titleSuffix: 'Code & Architecture Lab',
          subtitle: 'Full-stack software engineering powered by DeepSeek R1 reasoning for algorithms, APIs & debugging.',
          pills: [
            { icon: Cpu, text: 'DeepSeek R1 Reasoning Engine', color: 'text-purple-400' },
            { icon: Code2, text: 'Next.js 15 & React 19', color: 'text-purple-400' },
            { icon: ShieldCheck, text: 'Algorithm Complexity (O(n))', color: 'text-emerald-400' },
            { icon: Layers, text: 'Full System Architecture', color: 'text-amber-400' },
          ],
          capabilities: [
            {
              icon: Code2,
              tag: 'Next.js 15 Full-Stack',
              title: 'Build React 19 Component',
              subtitle: 'Write modern, responsive React components with TypeScript, Tailwind CSS & state management.',
              prompt: 'Write a full production-ready Next.js 15 React component with TypeScript and Tailwind CSS',
              color: 'from-purple-500/15 via-purple-600/5 to-transparent',
              borderColor: 'group-hover:border-purple-500/60',
              badgeBg: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
            },
            {
              icon: Cpu,
              tag: 'Algorithm Optimization',
              title: 'Optimize Time Complexity',
              subtitle: 'Solve complex algorithmic problems with O(n log n) efficiency, step-by-step logic & unit tests.',
              prompt: 'Write an optimized Python program to check prime numbers with O(sqrt(n)) time complexity and tests',
              color: 'from-purple-500/15 via-purple-600/5 to-transparent',
              borderColor: 'group-hover:border-purple-500/60',
              badgeBg: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
            },
            {
              icon: Layers,
              tag: 'System Architecture',
              title: 'Microservices & DB Schema',
              subtitle: 'Design scalable PostgreSQL schemas, REST/GraphQL API endpoints, and system architecture.',
              prompt: 'Design a scalable database schema and microservices architecture for a high-traffic e-commerce platform',
              color: 'from-purple-500/15 via-purple-600/5 to-transparent',
              borderColor: 'group-hover:border-purple-500/60',
              badgeBg: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
            },
            {
              icon: ShieldCheck,
              tag: 'Debug & Refactor',
              title: 'Fix Memory Leaks & Errors',
              subtitle: 'Diagnose async race conditions, TypeScript errors, and memory leaks with exact line fixes.',
              prompt: 'Help me debug and fix an asynchronous race condition and memory leak in JavaScript/TypeScript',
              color: 'from-purple-500/15 via-purple-600/5 to-transparent',
              borderColor: 'group-hover:border-purple-500/60',
              badgeBg: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
            },
          ],
        };

      case 'general':
      default:
        return {
          titleSuffix: 'General Intelligence Workspace',
          subtitle: 'An all-domain AI workspace for study roadmaps, political civics, fitness & health, and general knowledge.',
          pills: [
            { icon: BookOpen, text: 'Study & Exam Roadmaps', color: 'text-amber-400' },
            { icon: Landmark, text: 'Political Science & Civics', color: 'text-blue-400' },
            { icon: Dumbbell, text: 'Fitness & Nutrition Splits', color: 'text-emerald-400' },
            { icon: Globe, text: 'Live Web Intelligence', color: 'text-purple-400' },
          ],
          capabilities: [
            {
              icon: BookOpen,
              tag: 'Study Roadmap',
              title: 'Structured Exam Study Plan',
              subtitle: 'Create step-by-step learning schedules, syllabus breakdowns, active recall & exam prep strategies.',
              prompt: 'Create a comprehensive 4-week study roadmap and daily schedule to master computer science fundamentals',
              color: 'from-amber-500/15 via-amber-600/5 to-transparent',
              borderColor: 'group-hover:border-amber-500/60',
              badgeBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
            },
            {
              icon: Landmark,
              tag: 'Political Info',
              title: 'Civics & Governance Overview',
              subtitle: 'Objective, neutral explanations of constitutional law, political systems, government & geopolitics.',
              prompt: 'Explain the system of checks and balances in democratic governance with neutral objective analysis',
              color: 'from-blue-500/15 via-blue-600/5 to-transparent',
              borderColor: 'group-hover:border-blue-500/60',
              badgeBg: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
            },
            {
              icon: Dumbbell,
              tag: 'Fitness & Health',
              title: 'Workout & Macro Plan',
              subtitle: 'Customized Push/Pull/Legs resistance splits, energy system conditioning, and macro nutrition targets.',
              prompt: 'Design a 5-day Push/Pull/Legs workout split and daily macro nutrition targets for muscle hypertrophy',
              color: 'from-emerald-500/15 via-emerald-600/5 to-transparent',
              borderColor: 'group-hover:border-emerald-500/60',
              badgeBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
            },
            {
              icon: Globe,
              tag: 'General Knowledge',
              title: 'Science & World History',
              subtitle: 'Deep dive into physics, astronomy, economics, world history, and current global events.',
              prompt: 'Explain the principles of quantum entanglement and its applications in modern quantum computing',
              color: 'from-purple-500/15 via-purple-600/5 to-transparent',
              borderColor: 'group-hover:border-purple-500/60',
              badgeBg: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
            },
          ],
        };
    }
  };

  const wsConfig = getWorkspaceConfig();

  return (
    <div className="w-full flex flex-col items-center justify-center py-4 text-center max-w-7xl mx-auto my-auto animate-fadeIn">
      {/* Studio Distinct Logo */}
      <div className="mb-4">
        <Logo size="lg" showText={false} />
      </div>

      {/* Greeting Title */}
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2 font-sans">
        {greetingText}
        {user && !user.isAnonymous && (user.displayName || user.email?.split('@')[0])
          ? `, ${user.displayName || user.email?.split('@')[0]}`
          : ''}
        , <span className="text-amber-400 font-serif italic">Charan AI</span> {wsConfig.titleSuffix}
      </h1>

      {/* Subtitle */}
      <p className="max-w-xl text-xs sm:text-sm text-gray-400 leading-relaxed mb-6">
        {wsConfig.subtitle}
      </p>

      {/* Studio Feature Pills Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {wsConfig.pills.map((pill, idx) => {
          const PillIcon = pill.icon;
          return (
            <span
              key={idx}
              className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#181b26] border border-[#272c3d] text-[11px] font-medium shadow-sm"
            >
              <PillIcon className={`w-3.5 h-3.5 ${pill.color}`} />
              <span className="text-gray-200">{pill.text}</span>
            </span>
          );
        })}
      </div>

      {/* Multimodal Studio Capability Hub */}
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 text-left">
        {wsConfig.capabilities.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => onSelectPrompt(item.prompt)}
              className={`group relative flex flex-col justify-between rounded-2xl border border-[#262b3a] bg-gradient-to-br ${item.color} p-4 sm:p-5 transition-all duration-300 ${item.borderColor} hover:-translate-y-1 shadow-lg hover:shadow-2xl overflow-hidden`}
            >
              {/* Top Row: Category Badge & Arrow */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${item.badgeBg}`}>
                    <Icon className="w-3 h-3 mr-1" />
                    <span>{item.tag}</span>
                  </span>
                  <div className="w-7 h-7 rounded-xl bg-[#1c202d] border border-[#2e3547] flex items-center justify-center group-hover:bg-amber-500 group-hover:text-black transition-colors">
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>

                {/* Card Title & Description */}
                <h3 className="font-bold text-white text-sm sm:text-base mb-1.5 group-hover:text-amber-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {item.subtitle}
                </p>
              </div>

              {/* Action Hint */}
              <div className="mt-4 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-500 group-hover:text-amber-400/90 transition-colors">
                <span>Launch Mode →</span>
                <span className="font-mono text-[10px] opacity-70">Charan AI</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
