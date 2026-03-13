import { motion } from 'motion/react';
import { MessageSquareCode } from 'lucide-react';

import type { EffectsTier } from '../../data/content';
import { cn } from '../../lib/utils';

type AssistantLauncherProps = {
  label: string;
  effectsTier: EffectsTier;
  hidden?: boolean;
  onOpen: () => void;
  onPrefetch?: () => void;
};

export function AssistantLauncher({
  label,
  effectsTier,
  hidden = false,
  onOpen,
  onPrefetch
}: AssistantLauncherProps) {
  if (hidden) return null;

  const pulseEnabled = effectsTier !== 'static';

  return (
    <motion.button
      type="button"
      aria-label={label}
      onMouseEnter={onPrefetch}
      onFocus={onPrefetch}
      onClick={onOpen}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'fixed bottom-5 right-5 z-[1250] inline-flex items-center gap-2.5 rounded-full border',
        'border-neon/45 bg-[linear-gradient(180deg,rgba(8,8,8,0.94),rgba(4,4,4,0.94))]',
        'px-3.5 py-2.5 text-neon shadow-[0_8px_22px_rgba(0,0,0,0.35)] backdrop-blur-md',
        'transition-all duration-300 hover:border-neon/70 hover:shadow-[0_0_22px_rgba(0,255,170,0.2)]'
      )}
    >
      <span className="relative inline-flex h-2.5 w-2.5 items-center justify-center">
        <span className="h-2.5 w-2.5 rounded-full bg-neon" />
        {pulseEnabled ? (
          <motion.span
            className="absolute inset-0 rounded-full bg-neon/45"
            animate={{ scale: [1, 1.9], opacity: [0.5, 0] }}
            transition={{ duration: 1.3, repeat: Infinity, ease: 'easeOut' }}
          />
        ) : null}
      </span>

      <MessageSquareCode className="h-4 w-4" />
      <span className="font-mono text-[10px] uppercase tracking-[0.18em]">{label}</span>
    </motion.button>
  );
}
