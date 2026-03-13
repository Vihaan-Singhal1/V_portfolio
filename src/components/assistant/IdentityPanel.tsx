import { motion } from 'motion/react';

import { cn } from '../../lib/utils';
import type { AssistantAction, AssistantCommandDefinition, AssistantStatus } from './types';

type IdentityPanelProps = {
  portraitSrc: string;
  status: AssistantStatus;
  reducedMotion: boolean;
  commands: AssistantCommandDefinition[];
  portraitPulse: number;
  onRunCommand: (command: string) => void;
  onAction: (action: AssistantAction) => void;
  resumeHref: string;
};

export function IdentityPanel({
  portraitSrc,
  status,
  reducedMotion,
  commands,
  portraitPulse,
  onRunCommand,
  onAction,
  resumeHref
}: IdentityPanelProps) {
  return (
    <aside className="flex min-h-0 flex-col gap-3 border-r border-white/10 p-5">
      <div className="rounded-xl border border-white/10 bg-black/30 p-3">
        <p className="font-mono text-[10px] tracking-[0.14em] text-cyan">vihaan@vs:~/assistant</p>

        <motion.div
          key={portraitPulse}
          className="assistant-portrait-frame relative mt-3 overflow-hidden rounded-lg border border-cyan/28 bg-black/45"
          initial={reducedMotion ? { opacity: 1 } : { boxShadow: '0 0 0 rgba(0,255,170,0)' }}
          animate={
            reducedMotion
              ? { opacity: 1 }
              : {
                  boxShadow: [
                    '0 0 0 rgba(0,255,170,0)',
                    '0 0 26px rgba(0,255,170,0.34)',
                    '0 0 0 rgba(0,255,170,0)'
                  ]
                }
          }
          transition={{ duration: reducedMotion ? 0.01 : 0.25, ease: 'easeOut' }}
        >
          <img
            src={portraitSrc}
            alt="Vihaan portrait"
            loading="lazy"
            className="h-[198px] w-full object-cover object-[center_20%] opacity-[0.95] [filter:saturate(0.9)_contrast(1.06)] sm:h-[246px] md:h-[302px]"
          />
          <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.03),transparent_45%)]" />
          <span className={cn('assistant-portrait-scan pointer-events-none absolute inset-0', reducedMotion && 'assistant-portrait-scan-static')} />
          <span className="assistant-portrait-noise pointer-events-none absolute inset-0" />
        </motion.div>

        <p className="mt-2.5 font-mono text-[9px] uppercase tracking-[0.14em] text-dim">status: <span className={cn(status === 'THINKING' ? 'text-cyan' : status === 'SPEAKING' ? 'text-neon' : 'text-text')}>{status}</span></p>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/28 p-3">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-dim">commands</p>
        <ul className="mt-2 grid grid-cols-2 gap-1.5 lg:grid-cols-1">
          {commands.map((command) => (
            <li key={command.id}>
              <button
                type="button"
                onClick={() => onRunCommand(command.command)}
                className="w-full rounded-md border border-white/10 bg-white/[0.02] px-2.5 py-1.5 text-left font-mono text-[10px] uppercase tracking-[0.12em] text-text transition-colors hover:border-neon/45 hover:text-neon"
              >
                {command.command}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-black/28 p-3 lg:grid-cols-1">
        <button
          type="button"
          onClick={() => onAction({ type: 'open-section', label: 'OPEN PROJECTS', target: 'projects' })}
          className="rounded-md border border-cyan/35 bg-cyan/10 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-cyan transition-colors hover:border-cyan/55"
        >
          OPEN PROJECTS
        </button>
        <button
          type="button"
          onClick={() => onAction({ type: 'open-link', label: 'OPEN RESUME', target: resumeHref })}
          className="rounded-md border border-neon/35 bg-neon/10 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-neon transition-colors hover:border-neon/55"
        >
          OPEN RESUME
        </button>
        <button
          type="button"
          onClick={() => onAction({ type: 'open-section', label: 'OPEN CONTACT', target: 'contact' })}
          className="col-span-2 rounded-md border border-white/15 bg-white/[0.03] px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-text transition-colors hover:border-white/30 lg:col-span-1"
        >
          OPEN CONTACT
        </button>
      </div>
    </aside>
  );
}
