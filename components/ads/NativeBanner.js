'use client';
import { useEffect, useRef } from 'react';

/**
 * Adsterra Native Banner — renders a native ad unit.
 * Loads the invoke script once and attaches to the container div.
 */
export default function NativeBanner() {
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    const container = document.getElementById('container-7aea4afed1f2f02bb1ffc26ab1d0d53f');
    if (!container) return;

    const script = document.createElement('script');
    script.src = 'https://pl29322191.profitablecpmratenetwork.com/7aea4afed1f2f02bb1ffc26ab1d0d53f/invoke.js';
    script.async = true;
    script.dataset.cfasync = 'false';
    container.parentNode.insertBefore(script, container);
  }, []);

  return (
    <div className="native-banner-wrap" style={{ margin: '40px 0', width: '100%' }}>
      <div id="container-7aea4afed1f2f02bb1ffc26ab1d0d53f"></div>
    </div>
  );
}
