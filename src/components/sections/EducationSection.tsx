import { motion } from 'motion/react';
import { CalendarDays, MapPin, Sparkles, Trophy } from 'lucide-react';

import { accentHex, awards, coursework, sectionHeadings, university } from '../../data/content';
import { SectionHeading } from '../shared/SectionHeading';

export function EducationSection() {
  const award = awards[0];
  const accent = accentHex[award.accent];

  return (
    <section className="relative z-[2] py-14 md:py-16">
      <div className="mx-auto w-full max-w-[1080px] px-6 md:px-8">
        <SectionHeading
          tag={sectionHeadings.education.tag}
          title={sectionHeadings.education.title}
          accent={sectionHeadings.education.accent}
          className="mb-6 md:mb-7"
          titleClassName="tracking-[-0.02em]"
        />

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -2 }}
          className="relative mx-auto max-w-[980px] overflow-hidden rounded-2xl border border-border-bright bg-card/95 p-4 transition-all duration-300 hover:border-neon/20 hover:shadow-[0_0_10px_rgba(0,255,170,0.05)] md:p-5"
        >
          <span className="absolute inset-y-0 left-0 w-[3px] bg-neon" />

          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-[1.25rem] font-extrabold tracking-[-0.02em] text-white md:text-[1.72rem]">
                {university.school}
              </h3>
              <p className="mt-1 font-display text-[0.98rem] font-bold tracking-[-0.01em] text-white md:text-[1.2rem]">
                {university.degree}
              </p>
            </div>
            <div className="rounded-lg border border-border-bright bg-bg-alt px-2.5 py-1.5">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-neon">Education</p>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-4 text-dim">
            <div className="inline-flex items-center gap-2">
              <CalendarDays className="h-3.5 w-3.5 text-cyan" />
              <span className="font-mono text-[10px] md:text-[11px]">{university.period}</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-cyan" />
              <span className="font-mono text-[10px] md:text-[11px]">{university.location}</span>
            </div>
          </div>

          <p className="readable-copy mb-4 max-w-[820px]">{university.honor}</p>

          <div className="mb-4">
            <h4 className="mb-2 font-display text-[1.18rem] font-bold tracking-[-0.015em] text-white md:text-[1.32rem]">Awards</h4>
            <motion.div
              whileHover={{ y: -1 }}
              className="inline-flex items-center gap-2 rounded-full border border-border-bright bg-bg-alt px-3.5 py-1.5"
            >
              <Trophy className="h-3.5 w-3.5 text-neon" />
              <span className="font-mono text-[11px] text-white md:text-[12px]">{award.title}</span>
              <Sparkles className="h-3.5 w-3.5" style={{ color: accent }} />
            </motion.div>
          </div>

          <div>
            <h4 className="mb-2 font-display text-[1.18rem] font-bold tracking-[-0.015em] text-white md:text-[1.32rem]">
              Relevant Coursework
            </h4>
            <div className="flex flex-wrap gap-2">
              {coursework.map((course, index) => (
                <motion.span
                  key={course}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.3, delay: index * 0.025 }}
                  whileHover={{ y: -1 }}
                  className="rounded-full border border-border-bright bg-bg-alt px-3 py-1.5 font-mono text-[10px] text-text md:text-[11px]"
                >
                  {course}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.article>
      </div>
    </section>
  );
}
