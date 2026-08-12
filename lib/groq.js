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

APPROVE — A legitimate submission sharing something hurtful/painful said to them. No content warning needed. Most valid submissions get this.

SENSITIVE — Legitimate BUT contains graphic/disturbing language needing a blur overlay:
  • Explicit descriptions of rape, sexual assault, molestation
  • Graphic violence (torture, dismemberment, beating descriptions)
  • Severe racial/homophobic/transphobic slurs used as direct attacks
  • Child abuse descriptions with graphic detail
  • Suicide method descriptions told to the person
  The content is ALLOWED — it just needs a warning before revealing.

REVIEW — You're genuinely uncertain. Use sparingly for true edge cases.

REJECT — NOT a legitimate submission. Reject ALL of the following:
  • GIBBERISH/SPAM: "asdf", "test", "aaaaaa", keyboard mashing, random characters
  • OUT OF CONTEXT / WRONG SITE: Positive messages, "I love you", compliments, jokes, memes, funny quotes — this site is for HURTFUL things said, not sweet/wholesome/funny ones
  • DOXXING: Contains real full names combined with addresses, phone numbers, email addresses, social media handles, workplace names, or school names that could identify a real person
  • SELF-HARM INSTRUCTIONS: Actual step-by-step instructions on how to harm oneself (NOT someone sharing "they told me to kill myself" — that IS legitimate)
  • ADVERTISEMENTS/PROMOTIONS: Links, marketing a brand or item to buy, self-promotion, social media plugs (Do NOT reject just for the word "product" if used as an insult, e.g. "product of incest")
  • SONG LYRICS / COPYPASTA: Recognizable copied content from songs, movies, books, memes, or viral posts — not original experiences
  • NOT A QUOTE: General venting, diary entries, or personal feelings that aren't something someone actually SAID to them (e.g. "I feel so sad today" or "life sucks")
  • POLITICAL RANTS: Political opinions or rants not framed as something someone said to the user
  • TROLLING: Obviously fake or absurd submissions designed to mock the platform
  • RECRUITMENT/RADICALIZATION: Attempting to recruit for groups, ideologies, or causes
  • CONTACT REQUESTS: "DM me", "add me on snap", requesting personal contact

CRITICAL RULES:
1. Words like rape, murder, slurs, abuse ARE EXPECTED. They describe real trauma. NEVER reject for graphic language alone.
2. "My dad told me to kill myself" = APPROVE or SENSITIVE. "Here's how to kill yourself: step 1..." = REJECT.
3. Short submissions are fine. "You're worthless" is a valid 2-word submission.
4. Hurtful quotes containing slurs = SENSITIVE, not REJECT. The slur was said TO them.
5. Lean APPROVE over SENSITIVE. Only SENSITIVE for truly graphic content.
6. Lean REVIEW over REJECT when genuinely uncertain.
7. "I love you" / "you're beautiful" / compliments = REJECT (wrong site, not hurtful).
8. If it reads like a real painful experience someone had, even if poorly written, APPROVE it.
9. Phone numbers, emails, or full real names with identifying details = REJECT (doxxing).
10. If the submission is in a non-English language, still classify it the same way.

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
