import {
  contact,
  experience,
  footer,
  heroContent,
  projects,
  publications,
  techStackGroups
} from '../../data/content';
import { formatAssistantReply } from './engine/formatAssistantReply';
import { retrieveKnowledge } from './knowledgeBase';
import { detectEdgeCase, getFriendlyPreface } from './natural/detectEdgeCase';
import { buildEdgeCaseReply } from './natural/replyEdgeCase';
import type { AssistantAction, AssistantProjectCard, AssistantReply } from './types';

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function truncate(value: string, max = 170) {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trim()}…`;
}

export function getResumeHref() {
  return (
    footer.cta.find((entry) => entry.label.toLowerCase().includes('resume'))?.href ??
    '/assets/resume/vihaan_resume_v1.pdf'
  );
}

function toProjectCard(projectId: string): AssistantProjectCard | null {
  const project = projects.find((item) => item.id === projectId);
  if (!project) return null;

  return {
    id: project.id,
    title: project.title,
    outcome: project.impact ?? project.description,
    stack: project.tech.slice(0, 6),
    links: project.links
  };
}

function defaultActions(): AssistantAction[] {
  return [
    { type: 'send-input', label: 'BEST AI PROJECT', target: 'Best AI project' },
    { type: 'send-input', label: '30S SUMMARY', target: '30s summary' },
    { type: 'send-input', label: '/PROJECTS', target: '/projects' },
    { type: 'send-input', label: '/HELP', target: '/help' }
  ];
}

export function buildOfflineReply(input: string, maxContextChunks: number): { reply: AssistantReply; confidence: number } {
  const query = normalize(input);
  const resumeHref = getResumeHref();
  const deepfakeCard = toProjectCard('deepfake-detector');
  const snapaidCard = toProjectCard('snapaid');

  const edgeCase = detectEdgeCase(input);

  if (edgeCase && edgeCase.smallTalkOnly) {
    return {
      confidence: edgeCase.confidence,
      reply: buildEdgeCaseReply(edgeCase.category, { input, resumeHref })
    };
  }

  const greetingPreface = getFriendlyPreface(edgeCase);
  const withPreface = (headline: string) =>
    greetingPreface ? `${greetingPreface} ${headline}` : headline;

  if (/best ai project|best ai|deepfake|macai|computer vision/.test(query)) {
    return {
      confidence: 0.95,
      reply: formatAssistantReply({
        headline: withPreface('DeepFakeDetector AI is the strongest AI proof point.'),
        bullets: [
          'Presented at CUCAI after benchmark evaluation on OpenFake and AI-GenBench.',
          'Includes live demo, open-source code, and released model artifacts.',
          'Stack focus: ViT, EfficientNet-B0, fusion models, and deployment tooling.'
        ],
        followUp: 'Want the publication, demo, or code first?',
        cards: [deepfakeCard].filter((card): card is AssistantProjectCard => Boolean(card)),
        actions: [
          { type: 'open-section', label: 'OPEN PROJECTS', target: 'projects' },
          { type: 'open-section', label: 'OPEN PUBLICATIONS', target: 'publications' },
          { type: 'send-input', label: 'TECH STACK', target: 'tech stack' }
        ]
      })
    };
  }

  if (/tech stack|stack|tools|technologies|backend|api/.test(query)) {
    const groups = techStackGroups
      .slice(0, 4)
      .map((group) => `${group.title}: ${group.skills.slice(0, 5).join(', ')}`);

    return {
      confidence: 0.9,
      reply: formatAssistantReply({
        headline: withPreface('Here is the current high-signal stack snapshot.'),
        bullets: groups,
        followUp: 'Want the AI-heavy stack or backend/API stack first?',
        actions: [
          { type: 'open-section', label: 'OPEN TECH STACK', target: 'tech-stack' },
          { type: 'send-input', label: 'BEST AI PROJECT', target: 'Best AI project' }
        ]
      })
    };
  }

  if (/internship|internships|hire|hiring|open to work|availability|opportunity/.test(query)) {
    return {
      confidence: 0.93,
      reply: formatAssistantReply({
        headline: withPreface('Yes — open to internships and high-impact engineering opportunities.'),
        bullets: [
          'Primary fit: applied AI, backend systems, and full-stack product execution.',
          `Best direct contact: ${contact.cards.find((card) => card.label === 'Email')?.value ?? 'email available in contact section'}.`
        ],
        followUp: 'Want resume first, or should I jump you to contact?',
        actions: [
          { type: 'open-link', label: 'OPEN RESUME', target: resumeHref },
          { type: 'open-section', label: 'OPEN CONTACT', target: 'contact' }
        ]
      })
    };
  }

  if (/30s summary|30 second|thirty second|summary|about you|pitch/.test(query)) {
    const proofs = heroContent.credibilityStrip.slice(0, 3).join(' · ');
    return {
      confidence: 0.92,
      reply: formatAssistantReply({
        headline: withPreface('Vihaan builds applied AI and full-stack systems that ship to real users.'),
        bullets: [
          truncate(heroContent.bio, 165),
          `Proof: ${proofs}`,
          'Strengths: production mindset, fast iteration, and measurable outcomes.'
        ],
        followUp: 'Want projects, experience, or resume next?',
        actions: [
          { type: 'open-section', label: 'OPEN PROJECTS', target: 'projects' },
          { type: 'open-section', label: 'OPEN EXPERIENCE', target: 'experience' },
          { type: 'open-link', label: 'OPEN RESUME', target: resumeHref }
        ]
      })
    };
  }

  if (/projects|what should i check first|where should i start/.test(query)) {
    return {
      confidence: 0.88,
      reply: formatAssistantReply({
        headline: withPreface('Start with projects for immediate proof of execution.'),
        bullets: [
          'Then scan Experience for role ownership and scope.',
          'Use Publications to validate research depth and applied AI rigor.'
        ],
        followUp: 'Want me to open projects now?',
        cards: [deepfakeCard, snapaidCard].filter((card): card is AssistantProjectCard => Boolean(card)),
        actions: [
          { type: 'open-section', label: 'OPEN PROJECTS', target: 'projects' },
          { type: 'send-input', label: 'BEST AI PROJECT', target: 'Best AI project' },
          { type: 'send-input', label: '30S SUMMARY', target: '30s summary' }
        ]
      })
    };
  }

  if (/experience|work history|roles/.test(query)) {
    const highlights = experience
      .slice(0, 3)
      .map((entry) => `${entry.role} @ ${entry.org} (${entry.period})`);

    return {
      confidence: 0.87,
      reply: formatAssistantReply({
        headline: withPreface('Recent roles combine AI research, deployment, and product engineering.'),
        bullets: highlights,
        followUp: 'Want me to open experience or shortlist the most relevant role?',
        actions: [
          { type: 'open-section', label: 'OPEN EXPERIENCE', target: 'experience' },
          { type: 'send-input', label: 'BEST AI PROJECT', target: 'Best AI project' }
        ]
      })
    };
  }

  if (/publication|paper|research/.test(query)) {
    const items = publications
      .slice(0, 3)
      .map((paper) => `${paper.title} — ${paper.venue} (${paper.date})`);

    return {
      confidence: 0.88,
      reply: formatAssistantReply({
        headline: withPreface('Research output is focused on applied AI and practical validation.'),
        bullets: items,
        followUp: 'Want the MacAI publication or all publication links?',
        actions: [
          { type: 'open-section', label: 'OPEN PUBLICATIONS', target: 'publications' },
          { type: 'send-input', label: 'BEST AI PROJECT', target: 'Best AI project' }
        ]
      })
    };
  }

  if (/contact|email|linkedin|github|resume|devpost/.test(query)) {
    return {
      confidence: 0.9,
      reply: formatAssistantReply({
        headline: withPreface('Here are the fastest ways to reach Vihaan.'),
        bullets: [
          `Email: ${contact.cards.find((card) => card.label === 'Email')?.value ?? 'N/A'}`,
          `LinkedIn: ${contact.cards.find((card) => card.label === 'LinkedIn')?.value ?? 'N/A'}`,
          'GitHub and Devpost are also available in contact cards.'
        ],
        followUp: 'Open contact section or resume?',
        actions: [
          { type: 'open-section', label: 'OPEN CONTACT', target: 'contact' },
          { type: 'open-link', label: 'OPEN RESUME', target: resumeHref }
        ]
      })
    };
  }

  const retrieval = retrieveKnowledge(input, maxContextChunks);
  const cards = retrieval.chunks
    .map((chunk) => (chunk.relatedProjectId ? toProjectCard(chunk.relatedProjectId) : null))
    .filter((card): card is AssistantProjectCard => Boolean(card))
    .slice(0, 2);

  if (!retrieval.chunks.length || retrieval.confidence < 0.24) {
    return {
      confidence: retrieval.confidence,
      reply: formatAssistantReply({
        headline: withPreface('I can answer portfolio questions offline.'),
        bullets: [
          'Try asking about projects, experience, tech stack, or publications.',
          'Use /help for command shortcuts and quick navigation.'
        ],
        followUp: 'Want a quick 30s summary?',
        actions: defaultActions()
      })
    };
  }

  const topLines = retrieval.chunks
    .slice(0, 3)
    .map((chunk) => `${chunk.title}: ${truncate(chunk.body, 115)}`);
  const primarySection = retrieval.chunks[0]?.section ?? 'projects';

  return {
    confidence: retrieval.confidence,
    reply: formatAssistantReply({
      headline: withPreface('Here is the most relevant context from the portfolio.'),
      bullets: topLines,
      followUp: 'Want me to open that section or pull a tighter summary?',
      cards,
      actions: [
        { type: 'open-section', label: `OPEN ${primarySection.toUpperCase()}`, target: primarySection },
        { type: 'send-input', label: '30S SUMMARY', target: '30s summary' },
        { type: 'open-link', label: 'OPEN RESUME', target: resumeHref }
      ]
    })
  };
}
