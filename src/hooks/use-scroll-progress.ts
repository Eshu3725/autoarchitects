import { useEffect, useRef } from 'react';

/**
 * Reports how far an element has been scrolled past a line in the viewport:
 * 0 when its top reaches the line, 1 when its bottom does. `anchor` is the
 * line's height as a fraction of the viewport (0.6 = 60% down the screen).
 * The callback runs at most once per frame and is meant to write styles
 * directly, so scrolling never re-renders the tree.
 */
export function useScrollProgress<T extends HTMLElement>(onProgress: (p: number, el: T) => void, anchor = 0.6) {
  const ref = useRef<T>(null);
  const cb = useRef(onProgress);
  cb.current = onProgress;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const p = r.height > 0 ? (window.innerHeight * anchor - r.top) / r.height : 0;
      cb.current(Math.min(1, Math.max(0, p)), el);
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', queue);
      window.removeEventListener('resize', queue);
    };
  }, [anchor]);

  return ref;
}

/** True when the visitor has asked the OS for less motion. */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
