import { type ComponentType, type CSSProperties, useState } from 'react';
import { motion } from 'motion/react';
import { Github, Linkedin, Mail, Send } from 'lucide-react';

import { accentHex, contact, sectionHeadings } from '../../data/content';
import { SpotlightCard } from '../shared/SpotlightCard';
import { DevpostIcon } from '../shared/DevpostIcon';
import { SectionHeading } from '../shared/SectionHeading';

type ContactIconComponent = ComponentType<{ className?: string; style?: CSSProperties }>;

const iconByLabel: Record<string, ContactIconComponent> = {
  Email: Mail,
  LinkedIn: Linkedin,
  GitHub: Github,
  Devpost: DevpostIcon
};

function ContactCard({
  label,
  value,
  href,
  accent
}: {
  label: string;
  value: string;
  href: string;
  accent: keyof typeof accentHex;
}) {
  const Icon = iconByLabel[label] ?? Mail;
  const accentColor = accentHex[accent];

  return (
    <SpotlightCard className="rounded-xl" spotlightColor="rgba(0,200,255,0.045)">
      <motion.a
        href={href}
        target={href.startsWith('mailto:') ? undefined : '_blank'}
        rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.25 }}
        className="group relative block overflow-hidden rounded-xl border border-border-bright bg-card/95 px-3.5 py-3.5 text-left transition-all duration-300 hover:border-cyan/25 hover:shadow-[0_0_10px_rgba(0,200,255,0.06)]"
      >
        <span className="absolute left-0 top-0 h-full w-[2px] opacity-80" style={{ backgroundColor: accentColor }} />

        <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border-bright bg-bg-alt">
          <Icon className="h-3.5 w-3.5" style={{ color: accentColor }} />
        </div>

        <p className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: accentColor }}>
          {label}
        </p>
        <p className="mt-1.5 break-all text-[13px] leading-[1.65] text-text">{value}</p>
      </motion.a>
    </SpotlightCard>
  );
}

export function ContactSection() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const subjectLine = encodeURIComponent(
      subject || `Portfolio Inquiry from ${firstName || lastName ? `${firstName} ${lastName}`.trim() : 'Visitor'}`
    );
    const body = encodeURIComponent(
      `First Name: ${firstName || 'N/A'}\nLast Name: ${lastName || 'N/A'}\nEmail: ${email || 'N/A'}\nSubject: ${subject || 'N/A'}\n\n${message || 'Hi Vihaan, I would like to connect.'}`
    );

    window.location.href = `mailto:thevihaansinghal@gmail.com?subject=${subjectLine}&body=${body}`;
  };

  return (
    <section id="contact" className="relative z-[2] py-14 pb-20 md:py-16 md:pb-20">
      <div className="mx-auto w-full max-w-[1080px] px-6 md:px-8">
        <div className="mx-auto max-w-[920px]">
          <SectionHeading
            tag={sectionHeadings.contact.tag}
            title={sectionHeadings.contact.title}
            accent={sectionHeadings.contact.accent}
            className="mb-5 text-center"
            titleClassName="text-[clamp(1.55rem,3.5vw,2.35rem)]"
          />

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mb-6 max-w-[620px] text-center text-[14px] leading-[1.72] text-text"
          >
            {contact.subtitle}
          </motion.p>

          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:gap-5">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <SpotlightCard className="rounded-xl" spotlightColor="rgba(0,255,170,0.04)">
                <div className="rounded-xl border border-border-bright bg-card/95 p-5 md:p-6">
                  <h3 className="font-display text-[1.14rem] font-bold tracking-[-0.01em] text-white md:text-[1.22rem]">Send a quick message</h3>
                  <p className="mt-2 text-[14px] leading-[1.78] text-dim">
                    Share what you are building or hiring for. I usually reply within 24 hours.
                  </p>

                  <form className="mt-5 space-y-4" onSubmit={handleSend}>
                    <div className="grid gap-3.5 sm:grid-cols-2">
                      <label className="space-y-2">
                        <span className="block text-[12px] font-semibold text-white">First Name</span>
                        <input
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Your first name"
                          className="w-full rounded-md border border-border-bright bg-bg-alt px-3.5 py-2.5 font-mono text-[13px] text-text outline-none transition-colors focus:border-neon/45"
                        />
                      </label>

                      <label className="space-y-2">
                        <span className="block text-[12px] font-semibold text-white">Last Name</span>
                        <input
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Your last name"
                          className="w-full rounded-md border border-border-bright bg-bg-alt px-3.5 py-2.5 font-mono text-[13px] text-text outline-none transition-colors focus:border-neon/45"
                        />
                      </label>
                    </div>

                    <label className="space-y-2">
                      <span className="block text-[12px] font-semibold text-white">Email</span>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        type="email"
                        className="w-full rounded-md border border-border-bright bg-bg-alt px-3.5 py-2.5 font-mono text-[13px] text-text outline-none transition-colors focus:border-neon/45"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="block text-[12px] font-semibold text-white">Subject</span>
                      <input
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="What would you like to discuss?"
                        className="w-full rounded-md border border-border-bright bg-bg-alt px-3.5 py-2.5 font-mono text-[13px] text-text outline-none transition-colors focus:border-neon/45"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="block text-[12px] font-semibold text-white">Message</span>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell me about your project or idea..."
                        rows={6}
                        className="w-full resize-none rounded-md border border-border-bright bg-bg-alt px-3.5 py-2.5 font-mono text-[13px] leading-[1.65] text-text outline-none transition-colors focus:border-neon/45"
                      />
                    </label>

                    <motion.button
                      type="submit"
                      whileHover={{ y: -2 }}
                      className="inline-flex w-full items-center justify-center gap-2.5 rounded-md border border-neon bg-neon px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-bg sm:w-auto"
                    >
                      Send Message
                      <Send className="h-3.5 w-3.5" />
                    </motion.button>
                  </form>
                </div>
              </SpotlightCard>
            </motion.div>

            <div className="space-y-3">
              {contact.cards.map((card, index) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.45, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ContactCard label={card.label} value={card.value} href={card.href} accent={card.accent} />
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-xl border border-border-bright bg-card/95 px-3.5 py-3"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-neon">Base</p>
                <p className="mt-1.5 text-[13px] leading-[1.7] text-text">{contact.locationLine}</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
