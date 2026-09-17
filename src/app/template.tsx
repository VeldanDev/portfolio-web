'use client';

import { motion, useReducedMotion } from 'framer-motion';

// Runs on every route change (App Router re-mounts template.tsx per navigation),
// so every page enters with the same quiet fade + rise. GPU-only, reduced-motion aware.
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  );
}
