import { type ComponentType } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Github, Linkedin, Mail } from 'lucide-react';

import { footer, navigationLinks, socialLinks } from '../../data/content';
import { DevpostIcon } from '../shared/DevpostIcon';

type SocialIcon = 'linkedin' | 'github' | 'devpost' | 'mail';
type SocialIconComponent = ComponentType<{ className?: string }>;

const iconMap: Record<SocialIcon, SocialIconComponent> = {
  linkedin: Linkedin,
  github: Github,
  devpost: DevpostIcon,
  mail: Mail
};

export function Footer() {
  const quickLinks = navigationLinks.filter((link) => link.id !== 'home');

  return (
    <footer className="relative z-[2] mt-8 border-t border-border-bright/70 bg-[radial-gradient(circle_at_50%_12%,rgba(0,255,170,0.08),transparent_42%),linear-gradient(180deg,rgba(3,3,3,0.98),rgba(6,6,6,0.98))] pb-8 pt-10">
      <div className="mx-auto w-full max-w-[1080px] px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto w-full max-w-[980px] rounded-2xl border border-border-bright bg-card/88 px-5 py-6 sm:px-6 sm:py-7"
        >
          <div className="grid gap-8 md:grid-cols-[1.3fr_0.8fr_0.9fr]">
            <div>
              <p className="font-display text-[1.5rem] font-bold tracking-[-0.02em] text-white">{footer.profileName}</p>
              <p className="mt-2 max-w-[520px] text-[13.5px] leading-[1.8] text-text">{footer.profileSummary}</p>

              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                {socialLinks.map((item, index) => {
                  const Icon = iconMap[item.icon as SocialIcon];
                  return (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      target={item.href.startsWith('mailto:') ? undefined : '_blank'}
                      rel={item.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.8 }}
                      transition={{ delay: 0.08 + index * 0.05, duration: 0.35 }}
                      whileHover={{ y: -2 }}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border-bright bg-bg-alt/90 text-dim transition-all duration-300 hover:border-cyan/45 hover:text-cyan hover:shadow-[0_0_12px_rgba(0,200,255,0.16)]"
                      aria-label={item.label}
                    >
                      <Icon className="h-4 w-4" />
                    </motion.a>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-3 font-display text-[1rem] font-semibold tracking-[-0.01em] text-white">Quick Links</p>
              <div className="grid gap-2">
                {quickLinks.map((link, index) => (
                  <motion.a
                    key={link.id}
                    href={`#${link.id}`}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
                    className="inline-flex items-center font-mono text-[11px] uppercase tracking-[0.14em] text-dim transition-colors duration-200 hover:text-neon"
                  >
                    {link.label}
                  </motion.a>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 font-display text-[1rem] font-semibold tracking-[-0.01em] text-white">Get In Touch</p>
              <div className="space-y-2.5">
                {footer.cta.map((action, index) => (
                  <motion.a
                    key={action.label}
                    href={action.href}
                    target={action.href.startsWith('#') ? undefined : '_blank'}
                    rel={action.href.startsWith('#') ? undefined : 'noopener noreferrer'}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{ delay: 0.12 + index * 0.06, duration: 0.32 }}
                    whileHover={{ y: -1 }}
                    className="group inline-flex w-full items-center justify-between rounded-md border border-border-bright bg-bg-alt px-3.5 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-text transition-all duration-300 hover:border-neon/45 hover:text-neon"
                  >
                    <span>{action.label}</span>
                    <ExternalLink className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mx-auto mt-5 flex w-full max-w-[980px] flex-col gap-2 border-t border-border-bright/60 pt-4 md:flex-row md:items-center md:justify-between">
          <span className="font-mono text-[11px] tracking-[0.08em] text-dim">{footer.left}</span>
          <span className="font-mono text-[11px] tracking-[0.08em] text-dim">
            {footer.rightPrefix} <span className="text-neon">&#10084;</span> {footer.rightSuffix}
          </span>
        </div>
      </div>
    </footer>
  );
}
