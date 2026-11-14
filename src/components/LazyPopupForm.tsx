'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const PopupForm = dynamic(() => import('@/components/PopupForm'), { ssr: false });

// The popup only appears after a delay, so its code is loaded once the page
// has finished loading instead of during the first load.
export default function LazyPopupForm() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (document.readyState === 'complete') {
      setReady(true);
      return;
    }
    const onLoad = () => setReady(true);
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return ready ? <PopupForm /> : null;
}
