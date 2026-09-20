import { WebSource } from '@/types/chat';

export interface SearchQueryOptions {
  maxResults?: number;
  domainFilter?: string[];
  safeSearch?: boolean;
}

export interface SearchProvider {
  name: string;
  search(query: string, options?: SearchQueryOptions): Promise<WebSource[]>;
}
