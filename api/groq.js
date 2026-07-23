/* api/groq.js — Vercel Serverless Function.
 *
 * This is the ONLY place the real Groq API key ever exists. It's read
 * from this deployment's environment variables (set in your Vercel
 * project → Settings → Environment Variables), never from the client.
 *
 * The browser (app.js) calls this same-origin endpoint with just
 * { messages }. This function attaches the real key server-side,
 * forwards the request to Groq, and passes the response straight back.
 *
 * Required env var:
 *   GROQ_API_KEY   — your Groq API key (console.groq.com)
 * Optional env var:
 *   GROQ_MODEL     — defaults to "openai/gpt-oss-20b" if not set
 *
 * No npm dependencies: uses the Node runtime's built-in fetch, so this
 * needs no package.json / npm install step, matching the rest of the
 * project.
 */

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed — POST only.' }); return; }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'GROQ_API_KEY is not set in this deployment\'s environment variables.' });
    return;
  }
  const model = process.env.GROQ_MODEL || 'openai/gpt-oss-20b';

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch (e) {
    res.status(400).json({ error: 'Invalid JSON body.' });
    return;
  }
  const messages = body && body.messages;
  if (!Array.isArray(messages)) {
    res.status(400).json({ error: '"messages" array is required.' });
    return;
  }

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify({
        model,
        temperature: 0.6,
        max_completion_tokens: 2200,
        messages
      })
    });
    const text = await groqRes.text();
    res.status(groqRes.status);
    res.setHeader('Content-Type', 'application/json');
    res.send(text);
  } catch (e) {
    res.status(502).json({ error: 'Could not reach Groq: ' + (e && e.message ? e.message : 'unknown error') });
  }
};
