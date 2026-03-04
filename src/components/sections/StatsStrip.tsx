import { motion, useInView } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { accentHex, stats } from '../../data/content';

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 1600;
    const startTime = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [isInView, target]);

  return (
    <span ref={ref} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {count}
      {suffix}
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
              whileHover={{ y: -4 }}
              className="relative overflow-hidden rounded-xl border border-border-bright bg-card/95 px-6 py-5 shadow-card transition-all duration-300 hover:border-neon/30 hover:shadow-[0_0_25px_rgba(0,255,170,0.08)]"
            >
              <div className="relative">
                <div
                  className="font-display text-[3.6rem] font-black leading-none tracking-[-0.06em]"
                  style={{ color: accentHex[stat.accent] }}
                >
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
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
