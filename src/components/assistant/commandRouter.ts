import { navigationLinks } from '../../data/content';
import { formatAssistantReply } from './engine/formatAssistantReply';
import type {
  AssistantCommandDefinition,
  AssistantCommandResult,
  ParsedCommand
} from './types';

const BASE_COMMANDS: AssistantCommandDefinition[] = [
  {
    id: 'help',
    command: '/help',
    aliases: [],
    description: 'Show available commands and examples.',
    effect: 'help'
  },
  {
    id: 'projects',
    command: '/projects',
    aliases: ['/proj'],
    description: 'Jump to the Projects section.',
    effect: 'navigate',
    anchorId: 'projects'
  },
  {
    id: 'experience',
    command: '/experience',
    aliases: ['/xp'],
    description: 'Jump to the Experience section.',
    effect: 'navigate',
    anchorId: 'experience'
  },
  {
    id: 'contact',
    command: '/contact',
    aliases: [],
    description: 'Jump to the Contact section.',
    effect: 'navigate',
    anchorId: 'contact'
  },
  {
    id: 'resume',
    command: '/resume',
    aliases: ['/cv'],
    description: 'Open resume PDF in a new tab.',
    effect: 'open-link'
  },
  {
    id: 'clear',
    command: '/clear',
    aliases: [],
    description: 'Clear conversation history.',
    effect: 'clear'
  }
];

function normalizeCommand(value: string) {
  return value.trim().toLowerCase();
}

function formatCommand(def: AssistantCommandDefinition) {
  if (def.aliases.length === 0) return def.command;
  return `${def.command} (${def.aliases.join(', ')})`;
}

function buildHelpReply(commands: AssistantCommandDefinition[], resumeHref: string) {
  const commandLines = commands.map((command) => `${formatCommand(command)} — ${command.description}`);

  return formatAssistantReply({
    headline: 'I answer based on Vihaan’s portfolio.',
    bullets: [
      'Use /projects /experience /resume /contact',
      'Or ask: best AI project / tech stack / 30s summary',
      `Commands: ${commandLines.join(' | ')}`
    ],
    followUp: 'What do you want to see first?',
    actions: [
      { type: 'send-input', label: '/PROJECTS', target: '/projects' },
      { type: 'send-input', label: '/EXPERIENCE', target: '/experience' },
      { type: 'send-input', label: 'BEST AI PROJECT', target: 'Best AI project' },
      { type: 'open-link', label: 'OPEN RESUME', target: resumeHref }
    ]
  });
}

export function getEnabledCommands(commandList: string[]) {
  const enabled = new Set(commandList.map((entry) => normalizeCommand(entry)));
  const defaults = BASE_COMMANDS.filter((definition) => enabled.has(definition.command));
  if (defaults.length === 0) return BASE_COMMANDS;
  return defaults;
}

export function parseCommandInput(input: string, commandList: AssistantCommandDefinition[]): ParsedCommand | null {
  const trimmed = input.trim();
  if (!trimmed.startsWith('/')) return null;

  const [rawToken, ...args] = trimmed.split(/\s+/);
  const commandToken = normalizeCommand(rawToken);

  const definition = commandList.find((command) => {
    if (command.command === commandToken) return true;
    return command.aliases.includes(commandToken as `/${string}`);
  });

  return {
    raw: commandToken,
    args: args.join(' '),
    definition
  };
}

export function getCommandCompletions(input: string, commands: AssistantCommandDefinition[]) {
  const trimmed = input.trimStart();
  if (!trimmed.startsWith('/')) return [];

  const query = normalizeCommand(trimmed.slice(1));
  if (!query) return commands;

  return commands.filter((command) => {
    if (command.command.slice(1).startsWith(query)) return true;
    return command.aliases.some((alias) => alias.slice(1).startsWith(query));
  });
}

export function resolveCommand(
  input: string,
  commands: AssistantCommandDefinition[],
  resumeHref: string
): AssistantCommandResult {
  const parsed = parseCommandInput(input, commands);

  if (!parsed) {
    return {
      handled: false,
      appendUserMessage: true
    };
  }

  if (!parsed.definition) {
    return {
      handled: true,
      appendUserMessage: true,
      reply: formatAssistantReply({
        headline: 'Unknown command.',
        bullets: ['Type /help to view supported commands.'],
        followUp: 'Want me to show /help now?',
        actions: [{ type: 'send-input', label: '/HELP', target: '/help' }]
      })
    };
  }

  const command = parsed.definition;

  if (command.effect === 'help') {
    return {
      handled: true,
      appendUserMessage: true,
      reply: buildHelpReply(commands, resumeHref)
    };
  }

  if (command.effect === 'clear') {
    return {
      handled: true,
      appendUserMessage: false,
      effect: {
        type: 'clear',
        closeOverlay: false
      }
    };
  }

  if (command.effect === 'open-link') {
    return {
      handled: true,
      appendUserMessage: false,
      effect: {
        type: 'open-link',
        href: resumeHref,
        closeOverlay: false
      },
      reply: formatAssistantReply({
        headline: 'Opening resume in a new tab.',
        bullets: ['You can come back here to jump to projects or experience next.'],
        followUp: 'Want to open projects too?',
        actions: [{ type: 'send-input', label: '/PROJECTS', target: '/projects' }]
      })
    };
  }

  const fallbackAnchor = navigationLinks.find((entry) => entry.id === 'projects')?.id ?? 'projects';
  const anchorId = command.anchorId ?? fallbackAnchor;

  return {
    handled: true,
    appendUserMessage: false,
    effect: {
      type: 'navigate',
      anchorId,
      closeOverlay: true
    },
    reply: formatAssistantReply({
      headline: `Opening ${anchorId} section...`,
      bullets: ['Closing assistant and navigating now.']
    })
  };
}
