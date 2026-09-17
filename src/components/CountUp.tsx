'use client';

import { useEffect, useRef } from 'react';

// Counts from 0 to `to` when scrolled into view. rAF writes textContent (no per-frame
// React state), respects reduced-motion, runs once.
export default function CountUp({ to, suffix = '', duration = 1200 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      node.textContent = to + suffix; return;
    }
    let raf = 0, started = false;
    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        node.textContent = Math.round(eased * to) + suffix;
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !started) { started = true; io.disconnect(); run(); }
    }, { threshold: 0.4 });
    io.observe(node);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to, suffix, duration]);

  return <span ref={ref}>0{suffix}</span>;
}
