import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ExternalLink, Menu, X } from 'lucide-react';

import { navigationLinks } from '../../data/content';
import { motionTokens } from '../../lib/motion';
import { cn } from '../../lib/utils';

const desktopUtilities = [
  { label: 'Resume', href: '/assets/resume/vihaan_resume_v1.pdf' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/vihaan-singhal-21baa6379' }
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>(navigationLinks[0]?.id ?? 'home');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener('resize', close);
    return () => window.removeEventListener('resize', close);
  }, []);

  useEffect(() => {
    const sectionIds = navigationLinks.map((link) => link.id);
    const ratios = new Map<string, number>();
    const observedNodes = new Set<Element>();
    let rafId: number | null = null;

    const pickActiveSection = () => {
      let nextActiveId = sectionIds[0] ?? 'home';
      let highestRatio = 0;

      sectionIds.forEach((id) => {
        const ratio = ratios.get(id) ?? 0;
        if (ratio > highestRatio) {
          highestRatio = ratio;
          nextActiveId = id;
        }
      });

      if (highestRatio <= 0.01) {
        let bestDistance = Number.POSITIVE_INFINITY;
        sectionIds.forEach((id) => {
          const node = document.getElementById(id);
          if (!node) return;
          const distance = Math.abs(node.getBoundingClientRect().top - 146);
          if (distance < bestDistance) {
            bestDistance = distance;
            nextActiveId = id;
          }
        });
      }

      setActiveId((current) => (current === nextActiveId ? current : nextActiveId));
      rafId = null;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set((entry.target as HTMLElement).id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        if (rafId === null) {
          rafId = window.requestAnimationFrame(pickActiveSection);
        }
      },
      {
        rootMargin: '-20% 0px -55% 0px',
        threshold: [0, 0.15, 0.35, 0.6, 1]
      }
    );

    const bindSections = () => {
      sectionIds.forEach((id) => {
        const node = document.getElementById(id);
        if (!node || observedNodes.has(node)) return;
        observer.observe(node);
        observedNodes.add(node);
      });
    };

    bindSections();

    const mutation = new MutationObserver(bindSections);
    mutation.observe(document.body, { childList: true, subtree: true });

    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (sectionIds.includes(hash)) {
        setActiveId(hash);
      }
    };

    window.addEventListener('hashchange', onHashChange);

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      observer.disconnect();
      mutation.disconnect();
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  const desktopLinks = useMemo(
    () =>
      navigationLinks.map((link) => {
        const isActive = activeId === link.id;

        return (
          <a
            key={link.id}
            href={`#${link.id}`}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => {
              setActiveId(link.id);
            }}
            className={cn(
              'group relative rounded-md border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-all duration-200',
              isActive
                ? 'border-neon/45 bg-neon/12 text-neon shadow-[0_0_14px_rgba(0,255,170,0.1)]'
                : 'border-transparent text-dim hover:border-border-bright hover:text-text'
            )}
          >
            {link.label}
            {isActive ? (
              <motion.span
                layoutId="nav-active-indicator"
                className="absolute inset-x-2 -bottom-[1px] h-[1px] rounded-full bg-neon"
                transition={{ duration: motionTokens.nav.duration, ease: motionTokens.easeOutExpo }}
              />
            ) : null}
          </a>
        );
      }),
    [activeId]
  );

  return (
    <nav data-app-navbar="true" className="fixed left-0 right-0 top-0 z-[1000] transition-[transform,opacity] duration-300 ease-out">
      <div className="mx-auto w-full max-w-[1240px] px-4 pt-3 md:px-6">
        <div
          className={cn(
            'rounded-xl border transition-all duration-300',
            scrolled
              ? 'border-border-bright bg-[rgba(4,4,4,0.9)] shadow-[0_10px_30px_rgba(0,0,0,0.42)] backdrop-blur-xl'
              : 'border-border-bright/70 bg-[rgba(3,3,3,0.64)] backdrop-blur-md'
          )}
        >
          <div
            className={cn(
              'mx-auto flex w-full items-center justify-between gap-4 px-4 transition-all duration-300 md:px-5',
              scrolled ? 'py-2' : 'py-3'
            )}
          >
            <a
              href="#home"
              onClick={() => setActiveId('home')}
              className={cn(
                'rounded-lg border border-neon/75 bg-[rgba(0,255,170,0.06)] font-display font-extrabold tracking-wide text-neon transition-all duration-200',
                scrolled ? 'px-3 py-1.5 text-[0.98rem]' : 'px-3.5 py-1.5 text-lg md:text-[1.12rem]'
              )}
            >
              VS<span className="text-dim">.</span>dev
            </a>

            <div className="hidden items-center gap-2.5 md:flex">{desktopLinks}</div>

            <div className="hidden items-center gap-2 lg:flex">
              {desktopUtilities.map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  target={action.href.startsWith('#') ? undefined : '_blank'}
                  rel={action.href.startsWith('#') ? undefined : 'noopener noreferrer'}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border-bright bg-bg-alt/92 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-dim transition-all duration-200 hover:border-cyan/45 hover:text-cyan hover:shadow-[0_0_14px_rgba(0,200,255,0.16)]"
                >
                  {action.label}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ))}
            </div>

            <button
              type="button"
              aria-label="Toggle navigation"
              onClick={() => setOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border-bright bg-bg-alt/80 text-dim transition-colors hover:border-neon/40 hover:text-neon md:hidden"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          <AnimatePresence>
            {open ? (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: motionTokens.nav.duration, ease: motionTokens.easeOutExpo }}
                className="border-t border-border-bright bg-bg-alt/95 px-4 pb-4 pt-3 backdrop-blur-xl md:hidden"
              >
                <div className="flex flex-col gap-2">
                  {navigationLinks.map((link) => {
                    const isActive = activeId === link.id;
                    return (
                      <a
                        key={link.id}
                        href={`#${link.id}`}
                        onClick={() => {
                          setOpen(false);
                          setActiveId(link.id);
                        }}
                        className={cn(
                          'rounded-md px-3 py-3 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors',
                          isActive
                            ? 'border border-neon/35 bg-neon/10 text-neon'
                            : 'border border-transparent text-text hover:border-border-bright hover:text-neon'
                        )}
                      >
                        {link.label}
                      </a>
                    );
                  })}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
