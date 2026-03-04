import { motion, useInView } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { terminalLines } from '../../data/content';

type TypedLine = {
  prompt: boolean;
  text: string;
};

export function AboutTerminal() {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.35 });

  const [typedLines, setTypedLines] = useState<TypedLine[]>([]);
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    if (lineIndex >= terminalLines.length) return;

    const source = terminalLines[lineIndex];
    const isLineDone = charIndex > source.text.length;

    const timeout = window.setTimeout(
      () => {
        if (!isLineDone) {
          const partial = source.text.slice(0, charIndex);

          setTypedLines((prev) => {
            const next = [...prev];
            next[lineIndex] = { prompt: source.prompt, text: partial };
            return next;
          });

          setCharIndex((prev) => prev + 1);
          return;
        }

        setLineIndex((prev) => prev + 1);
        setCharIndex(0);
      },
      isLineDone ? (source.prompt ? 480 : 320) : source.prompt ? 34 : 20
    );

    return () => window.clearTimeout(timeout);
  }, [charIndex, isInView, lineIndex]);

  const typingActive = isInView && lineIndex < terminalLines.length;

  return (
    <section className="relative z-[2] py-16">
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-[820px] overflow-hidden rounded-xl border border-border-bright bg-[#070707] shadow-card"
        >
          <div className="flex items-center gap-2 border-b border-border bg-[#0d0d0d] px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            <span className="ml-2 font-mono text-[11px] tracking-[0.1em] text-dim">vihaan@portfolio ~</span>
          </div>

          <div className="min-h-[290px] space-y-1.5 px-5 py-5 md:px-6 md:py-6">
            {typedLines.map((line, index) => (
              <div key={`${line.text}-${index}`} className="font-mono text-[13px] leading-[1.8] md:text-[14px]">
                {line.prompt ? (
                  <>
                    <span className="text-cyan">❯ </span>
                    <span className="text-neon">
                      {line.text}
                      {typingActive && index === lineIndex ? (
                        <span className="ml-0.5 animate-pulseSoft text-neon">▊</span>
                      ) : null}
                    </span>
                  </>
                ) : (
                  <span className="text-text">
                    {line.text}
                    {typingActive && index === lineIndex ? (
                      <span className="ml-0.5 animate-pulseSoft text-neon">▊</span>
                    ) : null}
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
