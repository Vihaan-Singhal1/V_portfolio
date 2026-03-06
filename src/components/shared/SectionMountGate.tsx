import { type ReactNode, useEffect, useRef, useState } from 'react';

type SectionMountGateProps = {
  id?: string;
  children: ReactNode;
  rootMargin?: string;
  minHeight?: number;
  className?: string;
  eager?: boolean;
};

export function SectionMountGate({
  id,
  children,
  rootMargin = '340px 0px',
  minHeight = 140,
  className,
  eager = false
}: SectionMountGateProps) {
  const gateRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(eager);

  useEffect(() => {
    if (mounted) return;

    const node = gateRef.current;
    if (!node) return;

    if (!('IntersectionObserver' in window)) {
      setMounted(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [mounted, rootMargin]);

  return (
    <div id={id} ref={gateRef} className={className}>
      {mounted ? children : <div style={{ minHeight }} aria-hidden="true" />}
    </div>
  );
}
