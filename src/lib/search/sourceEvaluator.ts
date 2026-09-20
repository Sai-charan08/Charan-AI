import { WebSource } from '@/types/chat';

const HIGH_AUTHORITY_DOMAINS = [
  'python.org',
  'developer.mozilla.org',
  'react.dev',
  'nextjs.org',
  'github.com',
  'w3.org',
  'wikipedia.org',
  'arxiv.org',
  'nature.com',
  'sciencedirect.com',
  'nih.gov',
  'cdc.gov',
  'who.int',
  'bbc.com',
  'reuters.com',
  'apnews.com',
];

const SPAM_DOMAINS = [
  'clickbait',
  'buzzfeed',
  'unverified-forum',
  'scam',
];

export function evaluateWebSource(source: Partial<WebSource>): WebSource {
  const url = source.url || '';
  let domain = source.domain || '';
  
  if (!domain && url) {
    try {
      domain = new URL(url).hostname.replace(/^www\./, '');
    } catch {
      domain = 'unknown';
    }
  }

  const isEduOrGov = domain.endsWith('.edu') || domain.endsWith('.gov') || domain.endsWith('.org');
  const isHighAuth = HIGH_AUTHORITY_DOMAINS.some((d) => domain.includes(d));
  const isSpam = SPAM_DOMAINS.some((d) => domain.includes(d));

  let score = 50;
  if (isHighAuth) score += 40;
  if (isEduOrGov) score += 20;
  if (isSpam) score -= 40;

  return {
    id: source.id || Math.random().toString(36).substring(2, 9),
    title: source.title || 'Web Reference',
    url: source.url || '#',
    snippet: source.snippet || '',
    domain,
    isTrusted: score >= 60,
    score,
  };
}

export function rankAndFilterSources(sources: WebSource[], limit = 5): WebSource[] {
  return sources
    .map(evaluateWebSource)
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, limit);
}
