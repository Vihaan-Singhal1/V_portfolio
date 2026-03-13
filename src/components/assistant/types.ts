import type { ProjectLink } from '../../data/content';

export type AssistantStatus = 'ONLINE' | 'THINKING' | 'LISTENING' | 'SPEAKING';
export type AssistantRole = 'assistant' | 'user';

export type AssistantAction =
  | {
      type: 'open-section';
      label: string;
      target: string;
    }
  | {
      type: 'open-link';
      label: string;
      target: string;
    }
  | {
      type: 'send-input';
      label: string;
      target: string;
    };

export type AssistantProjectCard = {
  id: string;
  title: string;
  outcome: string;
  stack: string[];
  links: ProjectLink[];
};

export type AssistantMessage = {
  id: string;
  role: AssistantRole;
  content: string;
  createdAt: number;
  actions?: AssistantAction[];
  cards?: AssistantProjectCard[];
};

export type KnowledgeChunk = {
  id: string;
  section: string;
  title: string;
  body: string;
  tags: string[];
  links?: Array<{ label: string; href: string }>;
  relatedProjectId?: string;
  rankBoost?: number;
};

export type RetrievalResult = {
  chunks: KnowledgeChunk[];
  confidence: number;
};

export type AssistantReply = {
  content: string;
  actions?: AssistantAction[];
  cards?: AssistantProjectCard[];
  usedApi?: boolean;
};

export type AssistantCommandId =
  | 'help'
  | 'projects'
  | 'experience'
  | 'contact'
  | 'resume'
  | 'clear';

export type AssistantCommandDefinition = {
  id: AssistantCommandId;
  command: `/${string}`;
  aliases: `/${string}`[];
  description: string;
  effect: 'help' | 'navigate' | 'open-link' | 'clear';
  anchorId?: string;
};

export type ParsedCommand = {
  raw: string;
  args: string;
  definition?: AssistantCommandDefinition;
};

export type AssistantCommandEffect =
  | {
      type: 'navigate';
      anchorId: string;
      closeOverlay: true;
    }
  | {
      type: 'open-link';
      href: string;
      closeOverlay: false;
    }
  | {
      type: 'clear';
      closeOverlay: false;
    };

export type AssistantCommandResult = {
  handled: boolean;
  appendUserMessage: boolean;
  reply?: AssistantReply;
  effect?: AssistantCommandEffect;
};

export type AssistantSendResult = {
  effect?: AssistantCommandEffect;
};
