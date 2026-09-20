'use client';

import React, { useRef, useEffect } from 'react';
import { Message, ChatSettings } from '@/types/chat';
import { MessageItem } from './MessageItem';
import { TypingIndicator } from './TypingIndicator';
import { WelcomeScreen } from './WelcomeScreen';

interface ChatContainerProps {
  messages: Message[];
  isGenerating: boolean;
  onSelectPrompt: (prompt: string) => void;
  onRegenerateLast?: () => void;
  settings?: ChatSettings;
  onOpenInstallApp?: () => void;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  isGenerating,
  onSelectPrompt,
  onRegenerateLast,
  settings,
  onOpenInstallApp,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, isGenerating]);

  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-8 lg:px-10 py-4 pb-28 w-full max-w-7xl mx-auto custom-scrollbar">
      {messages.length === 0 ? (
        <WelcomeScreen onSelectPrompt={onSelectPrompt} settings={settings} onOpenInstallApp={onOpenInstallApp} />
      ) : (

        <>
          {messages.map((msg, index) => (
            <MessageItem
              key={msg.id}
              message={msg}
              onRegenerate={
                index === messages.length - 1 && msg.role === 'assistant'
                  ? onRegenerateLast
                  : undefined
              }
            />
          ))}
          {isGenerating && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};
