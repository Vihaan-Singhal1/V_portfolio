import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { assistant } from '../../data/content';
import {
  getCommandCompletions,
  getEnabledCommands,
  resolveCommand
} from './commandRouter';
import { buildOfflineReply, getResumeHref } from './responseEngine';
import { retrieveKnowledge } from './knowledgeBase';
import type {
  AssistantCommandDefinition,
  AssistantMessage,
  AssistantReply,
  AssistantSendResult,
  AssistantStatus
} from './types';

const STORAGE_MESSAGES_KEY = 'ask_vihaan_messages_v2';
const STORAGE_CACHE_KEY = 'ask_vihaan_ai_cache_v2';
const STORAGE_AI_CALLS_KEY = 'ask_vihaan_ai_calls_v2';

type CacheShape = Record<string, { content: string; createdAt: number }>;

const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {};
const apiEnabled = env.VITE_ASSISTANT_API === 'enabled';
const apiEndpoint = env.VITE_ASSISTANT_ENDPOINT ?? env.VITE_ASSISTANT_API_URL;

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeQuestion(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function buildWelcomeMessage(): AssistantMessage {
  return {
    id: makeId('assistant'),
    role: 'assistant',
    createdAt: Date.now(),
    content:
      'ASK_VIHAAN online. Ask about projects, experience, stack, publications, or use /help for commands.',
    actions: [
      { type: 'open-section', label: 'OPEN PROJECTS', target: 'projects' },
      { type: 'open-section', label: 'OPEN EXPERIENCE', target: 'experience' },
      { type: 'open-link', label: 'OPEN RESUME', target: getResumeHref() }
    ]
  };
}

function loadStoredMessages(maxHistory: number) {
  if (typeof window === 'undefined') return [buildWelcomeMessage()];

  try {
    const raw = window.sessionStorage.getItem(STORAGE_MESSAGES_KEY);
    if (!raw) return [buildWelcomeMessage()];

    const parsed = JSON.parse(raw) as AssistantMessage[];
    if (!Array.isArray(parsed) || parsed.length === 0) return [buildWelcomeMessage()];

    const sanitized = parsed
      .filter((entry) => {
        return (
          entry &&
          (entry.role === 'assistant' || entry.role === 'user') &&
          typeof entry.content === 'string'
        );
      })
      .slice(-maxHistory);

    return sanitized.length ? sanitized : [buildWelcomeMessage()];
  } catch {
    return [buildWelcomeMessage()];
  }
}

function persistMessages(messages: AssistantMessage[], maxHistory: number) {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(STORAGE_MESSAGES_KEY, JSON.stringify(messages.slice(-maxHistory)));
}

function readAiCallCount() {
  if (typeof window === 'undefined') return 0;
  return Number(window.sessionStorage.getItem(STORAGE_AI_CALLS_KEY) ?? '0') || 0;
}

function writeAiCallCount(value: number) {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(STORAGE_AI_CALLS_KEY, String(value));
}

function readCache(): CacheShape {
  if (typeof window === 'undefined') return {};

  try {
    const raw = window.sessionStorage.getItem(STORAGE_CACHE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as CacheShape;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeCache(cache: CacheShape) {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(STORAGE_CACHE_KEY, JSON.stringify(cache));
}

async function maybeGetApiReply(
  input: string,
  messages: AssistantMessage[],
  confidence: number
): Promise<AssistantReply | null> {
  if (!apiEnabled || !apiEndpoint) return null;

  const normalized = normalizeQuestion(input);
  if (!normalized) return null;

  const cache = readCache();
  const cached = cache[normalized];
  if (cached?.content) {
    return {
      content: cached.content,
      usedApi: true
    };
  }

  const isOpenEnded = normalized.split(' ').length > 8;
  if (!isOpenEnded && confidence >= 0.35) return null;

  const callCount = readAiCallCount();
  if (callCount >= assistant.limits.maxAiCallsPerSession) {
    return {
      content:
        'AI fallback quota reached for this session. I can still answer portfolio questions offline.'
    };
  }

  try {
    const retrieval = retrieveKnowledge(input, assistant.limits.maxContextChunks);

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        persona:
          'You are ASK_VIHAAN for Vihaan Singhal portfolio. Keep responses concise, factual, recruiter-friendly, and grounded in provided context.',
        query: input,
        messages: messages.slice(-8).map((message) => ({
          role: message.role,
          content: message.content
        })),
        retrievedChunks: retrieval.chunks
      })
    });

    if (!response.ok) return null;

    const payload = (await response.json()) as { answer?: string; content?: string; message?: string };
    const answer = payload.answer ?? payload.content ?? payload.message;
    if (!answer) return null;

    writeAiCallCount(callCount + 1);
    cache[normalized] = { content: answer, createdAt: Date.now() };
    writeCache(cache);

    return {
      content: answer,
      usedApi: true
    };
  } catch {
    return null;
  }
}

export function useAssistantChat() {
  const maxHistory = assistant.limits.maxHistory;
  const [messages, setMessages] = useState<AssistantMessage[]>(() => loadStoredMessages(maxHistory));
  const [status, setStatus] = useState<AssistantStatus>('ONLINE');
  const [isThinking, setIsThinking] = useState(false);

  const messagesRef = useRef(messages);
  const speakingTimeoutRef = useRef<number | null>(null);

  const commandDefinitions = useMemo<AssistantCommandDefinition[]>(() => {
    return getEnabledCommands(assistant.commands);
  }, []);

  useEffect(() => {
    if (!import.meta.env.DEV) return;

    let cancelled = false;
    const timer = window.setTimeout(() => {
      if (cancelled) return;
      void import('./natural/selfCheck').then((mod) => {
        mod.runNaturalSelfCheck();
      });
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    messagesRef.current = messages;
    persistMessages(messages, maxHistory);
  }, [maxHistory, messages]);

  useEffect(() => {
    return () => {
      if (speakingTimeoutRef.current !== null) {
        window.clearTimeout(speakingTimeoutRef.current);
      }
    };
  }, []);

  const setSpeakingThenOnline = useCallback((duration = 900) => {
    setStatus('SPEAKING');
    if (speakingTimeoutRef.current !== null) {
      window.clearTimeout(speakingTimeoutRef.current);
    }

    speakingTimeoutRef.current = window.setTimeout(() => {
      setStatus('ONLINE');
    }, duration);
  }, []);

  const appendMessage = useCallback((message: AssistantMessage) => {
    setMessages((current) => [...current, message].slice(-maxHistory));
  }, [maxHistory]);

  const clearConversation = useCallback(() => {
    const welcome = buildWelcomeMessage();
    setMessages([welcome]);
    setStatus('ONLINE');
    setIsThinking(false);

    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(STORAGE_CACHE_KEY);
      window.sessionStorage.removeItem(STORAGE_AI_CALLS_KEY);
    }
  }, []);

  const sendMessage = useCallback(async (input: string): Promise<AssistantSendResult> => {
    const trimmed = input.trim();

    if (!trimmed) {
      const emptyReply = buildOfflineReply('', assistant.limits.maxContextChunks).reply;
      appendMessage({
        id: makeId('assistant'),
        role: 'assistant',
        content: emptyReply.content,
        createdAt: Date.now(),
        actions: emptyReply.actions,
        cards: emptyReply.cards
      });
      setSpeakingThenOnline(550);
      return {};
    }

    const command = resolveCommand(trimmed, commandDefinitions, getResumeHref());

    if (command.handled) {
      if (command.effect?.type === 'clear') {
        clearConversation();
        return { effect: command.effect };
      }

      if (command.appendUserMessage) {
        appendMessage({
          id: makeId('user'),
          role: 'user',
          content: trimmed,
          createdAt: Date.now()
        });
      }

      if (command.reply) {
        appendMessage({
          id: makeId('assistant'),
          role: 'assistant',
          content: command.reply.content,
          createdAt: Date.now(),
          actions: command.reply.actions,
          cards: command.reply.cards
        });
        setSpeakingThenOnline(750);
      } else {
        setStatus('ONLINE');
      }

      return { effect: command.effect };
    }

    const userMessage: AssistantMessage = {
      id: makeId('user'),
      role: 'user',
      content: trimmed,
      createdAt: Date.now()
    };

    appendMessage(userMessage);
    setStatus('THINKING');
    setIsThinking(true);

    const responseDelay = assistant.ui.thinkingDelayMs;
    await new Promise((resolve) => window.setTimeout(resolve, responseDelay));

    const offline = buildOfflineReply(trimmed, assistant.limits.maxContextChunks);
    const apiReply = await maybeGetApiReply(trimmed, [...messagesRef.current, userMessage], offline.confidence);
    const finalReply = apiReply ?? offline.reply;

    appendMessage({
      id: makeId('assistant'),
      role: 'assistant',
      content: finalReply.content,
      createdAt: Date.now(),
      actions: finalReply.actions,
      cards: finalReply.cards
    });

    setIsThinking(false);
    setSpeakingThenOnline();

    return {};
  }, [appendMessage, clearConversation, commandDefinitions, setSpeakingThenOnline]);

  const promptSuggestions = useMemo(() => {
    return assistant.prompts?.length ? assistant.prompts : assistant.suggestedPrompts;
  }, []);

  const getCommandSuggestions = useCallback((input: string) => {
    return getCommandCompletions(input, commandDefinitions);
  }, [commandDefinitions]);

  return {
    messages,
    status,
    isThinking,
    sendMessage,
    clearConversation,
    promptSuggestions,
    commandDefinitions,
    getCommandSuggestions
  };
}
