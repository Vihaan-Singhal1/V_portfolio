import { useEffect, useState } from 'react';

type DeviceTier = {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  prefersReducedMotion: boolean;
};

function readTier(): DeviceTier {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      prefersReducedMotion: false
    };
  }

  const width = window.innerWidth;
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1100;

  return {
    isMobile,
    isTablet,
    isDesktop: width >= 1100,
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
  };
}

export function useDeviceTier() {
  const [tier, setTier] = useState<DeviceTier>(() => readTier());

  useEffect(() => {
    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');

    const update = () => {
      setTier(readTier());
    };

    update();

    window.addEventListener('resize', update);
    motionMedia.addEventListener('change', update);

    return () => {
      window.removeEventListener('resize', update);
      motionMedia.removeEventListener('change', update);
    };
  }, []);

  return tier;
}
