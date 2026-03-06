import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';

import { cn } from '../../lib/utils';

type MarqueeProps = {
  items: string[];
  speed?: number;
  reverse?: boolean;
  color: string;
  className?: string;
  pauseWhenOffscreen?: boolean;
};

export function Marquee({
  items,
  speed = 35,
  reverse = false,
  color,
  className,
  pauseWhenOffscreen = true
}: MarqueeProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  const text = useMemo(() => {
    return items.join('  ///  ');
  }, [items]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReducedMotion(media.matches);
    onChange();
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!pauseWhenOffscreen || reducedMotion) return;
    const node = rootRef.current;
    if (!node || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsVisible(entry?.isIntersecting ?? true);
      },
      { rootMargin: '80px 0px', threshold: 0.01 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [pauseWhenOffscreen, reducedMotion]);

  const styles = {
    '--marquee-color': color,
    '--marquee-duration': `${speed}s`
  } as CSSProperties;

  return (
    <div
      ref={rootRef}
      className={cn(
        'relative z-[2] overflow-hidden whitespace-nowrap border-y py-2.5',
        'border-[color:color-mix(in_srgb,var(--marquee-color)_28%,transparent)]',
        'bg-[color:color-mix(in_srgb,var(--marquee-color)_6%,transparent)]',
        className
      )}
      style={{
        ...styles,
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
        maskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)'
      }}
    >
      <div className="flex w-max">
        <div
          className={cn(
            'flex w-max items-center',
            reverse ? 'animate-marqueeR' : 'animate-marquee'
          )}
          style={{
            animationDuration: `var(--marquee-duration)`,
            animationPlayState: reducedMotion || (pauseWhenOffscreen && !isVisible) ? 'paused' : 'running'
          }}
        >
          <span className="px-8 font-mono text-[12px] font-bold uppercase tracking-[0.28em] text-[var(--marquee-color)]">
            {text}
          </span>
          <span className="px-8 font-mono text-[12px] font-bold uppercase tracking-[0.28em] text-[var(--marquee-color)]">
            {text}
          </span>
        </div>
      </div>
    </div>
  );
}
