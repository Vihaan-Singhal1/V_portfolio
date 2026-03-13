import { motion } from 'motion/react';

import { cn } from '../../lib/utils';
import type { AssistantAction, AssistantMessage } from './types';

type ChatStreamProps = {
  messages: AssistantMessage[];
  isThinking: boolean;
  reducedMotion: boolean;
  onAction: (action: AssistantAction) => void;
};

function StreamCard({
  message,
  reducedMotion,
  onAction
}: {
  message: AssistantMessage;
  reducedMotion: boolean;
  onAction: (action: AssistantAction) => void;
}) {
  const isUser = message.role === 'user';

  return (
    <motion.article
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0.08 : 0.22 }}
      className={cn(
        'relative overflow-hidden rounded-xl border bg-black/25 px-2.5 py-2 sm:px-3 sm:py-2.5',
        isUser ? 'border-neon/30' : 'border-white/10'
      )}
    >
      <span
        className={cn(
          'pointer-events-none absolute inset-y-0 left-0 w-[2px]',
          isUser ? 'bg-neon/85' : 'bg-cyan/75'
        )}
      />

      <p className="mb-1.5 pl-1 font-mono text-[9px] uppercase tracking-[0.16em] text-dim">
        {isUser ? 'YOU' : 'ASK_VIHAAN'}
      </p>
      <p className="whitespace-pre-wrap pl-1 text-[12.5px] leading-[1.68] sm:text-[13px] sm:leading-[1.7] text-text">{message.content}</p>

      {message.cards?.length ? (
        <div className="mt-3 grid gap-2">
          {message.cards.map((card) => (
            <div key={card.id} className="rounded-lg border border-white/10 bg-black/30 p-2 sm:p-2.5">
              <p className="font-display text-[13.5px] font-bold sm:text-[14px] text-white">{card.title}</p>
              <p className="mt-1 text-[12px] leading-[1.55] sm:text-[12.5px] sm:leading-[1.6] text-text">{card.outcome}</p>
              <div className="mt-2 pl-0.5 flex flex-wrap gap-1.5">
                {card.stack.map((item) => (
                  <span
                    key={`${card.id}-${item}`}
                    className="rounded-sm border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-dim"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-2.5 pl-0.5 flex flex-wrap gap-1.5">
                {card.links.map((link) => {
                  if (link.href.startsWith('#')) {
                    return (
                      <button
                        key={`${card.id}-${link.label}`}
                        type="button"
                        onClick={() => onAction({ type: 'open-link', label: link.label, target: link.href })}
                        className="inline-flex rounded-md border border-cyan/35 bg-cyan/10 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-cyan transition-colors hover:border-cyan/55"
                      >
                        {link.label}
                      </button>
                    );
                  }

                  return (
                    <a
                      key={`${card.id}-${link.label}`}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex rounded-md border border-cyan/35 bg-cyan/10 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-cyan transition-colors hover:border-cyan/55"
                    >
                      {link.label}
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {message.actions?.length ? (
        <div className="mt-3 pl-0.5 flex flex-wrap gap-1.5">
          {message.actions.map((action) => (
            <button
              key={`${message.id}-${action.label}`}
              type="button"
              onClick={() => onAction(action)}
              className="rounded-md border border-neon/35 bg-neon/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-neon transition-colors hover:border-neon/55"
            >
              {action.label}
            </button>
          ))}
        </div>
      ) : null}
    </motion.article>
  );
}

function TypingCard({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <motion.article
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0.08 : 0.18 }}
      className="relative overflow-hidden rounded-xl border border-white/10 bg-black/25 px-2.5 py-2 sm:px-3 sm:py-2.5"
    >
      <span className="pointer-events-none absolute inset-y-0 left-0 w-[2px] bg-cyan/75" />
      <p className="mb-1.5 pl-1 font-mono text-[9px] uppercase tracking-[0.16em] text-dim">ASK_VIHAAN</p>
      <div className="inline-flex items-center gap-1 pl-1">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan [animation-delay:0ms]" />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan [animation-delay:120ms]" />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan [animation-delay:240ms]" />
      </div>
    </motion.article>
  );
}

export function ChatStream({ messages, isThinking, reducedMotion, onAction }: ChatStreamProps) {
  return (
    <div className="space-y-2 sm:space-y-2.5">
      {messages.map((message) => (
        <StreamCard
          key={message.id}
          message={message}
          reducedMotion={reducedMotion}
          onAction={onAction}
        />
      ))}
      {isThinking ? <TypingCard reducedMotion={reducedMotion} /> : null}
    </div>
  );
}
