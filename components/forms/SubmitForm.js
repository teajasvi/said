'use client';
import { useState, useCallback } from 'react';
import { MAX_WORDS } from '@/lib/validation';

export default function SubmitForm() {
  const [text, setText] = useState('');
  const [saidBy, setSaidBy] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const wordCount = text.trim() ? text.trim().split(/\s+/).filter(w => w.length > 0).length : 0;
  const wordsRemaining = MAX_WORDS - wordCount;
  const isOverLimit = wordCount > MAX_WORDS;

  const handleTextChange = useCallback((e) => {
    setText(e.target.value);
    if (status === 'error') { setStatus('idle'); setMessage(''); }
  }, [status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || isOverLimit) return;

    setStatus('submitting');
    setMessage('');

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          ...(saidBy.trim() && { said_by: saidBy.trim() }),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setStatus('success');
      setMessage('Your words have been submitted. They will appear after review.');
      setText('');
      setSaidBy('');
    } catch {
      setStatus('error');
      setMessage('Network error. Please check your connection and try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center animate-fade-in-slow" style={{ padding: '64px 0' }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '24px', color: 'var(--text-tertiary)' }}>✓</div>
        <h2 className="heading-md" style={{ marginBottom: '12px' }}>Submitted</h2>
        <p className="body-sm" style={{ marginBottom: '40px', lineHeight: '1.7' }}>{message}</p>
        <button
          onClick={() => { setStatus('idle'); setMessage(''); }}
          className="btn btn-secondary"
        >
          Share Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-group" style={{ marginBottom: '32px' }}>
        <label htmlFor="submission-text" className="form-label">Your Words</label>
        <textarea
          id="submission-text"
          className="textarea"
          value={text}
          onChange={handleTextChange}
          placeholder="Write what was said to you..."
          maxLength={600}
          rows={7}
          required
          aria-describedby="word-count"
          disabled={status === 'submitting'}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
          <span className="form-hint" id="word-count">
            {wordCount}/{MAX_WORDS}
          </span>
          {isOverLimit && (
            <span className="form-error">{wordsRemaining * -1} over</span>
          )}
        </div>
      </div>

      {/* Optional: who said it */}
      <div className="form-group" style={{ marginBottom: '32px' }}>
        <label htmlFor="said-by" className="form-label">Who said this to you? <span style={{ fontWeight: '400', color: 'var(--text-tertiary)' }}>(optional)</span></label>
        <input
          id="said-by"
          type="text"
          className="input"
          value={saidBy}
          onChange={(e) => {
            const val = e.target.value.replace(/\s/g, '').slice(0, 20);
            setSaidBy(val);
          }}
          placeholder="parent, friend, stranger..."
          maxLength={20}
          disabled={status === 'submitting'}
          autoComplete="off"
        />
        <span className="form-hint" style={{ marginTop: '4px' }}>One word. Shows as "my ___ said this to me"</span>
      </div>

      {/* Anonymity assurance */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '14px',
          padding: '16px 20px',
          background: 'var(--bg-surface)',
          borderRadius: '8px',
          border: '1px solid var(--border)',
        }}>
          <div>
            <p style={{ fontSize: '0.6875rem', fontWeight: '500', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Anonymous</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', margin: '3px 0 0', lineHeight: '1.5' }}>No names, no accounts, no tracking.</p>
          </div>
        </div>
      </div>

      {message && status === 'error' && (
        <div className="form-error" style={{ marginBottom: '16px' }}>{message}</div>
      )}

      <button
        type="submit"
        className="btn btn-primary"
        disabled={!text.trim() || isOverLimit || status === 'submitting'}
        style={{ width: '100%', padding: '16px' }}
      >
        {status === 'submitting' ? 'Submitting...' : 'Submit'}
      </button>

      <p className="caption text-center" style={{ marginTop: '20px', letterSpacing: '0.06em' }}>
        All submissions are reviewed before appearing.
      </p>
    </form>
  );
}
