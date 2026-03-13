import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { useRef } from 'react';
import { Linkedin, MapPin } from 'lucide-react';

import { experience, sectionHeadings } from '../../data/content';
import { D_FAST, EASE_OUT, motionTokens, useShouldReduceMotion } from '../../lib/motion';
import { useDeviceTier } from '../../hooks/useDeviceTier';
import { Reveal, Stagger, StaggerItem } from '../motion/Reveal';
import { SectionHeading } from '../shared/SectionHeading';

type ExperienceEntry = (typeof experience)[number];

type ExperienceGroup = {
  org: string;
  logo?: string;
  location: string;
  periodSummary: string;
  roles: ExperienceEntry[];
};

function groupByOrganization(entries: ExperienceEntry[]): ExperienceGroup[] {
  const grouped = new Map<string, ExperienceGroup>();

  for (const entry of entries) {
    const existing = grouped.get(entry.org);

    if (existing) {
      existing.roles.push(entry);
      continue;
    }

    grouped.set(entry.org, {
      org: entry.org,
      logo: entry.logo,
      location: entry.location,
      periodSummary: entry.period,
      roles: [entry]
    });
  }

  return Array.from(grouped.values()).map((group) => {
    const uniquePeriods = Array.from(new Set(group.roles.map((role) => role.period)));

    return {
      ...group,
      periodSummary: uniquePeriods.length === 1 ? uniquePeriods[0] : `${uniquePeriods.length} roles · grouped history`
    };
  });
}

function DetailBullet({
  text,
  compact = false,
  prefix
}: {
  text: string;
  compact?: boolean;
  prefix?: string;
}) {
  const textClampClass = compact
    ? 'block [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden'
    : 'block';

  return (
    <li className="relative pl-4 text-[13px] leading-[1.8] text-text before:absolute before:left-0 before:top-0 before:text-[13px] before:text-dim before:content-['-']">
      <span className={textClampClass}>
        {prefix ? (
          <span className="mr-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-neon">{prefix} </span>
        ) : null}
        {text}
      </span>
    </li>
  );
}

export function ExperienceSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useShouldReduceMotion();
  const { isDesktop } = useDeviceTier();
  const canHover = isDesktop && !shouldReduceMotion;
  const groups = groupByOrganization(experience);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 70%', 'end 18%']
  });
  const railProgress = useSpring(scrollYProgress, {
    stiffness: 95,
    damping: 24,
    mass: 0.5
  });
  const dotTop = useTransform(railProgress, [0, 1], ['0%', '97%']);
  const trailTop = useTransform(railProgress, [0, 1], ['0%', '92%']);
  const dotScale = useTransform(
    railProgress,
    [0, 0.5, 1],
    shouldReduceMotion ? [1, 1, 1] : [0.96, 1.04, 0.98]
  );
  const haloOpacity = useTransform(
    railProgress,
    [0, 0.5, 1],
    shouldReduceMotion ? [0.15, 0.2, 0.15] : [0.2, 0.3, 0.22]
  );
  const trailOpacity = useTransform(
    railProgress,
    [0, 0.5, 1],
    shouldReduceMotion ? [0.1, 0.16, 0.1] : [0.16, 0.24, 0.18]
  );

  return (
    <section ref={sectionRef} className="relative z-[2] py-14 md:py-16">
      <div className="mx-auto w-full max-w-[1080px] px-6 md:px-8">
        <Reveal variant="fadeUp" amount={0.2}>
          <SectionHeading
            tag={sectionHeadings.experience.tag}
            title={sectionHeadings.experience.title}
            accent={sectionHeadings.experience.accent}
            className="mb-6 md:mb-7"
          />
        </Reveal>

        <div className="relative">
          <div className="pointer-events-none absolute bottom-0 left-[40px] top-[3.1rem] hidden md:block">
            <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-neon/45 via-neon/28 to-neon/16" />
            <div className="absolute inset-y-0 -left-[0.5px] w-[2px] bg-gradient-to-b from-neon/25 via-neon/15 to-transparent blur-[0.7px]" />
            <motion.span
              className="absolute left-0 h-[92px] w-px bg-gradient-to-b from-transparent via-neon/80 to-transparent blur-[0.6px]"
              style={{ top: trailTop, opacity: trailOpacity }}
            />
            <motion.span
              className="absolute -left-[8px] top-0 h-4 w-4"
              style={{ top: dotTop, scale: dotScale }}
            >
              <motion.span
                className="absolute -inset-2 rounded-full bg-neon blur-md"
                style={{ opacity: haloOpacity }}
              />
              <span className="absolute inset-0 rounded-full border border-neon/70 bg-neon shadow-[0_0_14px_rgba(0,255,170,0.52)]" />
              <span className="absolute left-[4px] top-[4px] h-1.5 w-1.5 rounded-full bg-white/70" />
            </motion.span>
          </div>

          <Stagger className="space-y-14 md:space-y-16" stagger={0.07} amount={0.12}>
            {groups.map((group, groupIndex) => (
              <StaggerItem key={group.org} variant="fadeUp">
                <motion.article
                  transition={{ duration: motionTokens.section.duration, delay: groupIndex * 0.02, ease: motionTokens.easeOutExpo }}
                  className="relative md:pl-24"
                >
                <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="relative inline-flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-white/10 bg-bg-alt/80">
                      {group.logo ? (
                        <img
                          src={group.logo}
                          alt={`${group.org} logo`}
                          loading="lazy"
                          className="h-full w-full object-contain p-1"
                          onError={(event) => {
                            event.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : null}
                    </div>

                    <div>
                      <h3 className="font-display text-[1.15rem] font-semibold tracking-[-0.02em] text-white md:text-[1.35rem]">
                        {group.org}
                      </h3>
                      <div className="mt-1 inline-flex items-center gap-1.5 text-[13px] text-dim">
                        <MapPin className="h-3.5 w-3.5 text-cyan" />
                        {group.location}
                      </div>
                    </div>
                  </div>

                  <div className="pt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-dim md:text-right">
                    {group.periodSummary}
                  </div>
                </div>

                <div className="space-y-8 pl-0 md:pl-10">
                  {group.roles.map((entry, roleIndex) => (
                    <motion.div
                      key={`${entry.org}-${entry.role}`}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      whileHover={canHover ? { x: 2, y: -3, scale: 1.005 } : undefined}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: D_FAST, delay: roleIndex * 0.03, ease: EASE_OUT }}
                      className="group/role relative rounded-xl px-3 py-2 transition-colors duration-500 hover:bg-card/30"
                    >
                      <span className="absolute left-[-29px] top-[14px] hidden h-3 w-3 rounded-full border border-white/15 bg-bg transition-all duration-150 group-hover/role:border-neon group-hover/role:bg-neon/16 group-hover/role:shadow-[0_0_0_3px_rgba(0,255,170,0.12),0_0_12px_rgba(0,255,170,0.46)] md:block">
                        <span className="absolute inset-[3px] rounded-full bg-neon opacity-0 transition-opacity duration-150 group-hover/role:opacity-100" />
                      </span>

                      <div className="max-w-[820px] transition-transform duration-300">
                        <h4 className="text-[1.05rem] font-semibold tracking-[-0.02em] text-white transition-colors duration-300 group-hover/role:text-white md:text-[1.1rem]">
                          {entry.role}
                        </h4>

                        <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-dim transition-colors duration-300 group-hover/role:text-dim/90">
                          {entry.period}
                        </div>

                        <div className="mt-4 text-[15px] leading-[1.85] text-text transition-colors duration-300 group-hover/role:text-white/90">
                          <DetailBullet text={entry.description} compact prefix="Scope ->" />
                        </div>

                        {entry.stack?.length ? (
                          <p className="mt-2 font-mono text-[9.5px] uppercase tracking-[0.12em] text-dim [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1] overflow-hidden">
                            Stack {'->'} {entry.stack.join(' · ')}
                          </p>
                        ) : null}

                        {entry.details?.length ? (
                          <div className="overflow-hidden transition-all duration-300 md:max-h-0 md:translate-y-1 md:opacity-0 md:group-hover/role:mt-4 md:group-hover/role:max-h-[320px] md:group-hover/role:translate-y-0 md:group-hover/role:opacity-100 max-md:mt-4 max-md:max-h-[320px] max-md:opacity-100">
                            <ul className="space-y-2">
                              {entry.details.map((detail, detailIndex) => (
                                <DetailBullet key={`${entry.role}-${detailIndex}`} text={detail} />
                              ))}
                            </ul>
                          </div>
                        ) : null}

                        <div className="mt-5 flex flex-wrap items-center gap-5">
                          {entry.links?.map((link) => (
                            <a
                              key={`${entry.role}-${link.label}`}
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-dim transition-colors duration-200 hover:text-cyan"
                            >
                              <Linkedin className="h-3.5 w-3.5" />
                              {link.label}
                            </a>
                          ))}

                          {entry.details?.length ? (
                            <span className="hidden font-mono text-[11px] uppercase tracking-[0.16em] text-dim md:inline-block">
                              Hover role for more details
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                </motion.article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
