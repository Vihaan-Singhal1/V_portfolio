const FALLBACK_ASCII = String.raw`
          .-''''-.
        .'  _    \
       /   (o)    |
      |  .-.__.-. |
      | /  /  \  \|
      | |  \__/  |
      | \   __   /
       \ '-.__.-'
        '.____.'
     vihaan@vs.dev
`;

const FRAME_PATHS = [
  '/assets/assistant/vihaan_0.ascii.txt',
  '/assets/assistant/vihaan_1.ascii.txt',
  '/assets/assistant/vihaan_2.ascii.txt',
  '/assets/assistant/vihaan.ascii.txt'
] as const;

async function loadAsciiFile(path: string) {
  const response = await fetch(path, { cache: 'no-store' });
  if (!response.ok) return null;

  const text = (await response.text()).trimEnd();
  return text.length ? text : null;
}

export async function loadAsciiFrames() {
  const settled = await Promise.allSettled(FRAME_PATHS.map((path) => loadAsciiFile(path)));

  const frames = settled
    .map((result) => (result.status === 'fulfilled' ? result.value : null))
    .filter((frame): frame is string => Boolean(frame));

  const uniqueFrames = Array.from(new Set(frames));

  if (uniqueFrames.length === 0) return [FALLBACK_ASCII];
  if (uniqueFrames.length === 1) return [uniqueFrames[0]];
  return uniqueFrames;
}
