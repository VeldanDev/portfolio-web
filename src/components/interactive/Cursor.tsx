'use client';

import { useEffect, useRef } from 'react';

const C = { violet: '#8b7cff', cyan: '#45e0d0' };

// Custom ring cursor. Fine-pointer only (mouse/trackpad) -- never mounts its
// listeners on touch, so phones pay zero cost for this. Position and scale
// are written straight to style.transform via rAF, never React state, so a
// fast mouse never triggers a re-render.
export default function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    document.documentElement.classList.add('has-custom-cursor');

    let rx = -100, ry = -100; // ring position (lags)
    let mx = -100, my = -100; // pointer target
    let scale = 1;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      const el = document.elementFromPoint(mx, my);
      const interactive = el?.closest('a, button, [role="button"], input, textarea');
      scale = interactive ? 1.8 : 1;
    };

    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${scale})`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="cursor-dot pointer-events-none fixed left-0 top-0 z-[100] w-1.5 h-1.5 rounded-full hidden"
        style={{ background: C.cyan }}
      />
      <div
        ref={ringRef}
        aria-hidden
        className="cursor-ring pointer-events-none fixed left-0 top-0 z-[100] w-8 h-8 rounded-full border hidden"
        style={{ borderColor: C.violet, transition: 'scale 0.15s ease' }}
      />
    </>
  );
}
