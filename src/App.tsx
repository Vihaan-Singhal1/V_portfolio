import { Suspense, lazy, useEffect, useMemo } from 'react';

import { Footer } from './components/layout/Footer';
import { Navbar } from './components/layout/Navbar';
import { CursorGlow } from './components/effects/CursorGlow';
import { Marquee } from './components/effects/Marquee';
import { NoiseOverlay } from './components/effects/NoiseOverlay';
import { ParticleField } from './components/effects/ParticleField';
import { ScrollProgress } from './components/effects/ScrollProgress';
import { HeroSection } from './components/sections/HeroSection';
import { SectionMountGate } from './components/shared/SectionMountGate';
import { marqueeItems, performanceConfig, type EffectsTier, uiConfig } from './data/content';
import { useDeviceTier } from './hooks/useDeviceTier';

const StatsStrip = lazy(async () => {
  const module = await import('./components/sections/StatsStrip');
  return { default: module.StatsStrip };
});

const AboutTerminal = lazy(async () => {
  const module = await import('./components/sections/AboutTerminal');
  return { default: module.AboutTerminal };
});

const EducationSection = lazy(async () => {
  const module = await import('./components/sections/EducationSection');
  return { default: module.EducationSection };
});

const ProjectsSection = lazy(async () => {
  const module = await import('./components/sections/ProjectsSection');
  return { default: module.ProjectsSection };
});

const ExperienceSection = lazy(async () => {
  const module = await import('./components/sections/ExperienceSection');
  return { default: module.ExperienceSection };
});

const TechStackSection = lazy(async () => {
  const module = await import('./components/sections/TechStackSection');
  return { default: module.TechStackSection };
});

const preloadDeepfakeSection = () => import('./components/sections/DeepfakeDetectorSection');

const DeepfakeDetectorSection = lazy(async () => {
  const module = await preloadDeepfakeSection();
  return { default: module.DeepfakeDetectorSection };
});

const ContactSection = lazy(async () => {
  const module = await import('./components/sections/ContactSection');
  return { default: module.ContactSection };
});

function SectionLoader() {
  return <div className="h-20 w-full" aria-hidden="true" />;
}

export default function App() {
  const { isMobile, isTablet, isDesktop, prefersReducedMotion } = useDeviceTier();

  const runtimeEffectsTier = useMemo<EffectsTier>(() => {
    if (uiConfig.motionProfile === 'minimal') {
      return isMobile ? 'static' : 'reduced';
    }
    if (prefersReducedMotion || isMobile) return 'static';
    if (performanceConfig.effectsTier === 'static') return 'static';
    if (isTablet || performanceConfig.effectsTier === 'reduced' || uiConfig.motionProfile === 'balanced') return 'reduced';
    return 'full';
  }, [isMobile, isTablet, prefersReducedMotion]);

  useEffect(() => {
    if (performanceConfig.heavySectionPolicy !== 'intent') return;
    if (!isDesktop || runtimeEffectsTier !== 'full') return;

    const preload = () => {
      void preloadDeepfakeSection();
    };

    if ('requestIdleCallback' in window) {
      const handle = (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout?: number }) => number })
        .requestIdleCallback(preload, { timeout: 1800 });
      return () => {
        if ('cancelIdleCallback' in window) {
          (window as Window & { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(handle);
        }
      };
    }

    const timer = window.setTimeout(preload, 700);
    return () => window.clearTimeout(timer);
  }, [isDesktop, runtimeEffectsTier]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-bg text-text">
      <ScrollProgress />
      <ParticleField tier={runtimeEffectsTier} />
      <CursorGlow enabled={runtimeEffectsTier === 'full'} />
      <NoiseOverlay tier={runtimeEffectsTier} />

      <Navbar />

      <main className="relative z-[2]">
        <HeroSection />

        <Marquee items={marqueeItems.hero} color="#00ffaa" speed={35} />

        <Suspense fallback={<SectionLoader />}>
          <StatsStrip />
          <AboutTerminal />
        </Suspense>

        <SectionMountGate id="education" rootMargin="460px 0px" minHeight={160}>
          <Suspense fallback={<SectionLoader />}>
            <EducationSection />
          </Suspense>
        </SectionMountGate>

        <Marquee items={marqueeItems.skills} color="#00c8ff" speed={27} reverse />

        <SectionMountGate id="experience" rootMargin="380px 0px" minHeight={180}>
          <Suspense fallback={<SectionLoader />}>
            <ExperienceSection />
          </Suspense>
        </SectionMountGate>

        <SectionMountGate id="projects" rootMargin="380px 0px" minHeight={180}>
          <Suspense fallback={<SectionLoader />}>
            <ProjectsSection />
          </Suspense>
        </SectionMountGate>

        <SectionMountGate id="tech-stack" rootMargin="360px 0px" minHeight={180}>
          <Suspense fallback={<SectionLoader />}>
            <TechStackSection />
          </Suspense>
        </SectionMountGate>

        <SectionMountGate
          rootMargin={performanceConfig.heavySectionPolicy === 'nearViewport' ? '320px 0px' : '220px 0px'}
          minHeight={120}
        >
          <Suspense fallback={<SectionLoader />}>
            <DeepfakeDetectorSection />
          </Suspense>
        </SectionMountGate>

        <Marquee
          items={[
            'CNN DEEPFAKE DETECTION',
            'McMASTER AI SOCIETY',
            'GAN ARTIFACT ANALYSIS',
            'FREQUENCY DOMAIN FORENSICS',
            'REAL-TIME CLASSIFICATION'
          ]}
          color="#00ffaa"
          speed={30}
        />

        <SectionMountGate id="contact" rootMargin="360px 0px" minHeight={220}>
          <Suspense fallback={<SectionLoader />}>
            <ContactSection />
          </Suspense>
        </SectionMountGate>
      </main>

      <Footer />
    </div>
  );
}
