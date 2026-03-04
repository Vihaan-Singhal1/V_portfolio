import { Code2 } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const progressX = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div className="pointer-events-none fixed left-0 right-0 top-0 z-[2000]">
      <div className="relative h-[2px] bg-border/65">
        <motion.div
          style={{ scaleX: scrollYProgress }}
          className="absolute inset-0 origin-left bg-gradient-to-r from-neon to-cyan"
        />

        <motion.div
          style={{ left: progressX }}
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{ y: [-1, 1, -1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="inline-flex items-center gap-1 rounded-md border border-neon/60 bg-bg-alt/95 px-1.5 py-0.5 shadow-[0_0_8px_rgba(0,255,170,0.2)]">
            <Code2 className="h-2.5 w-2.5 text-neon" />
            <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-cyan">code</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
