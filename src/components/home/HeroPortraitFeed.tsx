import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

import { EmbeddedMatrixRain } from '../chat/EmbeddedMatrixRain';

type HeroPortraitFeedProps = {
  onOpenAssistant: () => void;
  portraitSrc: string;
  reducedMotion: boolean;
};

export function HeroPortraitFeed({ onOpenAssistant, portraitSrc, reducedMotion }: HeroPortraitFeedProps) {
  return (
    <motion.button
      type="button"
      onClick={onOpenAssistant}
      whileHover={reducedMotion ? undefined : { y: -3, scale: 1.006 }}
      whileTap={reducedMotion ? undefined : { scale: 0.992 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="group relative w-[338px] max-w-[27vw] overflow-hidden rounded-[20px] border border-white/14 bg-[linear-gradient(160deg,rgba(255,255,255,0.04),rgba(255,255,255,0.012))] p-2 text-left shadow-[0_12px_38px_rgba(0,0,0,0.4)] transition-all duration-300 hover:border-cyan/45 hover:shadow-[0_18px_52px_rgba(0,200,255,0.12)]"
      aria-label="Open ASK_VIHAAN assistant"
    >
      <span className="pointer-events-none absolute inset-[1px] rounded-[18px] border border-white/8" />

      <div className="relative z-[1]">
        <div className="mb-2 flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] tracking-[0.14em] text-cyan">vihaan@vs:~/assistant</p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-dim">Click to open assistant</p>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full border border-neon/35 bg-neon/8 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-neon">
            <span className="h-1.5 w-1.5 rounded-full bg-neon shadow-[0_0_10px_rgba(0,255,170,0.62)]" />
            ONLINE
          </span>
        </div>

        <div className="relative h-[468px] max-h-[52vh] overflow-hidden rounded-[15px] border border-white/12 bg-[#090f12]">
          <img
            src={portraitSrc}
            alt="Vihaan portrait feed"
            loading="lazy"
            className="h-full w-full object-cover object-[center_25%] brightness-[0.82] contrast-[1.06] saturate-[0.9]"
          />

          <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(125%_110%_at_50%_30%,rgba(255,255,255,0.02),rgba(0,0,0,0.18)_62%,rgba(0,0,0,0.28)_100%)]" />

          <EmbeddedMatrixRain
            src={portraitSrc}
            enabled={!reducedMotion}
            className="pointer-events-none absolute inset-0 z-[2] h-full w-full mix-blend-screen opacity-[0.24]"
          />

          <div className="portrait-feed-scanlines pointer-events-none absolute inset-0 z-[3]" />
          <div className="portrait-feed-noise pointer-events-none absolute inset-0 z-[4]" />

          <div
            className="portrait-feed-sweep pointer-events-none absolute inset-y-0 left-[-38%] z-[5] w-[38%] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            aria-hidden="true"
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[6] bg-gradient-to-t from-black/80 via-black/24 to-transparent p-2.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan/35 bg-black/55 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-cyan">
              OPEN /AI
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
