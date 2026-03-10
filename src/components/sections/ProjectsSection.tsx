import { type MouseEvent, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight, ExternalLink, FileText, Github, Microscope, MoveUpRight, X } from 'lucide-react';

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
  GitHub: Github,
  Models: Microscope,
  Publication: FileText
};

function ProjectAction({ link, accent }: { link: ProjectLink; accent: string }) {
  const Icon = actionIcon[link.label];
  const isInternalAnchor = link.href.startsWith('#');

  const handleInternalFallback = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isInternalAnchor) return;

    const targetId = link.href.slice(1);
    if (!targetId || document.getElementById(targetId)) return;

    event.preventDefault();

    const fallback = document.getElementById('publications');
    if (fallback) {
      fallback.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', '#publications');
    }
  };

  if (link.label === 'Live Demo') {
    return (
      <motion.a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ y: -1 }}
        transition={{ duration: 0.2 }}
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
      onClick={handleInternalFallback}
      target={isInternalAnchor ? undefined : '_blank'}
      rel={isInternalAnchor ? undefined : 'noopener noreferrer'}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.2 }}
      className="inline-flex items-center gap-1.5 rounded-md border border-border-bright bg-transparent px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-text transition-colors duration-300 hover:border-cyan/30 hover:text-cyan"
    >
      <Icon className="h-3.5 w-3.5" />
      {link.label}
    </motion.a>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const shouldReduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const accent = accentHex[project.accent];
  const slides = project.gallery?.length ? project.gallery : [{ src: project.image, label: project.title }];
  const currentSlide = slides[slideIndex] ?? slides[0];
  const hasCarousel = slides.length > 1;

  const prevSlide = () => {
    setSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setSlideIndex((prev) => (prev + 1) % slides.length);
  };

  useEffect(() => {
    if (!isLightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('project-lightbox-open');

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsLightboxOpen(false);
      }

      if (hasCarousel && event.key === 'ArrowLeft') {
        setSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
      }

      if (hasCarousel && event.key === 'ArrowRight') {
        setSlideIndex((prev) => (prev + 1) % slides.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove('project-lightbox-open');
    };
  }, [hasCarousel, isLightboxOpen, slides.length]);

  return (
    <>
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
              {currentSlide?.src ? (
                <motion.button
                  type="button"
                  onClick={() => setIsLightboxOpen(true)}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.995 }}
                  className="absolute inset-0 z-[1] cursor-zoom-in focus-visible:outline-none"
                  aria-label={`Open ${project.title} image in full view`}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.img
                      key={currentSlide.src}
                      src={currentSlide.src}
                      alt={`${project.title} preview`}
                      loading="lazy"
                      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.016 }}
                      animate={{ opacity: 1, scale: hovered && !shouldReduceMotion ? 1.018 : 1 }}
                      exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.992 }}
                      transition={{ duration: shouldReduceMotion ? 0 : 0.24, ease: motionTokens.easeOutExpo }}
                      className="pointer-events-none absolute inset-0 h-full w-full bg-[#080808] object-contain p-1"
                    />
                  </AnimatePresence>
                </motion.button>
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

              <span className="absolute left-3 top-2.5 z-[2] rounded-sm border border-border-bright bg-black/45 px-1.5 py-1 font-mono text-[9px] uppercase tracking-[0.11em] text-white backdrop-blur-sm">
                {project.date}
              </span>

              {currentSlide?.label ? (
                <span className="absolute left-3 bottom-2.5 z-[2] rounded-sm border border-border-bright/70 bg-black/45 px-1.5 py-1 font-mono text-[8px] uppercase tracking-[0.11em] text-cyan backdrop-blur-sm">
                  {currentSlide.label}
                </span>
              ) : null}

              <span
                className="absolute right-3 top-2.5 z-[2] rounded-sm border px-1.5 py-1 font-mono text-[8px] uppercase tracking-[0.11em]"
                style={{
                  borderColor: `${statusPalette[project.status]}55`,
                  color: statusPalette[project.status],
                  backgroundColor: `${statusPalette[project.status]}30`
                }}
              >
                {project.status}
              </span>

              {hasCarousel ? (
                <div className="absolute bottom-2 right-3 z-[3] flex items-center gap-1">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.94 }}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      prevSlide();
                    }}
                    className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-border-bright/80 bg-black/55 text-white transition-colors hover:border-cyan/40 hover:text-cyan"
                    aria-label={`Previous ${project.title} image`}
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </motion.button>

                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.94 }}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      nextSlide();
                    }}
                    className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-border-bright/80 bg-black/55 text-white transition-colors hover:border-cyan/40 hover:text-cyan"
                    aria-label={`Next ${project.title} image`}
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </motion.button>
                </div>
              ) : null}

              {hasCarousel ? (
                <div className="absolute bottom-2 left-1/2 z-[2] flex -translate-x-1/2 items-center gap-1.5">
                  {slides.map((slide, dotIndex) => (
                    <motion.span
                      key={`${project.id}-${slide.src}`}
                      animate={
                        dotIndex === slideIndex
                          ? { opacity: 1, scale: 1.08 }
                          : { opacity: 0.55, scale: 1 }
                      }
                      transition={{ duration: 0.16 }}
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: dotIndex === slideIndex ? accent : 'rgba(229,231,235,0.4)' }}
                    />
                  ))}
                </div>
              ) : null}

              <div className={`absolute bottom-2 z-[2] ${hasCarousel ? 'right-[74px]' : 'right-3'}`}>
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
                <span className="mr-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-cyan">Scope {'->'}</span>
                {project.description}
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

      <AnimatePresence>
        {isLightboxOpen && currentSlide?.src ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[1200] bg-black/88 p-4 backdrop-blur-sm sm:p-6"
            onClick={() => setIsLightboxOpen(false)}
          >
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8, scale: 0.985 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.22, ease: motionTokens.easeOutExpo }}
              className="mx-auto flex h-full w-full max-w-[1240px] flex-col"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cyan">
                  {project.title}
                  {currentSlide.label ? ` / ${currentSlide.label}` : ''}
                </p>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsLightboxOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border-bright bg-bg-alt/80 text-text transition-colors hover:border-cyan/40 hover:text-cyan"
                  aria-label="Close image viewer"
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </div>

              <div className="relative flex flex-1 items-center justify-center" onClick={(event) => event.stopPropagation()}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.img
                    key={currentSlide.src}
                    src={currentSlide.src}
                    alt={`${project.title} full view`}
                    initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.012 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.988 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.22, ease: motionTokens.easeOutExpo }}
                    className="max-h-[84vh] w-auto max-w-full rounded-lg border border-border-bright bg-[#060606] object-contain p-1"
                  />
                </AnimatePresence>

                {hasCarousel ? (
                  <>
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      onClick={prevSlide}
                      className="absolute left-2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-bright bg-bg-alt/85 text-text transition-colors hover:border-cyan/40 hover:text-cyan sm:left-4"
                      aria-label={`Previous ${project.title} image`}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </motion.button>
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      onClick={nextSlide}
                      className="absolute right-2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-bright bg-bg-alt/85 text-text transition-colors hover:border-cyan/40 hover:text-cyan sm:right-4"
                      aria-label={`Next ${project.title} image`}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </motion.button>
                  </>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
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
