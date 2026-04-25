const MAX_WORDS = 50;
const MAX_CHARS = 500; // Safety cap: avg 10 chars/word max
const VALID_TAGS = ['i_said_it', 'said_to_me'];

/** Strip all HTML tags and dangerous content */
export function sanitizeText(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>/g, '')           // Strip HTML tags
    .replace(/&[a-z]+;/gi, '')         // Strip HTML entities
    .replace(/javascript:/gi, '')       // Strip JS protocol
    .replace(/on\w+\s*=/gi, '')        // Strip event handlers
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Strip control chars
    .trim();
}

/** Count words in text */
export function countWords(text) {
  if (!text || typeof text !== 'string') return 0;
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

/** Validate a submission and return errors */
export function validateSubmission(text, tag) {
  const errors = [];

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    errors.push('Text is required.');
    return errors;
  }

  const sanitized = sanitizeText(text);
  const wordCount = countWords(sanitized);

  if (wordCount > MAX_WORDS) {
    errors.push(`Text must be ${MAX_WORDS} words or fewer. You used ${wordCount}.`);
  }

  if (sanitized.length > MAX_CHARS) {
    errors.push(`Text exceeds the maximum character limit.`);
  }

  // Check for excessively long words (anti-abuse)
  const words = sanitized.split(/\s+/);
  const longWord = words.find(w => w.length > 45);
  if (longWord) {
    errors.push('Words cannot exceed 45 characters.');
  }

  if (!VALID_TAGS.includes(tag)) {
    errors.push('Please select a valid tag.');
  }

  return errors;
}

export { MAX_WORDS, MAX_CHARS, VALID_TAGS };
