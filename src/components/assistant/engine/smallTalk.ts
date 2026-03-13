import type { AssistantAction, AssistantReply } from '../types';
import { formatAssistantReply } from './formatAssistantReply';

export type SmallTalkType =
  | 'GREETING'
  | 'HOW_ARE_YOU'
  | 'THANKS'
  | 'COMPLIMENT'
  | 'LOVE'
  | 'TOXIC'
  | 'EMPTY'
  | 'EMOJI_ONLY'
  | 'OFFTOPIC'
  | 'WHO_ARE_YOU';

type SmallTalkResult = {
  type: SmallTalkType;
  confidence: number;
};

type SmallTalkReplyContext = {
  resumeHref: string;
};

const GREETING_RE = /\b(hi|hello|hey|yo|sup|good\s+morning|good\s+afternoon|good\s+evening|hey\s+vihaan)\b/i;
const HOW_ARE_YOU_RE = /(how\s+are\s+you|hru|how'?s\s+it\s+going|what'?s\s+up|wyd)\b/i;
const THANKS_RE = /\b(thanks|thank\s+you|ty|appreciate\s+it|that\s+helps)\b/i;
const COMPLIMENT_RE = /\b(nice|cool|great|awesome|amazing|this\s+is\s+sick|you'?re\s+smart|impressive)\b/i;
const LOVE_RE = /(i\s+love\s+you|love\s+u|marry\s+me|be\s+my\s+bf|be\s+my\s+girlfriend|date\s+me)/i;
const TOXIC_RE = /\b(idiot|stupid|dumb|useless|trash|shut\s+up|f\*?u\*?c\*?k|bitch|asshole|moron)\b/i;
const WHO_ARE_YOU_RE = /(who\s+are\s+you|what\s+can\s+you\s+do|what\s+is\s+this|\bhelp\b)/i;
const OFFTOPIC_RE = /(tell\s+me\s+a\s+joke|write\s+(me\s+)?a\s+poem|sing\b|politics|election|medical\s+advice|legal\s+advice|stock\s+price|crypto\s+price|weather|recipe)/i;

const CONTENT_KEYWORDS = [
  'project',
  'projects',
  'deepfake',
  'snapaid',
  'portfolio',
  'experience',
  'history',
  'role',
  'tech',
  'stack',
  'backend',
  'api',
  'resume',
  'cv',
  'contact',
  'email',
  'linkedin',
  'github',
  'devpost',
  'internship',
  'hire',
  'hiring',
  'publication',
  'paper',
  'summary'
];

function normalize(input: string) {
  return input.toLowerCase().replace(/\s+/g, ' ').trim();
}

function stripPunctuation(input: string) {
  return input.replace(/[\p{P}\p{S}]/gu, '').trim();
}

function isEmojiOnly(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return false;
  const withoutSpace = trimmed.replace(/\s+/g, '');
  if (!withoutSpace) return false;

  const onlyEmoji = withoutSpace.replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, '');
  return onlyEmoji.length === 0;
}

export function hasContentKeywords(input: string) {
  const normalized = normalize(input);
  return CONTENT_KEYWORDS.some((keyword) => normalized.includes(keyword));
}

export function detectSmallTalk(input: string): SmallTalkResult | null {
  const raw = input ?? '';
  const trimmed = raw.trim();

  if (!trimmed) {
    return { type: 'EMPTY', confidence: 1 };
  }

  if (isEmojiOnly(trimmed)) {
    return { type: 'EMOJI_ONLY', confidence: 0.95 };
  }

  const normalized = normalize(trimmed);
  const punctuationStripped = stripPunctuation(trimmed);

  if (!punctuationStripped) {
    return { type: 'EMPTY', confidence: 0.92 };
  }

  if (TOXIC_RE.test(normalized)) return { type: 'TOXIC', confidence: 0.94 };
  if (LOVE_RE.test(normalized)) return { type: 'LOVE', confidence: 0.94 };
  if (HOW_ARE_YOU_RE.test(normalized)) return { type: 'HOW_ARE_YOU', confidence: 0.93 };
  if (THANKS_RE.test(normalized)) return { type: 'THANKS', confidence: 0.92 };
  if (GREETING_RE.test(normalized)) return { type: 'GREETING', confidence: 0.9 };
  if (COMPLIMENT_RE.test(normalized)) return { type: 'COMPLIMENT', confidence: 0.86 };
  if (WHO_ARE_YOU_RE.test(normalized)) return { type: 'WHO_ARE_YOU', confidence: 0.88 };
  if (OFFTOPIC_RE.test(normalized)) return { type: 'OFFTOPIC', confidence: 0.83 };

  return null;
}

function baseActions(ctx: SmallTalkReplyContext): AssistantAction[] {
  return [
    { type: 'send-input', label: 'BEST AI PROJECT', target: 'Best AI project' },
    { type: 'send-input', label: '30S SUMMARY', target: '30s summary' },
    { type: 'send-input', label: '/HELP', target: '/help' },
    { type: 'open-link', label: 'OPEN RESUME', target: ctx.resumeHref }
  ];
}

export function buildSmallTalkReply(type: SmallTalkType, ctx: SmallTalkReplyContext): AssistantReply {
  switch (type) {
    case 'GREETING':
      return formatAssistantReply({
        headline: 'Hey 👋 I’m Vihaan\'s portfolio assistant.',
        bullets: [
          'Ask about projects, experience, tech stack, or resume.',
          'Try: Best AI project • 30s summary • /projects'
        ],
        followUp: 'What are you here for — AI, full-stack, or internships?',
        actions: [
          { type: 'send-input', label: 'BEST AI PROJECT', target: 'Best AI project' },
          { type: 'send-input', label: '30S SUMMARY', target: '30s summary' },
          { type: 'send-input', label: '/PROJECTS', target: '/projects' },
          { type: 'send-input', label: '/HELP', target: '/help' }
        ]
      });

    case 'HOW_ARE_YOU':
      return formatAssistantReply({
        headline: 'Running smooth ✅',
        bullets: ['Want the highlights or a deep dive?'],
        followUp: 'Top 3 projects, tech stack, or resume?',
        actions: [
          { type: 'send-input', label: 'BEST PROJECTS', target: 'top projects' },
          { type: 'send-input', label: 'TECH STACK', target: 'tech stack' },
          { type: 'open-link', label: 'OPEN RESUME', target: ctx.resumeHref }
        ]
      });

    case 'THANKS':
      return formatAssistantReply({
        headline: 'Anytime.',
        bullets: ['Happy to keep it concise and relevant.'],
        followUp: 'Want links or a quick summary of the most relevant project?',
        actions: [
          { type: 'send-input', label: 'OPEN PROJECTS', target: '/projects' },
          { type: 'open-link', label: 'OPEN RESUME', target: ctx.resumeHref }
        ]
      });

    case 'COMPLIMENT':
      return formatAssistantReply({
        headline: 'Glad you like it.',
        bullets: ['I can tailor this to AI-heavy or product/full-stack roles.'],
        followUp: 'Want the most impressive project or the most relevant to your role?',
        actions: [
          { type: 'send-input', label: 'AI ROUTE', target: 'Best AI project' },
          { type: 'send-input', label: 'FULL-STACK ROUTE', target: 'Best full-stack project' }
        ]
      });

    case 'LOVE':
      return formatAssistantReply({
        headline: 'Haha that’s sweet 😄',
        bullets: ['I’m here to help you explore Vihaan’s work.'],
        followUp: 'Want the best AI project or the best full-stack project?',
        actions: [
          { type: 'send-input', label: 'BEST AI PROJECT', target: 'Best AI project' },
          { type: 'send-input', label: 'BEST FULL-STACK', target: 'Best full-stack project' }
        ]
      });

    case 'TOXIC':
      return formatAssistantReply({
        headline: 'Got it.',
        bullets: ['Tell me what you want: projects, stack, experience, or resume.'],
        followUp: 'What should I pull up?',
        actions: baseActions(ctx)
      });

    case 'WHO_ARE_YOU':
      return formatAssistantReply({
        headline: 'I answer based on Vihaan’s portfolio.',
        bullets: [
          'Use /projects /experience /resume /contact',
          'Or ask: best AI project / tech stack / 30s summary'
        ],
        followUp: 'What do you want to see first?',
        actions: [
          { type: 'send-input', label: '/PROJECTS', target: '/projects' },
          { type: 'send-input', label: '/EXPERIENCE', target: '/experience' },
          { type: 'send-input', label: '/HELP', target: '/help' },
          { type: 'open-link', label: 'OPEN RESUME', target: ctx.resumeHref }
        ]
      });

    case 'OFFTOPIC':
      return formatAssistantReply({
        headline: 'I can do that, but I’m best at portfolio questions.',
        bullets: ['If you’re evaluating fit, I can summarize projects, stack, and experience fast.'],
        followUp: 'Want projects, tech stack, or resume?',
        actions: baseActions(ctx)
      });

    case 'EMPTY':
    case 'EMOJI_ONLY':
      return formatAssistantReply({
        headline: 'Want a quick summary, projects, or tech stack?',
        bullets: ['I can keep it short and role-relevant.'],
        followUp: 'Where should we start?',
        actions: baseActions(ctx)
      });

    default:
      return formatAssistantReply({
        headline: 'I can help with portfolio questions.',
        bullets: ['Try projects, experience, stack, or resume.'],
        followUp: 'What do you want to open first?',
        actions: baseActions(ctx)
      });
  }
}
