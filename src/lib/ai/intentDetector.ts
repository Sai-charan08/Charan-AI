import { UserIntent } from '@/types/chat';

export interface IntentAnalysisResult {
  intent: UserIntent;
  requiresWebSearch: boolean;
  confidence: number;
  explanation?: string;
}

const GREETING_REGEX = /^(hi|hello|hii|hey|good\s*(morning|afternoon|evening|day)|greetings)(\s+there|\s+charan|\s+bot)?[\s!.]*$/i;
const IDENTITY_REGEX = /^(who\s+are\s+you|what\s+is\s+your\s+name|tell\s+me\s+about\s+yourself|who\s+created\s+you|what\s+is\s+the\s+model\s+of\s+you|what\s+model\s+are\s+you|which\s+model\s+are\s+you|what\s+engine\s+are\s+you|what\s+version\s+are\s+you)[\s?.]*$/i;
const AMBIGUOUS_REGEX = /^(make\s+it\s+better|fix\s+it|do\s+it|help|change\s+this|more)[\s!.]*$/i;

const SEARCH_TRIGGER_KEYWORDS = [
  'latest',
  'recent',
  'today',
  'current',
  'news',
  'version',
  'price',
  'paper',
  'research',
  'developments',
  'search the web',
  'look up',
  'find online',
  'weather',
  'stock price',
  '2025',
  '2026',
  'who is',
  'who was',
  'cm of',
  'pm of',
  'chief minister',
  'prime minister',
  'president of',
  'governor of',
  'capital of',
  'ceo of',
  'founder of',
  'head of',
];

const CODING_KEYWORDS = [
  'code',
  'python',
  'javascript',
  'typescript',
  'react',
  'function',
  'algorithm',
  'bug',
  'error',
  'syntax',
  'sql',
  'database',
  'api',
  'html',
  'css',
  'node',
  'class',
  'array',
  'debug',
];

const MEDICAL_KEYWORDS = [
  'symptom',
  'disease',
  'medication',
  'doctor',
  'pain',
  'treatment',
  'cure',
  'diagnosis',
  'hospital',
  'fever',
];

const LEGAL_KEYWORDS = [
  'law',
  'legal',
  'lawyer',
  'statute',
  'court',
  'contract',
  'liability',
  'regulation',
];

const POLITICAL_KEYWORDS = [
  'election',
  'vote',
  'candidate',
  'president',
  'party',
  'democrat',
  'republican',
  'government policy',
];

export function detectUserIntent(userPrompt: string): IntentAnalysisResult {
  const trimmed = userPrompt.trim();

  // 1. Check simple Greetings
  if (GREETING_REGEX.test(trimmed)) {
    return { intent: 'greeting', requiresWebSearch: false, confidence: 0.99 };
  }

  const lower = trimmed.toLowerCase();

  // 2. Check Identity & Model Queries
  if (
    IDENTITY_REGEX.test(trimmed) ||
    lower.includes('model of you') ||
    lower.includes('your model') ||
    lower.includes('what model') ||
    lower.includes('who created you') ||
    lower.includes('who built you') ||
    lower.includes('what engine')
  ) {
    return { intent: 'identity', requiresWebSearch: false, confidence: 0.99 };
  }

  // 4. Check for Web Search necessity (who is, cm of, pm of, latest, etc.)
  const hasSearchKeyword = SEARCH_TRIGGER_KEYWORDS.some((kw) => lower.includes(kw));

  // 5. Check Medical
  if (MEDICAL_KEYWORDS.some((kw) => lower.includes(kw))) {
    return {
      intent: 'medical',
      requiresWebSearch: hasSearchKeyword,
      confidence: 0.9,
    };
  }

  // 6. Check Legal
  if (LEGAL_KEYWORDS.some((kw) => lower.includes(kw))) {
    return {
      intent: 'legal',
      requiresWebSearch: hasSearchKeyword,
      confidence: 0.9,
    };
  }

  // 7. Check Political
  if (POLITICAL_KEYWORDS.some((kw) => lower.includes(kw))) {
    return {
      intent: 'political',
      requiresWebSearch: hasSearchKeyword,
      confidence: 0.9,
    };
  }

  // 8. Check Coding
  if (CODING_KEYWORDS.some((kw) => lower.includes(kw))) {
    return {
      intent: 'coding',
      requiresWebSearch: hasSearchKeyword,
      confidence: 0.9,
    };
  }

  // 9. Research or Factual question
  if (hasSearchKeyword || lower.startsWith('who') || lower.startsWith('what') || lower.startsWith('where')) {
    return {
      intent: 'research',
      requiresWebSearch: true,
      confidence: 0.95,
    };
  }

  return { intent: 'general', requiresWebSearch: false, confidence: 0.8 };
}
