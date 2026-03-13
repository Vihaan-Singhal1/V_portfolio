import {
  contact,
  experience,
  footer,
  heroContent,
  projects,
  publications,
  techStackGroups,
  university
} from '../../data/content';
import type { KnowledgeChunk, RetrievalResult } from './types';

type IndexedChunk = KnowledgeChunk & {
  normalizedBody: string;
  normalizedTags: string[];
};

const synonymMap: Record<string, string[]> = {
  ai: ['ml', 'machine', 'deepfake', 'vision', 'research'],
  project: ['projects', 'build', 'built', 'portfolio', 'demo'],
  stack: ['tech', 'technologies', 'tools', 'frameworks'],
  internship: ['internships', 'hiring', 'opportunity', 'opportunities'],
  contact: ['email', 'linkedin', 'github', 'devpost', 'reach'],
  publication: ['paper', 'papers', 'research', 'cucai'],
  resume: ['cv', 'pdf', 'experience'],
  deepfake: ['detector', 'vision', 'cucai', 'macai']
};

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function tokenize(value: string) {
  const normalized = normalize(value);
  if (!normalized) return [];
  return normalized.split(' ').filter((token) => token.length > 1);
}

function buildKnowledgeChunks(): KnowledgeChunk[] {
  const resumeHref = footer.cta.find((item) => item.label.toLowerCase().includes('resume'))?.href ?? '/assets/resume/vihaan_resume_v1.pdf';

  const introChunk: KnowledgeChunk = {
    id: 'hero-summary',
    section: 'home',
    title: 'Vihaan summary',
    body: `${heroContent.valueLine} ${heroContent.bio}`,
    tags: ['summary', 'bio', 'about', 'vihaan', 'home'],
    links: [{ label: 'Resume', href: resumeHref }],
    rankBoost: 1.3
  };

  const educationChunk: KnowledgeChunk = {
    id: 'education-overview',
    section: 'education',
    title: 'Education',
    body: `${university.school}. ${university.degree}. ${university.period}. ${university.location}. ${university.honor}`,
    tags: ['education', 'university', 'mcmaster', 'honors', 'award'],
    rankBoost: 1.1
  };

  const projectChunks = projects.map<KnowledgeChunk>((project) => ({
    id: `project-${project.id}`,
    section: 'projects',
    title: project.title,
    body: `${project.impact ?? ''} ${project.description} Stack: ${project.tech.join(', ')}`,
    tags: [
      'project',
      project.id,
      project.title,
      project.subtitle,
      project.category,
      ...project.tech
    ],
    relatedProjectId: project.id,
    links: project.links.map((link) => ({ label: link.label, href: link.href })),
    rankBoost: project.id === 'deepfake-detector' ? 1.6 : 1.15
  }));

  const experienceChunks = experience.map<KnowledgeChunk>((entry) => ({
    id: `experience-${normalize(entry.org)}-${normalize(entry.role).replace(/\s+/g, '-')}`,
    section: 'experience',
    title: `${entry.role} @ ${entry.org}`,
    body: `${entry.description} ${entry.details?.join(' ') ?? ''}`,
    tags: ['experience', 'history', entry.role, entry.org, ...(entry.stack ?? [])],
    links: entry.links?.map((link) => ({ label: link.label, href: link.href })),
    rankBoost: 1.08
  }));

  const stackChunks = techStackGroups.map<KnowledgeChunk>((group) => ({
    id: `stack-${normalize(group.title).replace(/\s+/g, '-')}`,
    section: 'tech-stack',
    title: group.title,
    body: `Skills: ${group.skills.join(', ')}`,
    tags: ['tech', 'stack', group.title, ...group.skills],
    rankBoost: 1.05
  }));

  const publicationChunks = publications.map<KnowledgeChunk>((publication) => ({
    id: `publication-${publication.id}`,
    section: 'publications',
    title: publication.title,
    body: `${publication.venue}. ${publication.date}. ${publication.description}`,
    tags: ['publication', 'paper', publication.venue, publication.title, publication.id],
    links: [
      ...(publication.pdfHref ? [{ label: 'Read Paper', href: publication.pdfHref }] : []),
      ...(publication.links?.map((link) => ({ label: link.label, href: link.href })) ?? [])
    ],
    rankBoost: publication.id === 'deepfake-cucai' ? 1.4 : 1.02
  }));

  const contactChunk: KnowledgeChunk = {
    id: 'contact-overview',
    section: 'contact',
    title: 'Contact and resume',
    body: `${contact.subtitle} Email: ${contact.cards.find((card) => card.label === 'Email')?.value ?? ''}. LinkedIn: ${contact.cards.find((card) => card.label === 'LinkedIn')?.value ?? ''}.`,
    tags: ['contact', 'email', 'linkedin', 'github', 'devpost', 'resume', 'reach'],
    links: [
      { label: 'Resume', href: resumeHref },
      ...contact.cards.map((card) => ({ label: card.label, href: card.href }))
    ],
    rankBoost: 1.3
  };

  return [introChunk, educationChunk, ...projectChunks, ...experienceChunks, ...stackChunks, ...publicationChunks, contactChunk];
}

const indexedKnowledgeBase: IndexedChunk[] = buildKnowledgeChunks().map((chunk) => ({
  ...chunk,
  normalizedBody: normalize(`${chunk.title} ${chunk.body}`),
  normalizedTags: chunk.tags.map((tag) => normalize(tag)).filter(Boolean)
}));

function scoreChunk(chunk: IndexedChunk, query: string, tokens: string[]) {
  const normalizedQuery = normalize(query);
  const tokenSet = new Set(tokens);
  let score = chunk.rankBoost ?? 1;

  if (normalizedQuery && chunk.normalizedBody.includes(normalizedQuery)) {
    score += 2.3;
  }

  for (const token of tokenSet) {
    if (chunk.normalizedTags.some((tag) => tag.includes(token))) {
      score += 1.7;
    }

    if (chunk.normalizedBody.includes(token)) {
      score += 1.05;
    }

    const synonyms = synonymMap[token] ?? [];
    for (const synonym of synonyms) {
      const normalizedSynonym = normalize(synonym);
      if (!normalizedSynonym) continue;

      if (chunk.normalizedTags.some((tag) => tag.includes(normalizedSynonym))) {
        score += 0.8;
      } else if (chunk.normalizedBody.includes(normalizedSynonym)) {
        score += 0.45;
      }
    }
  }

  if (tokens.length === 0) return 0;
  return score;
}

export function retrieveKnowledge(query: string, maxChunks = 3): RetrievalResult {
  const tokens = tokenize(query);

  if (tokens.length === 0) {
    return {
      chunks: indexedKnowledgeBase.slice(0, Math.max(1, maxChunks)).map(({ normalizedBody, normalizedTags, ...chunk }) => chunk),
      confidence: 0
    };
  }

  const scored = indexedKnowledgeBase
    .map((chunk) => ({ chunk, score: scoreChunk(chunk, query, tokens) }))
    .filter((entry) => entry.score > 1.2)
    .sort((a, b) => b.score - a.score);

  const fallback = [indexedKnowledgeBase[0], ...indexedKnowledgeBase.filter((item) => item.section === 'projects').slice(0, 2)].filter(Boolean) as IndexedChunk[];
  const top = (scored.length ? scored.map((entry) => entry.chunk) : fallback).slice(0, Math.max(1, maxChunks));

  const topScore = scored[0]?.score ?? 0;
  const possibleBest = tokens.length * 2.8 + 2;
  const confidence = Math.max(0, Math.min(1, topScore / possibleBest));

  return {
    chunks: top.map(({ normalizedBody, normalizedTags, ...chunk }) => chunk),
    confidence
  };
}

export function getKnowledgeBase() {
  return indexedKnowledgeBase.map(({ normalizedBody, normalizedTags, ...chunk }) => chunk);
}
