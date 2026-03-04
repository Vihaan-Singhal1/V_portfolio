import { Suspense, lazy } from 'react';

import { Footer } from './components/layout/Footer';
import { Navbar } from './components/layout/Navbar';
import { CursorGlow } from './components/effects/CursorGlow';
import { Marquee } from './components/effects/Marquee';
import { NoiseOverlay } from './components/effects/NoiseOverlay';
import { ParticleField } from './components/effects/ParticleField';
import { ScrollProgress } from './components/effects/ScrollProgress';
import { HeroSection } from './components/sections/HeroSection';
import { marqueeItems } from './data/content';

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

const ContactSection = lazy(async () => {
  const module = await import('./components/sections/ContactSection');
  return { default: module.ContactSection };
});

function SectionLoader() {
  return <div className="h-20 w-full" aria-hidden="true" />;
}

export default function App() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-bg text-text">
      <ScrollProgress />
      <ParticleField />
      <CursorGlow />
      <NoiseOverlay />

      <Navbar />

      <main className="relative z-[2]">
        <HeroSection />

        <Marquee items={marqueeItems.hero} color="#00ffaa" speed={35} />

        <Suspense fallback={<SectionLoader />}>
          <StatsStrip />
          <AboutTerminal />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <EducationSection />
        </Suspense>

        <Marquee items={marqueeItems.skills} color="#00c8ff" speed={27} reverse />

        <Suspense fallback={<SectionLoader />}>
          <ProjectsSection />
        </Suspense>

        <Marquee items={marqueeItems.philosophy} color="#00ffaa" speed={36} />

        <Suspense fallback={<SectionLoader />}>
          <ExperienceSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <TechStackSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <ContactSection />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
