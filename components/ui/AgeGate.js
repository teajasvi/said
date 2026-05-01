'use client';
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'tws_age_verified';

/**
 * Age gate / welcome modal — shows once for first-time visitors.
 * Explains the nature of the site and requires 18+ acknowledgement.
 * Consent is stored in localStorage so it only shows once per browser.
 */
export default function AgeGate() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only show if not previously verified
    try {
      const verified = localStorage.getItem(STORAGE_KEY);
      if (!verified) {
        setShow(true);
        // Prevent body scroll while modal is open
        document.body.style.overflow = 'hidden';
      }
    } catch {
      // localStorage unavailable (private browsing etc.) — skip
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {}
    document.body.style.overflow = '';
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="age-gate" role="dialog" aria-modal="true" aria-labelledby="age-gate-title">
      <div className="age-gate__backdrop" />
      <div className="age-gate__card">
        <div className="age-gate__header">
          <h2 className="age-gate__title" id="age-gate-title">
            The Worst <span>Said</span>
          </h2>
        </div>

        <div className="age-gate__body">
          <p className="age-gate__warning">Content Warning</p>
          <p className="age-gate__desc">
            This is an anonymous archive of the worst things ever said — words of cruelty, 
            regret, and trauma shared by real people. Submissions may contain graphic descriptions 
            of emotional abuse, violence, and other deeply distressing content.
          </p>
          <p className="age-gate__desc">
            All content is curated and reviewed, but reader discretion is strongly advised.
          </p>
          <div className="age-gate__divider" />
          <p className="age-gate__age">
            You must be at least <strong>18 years old</strong> to enter this site.
          </p>
        </div>

        <div className="age-gate__actions">
          <button className="age-gate__accept" onClick={handleAccept}>
            I am 18+ — Enter
          </button>
          <a href="https://www.google.com" className="age-gate__leave">
            Leave
          </a>
        </div>
      </div>
    </div>
  );
}
