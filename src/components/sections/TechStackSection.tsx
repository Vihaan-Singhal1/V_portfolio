import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Radar, Cpu } from 'lucide-react';

import {
  accentHex,
  projects,
  sectionHeadings,
  skillTelemetry,
  techStackGroups,
  type TechStackGroup
} from '../../data/content';
import { SectionHeading } from '../shared/SectionHeading';

const skillAliases: Record<string, string[]> = {
  React: ['React.js'],
  'React.js': ['React'],
  'Express.js': ['Express'],
  Express: ['Express.js'],
  'LWE Implementation': ['LWE', 'CRYSTALS-Kyber Family'],
  'CRYSTALS-Kyber Family': ['LWE', 'LWE Implementation'],
  LWE: ['LWE Implementation', 'CRYSTALS-Kyber Family'],
  SQL: ['SQLite', 'MySQL', 'PostgreSQL'],
  JavaScript: ['TypeScript', 'Node.js', 'React'],
  HTML5: ['React', 'Vite'],
  CSS3: ['TailwindCSS'],
  'Firebase / Firestore': ['Firebase'],
  FastAPI: ['REST APIs', 'Python'],
  'REST APIs': ['FastAPI', 'Express.js', 'Flask', 'Node.js'],
  Supabase: ['PostgreSQL', 'REST APIs'],
  PostgreSQL: ['SQL', 'Supabase'],
  Jupyter: ['Python'],
  'scikit-learn': ['Python'],
  TensorFlow: ['Python'],
  PyTorch: ['Python'],
  NumPy: ['Python'],
  Pandas: ['Python'],
  Matplotlib: ['Python'],
  SciPy: ['Python'],
  iOS: ['React Native', 'Flutter'],
  Android: ['React Native', 'Flutter'],
  'Vision Transformers': ['ViT', 'DeiT', 'Fusion Models'],
  'EfficientNet-B0': ['CNN', 'Fusion Models'],
  'Gradient Field CNN': ['CNN', 'Fusion Models'],
  'Fusion Models': ['Vision Transformers', 'EfficientNet-B0', 'Gradient Field CNN']
};

const skillInsights: Record<string, { summary: string; intent: string }> = {
  React: {
    summary: 'Component-driven UI architecture for scalable, highly interactive frontend systems.',
    intent: 'Ship production-grade interfaces with reusable and maintainable patterns.'
  },
  'React.js': {
    summary: 'Flexible ecosystem for rapid interface iteration and modern app composition.',
    intent: 'Prototype quickly while keeping long-term maintainability in place.'
  },
  TypeScript: {
    summary: 'Static typing for reliable API contracts and safer refactors across large code paths.',
    intent: 'Reduce runtime bugs and improve engineering velocity at scale.'
  },
  JavaScript: {
    summary: 'Core runtime language for interactive frontend behavior and full-stack product logic.',
    intent: 'Build responsive product flows with flexible execution across client and server.'
  },
  SQL: {
    summary: 'Structured query language for relational modeling, integrity, and analytics-ready data access.',
    intent: 'Keep data operations reliable and predictable under real usage.'
  },
  TailwindCSS: {
    summary: 'Utility-first styling system enabling consistent UI speed and scalable design tokens.',
    intent: 'Ship polished interfaces quickly while preserving visual consistency.'
  },
  'Node.js': {
    summary: 'Event-driven backend runtime for API handling and real-time workflows.',
    intent: 'Build fast, lightweight services that integrate cleanly across products.'
  },
  'Express.js': {
    summary: 'Lean web framework for API composition, middleware layering, and backend routing.',
    intent: 'Deliver maintainable service endpoints with fast iteration cycles.'
  },
  Express: {
    summary: 'Minimal backend framework for routing, middleware orchestration, and service APIs.',
    intent: 'Ship concise service layers with clear boundaries and fast iteration.'
  },
  Leaflet: {
    summary: 'Interactive geospatial rendering with clustering and map-driven decision support.',
    intent: 'Translate raw location data into actionable visual context.'
  },
  Geohash: {
    summary: 'Spatial indexing strategy for efficient nearby searches and location bucketing.',
    intent: 'Accelerate incident triage and geo-query precision.'
  },
  Python: {
    summary: 'Primary language for AI pipelines, rapid prototyping, and systems integration.',
    intent: 'Bridge model experimentation with practical product delivery.'
  },
  Flask: {
    summary: 'Lean Python web framework for security-focused, service-oriented backend delivery.',
    intent: 'Expose model and cryptographic workflows through reliable API surfaces.'
  },
  FastAPI: {
    summary: 'High-performance Python API framework used for typed backend services and AI orchestration.',
    intent: 'Ship reliable backend endpoints quickly with strong validation and clean contracts.'
  },
  'REST APIs': {
    summary: 'Interface design and integration patterns for predictable, interoperable backend communication.',
    intent: 'Connect frontend, AI, and data systems through stable, testable service boundaries.'
  },
  Supabase: {
    summary: 'Backend platform combining auth, database, and storage for rapid production-ready app delivery.',
    intent: 'Accelerate product shipping while keeping data/auth workflows robust and maintainable.'
  },
  PostgreSQL: {
    summary: 'Relational database engine for transactional consistency, schema rigor, and scalable querying.',
    intent: 'Model production data cleanly and support dependable backend operations.'
  },
  Postman: {
    summary: 'API development workspace for endpoint validation, integration checks, and debugging workflows.',
    intent: 'Increase backend reliability through consistent API verification.'
  },
  LWE: {
    summary: 'Lattice-based post-quantum primitive used for resilient encryption design.',
    intent: 'Harden communication systems against future cryptographic threats.'
  },
  'OAuth 2.0': {
    summary: 'Delegated authentication flow for secure third-party identity integration.',
    intent: 'Maintain trusted access control while simplifying user onboarding.'
  },
  SQLite: {
    summary: 'Lightweight embedded database suited for local-first and edge-aligned persistence.',
    intent: 'Maintain durable storage with minimal operational overhead.'
  },
  bcrypt: {
    summary: 'Adaptive password hashing standard for secure credential storage.',
    intent: 'Protect authentication data against brute-force and offline attacks.'
  },
  Vite: {
    summary: 'Fast build toolchain for modern frontend development and optimized bundles.',
    intent: 'Increase iteration speed while preserving production performance.'
  },
  Vercel: {
    summary: 'Deployment platform optimized for frontend hosting, preview workflows, and global distribution.',
    intent: 'Ship updates quickly with production-grade delivery pipelines.'
  },
  Git: {
    summary: 'Version control backbone for branching, collaboration, and clean release workflows.',
    intent: 'Protect code quality and maintain traceable engineering history.'
  },
  Linux: {
    summary: 'Primary runtime environment for backend services, AI tooling, and operational scripts.',
    intent: 'Ensure consistent deployment and debugging across systems.'
  },
  Ollama: {
    summary: 'Local inference runtime enabling private LLM workflows on-device.',
    intent: 'Deliver AI functionality without external data exposure.'
  },
  'Kokoro TTS': {
    summary: 'Speech synthesis layer for voice-first interactions in assistant systems.',
    intent: 'Create natural voice output with low integration overhead.'
  },
  'Web Speech API': {
    summary: 'Browser-native speech interface for real-time voice input/output.',
    intent: 'Enable accessible conversational UX in web applications.'
  },
  YOLOv8: {
    summary: 'Real-time object detection backbone tuned for low-latency visual inference.',
    intent: 'Power practical detection systems with robust throughput.'
  },
  NumPy: {
    summary: 'Numerical computing foundation for matrix operations and performant ML preprocessing.',
    intent: 'Support efficient model input pipelines and analytical computation.'
  },
  Pandas: {
    summary: 'Data analysis toolkit for feature preparation, cleanup, and tabular experimentation.',
    intent: 'Improve model input quality and research reproducibility.'
  },
  Jupyter: {
    summary: 'Interactive notebook environment for iterative experimentation and result documentation.',
    intent: 'Speed up model exploration while maintaining clear research records.'
  },
  OpenCV: {
    summary: 'Computer vision toolkit for frame-level processing, filtering, and calibration.',
    intent: 'Build dependable perception pipelines for applied AI use cases.'
  },
  PyQt6: {
    summary: 'Desktop UI framework for high-control interfaces and threaded runtime workflows.',
    intent: 'Deliver responsive desktop tooling for production-like environments.'
  },
  'ONNX Runtime': {
    summary: 'Inference engine for portable model deployment across hardware targets.',
    intent: 'Run optimized AI models in real-world, performance-sensitive contexts.'
  },
  'Vision Transformers': {
    summary: 'Attention-based architectures (ViT/DeiT) for robust cross-generator deepfake pattern learning.',
    intent: 'Improve generalization when synthetic artifacts shift between generation models.'
  },
  'EfficientNet-B0': {
    summary: 'Efficient CNN backbone used for compact yet strong visual feature extraction.',
    intent: 'Preserve inference efficiency while keeping reliable deepfake detection signal.'
  },
  'Gradient Field CNN': {
    summary: 'Gradient-sensitive CNN branch designed to capture subtle local artifact inconsistencies.',
    intent: 'Detect texture and edge anomalies that standard appearance-only models can miss.'
  },
  'Fusion Models': {
    summary: 'Multi-branch fusion strategy combining complementary model outputs for stable classification.',
    intent: 'Increase robustness by blending global transformer features with local CNN signals.'
  },
  MobileNetV2: {
    summary: 'Efficient model architecture designed for constrained environments.',
    intent: 'Balance inference quality and resource usage in applied deployments.'
  },
  Tkinter: {
    summary: 'Python desktop GUI toolkit for rapid utility and internal tool development.',
    intent: 'Deliver practical interfaces with minimal complexity overhead.'
  },
  MySQL: {
    summary: 'Relational database platform for structured records and transactional consistency.',
    intent: 'Keep data models dependable for operational workflows.'
  },
  py2app: {
    summary: 'Packaging utility for distributing Python desktop software on macOS.',
    intent: 'Move projects from local scripts to installable production artifacts.'
  },
  'LWE Implementation': {
    summary: 'Applied lattice-based encryption implementation for post-quantum secure communication.',
    intent: 'Integrate future-resilient cryptography into practical software systems.'
  },
  'CRYSTALS-Kyber Family': {
    summary: 'Post-quantum key encapsulation family designed for robust security in next-gen systems.',
    intent: 'Build cryptographic workflows aligned with emerging PQC standards.'
  }
};

function normalizeSkill(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function findGroupForSkill(skill: string, groups: TechStackGroup[]) {
  return groups.find((group) => group.skills.includes(skill));
}

function resolveProjectsForSkill(skill: string) {
  const related = new Set([
    normalizeSkill(skill),
    ...(skillAliases[skill] ?? []).map((entry) => normalizeSkill(entry))
  ]);

  const fromProjects = projects
    .filter((project) => project.tech.some((tech) => related.has(normalizeSkill(tech))))
    .map((project) => project.title);

  const fromTelemetry = skillTelemetry[skill]?.usedIn ?? [];
  return Array.from(new Set([...fromProjects, ...fromTelemetry]));
}

function SkillChip({
  skill,
  accent,
  active,
  onActivate
}: {
  skill: string;
  accent: string;
  active: boolean;
  onActivate: () => void;
}) {
  return (
    <motion.button
      type="button"
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.99 }}
      className="rounded-md border px-2.5 py-1.5 text-left font-mono text-[10px] tracking-[0.06em] transition-all duration-200"
      style={
        active
          ? {
              borderColor: `${accent}aa`,
              backgroundColor: `${accent}12`,
              color: 'var(--white)',
              boxShadow: `0 0 0 1px ${accent}22 inset, 0 0 14px ${accent}18`
            }
          : {
              borderColor: 'var(--border-bright)',
              backgroundColor: 'var(--bg-alt)',
              color: 'var(--text)'
            }
      }
    >
      {skill}
    </motion.button>
  );
}

export function TechStackSection() {
  const defaultSkill = techStackGroups[0]?.skills[0] ?? 'React';
  const [activeSkill, setActiveSkill] = useState(defaultSkill);

  const activeGroup = useMemo(() => findGroupForSkill(activeSkill, techStackGroups), [activeSkill]);
  const activeColor = activeGroup ? accentHex[activeGroup.accent] : accentHex.neon;
  const telemetry = skillTelemetry[activeSkill];
  const projectsUsedIn = useMemo(() => resolveProjectsForSkill(activeSkill), [activeSkill]);

  const summary = skillInsights[activeSkill]?.summary ?? 'Core technology used across practical software and AI systems.';
  const intent = skillInsights[activeSkill]?.intent ?? 'Apply this capability in performant, reliable production workflows.';

  return (
    <section className="relative z-[2] py-14 md:py-16">
      <div className="mx-auto w-full max-w-[1080px] px-6 md:px-8">
        <SectionHeading
          tag={sectionHeadings.stack.tag}
          title={sectionHeadings.stack.title}
          accent={sectionHeadings.stack.accent}
          className="mb-6 md:mb-7"
          titleClassName="text-[clamp(1.55rem,3.5vw,2.35rem)]"
        />

        <p className="mb-6 max-w-[720px] text-[14px] leading-[1.75] text-text">
          Curated capability map prioritized around production project usage. Hover any skill to inspect proficiency and exact project context.
        </p>

        <div className="grid gap-4 lg:grid-cols-[1.32fr_0.88fr] lg:items-start">
          <div className="grid gap-3 sm:grid-cols-2">
            {techStackGroups.map((group, index) => {
              const accent = accentHex[group.accent];

              return (
                <motion.article
                  key={group.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.04, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -2 }}
                  className="rounded-xl border border-border-bright bg-card/92 p-4 transition-all duration-300 hover:border-neon/18 hover:shadow-[0_14px_30px_rgba(0,0,0,0.26)]"
                >
                  <h3 className="font-display text-[1.02rem] font-bold tracking-[-0.01em]" style={{ color: accent }}>
                    {group.title}
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <SkillChip
                        key={skill}
                        skill={skill}
                        accent={accent}
                        active={skill === activeSkill}
                        onActivate={() => setActiveSkill(skill)}
                      />
                    ))}
                  </div>
                </motion.article>
              );
            })}
          </div>

          <motion.aside
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-xl border border-border-bright bg-card/94 p-4 sm:p-5 lg:sticky lg:top-24"
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
                <motion.span
                  animate={{ opacity: [0.35, 1, 0.35] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: activeColor }}
                />
                Live Skill Telemetry
              </p>
              <Radar className="h-4 w-4 text-cyan" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeSkill}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
              >
                <h3 className="font-display text-[clamp(1.4rem,2.6vw,2rem)] font-extrabold leading-[1] tracking-[-0.02em] text-white">
                  {activeSkill}
                </h3>

                <p className="mt-2 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: activeColor }}>
                  <Cpu className="h-3.5 w-3.5" />
                  {activeGroup?.title ?? 'Core Stack'}
                </p>

                <p className="mt-3 text-[13px] leading-[1.72] text-text">{summary}</p>

                <div className="mt-4">
                  <div className="mb-1.5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.12em] text-dim">
                    <span>Capability Strength</span>
                    <span>{telemetry?.level ?? 78}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-bg-alt">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${telemetry?.level ?? 78}%` }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${activeColor}aa, ${activeColor})` }}
                    />
                  </div>
                </div>

                <div className="mt-4 rounded-md border border-border-bright bg-bg-alt/70 p-3">
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-dim">Used In Projects</p>
                  <div className="flex flex-wrap gap-1.5">
                    {projectsUsedIn.length > 0 ? (
                      projectsUsedIn.map((project) => (
                        <span
                          key={`${activeSkill}-${project}`}
                          className="rounded-md border border-border-bright bg-bg px-2 py-1 font-mono text-[9px] uppercase tracking-[0.06em] text-text"
                        >
                          {project}
                        </span>
                      ))
                    ) : (
                      <span className="font-mono text-[10px] text-dim">No mapped project yet.</span>
                    )}
                  </div>
                </div>

                <div className="mt-3 rounded-md border border-border-bright/80 bg-bg-alt/80 p-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-dim">// intent</p>
                  <p className="mt-1.5 text-[12.5px] leading-[1.72]" style={{ color: activeColor }}>
                    {intent}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
