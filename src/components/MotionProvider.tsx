'use client';

import { ReactNode } from 'react';
import { LazyMotion } from 'framer-motion';

const loadFeatures = () => import('./motionFeatures').then((res) => res.default);

// Components import `m as motion` from framer-motion, which is the lightweight
// version of `motion`. This provider loads the animation code for all of them
// in the background, so the animations look the same but the first download
// is smaller.
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <LazyMotion features={loadFeatures}>{children}</LazyMotion>;
}
