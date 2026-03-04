import { type CSSProperties, type ReactNode } from 'react';

type GlitchTextProps = {
  children: ReactNode;
  className?: string;
  cyan?: string;
  pink?: string;
  style?: CSSProperties;
};

export function GlitchText({
  children,
  className,
  cyan = 'var(--cyan)',
  pink = 'var(--pink)',
  style
}: GlitchTextProps) {
  return (
    <span className={className} style={{ position: 'relative', display: 'inline-block', ...style }}>
      <span>{children}</span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[3px] top-0 -z-10 animate-glitch1"
        style={{
          color: cyan,
          opacity: 0.55,
          clipPath: 'polygon(0 0, 100% 0, 100% 42%, 0 42%)'
        }}
      >
        {children}
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[-3px] top-0 -z-10 animate-glitch2"
        style={{
          color: pink,
          opacity: 0.45,
          clipPath: 'polygon(0 58%, 100% 58%, 100% 100%, 0 100%)'
        }}
      >
        {children}
      </span>
    </span>
  );
}
