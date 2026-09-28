'use client';

import { useEffect, useRef, type ReactNode } from 'react';

// 3D tilt on pointer move, GPU transform only. Fine-pointer + motion-OK
// gated up front, so touch devices never attach a listener at all --
// children just render flat and static, zero extra cost on phones.
export default function Tilt({
  children,
  className,
  max = 8,
  scale = 1.015,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  scale?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const elRef = useRef<HTMLDivElement>(null);
  const raf = useRef(0);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const wrap = wrapRef.current;
    const el = elRef.current;
    if (!wrap || !el) return;

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;   // 0..1
      const py = (e.clientY - r.top) / r.height;   // 0..1
      const rx = (0.5 - py) * max * 2;
      const ry = (px - 0.5) * max * 2;
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        el.style.transition = 'none';
        el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale3d(${scale}, ${scale}, ${scale})`;
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(raf.current);
      el.style.transition = '';
      el.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    };

    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerleave', onLeave);
    return () => {
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf.current);
    };
  }, [max, scale]);

  return (
    <div ref={wrapRef} className={`tilt-wrap ${className ?? ''}`}>
      <div ref={elRef} className="tilt-el h-full">
        {children}
      </div>
    </div>
  );
}
