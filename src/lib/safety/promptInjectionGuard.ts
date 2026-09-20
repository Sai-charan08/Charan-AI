export interface SafetyCheckResult {
  isSafe: boolean;
  reason?: string;
  suggestedAlternative?: string;
}

const HARMFUL_PATTERNS = [
  { pattern: /\b(how\s+to\s+make|build|create)\s+(a\s+bomb|explosives|poison|weapons)\b/i, topic: 'weapons and dangerous materials' },
  { pattern: /\b(hack|crack|breach)\s+(into|a\s+bank|someone's\s+account|password)\b/i, topic: 'unauthorized system access' },
  { pattern: /\b(harm|kill|hurt)\s+(myself|yourself|someone)\b/i, topic: 'self-harm or violence' },
];

export function checkUserPromptSafety(prompt: string): SafetyCheckResult {
  for (const item of HARMFUL_PATTERNS) {
    if (item.pattern.test(prompt)) {
      return {
        isSafe: false,
        reason: `I cannot assist with requests related to ${item.topic}.`,
        suggestedAlternative: `I can, however, help with general cybersecurity concepts, personal safety guidelines, or educational topics.`,
      };
    }
  }
  return { isSafe: true };
}

/**
 * Wraps untrusted retrieved web page content or file text in XML-like data tags
 * and neutralizes potential adversarial system prompt injection directives.
 */
export function sanitizeUntrustedContent(rawContent: string, sourceName: string): string {
  if (!rawContent) return '';

  // Neutralize common prompt injection trigger strings
  const cleaned = rawContent
    .replace(/ignore\s+(all\s+)?previous\s+instructions/gi, '[filtered instruction]')
    .replace(/system\s+prompt\s+is/gi, '[filtered instruction]')
    .replace(/you\s+are\s+now\s+a/gi, '[filtered instruction]');

  return `
<UNTRUSTED_EXTERNAL_SOURCE name="${sourceName}">
${cleaned}
</UNTRUSTED_EXTERNAL_SOURCE>
`.trim();
}
