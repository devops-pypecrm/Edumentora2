'use client';

import { ReactNode, useEffect } from 'react';

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Phones and tablets (touch as the main input) keep their normal native
    // scrolling, so the smooth-scroll loop doesn't run there at all.
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let cancelled = false;
    let frame = 0;
    let lenis: { raf: (time: number) => void; destroy: () => void } | null = null;

    // Loaded on demand so phones never download the smooth-scroll library.
    import('lenis').then(({ default: Lenis }) => {
      if (cancelled) return;
      const instance = new Lenis();
      lenis = instance;

      function raf(time: number) {
        instance.raf(time);
        frame = requestAnimationFrame(raf);
      }

      frame = requestAnimationFrame(raf);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      lenis?.destroy();
    };
  }, []);

  return <>{children}</>;
}
