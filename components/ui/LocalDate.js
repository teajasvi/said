'use client';
import { useState, useEffect } from 'react';

/** Renders a date in the visitor's local timezone (client-side) */
export default function LocalDate({ date }) {
  const [formatted, setFormatted] = useState('');

  useEffect(() => {
    const d = new Date(date);
    setFormatted(d.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    }));
  }, [date]);

  if (!formatted) return null;

  return <span>{formatted}</span>;
}
