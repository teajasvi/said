'use client';
import { useState, useEffect } from 'react';

/** Renders a date in the visitor's local timezone (client-side) */
export default function LocalDate({ date, showTime = true }) {
  const [formatted, setFormatted] = useState('');

  useEffect(() => {
    const d = new Date(date);
    const dateStr = d.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
    if (showTime) {
      const timeStr = d.toLocaleTimeString('en-US', {
        hour: 'numeric', minute: '2-digit', hour12: true,
      });
      setFormatted(`${dateStr}\n${timeStr}`);
    } else {
      setFormatted(dateStr);
    }
  }, [date, showTime]);

  if (!formatted) return null;

  return (
    <>
      {formatted.split('\n').map((line, i) => (
        <span key={i}>{i > 0 && <br />}{line}</span>
      ))}
    </>
  );
}
