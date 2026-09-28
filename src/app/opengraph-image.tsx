import { ImageResponse } from 'next/og';

// Site-wide social preview — what shows up when this portfolio's link is
// shared on LinkedIn, X, or Discord. Without this the link renders bare.
// Edge runtime: ImageResponse tries to fetch its default font over a URL,
// which fails at Node build time but works fine on Edge.
export const runtime = 'edge';

export const alt = 'Aditya Surya Putra — AI & Security Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const C = {
  bg: '#0a0b0e',
  panel: '#101218',
  line: '#1c2029',
  text: '#eaecef',
  muted: '#8a9099',
  dim: '#565c66',
  violet: '#8b7cff',
  cyan: '#45e0d0',
};
const SPECTRAL = 'linear-gradient(90deg,#8b7cff 0%,#6ea8ff 45%,#45e0d0 100%)';

export default function OpengraphImage() {
  const bars = Array.from({ length: 22 });

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: C.bg,
          padding: '72px',
        }}
      >
        {/* Eyebrow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', width: '8px', height: '8px', borderRadius: '99px', background: C.cyan }} />
          <div style={{ display: 'flex', fontSize: '24px', letterSpacing: '0.25em', textTransform: 'uppercase', color: C.dim }}>
            aditya.dev
          </div>
        </div>

        {/* Name + role */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div style={{ display: 'flex', fontSize: '84px', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.05, color: C.text }}>
            Aditya Surya Putra
          </div>
          <div style={{ display: 'flex', fontSize: '32px', color: C.muted, maxWidth: '900px' }}>
            AI Engineer · Cybersecurity Engineer · Software Developer
          </div>
          {/* eq bars, echoes the homepage signal panel */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '48px', marginTop: '8px' }}>
            {bars.map((_, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  width: '10px',
                  height: `${18 + ((i * 37) % 30)}px`,
                  borderRadius: '99px',
                  background: SPECTRAL,
                  opacity: 0.55 + (i % 5) * 0.09,
                }}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: `1px solid ${C.line}`,
            paddingTop: '28px',
            fontSize: '22px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: C.dim,
          }}
        >
          <div style={{ display: 'flex' }}>Medan, Indonesia</div>
          <div style={{ display: 'flex' }}>github.com/VeldanDev</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
