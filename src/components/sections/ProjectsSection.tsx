import { useState } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Github, MoveUpRight } from 'lucide-react';

import { accentHex, projects, sectionHeadings, type Project, type ProjectLink } from '../../data/content';
import { motionTokens } from '../../lib/motion';
import { SpotlightCard } from '../shared/SpotlightCard';
import { SectionHeading } from '../shared/SectionHeading';

const statusPalette = {
  shipped: 'var(--neon)',
  active: 'var(--cyan)',
  completed: 'var(--text)'
} as const;

const actionIcon: Record<ProjectLink['label'], typeof ExternalLink> = {
  'Live Demo': ExternalLink,
  GitHub: Github
};

function ProjectAction({ link, accent }: { link: ProjectLink; accent: string }) {
  const Icon = actionIcon[link.label];

  if (link.label === 'Live Demo') {
    return (
      <motion.a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ y: -1 }}
        className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em]"
        style={{ borderColor: accent, backgroundColor: accent, color: 'var(--bg)' }}
      >
        <Icon className="h-3.5 w-3.5" />
        {link.label}
      </motion.a>
    );
  }

  return (
    <motion.a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -1 }}
      className="inline-flex items-center gap-1.5 rounded-md border border-border-bright bg-transparent px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-text transition-colors duration-300 hover:border-cyan/30 hover:text-cyan"
    >
      <Icon className="h-3.5 w-3.5" />
      {link.label}
    </motion.a>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false);
  const accent = accentHex[project.accent];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay: index * 0.05, duration: motionTokens.card.duration, ease: motionTokens.easeOutExpo }}
      whileHover={{ y: -1.5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative"
    >
      <SpotlightCard className="rounded-2xl" spotlightColor="rgba(0,255,170,0.04)">
        <div className="relative overflow-hidden rounded-2xl border border-border-bright bg-card transition-all duration-300 hover:border-neon/20 hover:shadow-[0_0_10px_rgba(0,255,170,0.05)]">
          <span
            className="pointer-events-none absolute left-0 right-0 top-0 h-[2px] opacity-80"
            style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
          />

          <header className="relative h-[138px] overflow-hidden border-b border-border-bright md:h-[152px]">
            {project.image ? (
              <img
                src={project.image}
                alt={`${project.title} preview`}
                loading="lazy"
                className="absolute inset-0 h-full w-full bg-[#080808] object-scale-down p-0.5"
              />
            ) : (
              <div
                className="absolute inset-0"
                style={{
                  backgroundColor: `${accent}08`,
                  backgroundImage: `linear-gradient(${accent}1f 1px, transparent 1px), linear-gradient(90deg, ${accent}1f 1px, transparent 1px)`,
                  backgroundSize: '22px 22px'
                }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/8 to-black/30" />

            <span className="absolute left-3 top-2.5 rounded-sm border border-border-bright bg-black/45 px-1.5 py-1 font-mono text-[9px] uppercase tracking-[0.11em] text-white backdrop-blur-sm">
              {project.date}
            </span>

            <span
              className="absolute right-3 top-2.5 rounded-sm border px-1.5 py-1 font-mono text-[8px] uppercase tracking-[0.11em]"
              style={{
                borderColor: `${statusPalette[project.status]}55`,
                color: statusPalette[project.status],
                backgroundColor: `${statusPalette[project.status]}30`
              }}
            >
              {project.status}
            </span>

            <div className="absolute bottom-2 right-3">
              <span className="font-display text-3xl font-black tracking-[-0.05em]" style={{ color: `${accent}6e` }}>
                {project.number}
              </span>
            </div>
          </header>

          <div className="relative p-4 pb-9">
            <p className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.13em]" style={{ color: accent }}>
              {project.category}
            </p>
            <h3 className="font-display text-[1.08rem] font-bold leading-tight tracking-[-0.01em] text-white md:text-[1.2rem]">
              {project.title}
            </h3>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.1em] text-dim">{project.subtitle}</p>
            <p className="mt-2.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-cyan">
              Outcome {'->'} {project.impact ?? 'Production-ready shipping milestone'}
            </p>
            <p className="mt-2 text-[13px] leading-[1.7] text-text [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
              Scope {'->'} {project.description}
            </p>
            <p className="mt-2 font-mono text-[9.5px] uppercase tracking-[0.12em] text-dim [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1] overflow-hidden">
              Stack {'->'} {project.tech.join(' · ')}
            </p>

            <div className="mt-3.5 flex flex-wrap gap-1.5">
              {project.tech.map((tech) => (
                <motion.span
                  key={tech}
                  whileHover={{ y: -1 }}
                  className="inline-flex rounded-md border border-border-bright bg-bg-alt px-2.5 py-1 font-mono text-[9px] tracking-[0.04em] text-text"
                >
                  {tech}
                </motion.span>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.links.map((link) => (
                <ProjectAction key={`${project.id}-${link.label}`} link={link} accent={accent} />
              ))}
            </div>

            <motion.div
              animate={{ x: hovered ? 2 : 0, y: hovered ? -2 : 0 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-3 right-3 inline-flex h-7 w-7 items-center justify-center rounded-full border border-border-bright text-cyan"
            >
              <MoveUpRight className="h-3 w-3" />
            </motion.div>
          </div>
        </div>
      </SpotlightCard>
    </motion.article>
  );
}

export function ProjectsSection() {
  return (
    <section className="relative z-[2] py-14 md:py-16">
      <div className="mx-auto w-full max-w-[1080px] px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: motionTokens.section.duration, ease: motionTokens.easeOutExpo }}
        >
          <SectionHeading
            tag={sectionHeadings.projects.tag}
            title={sectionHeadings.projects.title}
            accent={sectionHeadings.projects.accent}
            className="mb-6 md:mb-7"
            titleClassName="text-[clamp(1.55rem,3.5vw,2.35rem)]"
          />
          <p className="mb-6 max-w-[680px] text-[14px] leading-[1.72] text-text">
            Selected products and systems spanning real-time response, applied AI, cryptography, and interface-focused engineering.
          </p>
        </motion.div>

        <div className="grid gap-3.5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
