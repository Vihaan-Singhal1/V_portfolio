import { useReducedMotion } from 'motion/react';

import { performanceConfig, type EffectsTier } from '../data/content';
import { useDeviceTier } from '../hooks/useDeviceTier';

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export const D_FAST = 0.18;
export const D_MED = 0.55;
export const D_SLOW = 0.9;

export const Y_REVEAL = 16;
export const BLUR_REVEAL = 6;

export type RevealVariantName = 'fadeUp' | 'fadeIn' | 'scaleIn';

const baseReveal = {
  hidden: { opacity: 0 },
  show: { opacity: 1 }
};

const revealMap = {
  fadeIn: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: D_MED, ease: EASE_OUT } }
  },
  fadeUp: {
    hidden: { opacity: 0, y: Y_REVEAL, filter: `blur(${BLUR_REVEAL}px)` },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: D_MED, ease: EASE_OUT } }
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.98 },
    show: { opacity: 1, scale: 1, transition: { duration: D_MED, ease: EASE_OUT } }
  }
} as const;

export function getRevealVariants(variant: RevealVariantName, reduced: boolean) {
  if (reduced) return baseReveal;
  return revealMap[variant];
}

export function getRevealDuration(variant: RevealVariantName) {
  if (variant === 'fadeIn') return D_MED;
  if (variant === 'scaleIn') return D_MED;
  return D_MED;
}

export function getStaggerContainer(stagger = 0.075, delayChildren = 0) {
  return {
    hidden: {},
    show: {
      transition: {
        staggerChildren: stagger,
        delayChildren
      }
    }
  } as const;
}

export function useShouldReduceMotion(effectsTier?: EffectsTier) {
  const reducedFromMotion = useReducedMotion();
  const { prefersReducedMotion } = useDeviceTier();

  const tier = effectsTier ?? performanceConfig.effectsTier;
  const reducedFromTier = tier === 'reduced' || tier === 'static';

  return reducedFromMotion || prefersReducedMotion || reducedFromTier;
}

export const motionTokens = {
  easeOutExpo: EASE_OUT,
  section: {
    duration: D_MED,
    y: Y_REVEAL
  },
  card: {
    duration: 0.42,
    y: 12
  },
  hover: {
    duration: D_FAST,
    y: -2
  },
  nav: {
    duration: 0.2
  },
  fast: {
    duration: 0.24,
    y: 8
  }
};
