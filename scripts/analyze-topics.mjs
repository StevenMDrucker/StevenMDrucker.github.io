#!/usr/bin/env node
/**
 * Analyzes current topic coverage across all papers, then asks Ollama to
 * suggest a better ~15-topic taxonomy.
 *
 * Usage:
 *   npm run analyze-topics
 *
 * Reads:
 *   docs/src/data/topicData.json   — current weights per paper
 *   scripts/.text-cache/*.txt      — full text (run extract-text first)
 *
 * Output:
 *   Console report: coverage stats, correlation, under-covered papers
 *   Ollama response: proposed 15-topic taxonomy (copy into extract-topics.mjs)
 */

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname      = path.dirname(fileURLToPath(import.meta.url));
const ROOT           = path.resolve(__dirname, '..');
const TEXT_CACHE_DIR = path.join(__dirname, '.text-cache');
const OUTPUT_FILE    = path.join(ROOT, 'docs/src/data/topicData.json');
const OLLAMA_URL     = process.env.OLLAMA_URL   || 'http://localhost:11434';
const OLLAMA_MODEL   = process.env.OLLAMA_MODEL || 'llama3.2';

// ─── stopwords ────────────────────────────────────────────────────────────────

const STOPWORDS = new Set([
  'the','a','an','and','or','but','in','on','at','to','for','of','with',
  'by','from','as','is','are','was','were','be','been','being','have','has',
  'had','do','does','did','will','would','could','should','may','might',
  'this','that','these','those','it','its','we','our','they','their','there',
  'here','which','who','when','where','how','what','all','each','any','some',
  'more','also','can','not','no','if','than','then','so','such','about',
  'into','over','after','between','through','during','before','above','below',
  'both','few','many','most','other','same','own','very','just','only',
  'been','i','you','he','she','us','them','my','your','his','her','its',
  'we','one','two','three','figure','table','section','paper','work',
  'show','shows','shown','use','used','using','based','new','approach',
  'method','results','system','data','user','users','number','different',
  'set','given','provide','information','can','well','while','however',
  'although','thus','therefore','since','because','et','al','fig',
]);

// ─── TF-IDF ──────────────────────────────────────────────────────────────────

function tokenize(text) {
  return text.toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 4 && !STOPWORDS.has(w));
}

function buildTfIdf(corpus) {
  // corpus: Array<{ caption, tokens }>
  const N = corpus.length;
  // IDF
  const df = {};
  for (const { tokens } of corpus) {
    const unique = new Set(tokens);
    for (const t of unique) df[t] = (df[t] || 0) + 1;
  }
  const idf = {};
  for (const [t, d] of Object.entries(df)) {
    idf[t] = Math.log((N + 1) / (d + 1)) + 1; // smoothed
  }
  // TF-IDF per document
  return corpus.map(({ caption, tokens }) => {
    const tf = {};
    for (const t of tokens) tf[t] = (tf[t] || 0) + 1;
    const total = tokens.length || 1;
    const tfidf = {};
    for (const [t, f] of Object.entries(tf)) {
      tfidf[t] = (f / total) * idf[t];
    }
    // Top 30 terms
    const top = Object.entries(tfidf)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30)
      .map(([t]) => t);
    return { caption, top };
  });
}

// ─── stats helpers ────────────────────────────────────────────────────────────

function pearson(a, b) {
  const n = a.length;
  const meanA = a.reduce((s, x) => s + x, 0) / n;
  const meanB = b.reduce((s, x) => s + x, 0) / n;
  let num = 0, da = 0, db = 0;
  for (let i = 0; i < n; i++) {
    num += (a[i] - meanA) * (b[i] - meanB);
    da  += (a[i] - meanA) ** 2;
    db  += (b[i] - meanB) ** 2;
  }
  return (da * db) === 0 ? 0 : num / Math.sqrt(da * db);
}

// ─── Ollama ───────────────────────────────────────────────────────────────────

async function ollamaChat(prompt) {
  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      stream: false,
      options: { temperature: 0.3, num_predict: 1200 },
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Ollama ${res.status}: ${await res.text()}`);
  return (await res.json()).message.content.trim();
}

// ─── main ────────────────────────────────────────────────────────────────────

async function main() {
  // ── load data ───────────────────────────────────────────────────────────
  const topicData = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
  const { topics, papers } = topicData;
  const captions = Object.keys(papers);
  const N = captions.length;

  console.log(`\n══════════════════════════════════════════════════════`);
  console.log(` Topic analysis: ${N} papers, ${topics.length} current topics`);
  console.log(`══════════════════════════════════════════════════════\n`);

  // ── coverage per topic ──────────────────────────────────────────────────
  const THRESHOLD = 0.3;
  console.log(`── Coverage (weight ≥ ${THRESHOLD}) ──────────────────────\n`);
  const topicVectors = {};
  for (const t of topics) {
    topicVectors[t] = captions.map(c => papers[c]?.weights?.[t] ?? 0);
    const covered = topicVectors[t].filter(v => v >= THRESHOLD).length;
    const pct     = ((covered / N) * 100).toFixed(0);
    const avg     = (topicVectors[t].reduce((s,x)=>s+x,0)/N).toFixed(2);
    const max     = Math.max(...topicVectors[t]).toFixed(2);
    console.log(`  ${t.padEnd(22)} ${String(covered).padStart(3)} papers (${pct.padStart(3)}%)  avg=${avg}  max=${max}`);
  }

  // ── papers covered by any topic ─────────────────────────────────────────
  const underCovered = captions.filter(c => {
    const maxW = Math.max(...topics.map(t => papers[c]?.weights?.[t] ?? 0));
    return maxW < THRESHOLD;
  });
  console.log(`\n  Under-covered papers (no topic ≥ ${THRESHOLD}): ${underCovered.length}`);
  underCovered.forEach(c => {
    const maxW = Math.max(...topics.map(t => papers[c]?.weights?.[t] ?? 0));
    console.log(`    - ${c} (max weight: ${maxW.toFixed(2)})`);
  });

  // ── topic correlation ────────────────────────────────────────────────────
  console.log(`\n── High topic correlations (r > 0.5) ────────────────\n`);
  const highCorr = [];
  for (let i = 0; i < topics.length; i++) {
    for (let j = i + 1; j < topics.length; j++) {
      const r = pearson(topicVectors[topics[i]], topicVectors[topics[j]]);
      if (Math.abs(r) > 0.5) {
        highCorr.push({ a: topics[i], b: topics[j], r });
        console.log(`  ${topics[i].padEnd(22)} ↔  ${topics[j].padEnd(22)}  r=${r.toFixed(2)}`);
      }
    }
  }
  if (highCorr.length === 0) console.log('  (none)');

  // ── single-dominant papers per topic ────────────────────────────────────
  console.log(`\n── Topics that dominate very few papers (≤ 2) ──────\n`);
  for (const t of topics) {
    const dominant = captions.filter(c => {
      const w = papers[c]?.weights?.[t] ?? 0;
      const isTop = topics.every(t2 => t2 === t || (papers[c]?.weights?.[t2] ?? 0) <= w);
      return w >= 0.5 && isTop;
    });
    if (dominant.length <= 2) {
      console.log(`  ${t.padEnd(22)} primary for: ${dominant.join(', ') || '(none)'}`);
    }
  }

  // ── TF-IDF top terms per topic cluster ──────────────────────────────────
  console.log(`\n── TF-IDF top terms per topic cluster ───────────────\n`);

  // Build corpus from text cache
  const corpus = [];
  for (const c of captions) {
    const fname = c.replace(/[^\w\-]/g, '_').slice(0, 120) + '.txt';
    const fpath = path.join(TEXT_CACHE_DIR, fname);
    if (fs.existsSync(fpath)) {
      const text   = fs.readFileSync(fpath, 'utf8');
      const tokens = tokenize(text);
      corpus.push({ caption: c, tokens });
    }
  }

  const tfidfDocs = corpus.length > 0 ? buildTfIdf(corpus) : [];
  const tfidfMap  = Object.fromEntries(tfidfDocs.map(d => [d.caption, d.top]));

  // Group by primary topic
  const clusterTerms = {};
  for (const t of topics) clusterTerms[t] = {};
  for (const c of captions) {
    const best  = topics.reduce((b, t) =>
      (papers[c]?.weights?.[t] ?? 0) > (papers[c]?.weights?.[b] ?? 0) ? t : b
    , topics[0]);
    const terms = tfidfMap[c] || [];
    for (const term of terms) {
      clusterTerms[best][term] = (clusterTerms[best][term] || 0) + 1;
    }
  }

  const clusterSummary = {};
  for (const t of topics) {
    const top = Object.entries(clusterTerms[t])
      .sort((a, b) => b[1] - a[1]).slice(0, 20).map(([w]) => w);
    clusterSummary[t] = top;
    console.log(`  ${t.padEnd(22)} ${top.slice(0, 15).join(', ')}`);
  }

  // ── Ollama suggestion ────────────────────────────────────────────────────
  console.log(`\n── Asking Ollama for better taxonomy ────────────────\n`);

  // Build compact paper list: caption + year + current primary topic + top TF-IDF terms
  const paperLines = captions.map(c => {
    const year  = papers[c]?.year ?? '?';
    const best  = topics.reduce((b, t) =>
      (papers[c]?.weights?.[t] ?? 0) > (papers[c]?.weights?.[b] ?? 0) ? t : b
    , topics[0]);
    const bestW = (papers[c]?.weights?.[best] ?? 0).toFixed(2);
    const terms = (tfidfMap[c] || []).slice(0, 10).join(' ');
    return `${year} | ${c} | current=${best}(${bestW}) | terms: ${terms}`;
  });

  const highCorrText = highCorr.length
    ? highCorr.map(h => `${h.a} ↔ ${h.b} (r=${h.r.toFixed(2)})`).join(', ')
    : 'none';

  const underText = underCovered.length
    ? underCovered.join(', ')
    : 'none';

  const clusterText = topics.map(t =>
    `${t}: ${(clusterSummary[t] || []).slice(0, 12).join(', ')}`
  ).join('\n');

  const prompt = `You are helping redesign the research topic taxonomy for a personal website that shows a streamgraph of research activity over time.

Current topics (${topics.length}): ${topics.join(', ')}

PROBLEMS FOUND:
- High pairwise correlations (topics that overlap a lot): ${highCorrText}
- Papers with no strong topic match (max weight < 0.3): ${underText}

Top TF-IDF terms per current topic cluster (these words appear most distinctively in papers currently assigned to each topic):
${clusterText}

ALL PAPERS (year | title | current primary topic | top TF-IDF terms):
${paperLines.join('\n')}

TASK: Propose exactly 15 research topics that:
1. Cover ALL papers above — each paper should score ≥ 0.3 on at least one topic
2. Are mutually distinct — low overlap, high inter-topic correlation is bad
3. Are roughly balanced — no topic covers only 1–2 papers, no topic covers >40% of papers
4. Are semantically meaningful research areas, not just broad descriptors like "Research"
5. Reflect the actual content suggested by the TF-IDF terms above

For each topic, give:
  - A short name (1–3 words)
  - A one-sentence description of what it covers
  - Which current topics it replaces or partially absorbs

Return ONLY a numbered list in this format:
1. <Name>: <description> [replaces: <old topics>]
2. ...
(no extra commentary, just the list)`;

  let suggestion;
  try {
    suggestion = await ollamaChat(prompt);
  } catch (e) {
    console.error(`Ollama error: ${e.message}`);
    suggestion = '(Ollama not available — run: brew services start ollama)';
  }

  console.log('\n══════════════════════════════════════════════════════');
  console.log(' Ollama suggested taxonomy');
  console.log('══════════════════════════════════════════════════════\n');
  console.log(suggestion);
  console.log('\n(Copy the names + descriptions into extract-topics.mjs TOPICS array, then re-run npm run extract-topics)');
}

main().catch(e => { console.error(e); process.exit(1); });
