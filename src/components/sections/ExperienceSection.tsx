import { motion } from 'motion/react';
import { Linkedin, MapPin } from 'lucide-react';

import { experience, sectionHeadings } from '../../data/content';
import { SectionHeading } from '../shared/SectionHeading';

type ExperienceEntry = (typeof experience)[number];

type ExperienceGroup = {
  org: string;
  logo?: string;
  location: string;
  periodSummary: string;
  roles: ExperienceEntry[];
};

function orgInitials(org: string) {
  const words = org
    .replace(/[^A-Za-z0-9\s]/g, '')
    .split(' ')
    .filter(Boolean);

  return (words[0]?.[0] ?? 'O') + (words[1]?.[0] ?? 'R');
}

function PointerItem({ text }: { text: string }) {
  return (
    <li className="relative pl-3 text-[13px] leading-[1.7] text-text before:absolute before:left-0 before:top-[0.08rem] before:font-mono before:text-[12px] before:text-dim before:content-['-']">
      <span>{text}</span>
    </li>
  );
}

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

export function ExperienceSection() {
  const groups = groupByOrganization(experience);

  return (
    <section id="experience" className="relative z-[2] py-14 md:py-16">
      <div className="mx-auto w-full max-w-[1080px] px-6 md:px-8">
        <SectionHeading
          tag={sectionHeadings.experience.tag}
          title={sectionHeadings.experience.title}
          accent={sectionHeadings.experience.accent}
          className="mb-3"
          titleClassName="text-[clamp(1.55rem,3.5vw,2.35rem)]"
        />

        <p className="mb-6 max-w-[760px] text-[14px] leading-[1.75] text-text">
          Professional history grouped by organization. Hover any role to reveal extended responsibilities.
        </p>

        <div className="relative mx-auto max-w-[980px]">
          <div className="pointer-events-none absolute bottom-5 left-3.5 top-5 hidden w-px bg-border-bright md:block" />

          <div className="space-y-3 md:pl-12">
            {groups.map((group, groupIndex) => (
              <motion.article
                key={group.org}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: groupIndex * 0.05, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -2.5 }}
                className="group relative overflow-hidden rounded-xl bg-card/92 px-4 py-4 shadow-[0_16px_32px_rgba(0,0,0,0.24)] transition-all duration-300 hover:shadow-[0_24px_44px_rgba(0,0,0,0.33)]"
              >
                <span className="pointer-events-none absolute inset-y-0 left-0 w-[3px] bg-neon/85" />

                <div
                  className={`pointer-events-none absolute left-[-34px] top-6 hidden w-4 md:block ${groupIndex === groups.length - 1 ? 'bottom-6' : '-bottom-6'}`}
                  aria-hidden="true"
                >
                  <span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-neon shadow-[0_0_14px_rgba(0,255,170,0.72)]" />
                  <span className="absolute left-1/2 top-[14px] bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-neon/80 via-neon/35 to-neon/18" />
                </div>

                <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="relative mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-bg-alt/90">
                      <span className="font-display text-[12px] font-bold tracking-[0.08em] text-cyan">{orgInitials(group.org)}</span>
                      {group.logo ? (
                        <img
                          src={group.logo}
                          alt={`${group.org} logo`}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full bg-bg-alt object-contain p-1"
                          onError={(event) => {
                            event.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : null}
                    </div>

                    <div>
                      <h3 className="font-display text-[1.14rem] font-bold tracking-[-0.01em] text-white">{group.org}</h3>
                      <p className="mt-1 inline-flex items-center gap-1.5 text-[13px] text-dim">
                        <MapPin className="h-3.5 w-3.5 text-cyan" />
                        {group.location}
                      </p>
                    </div>
                  </div>

                  <span className="rounded-md bg-bg-alt/80 px-2 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-dim">
                    {group.periodSummary}
                  </span>
                </div>

                <div className="relative pl-5">
                  <span className="pointer-events-none absolute left-[5px] top-2 bottom-2 w-px bg-border-bright/70" />

                  <div className="space-y-4">
                    {group.roles.map((entry, roleIndex) => (
                      <div
                        key={`${entry.org}-${entry.role}`}
                        className={`group/role relative rounded-lg border border-transparent px-3 py-3 transition-all duration-300 hover:-translate-y-1 hover:border-neon/25 hover:bg-bg-alt/40 hover:shadow-[0_10px_22px_rgba(0,255,170,0.08)] ${roleIndex > 0 ? 'mt-2.5 border-t-0' : ''}`}
                      >
                        <div className="relative mb-2">
                          <span className="pointer-events-none absolute -left-5 top-[6px] h-2.5 w-2.5 rounded-full border border-border-bright bg-bg-alt transition-all duration-300 group-hover/role:border-neon group-hover/role:bg-neon group-hover/role:shadow-[0_0_10px_rgba(0,255,170,0.75)]" />
                          <h4 className="font-display text-[1.04rem] font-semibold tracking-[-0.01em] text-white">{entry.role}</h4>
                          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-dim">{entry.period}</p>
                        </div>

                        <ul className="space-y-2">
                          <PointerItem text={entry.description} />
                        </ul>

                        {entry.details?.length ? (
                          <div className="overflow-hidden transition-all duration-400 md:max-h-0 md:opacity-0 md:translate-y-1 md:group-hover/role:max-h-[340px] md:group-hover/role:opacity-100 md:group-hover/role:translate-y-0 max-md:mt-3 max-md:max-h-[340px] max-md:opacity-100">
                            <ul className="space-y-1.5 pt-3">
                              {entry.details.map((point: string, detailIndex: number) => (
                                <PointerItem key={`${entry.role}-${detailIndex}`} text={point} />
                              ))}
                            </ul>
                          </div>
                        ) : null}

                        <div className="mt-2.5 flex flex-wrap items-center gap-2">
                          {entry.links?.map((link: { label: string; href: string }) => (
                            <motion.a
                              key={`${entry.role}-${link.label}`}
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ y: -1 }}
                              className="inline-flex items-center gap-1.5 rounded-md bg-bg-alt/80 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-dim transition-colors duration-200 hover:text-cyan"
                            >
                              <Linkedin className="h-3 w-3" />
                              {link.label}
                            </motion.a>
                          ))}

                          {entry.details?.length ? (
                            <span className="hidden font-mono text-[9px] uppercase tracking-[0.12em] text-dim md:inline-block">
                              Hover role for more details
                            </span>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
