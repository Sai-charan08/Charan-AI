import { Message, WebSource } from '@/types/chat';

export interface AICompletionOptions {
  modelName?: string;
  apiKey?: string;
  temperature?: number;
  sources?: WebSource[];
  systemPrompt?: string;
  stream?: boolean;
}

export interface AIProvider {
  name: string;
  generateResponse(messages: Message[], options?: AICompletionOptions): Promise<string>;
  streamResponse(
    messages: Message[],
    options: AICompletionOptions,
    onChunk: (chunk: string) => void
  ): Promise<string>;
}
