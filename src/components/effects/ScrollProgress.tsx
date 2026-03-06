import { motion, useScroll, useTransform } from 'motion/react';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const progressX = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div className="pointer-events-none fixed left-0 right-0 top-0 z-[2000]">
      <div className="relative h-[2.5px] bg-border/70">
        <motion.div
          style={{ scaleX: scrollYProgress }}
          className="absolute inset-0 origin-left bg-gradient-to-r from-neon via-cyan/90 to-neon"
        />

        <motion.div
          style={{ left: progressX }}
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="relative h-4 w-4">
            <motion.span
              animate={{ scale: [0.85, 1.35, 0.85], opacity: [0.35, 0.82, 0.35] }}
              transition={{ duration: 1.35, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full bg-neon/55 blur-[5px]"
            />
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-[1px] rounded-full border border-cyan/70"
            />
            <span className="absolute inset-[4px] rounded-full bg-neon shadow-[0_0_10px_rgba(0,255,170,0.8)]" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
