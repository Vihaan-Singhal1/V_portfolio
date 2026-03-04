import { CSSProperties, useMemo } from 'react';

import { cn } from '../../lib/utils';

type MarqueeProps = {
  items: string[];
  speed?: number;
  reverse?: boolean;
  color: string;
  className?: string;
};

export function Marquee({ items, speed = 35, reverse = false, color, className }: MarqueeProps) {
  const text = useMemo(() => {
    return items.join('  ///  ');
  }, [items]);

  const styles = {
    '--marquee-color': color,
    '--marquee-duration': `${speed}s`
  } as CSSProperties;

  return (
    <div
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
          style={{ animationDuration: `var(--marquee-duration)` }}
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
