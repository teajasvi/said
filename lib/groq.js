/**
 * AI Content Moderation via Groq API.
 *
 * Uses Llama 3.3 70B to classify submissions into:
 *   APPROVE   — clean, queue for admin review
 *   SENSITIVE — legitimate but graphic (blur overlay on frontend)
 *   REVIEW    — uncertain, needs admin attention
 *   REJECT    — junk, spam, self-harm instructions, doxxing, not a real submission
 *
 * Falls back gracefully to regex-only if Groq is down or unconfigured.
 */

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';
const TIMEOUT_MS = 8000;

const SYSTEM_PROMPT = `You are a content moderator for "The Worst Said" — a website where people anonymously share the worst things ever said to them by others.

CONTEXT: Users submit real quotes — things said to them by parents, partners, strangers, teachers, etc. The site's entire purpose is to give voice to painful, hurtful, and sometimes graphic words. This is NOT a confession site — users are sharing what OTHERS said TO THEM.

YOUR JOB: Classify each submission into exactly ONE verdict.

VERDICTS:
- APPROVE: A legitimate submission sharing something said to them. No content warning needed. Most submissions should get this.
- SENSITIVE: A legitimate submission BUT contains graphic/disturbing language that should show a content warning (blur overlay). Examples: explicit descriptions of rape, sexual assault, severe slurs, graphic violence descriptions, child abuse descriptions. The content is still ALLOWED — it just needs a warning.
- REVIEW: You are uncertain. Could be spam, an edge case, or something that needs human judgment. Use sparingly.
- REJECT: NOT a legitimate submission. This includes: random gibberish/keyboard spam, self-harm INSTRUCTIONS (not someone sharing "they told me to kill myself" — that's legitimate), actual doxxing (real names + addresses/phone numbers), advertisements/spam, content that is clearly not "something said to me", test submissions like "test" or "asdf".

CRITICAL RULES:
1. Words like rape, murder, slurs, abuse ARE EXPECTED on this site. They describe real trauma. NEVER reject for graphic language alone.
2. "Someone told me to kill myself" = APPROVE or SENSITIVE (legitimate). "Here's how to kill yourself: [instructions]" = REJECT.
3. Short submissions are fine. "You're worthless" is a valid 2-word submission.
4. If someone shares a hurtful quote containing slurs, that is SENSITIVE, not REJECT.
5. When in doubt between APPROVE and SENSITIVE, lean toward APPROVE. Only mark SENSITIVE for truly graphic content.
6. When in doubt between REVIEW and REJECT, choose REVIEW.

Respond with ONLY a JSON object, no markdown, no explanation outside the JSON:
{"verdict": "APPROVE|SENSITIVE|REVIEW|REJECT", "reason": "one short sentence explaining why"}`;

/**
 * Classify a submission using Groq AI.
 *
 * @param {string} text — the submission text
 * @returns {Promise<{verdict: string, reason: string, aiUsed: boolean}>}
 */
export async function classifySubmission(text) {
  const apiKey = process.env.GROQ_API_KEY;

  // If no API key, fall back silently
  if (!apiKey) {
    return { verdict: 'APPROVE', reason: 'AI moderation not configured', aiUsed: false };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: text },
        ],
        temperature: 0.1,
        max_tokens: 150,
        stream: false,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      console.warn(`[Groq] API returned ${response.status}: ${response.statusText}`);
      return { verdict: 'APPROVE', reason: 'AI unavailable, falling back', aiUsed: false };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();

    if (!content) {
      console.warn('[Groq] Empty response from API');
      return { verdict: 'APPROVE', reason: 'AI returned empty response', aiUsed: false };
    }

    // Parse the JSON response
    const parsed = parseAIResponse(content);
    return { ...parsed, aiUsed: true };
  } catch (err) {
    if (err.name === 'AbortError') {
      console.warn('[Groq] Request timed out');
    } else {
      console.warn('[Groq] Error:', err.message);
    }
    return { verdict: 'APPROVE', reason: 'AI error, falling back to regex', aiUsed: false };
  }
}

/**
 * Parse the AI's JSON response, handling edge cases.
 */
function parseAIResponse(content) {
  try {
    // Strip markdown code fences if the model wraps the response
    let cleaned = content;
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
    }

    const parsed = JSON.parse(cleaned);
    const verdict = (parsed.verdict || '').toUpperCase();
    const reason = parsed.reason || 'No reason provided';

    // Validate verdict
    if (['APPROVE', 'SENSITIVE', 'REVIEW', 'REJECT'].includes(verdict)) {
      return { verdict, reason };
    }

    console.warn(`[Groq] Invalid verdict: "${verdict}", defaulting to REVIEW`);
    return { verdict: 'REVIEW', reason: `AI returned invalid verdict: ${verdict}` };
  } catch (err) {
    console.warn('[Groq] Failed to parse response:', content);
    return { verdict: 'REVIEW', reason: 'AI response could not be parsed' };
  }
}
