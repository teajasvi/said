/**
 * Server-side content moderation — zero external dependencies.
 *
 * This module runs entirely on the server (API routes / Edge Functions).
 * It catches the highest-risk content categories that could trigger
 * immediate account termination from Vercel, Supabase, or Cloudflare.
 *
 * Categories:
 *   CRITICAL — CSAM / exploitation terminology  → hard block, never stored
 *   HIGH     — terrorism / violent extremism     → hard block
 *   ELEVATED — self-harm encouragement, severe hate speech → flag for review
 *
 * The approach: normalize the input text (lowercase, strip diacritics,
 * collapse whitespace / special chars), then scan against curated
 * pattern lists.  Patterns use word-boundary awareness to avoid
 * false positives on innocent substrings.
 */

// ─── CATEGORY 1: CSAM & Exploitation (CRITICAL — instant block) ───
// These terms, if present in a submission, mean the content must NEVER
// touch the database. Even as "historical quotes", hosting these exact
// strings risks immediate account termination + legal reporting.
const CRITICAL_PATTERNS = [
  // CSAM terminology & algospeak
  /\bch(?:ild|1ld)\s*p(?:orn|0rn)/i,
  /\bc\s*[.\-_]?\s*p\b/i,                          // "CP" as standalone
  /\bcheese\s*pizza/i,                              // well-known code
  /\bp(?:e|3)do(?:ph[i1]le)?/i,                     // pedo / pedophile
  /\bpdf\s*file/i,                                  // algospeak for pedophile
  /\b(?:minor[\s-]*attracted|m\.?\s*a\.?\s*p)\b/i,  // MAP / minor attracted person
  /\bnomap\b/i,
  /\bl[o0]li(?:ta|con)?\b/i,                        // loli / lolita / lolicon
  /\bshotacon\b/i,
  /\bcub\s*(?:porn|content|material)/i,
  /\bcsam\b/i,
  /\bjailbait\b/i,
  // Solicitation patterns (e.g. "looking for cp", "trade cp", "share cp")
  /\b(?:looking\s*for|want|need|trade|share|send|swap)\s+(?:cp|c\.p\.|csam|cheese\s*pizza|young\s*content)\b/i,
];

// ─── CATEGORY 2: Terrorism & Violent Extremism (CRITICAL — instant block) ───
const TERRORISM_PATTERNS = [
  /\b(?:join|support|pledge)\s+(?:isis|isil|daesh|al[\s-]*qaeda|aq(?:ap|im)|jnim)\b/i,
  /\bisis\b.*\b(?:soldier|fighter|brother|sister|martyr)\b/i,
  /\ballahu\s*akbar\b.*\b(?:kill|bomb|attack|die|martyr)/i,
  /\b(?:heil\s*hitler|sieg\s*heil|1488|14[\s\/]*88)\b/i,
  /\brahowa\b/i,                                    // Racial Holy War
  /\bday\s*of\s*(?:the\s*)?rope\b/i,
  /\brace\s*war\s*now\b/i,
  /\b(?:atomwaffen|terrorgram|the\s*base)\b/i,
  /\bread\s*siege\b/i,
  /\baccelerat(?:e|ionism|ionist)\b.*\b(?:race|white|violence|collapse)\b/i,
  /\bboogaloo\b/i,
];

// ─── CATEGORY 3: Elevated-risk patterns (flag for manual review) ───
// These DON'T block the submission — they flag it so the admin sees a warning.
// Many are legitimate in the context of "worst things said" but need extra eyes.
const ELEVATED_PATTERNS = [
  // Self-harm encouragement (not just mentions)
  { pattern: /\b(?:you\s*should|go\s*ahead\s*and|just)\s*(?:k[i1]ll\s*yours[e3]lf|end\s*it|unalive|self[\s-]*delete|kms|kys)\b/i, label: 'self-harm-encouragement' },
  { pattern: /\b(?:cut|slit)\s*(?:your|ur)\s*(?:wrist|throat|vein)/i, label: 'self-harm-encouragement' },
  { pattern: /\bcatch\s*the\s*bus\b/i, label: 'self-harm-algospeak' },
  // Doxxing patterns
  { pattern: /\b(?:doxx?(?:ed|ing)?)\b/i, label: 'doxxing' },
  { pattern: /\b(?:home\s*address|phone\s*number|social\s*security)\b.*\b(?:post|share|leak|expose|publish)\b/i, label: 'doxxing' },
  // Severe identity-based threats
  { pattern: /\b(?:kill|murder|hang|shoot|gas)\s+(?:all\s+)?(?:the\s+)?(?:jews?|muslims?|blacks?|whites?|gays?|trans|immigrants?)\b/i, label: 'identity-threat' },
  // NCSEI / revenge threats
  { pattern: /\b(?:leak|post|share|send)\s+(?:your|her|his|their)\s+(?:nudes?|pics?|photos?|videos?)\b/i, label: 'ncsei-threat' },
  { pattern: /\brevenge\s*porn\b/i, label: 'ncsei' },
  { pattern: /\bdeepfake/i, label: 'synthetic-media' },
  // Explicit violent threats with specificity
  { pattern: /\bi\s*(?:will|am\s*going\s*to|'m\s*gonna)\s*(?:kill|murder|shoot|stab|bomb)\s+(?:you|him|her|them|everyone)\b/i, label: 'violent-threat' },
  // Struggle snuggle & grape (algospeak for sexual assault)
  { pattern: /\bstruggle\s*snuggle/i, label: 'sa-algospeak' },
  { pattern: /\bgraped?\b/i, label: 'sa-algospeak' },
];

/**
 * Normalize text for pattern matching.
 * Strips accents, collapses repeated chars, removes zero-width chars, etc.
 */
function normalizeForScan(text) {
  return text
    // Normalize Unicode (decompose accents)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Remove zero-width and invisible chars
    .replace(/[\u200B-\u200F\u2028-\u202F\u2060\uFEFF]/g, '')
    // Collapse multiple spaces / special separator chars to single space
    .replace(/[\s\u00A0]+/g, ' ')
    // Lowercase
    .toLowerCase()
    .trim();
}

/**
 * Scan submission text for prohibited content.
 *
 * @param {string} rawText — the user's raw submission text
 * @returns {{ blocked: boolean, reason: string|null, flags: string[] }}
 *   - blocked: true if the content must NOT be stored at all
 *   - reason:  user-facing rejection reason (generic — never reveals filter logic)
 *   - flags:   array of elevated-risk labels for admin review (empty if clean)
 */
export function moderateContent(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    return { blocked: false, reason: null, flags: [] };
  }

  const text = normalizeForScan(rawText);

  // ── Critical: CSAM ──
  for (const pattern of CRITICAL_PATTERNS) {
    if (pattern.test(text)) {
      return {
        blocked: true,
        reason: 'This submission cannot be accepted.',
        flags: ['critical-csam'],
      };
    }
  }

  // ── Critical: Terrorism ──
  for (const pattern of TERRORISM_PATTERNS) {
    if (pattern.test(text)) {
      return {
        blocked: true,
        reason: 'This submission cannot be accepted.',
        flags: ['critical-terrorism'],
      };
    }
  }

  // ── Elevated: flag but allow through to pending queue ──
  const flags = [];
  for (const { pattern, label } of ELEVATED_PATTERNS) {
    if (pattern.test(text)) {
      flags.push(label);
    }
  }

  return { blocked: false, reason: null, flags };
}
