/**
 * Server-side detection of extreme content that warrants a blur overlay.
 *
 * This does NOT block content — it flags approved submissions that contain
 * truly graphic language so the UI can blur them behind a content warning.
 *
 * Only the most extreme terms are included here. Common "worst things said"
 * vocabulary (kill, die, hate, hurt, abuse) is intentionally excluded —
 * blurring those would mean blurring most of the site's content.
 */

// Word-boundary aware patterns for genuinely graphic content
const EXTREME_PATTERNS = [
  // Sexual violence — no trailing \b so compounds like "rapemeat" are caught
  /\brap(?:e[ds]?|ing|ist)/i,
  /\bmolest(?:ed|ing|er|ation)?\b/i,
  /\bsodomiz(?:e[ds]?|ing)\b/i,
  /\bsexual(?:ly)?\s*(?:assault(?:ed|ing)?|abuse[ds]?|violence)\b/i,
  // Graphic physical violence
  /\bmurder(?:ed|ing|er|s)?\b/i,
  /\bstab(?:bed|bing|s)?\b/i,
  /\bstrangl(?:e[ds]?|ing)\b/i,
  /\bbeat(?:ing|en)?\s+(?:to\s+death|unconscious|bloody)\b/i,
  /\btortur(?:e[ds]?|ing)\b/i,
  /\bmutilat(?:e[ds]?|ing|ion)\b/i,
  /\bdismember/i,
  /\bslit\s+(?:your|my|her|his|their)\s+(?:throat|wrist)/i,
  // Severe slurs — the most extreme ones only
  /\bn[i1]gg[ae3]r/i,
  /\bf[a@]gg?[o0]t/i,
  /\bk[i1]k[e3]\b/i,
  /\btr[a@]nn(?:y|ie)/i,
  /\bsp[i1]c\b/i,
  /\bcoon\b/i,
  /\bwetback/i,
  // Child abuse references
  /\b(?:touch(?:ed|ing)?|diddle[ds]?|groom(?:ed|ing)?)\s+(?:a\s+)?(?:child|kid|minor|boy|girl|daughter|son|baby)\b/i,
  // Suicide methods (specific, not just the word "suicide")
  /\bhung?\s+(?:my|your|her|him)self\b/i,
  /\bslit\s+(?:my|your|her|his)\s+wrist/i,
  /\boverdos(?:e[ds]?|ing)\b/i,
];

/**
 * Check if text contains extreme content that should be blurred.
 * Runs server-side only.
 *
 * @param {string} text — the submission text
 * @returns {boolean} — true if the content should be blurred
 */
export function containsExtremeContent(text) {
  if (!text || typeof text !== 'string') return false;

  const normalized = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u200B-\u200F\u2028-\u202F\u2060\uFEFF]/g, '')
    .toLowerCase();

  for (const pattern of EXTREME_PATTERNS) {
    if (pattern.test(normalized)) {
      return true;
    }
  }

  return false;
}
