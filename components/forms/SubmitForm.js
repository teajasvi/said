'use client';
import { useState, useCallback } from 'react';
import { MAX_WORDS } from '@/lib/validation';

export default function SubmitForm() {
  const [text, setText] = useState('');
  const [tag, setTag] = useState('');
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
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
    if (!text.trim() || !tag || isOverLimit) return;

    setStatus('submitting');
    setMessage('');

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim(), tag }),
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
      setTag('');
    } catch {
      setStatus('error');
      setMessage('Network error. Please check your connection and try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center animate-fade-in" style={{ padding: '48px 0' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✓</div>
        <h2 className="heading-md" style={{ marginBottom: '12px' }}>Submitted</h2>
        <p className="body-lg" style={{ marginBottom: '32px' }}>{message}</p>
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
      <div className="form-group" style={{ marginBottom: '24px' }}>
        <label htmlFor="submission-text" className="form-label">Your Words</label>
        <textarea
          id="submission-text"
          className="textarea"
          value={text}
          onChange={handleTextChange}
          placeholder="Write what was said..."
          maxLength={600}
          rows={6}
          required
          aria-describedby="word-count"
          disabled={status === 'submitting'}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="form-hint" id="word-count">
            {wordCount}/{MAX_WORDS} words
          </span>
          {isOverLimit && (
            <span className="form-error">Too many words ({wordsRemaining * -1} over)</span>
          )}
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: '32px' }}>
        <span className="form-label">Who said it?</span>
        <div className="tag-selector">
          <button
            type="button"
            className={`tag-option ${tag === 'i_said_it' ? 'tag-option--selected' : ''}`}
            onClick={() => setTag('i_said_it')}
            disabled={status === 'submitting'}
            aria-pressed={tag === 'i_said_it'}
          >
            <div className="tag-option__label">I said it</div>
            <div className="tag-option__desc">Words I spoke</div>
          </button>
          <button
            type="button"
            className={`tag-option ${tag === 'said_to_me' ? 'tag-option--selected' : ''}`}
            onClick={() => setTag('said_to_me')}
            disabled={status === 'submitting'}
            aria-pressed={tag === 'said_to_me'}
          >
            <div className="tag-option__label">It was said to me</div>
            <div className="tag-option__desc">Words I received</div>
          </button>
        </div>
      </div>

      {message && status === 'error' && (
        <div className="form-error" style={{ marginBottom: '16px' }}>{message}</div>
      )}

      <button
        type="submit"
        className="btn btn-primary"
        disabled={!text.trim() || !tag || isOverLimit || status === 'submitting'}
        style={{ width: '100%', padding: '16px' }}
      >
        {status === 'submitting' ? 'Submitting...' : 'Submit'}
      </button>

      <p className="caption text-center" style={{ marginTop: '16px' }}>
        All submissions are reviewed before appearing publicly.
      </p>
    </form>
  );
}
