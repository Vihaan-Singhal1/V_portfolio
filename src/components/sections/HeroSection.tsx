import { type ComponentType, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, ChevronDown, Github, Linkedin, Mail } from 'lucide-react';

import { accentHex, heroContent, socialLinks, type Accent, uiConfig } from '../../data/content';
import { useDeviceTier } from '../../hooks/useDeviceTier';
import { useTyping } from '../../hooks/useTyping';
import { motionTokens } from '../../lib/motion';
import { cn } from '../../lib/utils';
import { DevpostIcon } from '../shared/DevpostIcon';

type SocialIcon = 'linkedin' | 'github' | 'devpost' | 'mail';

type CtaButton = {
  label: string;
  href: string;
  accent: Accent;
  filled: boolean;
};

type SocialIconComponent = ComponentType<{ className?: string }>;

type AmbientAccent = {
  id: string;
  left: string;
  top: string;
  size: number;
  tint: string;
  travelY: number;
  duration: number;
};

const iconMap: Record<SocialIcon, SocialIconComponent> = {
  linkedin: Linkedin,
  github: Github,
  devpost: DevpostIcon,
  mail: Mail
};

const ambientAccents: AmbientAccent[] = [
  {
    id: 'ambient-neon',
    left: '74%',
    top: '24%',
    size: 230,
    tint: 'var(--neon)',
    travelY: -10,
    duration: 9.5
  },
  {
    id: 'ambient-cyan',
    left: '90%',
    top: '56%',
    size: 180,
    tint: 'var(--cyan)',
    travelY: -7,
    duration: 8.4
  }
];

function CtaButton({ button }: { button: CtaButton }) {
  const accent = accentHex[button.accent];

  return (
    <motion.a
      href={button.href}
      whileHover={{ y: motionTokens.hover.y }}
      transition={{ duration: 0.22, ease: motionTokens.easeOutExpo }}
      className={cn(
        'group inline-flex items-center gap-2 rounded-lg border px-6 py-3 font-mono text-xs uppercase tracking-[0.18em] transition-all duration-200',
        button.filled ? 'text-bg hover:brightness-105' : 'text-cyan hover:bg-cyan/8'
      )}
      style={{
        borderColor: accent,
        background: button.filled ? accent : 'transparent',
        color: button.filled ? 'var(--bg)' : accent
      }}
    >
      {button.label}
      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
    </motion.a>
  );
}

function ScrambleLine({ target }: { target: string }) {
  const [text, setText] = useState(target);

  useEffect(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let frame = 0;

    const interval = window.setInterval(() => {
      frame += 1;
      const progress = frame / 20;

      const next = target
        .split('')
        .map((char, index) => {
          if (char === ' ') return ' ';
          if (index < progress * target.length) return target[index];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      setText(next);

      if (progress >= 1) {
        window.clearInterval(interval);
        setText(target);
      }
    }, 42);

    return () => window.clearInterval(interval);
  }, [target]);

  return <div className="font-mono text-sm text-cyan/85 md:text-[15px]">{text}</div>;
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const typedRole = useTyping(heroContent.roles, 65, 2100);
  const { isMobile, isTablet, prefersReducedMotion } = useDeviceTier();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const heroLift = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : -18]);
  const credibilityStrip = heroContent.credibilityStrip?.length ? heroContent.credibilityStrip : heroContent.proofChips;

  const visibleAccents = useMemo(() => {
    if (isMobile || uiConfig.motionProfile === 'minimal') return [];
    return isTablet ? ambientAccents.slice(0, 1) : ambientAccents;
  }, [isMobile, isTablet]);

  return (
    <section ref={sectionRef} id="home" className="relative z-[2] flex min-h-screen items-center overflow-hidden pt-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-[16%] h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,rgba(0,255,170,0.08),transparent_68%)]" />
        <div className="absolute right-[-6%] top-[36%] h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(0,200,255,0.08),transparent_68%)]" />

        {!prefersReducedMotion &&
          visibleAccents.map((accent) => (
            <motion.span
              key={accent.id}
              className="absolute rounded-full blur-[60px]"
              style={{
                left: accent.left,
                top: accent.top,
                width: accent.size,
                height: accent.size,
                backgroundColor: accent.tint,
                opacity: 0.08
              }}
              animate={{ y: [0, accent.travelY, 0], opacity: [0.06, 0.1, 0.06] }}
              transition={{ duration: accent.duration, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
      </div>

      <motion.div style={{ y: heroLift }} className="relative mx-auto w-full max-w-[1200px] px-6 md:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.14,
                delayChildren: 0.18
              }
            }
          }}
          className="max-w-[850px]"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
              visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
            }}
            transition={{ duration: 0.58, ease: motionTokens.easeOutExpo }}
            className="mb-7 inline-flex items-center gap-2 rounded-md border border-neon/30 bg-neon/8 px-4 py-2"
          >
            <span className="h-2 w-2 rounded-full bg-neon shadow-[0_0_8px_rgba(0,255,170,0.55)]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.26em] text-neon">{heroContent.status}</span>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 28, filter: 'blur(9px)' },
              visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
            }}
            transition={{ duration: 0.62, ease: motionTokens.easeOutExpo }}
            className="mb-8"
          >
            <h1 className="font-display text-[clamp(3.5rem,9vw,6.875rem)] font-black leading-[0.88] tracking-[-0.06em] text-white">
              {heroContent.firstName}
            </h1>
            <h1 className="font-display text-[clamp(3.5rem,9vw,6.875rem)] font-black leading-[0.88] tracking-[-0.06em] text-transparent [text-stroke:2px_var(--neon)] [-webkit-text-stroke:2px_var(--neon)]">
              {heroContent.lastName}
            </h1>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20, filter: 'blur(7px)' },
              visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
            }}
            transition={{ duration: 0.54, ease: motionTokens.easeOutExpo }}
            className="mb-4 h-8 font-mono text-lg text-text"
          >
            {typedRole}
            <span className="ml-1 font-bold text-neon">▊</span>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20, filter: 'blur(7px)' },
              visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
            }}
            transition={{ duration: 0.54, ease: motionTokens.easeOutExpo }}
            className="mb-3"
          >
            <ScrambleLine target={heroContent.scrambleTarget} />
          </motion.div>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20, filter: 'blur(7px)' },
              visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
            }}
            transition={{ duration: 0.54, ease: motionTokens.easeOutExpo }}
            className="mb-6 max-w-[650px] text-[13px] leading-[1.82] text-text md:text-[14px]"
          >
            {heroContent.bio}
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.5, ease: motionTokens.easeOutExpo }}
            className="mb-6"
          >
            <p className="max-w-[700px] text-[13px] leading-[1.72] text-text md:text-[14px]">{heroContent.valueLine}</p>
            <div className="mt-3 inline-flex flex-wrap items-center gap-2.5 rounded-md border border-border-bright bg-bg-alt/80 px-2.5 py-2">
              {credibilityStrip.map((chip, index) => (
                <span key={chip} className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.13em] text-cyan">
                  {index > 0 ? <span className="h-[10px] w-px bg-border-bright" /> : null}
                  {chip}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.5, ease: motionTokens.easeOutExpo }}
            className="mb-9 flex flex-wrap items-center gap-4"
          >
            {heroContent.cta.map((button) => (
              <CtaButton key={button.label} button={button} />
            ))}
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.48, ease: motionTokens.easeOutExpo }}
            className="flex gap-3"
          >
            {socialLinks.map((item) => {
              const Icon = iconMap[item.icon];
              return (
                <motion.a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: motionTokens.hover.y }}
                  transition={{ duration: motionTokens.hover.duration, ease: motionTokens.easeOutExpo }}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border bg-card/75 text-dim transition-all duration-200 hover:border-cyan/45 hover:text-cyan"
                  aria-label={item.label}
                >
                  <Icon className="h-4 w-4" />
                </motion.a>
              );
            })}
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.a
        href="#education"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.86, duration: 0.45, ease: motionTokens.easeOutExpo }}
        className="absolute bottom-7 left-1/2 z-[3] flex -translate-x-1/2 flex-col items-center gap-2"
        aria-label="Scroll to next section"
      >
        <div className="relative flex h-12 w-7 items-start justify-center rounded-full border border-cyan/50 bg-bg-alt/80 p-1.5 backdrop-blur-sm">
          <motion.span
            animate={prefersReducedMotion ? { y: 0, opacity: 0.9 } : { y: [0, 16, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.8, repeat: prefersReducedMotion ? 0 : Infinity, ease: 'easeInOut' }}
            className="h-2 w-2 rounded-full bg-neon shadow-[0_0_8px_rgba(0,255,170,0.55)]"
          />
        </div>

        <motion.div
          animate={prefersReducedMotion ? { y: 0 } : { y: [0, 3, 0] }}
          transition={{ duration: 1.45, repeat: prefersReducedMotion ? 0 : Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center text-cyan"
        >
          <ChevronDown className="h-4 w-4" />
          <ChevronDown className="-mt-2 h-4 w-4 opacity-70" />
        </motion.div>
      </motion.a>
    </section>
  );
}
