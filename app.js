/* ===================================================================
   app.js — lessons, the two-voice conversation engine, and the
   Groq-powered live tutor. See README.md for the architecture notes.
   =================================================================== */
(function(){
"use strict";

/* ==================== CONFIG — set your keys here ==================== */
const GROQ_API_KEY  = '';   // ← paste your Groq key (gsk_…) before deploying
const GROQ_MODEL    = 'openai/gpt-oss-20b';  // or 'openai/gpt-oss-120b', 'llama-3.3-70b-versatile'
/* ===================================================================== */


/* ============ BEGINNER — Simple Interest ============ */
const BEGINNER = [
  { w:'ace', t:"Hey — come sit with me for a minute. I want to show you something, and I promise it's gentler than it sounds." },
  { w:'you', t:"Okay. Every time someone says 'simple interest' my brain just kind of wanders off." },
  { w:'ace', t:"Mm, I know that feeling. So we'll go slow — no rush, and I won't assume you know a thing. Just you and me, figuring it out." },
  { w:'you', t:"I'd like that. Okay — show me." },
  { w:'ace', t:"So picture this. You lend me ten thousand rupees, just for a year, because you're kind like that." },
  { w:'you', t:"Ha. Go on." },
  { w:'ace', t:"A year later I hand you back ten thousand eight hundred. You gave ten thousand — you got a little more back. That small extra, the eight hundred, is what we call interest.", bt:"What interest is", b:["₹10,800 − ₹10,000","= ₹800   →   the interest"] },
  { w:'you', t:"Oh. So it's literally just the extra bit on top." },
  { w:'ace', t:"That's all it is. A little thank-you for letting someone hold your money for a while. Nothing scary about it." },
  { w:'you', t:"But why should you get anything extra? You got your money back." },
  { w:'ace', t:"Good question — I love that you asked. Think of lending your bike for a whole year. The whole time, you can't ride it, right?" },
  { w:'you', t:"Right. It's just gone." },
  { w:'ace', t:"Money's the same. While I've got yours, you can't use it. So the extra is me saying thank you for going without it. That's really all interest is." },
  { w:'ace', t:"Little heads-up — there are two kinds. Simple, and compound. We're only touching simple today. Compound's the wilder one, another day." },
  { w:'you', t:"What's the actual difference though?" },
  { w:'ace', t:"Just one line. Simple interest is only ever counted on your original money. Compound keeps piling interest onto old interest, so it snowballs. Simple stays calm and steady — and that's exactly why they call it simple." },
  { w:'you', t:"Calm and steady. Okay, I can get behind that." },
  { w:'ace', t:"So — five gentle little words to know first. The first is Principal. Fancy name, simple thing. It just means your original money. You lend twenty thousand, your principal is twenty thousand. It never counts the extra — only what you started with.", bt:"Principal", b:["Principal (P)  =  the original money"] },
  { w:'you', t:"So principal is like the 'before' number." },
  { w:'ace', t:"Yes — that's exactly it. Next, Interest. That's the extra we just met. If you earn three thousand on top of twenty thousand, the interest is only that three thousand — not the whole pile." },
  { w:'ace', t:"Then Rate. It just tells you how much interest each year, and it always wears a little percent sign. Five, eight, ten percent. And percent simply means out of a hundred — hold that thought softly, we'll want it soon." },
  { w:'you', t:"Out of a hundred. Got it." },
  { w:'ace', t:"Then Time — how long the money's away for. Two years, twenty years. And if they hand you months, just turn them into years. Six months is six over twelve, so half a year — zero point five.", bt:"Months to years", b:["6 months  =  6 ÷ 12  =  0.5 years"] },
  { w:'ace', t:"And the last one, Amount. That's just the total once you add the interest back on. Ten thousand plus two thousand is twelve thousand. Principal plus interest, and you're done.", bt:"Amount", b:["Amount = Principal + Interest","₹10,000 + ₹2,000  =  ₹12,000"] },
  { w:'ace', t:"Tiny check, just for us. The original money — what do we call it?" },
  { w:'you', t:"Principal." },
  { w:'ace', t:"The extra on top?" },
  { w:'you', t:"Interest." },
  { w:'ace', t:"And everything together at the end?" },
  { w:'you', t:"Amount. Wait — I actually know these." },
  { w:'ace', t:"See? I told you you'd be fine." },
  { w:'ace', t:"Okay — here's the heart of it. The formula. Simple interest equals principal times rate times time, all divided by a hundred. That's it. That's the whole thing.", bt:"The formula", b:["SI  =  ( P × R × T )  ÷  100"] },
  { w:'you', t:"Wait — why do we divide by a hundred? That part always loses me." },
  { w:'ace', t:"Because the rate is a percent, remember? Eight percent just means eight out of a hundred. So dividing by a hundred is only turning that percent back into a normal number. That's the whole reason — nothing hidden." },
  { w:'you', t:"Ohh. Okay, that finally makes sense." },
  { w:'ace', t:"And if the letters ever feel cold, just whisper it as a sentence. Money, times rate, times time, over a hundred. You'll never lose it again." },
  { w:'ace', t:"Let me make it click with the softest numbers ever. Principal a hundred, rate ten percent, one year. A hundred times ten times one, over a hundred — that's ten. So you earn ten rupees.", bt:"₹100, one year", b:["SI  =  100 × 10 × 1 ÷ 100","=  ₹10"] },
  { w:'ace', t:"Now stretch it to two years, and change nothing else. You get twenty.", bt:"Two years", b:["2 years  →  SI = ₹20","( + ₹10 every year )"] },
  { w:'you', t:"So each year just adds another ten?" },
  { w:'ace', t:"Exactly. It never speeds up — the same gentle ten, every single year. That's the whole soul of simple interest." },
  { w:'ace', t:"Before we try a real one, let me keep you safe from the little traps. Don't mix up principal and amount. Don't forget the divide by a hundred. And read 'per annum' properly." },
  { w:'you', t:"What does 'per annum' even mean?" },
  { w:'ace', t:"Only 'per year.' Eight percent per annum is just eight percent every year. That's the whole translation — I promise it's that small." },
  { w:'you', t:"Oh thank goodness. I thought it was something complicated." },
  { w:'ace', t:"Okay — you're ready. Here's the real one, up on the card. Someone lends money at eight point five percent per annum, simple interest. After twenty years, the interest comes out six thousand three hundred more than the loan itself. Find the loan. The options are eight thousand five hundred, ten thousand, twelve thousand, or nine thousand.", bt:"The question", b:["Rate = 8.5% per year","Time = 20 years","Interest = Loan + ₹6,300","Find:  P = ?"] },
  { w:'you', t:"Okay, that sentence stung a little." },
  { w:'ace', t:"I know — it's meant to. So we go slow, together. First, don't touch a single number yet. Just gather what we know. The loan? We don't know it, so we'll call it P. The rate is eight point five. The time is twenty years." },
  { w:'ace', t:"Now the sneaky line — the interest is six thousand three hundred more than the loan. A lot of people read that as 'the interest is six thousand three hundred.' But it isn't." },
  { w:'you', t:"Wait — isn't it, though?" },
  { w:'ace', t:"That's the trap. Try it with a pretend loan. If the loan were ten thousand, then six thousand three hundred more than the loan means ten thousand plus six thousand three hundred — so sixteen thousand three hundred. See the difference? So really, the interest equals the loan plus six thousand three hundred.", bt:"Reading the sentence", b:["Interest  =  P + 6,300"] },
  { w:'you', t:"Ahh. More than the loan. Not just the number." },
  { w:'ace', t:"Now you've got it. So let's use our formula. Interest is P times eight point five times twenty, over a hundred. Eight point five times twenty is a hundred and seventy. So it's a hundred and seventy P over a hundred — which softens to one point seven P.", bt:"Into the formula", b:["SI = ( P × 8.5 × 20 ) ÷ 100","= 170P ÷ 100  =  1.7P"] },
  { w:'ace', t:"Here's the pretty part. We've now said the same interest two ways. From the sentence, it's P plus six thousand three hundred. From the formula, it's one point seven P. They're the same thing — so we set them equal. One point seven P equals P plus six thousand three hundred.", bt:"Same thing, two ways", b:["1.7P  =  P + 6,300"] },
  { w:'you', t:"Oh — so now it's just an equation." },
  { w:'ace', t:"Exactly. The hard part was only the reading. So we solve for P. Take one P off both sides — one point seven P minus one P leaves zero point seven P. So zero point seven P equals six thousand three hundred. Divide both sides by zero point seven, and P is nine thousand.", bt:"Solve for P", b:["1.7P − P = 0.7P","0.7P  =  6,300","P  =  6,300 ÷ 0.7  =  9,000"] },
  { w:'you', t:"Nine thousand. That's option D." },
  { w:'ace', t:"And let's gently check it. Nine thousand times eight point five times twenty, over a hundred, gives fifteen thousand three hundred of interest. Is that six thousand three hundred more than the loan? Fifteen thousand three hundred minus nine thousand is six thousand three hundred. Perfect — it fits.", bt:"Check it", b:["SI = 9,000 × 8.5 × 20 ÷ 100 = 15,300","15,300 − 9,000  =  6,300  ✓"] },
  { w:'you', t:"Okay, that's actually really satisfying." },
  { w:'ace', t:"So the answer is option D — nine thousand. And notice, we never guessed. We just read it slowly, turned the words into an equation, and let it fall open.", bt:"The answer", b:["Answer:  Option D  —  ₹9,000"] },
  { w:'you', t:"Honestly? That was so much softer than I expected." },
  { w:'ace', t:"That's the whole secret. It was never about the formula — it was about turning a scary sentence into something small and simple. And you just did that, all by yourself." },
  { w:'you', t:"So... what's next?" },
  { w:'ace', t:"Next time, a few more of these — a little braver each time, until it feels like nothing. But that's for later. For now, go rest. You did beautifully." },
  { w:'you', t:"Thank you. Really." }
];

/* ============ INTERMEDIATE — Permutation & Combination ============ */
const INTERMEDIATE = [
  { w:'ace', t:"Welcome back — I've missed doing these with you. Today we step up a little, into Permutation and Combination. But don't tense up; we'll take it just as gently." },
  { w:'you', t:"Okay. I sort of know the basics of this one already." },
  { w:'ace', t:"Perfect — that's exactly what I'm counting on. So we won't start from zero. We'll warm up the key formulas, then solve a proper interview-level question together. The real skill today is spotting which approach to use." },
  { w:'you', t:"That's the part I always get wrong, honestly." },
  { w:'ace', t:"You and almost everyone — that's why we'll make it the whole point. Let's warm up first." },
  { w:'ace', t:"Quick refresher — the factorial. n factorial just means multiply n by every whole number below it, down to one. So five factorial is five times four times three times two times one — a hundred and twenty. Four factorial is twenty-four, three factorial is six.", bt:"Factorial", b:["n! = n × (n−1) × … × 1","5! = 5×4×3×2×1 = 120","4! = 24,  3! = 6,  1! = 1"] },
  { w:'you', t:"And zero factorial? That one always trips me." },
  { w:'ace', t:"You proved it once in the beginner days — but for today, just hold it gently: zero factorial is one. Always. Every exam expects that.", bt:"Zero factorial", b:["0! = 1   (just remember it)"] },
  { w:'ace', t:"Then the two big ones. Permutation, written n-P-r, is n factorial divided by (n minus r) factorial. And Combination, n-C-r, is n factorial divided by r factorial times (n minus r) factorial.", bt:"P & C formulas", b:["nPr = n! ÷ (n−r)!","nCr = n! ÷ [ r! (n−r)! ]"] },
  { w:'you', t:"See, this is my problem — I never remember when to use which." },
  { w:'ace', t:"Then here's the one rule that fixes it. Ask yourself softly: does the order matter? If order matters, it's Permutation. If order doesn't matter, it's Combination. That's the whole decision.", bt:"The one rule", b:["Order matters   →  Permutation","Order doesn't   →  Combination"] },
  { w:'ace', t:"When order matters — arranging books, race positions, a password, a ranking — use Permutation. When it doesn't — a committee, a team, a group, choosing people — use Combination." },
  { w:'ace', t:"Let me check it with you. If you pick A, B and C for a committee — is A-B-C a different committee from B-A-C?" },
  { w:'you', t:"No... it's the same committee. Same three people." },
  { w:'ace', t:"Exactly. The order of names doesn't change who's on it. So committees always mean Combination. Tuck that away." },
  { w:'ace', t:"Before the real one, the little traps. People reach for Permutation when it's really Combination. They skim past tiny words like 'at least', 'at most', 'exactly' — and those words change everything. And they forget to add up separate cases. We'll watch for all three." },
  { w:'ace', t:"Okay — here's today's question, up on the card. A committee of five is formed from seven men and five women. It must have at least three women. How many different committees can we make? The options are three hundred fifty, four hundred twenty, four fifty-five, or five twenty-five.", bt:"The question", b:["5-member committee","from 7 men + 5 women","at least 3 women","How many committees?"] },
  { w:'you', t:"Okay. Deep breath." },
  { w:'ace', t:"We've got this. First tiny question — are we selecting people, or arranging them in order?" },
  { w:'you', t:"Selecting." },
  { w:'ace', t:"Which means?" },
  { w:'you', t:"Combination." },
  { w:'ace', t:"Beautiful — one trap dodged already.", bt:"The approach", b:["selecting, not arranging","→ use Combination"] },
  { w:'ace', t:"Now the sneaky words — 'at least three women.' What does 'at least three' mean to you?" },
  { w:'you', t:"Three or more?" },
  { w:'ace', t:"Exactly. And since the committee only holds five, 'three or more women' can only happen three ways: three women with two men, four women with one man, or five women with no men. Nothing else fits.", bt:"'At least 3' → cases", b:["3 women + 2 men","4 women + 1 man","5 women + 0 men"] },
  { w:'you', t:"So we can't have just two women?" },
  { w:'ace', t:"No — two women would break the 'at least three' rule. So we solve those three cases, one gentle case at a time." },
  { w:'ace', t:"Case one — three women and two men. Choosing three women out of five gives ten. Choosing two men out of seven gives twenty-one. And since we need women and men together, we multiply.", bt:"Case 1 · 3W + 2M", b:["Women: 5C3 = 10","Men:   7C2 = 21","together → ×","10 × 21 = 210"] },
  { w:'you', t:"Why multiply, again?" },
  { w:'ace', t:"Because both choices sit in the same committee — the women and the men, side by side. Whenever two things happen together like that, you multiply. So case one is two hundred and ten." },
  { w:'ace', t:"Case two — four women and one man. Four women out of five is five. One man out of seven is seven. Multiply, and you get thirty-five.", bt:"Case 2 · 4W + 1M", b:["Women: 5C4 = 5","Men:   7C1 = 7","5 × 7 = 35"] },
  { w:'ace', t:"Case three — five women and no men. Five women out of five is just one. Zero men out of seven is also one. Multiply — one.", bt:"Case 3 · 5W + 0M", b:["Women: 5C5 = 1","Men:   7C0 = 1","1 × 1 = 1"] },
  { w:'ace', t:"Now the last little decision — do we multiply these three, or add them?" },
  { w:'you', t:"Add. Because each case is a different possible committee." },
  { w:'ace', t:"Exactly right. Multiply inside a case, add across cases. So two hundred and ten, plus thirty-five, plus one.", bt:"Add the cases", b:["210 + 35 + 1","= 246"] },
  { w:'you', t:"Wait... two hundred and forty-six isn't one of the options." },
  { w:'ace', t:"Ohh, I love that you caught that. That's exactly what a good solver does — you don't bend your answer to fit the choices. Let's double-check ourselves, calmly." },
  { w:'ace', t:"Case one: ten times twenty-one is two hundred and ten. Case two: five times seven is thirty-five. Case three: one times one is one. Add them: two hundred and forty-six. Our maths is clean.", bt:"Verify", b:["10 × 21 = 210 ✓","5 × 7 = 35 ✓","1 × 1 = 1 ✓","210 + 35 + 1 = 246 ✓"] },
  { w:'ace', t:"So the answer really is two hundred and forty-six — which means the problem is at fault, not you. The listed options simply don't match. It happens: a printing slip, or options from a different version.", bt:"The answer", b:["Answer = 246","none of A–D match"] },
  { w:'you', t:"Huh. So none of them is right." },
  { w:'ace', t:"None of them. And noticing that is worth more than any single answer — it means you trust your own working." },
  { w:'ace', t:"So, the pattern to carry with you. See the word 'committee'? Think Combination. See 'at least'? Break it into separate cases and add them. Find every valid case, solve each with combinations, multiply within a case, add across cases." },
  { w:'you', t:"Committee means combination. At least means cases. Got it." },
  { w:'ace', t:"You really do. This exact shape shows up again and again in placement exams — it quietly tests both the combinations and whether you read 'at least' properly. And you did both." },
  { w:'you', t:"That felt... doable, actually." },
  { w:'ace', t:"It was. Next time we'll add a twist — like 'a certain woman must be in', or 'two men can't be together.' Same ideas, one more layer of thinking. But that's for another day. Rest now — you did really well." },
  { w:'you', t:"Thank you. See you next time." }
];

const LESSONS = {
  beginner: {
    level:'Beginner', topic:'Simple Interest',
    question:"A person lends money at <b>8.5% per annum</b> (simple interest). In <b>20 years</b>, the interest is <b>₹6,300 more than the loan</b> lent. Find the sum lent.",
    options:[{k:'A',v:'₹8,500'},{k:'B',v:'₹10,000'},{k:'C',v:'₹12,000'},{k:'D',v:'₹9,000'}],
    answerKey:'D', answerText:'D — ₹9,000', answerBt:'The answer', script:BEGINNER
  },
  intermediate: {
    level:'Intermediate', topic:'Permutation & Combination',
    question:"A committee of <b>5 members</b> is formed from <b>7 men and 5 women</b>. It must contain <b>at least 3 women</b>. How many different committees can be formed?",
    options:[{k:'A',v:'350'},{k:'B',v:'420'},{k:'C',v:'455'},{k:'D',v:'525'}],
    answerKey:null, answerText:'246 — none of the listed options', answerBt:'The answer', script:INTERMEDIATE
  }
};

/* ===================== ELEMENTS + STATE ===================== */
const stageStatus = document.getElementById('stageStatus');
const capPrev = document.getElementById('capPrev');
const capStage = document.getElementById('capStage');
const capLabel = document.getElementById('capLabel');
const capNow = document.getElementById('capNow');
const srAnnounce = document.getElementById('srAnnounce');
const workList = document.getElementById('workList');
const fcQuestion = document.getElementById('fcQuestion');
const progressFill = document.getElementById('progressFill');
const prevBtn = document.getElementById('prevBtn');
const playBtn = document.getElementById('playBtn');
const replayBtn = document.getElementById('replayBtn');
const nextBtn = document.getElementById('nextBtn');
const counter = document.getElementById('counter');
const voiceBtn = document.getElementById('voiceBtn');
const restartBtn = document.getElementById('restartBtn');
const startGate = document.getElementById('startGate');
const startBtn = document.getElementById('startBtn');
const resumeBtn = document.getElementById('resumeBtn');
const resumeLabel = document.getElementById('resumeLabel');
const lessonPill = document.getElementById('lessonPill');
const pillTopic = document.getElementById('pillTopic');
const pillLevel = document.getElementById('pillLevel');

const synthOK = ('speechSynthesis' in window);
let current = null, S = [], LEN = 0, ANSWER_IDX = -1;
let selectedMode = 'beginner';
let cur = 0, playing = false, gen = 0, muted = false;
let voiceAce = null, voiceYou = null, keepAlive = null, softTimer = null;
let cards = {};

function P(){ return window.PLANETS || {}; }

/* ===================== VOICES ===================== */
function loadVoices(){
  if(!synthOK) return;
  const list = window.speechSynthesis.getVoices(); if(!list.length) return;
  const en = list.filter(v => /^en/i.test(v.lang)); const pool = en.length ? en : list;
  const femaleRe = /(female|samantha|victoria|zira|aria|jenny|karen|serena|moira|tessa|fiona|susan|allison|ava|nicky|amelie|libby|sonia|neerja|google uk english female|google us english)/i;
  const females = pool.filter(v => femaleRe.test(v.name));
  const primary = females[0] || pool[0]; const secondary = females.find(v => v !== primary) || primary;
  voiceAce = primary; voiceYou = secondary;
}
if(synthOK){
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
  /* Safari/WebKit frequently returns an empty voice list for a beat after
     load and doesn't reliably fire 'voiceschanged' — a few cheap retries
     closes that gap; harmless no-ops once voices are already loaded. */
  [300, 800, 1800, 3500].forEach(ms => setTimeout(loadVoices, ms));
}
function startKeepAlive(){ stopKeepAlive(); keepAlive = setInterval(() => { if(synthOK && window.speechSynthesis.speaking) window.speechSynthesis.resume(); }, 9000); }
function stopKeepAlive(){ if(keepAlive){ clearInterval(keepAlive); keepAlive = null; } }
function cancelSpeech(){ try{ if(synthOK) window.speechSynthesis.cancel(); }catch(e){} clearTimeout(softTimer); stopKeepAlive(); }
function stripForSpeech(t){ return t.replace(/\*\*/g,'').replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u2713\u2714]/gu,'').replace(/\s+/g,' ').trim(); }
function estimate(text){ const n = stripForSpeech(text).length; return Math.max(1600, Math.min(15000, n * 62)); }

/* presence (planets) */
function applySpeaking(who, on){ const pl = who === 'ace' ? P().ace : P().you; if(pl) pl.setSpeaking(on); }
function setActive(who){ if(P().ace) P().ace.setDim(who !== 'ace'); if(P().you) P().you.setDim(who !== 'you'); }
function clearPresence(){ if(P().ace){ P().ace.setSpeaking(false); P().ace.setDim(false); } if(P().you){ P().you.setSpeaking(false); P().you.setDim(false); } }

function speak(text, who){
  return new Promise(resolve => {
    setActive(who); applySpeaking(who, true);
    if(muted || !synthOK){ clearTimeout(softTimer); softTimer = setTimeout(() => { applySpeaking(who, false); resolve(); }, estimate(text)); return; }
    try{ window.speechSynthesis.cancel(); }catch(e){}
    const u = new SpeechSynthesisUtterance(stripForSpeech(text));
    const v = who === 'ace' ? voiceAce : voiceYou; if(v) u.voice = v; u.lang = (v && v.lang) || 'en-US';
    if(who === 'ace'){ u.rate = 0.9; u.pitch = 1.06; } else { u.rate = 0.97; u.pitch = 1.16; } u.volume = 1;
    let done = false, watchdog = null, hard = null;
    const finish = () => { if(done) return; done = true; clearTimeout(watchdog); clearTimeout(hard); stopKeepAlive(); applySpeaking(who, false); resolve(); };
    u.onstart = () => { applySpeaking(who, true); startKeepAlive(); };
    u.onboundary = () => { const pl = who === 'ace' ? P().ace : P().you; if(pl) pl.pulse(1.1); };
    u.onend = finish; u.onerror = finish;
    watchdog = setTimeout(() => { if(!window.speechSynthesis.speaking) finish(); }, estimate(text) + 2000);
    hard = setTimeout(() => { try{ if(synthOK) window.speechSynthesis.cancel(); }catch(e){} finish(); }, estimate(text) + 9000);
    try{ window.speechSynthesis.speak(u); }catch(e){ finish(); }
  });
}

/* text reveal */
function parseSegments(text){ const parts = text.split('**'); const segs = []; parts.forEach((p, idx) => { if(p !== '') segs.push({ text:p, bold: idx % 2 === 1 }); }); return segs; }
function revealText(target, text, duration){
  target.innerHTML = '';
  const plainLen = text.replace(/\*\*/g, '').length;
  target.classList.remove('sz-sm', 'sz-xs');
  if(plainLen > 420) target.classList.add('sz-xs'); else if(plainLen > 200) target.classList.add('sz-sm');
  if(srAnnounce) srAnnounce.textContent = stripForSpeech(text); /* one clean announcement per line, not per word */
  const words = [];
  parseSegments(text).forEach(seg => { seg.text.split(/(\s+)/).forEach(tok => { if(tok === '') return; if(/^\s+$/.test(tok)){ target.appendChild(document.createTextNode(tok)); } else { const s = document.createElement('span'); s.className = 'w' + (seg.bold ? ' b' : ''); s.textContent = tok; target.appendChild(s); words.push(s); } }); });
  const n = words.length || 1; const step = Math.max(24, Math.min(130, duration / n));
  let idx = 0, timer = null, done = false;
  (function tick(){ if(done) return; if(idx < n){ words[idx].classList.add('lit'); idx++; timer = setTimeout(tick, step); } })();
  return { complete(){ done = true; clearTimeout(timer); words.forEach(w => w.classList.add('lit')); } };
}

/* pinned question + working */
function renderQuestion(lesson){
  const opts = (lesson.options || []).map(o => '<div class="fc-opt" data-key="'+o.k+'"><b>'+o.k+'</b>&nbsp;'+o.v+'</div>').join('');
  fcQuestion.innerHTML =
    '<div class="fc-label">Today\'s problem</div>' +
    '<div class="fc-text">'+lesson.question+'</div>' +
    (opts ? '<div class="fc-options">'+opts+'</div>' : '') +
    '<div class="fc-answer" id="answerBadge"></div>';
}
function makeCard(k){
  const step = S[k]; const card = document.createElement('div'); card.className = 'work-card justadded';
  if(step.bt){ const tt = document.createElement('div'); tt.className = 'wc-title'; tt.textContent = step.bt; card.appendChild(tt); }
  step.b.forEach((line, j) => { const r = document.createElement('div'); r.className = 'mrow' + (j === step.b.length - 1 ? ' res' : ''); r.textContent = line; card.appendChild(r); });
  setTimeout(() => card.classList.remove('justadded'), 600); return card;
}
function ensureCard(k){ if(cards[k]) return cards[k]; const empty = workList.querySelector('.work-empty'); if(empty) empty.remove(); const card = makeCard(k); workList.appendChild(card); cards[k] = card; workList.scrollTop = workList.scrollHeight; return card; }
function highlightBoard(k){ for(const key in cards) cards[key].classList.remove('active'); if(S[k].b){ const card = ensureCard(k); card.classList.add('active'); workList.scrollTop = workList.scrollHeight; } }
function markAnswer(on){
  const badge = document.getElementById('answerBadge');
  document.querySelectorAll('.fc-opt').forEach(o => o.classList.remove('correct'));
  if(on && current){
    if(current.answerKey){ const el = document.querySelector('.fc-opt[data-key="'+current.answerKey+'"]'); if(el) el.classList.add('correct'); }
    if(badge && current.answerText){ badge.textContent = 'Answer: ' + current.answerText; badge.classList.add('show'); }
  } else if(badge){ badge.classList.remove('show'); badge.textContent=''; }
}
function clearWork(){ workList.innerHTML = ''; cards = {}; markAnswer(false); const e = document.createElement('div'); e.className = 'work-empty'; e.textContent = "Ace's calculations appear here as she goes — and stay, right under the question."; workList.appendChild(e); }

/* render + play */
function showCaption(who, prevText){
  capPrev.textContent = prevText || ''; capPrev.classList.toggle('has', !!prevText);
  capLabel.textContent = who === 'ace' ? 'Ace' : 'You'; capLabel.className = 'cap-label ' + who;
  capNow.className = 'cap-now ' + who; capNow.innerHTML = '';
  capStage.classList.remove('in'); void capStage.offsetWidth; capStage.classList.add('in');
}
function renderCaption(k){ showCaption(S[k].w, k > 0 ? stripForSpeech(S[k-1].t) : ''); }
function setStatus(x){
  const map = { ace:'<b>Ace</b> is talking…', you:'<b>You</b> — that\'s your line', paused:'Paused — press play, or replay any line.', done:"That's all of it. Step back and replay any line, or switch level.", idle:'Ready when you are.', thinking:'<b>Ace</b> is thinking…', 'live-idle':'<b>Your turn</b> — reply, ask a doubt, or tap a suggestion below.', pick:'<b>Pick a difficulty</b> above to begin — Simple, Moderate, or Tough.' };
  stageStatus.innerHTML = map[x] || x;
}
function setProgress(k){ progressFill.style.width = ((k + 1) / LEN) * 100 + '%'; counter.textContent = (k + 1) + ' / ' + LEN; }
function setPlayBtn(on){ playBtn.textContent = on ? '⏸' : '▶'; playBtn.setAttribute('aria-label', on ? 'Pause' : 'Play'); playBtn.title = on ? 'Pause' : 'Play'; }
function updatePill(lesson){ pillTopic.textContent = lesson.topic; pillLevel.textContent = lesson.level; }

function loadLesson(mode){
  current = LESSONS[mode] || LESSONS.beginner;
  S = current.script; LEN = S.length;
  ANSWER_IDX = current.answerBt ? S.findIndex(s => s.bt === current.answerBt) : -1;
  renderQuestion(current); updatePill(current); clearWork();
  cur = 0; progressFill.style.width = '0%'; counter.textContent = '1 / ' + LEN;
}

async function playIndex(k, my){
  renderCaption(k); highlightBoard(k); markAnswer(ANSWER_IDX >= 0 && k >= ANSWER_IDX);
  setActive(S[k].w); setStatus(S[k].w); setProgress(k);
  saveResumeState(k);
  const reveal = revealText(capNow, S[k].t, estimate(S[k].t));
  await speak(S[k].t, S[k].w); reveal.complete();
}

/* flow */
async function autoPlay(){
  const my = ++gen; playing = true; setPlayBtn(true); cancelSpeech();
  while(gen === my){ await playIndex(cur, my); if(gen !== my) return; if(!playing) return; if(cur >= LEN - 1) break; cur++; }
  if(gen === my){ playing = false; setPlayBtn(false); clearPresence(); setStatus('done'); clearResumeState(); }
}
function pause(){ playing = false; gen++; cancelSpeech(); clearPresence(); setPlayBtn(false); setStatus('paused'); }
async function playOnceThenPause(k){ const my = ++gen; playing = false; cancelSpeech(); clearPresence(); cur = k; setPlayBtn(false); await playIndex(k, my); if(gen !== my) return; clearPresence(); setStatus('paused'); }
function goNext(){ const k = Math.min(LEN - 1, cur + 1); if(playing){ cur = k; autoPlay(); } else { playOnceThenPause(k); } }
function goPrev(){ const k = Math.max(0, cur - 1); if(playing){ cur = k; autoPlay(); } else { playOnceThenPause(k); } }
function replay(){ if(playing){ autoPlay(); } else { playOnceThenPause(cur); } }
function restart(){ gen++; playing = false; cancelSpeech(); clearPresence(); cur = 0; progressFill.style.width = '0%'; clearWork(); clearResumeState(); autoPlay(); }

/* ===== session resume (localStorage) — scripted lessons only ===== */
const RESUME_KEY = 'aceapt_resume_v1';
function saveResumeState(index){
  try{ localStorage.setItem(RESUME_KEY, JSON.stringify({ mode: selectedMode, index: index, ts: Date.now() })); }catch(e){}
}
function clearResumeState(){ try{ localStorage.removeItem(RESUME_KEY); }catch(e){} refreshResumeButton(); }
function loadResumeState(){
  try{
    const raw = localStorage.getItem(RESUME_KEY);
    if(!raw) return null;
    const st = JSON.parse(raw);
    if(!st || !LESSONS[st.mode] || typeof st.index !== 'number') return null;
    const len = LESSONS[st.mode].script.length;
    if(st.index < 0 || st.index >= len) return null;
    return st;
  }catch(e){ return null; }
}
function refreshResumeButton(){
  const st = loadResumeState();
  if(st && resumeBtn && resumeLabel){
    const lesson = LESSONS[st.mode];
    resumeLabel.textContent = lesson.level + ' · line ' + (st.index + 1) + ' of ' + lesson.script.length;
    resumeBtn.style.display = 'inline-flex';
  } else if(resumeBtn){ resumeBtn.style.display = 'none'; }
}
function beginAt(mode, index){
  startGate.classList.add('hide');
  liveMode = false; document.body.classList.remove('live'); thinkingPulse(false);
  const p = P(); if(p.gateAce) p.gateAce.stop(); if(p.gateYou) p.gateYou.stop();
  try{ if(synthOK) window.speechSynthesis.cancel(); }catch(e){}
  loadVoices();
  loadLesson(mode);
  for(let k = 0; k < index; k++){ if(S[k] && S[k].b){ ensureCard(k); } } /* silently rebuild the working history up to here */
  cur = Math.min(index, LEN - 1);
  autoPlay();
}
if(resumeBtn) resumeBtn.addEventListener('click', () => {
  const st = loadResumeState(); if(!st) return;
  selectedMode = st.mode;
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.toggle('selected', b.getAttribute('data-mode') === st.mode));
  beginAt(st.mode, st.index);
});

/* controls */
playBtn.addEventListener('click', () => { if(playing) pause(); else autoPlay(); });
prevBtn.addEventListener('click', goPrev);
nextBtn.addEventListener('click', goNext);
replayBtn.addEventListener('click', replay);
restartBtn.addEventListener('click', restart);
voiceBtn.addEventListener('click', () => { muted = !muted; voiceBtn.classList.toggle('muted', muted); voiceBtn.textContent = muted ? '🔇' : '🔊'; voiceBtn.setAttribute('aria-label', muted ? 'Unmute' : 'Mute'); voiceBtn.title = muted ? 'Unmute' : 'Mute'; if(muted){ try{ if(synthOK) window.speechSynthesis.cancel(); }catch(e){} } });
document.addEventListener('keydown', (e) => {
  if(e.target && /^(input|textarea)$/i.test(e.target.tagName)) return;
  if(liveMode) return;
  if(e.code === 'Space'){ e.preventDefault(); if(playing) pause(); else autoPlay(); }
  else if(e.code === 'ArrowRight'){ e.preventDefault(); goNext(); }
  else if(e.code === 'ArrowLeft'){ e.preventDefault(); goPrev(); }
  else if(e.key && e.key.toLowerCase() === 'r'){ replay(); }
});
/* Escape always works, in either mode: closes the key panel, or exits live chat */
document.addEventListener('keydown', (e) => {
  if(e.key !== 'Escape') return;
  if(keyPanel && keyPanel.classList.contains('show')){ keyPanel.classList.remove('show'); return; }
  if(liveMode){ exitLive(); }
});

/* mode picker */
document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if(btn.classList.contains('locked')) return;
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedMode = btn.getAttribute('data-mode');
  });
});

/* switch level via the pill → reopen the gate */
function reopenGate(){ pause(); startGate.classList.remove('hide'); refreshResumeButton(); const p = P(); if(p.gateAce) p.gateAce.start(); if(p.gateYou) p.gateYou.start(); }
lessonPill.addEventListener('click', reopenGate);

/* begin (reusable) */
function begin(){
  startGate.classList.add('hide');
  liveMode = false; document.body.classList.remove('live'); thinkingPulse(false);
  const p = P(); if(p.gateAce) p.gateAce.stop(); if(p.gateYou) p.gateYou.stop();
  try{ if(synthOK) window.speechSynthesis.cancel(); }catch(e){}
  loadVoices();
  loadLesson(selectedMode);
  autoPlay();
}
startBtn.addEventListener('click', begin);

/* ===================== LIVE CHAT (Groq) ===================== */
const liveText = document.getElementById('liveText');
const liveSend = document.getElementById('liveSend');
const liveExit = document.getElementById('liveExit');
const liveChips = document.getElementById('liveChips');
const liveDiffEl = document.getElementById('liveDiff');
const tryBtn = document.getElementById('tryBtn');
const gateTryBtn = document.getElementById('gateTryBtn');
const keyPanel = document.getElementById('keyPanel');
const groqKeyInput = document.getElementById('groqKeyInput');
const groqModelSel = document.getElementById('groqModelSel');
const rememberKey = document.getElementById('rememberKey');
const keyConnect = document.getElementById('keyConnect');
const keyClose = document.getElementById('keyClose');

let liveMode = false, liveBusy = false, liveMessages = [], liveLastPrev = '', thinkTimer = null;
let pendingFlags = [];
let groqKey = GROQ_API_KEY;
let groqModel = GROQ_MODEL;

const SYSTEM_PROMPT = `You are "Ace", a warm, gentle, patient aptitude tutor helping a student prepare for placement and competitive aptitude exams (Indian context — use the ₹ symbol for money). You speak softly and encouragingly, like a kind friend sitting beside them.

You teach as a warm, GUIDED WALKTHROUGH — you do the explaining and all the working yourself, thinking aloud like a kind friend, and you keep it a gentle conversation by pausing now and then with a soft, collaborative check-in (like "shall we?", "okay so far?", or "now let's find the shares of A and B — shall we go?") that the student can simply agree to or ask a doubt about. You NEVER quiz the student: never ask them to give you the formula, to do a calculation, or to tell you the answer. You lead and they ride along. Keep each turn short — one small step, sometimes two — then a gentle check-in, so it feels like the two of you are solving it together, side by side, at an easy pace.

Reply with a SINGLE valid JSON object and NOTHING else — no prose, no markdown, no code fences. Use exactly this shape:
{"problem": {"text": string, "options": [string, ...]} , "steps": [ {"say": string, "board": {"title": string, "lines": [string, ...]}} ]}

Rules:
- "problem": include a value ONLY when you are presenting a NEW practice problem. Give a clear "text" and, for multiple-choice, 4 "options" like "A. 350","B. 420","C. 455","D. 525" (use an empty array [] if it is not multiple choice). If you are NOT giving a new problem this turn, set "problem" to null.
- Every problem you create must be NEW and different — never repeat a problem you already gave, and never reuse these two: the simple-interest question about ₹6,300 more than the loan, and the committee of 5 chosen from 7 men and 5 women. Invent fresh numbers and scenarios.
- Match the difficulty the student asks for: "simple" = short and easy (one or two steps, small numbers); "moderate" = standard exam level (a few steps); "tough" = a longer, harder, multi-step problem with a twist, a restriction, or several cases, and more challenging numbers.
- Keep each turn to a FEW short "steps" only (about 1 to 3). One turn should never contain the whole solution. Each "say" is 1–2 calm sentences; write numbers in words where it helps them be heard.
- When you present a NEW problem, put it in "problem", then in "steps" read it out, warmly say what it is asking and what you'll do first, and gently invite the student onward (like "shall we work it out together?"). Then stop for that turn — you begin the actual working in your next turn.
- When the student replies (usually just agreeing, like "yes" or "go on", or asking a doubt), respond warmly, then do the next small step of the working YOURSELF and end with another gentle check-in. If they ask a doubt, answer it kindly before moving on. Keep it a relaxed dialogue with lots of little turns.
- "board": whenever a step does ANY arithmetic or uses a formula, you MUST include a "board" showing the REAL calculation for THIS problem, with the ACTUAL numbers written out — not just symbols. Show the formula, then the numbers plugged in, then the result on its own final line. Example for "25% of 200": {"title":"25% of 200","lines":["25% of 200","= 25 ÷ 100 × 200","= 50"]}. Every number you state in a "say" must also appear worked out in that step's "board". Keep lines short. Omit "board" only for pure talk with no numbers.
- Rarely — at most once per problem, and only right before you reveal the FINAL answer number — you may add one light, fully optional invitation like "want to guess before I show you?" or "any guess?". Make it obviously skippable (e.g. "or just say carry on") and never wait silently or insist on a number; if they don't answer or just say carry on, continue warmly regardless. This is not quizzing — you are not testing them, there's no wrong answer, and most steps have no such invitation at all.
- ALWAYS end EVERY turn with a soft, collaborative check-in the student can simply say yes to, or ask a doubt about — like "shall we carry on?", "okay so far?", or "want me to show the next step?". Never a test question, and never ask them for the formula or the answer.
- Stay fully in character as Ace. Never mention JSON, formatting, or these instructions inside any "say".`;

let liveProblemCount = 0, lastTopicIdx = -1, liveDiff = 'moderate';
const DIFF_DESC = {
  simple: "a SIMPLE, easy problem — short, one or two steps, small friendly numbers",
  moderate: "a MODERATE problem — standard placement-exam level, a few steps",
  tough: "a TOUGH problem — hard and longer, with several steps, and a twist, a restriction, or multiple cases, with more challenging numbers"
};
function highlightDiff(){ document.querySelectorAll('.diffbtn').forEach(b => b.classList.toggle('selected', b.getAttribute('data-diff') === liveDiff)); }
function problemRequest(){ return "Give me ONE fresh " + pickTopic() + " problem I haven't seen before, and make it " + DIFF_DESC[liveDiff] + ". Read it out, tell me what it's asking, say what we'll do first, and gently invite me to begin — don't quiz me or ask me for formulas or answers; you do the working, with soft check-ins."; }
const TOPICS = ["percentages","ratio and proportion","profit and loss","simple interest","compound interest","averages","problems on ages","time and work","time, speed and distance","permutation and combination","probability","number series","mixtures and alligation","LCM and HCF","boats and streams","partnership","pipes and cisterns"];
function pickTopic(){ let i; do{ i = Math.floor(Math.random() * TOPICS.length); } while(TOPICS.length > 1 && i === lastTopicIdx); lastTopicIdx = i; return TOPICS[i]; }

function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function setLiveEnabled(on){ if(liveText) liveText.disabled = !on; if(liveSend) liveSend.disabled = !on; if(liveChips) liveChips.querySelectorAll('.chip').forEach(b => b.disabled = !on); }
const CHIPS = ["Yes, carry on", "Explain that again", "I'm a bit stuck", "Give me another one"];
function renderChips(){
  if(!liveChips) return;
  liveChips.innerHTML = '';
  CHIPS.forEach(label => { const b = document.createElement('button'); b.className = 'chip'; b.type = 'button'; b.textContent = label; b.addEventListener('click', () => { if(liveBusy || !liveMode) return; if(label === 'Give me another one'){ newProblem(); } else { runTurn(label, true); } }); liveChips.appendChild(b); });
}
function updatePillLive(){ pillTopic.textContent = 'Live'; pillLevel.textContent = 'Practice'; }
function thinkingPulse(on){
  if(on){ if(P().ace) P().ace.setDim(false); if(P().you) P().you.setDim(true); if(!thinkTimer) thinkTimer = setInterval(() => { if(P().ace) P().ace.pulse(0.45); }, 340); }
  else { if(thinkTimer){ clearInterval(thinkTimer); thinkTimer = null; } }
}
function trimMessages(){ if(liveMessages.length > 13){ const sys = liveMessages[0]; liveMessages = [sys].concat(liveMessages.slice(-12)); } }

async function askGroq(messages){
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), 35000);
  let res;
  try{
    res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method:'POST',
      headers:{ 'Content-Type':'application/json', 'Authorization':'Bearer ' + groqKey },
      body: JSON.stringify({ model: groqModel, temperature:0.6, max_completion_tokens:2200, messages }),
      signal: ctrl.signal
    });
  } finally { clearTimeout(to); }
  if(res.status === 429){ const e = new Error('rate_limited'); e.rateLimited = true; throw e; }
  if(res.status === 401 || res.status === 403){ const e = new Error('auth'); e.auth = true; throw e; }
  if(!res.ok){ let t=''; try{ t = await res.text(); }catch(_){ } throw new Error('Groq ' + res.status + (t ? ': ' + t.slice(0,140) : '')); }
  const data = await res.json();
  return (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '';
}
function parseSteps(content){
  let txt = String(content).trim();
  txt = txt.replace(/^```[a-z]*\s*/i, '').replace(/\s*```$/, '').trim();
  const a = txt.indexOf('{'), b = txt.lastIndexOf('}');
  if(a >= 0 && b > a) txt = txt.slice(a, b + 1);
  return JSON.parse(txt);
}

/* ===================== LOCAL MATH VERIFIER =====================
   Groq's own arithmetic can't be trusted blindly (published research
   shows LLM arithmetic accuracy drops as numbers/steps grow — exactly
   what "Tough" problems ask for). This is a small, deliberately narrow,
   FAIL-CLOSED checker: it only ever verifies lines that are PURE numeric
   arithmetic (like "25 ÷ 100 × 200 = 50"). Anything algebraic, symbolic,
   or ambiguous (contains a stray letter, an unhandled symbol, more than
   one "%") is silently skipped rather than risk a false alarm — a missed
   check is safe, a wrongly-flagged correct answer is not. */
function safeEvalArith(expr){
  const s = expr.replace(/\s+/g, '');
  if(!s) return null;
  let i = 0;
  function isDigit(c){ return c >= '0' && c <= '9'; }
  function parseNumber(){
    let start = i;
    if(s[i] === '-') i++;
    let sawDigit = false;
    while(i < s.length && (isDigit(s[i]) || s[i] === '.')){ if(isDigit(s[i])) sawDigit = true; i++; }
    if(!sawDigit) return null;
    const val = parseFloat(s.slice(start, i));
    return isNaN(val) ? null : val;
  }
  function parseFactor(){
    if(s[i] === '('){ i++; const v = parseExpr(); if(v === null || s[i] !== ')') return null; i++; return v; }
    return parseNumber();
  }
  function parseTerm(){
    let v = parseFactor(); if(v === null) return null;
    for(;;){
      if(s[i] === '*' || s[i] === '/'){ const op = s[i]; i++; const v2 = parseFactor(); if(v2 === null) return null; v = op === '*' ? v*v2 : v/v2; }
      else break;
    }
    return v;
  }
  function parseExpr(){
    let v = parseTerm(); if(v === null) return null;
    for(;;){
      if(s[i] === '+' || s[i] === '-'){ const op = s[i]; i++; const v2 = parseTerm(); if(v2 === null) return null; v = op === '+' ? v+v2 : v-v2; }
      else break;
    }
    return v;
  }
  let result;
  try{ result = parseExpr(); }catch(e){ return null; }
  if(i !== s.length) return null; /* leftover characters → malformed → fail closed */
  return result;
}
function cleanExprSide(raw){
  if(raw == null) return null;
  let s = String(raw).trim();
  if(!s) return null;
  /* the one special case worth handling in plain words: "X% of Y" */
  const pctOf = s.match(/^([\d.,₹\s]+)%\s*of\s*(.+)$/i);
  if(pctOf){
    const x = pctOf[1].replace(/[₹,\s]/g, '');
    const yClean = cleanExprSide(pctOf[2]);
    if(yClean === null || !/^-?[\d.]+$/.test(x)) return null;
    s = '(' + x + '/100)*(' + yClean + ')';
  }
  s = s.replace(/₹/g, '').replace(/,/g, '').replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/[✓✔]/g, '').trim();
  if(/[a-zA-Z]/.test(s)) return null;      /* any letter left → algebraic/symbolic → skip */
  if(/[^0-9.+\-*/()\s%]/.test(s)) return null; /* any stray symbol → skip */
  if(s.indexOf('%') >= 0) return null;      /* unhandled leftover percent → skip */
  return s;
}
function extractPureNumber(raw){
  if(raw == null) return null;
  const s = String(raw).replace(/[✓✔]/g, '').replace(/₹/g, '').replace(/,/g, '').trim();
  if(!/^-?\d+(\.\d+)?$/.test(s)) return null;
  const v = parseFloat(s);
  return isNaN(v) ? null : v;
}
function closeEnough(computed, claimed){ return Math.abs(computed - claimed) <= Math.max(0.5, Math.abs(claimed) * 0.005); }
function tryVerifyLine(line){
  const cleaned = String(line).replace(/[✓✔]/g, '').trim();
  const parts = cleaned.split('=');
  if(parts.length < 2) return null;
  const result = extractPureNumber(parts[parts.length - 1]);
  if(result === null) return null;
  const expr = cleanExprSide(parts[parts.length - 2]);
  if(expr === null) return null;
  const val = safeEvalArith(expr);
  if(val === null) return null;
  return closeEnough(val, result);
}
function expressionFromLine(line){
  const cleaned = String(line).replace(/[✓✔]/g, '').trim();
  const parts = cleaned.split('=');
  const raw = parts.length > 1 ? parts[parts.length - 1] : cleaned;
  return cleanExprSide(raw);
}
function verifyBoardLines(lines){
  const flaggedIdx = [];
  for(let i = 0; i < lines.length; i++){
    const direct = tryVerifyLine(lines[i]);
    if(direct !== null){ if(direct === false) flaggedIdx.push(i); continue; }
    if(i > 0 && /^\s*=/.test(lines[i])){
      const result = extractPureNumber(lines[i].split('=').pop());
      if(result !== null){
        const prevExpr = expressionFromLine(lines[i - 1]);
        if(prevExpr !== null){
          const val = safeEvalArith(prevExpr);
          if(val !== null && !closeEnough(val, result)) flaggedIdx.push(i);
        }
      }
    }
  }
  return flaggedIdx;
}

function addLiveBoard(board){
  const empty = workList.querySelector('.work-empty'); if(empty) empty.remove();
  const card = document.createElement('div'); card.className = 'work-card justadded';
  if(board.title){ const tt = document.createElement('div'); tt.className = 'wc-title'; tt.textContent = board.title; card.appendChild(tt); }
  const lines = board.lines || [];
  const flaggedIdx = verifyBoardLines(lines);
  lines.forEach((line, j) => {
    const r = document.createElement('div'); r.className = 'mrow' + (j === lines.length - 1 ? ' res' : '');
    if(flaggedIdx.indexOf(j) !== -1) r.classList.add('flagged');
    r.textContent = line; card.appendChild(r);
  });
  workList.appendChild(card); workList.scrollTop = workList.scrollHeight;
  setTimeout(() => card.classList.remove('justadded'), 600);
  if(flaggedIdx.length){ pendingFlags.push((board.title ? board.title + ': ' : '') + lines.join(' | ')); }
}
function addProblemSeparator(){
  liveProblemCount++;
  const empty = workList.querySelector('.work-empty'); if(empty) empty.remove();
  const sep = document.createElement('div'); sep.className = 'work-sep'; sep.textContent = 'Problem ' + liveProblemCount;
  workList.appendChild(sep); workList.scrollTop = workList.scrollHeight;
}
function renderLiveProblem(problem){
  const opts = (problem.options || []).map(o => '<div class="fc-opt">' + escapeHtml(o) + '</div>').join('');
  fcQuestion.innerHTML =
    '<div class="fc-label">Your problem</div>' +
    '<div class="fc-text">' + escapeHtml(problem.text) + '</div>' +
    (opts ? '<div class="fc-options">' + opts + '</div>' : '') +
    '<div class="fc-answer" id="answerBadge"></div>';
}
async function playLiveStep(step){
  showCaption('ace', liveLastPrev);
  const nb = normalizeBoard(step);
  if(nb) addLiveBoard(nb);
  setActive('ace'); setStatus('ace');
  const reveal = revealText(capNow, step.say, estimate(step.say));
  await speak(step.say, 'ace'); reveal.complete();
  liveLastPrev = stripForSpeech(step.say);
}
function normalizeBoard(step){
  let b = (step && step.board != null) ? step.board : (step && (step.work || step.calculation || step.calc || step.working));
  if(b == null) return null;
  let title = '', lines = [];
  if(typeof b === 'string'){ lines = b.split(/\r?\n/); }
  else if(Array.isArray(b)){ lines = b.slice(); }
  else if(typeof b === 'object'){
    title = b.title || b.name || b.label || '';
    let ln = (b.lines != null) ? b.lines : (b.steps || b.rows || b.text || b.calc || []);
    if(typeof ln === 'string') ln = ln.split(/\r?\n/);
    lines = Array.isArray(ln) ? ln.slice() : [];
  }
  lines = lines.map(x => (x == null ? '' : String(x))).filter(s => s.trim() !== '');
  if(!lines.length) return null;
  return { title: title || '', lines: lines };
}
async function showUserLine(text){
  showCaption('you', liveLastPrev);
  setActive('you'); setStatus('you');
  const reveal = revealText(capNow, text, estimate(text));
  await speak(text, 'you'); reveal.complete();
  liveLastPrev = text;
}
function showKeyPanel(msg){
  const note = document.getElementById('keyMsg'); if(note) note.textContent = msg || '';
  if(groqModelSel) groqModelSel.value = groqModel;
  if(groqKeyInput) groqKeyInput.value = groqKey || '';
  keyPanel.classList.add('show');
  if(groqKeyInput && !groqKey) setTimeout(() => groqKeyInput.focus(), 60);
}
function startLiveSession(){
  startGate.classList.add('hide');
  const p = P(); if(p.gateAce) p.gateAce.stop(); if(p.gateYou) p.gateYou.stop();
  gen++; playing = false; cancelSpeech(); clearPresence();
  loadVoices();
  liveMode = true; liveBusy = false; liveProblemCount = 0; pendingFlags = []; document.body.classList.add('live');
  liveMessages = [{ role:'system', content: SYSTEM_PROMPT }]; liveLastPrev = '';
  updatePillLive();
  fcQuestion.innerHTML = '<div class="fc-label">Live practice</div><div class="fc-text">Choose a difficulty below — Simple, Moderate, or Tough — and Ace will bring you a problem to work through together.</div><div class="fc-answer" id="answerBadge"></div>';
  clearWork();
  renderChips(); highlightDiff();
  progressFill.style.width = '0%'; counter.textContent = 'live';
  liveBusy = true; setLiveEnabled(false);
  playLiveStep({ say:"Hey — it's just us. First, pick a difficulty below — Simple, Moderate, or Tough — and I'll bring you a fresh problem to work through together." })
    .then(() => { clearPresence(); setStatus('pick'); liveBusy = false; setLiveEnabled(true); });
}
function enterLive(){ if(!groqKey){ showKeyPanel('Set GROQ_API_KEY in app.js to enable live mode.'); return; } startLiveSession(); }
function exitLive(){ liveMode = false; liveBusy = false; document.body.classList.remove('live'); thinkingPulse(false); cancelSpeech(); clearPresence(); reopenGate(); }

/* one round-trip to Groq + playing out whatever it returns. Returns
   true on success (so the caller can chain a verification follow-up),
   false if it already handled cleanup itself (error / parse failure). */
async function sendAndPlay(){
  setStatus('thinking'); thinkingPulse(true);
  let content;
  try{ content = await askGroq(liveMessages); }
  catch(err){
    thinkingPulse(false);
    if(err && err.auth){ liveBusy = false; setLiveEnabled(true); showKeyPanel('That key was rejected — try another.'); return false; }
    if(err && err.rateLimited){ await playLiveStep({ say:"Ace is getting a lot of questions right now — give it a moment, then try again." }); }
    else { await playLiveStep({ say:"Hmm — I couldn't reach Groq just then. Check your connection or key, and let's try that again." }); }
    clearPresence(); setStatus('live-idle'); liveBusy = false; setLiveEnabled(true); if(liveText) liveText.focus();
    return false;
  }
  thinkingPulse(false);
  let obj;
  try{ obj = parseSteps(content); }
  catch(e){
    liveMessages.push({ role:'assistant', content: content }); trimMessages();
    await playLiveStep({ say:"I got a little tangled forming that — could you ask me again, maybe a touch more simply?" });
    clearPresence(); setStatus('live-idle'); liveBusy = false; setLiveEnabled(true); if(liveText) liveText.focus();
    return false;
  }
  liveMessages.push({ role:'assistant', content: content }); trimMessages();
  if(obj.problem && obj.problem.text){ renderLiveProblem(obj.problem); addProblemSeparator(); }
  const steps = Array.isArray(obj.steps) ? obj.steps : [];
  for(const st of steps){ if(st && st.say){ await playLiveStep(st); } }
  return true;
}
async function runTurn(userContent, show, displayText){
  liveBusy = true; setLiveEnabled(false);
  if(show){ await showUserLine(displayText || userContent); }
  const tagged = userContent + " [Problem difficulty is set to " + liveDiff.toUpperCase() + " — every problem you give must stay at this level.]";
  liveMessages.push({ role:'user', content: tagged }); trimMessages();
  const ok = await sendAndPlay();
  if(!ok) return; /* sendAndPlay already did all cleanup */
  if(pendingFlags.length){
    /* the local verifier caught a mismatch — ask Ace to quietly recheck
       her own last step, the same "wait, let me double-check" instinct
       already baked into the scripted lessons, now applied to live math. */
    const flags = pendingFlags.slice(); pendingFlags = [];
    const note = "Quietly recompute and double-check this exact arithmetic from what you just said: " + flags.map(f => '"' + f + '"').join('; ') + ". If anything was actually wrong, gently correct it now, the way you'd naturally say you just caught it yourself. If it was correct after all, simply continue to the next small step and check in again — don't mention that you were asked to check.";
    liveMessages.push({ role:'user', content: note }); trimMessages();
    await sendAndPlay();
    return;
  }
  clearPresence(); setStatus('live-idle'); liveBusy = false; setLiveEnabled(true); if(liveText) liveText.focus();
}
function newProblem(){ if(liveBusy || !liveMode) return; runTurn(problemRequest(), true, "Give me a " + liveDiff + " one, please."); }
function setDiff(d){ if(!liveMode) return; liveDiff = d; highlightDiff(); newProblem(); }
async function handleSend(){
  if(liveBusy || !liveMode) return;
  const text = liveText.value.trim(); if(!text) return;
  liveText.value = '';
  await runTurn(text, true);
}

if(tryBtn) tryBtn.addEventListener('click', enterLive);
if(gateTryBtn) gateTryBtn.addEventListener('click', enterLive);
if(liveSend) liveSend.addEventListener('click', handleSend);
if(liveText) liveText.addEventListener('keydown', e => { if(e.key === 'Enter'){ e.preventDefault(); handleSend(); } });
if(liveExit) liveExit.addEventListener('click', exitLive);
document.querySelectorAll('.diffbtn').forEach(btn => { btn.addEventListener('click', () => setDiff(btn.getAttribute('data-diff'))); });
if(keyClose) keyClose.addEventListener('click', () => keyPanel.classList.remove('show'));
if(keyConnect) keyConnect.addEventListener('click', () => {
  const k = groqKeyInput.value.trim();
  if(!k){ const note = document.getElementById('keyMsg'); if(note) note.textContent = 'Set GROQ_API_KEY in app.js before deploying.'; return; }
  groqKey = k; groqModel = groqModelSel ? groqModelSel.value : groqModel;
  keyPanel.classList.remove('show');
  startLiveSession();
});

/* Safari/iOS can silently drop speechSynthesis while the tab is
   backgrounded; speak()'s own watchdog already recovers within a few
   seconds regardless, this just nudges it the instant focus returns. */
document.addEventListener('visibilitychange', () => {
  if(!synthOK) return;
  if(document.visibilityState === 'visible' && !window.speechSynthesis.speaking && (playing || liveBusy)){
    try{ window.speechSynthesis.resume(); }catch(e){}
  }
});

/* initial paint (behind the gate) */
loadLesson(selectedMode);
refreshResumeButton();

})();
