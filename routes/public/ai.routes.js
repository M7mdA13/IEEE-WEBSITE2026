const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();

const ExCom = require('../../models/ExCom');
const Member = require('../../models/Member');

// ── Tunables (overridable from Railway env without a redeploy of code) ────────
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
// Groq retired both Llama models (llama-3.1-8b-instant, llama-3.3-70b-versatile)
// on 2026-08-16. gpt-oss-120b is their recommended replacement; set GROQ_MODEL
// to openai/gpt-oss-20b if we'd rather have speed than smarts.
const MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
const MAX_MESSAGE_CHARS = 1000;  // longest single question we accept
const MAX_HISTORY_TURNS = 10;    // how many past messages we replay for context
const REQUEST_TIMEOUT_MS = 20000;
const CONTEXT_TTL_MS = 60 * 1000; // how long the leadership names stay cached

const FALLBACK_REPLY = "I'm having trouble connecting right now. Please try again in a moment.";

// Public, unauthenticated endpoint that costs us tokens — keep it cheap to abuse.
const chatLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests',
    message: "You're sending messages a bit fast! Give me a minute to catch up.",
  },
});

/* ── Leadership context ───────────────────────────────────────────────────────
   The ExCom / committee-head names come from Mongo so the bot never goes stale.
   They change maybe once a year, so we cache them briefly rather than running
   two queries on every single chat message.                                    */
let contextCache = { value: null, expiresAt: 0 };

const buildLeadershipContext = async () => {
  if (contextCache.value && Date.now() < contextCache.expiresAt) {
    return contextCache.value;
  }

  const [excoms, heads] = await Promise.all([
    ExCom.find({ isActive: true }).lean(),
    Member.find({ roleType: 'head', isActive: true }).populate('committee').lean(),
  ]);

  // Safely pull a name if it exists AND isn't placeholder seed data
  const getExcom = (matcher, exclude = null) => {
    const p = excoms.find(
      (e) => matcher.test(e.role.toLowerCase()) && (!exclude || !exclude.test(e.role.toLowerCase()))
    );
    return p && !p.name.includes('Firstname') ? `${p.name} - ` : '';
  };
  const getHead = (matcher) => {
    const p = heads.find((h) => h.committee?.slug && matcher.test(h.committee.slug.toLowerCase()));
    return p && !p.name.includes('Firstname') ? `${p.name} - ` : '';
  };

  const value = { getExcom, getHead };
  contextCache = { value, expiresAt: Date.now() + CONTEXT_TTL_MS };
  return value;
};

const buildSystemPrompt = ({ getExcom, getHead }) => `You are the official digital assistant for the IEEE MUST (Misr University for Science and Technology) Student Branch.
You are enthusiastic, professional, and concise. Your goal is to help visitors understand who we are and what we do.
We were founded in 2012, and currently have over 200 members.
Context Rules:
- Impact: We've hosted over 200 events so far.
- Committees: We have 8 specialized committees:
  * AI: ${getHead(/ai/)}Explores artificial intelligence, machine learning, and data science.
  * Web Dev: ${getHead(/web/)}Builds websites, web apps, and modern digital platforms.
  * Embedded Systems: ${getHead(/embed/)}Works on microcontrollers, robotics, and hardware electronics.
  * Cybersecurity: ${getHead(/cyber/)}Focuses on network security, ethical hacking, and data protection.
  * Multimedia: ${getHead(/multi/)}Handles video editing, photography, graphic design, and visual content.
  * PR (Public Relations): ${getHead(/pr/)}Manages external communications, sponsorships, and partnerships.
  * HR (Human Resources): ${getHead(/hr/)}Handles member recruitment, team evaluations, and internal wellness.
  * Marketing: ${getHead(/market/)}Promotes events, manages social media channels, and builds the brand.
- Executive Committee (ExCom): Our leadership board is elected every year and consists of 5 core roles:
  * Chair: ${getExcom(/chair|president/, /vice/)}The main leader and representative of the branch.
  * Vice Chair: ${getExcom(/vice/)}Supports the Chair and manages internal operations.
  * Secretary: ${getExcom(/secr/)}Handles all official documentation, meeting minutes, and records.
  * Treasurer: ${getExcom(/treas/)}Manages funds, budget, and financial tracking.
  * Webmaster: ${getExcom(/web/)}Develops and maintains the branch website.
- Recruitment: We host recruitment phases both online and on-campus periodically. Check our social media for updates.
- What is IEEE?: It's the Institute of Electrical and Electronics Engineers, the world's largest technical professional non-profit organization dedicated to advancing technology for the benefit of humanity.
- IEEE SAC: The Student Activities Committee, a global IEEE group that oversees, empowers, and supports student branches like ours around the world.
- IEEE YP: Young Professionals, an international IEEE group for early-career professionals (up to 15 years post-graduation) offering premium networking, mentoring, and career development opportunities.
- Core Links: Whenever someone asks for links, provide them gracefully using markdown [text](url).
   - About Us: /about
   - Membership: /membership
   - Events: /events
   - Committees: /committees
   - Facebook: https://www.facebook.com/IEEEMUST.egy
   - Instagram: https://www.instagram.com/ieeemust/
   - LinkedIn: https://www.linkedin.com/company/mustieeesb/
   - TikTok: https://www.tiktok.com/@ieee.must.sb

Guidelines:
1. Don't be overly verbose. Use formatting like bullet points or bolding if it helps readability.
2. If asked something unrelated to IEEE, tech, or our branch, gently steer the conversation back.
3. Don't invent fake events, member names, or deadlines. Say you don't have the current info and point them to our social media.
4. Try to sign off with a friendly remark or a subtle call to action (e.g., "Ready to build the future with us?").`;

/* ── History normalisation ────────────────────────────────────────────────────
   The client sends its full bubble list, which opens with scripted welcome
   bubbles. Those aren't real turns, so we drop any assistant messages that come
   before the first user message, then keep only the most recent exchanges.     */
const normaliseHistory = (history) => {
  if (!Array.isArray(history)) return [];

  const turns = history
    .filter((msg) => msg && typeof msg.text === 'string' && msg.text.trim())
    .map((msg) => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.text.trim().slice(0, MAX_MESSAGE_CHARS),
    }));

  const firstUser = turns.findIndex((t) => t.role === 'user');
  if (firstUser === -1) return [];

  return turns.slice(firstUser).slice(-MAX_HISTORY_TURNS);
};

/* ── Groq call with timeout + one retry on transient failures ─────────────── */
const isTransient = (status) => status === 429 || status >= 500;

const callGroq = async (messages, attempt = 0) => {
  let response;
  try {
    response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.6,
        // gpt-oss is a reasoning model: this budget covers reasoning tokens as
        // well as the visible answer, so it's set higher than the ~512 the reply
        // itself needs. Low effort keeps a FAQ bot snappy and cheap. We only
        // read message.content, so any reasoning text is ignored either way.
        max_completion_tokens: 1500,
        reasoning_effort: 'low',
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (err) {
    // Network drop or timeout — worth exactly one more shot
    if (attempt === 0) return callGroq(messages, attempt + 1);
    throw err;
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    if (isTransient(response.status) && attempt === 0) {
      return callGroq(messages, attempt + 1);
    }
    const err = new Error(data.error?.message || `Groq API returned ${response.status}`);
    err.status = response.status;
    throw err;
  }

  return response.json();
};

router.post('/chat', chatLimiter, async (req, res) => {
  try {
    const { history, message } = req.body;

    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Message is required',
        message: 'Please type a question first!',
      });
    }

    if (message.length > MAX_MESSAGE_CHARS) {
      return res.status(400).json({
        success: false,
        error: 'Message too long',
        message: `That's a bit long for me — please keep it under ${MAX_MESSAGE_CHARS} characters.`,
      });
    }

    if (!process.env.GROQ_API_KEY) {
      console.error('AI Route: GROQ_API_KEY is not configured');
      return res.status(503).json({
        success: false,
        error: 'AI is not configured',
        message: FALLBACK_REPLY,
      });
    }

    const leadership = await buildLeadershipContext();

    // Groq accepts the standard OpenAI chat schema, so native fetch is enough —
    // no SDK needed.
    const messages = [
      { role: 'system', content: buildSystemPrompt(leadership) },
      ...normaliseHistory(history),
      { role: 'user', content: message.trim() },
    ];

    const data = await callGroq(messages);
    const reply = data.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      console.error('AI Route: empty completion from Groq', JSON.stringify(data).slice(0, 500));
      return res.status(502).json({ success: false, error: 'Empty reply', message: FALLBACK_REPLY });
    }

    res.json({ success: true, reply });
  } catch (error) {
    const isTimeout = error.name === 'TimeoutError' || error.name === 'AbortError';
    console.error('AI Route Error:', error.status || '', error.message);

    res.status(isTimeout ? 504 : 502).json({
      success: false,
      error: 'Failed to process AI request',
      message: isTimeout
        ? 'That took longer than expected — mind asking me again?'
        : FALLBACK_REPLY,
    });
  }
});

module.exports = router;
