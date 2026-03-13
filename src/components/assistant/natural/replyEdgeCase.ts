import { formatAssistantReply } from '../engine/formatAssistantReply';
import type { AssistantReply } from '../types';
import type { EdgeCaseCategory } from './edgeCases';

type EdgeReplyContext = {
  input: string;
  resumeHref: string;
};

function coreActions(resumeHref: string) {
  return [
    { type: 'send-input' as const, label: '30S SUMMARY', target: '30s summary' },
    { type: 'send-input' as const, label: 'BEST AI PROJECT', target: 'Best AI project' },
    { type: 'send-input' as const, label: 'TECH STACK', target: 'tech stack' },
    { type: 'open-link' as const, label: 'OPEN RESUME', target: resumeHref },
    { type: 'send-input' as const, label: '/HELP', target: '/help' }
  ];
}

export function buildEdgeCaseReply(category: EdgeCaseCategory, ctx: EdgeReplyContext): AssistantReply {
  const actions = coreActions(ctx.resumeHref);
  const lower = ctx.input.toLowerCase();

  switch (category) {
    case 'GREETING':
      return formatAssistantReply({
        headline: 'Hey 👋 I’m Vihaan’s portfolio assistant.',
        bullets: [
          'I can quickly show projects, experience, stack, or resume.',
          'Try: Best AI project • 30s summary • /projects'
        ],
        followUp: 'What are you here for — AI, full-stack, or internships?',
        actions: [actions[1], actions[0], { type: 'send-input', label: '/PROJECTS', target: '/projects' }, actions[4]]
      });

    case 'HOW_ARE_YOU':
      return formatAssistantReply({
        headline: 'Running smooth ✅',
        bullets: ['Want highlights or a quick deep dive?'],
        followUp: 'Top projects, tech stack, or resume?',
        actions: [
          { type: 'send-input', label: 'BEST PROJECTS', target: 'top projects' },
          actions[2],
          actions[3]
        ]
      });

    case 'THANKS':
      return formatAssistantReply({
        headline: 'Anytime.',
        bullets: ['Happy to keep this concise and relevant.'],
        followUp: 'Want links or a quick project summary?',
        actions: [
          { type: 'send-input', label: '/PROJECTS', target: '/projects' },
          actions[3]
        ]
      });

    case 'COMPLIMENT':
      return formatAssistantReply({
        headline: 'Appreciate it.',
        bullets: ['I can route you to the most impressive or most role-relevant work.'],
        followUp: 'AI-heavy path or full-stack path?',
        actions: [
          { type: 'send-input', label: 'AI ROUTE', target: 'Best AI project' },
          { type: 'send-input', label: 'FULL-STACK ROUTE', target: 'Best full-stack project' }
        ]
      });

    case 'LOVE_FLIRT':
      return formatAssistantReply({
        headline: 'Haha that’s sweet 😄',
        bullets: ['I’m here to help you explore Vihaan’s work clearly and fast.'],
        followUp: 'Best AI project or quick intro first?',
        actions: [actions[1], actions[0], actions[4]]
      });

    case 'APOLOGY':
      return formatAssistantReply({
        headline: 'All good.',
        bullets: ['No worries — we can jump straight to what matters.'],
        followUp: 'Projects, stack, or resume?',
        actions: [actions[1], actions[2], actions[3]]
      });

    case 'GOODBYE':
      return formatAssistantReply({
        headline: 'Got you — catch you later 👋',
        bullets: ['You can reopen me anytime for quick portfolio navigation.'],
        followUp: 'Before you go, want resume or top project links?',
        actions: [actions[3], { type: 'send-input', label: '/PROJECTS', target: '/projects' }]
      });

    case 'CONFUSED':
      return formatAssistantReply({
        headline: 'No problem.',
        bullets: ['I can keep it simple: summary, projects, stack, or resume.'],
        followUp: 'What should I pull up first?',
        actions: [actions[0], { type: 'send-input', label: '/PROJECTS', target: '/projects' }, actions[3]]
      });

    case 'RUDE_OR_TOXIC':
      return formatAssistantReply({
        headline: 'Got it.',
        bullets: ['Tell me what you need: projects, stack, experience, or resume.'],
        followUp: 'What should I pull up?',
        actions: [
          { type: 'send-input', label: '/PROJECTS', target: '/projects' },
          actions[2],
          actions[3]
        ]
      });

    case 'WHO_ARE_YOU':
      return formatAssistantReply({
        headline: 'I answer based on Vihaan’s portfolio content.',
        bullets: [
          'Commands: /projects /experience /resume /contact /help',
          'Good prompts: best AI project, tech stack, 30s summary'
        ],
        followUp: 'What do you want to see first?',
        actions: [
          { type: 'send-input', label: '/PROJECTS', target: '/projects' },
          { type: 'send-input', label: '/EXPERIENCE', target: '/experience' },
          actions[4]
        ]
      });

    case 'OFFTOPIC': {
      const isJoke = /joke/.test(lower);
      const isMedicalLegal = /medical|legal/.test(lower);
      const extraBullet = isJoke
        ? 'Quick joke: I debug faster than I make coffee.'
        : isMedicalLegal
          ? 'I’m not the right tool for medical/legal advice.'
          : 'I can do lightweight off-topic, but portfolio questions are where I’m best.';

      return formatAssistantReply({
        headline: 'I can help, but I’m optimized for portfolio questions.',
        bullets: [extraBullet, 'If you are evaluating fit, I can summarize projects, stack, and experience quickly.'],
        followUp: 'Want projects, tech stack, or resume?',
        actions: [
          { type: 'send-input', label: '/PROJECTS', target: '/projects' },
          actions[2],
          actions[3]
        ]
      });
    }

    case 'AFFIRMATION':
      return formatAssistantReply({
        headline: 'Perfect.',
        bullets: ['I’ll keep it sharp and relevant.'],
        followUp: 'Want projects, a 30s summary, or resume?',
        actions: [
          { type: 'send-input', label: '/PROJECTS', target: '/projects' },
          actions[0],
          actions[3]
        ]
      });

    case 'NEGATION':
      return formatAssistantReply({
        headline: 'No problem.',
        bullets: ['We can keep this lightweight and skip anything unnecessary.'],
        followUp: 'Want a quick summary instead?',
        actions: [actions[0], actions[4]]
      });

    case 'LAUGHTER':
      return formatAssistantReply({
        headline: '😄',
        bullets: ['Want me to pull the most impressive project next?'],
        followUp: 'AI project or full-stack project?',
        actions: [
          { type: 'send-input', label: 'BEST AI PROJECT', target: 'Best AI project' },
          { type: 'send-input', label: 'BEST FULL-STACK PROJECT', target: 'Best full-stack project' }
        ]
      });

    case 'SHORT_ACK':
      return formatAssistantReply({
        headline: 'Nice.',
        bullets: ['Ready when you are.'],
        followUp: 'Should I open projects or resume?',
        actions: [
          { type: 'send-input', label: '/PROJECTS', target: '/projects' },
          actions[3]
        ]
      });

    case 'ASK_FOR_HUMAN':
      return formatAssistantReply({
        headline: 'I’m Vihaan’s assistant layer.',
        bullets: ['For direct human contact, use email or LinkedIn in the Contact section.'],
        followUp: 'Want me to open contact now?',
        actions: [
          { type: 'send-input', label: '/CONTACT', target: '/contact' },
          actions[3]
        ]
      });

    case 'QUICK_REQUEST':
      return formatAssistantReply({
        headline: 'Got it — fast mode on.',
        bullets: ['I’ll keep responses concise and action-oriented.'],
        followUp: 'Quick summary, top project, or resume?',
        actions: [actions[0], actions[1], actions[3]]
      });

    case 'EMOJI_ONLY':
    case 'EMPTY_OR_NOISE':
      return formatAssistantReply({
        headline: 'Want a quick summary, projects, or tech stack?',
        bullets: ['I can keep it short and role-relevant.'],
        followUp: 'Where should we start?',
        actions: [actions[0], { type: 'send-input', label: '/PROJECTS', target: '/projects' }, actions[2], actions[3]]
      });

    default:
      return formatAssistantReply({
        headline: 'I can answer portfolio questions offline.',
        bullets: ['Try /help or ask about projects, stack, experience, or resume.'],
        followUp: 'What do you want to open first?',
        actions: [actions[4], { type: 'send-input', label: '/PROJECTS', target: '/projects' }]
      });
  }
}
