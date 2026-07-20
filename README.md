# AceApt AI

**An AI aptitude tutor that speaks, teaches, and adapts live.**

Instead of a chat window, AceApt AI is a spoken, one-line-at-a-time conversation between two living presences — **Ace**, the tutor, and **You** — each rendered as a small procedural "ice planet" that visibly reacts as it speaks. It teaches placement-exam aptitude topics end-to-end by voice, and includes a Groq-powered live mode that generates a fresh, never-repeated practice problem on demand at three difficulty levels.

---

## 1. The problem this solves

Aptitude prep for placement exams is almost universally **static and text-heavy** — question banks, PDFs, and mock tests (see: IndiaBIX, PrepInsta, GeeksforGeeks). It's also mostly **one-size-fits-all**: the same explanation at the same pace for a first-timer and someone brushing up before an interview. AceApt AI's premise is that *how* a concept is explained — spoken, paced, and narrated like a patient friend rather than read off a page — measurably changes whether it sticks, and that an AI tutor should be able to generate fresh practice on demand instead of a finite bank of questions.

## 2. What it is / core features

- **Two curated, fully-authored lessons** (Beginner: Simple Interest · Intermediate: Permutation & Combination) — real two-voice conversations, not lectures, with word-synced captions and a persistent "Working" card that accumulates every calculation as the lesson progresses.
- **Ace, visualized as a living particle-canvas planet** — cracks, drifting fragments, and a glowing core, entirely custom-built on `<canvas>` (no libraries). It breathes when idle and flares in sync with real speech events while talking.
- **Live mode (Groq-powered)** — pick Simple, Moderate, or Tough, and Ace generates a brand-new problem from a rotating pool of ~17 aptitude topics, then teaches it as a guided walkthrough (never a quiz-style interrogation), with a light, optional "want to guess?" moment before each final answer.
- **A local, independent arithmetic verifier** for live-generated math (see §7) — because LLM arithmetic reliability drops precisely on the kind of multi-step, larger-number problems "Tough" mode asks for, and this product is a *math* tutor.
- **Session resume, screen-reader support, and graceful degradation** on flaky connections or unsupported browsers — see §7 and §8 for specifics.

## 3. Try it

No build step, no server framework — it's a static site.

```
# from the project folder:
python3 -m http.server 8000
# then open http://localhost:8000
```

...or just open `index.html` directly in a modern browser.

The two scripted lessons work immediately, with **no API key required**. Live mode needs a free Groq API key (pasted client-side, kept only in your browser — get one at console.groq.com) since it calls Groq directly from the browser.

## 4. Tech stack

- **HTML / CSS / JavaScript** — no framework, no build step, no dependencies.
- **Canvas API** — the entire Ace/You planet visualization: procedural fracture generation, Fibonacci-sphere particle distribution, real-time lighting, all hand-written.
- **Web Speech API** (`SpeechSynthesis`) — both voices, word-boundary-synced captions, with resilience layered on top for known Safari/iOS bugs (see §8).
- **AI APIs** — Groq (`openai/gpt-oss-20b` / `120b`, OpenAI-compatible endpoint) powers the live tutor; nothing else calls a network API.

## 5. AI tools used, and how

Two distinct, deliberately separate uses of AI in this project:

1. **Claude, for building the product itself** — the entire app (design system, the canvas planet engine, the speech-sync conversation engine, the live-chat integration, and this accessibility/reliability/verification pass) was built end-to-end in conversation with Claude, iterating on both the code and the product decisions (e.g., moving from a quiz-style tutor to a guided-walkthrough style, in response to research on how AI tutoring affects learning outcomes).
2. **Groq (`gpt-oss` models), inside the product** — this is the actual in-app AI feature: it generates fresh aptitude problems and teaches them conversationally in live mode. It is prompted with a fairly detailed system prompt enforcing tone, turn length, difficulty, and a strict JSON output contract (see `SYSTEM_PROMPT` in `app.js`).

## 6. Architecture & implementation decisions

- **Split into `index.html` / `style.css` / `planet.js` / `app.js`** rather than one monolithic file. `planet.js` is a fully generic, reusable "living planet" component (palette + DOM refs passed in) — the same code drives all four planet instances (Ace and You, on the start screen and in the live app).
- **Client-only, no backend, by design** — trivial to deploy anywhere static (Vercel/Netlify/GitHub Pages/plain hosting), zero server cost, zero server attack surface. The tradeoff is that live mode is **bring-your-own-key (BYOK)**: each visitor needs their own free Groq key. This was a conscious choice, not an oversight — the alternative (a hosted backend proxy holding a shared key) is the natural next step and is called out explicitly in §8.
- **A dedicated local arithmetic verifier (`safeEvalArith` / `verifyBoardLines` in `app.js`)** sits between Groq's output and what gets shown. It's deliberately narrow and **fails closed**: it only ever checks lines that are pure numeric arithmetic (e.g. `25 ÷ 100 × 200 = 50`), and silently skips anything symbolic, algebraic, or ambiguous rather than risk a false alarm. When it does catch a real mismatch, it quietly asks Ace to double-check that specific step before continuing — the same "wait, let me re-check" instinct already hand-authored into the Intermediate lesson (its committee-selection answer, 246, deliberately isn't among the listed options — Ace catches that and verifies rather than forcing a wrong match), now applied automatically to AI-generated content too.
- **Accessibility**: a dedicated `aria-live` region mirrors every spoken line as plain text for screen readers (once per line, not per animated word); the Working panel and status line are live regions; every icon-only control has a matching `aria-label`; the previously non-focusable "switch level" control is now a real `<button>`.
- **Browser resilience**: Safari/WebKit is documented to sometimes return an empty voice list on first load and to silently stop `speechSynthesis` when a tab is backgrounded — both are worked around (retry timers on voice loading; a `visibilitychange` listener that nudges speech back to life; a hard timeout so the conversation can never get permanently stuck mid-line).
- **Session resume**: scripted-lesson progress is saved to `localStorage` after every line, and the start screen offers to resume exactly where you left off.

## 7. Known limitations & roadmap

Being upfront about what's next, rather than pretending it's finished:

- **BYOK friction** — live mode needs a personal Groq key; a small serverless proxy (holding one shared key server-side) is the natural fix and doesn't require re-architecting anything else.
- **No accounts or cross-device history** — `localStorage` resume covers "closed the tab by accident," not "switched devices."
- **Only two hand-authored lessons** — live mode covers breadth (any of ~17 topics, on demand); the roadmap is to grow the curated, fully-produced lesson set the same way these two were built.
- **The arithmetic verifier checks numeric correctness, not full reasoning correctness** — it's a real, tested safety net for the highest-risk failure mode (arithmetic slips on multi-step problems), not a claim that every generated explanation is pedagogically perfect.

## 8. Project structure

```
.
├── index.html      — markup, accessibility wiring, links the two scripts below
├── style.css       — the entire visual design system (ice palette, layout, motion)
├── planet.js       — the reusable living-planet particle/canvas component
├── app.js          — lesson content, the two-voice conversation engine,
│                     the local math verifier, and the Groq live-chat integration
└── README.md       — this file
```

---

*Built for AccioBuild 2026.*
