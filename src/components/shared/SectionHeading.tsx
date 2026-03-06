import { motion } from 'motion/react';

import { accentHex, type Accent } from '../../data/content';
import { motionTokens } from '../../lib/motion';
import { cn } from '../../lib/utils';

type SectionHeadingProps = {
  tag: string;
  title: string;
  accent: Accent;
  className?: string;
  tagClassName?: string;
  titleClassName?: string;
};

export function SectionHeading({
  tag,
  title,
  accent,
  className,
  tagClassName,
  titleClassName
}: SectionHeadingProps) {
  const words = title.split(' ');
  const lastIndex = words.length - 1;

  return (
    <div className={className}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.45 }}
        transition={{ duration: motionTokens.section.duration, ease: motionTokens.easeOutExpo }}
        className={cn('mb-2.5 font-mono text-[11px] uppercase tracking-[0.3em]', tagClassName)}
        style={{ color: accentHex[accent] }}
      >
        {'>'} {tag}
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, amount: 0.45 }}
        transition={{ duration: motionTokens.section.duration + 0.08, ease: motionTokens.easeOutExpo }}
        className={cn(
          'font-display text-[clamp(1.55rem,3.5vw,2.35rem)] font-extrabold leading-[1] tracking-[-0.03em] text-white',
          titleClassName
        )}
      >
        {words.map((word, index) => (
          <span key={word} style={{ color: index === lastIndex ? accentHex[accent] : 'var(--white)' }}>
            {index === 0 ? word : ` ${word}`}
          </span>
        ))}
      </motion.h2>
    </div>
  );
}
