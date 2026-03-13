import { type ComponentType, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, ChevronDown, Github, Linkedin, Mail } from 'lucide-react';

import { accentHex, heroContent, socialLinks, type Accent, uiConfig } from '../../data/content';
import { useDeviceTier } from '../../hooks/useDeviceTier';
import { D_FAST, D_SLOW, EASE_OUT, useShouldReduceMotion } from '../../lib/motion';
import { cn } from '../../lib/utils';
import { HeroPortraitFeed } from '../home/HeroPortraitFeed';
import { DevpostIcon } from '../shared/DevpostIcon';

type SocialIcon = 'linkedin' | 'github' | 'devpost' | 'mail';

type CtaButton = {
  label: string;
  href: string;
  accent: Accent;
  filled: boolean;
};

type SocialIconComponent = ComponentType<{ className?: string }>;

type HeroSectionProps = {
  assistantEnabled?: boolean;
  assistantPortraitSrc?: string;
  onOpenAssistant?: () => void;
};

const iconMap: Record<SocialIcon, SocialIconComponent> = {
  linkedin: Linkedin,
  github: Github,
  devpost: DevpostIcon,
  mail: Mail
};

function CtaButton({ button, reducedMotion }: { button: CtaButton; reducedMotion: boolean }) {
  const accent = accentHex[button.accent];

  return (
    <motion.a
      href={button.href}
      whileHover={reducedMotion ? undefined : { y: -2 }}
      whileTap={reducedMotion ? undefined : { scale: 0.98 }}
      transition={{ duration: D_FAST, ease: EASE_OUT }}
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

export function HeroSection({
  assistantEnabled = false,
  assistantPortraitSrc = '/assets/chat/portrait.jpg',
  onOpenAssistant
}: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { isMobile } = useDeviceTier();
  const shouldReduceMotion = useShouldReduceMotion() || uiConfig.motionProfile === 'minimal';
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const heroLift = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : -18]);
  const credibilityStrip = heroContent.credibilityStrip?.length ? heroContent.credibilityStrip : heroContent.proofChips;
  const allowAmbientMotion = !shouldReduceMotion && !isMobile;
  const showPortraitFeed = assistantEnabled && typeof onOpenAssistant === 'function';

  const roles = heroContent.roles.length ? heroContent.roles : [heroContent.scrambleTarget];
  const [roleIndex, setRoleIndex] = useState(0);
  const [typedRole, setTypedRole] = useState(roles[0] ?? heroContent.scrambleTarget);
  const [isDeletingRole, setIsDeletingRole] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion) {
      setTypedRole(heroContent.scrambleTarget);
      return;
    }

    const current = roles[roleIndex % roles.length] ?? heroContent.scrambleTarget;
    let timer = 0;

    if (!isDeletingRole && typedRole.length < current.length) {
      timer = window.setTimeout(() => {
        setTypedRole(current.slice(0, typedRole.length + 1));
      }, 56);
    } else if (!isDeletingRole && typedRole.length === current.length) {
      timer = window.setTimeout(() => {
        setIsDeletingRole(true);
      }, 1250);
    } else if (isDeletingRole && typedRole.length > 0) {
      timer = window.setTimeout(() => {
        setTypedRole(current.slice(0, typedRole.length - 1));
      }, 30);
    } else {
      setIsDeletingRole(false);
      setRoleIndex((value) => (value + 1) % roles.length);
    }

    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [isDeletingRole, roleIndex, roles, shouldReduceMotion, typedRole]);

  return (
    <section ref={sectionRef} id="home" className="relative z-[2] flex min-h-screen items-center overflow-hidden pt-12 md:pt-14">
      <div className="pointer-events-none absolute inset-0">
        <div className={cn('absolute inset-0 opacity-[0.12]', allowAmbientMotion ? 'hero-gradient-drift' : '')} />
      </div>

      <motion.div style={{ y: heroLift }} className="relative mx-auto w-full max-w-[1320px] px-6 md:px-8">
        <div className="grid items-center gap-10 lg:justify-center lg:gap-16 lg:grid-cols-[minmax(0,620px)_338px] xl:gap-20 xl:grid-cols-[minmax(0,640px)_350px]">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: shouldReduceMotion ? 0 : 0.1,
                  delayChildren: 0.12
                }
              }
            }}
            className="mx-auto max-w-[620px] lg:mx-0 lg:pr-0"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 18, filter: shouldReduceMotion ? 'blur(0px)' : 'blur(6px)' },
                visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
              }}
              transition={{ duration: D_SLOW, ease: EASE_OUT }}
              className="mb-7 inline-flex items-center gap-2 rounded-md border border-neon/30 bg-neon/8 px-4 py-2"
            >
              <span className={cn('h-2 w-2 rounded-full bg-neon shadow-[0_0_8px_rgba(0,255,170,0.55)]', allowAmbientMotion ? 'status-dot-pulse' : '')} />
              <span className="font-mono text-[11px] uppercase tracking-[0.26em] text-neon">{heroContent.status}</span>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 18, filter: shouldReduceMotion ? 'blur(0px)' : 'blur(6px)' },
                visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
              }}
              transition={{ duration: D_SLOW, ease: EASE_OUT }}
              className="mb-8"
            >
              <h1 className="font-display text-[clamp(3.05rem,7.2vw,5.75rem)] font-black leading-[0.88] tracking-[-0.06em] text-white">
                {heroContent.firstName}
              </h1>
              <h1 className="font-display text-[clamp(3.05rem,7.2vw,5.75rem)] font-black leading-[0.88] tracking-[-0.06em] text-transparent [text-stroke:2px_var(--neon)] [-webkit-text-stroke:2px_var(--neon)]">
                {heroContent.lastName}
              </h1>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16, filter: shouldReduceMotion ? 'blur(0px)' : 'blur(6px)' },
                visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
              }}
              transition={{ duration: 0.68, ease: EASE_OUT }}
              className="mb-3"
            >
              <p className="font-mono text-sm text-cyan/85 md:text-[15px]">
                {shouldReduceMotion ? heroContent.scrambleTarget : typedRole}
                <span
                  aria-hidden="true"
                  className={cn(
                    'assistant-input-cursor ml-1 inline-block h-[1.03em] w-[2px] translate-y-[1px] bg-neon/75 align-middle',
                    shouldReduceMotion && 'assistant-input-cursor-static'
                  )}
                />
              </p>
            </motion.div>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16, filter: shouldReduceMotion ? 'blur(0px)' : 'blur(6px)' },
                visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
              }}
              transition={{ duration: 0.68, ease: EASE_OUT }}
              className="mb-6 max-w-[650px] text-[13px] leading-[1.82] text-text md:text-[14px]"
            >
              {heroContent.bio}
            </motion.p>

            <motion.div
              variants={{ hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.62, ease: EASE_OUT }}
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
              variants={{ hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
              className="mb-9 flex flex-wrap items-center gap-4"
            >
              {heroContent.cta.map((button) => (
                <CtaButton key={button.label} button={button} reducedMotion={shouldReduceMotion} />
              ))}
            </motion.div>

            {showPortraitFeed ? (
              <motion.button
                type="button"
                onClick={onOpenAssistant}
                whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                transition={{ duration: D_FAST, ease: EASE_OUT }}
                className="mb-5 inline-flex items-center gap-2 rounded-md border border-cyan/35 bg-cyan/10 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-cyan lg:hidden"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-neon" />
                Open /AI Assistant
              </motion.button>
            ) : null}

            <motion.div
              variants={{ hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 8 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.52, ease: EASE_OUT }}
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
                    whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.01 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                    transition={{ duration: D_FAST, ease: EASE_OUT }}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border bg-card/75 text-dim transition-all duration-200 hover:border-cyan/45 hover:text-cyan"
                    aria-label={item.label}
                  >
                    <Icon className="h-4 w-4" />
                  </motion.a>
                );
              })}
            </motion.div>
          </motion.div>

          {showPortraitFeed ? (
            <div className="hidden justify-center lg:flex">
              <HeroPortraitFeed
                onOpenAssistant={onOpenAssistant}
                portraitSrc={assistantPortraitSrc}
                reducedMotion={shouldReduceMotion}
              />
            </div>
          ) : null}
        </div>
      </motion.div>

      <motion.a
        href="#education"
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4, ease: EASE_OUT }}
        className="absolute bottom-7 left-1/2 z-[3] flex -translate-x-1/2 flex-col items-center gap-2"
        aria-label="Scroll to next section"
      >
        <div className="relative flex h-12 w-7 items-start justify-center rounded-full border border-cyan/50 bg-bg-alt/80 p-1.5 backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-neon shadow-[0_0_8px_rgba(0,255,170,0.55)]" />
        </div>

        <div className="flex flex-col items-center text-cyan">
          <ChevronDown className="h-4 w-4" />
          <ChevronDown className="-mt-2 h-4 w-4 opacity-70" />
        </div>
      </motion.a>
    </section>
  );
}
