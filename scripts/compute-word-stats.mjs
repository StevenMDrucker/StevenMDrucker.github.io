#!/usr/bin/env node
/**
 * compute-word-stats.mjs
 *
 * Reads the existing wordData.json (word-frequency matrix) and topicData.json
 * (per-paper topic weights) and produces wordStats.json with:
 *
 *   • Stemmed vocabulary  — "user" + "users" → "user", etc.
 *   • Per-paper unique stems — top TF-IDF terms distinguishing each paper
 *   • Per-topic unique stems — top TF-IDF terms distinguishing each topic cluster
 *   • Cross-cutting stems — words that appear broadly across topics but are
 *       NOT trivially common function words
 *
 * Usage:
 *   node scripts/compute-word-stats.mjs [--report] [--min-df N] [--top-n N]
 *
 *   --report    print a readable console report instead of writing JSON
 *   --min-df    minimum document frequency to include a stem (default: 3)
 *   --top-n     top stems to record per paper / topic (default: 25)
 *
 * Output:
 *   docs/src/data/wordStats.json
 */

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, '..');

const WORD_DATA_PATH      = path.join(ROOT, 'docs/src/data/wordData.json');
const TOPIC_DATA_PATH     = path.join(ROOT, 'docs/src/data/topicData.json');
const TOPIC_OVERRIDES_PATH = path.join(ROOT, 'docs/src/data/topicOverrides.json');
const OUT_PATH            = path.join(ROOT, 'docs/src/data/wordStats.json');

const args   = process.argv.slice(2);
const REPORT = args.includes('--report');
const MIN_DF = Number(args.find((a,i) => args[i-1] === '--min-df') ?? 3);
const TOP_N  = Number(args.find((a,i) => args[i-1] === '--top-n') ?? 25);

// ─── stopwords ────────────────────────────────────────────────────────────────
// Expanded list – includes common academic boilerplate and venue/institution
// metadata that appears in extracted PDF text.
const STOPWORDS = new Set([
  // Function words
  'the','a','an','and','or','but','in','on','at','to','for','of','with',
  'by','from','as','is','are','was','were','be','been','being','have','has',
  'had','do','does','did','will','would','could','should','may','might',
  'this','that','these','those','it','its','we','our','they','their','there',
  'here','which','who','when','where','how','what','all','each','any','some',
  'more','also','can','not','no','if','than','then','so','such','about',
  'into','over','after','between','through','during','before','above','below',
  'both','few','many','most','other','same','own','very','just','only',
  'one','two','three','four','five','first','second','third','see','ing',
  // Generic academic verbs and terms
  'show','shown','use','used','using','base','based','new','approach',
  'method','result','system','data','number','different','set','given',
  'provide','well','while','however','although','thus','therefore',
  'since','because','et','al','fig','figure','table','section',
  'present','discuss','describe','introduce','propose','allow','make',
  'made','need','large','small','high','low','long','type','include',
  'require','support','enable','help','exist','contain','perform','appear',
  'define','refer','follow','create','find','found','develop','apply',
  'extend','evaluate','compare','report','design','example','case','way',
  'point','line','form','part','view','level','time','work',
  'paper','papers','work','works','like','see','general','specific','several',
  // Research subject words too generic after stemming
  'user','users','participant','participants','study','studies',
  'task','tasks','item','items','list','value','values','object','objects',
  'feature','features','group','groups','model','models','order','class',
  'information','process','current','changes','factors','problem','questions',
  // Venue / institution metadata
  'acm','doi','http','www','html','pdf','isbn','conf','proc','journal',
  'ieee','chi','proceedings','conference','workshop','symposium',
  'microsoft','research','org','com','usa',
  // PDF extraction artifacts
  'tion','tions','ing',
  // My name (appears in author lines of extracted PDFs)
  'drucker','steven',
]);

// ─── Practical stemmer ────────────────────────────────────────────────────────
// Conservative suffix-stripping: merges the most common English inflections
// (plurals, -ing, -ed, -er forms) without over-reducing long compound words
// like "visualization".  Priority: longest matching suffix first.
function stem(w) {
  if (w.length <= 3) return w;

  const EXCEPTIONS = {
    'axes': 'axis', 'mice': 'mouse', 'lenses': 'lens',
    'bases': 'base', 'aliases': 'alias',
  };
  if (EXCEPTIONS[w]) return EXCEPTIONS[w];

  let s = w;

  // --- Multi-char verb/noun suffixes (longest first) ---
  // -izations / -isation → -ization  (visualizations → visualization)
  if (s.endsWith('izations') && s.length > 10) return s.slice(0, -1);
  if (s.endsWith('isations') && s.length > 10) return s.slice(0, -1);

  // -izing / -ising → -ize
  if (s.endsWith('izing') && s.length > 8)  return s.slice(0, -3) + 'e';
  if (s.endsWith('ising') && s.length > 8)  return s.slice(0, -3) + 'e';

  // -ized / -ised → -ize
  if (s.endsWith('ized') && s.length > 7)   return s.slice(0, -1);
  if (s.endsWith('ised') && s.length > 7)   return s.slice(0, -1);

  // -izes / -ises → -ize
  if (s.endsWith('izes') && s.length > 7)   return s.slice(0, -1);
  if (s.endsWith('ises') && s.length > 7)   return s.slice(0, -1);

  // -ings → -ing  (showings → showing → we keep showing as canonical)
  if (s.endsWith('ings') && s.length > 7)   return s.slice(0, -1);

  // -ing → strip, preserving double-consonant rule
  if (s.endsWith('ing') && s.length > 6) {
    const root = s.slice(0, -3);
    if (/([bcdfghjklmnpqrstvwxyz])\1$/.test(root)) return root.slice(0, -1); // running→run
    return root;  // showing→show, clustering→cluster, rendering→render
  }

  // -ies → -y   (queries → query, babies → baby)
  if (s.endsWith('ies') && s.length > 5)    return s.slice(0, -3) + 'y';

  // -ied → -y
  if (s.endsWith('ied') && s.length > 5)    return s.slice(0, -3) + 'y';

  // -ers → -er  (browsers → browser)
  if (s.endsWith('ers') && s.length > 6)    return s.slice(0, -1);

  // -ed → strip  (searched → search)
  if (s.endsWith('ed') && s.length > 5)     return s.slice(0, -2);

  // -es → strip  (searches → search, but NOT "caches" → "cach")
  if (s.endsWith('es') && s.length > 5 && !/[aeiou]e$/.test(s.slice(0, -1)))
    return s.slice(0, -2);

  // -s → strip (plural)
  if (s.endsWith('s') && s.length > 4 && !s.endsWith('ss'))
    s = s.slice(0, -1);

  // Final normalisation: strip trailing -e from long words so that
  // "interface" and "interfaces" → same stem "interfac",
  // "explore" / "explores" / "exploring" all land on "explor", etc.
  if (s.endsWith('e') && s.length > 5)
    s = s.slice(0, -1);

  return s;
}


// ─── load data ────────────────────────────────────────────────────────────────
const WD  = JSON.parse(fs.readFileSync(WORD_DATA_PATH,       'utf8'));
const TD  = JSON.parse(fs.readFileSync(TOPIC_DATA_PATH,      'utf8'));
const OVR = JSON.parse(fs.readFileSync(TOPIC_OVERRIDES_PATH, 'utf8')).overrides;

const WORDS   = WD.words;   // global vocab
const FREQS   = WD.freqs;   // global frequency per word index
const PAPERS  = WD.papers;  // array of { caption, year, wordcount, tw: [[idx,cnt],...] }
const TPAPERS = TD.papers;  // keyed by caption: { weights: { topic: weight } }

// ─── new canonical topic taxonomy ────────────────────────────────────────────
// Matches topicColors.ts: manual overrides take priority over ML weights +
// rename map.  Each paper belongs 100% to exactly one topic.
const TOPIC_RENAME = {
  'Computer Graphics':      'Computer Graphics & AR/VR',
  'Photo & Image Tools':    'Photo/Video Tools',
  'Video & Rich Media':     'Photo/Video Tools',
  'Data Storytelling':      'Storytelling, Presentation & Cameras',
  'Human-in-the-Loop ML':  'UI/Visualization for ML',
  'Immersive & AR/VR':      'Computer Graphics & AR/VR',
  '3D Navigation & Camera': 'Storytelling, Presentation & Cameras',
  'AI Assistance':          'AI Assistance',  // self (old) → new AI Assistance
};

function resolveTopic(caption) {
  const ov = OVR[caption];
  if (ov && !ov.startsWith('──')) return ov;
  const weights = TPAPERS[caption]?.weights ?? {};
  let best = '', maxW = -Infinity;
  for (const [t, w] of Object.entries(weights)) {
    if (w > maxW) { maxW = w; best = t; }
  }
  if (best) return TOPIC_RENAME[best] ?? best;
  return 'Visualization';
}

// Ordered topic list (matches TOPIC_ORDER in topicColors.ts)
const TOPICS = [
  'Robotics & Sensing',
  'Hypertext & Links',
  'Computer Graphics & AR/VR',
  'Storytelling, Presentation & Cameras',
  'Online Communities',
  'Visualization',
  'Photo/Video Tools',
  'Web Search & Content',
  'Notebooks & Code',
  'Interaction Design',
  'UI/Visualization for ML',
  'AI Assistance',
  'Visual Analytics',
];

const N_PAPERS = PAPERS.length;
const N_TOPICS = TOPICS.length;

// ─── build stem mapping ───────────────────────────────────────────────────────
// For each original word, compute its stem.  Group words by stem, choosing the
// most frequent original word as the canonical surface form.

const stemOf = WORDS.map(w => stem(w.toLowerCase()));

// stem → { canonical, wordIndices }
const stemGroups = {};
WORDS.forEach((w, i) => {
  const s = stemOf[i];
  if (!stemGroups[s]) stemGroups[s] = { canonical: w, freq: 0, wordIndices: [] };
  stemGroups[s].wordIndices.push(i);
  stemGroups[s].freq += FREQS[i];
  // prefer the shorter / more frequent word as canonical
  if (FREQS[i] > stemGroups[s].freq - FREQS[i]) stemGroups[s].canonical = w;
});

// Index stems
const stemList      = Object.keys(stemGroups);
const stemFreqList  = stemList.map(s => stemGroups[s].freq);
const stemCanonical = stemList.map(s => stemGroups[s].canonical);
const stemIdx       = {};   // original word index → stem index
stemList.forEach((s, si) => {
  for (const wi of stemGroups[s].wordIndices) stemIdx[wi] = si;
});

console.log(`\nVocabulary: ${WORDS.length} words → ${stemList.length} stems`);

// ─── build per-paper stem frequency matrix ────────────────────────────────────
// paperStemCounts[j][si] = raw count of stem si in paper j
// Also track document frequency: df[si] = # papers containing stem si

const df = new Float32Array(stemList.length);   // doc freq per stem
const paperStemData = PAPERS.map(paper => {
  const counts = {};   // stemIdx → count
  for (const [wi, cnt] of paper.tw) {
    const si = stemIdx[wi];
    if (si !== undefined) counts[si] = (counts[si] || 0) + cnt;
  }
  for (const si of Object.keys(counts)) df[si]++;
  return counts;
});

// ─── compute TF-IDF ───────────────────────────────────────────────────────────
// TF  = count / paper_total_count  (relative frequency)
// IDF = log((N+1)/(df+1)) + 1       (smoothed)
// Score = TF * IDF

const idf = stemList.map((_, si) => Math.log((N_PAPERS + 1) / (df[si] + 1)) + 1);

function paperTfIdf(j) {
  const counts  = paperStemData[j];
  const total   = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  const scores  = {};
  for (const [si, cnt] of Object.entries(counts)) {
    scores[si] = (cnt / total) * idf[si];
  }
  return scores;
}

// ─── per-paper unique stems ───────────────────────────────────────────────────
function isUsableStem(si) {
  const s    = stemList[si];
  const canon = stemCanonical[si];
  return s.length >= 4
    && canon.length >= 4
    && !STOPWORDS.has(s)
    && !STOPWORDS.has(canon)
    && df[si] >= MIN_DF;
}

const paperUnique = PAPERS.map((paper, j) => {
  const scores = paperTfIdf(j);
  return Object.entries(scores)
    .filter(([si]) => isUsableStem(Number(si)))
    .sort((a, b) => b[1] - a[1])
    .slice(0, TOP_N)
    .map(([si, score]) => [Number(si), +score.toFixed(4)]);
});

// ─── per-topic stem aggregation ───────────────────────────────────────────────
// Each paper belongs 100% to its resolved canonical topic (hard assignment).
// This matches how the visualisations display papers and gives much sharper
// per-topic TF-IDF than soft ML weights.

const topicCounts   = TOPICS.map(() => ({}));  // topic → stemIdx → weighted count
const topicTotals   = new Float32Array(N_TOPICS);

PAPERS.forEach((paper, j) => {
  const topic = resolveTopic(paper.caption);
  const ti    = TOPICS.indexOf(topic);
  if (ti < 0) return;
  const stemCounts = paperStemData[j];
  const total = Object.values(stemCounts).reduce((a, b) => a + b, 0) || 1;
  for (const [si, cnt] of Object.entries(stemCounts)) {
    topicCounts[ti][si] = (topicCounts[ti][si] || 0) + cnt / total;
  }
  topicTotals[ti] += 1;
});

// Topic-level TF-IDF: IDF across topics (topic document frequency)
const topicDf = new Float32Array(stemList.length);
TOPICS.forEach((_, ti) => {
  for (const si of Object.keys(topicCounts[ti])) {
    if (topicCounts[ti][si] > 0.01) topicDf[si]++;
  }
});
const topicIdf = stemList.map((_, si) =>
  Math.log((N_TOPICS + 1) / (topicDf[si] + 1)) + 1
);

const topicUnique = TOPICS.map((topic, ti) => {
  const total = topicTotals[ti] || 1;
  const scores = {};
  for (const [si, cnt] of Object.entries(topicCounts[ti])) {
    scores[si] = (cnt / total) * topicIdf[si];
  }
  return Object.entries(scores)
    .filter(([si]) => isUsableStem(Number(si)))
    .sort((a, b) => b[1] - a[1])
    .slice(0, TOP_N)
    .map(([si, score]) => [Number(si), +score.toFixed(4)]);
});

// ─── cross-cutting stems ──────────────────────────────────────────────────────
// Cross-cutting: stems that appear in MANY topics (low topicIdf) but are
// NOT in stopwords and are semantically interesting.
// Score = global frequency × (1 / topicIdf) → large = appears everywhere
// We bucket these into:
//   "broad"    = in most topics (topicDf / N_TOPICS > 0.6)
//   "moderate" = in several topics (0.3 < topicDf/N_TOPICS ≤ 0.6)
//   "narrow"   = topic-specific (topicDf/N_TOPICS ≤ 0.3)

const crossCutting = stemList
  .map((s, si) => {
    if (!isUsableStem(si)) return null;
    const coverage = topicDf[si] / N_TOPICS;
    return { si, stem: stemCanonical[si], coverage, freq: stemFreqList[si] };
  })
  .filter(Boolean)
  .sort((a, b) => b.coverage - a.coverage || b.freq - a.freq);

const broad    = crossCutting.filter(d => d.coverage > 0.6).slice(0, 40);
const moderate = crossCutting.filter(d => d.coverage > 0.3 && d.coverage <= 0.6).slice(0, 50);

// ─── report ───────────────────────────────────────────────────────────────────
if (REPORT) {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  TF/IDF Word Statistics Report');
  console.log('═══════════════════════════════════════════════════════════════\n');

  console.log('── STEMMING SAMPLES ──────────────────────────────────────────\n');
  const interesting = ['users','visualizations','interfaces','interactions',
    'visualizing','systems','methods','results','techniques','clustering',
    'researchers','searching','queries','rendering','animations'];
  interesting.forEach(w => {
    const idx = WORDS.indexOf(w);
    if (idx >= 0) {
      const s = stemOf[idx];
      const canon = stemGroups[s].canonical;
      console.log(`  ${w.padEnd(22)} → stem "${s}"  canonical "${canon}"`);
    }
  });

  console.log('\n── CROSS-CUTTING (BROAD, ≥60% of topics) ────────────────────\n');
  broad.forEach(d => {
    const bar = '█'.repeat(Math.round(d.coverage * 20));
    console.log(`  ${d.stem.padEnd(24)} ${bar.padEnd(20)} ${(d.coverage*100).toFixed(0).padStart(3)}%  (freq ${d.freq})`);
  });

  console.log('\n── CROSS-CUTTING (MODERATE, 30-60% of topics) ───────────────\n');
  moderate.slice(0, 30).forEach(d => {
    const bar = '█'.repeat(Math.round(d.coverage * 20));
    console.log(`  ${d.stem.padEnd(24)} ${bar.padEnd(20)} ${(d.coverage*100).toFixed(0).padStart(3)}%  (freq ${d.freq})`);
  });

  console.log('\n── PER-TOPIC UNIQUE WORDS ───────────────────────────────────\n');
  TOPICS.forEach((topic, ti) => {
    const top = topicUnique[ti].slice(0, 12).map(([si]) => stemCanonical[si]).join(', ');
    console.log(`  ${topic.padEnd(28)} ${top}`);
  });

  console.log('\n── PER-PAPER SAMPLE (first 10 papers) ──────────────────────\n');
  PAPERS.slice(0, 10).forEach((paper, j) => {
    const top = paperUnique[j].slice(0, 8).map(([si]) => stemCanonical[si]).join(', ');
    console.log(`  ${paper.caption.slice(0, 42).padEnd(44)} ${top}`);
  });

  console.log('\n═══════════════════════════════════════════════════════════════\n');
  process.exit(0);
}

// ─── write wordStats.json ─────────────────────────────────────────────────────
const out = {
  // Stemmed vocabulary (indexed arrays for compact storage)
  stems:     stemCanonical,   // canonical surface form per stem
  stemFreqs: stemFreqList,    // global raw frequency per stem index
  stemRaw:   stemList,        // actual stem string (for debugging)

  // Per-paper: top unique stems as [stemIdx, tfidfScore]
  papers: PAPERS.map((paper, j) => ({
    caption: paper.caption,
    year:    paper.year,
    unique:  paperUnique[j],    // top unique stems (high corpus TF-IDF)
  })),

  // Per-topic: top distinctive stems as [stemIdx, tfidfScore]
  topicWords: Object.fromEntries(
    TOPICS.map((topic, ti) => [topic, topicUnique[ti]])
  ),

  // Cross-cutting: stems spanning many topics
  crossCutting: {
    broad:    broad.map(d => [d.si, +d.coverage.toFixed(3)]),    // >60% topic coverage
    moderate: moderate.map(d => [d.si, +d.coverage.toFixed(3)]), // 30–60%
  },

  // Stem-to-wordIdx mapping for reverse lookup
  wordToStem: WORDS.map((_, wi) => stemIdx[wi] ?? -1),
};

fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2));
console.log(`\n✓ Wrote ${OUT_PATH}`);
console.log(`  ${stemList.length} stems, ${PAPERS.length} papers, ${N_TOPICS} topics`);
console.log(`  Broad cross-cutting stems: ${broad.length}`);
console.log(`  Moderate cross-cutting stems: ${moderate.length}`);
