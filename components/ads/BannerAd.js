'use client';
import { useEffect, useRef } from 'react';

/**
 * Adsterra 300x250 Banner ad unit.
 */
export default function BannerAd() {
  const containerRef = useRef(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || !containerRef.current) return;
    loaded.current = true;

    // Set atOptions on window
    window.atOptions = {
      key: '987cf03e2b27fe26aef50980620e9d60',
      format: 'iframe',
      height: 250,
      width: 300,
      params: {},
    };

    const script = document.createElement('script');
    script.src = 'https://www.highperformanceformat.com/987cf03e2b27fe26aef50980620e9d60/invoke.js';
    script.async = true;
    containerRef.current.appendChild(script);
  }, []);

  return (
    <div
      ref={containerRef}
      className="banner-ad-wrap"
      style={{ margin: '40px auto', width: '300px', maxWidth: '100%', textAlign: 'center' }}
    />
  );
}
