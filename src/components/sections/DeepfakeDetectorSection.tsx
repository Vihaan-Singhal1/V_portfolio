import { type CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

import { useDeviceTier } from '../../hooks/useDeviceTier';
import { SectionHeading } from '../shared/SectionHeading';

type Artifact = {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
};

type SampleAsset = {
  src: string;
  label: string;
  objectPosition?: string;
};

type RoundDefinition = {
  id: string;
  title: string;
  difficulty: 'baseline' | 'intermediate' | 'advanced';
  cue: string;
  real: SampleAsset;
  fake: SampleAsset;
  artifactType: string;
  forensicNote: string;
  artifacts: Artifact[];
};

type RoundState = RoundDefinition & {
  fakeIsRight: boolean;
};

const C = {
  bg: '#030303',
  bgAlt: '#0a0a0a',
  border: 'rgba(255,255,255,0.09)',
  dim: '#99a3af',
  text: '#dbe4ee',
  white: '#f5f7fa',
  neon: '#00ffaa',
  cyan: '#00c8ff',
  red: '#ff5f57',
  yellow: '#febc2e'
} as const;

const DEFAULT_REAL_SAMPLE_FALLBACK = '/assets/deepfake/real-unsplash-man-1.jpg';
const DEFAULT_FAKE_SAMPLE_FALLBACK = '/assets/deepfake/fake-sukeban.png';
const GENERIC_SAMPLE_FALLBACK = '/assets/deepfake/fake-sukeban.png';

function normalizeAssetPath(source: string) {
  return source.replace(/^https?:\/\/[^/]+/i, '').split('?')[0];
}

function getSampleFallback(src: string) {
  const normalized = src.toLowerCase();
  if (normalized.includes('/fake-') || normalized.includes('/synthetic') || normalized.includes('stable')) {
    return DEFAULT_FAKE_SAMPLE_FALLBACK;
  }
  return DEFAULT_REAL_SAMPLE_FALLBACK;
}

const realSamples: Record<string, SampleAsset> = {
  narasimhachar: {
    src: '/assets/deepfake/real-narasimhachar.jpg',
    label: 'Archival portrait',
    objectPosition: '50% 24%'
  },
  irvingBerlin: {
    src: '/assets/deepfake/real-irving-berlin.jpg',
    label: 'Studio portrait',
    objectPosition: '50% 18%'
  },
  princesseMonaco: {
    src: '/assets/deepfake/real-princesse-monaco.jpg',
    label: 'Editorial portrait',
    objectPosition: '50% 16%'
  },
  unsplashManOne: {
    src: '/assets/deepfake/real-unsplash-man-1.jpg',
    label: 'Contemporary portrait',
    objectPosition: '50% 18%'
  },
  unsplashWomanOne: {
    src: '/assets/deepfake/real-unsplash-woman-1.jpg',
    label: 'Natural-light portrait',
    objectPosition: '50% 18%'
  },
  unsplashManTwo: {
    src: '/assets/deepfake/real-unsplash-man-2.jpg',
    label: 'Outdoor portrait',
    objectPosition: '50% 20%'
  }
};

const fakeSamples: Record<string, SampleAsset> = {
  stableDiffusionPortrait: {
    src: '/assets/deepfake/fake-stable-diffusion.png',
    label: 'Synthetic portrait',
    objectPosition: '50% 30%'
  },
  sukebanPortrait: {
    src: '/assets/deepfake/fake-sukeban.png',
    label: 'AI illustration portrait',
    objectPosition: '50% 20%'
  },
  graphitePortrait: {
    src: '/assets/deepfake/fake-graphite.png',
    label: 'Graphite-style generation',
    objectPosition: '50% 22%'
  }
};

const ROUND_LIBRARY: RoundDefinition[] = [
  {
    id: 'round-01',
    title: 'Portrait authenticity sweep',
    difficulty: 'baseline',
    cue: 'Check whether skin still holds natural pores and edge definition around the eyes.',
    real: realSamples.unsplashWomanOne,
    fake: fakeSamples.stableDiffusionPortrait,
    artifactType: 'Skin texture smoothing',
    forensicNote: 'The fake collapses skin texture into a uniform gradient and blends the eye socket edges too softly.',
    artifacts: [
      { x: 0.26, y: 0.28, w: 0.24, h: 0.16, label: 'eye contour blur' },
      { x: 0.32, y: 0.45, w: 0.3, h: 0.22, label: 'flat cheek texture' }
    ]
  },
  {
    id: 'round-02',
    title: 'Fabric and edge inspection',
    difficulty: 'intermediate',
    cue: 'Watch for hair strands and clothing edges that become too crisp or mechanically repeated.',
    real: realSamples.unsplashManOne,
    fake: fakeSamples.sukebanPortrait,
    artifactType: 'Edge consistency failure',
    forensicNote: 'The generated sample breaks garment lines and hair boundaries into overly crisp, repeated fragments.',
    artifacts: [
      { x: 0.54, y: 0.12, w: 0.22, h: 0.28, label: 'hair strand repetition' },
      { x: 0.18, y: 0.58, w: 0.46, h: 0.2, label: 'uniform edge mismatch' }
    ]
  },
  {
    id: 'round-03',
    title: 'Shading coherence pass',
    difficulty: 'advanced',
    cue: 'Look for tonal ramps that repeat instead of following a believable light source.',
    real: realSamples.irvingBerlin,
    fake: fakeSamples.graphitePortrait,
    artifactType: 'Repetitive shading pattern',
    forensicNote: 'Graphite rendering creates repeated tonal ramps that feel patterned rather than physically lit.',
    artifacts: [
      { x: 0.24, y: 0.24, w: 0.22, h: 0.22, label: 'repeated forehead shading' },
      { x: 0.48, y: 0.52, w: 0.24, h: 0.2, label: 'synthetic mouth contour' }
    ]
  },
  {
    id: 'round-04',
    title: 'Archival sample review',
    difficulty: 'baseline',
    cue: 'Focus on the transition between the nose, mouth, and nearby skin texture.',
    real: realSamples.narasimhachar,
    fake: fakeSamples.stableDiffusionPortrait,
    artifactType: 'Feature blending anomaly',
    forensicNote: 'The fake softens the transition between nose, philtrum, and upper lip into a single blended patch.',
    artifacts: [
      { x: 0.4, y: 0.34, w: 0.18, h: 0.24, label: 'nose-lip blend' },
      { x: 0.18, y: 0.34, w: 0.18, h: 0.18, label: 'eye detail loss' }
    ]
  },
  {
    id: 'round-05',
    title: 'Editorial portrait review',
    difficulty: 'intermediate',
    cue: 'Inspect hard outlines where hair, props, and clothing should feel more organic.',
    real: realSamples.princesseMonaco,
    fake: fakeSamples.sukebanPortrait,
    artifactType: 'Synthetic contour hardening',
    forensicNote: 'Hairline, collar, and weapon outlines snap too cleanly, which is typical of generation artifacts.',
    artifacts: [
      { x: 0.12, y: 0.16, w: 0.34, h: 0.22, label: 'hairline edge hardening' },
      { x: 0.62, y: 0.2, w: 0.16, h: 0.5, label: 'prop contour inconsistency' }
    ]
  },
  {
    id: 'round-06',
    title: 'Outdoor portrait pass',
    difficulty: 'advanced',
    cue: 'Natural portraits keep subtle contrast falloff. Repeated contrast bands are a warning sign.',
    real: realSamples.unsplashManTwo,
    fake: fakeSamples.graphitePortrait,
    artifactType: 'Local contrast repetition',
    forensicNote: 'The fake repeats contrast bands around the jaw and forehead instead of following natural light falloff.',
    artifacts: [
      { x: 0.2, y: 0.18, w: 0.3, h: 0.18, label: 'forehead contrast band' },
      { x: 0.32, y: 0.48, w: 0.24, h: 0.24, label: 'jawline repetition' }
    ]
  },
  {
    id: 'round-07',
    title: 'Studio texture validation',
    difficulty: 'baseline',
    cue: 'Real portraits preserve micro-contrast. Over-smoothed surfaces are usually synthetic.',
    real: realSamples.unsplashWomanOne,
    fake: fakeSamples.stableDiffusionPortrait,
    artifactType: 'Pore detail suppression',
    forensicNote: 'Real portraits keep local micro-contrast. The generated sample smooths everything into one polished mask.',
    artifacts: [
      { x: 0.26, y: 0.44, w: 0.24, h: 0.22, label: 'texture suppression' },
      { x: 0.56, y: 0.28, w: 0.14, h: 0.14, label: 'iris definition loss' }
    ]
  },
  {
    id: 'round-08',
    title: 'Final authenticity check',
    difficulty: 'advanced',
    cue: 'Look for stylistic leakage where skin, shadows, and clothing all share the same rendering logic.',
    real: realSamples.irvingBerlin,
    fake: fakeSamples.sukebanPortrait,
    artifactType: 'Cross-domain style leakage',
    forensicNote: 'Illustrative rendering leaks into skin, cloth, and shadows, giving the fake away under inspection.',
    artifacts: [
      { x: 0.2, y: 0.22, w: 0.26, h: 0.22, label: 'skin stylization leak' },
      { x: 0.26, y: 0.62, w: 0.34, h: 0.2, label: 'cloth shading mismatch' }
    ]
  }
];

function shuffle<T>(items: T[]) {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
}

function buildGameDeck() {
  return shuffle(ROUND_LIBRARY).map((round) => ({
    ...round,
    fakeIsRight: Math.random() > 0.5
  }));
}

function HeatmapReveal({ active, artifacts, correct }: { active: boolean; artifacts: Artifact[]; correct: boolean }) {
  if (!active) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 4,
        pointerEvents: 'none',
        borderRadius: '12px',
        overflow: 'hidden'
      }}
    >
      <motion.div
        initial={{ y: '-100%', opacity: 0.78 }}
        animate={{ y: '120%', opacity: [0.78, 0.78, 0] }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: 4,
          background: correct ? C.neon : C.red,
          boxShadow: `0 0 22px ${correct ? C.neon : C.red}80`
        }}
      />

      {artifacts.map((artifact, index) => (
        <motion.div
          key={`${artifact.label}-${index}`}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 0.24, scale: 1 }}
          transition={{ delay: 0.16 + index * 0.1, duration: 0.32 }}
          style={{
            position: 'absolute',
            left: `${artifact.x * 100}%`,
            top: `${artifact.y * 100}%`,
            width: `${artifact.w * 100}%`,
            height: `${artifact.h * 100}%`,
            border: `1px solid ${correct ? 'rgba(0,255,170,0.55)' : 'rgba(255,95,87,0.65)'}`,
            background: correct ? 'rgba(0,255,170,0.14)' : 'rgba(255,95,87,0.18)',
            boxShadow: `0 0 18px ${correct ? 'rgba(0,255,170,0.14)' : 'rgba(255,95,87,0.18)'}`,
            borderRadius: '10px'
          }}
        />
      ))}
    </div>
  );
}

function DeepfakeDetector({ onExit }: { onExit: () => void }) {
  const totalRounds = ROUND_LIBRARY.length;
  const [deck, setDeck] = useState<RoundState[]>(() => buildGameDeck());
  const [state, setState] = useState<'idle' | 'playing' | 'reveal' | 'complete'>('idle');
  const [roundIndex, setRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [lastResult, setLastResult] = useState<'correct' | 'wrong' | null>(null);
  const [picked, setPicked] = useState<'left' | 'right' | null>(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [hardMode, setHardMode] = useState(false);
  const [brokenSources, setBrokenSources] = useState<Record<string, true>>({});
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const nextRoundTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeRound = deck[roundIndex] ?? null;
  const roundTime = hardMode ? 7 : 10;

  const resolveSampleSource = useCallback(
    (source: string) => {
      const normalized = normalizeAssetPath(source);
      if (!brokenSources[normalized]) return source;

      const preferredFallback = getSampleFallback(normalized);
      const preferredFallbackPath = normalizeAssetPath(preferredFallback);
      if (!brokenSources[preferredFallbackPath]) return preferredFallback;

      return GENERIC_SAMPLE_FALLBACK;
    },
    [brokenSources]
  );

  const resetTimers = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (nextRoundTimeoutRef.current) clearTimeout(nextRoundTimeoutRef.current);
  }, []);

  const startGame = useCallback(() => {
    resetTimers();
    setDeck(buildGameDeck());
    setState('playing');
    setRoundIndex(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrectCount(0);
    setTimeLeft(roundTime);
    setLastResult(null);
    setPicked(null);
  }, [resetTimers, roundTime]);

  const handlePick = useCallback(
    (side: 'left' | 'right' | null) => {
      if (state !== 'playing' || !activeRound || picked) return;
      resetTimers();
      setPicked(side);

      const wasCorrect =
        side !== null &&
        ((side === 'right' && activeRound.fakeIsRight) || (side === 'left' && !activeRound.fakeIsRight));

      setLastResult(wasCorrect ? 'correct' : 'wrong');

      if (wasCorrect) {
        const nextStreak = streak + 1;
        const speedBonus = Math.max(timeLeft - 2, 0) * 8;
        setScore((current) => current + 120 + Math.min(nextStreak, 5) * 20 + speedBonus);
        setStreak(nextStreak);
        setMaxStreak((current) => Math.max(current, nextStreak));
        setCorrectCount((current) => current + 1);
      } else {
        setStreak(0);
      }

      setState('reveal');
      nextRoundTimeoutRef.current = setTimeout(() => {
        if (roundIndex + 1 >= totalRounds) {
          setState('complete');
          setHasPlayed(true);
        } else {
          setRoundIndex((current) => current + 1);
          setPicked(null);
          setLastResult(null);
          setState('playing');
        }
      }, 2400);
    },
    [activeRound, picked, resetTimers, roundIndex, score, state, streak, timeLeft, totalRounds]
  );

  useEffect(() => {
    if (state !== 'playing' || !activeRound) return;
    setTimeLeft(roundTime);
    timerRef.current = setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          handlePick(null);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeRound, handlePick, roundIndex, roundTime, state]);

  useEffect(() => () => resetTimers(), [resetTimers]);

  const statusTone = useMemo(() => {
    if (correctCount >= 7) return C.neon;
    if (correctCount >= 5) return C.cyan;
    if (correctCount >= 3) return C.yellow;
    return C.red;
  }, [correctCount]);

  const difficultyTone =
    activeRound?.difficulty === 'advanced'
      ? C.red
      : activeRound?.difficulty === 'intermediate'
        ? C.cyan
        : C.neon;

  const activeCue = activeRound?.cue ?? 'Start the run to begin the first forensic pass.';

  const cardStyle: CSSProperties = {
    background: 'linear-gradient(180deg, rgba(13,13,13,0.98), rgba(7,7,7,0.98))',
    border: `1px solid ${C.border}`,
    borderRadius: '18px',
    overflow: 'hidden',
    width: '100%',
    maxWidth: '760px',
    boxShadow: '0 24px 60px rgba(0,0,0,0.32)'
  };

  return (
    <div className="df-game-layout grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_292px] lg:gap-7">
      <div className="df-game-card" style={cardStyle}>
        <div
          className="df-terminal-bar"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            padding: '10px 16px',
            background: C.bgAlt,
            borderBottom: `1px solid ${C.border}`,
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '5px' }}>
              <div style={{ width: 9, height: 9, borderRadius: '50%', background: C.red }} />
              <div style={{ width: 9, height: 9, borderRadius: '50%', background: C.yellow }} />
              <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#28c840' }} />
            </div>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: C.dim, letterSpacing: '1px' }}>
              deepfake.exe
            </span>
            {hardMode ? (
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '8px',
                  color: C.red,
                  letterSpacing: '2px',
                  padding: '2px 6px',
                  background: '#ff5f5715',
                  borderRadius: '3px',
                  border: '1px solid #ff5f5730'
                }}
              >
                RESEARCH MODE
              </span>
            ) : null}
          </div>

          <div className="df-terminal-meta" style={{ display: 'flex', gap: '10px', alignItems: 'center', marginLeft: 'auto', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {(state === 'playing' || state === 'reveal') && activeRound ? (
              <div className="df-round-stats" style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: C.dim, letterSpacing: '1px' }}>
                  {roundIndex + 1}
                  <span style={{ opacity: 0.4 }}>/{totalRounds}</span>
                </span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: C.cyan, letterSpacing: '1px' }}>
                  {activeRound.title}
                </span>
                {state === 'playing' ? (
                  <span
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '1px',
                      color: timeLeft <= 3 ? C.red : timeLeft <= 5 ? C.yellow : C.dim
                    }}
                  >
                    {timeLeft}s
                  </span>
                ) : null}
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: C.neon, letterSpacing: '1px', fontWeight: 700 }}>
                  {score}
                </span>
                {streak >= 2 ? (
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: C.yellow, letterSpacing: '1px' }}>
                    STREAK {streak}
                  </span>
                ) : null}
              </div>
            ) : null}

            <motion.button
              type="button"
              onClick={onExit}
              whileHover={{ y: -1, color: C.neon, borderColor: `${C.neon}66` }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.18 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: "'Space Mono', monospace",
                fontSize: '9px',
                letterSpacing: '1.6px',
                textTransform: 'uppercase',
                padding: '6px 10px',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
                color: C.text,
                border: `1px solid ${C.border}`,
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 700,
                boxShadow: '0 10px 20px rgba(0,0,0,0.22)'
              }}
              aria-label="Back to detector menu"
            >
              <ArrowLeft size={12} />
              Back
            </motion.button>
          </div>
        </div>

        {state === 'playing' ? (
          <div style={{ height: '2px', background: C.border }}>
            <div
              style={{
                height: '100%',
                borderRadius: '0 2px 2px 0',
                width: `${(timeLeft / roundTime) * 100}%`,
                background: timeLeft <= 3 ? C.red : `linear-gradient(90deg, ${C.neon}, ${C.cyan})`,
                transition: 'width 1s linear'
              }}
            />
          </div>
        ) : null}

        {state === 'idle' ? (
          <div style={{ padding: '42px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '18px' }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '5px', color: C.neon, textTransform: 'uppercase' }}>
              // vision forensics playground
            </div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '28px', fontWeight: 900, color: C.white, letterSpacing: '-1px', lineHeight: 1.15 }}>
              DETECT THE
              <br />
              <span style={{ color: C.red }}>DEEPFAKE</span>
            </div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', color: C.dim, lineHeight: 1.75, maxWidth: '460px' }}>
              Eight compact rounds. Read the cue, inspect the pair, commit to the synthetic image, then review the forensic signal.
            </div>
            <div className="df-preview-row" style={{ display: 'grid', gap: '12px', width: '100%', maxWidth: '520px' }}>
              {['AUTHENTIC', 'SYNTHETIC'].map((label, index) => (
                <div
                  key={label}
                  style={{
                    height: '120px',
                    borderRadius: '14px',
                    border: `1px solid ${C.border}`,
                    background:
                      index === 0
                        ? 'radial-gradient(circle at 50% 30%, rgba(0,200,255,0.16), rgba(0,0,0,0) 60%), linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0))'
                        : 'radial-gradient(circle at 50% 30%, rgba(255,95,87,0.16), rgba(0,0,0,0) 60%), linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0))'
                  }}
                >
                  <div style={{ display: 'flex', height: '100%', flexDirection: 'column', justifyContent: 'space-between', padding: '14px' }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '2px', color: index === 0 ? C.cyan : C.red }}>
                      {label}
                    </span>
                    <div style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '999px', background: index === 0 ? C.cyan : C.red, boxShadow: `0 0 18px ${index === 0 ? C.cyan : C.red}66` }} />
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: C.dim }}>
                        {index === 0 ? 'photographic texture + natural falloff' : 'artifact sweep + local inconsistency'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', marginTop: '2px' }}>
              <button
                onClick={startGame}
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '12px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  padding: '13px 34px',
                  background: hardMode ? C.red : C.neon,
                  color: C.bg,
                  border: 'none',
                  borderRadius: '9px',
                  cursor: 'pointer',
                  fontWeight: 700,
                  transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)'
                }}
              >
                {hardMode ? 'Begin Research Mode' : 'Start Analysis'}
              </button>
              {hasPlayed ? (
                <button
                  onClick={() => setHardMode((current) => !current)}
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '10px',
                    letterSpacing: '2px',
                    padding: '8px 20px',
                    background: 'transparent',
                    color: hardMode ? C.neon : C.red,
                    border: `1px solid ${hardMode ? `${C.neon}30` : '#ff5f5730'}`,
                    borderRadius: '7px',
                    cursor: 'pointer'
                  }}
                >
                  {hardMode ? 'Return to Standard Mode' : 'Enable Research Mode'}
                </button>
              ) : null}
            </div>
          </div>
        ) : null}

        {(state === 'playing' || state === 'reveal') && activeRound ? (
          <div style={{ padding: '22px' }}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              {state === 'playing' ? (
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', color: C.white, fontWeight: 700, letterSpacing: '0.5px' }}>
                  Which sample is <span style={{ color: C.red }}>AI-generated</span>?
                </div>
              ) : (
                <div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '14px', fontWeight: 700, letterSpacing: '0.5px', color: lastResult === 'correct' ? C.neon : C.red }}>
                    {lastResult === 'correct'
                      ? 'Correct classification'
                      : `Incorrect — the AI sample was on the ${activeRound.fakeIsRight ? 'right' : 'left'}`}
                  </div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: C.dim, marginTop: '6px', letterSpacing: '1px' }}>
                    Artifact detected: <span style={{ color: C.cyan }}>{activeRound.artifactType}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="df-samples" style={{ gap: '18px' }}>
              {(['left', 'right'] as const).map((side) => {
                const isFake = (side === 'right' && activeRound.fakeIsRight) || (side === 'left' && !activeRound.fakeIsRight);
                const sample = isFake ? activeRound.fake : activeRound.real;
                const isPickedSide = picked === side;
                const baseBorder = state === 'reveal' ? (isFake ? 'rgba(255,95,87,0.65)' : 'rgba(0,255,170,0.2)') : isPickedSide ? 'rgba(0,255,170,0.35)' : C.border;

                return (
                  <div key={side} className="df-sample-shell" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <motion.button
                      className="df-sample-button"
                      type="button"
                      onClick={() => state === 'playing' && handlePick(side)}
                      whileHover={state === 'playing' ? { y: -3, scale: 1.01 } : undefined}
                      transition={{ duration: 0.2 }}
                      style={{
                        position: 'relative',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        cursor: state === 'playing' ? 'pointer' : 'default',
                        border: `1px solid ${baseBorder}`,
                        background: C.bgAlt,
                        padding: 0,
                        boxShadow:
                          state === 'reveal' && isPickedSide
                            ? `0 0 24px ${lastResult === 'correct' ? C.neon : C.red}22`
                            : '0 18px 40px rgba(0,0,0,0.24)'
                      }}
                    >
                      <img
                        className="df-sample-visual"
                        src={resolveSampleSource(sample.src)}
                        alt={`${side === 'left' ? 'Sample A' : 'Sample B'} - ${sample.label}`}
                        loading="lazy"
                        decoding="async"
                        onError={(event) => {
                          const failedSrc = event.currentTarget.currentSrc || event.currentTarget.src;
                          if (!failedSrc) return;

                          const normalized = normalizeAssetPath(failedSrc);
                          if (normalized === GENERIC_SAMPLE_FALLBACK) return;

                          setBrokenSources((previous) => ({
                            ...previous,
                            [normalized]: true
                          }));
                        }}
                        style={{
                          display: 'block',
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: sample.objectPosition ?? '50% 50%',
                          filter: state === 'reveal' && !isFake ? 'saturate(0.96)' : 'none'
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(180deg, rgba(0,0,0,0.04), rgba(0,0,0,0.24))',
                          pointerEvents: 'none'
                        }}
                      />
                      {state === 'reveal' && isFake ? (
                        <HeatmapReveal active artifacts={activeRound.artifacts} correct={lastResult === 'correct'} />
                      ) : null}
                      <div
                        style={{
                          position: 'absolute',
                          top: 10,
                          left: 10,
                          padding: '5px 8px',
                          borderRadius: '999px',
                          background: 'rgba(3,3,3,0.74)',
                          border: `1px solid ${C.border}`,
                          fontFamily: "'Space Mono', monospace",
                          fontSize: '8px',
                          letterSpacing: '1.5px',
                          color: C.white,
                          textTransform: 'uppercase'
                        }}
                      >
                        {sample.label}
                      </div>
                      {state === 'reveal' ? (
                        <div
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            padding: '8px',
                            textAlign: 'center',
                            background: isFake ? 'rgba(255,95,87,0.82)' : 'rgba(0,255,170,0.2)',
                            fontFamily: "'Space Mono', monospace",
                            fontSize: '10px',
                            fontWeight: 700,
                            letterSpacing: '2px',
                            color: C.white,
                            textTransform: 'uppercase'
                          }}
                        >
                          {isFake ? 'AI generated' : 'Authentic'}
                        </div>
                      ) : null}
                    </motion.button>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '3px', fontWeight: 700, color: state === 'reveal' ? (isFake ? C.red : C.neon) : C.dim }}>
                      {side === 'left' ? 'Sample A' : 'Sample B'}
                    </span>
                  </div>
                );
              })}
            </div>

            {state === 'reveal' ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28 }}
                style={{ marginTop: '16px', padding: '14px 16px', background: C.bgAlt, border: `1px solid ${C.border}`, borderRadius: '10px' }}
              >
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '3px', color: C.cyan, marginBottom: '6px' }}>ANALYSIS REPORT</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: C.text, lineHeight: 1.8 }}>
                  <span style={{ color: C.red, fontWeight: 700 }}>{activeRound.artifactType}</span>
                  {' — '}
                  {activeRound.forensicNote}
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
                  {activeRound.artifacts.map((artifact) => (
                    <span
                      key={artifact.label}
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: '9px',
                        color: C.dim,
                        border: `1px solid ${C.border}`,
                        borderRadius: '999px',
                        padding: '5px 10px',
                        background: 'rgba(255,255,255,0.02)'
                      }}
                    >
                      {artifact.label}
                    </span>
                  ))}
                </div>
              </motion.div>
            ) : null}
          </div>
        ) : null}

        {state === 'complete' ? (
          <div style={{ padding: '40px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '14px' }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '5px', color: statusTone, textTransform: 'uppercase' }}>
              // analysis complete
            </div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '48px', fontWeight: 900, color: C.white, letterSpacing: '-2px', lineHeight: 1 }}>
              {score}
            </div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '3px', color: C.dim, marginTop: '-4px' }}>POINTS</div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '10px', width: '100%', maxWidth: '360px' }}>
              {[
                { label: 'ACCURACY', value: `${Math.round((correctCount / totalRounds) * 100)}%`, color: statusTone },
                { label: 'CORRECT', value: `${correctCount}/${totalRounds}`, color: C.cyan },
                { label: 'BEST STREAK', value: maxStreak, color: C.yellow }
              ].map((item) => (
                <div key={item.label} style={{ background: C.bgAlt, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '14px 8px' }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '20px', fontWeight: 800, color: item.color }}>{item.value}</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '8px', letterSpacing: '2px', color: C.dim, marginTop: '3px' }}>{item.label}</div>
                </div>
              ))}
            </div>

            <div style={{ padding: '8px 22px', borderRadius: '8px', background: `${statusTone}10`, border: `1px solid ${statusTone}25` }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '14px', fontWeight: 800, color: statusTone }}>
                {correctCount >= 8
                  ? 'Forensic specialist'
                  : correctCount >= 6
                    ? 'Detection analyst'
                    : correctCount >= 4
                      ? 'Signal reviewer'
                      : 'Needs retraining'}
              </span>
            </div>

            {!hardMode && correctCount >= 5 ? (
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: C.neon, padding: '6px 16px', background: `${C.neon}08`, border: `1px solid ${C.neon}20`, borderRadius: '6px' }}>
                Research mode unlocked — shorter timer, same dataset
              </div>
            ) : null}

            <div style={{ display: 'flex', gap: '10px', marginTop: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                onClick={() => {
                  if (correctCount >= 5 && !hardMode) setHardMode(true);
                  startGame();
                }}
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '11px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  padding: '11px 28px',
                  background: C.neon,
                  color: C.bg,
                  border: 'none',
                  borderRadius: '9px',
                  cursor: 'pointer',
                  fontWeight: 700
                }}
              >
                {correctCount >= 5 && !hardMode ? 'Enter Research Mode' : 'Play Again'}
              </button>
              <button
                onClick={() => setState('idle')}
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '11px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  padding: '11px 20px',
                  background: 'transparent',
                  color: C.dim,
                  border: `1px solid ${C.border}`,
                  borderRadius: '9px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Menu
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <aside className="df-side-panel grid gap-4 lg:pt-4">
        <motion.div
          initial={{ opacity: 0, x: 18 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[20px] border border-white/10 bg-[rgba(7,7,7,0.82)] px-5 py-5 shadow-[0_18px_40px_rgba(0,0,0,0.22)] backdrop-blur-sm"
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#00c8ff]">How To Play</div>
          <div className="mt-4 rounded-[14px] border border-white/10 bg-white/[0.02] px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-400">Current Cue</span>
              {activeRound ? (
                <span
                  className="rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em]"
                  style={{ color: difficultyTone, borderColor: `${difficultyTone}3d`, background: `${difficultyTone}12` }}
                >
                  {activeRound.difficulty}
                </span>
              ) : null}
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-300">{activeCue}</p>
          </div>
          <div className="mt-4 grid gap-4 text-sm leading-7 text-slate-300">
            {[
              'Read the round cue, compare both portraits, then commit to the synthetic sample.',
              'Prioritize texture, edge quality, and local lighting consistency over overall style.',
              'Use the reveal pass to learn the signal, then apply it to the next round.'
            ].map((step) => (
              <div key={step} className="flex gap-3">
                <span className="mt-[0.42rem] h-2.5 w-2.5 rounded-full bg-[#00ffaa] shadow-[0_0_14px_rgba(0,255,170,0.55)]" />
                <p>{step}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </aside>
    </div>
  );
}

export function DeepfakeDetectorSection() {
  const [launched, setLaunched] = useState(false);
  const { isDesktop, prefersReducedMotion } = useDeviceTier();

  useEffect(() => {
    if (launched || !isDesktop || prefersReducedMotion) return;

    const preload = () => {
      const previewAssets = [
        '/assets/deepfake/real-narasimhachar.jpg',
        '/assets/deepfake/real-irving-berlin.jpg',
        '/assets/deepfake/fake-sukeban.png'
      ];

      previewAssets.forEach((asset) => {
        const image = new Image();
        image.src = asset;
      });
    };

    if ('requestIdleCallback' in window) {
      const handle = (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout?: number }) => number })
        .requestIdleCallback(preload, { timeout: 1500 });
      return () => {
        if ('cancelIdleCallback' in window) {
          (window as Window & { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(handle);
        }
      };
    }

    const timer = window.setTimeout(preload, 600);
    return () => window.clearTimeout(timer);
  }, [isDesktop, launched, prefersReducedMotion]);

  return (
    <section id="deepfake-detector" className="relative z-[2] pb-24 pt-18 sm:pb-28 sm:pt-22">
      <div className="mx-auto flex max-w-[1140px] flex-col gap-10 px-5 sm:px-6 lg:px-8">
        <SectionHeading
          tag="can_you_spot_it"
          title="Detect The Deepfake"
          accent="neon"
          className="max-w-[920px]"
        />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="pt-6 lg:pt-8"
        >
          {!launched ? (
            <div className="rounded-2xl border border-border-bright bg-card/92 p-6 md:p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan">interactive_demo</p>
              <h3 className="mt-3 font-display text-[1.7rem] font-extrabold tracking-[-0.03em] text-white md:text-[2.1rem]">
                Deepfake Detector Game
              </h3>
              <p className="mt-3 max-w-[760px] text-[14px] leading-[1.75] text-text">
                This section is an interactive game. Lightweight by default, and it launches the full detector only when you want to run the forensic rounds and heatmap reveal.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                <span className="rounded-md border border-border-bright bg-bg-alt px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-dim">
                  8 rounds
                </span>
                <span className="rounded-md border border-border-bright bg-bg-alt px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-dim">
                  forensic reveal
                </span>
                <span className="rounded-md border border-border-bright bg-bg-alt px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-dim">
                  adaptive difficulty
                </span>
              </div>

              <button
                type="button"
                onClick={() => setLaunched(true)}
                className="mt-6 inline-flex items-center rounded-md border border-neon bg-neon px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-bg transition-colors hover:bg-neon/90"
              >
                Launch Detector
              </button>
            </div>
          ) : (
            <DeepfakeDetector onExit={() => setLaunched(false)} />
          )}
        </motion.div>
      </div>
    </section>
  );
}
