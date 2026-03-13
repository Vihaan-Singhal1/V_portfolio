import type { AssistantAction, AssistantProjectCard, AssistantReply } from '../types';

type FormatAssistantReplyInput = {
  headline: string;
  bullets?: string[];
  followUp?: string;
  actions?: AssistantAction[];
  cards?: AssistantProjectCard[];
  usedApi?: boolean;
};

function cleanLine(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

export function formatAssistantReply({
  headline,
  bullets = [],
  followUp,
  actions,
  cards,
  usedApi
}: FormatAssistantReplyInput): AssistantReply {
  const headlineLine = cleanLine(headline);
  const bulletLines = bullets
    .map((item) => cleanLine(item))
    .filter(Boolean)
    .slice(0, 4)
    .map((item) => `• ${item}`);

  const lines: string[] = [headlineLine];

  if (bulletLines.length) {
    lines.push(...bulletLines);
  }

  if (followUp?.trim()) {
    const next = followUp.trim();
    lines.push('', next.endsWith('?') ? next : `${next}?`);
  }

  return {
    content: lines.join('\n'),
    actions,
    cards,
    usedApi
  };
}
