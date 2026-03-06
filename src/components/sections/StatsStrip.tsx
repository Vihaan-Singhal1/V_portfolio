import { motion, useInView } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { accentHex, stats } from '../../data/content';

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const [displayValue, setDisplayValue] = useState(0);
  const lastValueRef = useRef(0);

  useEffect(() => {
    if (!isInView) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplayValue(target);
      lastValueRef.current = target;
      return;
    }

    const duration = 1900;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const settleOscillation =
        progress > 0.55 ? Math.sin((progress - 0.55) * 18) * (1 - progress) * 0.08 : 0;
      const next = Math.min(target, Math.max(0, target * (eased + settleOscillation)));

      if (Math.abs(next - lastValueRef.current) >= 0.01 || progress === 1) {
        lastValueRef.current = next;
        setDisplayValue(next);
      }

      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      } else {
        setDisplayValue(target);
      }
    };

    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [isInView, target]);

  const lower = Math.floor(displayValue);
  const upper = Math.min(target, lower + 1);
  const progressToNext = Math.max(0, Math.min(1, displayValue - lower));

  return (
    <span ref={ref} className="inline-flex items-end" style={{ fontVariantNumeric: 'tabular-nums' }}>
      <span className="relative inline-flex h-[0.94em] min-w-[1.05em] items-end justify-start overflow-hidden">
        <span
          className="absolute left-0 top-0 will-change-transform"
          style={{
            transform: `translateY(${progressToNext * 0.62}em)`,
            opacity: 1 - progressToNext,
            filter: `blur(${progressToNext * 0.65}px)`
          }}
        >
          {lower}
        </span>
        <span
          className="absolute left-0 top-0 will-change-transform"
          style={{
            transform: `translateY(${(progressToNext - 1) * 0.62}em)`,
            opacity: progressToNext,
            filter: `blur(${(1 - progressToNext) * 0.55}px)`
          }}
        >
          {upper}
        </span>
      </span>
      {suffix ? <span className="ml-[0.04em]">{suffix}</span> : null}
    </span>
  );
}

export function StatsStrip() {
  return (
    <section className="relative z-[2] border-y border-border-bright/70 py-12">
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.article
              key={stat.label}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -2, scale: 1.008 }}
              className="relative overflow-hidden rounded-xl border border-border-bright bg-card/95 px-6 py-5 shadow-card transition-all duration-300 hover:border-neon/30 hover:shadow-[0_0_25px_rgba(0,255,170,0.08)]"
            >
              <div className="relative">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.7 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="font-display text-[3.6rem] font-black leading-none tracking-[-0.06em]"
                  style={{ color: accentHex[stat.accent] }}
                >
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </motion.div>
                <p className="mt-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-dim">
                  {stat.label}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
