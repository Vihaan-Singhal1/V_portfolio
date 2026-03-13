export type EdgeCaseCategory =
  | 'GREETING'
  | 'HOW_ARE_YOU'
  | 'THANKS'
  | 'COMPLIMENT'
  | 'LOVE_FLIRT'
  | 'APOLOGY'
  | 'GOODBYE'
  | 'CONFUSED'
  | 'EMOJI_ONLY'
  | 'EMPTY_OR_NOISE'
  | 'RUDE_OR_TOXIC'
  | 'WHO_ARE_YOU'
  | 'OFFTOPIC'
  | 'AFFIRMATION'
  | 'NEGATION'
  | 'LAUGHTER'
  | 'SHORT_ACK'
  | 'ASK_FOR_HUMAN'
  | 'QUICK_REQUEST';

export type EdgeCaseSeedConfig = {
  category: EdgeCaseCategory;
  seeds: string[];
  prefixes?: string[];
  suffixes?: string[];
  includeEmoji?: boolean;
};

const PUNCT_SUFFIXES = ['', '!', '!!', '!!!', '?', '??', '?!', '...', '…'];
const EMOJI_SUFFIXES = ['', ' 👋', ' 🙂', ' 😄', ' 🔥', ' 🙌', ' 💯', ' ✅'];
const SPACE_VARIANTS = ['', ' ', '  '];

const BASE_CONFIG: EdgeCaseSeedConfig[] = [
  {
    category: 'GREETING',
    seeds: [
      'hi',
      'hello',
      'hey',
      'yo',
      'sup',
      'hiya',
      'howdy',
      'hey vihaan',
      'good morning',
      'good afternoon',
      'good evening',
      'gm',
      'heyo'
    ],
    prefixes: ['', 'hey', 'yo', 'ok', 'bro'],
    suffixes: ['', 'there', 'assistant', 'vihaan']
  },
  {
    category: 'HOW_ARE_YOU',
    seeds: [
      'how are you',
      'hru',
      'hows it going',
      'what is up',
      'whats up',
      'wyd',
      'you good',
      'how r u',
      'how you doing'
    ],
    prefixes: ['', 'hey', 'yo'],
    suffixes: ['', 'today', 'right now']
  },
  {
    category: 'THANKS',
    seeds: ['thanks', 'thank you', 'ty', 'thx', 'tysm', 'appreciate it', 'that helps', 'much appreciated'],
    prefixes: ['', 'ok', 'cool', 'yo'],
    suffixes: ['', 'man', 'assistant', 'bro']
  },
  {
    category: 'COMPLIMENT',
    seeds: ['nice', 'cool', 'great', 'awesome', 'amazing', 'this is sick', 'impressive', 'fire', 'goated'],
    prefixes: ['', 'so', 'very', 'really'],
    suffixes: ['', 'work', 'portfolio', 'bro']
  },
  {
    category: 'LOVE_FLIRT',
    seeds: ['i love you', 'love u', 'ily', 'marry me', 'date me', 'be my bf', 'be my girlfriend'],
    prefixes: ['', 'please'],
    suffixes: ['', 'lol', 'fr']
  },
  {
    category: 'APOLOGY',
    seeds: ['sorry', 'my bad', 'sorry about that', 'apologies', 'oops', 'sry'],
    prefixes: ['', 'hey'],
    suffixes: ['', 'bro', 'man']
  },
  {
    category: 'GOODBYE',
    seeds: ['bye', 'goodbye', 'see ya', 'cya', 'talk later', 'peace', 'gn', 'goodnight'],
    prefixes: ['', 'ok'],
    suffixes: ['', 'for now']
  },
  {
    category: 'CONFUSED',
    seeds: ['huh', 'what', 'i dont get it', 'confused', 'idk', 'wdym', 'come again', 'what do you mean'],
    prefixes: ['', 'wait'],
    suffixes: ['', 'bro', 'please']
  },
  {
    category: 'RUDE_OR_TOXIC',
    seeds: ['you are stupid', 'idiot', 'dumb bot', 'useless', 'trash', 'shut up', 'fuck you', 'bitch', 'moron'],
    prefixes: ['', 'hey'],
    suffixes: ['', 'man'],
    includeEmoji: false
  },
  {
    category: 'WHO_ARE_YOU',
    seeds: ['who are you', 'what can you do', 'what is this', 'help', 'how does this work'],
    prefixes: ['', 'hey'],
    suffixes: ['', 'assistant']
  },
  {
    category: 'OFFTOPIC',
    seeds: [
      'tell me a joke',
      'write a poem',
      'sing a song',
      'politics update',
      'medical advice',
      'legal advice',
      'weather today',
      'stock tips',
      'crypto prediction',
      'movie recommendation',
      'roast me'
    ],
    prefixes: ['', 'can you', 'please'],
    suffixes: ['', 'for me']
  },
  {
    category: 'AFFIRMATION',
    seeds: ['yes', 'yeah', 'yep', 'yup', 'sure', 'absolutely', 'definitely', 'go ahead', 'do it', 'sounds good'],
    prefixes: ['', 'ok'],
    suffixes: ['', 'please', 'now']
  },
  {
    category: 'NEGATION',
    seeds: ['no', 'nope', 'nah', 'not now', 'skip', 'later', 'dont', 'do not', 'no thanks'],
    prefixes: ['', 'ok'],
    suffixes: ['', 'please']
  },
  {
    category: 'LAUGHTER',
    seeds: ['lol', 'lmao', 'rofl', 'haha', 'hehe', 'lmfao'],
    prefixes: ['', 'bro'],
    suffixes: ['', '😂']
  },
  {
    category: 'SHORT_ACK',
    seeds: ['ok', 'okay', 'kk', 'k', 'got it', 'makes sense', 'understood', 'noted', 'fair'],
    prefixes: ['', 'cool'],
    suffixes: ['', 'thanks']
  },
  {
    category: 'ASK_FOR_HUMAN',
    seeds: ['are you real', 'are you human', 'human please', 'talk to vihaan', 'let me talk to a person'],
    prefixes: ['', 'can i'],
    suffixes: ['', 'instead']
  },
  {
    category: 'QUICK_REQUEST',
    seeds: ['quickly', 'asap', 'real quick', 'short answer', 'tldr', 'tl dr'],
    prefixes: ['', 'answer'],
    suffixes: ['', 'please']
  }
];

function unique(values: string[]) {
  return Array.from(new Set(values));
}

export function normalizeEdgeText(input: string, keepSlash = true) {
  const lowered = input.toLowerCase();
  const base = keepSlash
    ? lowered.replace(/[^\p{L}\p{N}\s\/]/gu, ' ')
    : lowered.replace(/[^\p{L}\p{N}\s]/gu, ' ');
  return base.replace(/\s+/g, ' ').trim();
}

function toStretchyVariants(seed: string) {
  const out = new Set<string>([seed]);
  const simple = seed.trim();
  if (!simple || simple.includes(' ')) return Array.from(out);

  const m = simple.match(/^([a-z]+)([aeiouy])$/i);
  if (m) {
    out.add(`${m[1]}${m[2]}${m[2]}`);
    out.add(`${m[1]}${m[2]}${m[2]}${m[2]}`);
  }

  const tail = simple.slice(-1);
  if (/[a-z]/i.test(tail)) {
    out.add(`${simple}${tail}`);
    out.add(`${simple}${tail}${tail}`);
  }

  return Array.from(out);
}

function expandSeed(seed: string, config: EdgeCaseSeedConfig) {
  const prefixes = config.prefixes ?? [''];
  const suffixes = config.suffixes ?? [''];
  const includeEmoji = config.includeEmoji !== false;

  const phraseVariants = new Set<string>();
  const seedVariants = toStretchyVariants(seed);

  for (const seedVariant of seedVariants) {
    for (const prefix of prefixes) {
      for (const suffix of suffixes) {
        const basePhrase = [prefix, seedVariant, suffix].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
        if (!basePhrase) continue;

        for (const punct of PUNCT_SUFFIXES) {
          for (const emoji of includeEmoji ? EMOJI_SUFFIXES : ['']) {
            const core = `${basePhrase}${punct}${emoji}`.trim();
            for (const lead of SPACE_VARIANTS) {
              for (const trail of SPACE_VARIANTS) {
                phraseVariants.add(normalizeEdgeText(`${lead}${core}${trail}`));
              }
            }
          }
        }
      }
    }
  }

  return unique(Array.from(phraseVariants).filter(Boolean));
}

export const EDGE_CASE_CATALOG: Record<EdgeCaseCategory, Set<string>> = {
  GREETING: new Set<string>(),
  HOW_ARE_YOU: new Set<string>(),
  THANKS: new Set<string>(),
  COMPLIMENT: new Set<string>(),
  LOVE_FLIRT: new Set<string>(),
  APOLOGY: new Set<string>(),
  GOODBYE: new Set<string>(),
  CONFUSED: new Set<string>(),
  EMOJI_ONLY: new Set<string>(),
  EMPTY_OR_NOISE: new Set<string>(),
  RUDE_OR_TOXIC: new Set<string>(),
  WHO_ARE_YOU: new Set<string>(),
  OFFTOPIC: new Set<string>(),
  AFFIRMATION: new Set<string>(),
  NEGATION: new Set<string>(),
  LAUGHTER: new Set<string>(),
  SHORT_ACK: new Set<string>(),
  ASK_FOR_HUMAN: new Set<string>(),
  QUICK_REQUEST: new Set<string>()
};

let edgeCaseCatalogInitialized = false;
let edgeCaseVariantCount = 0;

export function ensureEdgeCaseCatalog() {
  if (edgeCaseCatalogInitialized) return;

  for (const config of BASE_CONFIG) {
    for (const seed of config.seeds) {
      const variants = expandSeed(seed, config);
      for (const variant of variants) {
        EDGE_CASE_CATALOG[config.category].add(variant);
      }
    }
  }

  edgeCaseVariantCount = Object.values(EDGE_CASE_CATALOG).reduce((total, set) => total + set.size, 0);
  edgeCaseCatalogInitialized = true;
}

export const EDGE_CASE_ORDER: EdgeCaseCategory[] = [
  'RUDE_OR_TOXIC',
  'LOVE_FLIRT',
  'ASK_FOR_HUMAN',
  'HOW_ARE_YOU',
  'THANKS',
  'APOLOGY',
  'GOODBYE',
  'CONFUSED',
  'WHO_ARE_YOU',
  'OFFTOPIC',
  'QUICK_REQUEST',
  'LAUGHTER',
  'AFFIRMATION',
  'NEGATION',
  'SHORT_ACK',
  'GREETING',
  'EMPTY_OR_NOISE',
  'EMOJI_ONLY'
];

export const EDGE_CASE_REGEX: Record<EdgeCaseCategory, RegExp[]> = {
  GREETING: [/\b(hi+|he+l+o+|hey+|yo+|sup+|hiya+|howdy+|gm|good\s+(morning|afternoon|evening))\b/i],
  HOW_ARE_YOU: [/(how\s*(are|r)\s*you|hru|what\s*(is|'s)?\s*up|hows?\s+it\s+going|wyd|how\s+you\s+doing)\b/i],
  THANKS: [/\b(thanks|thank\s*you|ty|thx|tysm|appreciate\s*it|much\s*appreciated)\b/i],
  COMPLIMENT: [/\b(nice|cool|great|awesome|amazing|impressive|sick|fire|goated)\b/i],
  LOVE_FLIRT: [/(i\s+love\s+you|love\s+u|\bily\b|marry\s+me|date\s+me|be\s+my\s+(bf|girlfriend))/i],
  APOLOGY: [/\b(sorry|sry|my\s+bad|apologies|oops)\b/i],
  GOODBYE: [/\b(bye|goodbye|see\s*ya|cya|talk\s+later|peace|gn|goodnight)\b/i],
  CONFUSED: [/\b(huh|what|confused|dont\s+get\s+it|idk|wdym|come\s+again|what\s+do\s+you\s+mean)\b/i],
  EMOJI_ONLY: [],
  EMPTY_OR_NOISE: [/^(\.|\?|!|…|\s)+$/],
  RUDE_OR_TOXIC: [/\b(idiot|stupid|dumb|useless|trash|shut\s*up|fuck\s*you|bitch|moron|asshole)\b/i],
  WHO_ARE_YOU: [/(who\s+are\s+you|what\s+can\s+you\s+do|what\s+is\s+this|\bhelp\b|how\s+does\s+this\s+work)/i],
  OFFTOPIC: [/(tell\s+me\s+a\s+joke|write\s+(me\s+)?a\s+poem|sing|politics|medical\s+advice|legal\s+advice|weather|stock|crypto|movie\s+recommendation|roast\s+me)/i],
  AFFIRMATION: [/\b(yes|yeah|yep|yup|sure|absolutely|definitely|go\s+ahead|do\s+it|sounds\s+good)\b/i],
  NEGATION: [/\b(no|nope|nah|not\s+now|skip|later|dont|do\s+not|no\s+thanks)\b/i],
  LAUGHTER: [/\b(lol+|lmao+|rofl|haha+|hehe+|lmfao+)\b/i],
  SHORT_ACK: [/\b(ok|okay|kk|k|got\s+it|makes\s+sense|understood|noted|fair)\b/i],
  ASK_FOR_HUMAN: [/(are\s+you\s+real|are\s+you\s+human|human\s+please|talk\s+to\s+vihaan|talk\s+to\s+(a\s+)?person)/i],
  QUICK_REQUEST: [/\b(quickly|asap|real\s+quick|short\s+answer|tldr|tl\s*dr)\b/i]
};

export function getEdgeCaseCatalogStats() {
  ensureEdgeCaseCatalog();
  return {
    totalVariants: edgeCaseVariantCount,
    byCategory: Object.fromEntries(
      Object.entries(EDGE_CASE_CATALOG).map(([category, set]) => [category, set.size])
    )
  };
}
