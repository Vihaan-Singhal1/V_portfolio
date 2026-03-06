import type { EffectsTier } from '../../data/content';

export function NoiseOverlay({ tier = 'full' }: { tier?: EffectsTier }) {
  if (tier === 'static') {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[997] opacity-[0.018]"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,255,170,0.02), transparent 28%), repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,170,0.005) 3px, rgba(0,255,170,0.005) 6px)'
        }}
      />
    );
  }

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[998]"
        style={{
          opacity: tier === 'reduced' ? 0.016 : 0.025,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"
        }}
      />
      {tier === 'full' ? (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[997]"
          style={{
            background:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,170,0.008) 2px, rgba(0,255,170,0.008) 4px)'
          }}
        />
      ) : null}
    </>
  );
}
