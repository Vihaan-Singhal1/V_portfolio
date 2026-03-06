import { useEffect, useState } from 'react';

import { useMouse } from '../../hooks/useMouse';

export function CursorGlow({ enabled = true }: { enabled?: boolean }) {
  const mouse = useMouse(15);
  const [pointerEnabled, setPointerEnabled] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(pointer: fine)');

    const handleChange = () => {
      setPointerEnabled(media.matches);
    };

    handleChange();
    media.addEventListener('change', handleChange);

    return () => media.removeEventListener('change', handleChange);
  }, []);

  if (!enabled || !pointerEnabled) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed z-[1] h-[400px] w-[400px] rounded-full transition-[transform] duration-150 ease-out will-change-transform"
      style={{
        transform: `translate3d(${mouse.x - 200}px, ${mouse.y - 200}px, 0)`,
        background:
          'radial-gradient(circle, rgba(0,255,170,0.09) 0%, rgba(0,255,170,0.05) 20%, rgba(0,255,170,0) 70%)'
      }}
    />
  );
}
