import { useEffect, useRef } from 'react';
import type { EffectsTier } from '../../data/content';

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
};

const COLORS = ['0,255,170', '0,200,255'];

function getParticleCount(width: number, reducedMotion: boolean, tier: EffectsTier) {
  if (tier === 'static') return 0;
  if (reducedMotion || tier === 'reduced') return width < 768 ? 10 : 14;
  if (width < 768) return 18;
  if (width < 1100) return 28;
  return 44;
}

export function ParticleField({ tier = 'full' }: { tier?: EffectsTier }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (tier === 'static') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let particleCount = getParticleCount(window.innerWidth, reducedMotion, tier);
    let linesEnabled = window.innerWidth >= 1100 && !reducedMotion && tier === 'full';
    let frameInterval = tier === 'reduced' ? 36 : window.innerWidth < 1100 ? 30 : 16;

    const createParticles = (count: number): Particle[] =>
      Array.from({ length: count }, (_, index) => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        size: Math.random() * 1.2 + 0.45,
        color: COLORS[index % COLORS.length],
        opacity: Math.random() * 0.24 + 0.08
      }));

    let particles = createParticles(particleCount);

    let frame = 0;
    let lastTime = 0;

    const mouse = {
      x: -1000,
      y: -1000,
      active: false
    };

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const nextCount = getParticleCount(width, reducedMotion, tier);
      if (nextCount !== particleCount) {
        particleCount = nextCount;
        particles = createParticles(nextCount);
      }

      linesEnabled = width >= 1100 && !reducedMotion && tier === 'full';
      frameInterval = tier === 'reduced' ? 36 : width < 1100 ? 30 : 16;
    };

    const onMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      mouse.active = true;
    };

    const onLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    resize();

    const draw = (time: number) => {
      if (time - lastTime < frameInterval) {
        frame = window.requestAnimationFrame(draw);
        return;
      }
      lastTime = time;

      const width = window.innerWidth;
      const height = window.innerHeight;

      context.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i];

        if (mouse.active && linesEnabled) {
          const dx = particle.x - mouse.x;
          const dy = particle.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance > 0 && distance < 100) {
            const force = ((100 - distance) / 100) * 0.55;
            particle.vx += (dx / distance) * force * 0.18;
            particle.vy += (dy / distance) * force * 0.18;
          }
        }

        particle.vx *= 0.992;
        particle.vy *= 0.992;
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < -10) particle.x = width + 10;
        if (particle.x > width + 10) particle.x = -10;
        if (particle.y < -10) particle.y = height + 10;
        if (particle.y > height + 10) particle.y = -10;

        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fillStyle = `rgba(${particle.color}, ${particle.opacity})`;
        context.fill();
      }

      if (linesEnabled) {
        for (let i = 0; i < particles.length; i += 1) {
          for (let j = i + 1; j < particles.length; j += 1) {
            const a = particles[i];
            const b = particles[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 72) {
              const alpha = (1 - distance / 72) * 0.03;
              context.beginPath();
              context.moveTo(a.x, a.y);
              context.lineTo(b.x, b.y);
              context.lineWidth = 0.25;
              context.strokeStyle = `rgba(0, 255, 170, ${alpha})`;
              context.stroke();
            }
          }
        }
      }

      frame = window.requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseout', onLeave);

    frame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseout', onLeave);
    };
  }, [tier]);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" aria-hidden="true" />;
}
