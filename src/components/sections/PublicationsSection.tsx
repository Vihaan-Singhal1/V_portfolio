import { motion, useReducedMotion } from 'motion/react';
import { CalendarDays, ExternalLink, FileText, Github, Globe, Linkedin, Microscope } from 'lucide-react';

import { publications, sectionHeadings } from '../../data/content';
import { motionTokens } from '../../lib/motion';
import { SectionHeading } from '../shared/SectionHeading';

type PublicationLinkLabel = 'LinkedIn' | 'Project' | 'GitHub' | 'Models' | 'Demo';

const linkIcons: Record<PublicationLinkLabel, typeof ExternalLink> = {
  LinkedIn: Linkedin,
  Project: ExternalLink,
  GitHub: Github,
  Models: Microscope,
  Demo: Globe
};

export function PublicationsSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative z-[2] py-12 md:py-14">
      <div className="mx-auto w-full max-w-[1040px] px-6 md:px-8">
        <SectionHeading
          tag={sectionHeadings.publications.tag}
          title={sectionHeadings.publications.title}
          accent={sectionHeadings.publications.accent}
          className="mb-5 md:mb-6"
          titleClassName="text-[clamp(1.45rem,3vw,2.05rem)]"
        />

        <p className="mb-5 max-w-[740px] text-[13px] leading-[1.72] text-text">
          Research publications and technical papers with direct links to published files and project resources.
        </p>

        <div className="grid gap-3.5 md:grid-cols-2">
          {publications.map((publication, index) => (
            <motion.article
              id={`publication-${publication.id}`}
              key={publication.id}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.99 }}
              whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: motionTokens.card.duration, delay: index * 0.045, ease: motionTokens.easeOutExpo }}
              whileHover={reduceMotion ? undefined : { y: -4, scale: 1.008 }}
              className="group scroll-mt-28 overflow-hidden rounded-xl border border-border-bright bg-card/95 p-3.5 transition-all duration-300 hover:border-cyan/28 hover:shadow-[0_0_18px_rgba(0,200,255,0.12)] md:p-4"
            >
              <motion.div
                aria-hidden="true"
                className="mb-3 h-[1px] w-full bg-gradient-to-r from-transparent via-cyan/75 to-transparent"
                initial={{ opacity: 0.4 }}
                whileHover={reduceMotion ? undefined : { opacity: 0.9 }}
                transition={{ duration: 0.2 }}
              />

              <div className="flex flex-wrap items-start justify-between gap-2.5">
                <h3 className="max-w-[560px] font-display text-[1rem] font-bold leading-tight tracking-[-0.01em] text-white md:text-[1.12rem]">
                  {publication.title}
                </h3>
                <motion.span
                  whileHover={reduceMotion ? undefined : { scale: 1.03 }}
                  className="rounded-sm border px-2 py-1 font-mono text-[8.5px] uppercase tracking-[0.14em]"
                  style={{
                    borderColor: publication.status === 'published' ? 'rgba(0,255,170,0.35)' : 'rgba(0,200,255,0.35)',
                    color: publication.status === 'published' ? 'var(--neon)' : 'var(--cyan)',
                    background: publication.status === 'published' ? 'rgba(0,255,170,0.10)' : 'rgba(0,200,255,0.10)'
                  }}
                >
                  {publication.status === 'published' ? 'Published' : 'Coming Soon'}
                </motion.span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-dim">
                <span className="font-display text-[0.92rem] font-semibold text-text md:text-[1rem]">{publication.venue}</span>
                <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-dim">
                  <CalendarDays className="h-3.5 w-3.5 text-cyan" />
                  {publication.date}
                </span>
              </div>

              <p className="mt-2.5 text-[12.5px] leading-[1.7] text-text">{publication.description}</p>

              <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
                {publication.pdfHref ? (
                  <motion.a
                    href={publication.pdfHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={reduceMotion ? undefined : { y: -1 }}
                    className="inline-flex items-center gap-1.5 rounded-md border border-neon bg-neon px-2.5 py-1.5 font-mono text-[8.5px] uppercase tracking-[0.12em] text-bg transition-opacity hover:opacity-90"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    Read Paper
                  </motion.a>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-border-bright bg-bg-alt px-2.5 py-1.5 font-mono text-[8.5px] uppercase tracking-[0.12em] text-dim">
                    <FileText className="h-3.5 w-3.5" />
                    PDF Soon
                  </span>
                )}

                {publication.links?.map((link) => {
                  const Icon = linkIcons[link.label];
                  return (
                    <motion.a
                      key={`${publication.id}-${link.label}`}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={reduceMotion ? undefined : { y: -1 }}
                      className="inline-flex items-center gap-1.5 rounded-md border border-border-bright bg-transparent px-2.5 py-1.5 font-mono text-[8.5px] uppercase tracking-[0.12em] text-text transition-colors duration-300 hover:border-cyan/35 hover:text-cyan"
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {link.label}
                    </motion.a>
                  );
                })}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
