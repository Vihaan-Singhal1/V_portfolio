import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent
} from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronUp, Mic, MicOff, Send, X } from 'lucide-react';

import { assistant, type EffectsTier } from '../../data/content';
import { cn } from '../../lib/utils';
import { ChatStream } from './ChatStream';
import { IdentityPanel } from './IdentityPanel';
import { getResumeHref } from './responseEngine';
import { useAssistantChat } from './chatEngine';
import type {
  AssistantAction,
  AssistantCommandDefinition,
  AssistantCommandEffect,
  AssistantStatus
} from './types';

type AssistantOverlayProps = {
  onClose: () => void;
  effectsTier: EffectsTier;
};

type RecognitionInstance = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
};

function statusTone(status: AssistantStatus) {
  if (status === 'THINKING') return 'text-cyan border-cyan/45 bg-cyan/12';
  if (status === 'LISTENING') return 'text-neon border-neon/55 bg-neon/15';
  if (status === 'SPEAKING') return 'text-neon border-neon/45 bg-neon/14';
  return 'text-neon border-neon/35 bg-neon/10';
}

function getPortraitSrc() {
  return assistant.ui.portraitSrc || '/assets/chat/portrait.jpg';
}

function scrollToSection(anchorId: string) {
  const target = document.getElementById(anchorId);
  if (!target) return;

  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  window.history.replaceState(null, '', `#${anchorId}`);
}

export default function AssistantOverlay({ onClose, effectsTier }: AssistantOverlayProps) {
  const {
    messages,
    status,
    isThinking,
    sendMessage,
    clearConversation,
    promptSuggestions,
    commandDefinitions,
    getCommandSuggestions
  } = useAssistantChat();

  const [input, setInput] = useState('');
  const [conversationMode, setConversationMode] = useState(false);
  const [listening, setListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [activeCommandIndex, setActiveCommandIndex] = useState(0);
  const [portraitPulse, setPortraitPulse] = useState(0);
  const [isCommandsDrawerOpen, setIsCommandsDrawerOpen] = useState(false);

  const recognitionRef = useRef<RecognitionInstance | null>(null);
  const streamRef = useRef<HTMLDivElement | null>(null);
  const previousAssistantMessageId = useRef<string | null>(null);

  const reducedMotion = effectsTier !== 'full';
  const displayStatus: AssistantStatus = listening ? 'LISTENING' : status;
  const resumeHref = useMemo(() => getResumeHref(), []);

  const speechSupported = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const withSpeech = window as Window & {
      webkitSpeechRecognition?: new () => RecognitionInstance;
      SpeechRecognition?: new () => RecognitionInstance;
    };

    return Boolean(withSpeech.SpeechRecognition || withSpeech.webkitSpeechRecognition);
  }, []);

  const commandSuggestions = useMemo<AssistantCommandDefinition[]>(() => {
    return getCommandSuggestions(input);
  }, [getCommandSuggestions, input]);

  const commandPaletteOpen = input.trimStart().startsWith('/') && commandSuggestions.length > 0;

  useEffect(() => {
    setActiveCommandIndex(0);
  }, [input]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isCommandsDrawerOpen) {
          setIsCommandsDrawerOpen(false);
          return;
        }
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isCommandsDrawerOpen, onClose]);

  useEffect(() => {
    const stream = streamRef.current;
    if (!stream) return;
    stream.scrollTo({ top: stream.scrollHeight, behavior: 'smooth' });
  }, [messages, isThinking]);

  useEffect(() => {
    const lastAssistant = [...messages].reverse().find((message) => message.role === 'assistant');
    if (!lastAssistant) return;

    if (previousAssistantMessageId.current === lastAssistant.id) return;
    previousAssistantMessageId.current = lastAssistant.id;

    setPortraitPulse((current) => current + 1);
  }, [messages]);

  const executeEffect = useCallback(
    (effect?: AssistantCommandEffect) => {
      if (!effect) return;

      if (effect.type === 'navigate') {
        if (effect.closeOverlay) onClose();
        window.setTimeout(() => {
          scrollToSection(effect.anchorId);
        }, 150);
        return;
      }

      if (effect.type === 'open-link') {
        window.open(effect.href, '_blank', 'noopener,noreferrer');
      }
    },
    [onClose]
  );

  const sendInput = useCallback(async (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    setInput('');
    setSpeechError(null);

    const result = await sendMessage(trimmed);
    executeEffect(result.effect);
  }, [executeEffect, sendMessage]);

  const runCommand = useCallback(async (command: string) => {
    setInput('');
    setSpeechError(null);

    const result = await sendMessage(command);
    executeEffect(result.effect);
  }, [executeEffect, sendMessage]);

  const handleAction = useCallback(
    (action: AssistantAction) => {
      if (action.type === 'send-input') {
        const target = action.target.trim();
        if (!target) return;

        if (target.startsWith('/')) {
          void runCommand(target);
        } else {
          void sendInput(target);
        }
        return;
      }

      if (action.type === 'open-link') {
        if (action.target.startsWith('#')) {
          onClose();
          window.setTimeout(() => {
            scrollToSection(action.target.slice(1));
          }, 150);
          return;
        }

        window.open(action.target, '_blank', 'noopener,noreferrer');
        return;
      }

      onClose();
      window.setTimeout(() => {
        scrollToSection(action.target);
      }, 150);
    },
    [onClose, runCommand, sendInput]
  );
  const handleDrawerCommand = useCallback((command: string) => {
    setIsCommandsDrawerOpen(false);
    void runCommand(command);
  }, [runCommand]);

  const handleDrawerAction = useCallback((action: AssistantAction) => {
    setIsCommandsDrawerOpen(false);
    handleAction(action);
  }, [handleAction]);

  const createRecognition = () => {
    if (!speechSupported) return null;

    const withSpeech = window as Window & {
      webkitSpeechRecognition?: new () => RecognitionInstance;
      SpeechRecognition?: new () => RecognitionInstance;
    };

    const Constructor = withSpeech.SpeechRecognition || withSpeech.webkitSpeechRecognition;
    if (!Constructor) return null;

    const recognition = new Constructor();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript?.trim() ?? '';
      if (!transcript) return;

      setSpeechError(null);
      if (conversationMode) {
        void sendInput(transcript);
      } else {
        setInput(transcript);
      }
    };

    recognition.onerror = (event) => {
      setSpeechError(event.error ? `Mic error: ${event.error}` : 'Mic capture failed');
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    return recognition;
  };

  const handleMic = () => {
    if (!speechSupported) {
      setSpeechError('Speech not supported');
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = createRecognition();
    }

    const recognition = recognitionRef.current;
    if (!recognition) {
      setSpeechError('Speech not supported');
      return;
    }

    try {
      setListening(true);
      setSpeechError(null);
      recognition.start();
    } catch {
      setListening(false);
      setSpeechError('Microphone unavailable');
    }
  };

  const handleInputKeyDown = (event: ReactKeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Escape') {
      if (commandPaletteOpen) {
        event.preventDefault();
        event.stopPropagation();
        setInput('');
      }
      return;
    }

    if (commandPaletteOpen && event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveCommandIndex((current) => (current + 1) % commandSuggestions.length);
      return;
    }

    if (commandPaletteOpen && event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveCommandIndex((current) => (current - 1 + commandSuggestions.length) % commandSuggestions.length);
      return;
    }

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();

      if (commandPaletteOpen) {
        const selected = commandSuggestions[activeCommandIndex] ?? commandSuggestions[0];
        if (selected) {
          void runCommand(selected.command);
          return;
        }
      }

      void sendInput(input);
    }
  };

  const handleBackdropMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="ask-vihaan-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reducedMotion ? 0.1 : 0.22 }}
        onMouseDown={handleBackdropMouseDown}
        className="fixed inset-0 z-[1300] bg-black/78 p-2 backdrop-blur-[1px] sm:p-4"
      >
        <motion.div
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.975, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.985, y: 6 }}
          transition={{ duration: reducedMotion ? 0.1 : 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto flex h-full w-full max-w-[1260px] flex-col overflow-hidden rounded-xl border border-neon/30 bg-[radial-gradient(circle_at_0%_0%,rgba(0,200,255,0.05),transparent_34%),linear-gradient(180deg,rgba(7,7,7,0.98),rgba(3,3,3,0.98))] shadow-[0_26px_90px_rgba(0,0,0,0.58)] sm:rounded-2xl"
          onMouseDown={(event) => event.stopPropagation()}
        >
          <span className="pointer-events-none absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,170,0.08) 3px, rgba(0,255,170,0.08) 4px)' }} />

          <header className="relative z-[1] flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-3 py-2.5 sm:px-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-dim">vihaan@vs:~/assistant</p>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <motion.span
                key={displayStatus}
                initial={reducedMotion ? { opacity: 1 } : { opacity: 0.8, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reducedMotion ? 0.08 : 0.16 }}
                className={cn(
                  'rounded-full border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em]',
                  statusTone(displayStatus)
                )}
              >
                {displayStatus}
              </motion.span>

              <button
                type="button"
                onClick={clearConversation}
                className="hidden rounded-md border border-white/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-dim transition-colors hover:border-cyan/40 hover:text-cyan sm:inline-flex"
              >
                CLEAR
              </button>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close assistant"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/35 text-dim transition-colors hover:border-neon/55 hover:text-neon"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          <div className="relative z-[1] grid h-full min-h-0 grid-cols-1 lg:grid-cols-[340px_1fr]">
            <div className="hidden lg:block">
              <IdentityPanel
                portraitSrc={getPortraitSrc()}
                status={displayStatus}
                reducedMotion={reducedMotion}
                commands={commandDefinitions}
                portraitPulse={portraitPulse}
                onRunCommand={(command) => {
                  void runCommand(command);
                }}
                onAction={handleAction}
                resumeHref={resumeHref}
              />
            </div>

            <section className="flex min-h-0 flex-1 flex-col p-3 sm:p-5">
              <div className="mb-2.5 rounded-xl border border-white/10 bg-black/28 p-2.5 lg:hidden">
                <div className="flex items-center gap-2.5">
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md border border-neon/25 bg-black/45">
                    <img
                      src={getPortraitSrc()}
                      alt="Vihaan avatar"
                      loading="lazy"
                      className="h-full w-full object-cover object-[center_20%] opacity-[0.92]"
                    />
                    <span className="assistant-portrait-noise pointer-events-none absolute inset-0" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[9px] tracking-[0.14em] text-cyan">vihaan@vs:~/assistant</p>
                    <p className="mt-1 inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-dim">
                      <span className="h-1.5 w-1.5 rounded-full bg-neon shadow-[0_0_10px_rgba(0,255,170,0.4)]" />
                      {displayStatus}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCommandsDrawerOpen(true)}
                    className="inline-flex items-center gap-1 rounded-md border border-cyan/35 bg-cyan/10 px-2 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-cyan transition-colors hover:border-cyan/55"
                  >
                    Tap for commands
                    <ChevronUp className="h-3 w-3" />
                  </button>
                </div>
              </div>

              <div className="mb-2.5 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {promptSuggestions.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => {
                      void sendInput(prompt);
                    }}
                    className="shrink-0 rounded-md border border-cyan/30 bg-cyan/10 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-cyan transition-colors hover:border-cyan/50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {reducedMotion ? null : (
                <div className="assistant-wave-strip mb-2.5 rounded-md border border-white/10 bg-black/25 px-2.5 py-1.5 sm:mb-3 sm:px-3 sm:py-2">
                  <div className="assistant-wave-baseline" />
                  <div className="assistant-wave-bars">
                    {Array.from({ length: 16 }).map((_, index) => (
                      <span
                        key={index}
                        className="assistant-wave-bar"
                        style={{ animationDelay: `${index * 90}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div ref={streamRef} className="min-h-0 flex-1 overflow-y-auto rounded-xl border border-white/10 bg-black/26 p-2.5 sm:p-3.5">
                <ChatStream
                  messages={messages}
                  isThinking={isThinking}
                  reducedMotion={reducedMotion}
                  onAction={handleAction}
                />
              </div>

              <div
                className="sticky bottom-0 z-[2] mt-2.5 rounded-xl border border-white/10 bg-black/40 p-2 sm:mt-3 sm:p-2.5"
                style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
              >
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setConversationMode((current) => !current)}
                    className={cn(
                      'rounded-md border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] transition-colors',
                      conversationMode
                        ? 'border-neon/45 bg-neon/14 text-neon'
                        : 'border-white/10 bg-white/[0.02] text-dim hover:border-cyan/40 hover:text-cyan'
                    )}
                  >
                    Conversation Mode {conversationMode ? 'ON' : 'OFF'}
                  </button>

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {conversationMode ? (
                      <button
                        type="button"
                        onClick={handleMic}
                        title={speechSupported ? 'Use microphone input' : 'Speech not supported'}
                        aria-label="Use microphone"
                        className={cn(
                          'inline-flex h-8 w-8 items-center justify-center rounded-md border transition-colors',
                          listening
                            ? 'border-neon/55 bg-neon/14 text-neon'
                            : 'border-white/10 bg-white/[0.02] text-dim hover:border-cyan/40 hover:text-cyan'
                        )}
                      >
                        {speechSupported ? (
                          listening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />
                        ) : (
                          <MicOff className="h-3.5 w-3.5" />
                        )}
                      </button>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => {
                        void sendInput(input);
                      }}
                      className="inline-flex h-8 items-center gap-1.5 rounded-md border border-neon bg-neon px-3 font-mono text-[9px] uppercase tracking-[0.16em] text-bg transition-opacity hover:opacity-90"
                    >
                      <Send className="h-3.5 w-3.5" />
                      SEND
                    </button>
                  </div>
                </div>

                <div className="relative">
                  {commandPaletteOpen ? (
                    <div
                      role="listbox"
                      className="absolute -top-2 left-0 right-0 z-[2] max-h-[180px] -translate-y-full overflow-auto rounded-md border border-white/10 bg-[#050505]/95 p-1.5 shadow-[0_14px_30px_rgba(0,0,0,0.45)]"
                    >
                      {commandSuggestions.map((command, index) => {
                        const selected = index === activeCommandIndex;
                        return (
                          <button
                            key={command.id}
                            role="option"
                            aria-selected={selected}
                            type="button"
                            onClick={() => {
                              void runCommand(command.command);
                            }}
                            className={cn(
                              'w-full rounded-md px-2 py-1.5 text-left transition-colors',
                              selected
                                ? 'border border-neon/35 bg-neon/14'
                                : 'border border-transparent bg-transparent hover:border-white/10 hover:bg-white/[0.03]'
                            )}
                          >
                            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-neon">
                              {command.command}
                            </p>
                            <p className="mt-0.5 text-[12px] text-dim">{command.description}</p>
                          </button>
                        );
                      })}
                    </div>
                  ) : null}

                  <textarea
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={handleInputKeyDown}
                    rows={2}
                    placeholder="Ask about projects, stack, experience… or type /help"
                    className="w-full resize-none rounded-md border border-white/10 bg-black/45 px-3 py-2 pr-8 font-mono text-[12px] leading-[1.65] text-white outline-none transition-colors placeholder:text-dim/70 focus:border-neon/45"
                  />
                  <span
                    className={cn(
                      'assistant-input-cursor pointer-events-none absolute bottom-2 right-3 h-4 w-[2px] bg-neon/75',
                      reducedMotion && 'assistant-input-cursor-static'
                    )}
                  />
                </div>

                {speechError ? (
                  <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-red">{speechError}</p>
                ) : null}
              </div>
            </section>
          </div>

          <AnimatePresence>
            {isCommandsDrawerOpen ? (
              <motion.div
                initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reducedMotion ? 0.08 : 0.16 }}
                className="absolute inset-0 z-[4] bg-black/58 lg:hidden"
                onMouseDown={(event) => {
                  event.stopPropagation();
                  if (event.target === event.currentTarget) setIsCommandsDrawerOpen(false);
                }}
              >
                <motion.div
                  initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                  transition={{ duration: reducedMotion ? 0.08 : 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-x-0 bottom-0 max-h-[70vh] overflow-hidden rounded-t-2xl border-t border-white/12 bg-[#060708] shadow-[0_-22px_44px_rgba(0,0,0,0.5)]"
                  onMouseDown={(event) => event.stopPropagation()}
                >
                  <div className="flex justify-center pt-2">
                    <span
                      aria-hidden="true"
                      className="h-1 w-10 rounded-full bg-white/20"
                    />
                  </div>
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-cyan">Command Center</p>
                      <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-dim">
                        Run commands or jump to sections
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsCommandsDrawerOpen(false)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/30 text-dim transition-colors hover:border-neon/55 hover:text-neon"
                      aria-label="Close commands drawer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div
                    className="space-y-4 overflow-y-auto px-4 py-4"
                    style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
                  >
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-dim">Commands</p>
                      <div className="mt-2 grid gap-2">
                        {commandDefinitions.map((command) => (
                          <button
                            key={`drawer-${command.id}`}
                            type="button"
                            onClick={() => handleDrawerCommand(command.command)}
                            className="rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-left transition-colors hover:border-neon/40 hover:bg-neon/10"
                          >
                            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-neon">
                              {command.command}
                            </p>
                            <p className="mt-1 text-[12px] leading-[1.4] text-dim">{command.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-dim">Quick actions</p>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handleDrawerAction({ type: 'open-section', label: 'OPEN PROJECTS', target: 'projects' })}
                          className="rounded-md border border-cyan/35 bg-cyan/10 px-2.5 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-cyan transition-colors hover:border-cyan/55"
                        >
                          OPEN PROJECTS
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDrawerAction({ type: 'open-link', label: 'OPEN RESUME', target: resumeHref })}
                          className="rounded-md border border-neon/35 bg-neon/10 px-2.5 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-neon transition-colors hover:border-neon/55"
                        >
                          OPEN RESUME
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDrawerAction({ type: 'open-section', label: 'OPEN CONTACT', target: 'contact' })}
                          className="col-span-2 rounded-md border border-white/15 bg-white/[0.03] px-2.5 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-text transition-colors hover:border-white/30"
                        >
                          OPEN CONTACT
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
