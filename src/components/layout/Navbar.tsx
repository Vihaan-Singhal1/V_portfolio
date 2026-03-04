import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';

import { navigationLinks } from '../../data/content';
import { cn } from '../../lib/utils';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener('resize', close);
    return () => window.removeEventListener('resize', close);
  }, []);

  const desktopLinks = useMemo(
    () =>
      navigationLinks.map((link) => (
        <a
          key={link.id}
          href={`#${link.id}`}
          className="group relative font-mono text-[11px] uppercase tracking-[0.2em] text-dim transition-colors duration-300 hover:text-neon"
        >
          {link.label}
          <span className="absolute -bottom-1 left-0 h-px w-0 bg-neon transition-all duration-300 group-hover:w-full" />
        </a>
      )),
    []
  );

  return (
    <nav
      className={cn(
        'fixed left-0 right-0 top-0 z-[1000] border-b transition-all duration-300',
        scrolled
          ? 'border-border-bright bg-[rgba(3,3,3,0.93)] backdrop-blur-2xl'
          : 'border-transparent bg-transparent'
      )}
    >
      <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between px-6 py-4 md:px-8">
        <a
          href="#home"
          className="rounded-md border border-neon px-3.5 py-1.5 font-display text-lg font-extrabold tracking-wide text-neon md:text-[1.15rem]"
        >
          VS<span className="text-dim">.</span>dev
        </a>

        <div className="hidden items-center gap-7 md:flex">{desktopLinks}</div>

        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-dim transition-colors hover:border-neon/40 hover:text-neon md:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-border bg-bg-alt/95 px-6 py-5 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-4">
              {navigationLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => setOpen(false)}
                  className="font-mono text-xs uppercase tracking-[0.25em] text-text transition-colors hover:text-neon"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </nav>
  );
}
