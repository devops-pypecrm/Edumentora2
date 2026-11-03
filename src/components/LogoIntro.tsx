'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { LOGO_PATHS } from '@/components/logoIntroPaths';
import styles from '@/components/LogoIntro.module.css';

const RED = '#e81d24';
const NAVY = '#211b5b';

// One continuous pen line: down the left page, up and over the right page,
// round the loop, then back out along the ribbon. Each stroke is a thick
// reveal mask following the centre of its shape, so the traced artwork is
// uncovered rather than redrawn. Delay/duration are seconds from first paint.
const STROKES = [
  { id: 'left', fill: RED, width: 54, delay: 0.2, duration: 0.8, d: 'M480 66C430 38 390 28 351 30L350 170C400 180 450 215 490 280' },
  { id: 'right', fill: RED, width: 54, delay: 1, duration: 1, d: 'M486 280C510 225 560 185 624 170L622 20C560 30 510 60 460 120' },
  { id: 'loop', fill: RED, width: 40, delay: 2, duration: 0.25, d: 'M466 128C452 155 448 175 455 190C462 208 478 218 510 222' },
  { id: 'ribbon', fill: NAVY, width: 54, delay: 2.25, duration: 0.5, d: 'M472 200C495 218 512 205 512 183C511 150 470 112 366 100' },
] as const;

const LETTERS = [
  { id: 'e', fill: RED },
  { id: 'd', fill: RED },
  { id: 'u', fill: RED },
  { id: 'M', fill: NAVY },
  { id: 'e2', fill: NAVY },
  { id: 'n', fill: NAVY },
  { id: 't', fill: NAVY },
  { id: 'o', fill: NAVY },
  { id: 'r', fill: NAVY },
  { id: 'a', fill: NAVY },
] as const;

const LETTERS_START = 2.7;
const LETTER_STAGGER = 0.09;

// Milliseconds from first paint. The logo always plays to MIN_HOLD, then stays
// up while the page finishes loading behind it, but never past MAX_HOLD.
const MIN_HOLD = 4400;
const REDUCED_MOTION_MIN_HOLD = 800;
const MAX_HOLD = 8000;
// Matches the delay on .overlay: past this the CSS failsafe has already hidden it.
const FAILSAFE = 12000;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, Math.max(0, ms)));

const pageLoaded = () =>
  new Promise<void>((resolve) => {
    if (document.readyState === 'complete') resolve();
    else window.addEventListener('load', () => resolve(), { once: true });
  });

export default function LogoIntro() {
  const pathname = usePathname();
  // Decided once per full page load, so in-app navigation never replays it.
  const [visible, setVisible] = useState(() => !pathname?.startsWith('/admin'));
  const [exiting, setExiting] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!visible || !overlay) return;

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = 'hidden';

    // The timeline runs in CSS from first paint, so hydrating late can't
    // restart it; the failsafe animation's clock says how far along it is.
    const elapsed = Number(overlay.getAnimations()[0]?.currentTime ?? performance.now());
    const minHold = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? REDUCED_MOTION_MIN_HOLD : MIN_HOLD;

    let cancelled = false;
    Promise.all([wait(minHold - elapsed), Promise.race([pageLoaded(), wait(MAX_HOLD - elapsed)])]).then(() => {
      if (cancelled) return;
      if (elapsed >= FAILSAFE) setVisible(false);
      else setExiting(true);
    });

    return () => {
      cancelled = true;
      root.style.overflow = previousOverflow;
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      className={`${styles.overlay} ${exiting ? styles.exiting : ''}`}
      aria-hidden="true"
      data-lenis-prevent
      onAnimationEnd={(event) => {
        if (exiting && event.target === event.currentTarget) setVisible(false);
      }}
    >
      <svg className={styles.logo} viewBox="0 0 1000 412" role="presentation">
        <defs>
          {STROKES.map((stroke) => (
            <mask key={stroke.id} id={`logo-intro-${stroke.id}`} maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="412">
              <path
                className={styles.stroke}
                d={stroke.d}
                pathLength={1}
                fill="none"
                stroke="#fff"
                strokeWidth={stroke.width}
                style={{ animationDelay: `${stroke.delay}s`, animationDuration: `${stroke.duration}s` }}
              />
            </mask>
          ))}
        </defs>

        <g className={styles.mark}>
          {STROKES.map((stroke) => (
            <path
              key={stroke.id}
              d={LOGO_PATHS[stroke.id]}
              fill={stroke.fill}
              fillRule="evenodd"
              mask={`url(#logo-intro-${stroke.id})`}
            />
          ))}
        </g>
        {/* Unmasked copy faded in once the pen finishes, so the settled logo is always complete. */}
        <g className={styles.markSettled}>
          {STROKES.map((stroke) => (
            <path key={stroke.id} d={LOGO_PATHS[stroke.id]} fill={stroke.fill} fillRule="evenodd" />
          ))}
        </g>

        {LETTERS.map((letter, index) => (
          <path
            key={letter.id}
            className={styles.letter}
            d={LOGO_PATHS[letter.id]}
            fill={letter.fill}
            fillRule="evenodd"
            style={{ animationDelay: `${LETTERS_START + index * LETTER_STAGGER}s` }}
          />
        ))}
        <path className={styles.trademark} d={LOGO_PATHS.tm} fill={NAVY} fillRule="evenodd" />
      </svg>
    </div>
  );
}
