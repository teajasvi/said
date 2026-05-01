'use client';
import { useState } from 'react';

/**
 * Content warning overlay — blurs the card content and shows a reveal button.
 * Used for submissions containing extreme/graphic language.
 * Does NOT change card dimensions — overlays on top.
 */
export default function ContentWarning({ children }) {
  const [revealed, setRevealed] = useState(false);

  if (revealed) return children;

  return (
    <div className="cw-wrapper">
      {/* Blurred content underneath */}
      <div className="cw-blurred" aria-hidden="true">
        {children}
      </div>

      {/* Overlay */}
      <div className="cw-overlay">
        <div className="cw-overlay__content">
          <span className="cw-overlay__icon">⚠</span>
          <p className="cw-overlay__label">Content Warning</p>
          <p className="cw-overlay__desc">
            This post contains graphic or disturbing language.
          </p>
          <button
            className="cw-overlay__btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setRevealed(true);
            }}
          >
            Reveal
          </button>
        </div>
      </div>
    </div>
  );
}
