import { type CSSProperties, useEffect, useRef, useState } from 'react';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

export function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(0,255,170,0.05)'
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const lastPosRef = useRef({ x: 0, y: 0 });

  const [isHovered, setIsHovered] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);

  useEffect(() => {
    const pointerMedia = window.matchMedia('(pointer: fine)');
    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');

    const update = () => {
      const compact = window.innerWidth < 1100;
      const enabled = pointerMedia.matches && !motionMedia.matches && !compact;
      setIsInteractive(enabled);

      if (!enabled) {
        setIsHovered(false);
      }
    };

    update();

    window.addEventListener('resize', update);
    pointerMedia.addEventListener('change', update);
    motionMedia.addEventListener('change', update);

    return () => {
      window.removeEventListener('resize', update);
      pointerMedia.removeEventListener('change', update);
      motionMedia.removeEventListener('change', update);

      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const commitPosition = () => {
    frameRef.current = null;

    if (!cardRef.current) return;

    cardRef.current.style.setProperty('--spotlight-x', `${lastPosRef.current.x}px`);
    cardRef.current.style.setProperty('--spotlight-y', `${lastPosRef.current.y}px`);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isInteractive || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    lastPosRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };

    if (!frameRef.current) {
      frameRef.current = window.requestAnimationFrame(commitPosition);
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => isInteractive && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden ${className}`}
      style={{
        '--spotlight-x': '0px',
        '--spotlight-y': '0px'
      } as CSSProperties}
    >
      <div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(260px circle at var(--spotlight-x) var(--spotlight-y), ${spotlightColor}, transparent 74%)`
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          boxShadow: 'inset 0 0 0 1px rgba(0,255,170,0.08)'
        }}
      />
      {children}
    </div>
  );
}
