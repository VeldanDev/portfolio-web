'use client';

import { useEffect, useRef, type ReactNode } from 'react';

// Pulls the wrapped element a few px toward the pointer while hovered.
// Same gating as Tilt/Cursor: fine-pointer + motion-OK only, so phones
// never attach the listener.
export default function Magnetic({
  children,
  className,
  strength = 0.35,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef(0);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const el = ref.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * strength;
      const dy = (e.clientY - (r.top + r.height / 2)) * strength;
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        el.style.transition = 'none';
        el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(raf.current);
      el.style.transition = 'transform 0.4s cubic-bezier(.23,1,.32,1)';
      el.style.transform = 'translate3d(0, 0, 0)';
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf.current);
    };
  }, [strength]);

  return (
    <div ref={ref} className={`inline-block will-change-transform ${className ?? ''}`}>
      {children}
    </div>
  );
}
