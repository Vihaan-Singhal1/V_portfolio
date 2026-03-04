import { type ComponentType, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';

import { accentHex, heroContent, socialLinks, type Accent } from '../../data/content';
import { useDeviceTier } from '../../hooks/useDeviceTier';
import { useTyping } from '../../hooks/useTyping';
import { cn } from '../../lib/utils';
import { DevpostIcon } from '../shared/DevpostIcon';
import { GlitchText } from '../shared/GlitchText';

type SocialIcon = 'linkedin' | 'github' | 'devpost' | 'mail';

type CtaButton = {
  label: string;
  href: string;
  accent: Accent;
  filled: boolean;
};

type SocialIconComponent = ComponentType<{ className?: string }>;

const iconMap: Record<SocialIcon, SocialIconComponent> = {
  linkedin: Linkedin,
  github: Github,
  devpost: DevpostIcon,
  mail: Mail
};

function MagneticButton({ button }: { button: CtaButton }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointerFine, setIsPointerFine] = useState(true);

  useEffect(() => {
    const media = window.matchMedia('(pointer: fine)');

    const handleChange = () => {
      setIsPointerFine(media.matches);
      if (!media.matches) {
        setPosition({ x: 0, y: 0 });
      }
    };

    handleChange();
    media.addEventListener('change', handleChange);

    return () => {
      media.removeEventListener('change', handleChange);
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isPointerFine || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (event.clientX - centerX) * 0.15;
    const deltaY = (event.clientY - centerY) * 0.15;
    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

  const accent = accentHex[button.accent];

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: isPointerFine ? position.x : 0, y: isPointerFine ? position.y : 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      <motion.a
        href={button.href}
        whileHover={{ scale: 1.03, y: -2 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={cn(
          'group inline-flex items-center gap-2 rounded-lg border px-6 py-3 font-mono text-xs uppercase tracking-[0.18em] transition-all duration-300',
          button.filled
            ? 'text-bg shadow-[0_0_0_rgba(0,0,0,0)] hover:shadow-neon'
            : 'text-cyan hover:bg-cyan/10'
        )}
        style={{
          borderColor: accent,
          background: button.filled ? accent : 'transparent',
          color: button.filled ? 'var(--bg)' : accent
        }}
      >
        {button.label}
        <ArrowRight
          className={cn(
            'h-4 w-4 transition-transform duration-300',
            button.filled ? 'group-hover:translate-x-1' : ''
          )}
        />
      </motion.a>
    </motion.div>
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

  return <div className="font-mono text-sm text-cyan/90 md:text-base">{text}</div>;
}

export function HeroSection() {
  const typedRole = useTyping(heroContent.roles, 65, 2100);
  const { isMobile, isTablet, prefersReducedMotion } = useDeviceTier();

  const floatingParticles = useMemo(
    () =>
      Array.from({ length: isMobile ? 0 : isTablet ? 4 : 10 }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 20 + Math.random() * 16,
        delay: Math.random() * 2,
        size: Math.random() > 0.5 ? 3 : 4,
        color: ['var(--neon)', 'var(--cyan)'][index % 2]
      })),
    [isMobile, isTablet]
  );

  return (
    <section id="home" className="relative z-[2] flex min-h-screen items-center overflow-hidden pt-20">
      <div className="pointer-events-none absolute inset-0">
        {!prefersReducedMotion &&
          floatingParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              opacity: 0.35
            }}
            animate={{
              y: [0, -24, 0],
              x: [0, 12, -10, 0],
              opacity: [0.15, 0.4, 0.2]
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
          ))}
      </div>

      <div className="relative mx-auto w-full max-w-[1200px] px-6 md:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.18,
                delayChildren: 0.2
              }
            }
          }}
          className="max-w-[850px]"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
              visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
            }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 inline-flex items-center gap-2 rounded-md border border-neon/30 bg-neon/10 px-4 py-2"
          >
            <span className="h-2 w-2 rounded-full bg-neon shadow-[0_0_10px_rgba(0,255,170,0.8)] animate-pulseSoft" />
            <span className="font-mono text-[11px] uppercase tracking-[0.26em] text-neon">
              {heroContent.status}
            </span>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
              visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
            }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <h1 className="font-display text-[clamp(3.5rem,9vw,6.875rem)] font-black leading-[0.88] tracking-[-0.06em] text-white">
              <GlitchText>{heroContent.firstName}</GlitchText>
            </h1>
            <h1 className="font-display text-[clamp(3.5rem,9vw,6.875rem)] font-black leading-[0.88] tracking-[-0.06em] text-transparent [text-stroke:2px_var(--neon)] [-webkit-text-stroke:2px_var(--neon)]">
              {heroContent.lastName}
            </h1>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
              visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
            }}
            transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
            className="mb-4 h-8 font-mono text-lg text-text"
          >
            {typedRole}
            <span className="ml-1 font-bold text-neon animate-pulseSoft">▊</span>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
              visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
            }}
            transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
            className="mb-3"
          >
            <ScrambleLine target={heroContent.scrambleTarget} />
          </motion.div>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
              visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
            }}
            transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 max-w-[650px] text-[13px] leading-[1.85] text-text md:text-[14px]"
          >
            {heroContent.bio}
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="mb-9 flex flex-wrap items-center gap-4"
          >
            {heroContent.cta.map((button) => (
              <MagneticButton key={button.label} button={button} />
            ))}
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 14 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
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
                  whileHover={{ y: -5, scale: 1.03 }}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border bg-card/75 text-dim transition-all duration-300 hover:border-cyan hover:text-cyan hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                  aria-label={item.label}
                >
                  <Icon className="h-4 w-4" />
                </motion.a>
              );
            })}
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.7 }}
        className="pointer-events-none absolute bottom-8 left-1/2 z-[3] -translate-x-1/2 animate-floaty"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-dim">scroll</span>
          <div className="h-10 w-px bg-gradient-to-b from-neon to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
