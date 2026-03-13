import { assistant } from '../../../data/content';
import { getEnabledCommands, parseCommandInput } from '../commandRouter';
import { detectEdgeCase } from './detectEdgeCase';
import { EDGE_CASE_CATALOG, ensureEdgeCaseCatalog, getEdgeCaseCatalogStats, type EdgeCaseCategory } from './edgeCases';

declare global {
  interface Window {
    __ASK_VIHAAN_NATURAL_SELF_CHECK_DONE__?: boolean;
  }
}

function pickSamples(category: EdgeCaseCategory, count = 3) {
  const variants = Array.from(EDGE_CASE_CATALOG[category] ?? []);
  return variants.slice(0, count);
}

export function runNaturalSelfCheck() {
  if (!import.meta.env.DEV) return;
  if (typeof window === 'undefined') return;
  if (window.__ASK_VIHAAN_NATURAL_SELF_CHECK_DONE__) return;

  window.__ASK_VIHAAN_NATURAL_SELF_CHECK_DONE__ = true;

  ensureEdgeCaseCatalog();
  const stats = getEdgeCaseCatalogStats();

  console.groupCollapsed('[ASK_VIHAAN] Natural layer self-check');
  console.log('Catalog stats:', stats);

  if (stats.totalVariants < 200) {
    console.warn('Edge-case variant count below target:', stats.totalVariants);
  }

  const categories = Object.keys(EDGE_CASE_CATALOG) as EdgeCaseCategory[];

  for (const category of categories) {
    const samples = pickSamples(category, 3);
    if (!samples.length) continue;

    const results = samples.map((sample) => ({
      sample,
      detected: detectEdgeCase(sample)?.category ?? null
    }));

    console.log(category, results);
  }


  const stretchedGreeting = 'hiii';
  const stretchedResult = detectEdgeCase(stretchedGreeting);
  console.log('stretched greeting sample:', stretchedGreeting, stretchedResult);
  if (!stretchedResult || stretchedResult.category !== 'GREETING') {
    console.warn('Expected stretched greeting (hiii) to classify as GREETING.');
  }

  const mixed = 'hi show projects';
  const mixedResult = detectEdgeCase(mixed);
  console.log('mixed intent sample:', mixed, mixedResult);
  if (!mixedResult || mixedResult.smallTalkOnly) {
    console.warn('Expected mixed greeting+intent to NOT be smalltalk-only.');
  }

  const commands = getEnabledCommands(assistant.commands);
  const commandLike = '/projects';
  const parsed = parseCommandInput(commandLike, commands);
  console.log('command parse sample:', commandLike, parsed);
  if (!parsed?.definition) {
    console.warn('Expected /projects to parse as command (command priority may be broken).');
  }

  console.groupEnd();
}
