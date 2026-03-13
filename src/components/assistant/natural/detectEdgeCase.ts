import { projects } from '../../../data/content';
import {
  EDGE_CASE_CATALOG,
  ensureEdgeCaseCatalog,
  EDGE_CASE_ORDER,
  EDGE_CASE_REGEX,
  type EdgeCaseCategory,
  normalizeEdgeText
} from './edgeCases';

export type EdgeCaseDetection = {
  category: EdgeCaseCategory;
  confidence: number;
  smallTalkOnly: boolean;
  hasPortfolioIntent: boolean;
};

const BASE_PORTFOLIO_KEYWORDS = [
  'project',
  'projects',
  'stack',
  'tech stack',
  'experience',
  'resume',
  'contact',
  'internship',
  'research',
  'publication',
  'publications',
  'github',
  'demo',
  'skills',
  'ai',
  'ml',
  'backend',
  'api'
];

const PROJECT_ALIASES = projects.flatMap((project) => {
  const pieces = [project.id, project.title, project.subtitle, project.category, ...project.tech]
    .join(' ')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/[\s-]+/)
    .filter((token) => token.length > 2);

  return Array.from(new Set(pieces));
});

const PORTFOLIO_KEYWORDS = Array.from(new Set([...BASE_PORTFOLIO_KEYWORDS, ...PROJECT_ALIASES]));

function isEmojiOnly(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return false;

  const withoutSpaces = trimmed.replace(/\s+/g, '');
  if (!withoutSpaces) return false;

  const removedEmoji = withoutSpaces.replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, '');
  const removedPunct = removedEmoji.replace(/[.!?,…'"`~*_\-]/g, '');
  return removedPunct.length === 0 && /[\p{Extended_Pictographic}]/u.test(withoutSpaces);
}

function squeezeStretch(input: string) {
  return input
    .replace(/([a-z])\1{2,}/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

export function containsPortfolioIntent(input: string) {
  const normalized = normalizeEdgeText(input, true);
  if (!normalized) return false;
  if (/^\/[a-z0-9-]+/.test(normalized)) return true;

  const tokens = normalized.split(' ').filter(Boolean);

  return PORTFOLIO_KEYWORDS.some((keyword) => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    if (!normalizedKeyword) return false;

    if (normalizedKeyword.includes(' ')) {
      return normalized.includes(normalizedKeyword);
    }

    if (normalizedKeyword.length <= 2) {
      return tokens.includes(normalizedKeyword);
    }

    return tokens.includes(normalizedKeyword) || normalized.includes(normalizedKeyword);
  });
}

export function detectEdgeCase(input: string): EdgeCaseDetection | null {
  ensureEdgeCaseCatalog();
  const raw = input ?? '';
  const trimmed = raw.trim();
  const hasIntent = containsPortfolioIntent(raw);

  if (!trimmed) {
    return {
      category: 'EMPTY_OR_NOISE',
      confidence: 1,
      smallTalkOnly: !hasIntent,
      hasPortfolioIntent: hasIntent
    };
  }

  if (isEmojiOnly(trimmed)) {
    return {
      category: 'EMOJI_ONLY',
      confidence: 0.97,
      smallTalkOnly: !hasIntent,
      hasPortfolioIntent: hasIntent
    };
  }

  const normalized = normalizeEdgeText(trimmed, false);
  const squeezed = squeezeStretch(normalized);

  for (const category of EDGE_CASE_ORDER) {
    if (category === 'EMOJI_ONLY' || category === 'EMPTY_OR_NOISE') continue;

    if (EDGE_CASE_CATALOG[category]?.has(normalized) || EDGE_CASE_CATALOG[category]?.has(squeezed)) {
      return {
        category,
        confidence: 0.94,
        smallTalkOnly: !hasIntent,
        hasPortfolioIntent: hasIntent
      };
    }

    const regexes = EDGE_CASE_REGEX[category] ?? [];
    for (const pattern of regexes) {
      if (pattern.test(normalized) || pattern.test(squeezed)) {
        return {
          category,
          confidence: 0.84,
          smallTalkOnly: !hasIntent,
          hasPortfolioIntent: hasIntent
        };
      }
    }
  }

  if (/^(\.|\?|!|…|\s)+$/.test(trimmed)) {
    return {
      category: 'EMPTY_OR_NOISE',
      confidence: 0.9,
      smallTalkOnly: !hasIntent,
      hasPortfolioIntent: hasIntent
    };
  }

  return null;
}

export function getFriendlyPreface(detection: EdgeCaseDetection | null) {
  if (!detection || detection.smallTalkOnly) return '';

  if (detection.category === 'GREETING') return 'Hey 👋 — sure.';
  if (detection.category === 'HOW_ARE_YOU') return 'Running smooth ✅ — sure.';
  if (detection.category === 'THANKS') return 'Anytime — sure.';

  return '';
}
