import { useEffect, useRef, useState } from 'react';

type MousePosition = { x: number; y: number };

export function useMouse(delay = 0) {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });
  const targetRef = useRef<MousePosition>({ x: 0, y: 0 });
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      targetRef.current = { x: event.clientX, y: event.clientY };

      if (!delay) {
        setPosition(targetRef.current);
      }
    };

    window.addEventListener('mousemove', handleMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMove);
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [delay]);

  useEffect(() => {
    if (!delay) return;

    const smoothing = Math.min(0.28, Math.max(0.08, 1 / (delay * 10)));

    const tick = () => {
      setPosition((prev) => {
        const dx = targetRef.current.x - prev.x;
        const dy = targetRef.current.y - prev.y;

        return {
          x: prev.x + dx * smoothing,
          y: prev.y + dy * smoothing
        };
      });

      frameRef.current = window.requestAnimationFrame(tick);
    };

    frameRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [delay]);

  return position;
}
