#!/usr/bin/env node
/**
 * Rates each research paper against a fixed taxonomy derived from the Timeline
 * visualization's primary categories (UI-Information split into two).
 *
 * Prerequisites:
 *   brew install ollama && brew services start ollama
 *   ollama pull llama3.2
 *
 * Usage:
 *   npm run extract-topics
 *   OLLAMA_MODEL=llama3.1:8b npm run extract-topics
 *
 * Output: docs/src/data/topicData.json
 * Cache:  scripts/.extract-cache.json  (delete to reprocess)
 *
 * Per-paper output:
 *   { year, pages, weights: { topic: 0.0–1.0 } }
 *
 * Weights do NOT need to sum to 1 — a paper narrowly about one topic scores
 * 1.0 on that topic and 0 on others; a genuinely cross-cutting paper might
 * score 0.7 + 0.6 + 0.4. Missing topics are implicitly 0.
 *
 * The streamgraph accumulates  sum(weight × pages)  per year per topic, so
 * longer papers contribute proportionally more.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT       = path.resolve(__dirname, '..');
const BASE_URL   = 'https://stevenmdrucker.github.io/ResearchContent/';
const LOCAL_CONTENT = process.env.RESEARCH_CONTENT_PATH
  || path.join(process.env.HOME, 'Documents/Projects/WebSite/ResearchContent');
const CACHE_FILE = path.join(__dirname, '.extract-cache.json');
const OUTPUT_FILE = path.join(ROOT, 'docs/src/data/topicData.json');
const OLLAMA_URL  = process.env.OLLAMA_URL  || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';

// ─── taxonomy v1 (original, 11 topics) ───────────────────────────────────────
// Derived from the Timeline's primaryList; UI-Information split into two.
// Kept for rollback — to revert, set TOPICS = TOPICS_V1 below.
const TOPICS_V1 = [
  { name: 'Hypertext',        desc: 'hypertext, hypermedia, web links, linked documents, browser navigation' },
  { name: 'Robotics',         desc: 'robot learning, robot control, tactile sensing, autonomous systems' },
  { name: 'Graphics',         desc: 'computer graphics, rendering, ray tracing, radiosity, 3D animation, parallel graphics' },
  { name: 'Camera',           desc: 'camera control, cinematography, viewpoint selection, virtual camera, camera interfaces' },
  { name: 'Social',           desc: 'social interaction, online communities, avatars, chat, computer-mediated communication, virtual worlds' },
  { name: 'User Interfaces',  desc: 'UI design, interaction design, input devices, gestures, touch, user studies, usability' },
  { name: 'Information',      desc: 'information retrieval, web search, web content extraction, data management, information organization' },
  { name: 'Media',            desc: 'digital photos, video, audio, streaming, media browsing, photo management, photo triage' },
  { name: 'Presentation',     desc: 'presentation tools, slideshows, storytelling, narrative, demonstration' },
  { name: 'Machine Learning', desc: 'machine learning, classification, deep learning, neural networks, model debugging, ML tools' },
  { name: 'Visualization',    desc: 'information visualization, data visualization, visual analytics, interactive charts, visual query' },
];

// ─── taxonomy v2 (15 topics, TF-IDF–informed) ────────────────────────────────
// Splits the three universal v1 topics (User Interfaces, Visualization,
// Information) into more discriminating sub-areas, and separates narrow
// early-career topics (Robotics, Hypertext) from their natural neighbours.
const TOPICS_V2 = [
  { name: 'Hypertext & Links',        desc: 'hypertext systems, hypermedia, linked documents, web links, transclusion, document structure, Intermedia' },
  { name: 'Computer Graphics',        desc: 'rendering, ray tracing, radiosity, parallel graphics, 3D animation, scan conversion, shading' },
  { name: '3D Navigation & Camera',   desc: 'virtual camera control, cinematography, viewpoint selection, 3D navigation, camera path planning, visibility constraints' },
  { name: 'Robotics & Task Learning', desc: 'robot learning, tactile sensing, task-level control, juggling, autonomous manipulation, motor skill learning' },
  { name: 'Online Communities',       desc: 'avatars, virtual worlds, MOOs, MUDs, chat, computer-mediated communication, social spaces, online interaction' },
  { name: 'Photo & Image Tools',      desc: 'photo management, photo triage, image browsing, photomontage, image completion, image annotation, photo collections' },
  { name: 'Video & Rich Media',       desc: 'video browsing, video editing, cliplets, media collections, streaming, token TV, screencast, media lifecycle' },
  { name: 'Web Search & Content',     desc: 'web search, information retrieval, web content extraction, webpage structure, query formulation, search variability' },
  { name: 'Interactive Visualization',desc: 'information visualization, interactive charts, SandDance, visual query, faceted browsing, data tables, visual encoding' },
  { name: 'Visual Analytics',         desc: 'visual analytics, data exploration, dashboard, big data, incremental visualization, uncertainty visualization, immersive analytics' },
  { name: 'Data Storytelling',        desc: 'narrative visualization, data-driven storytelling, presentation tools, slideshow, demonstration, animation, audience communication' },
  { name: 'Human-in-the-Loop ML',    desc: 'interactive machine learning, active learning, labeling, model debugging, classifier evaluation, AnchorViz, ML fairness' },
  { name: 'AI Assistance',           desc: 'AI-assisted analysis, language models, code generation, AI explanation, model communication, GPT, LLM tools' },
  { name: 'Notebooks & Code',        desc: 'computational notebooks, Jupyter, code assistants, notebook management, literate programming, data science workflows' },
  { name: 'Immersive & AR/VR',       desc: 'virtual reality, augmented reality, immersive environments, mixed reality, spatial interaction, VR analytics, 3D UI' },
];

// ── active taxonomy (switch here to roll back to v1) ─────────────────────────
const TOPICS = TOPICS_V2;

const TOPIC_NAMES = TOPICS.map(t => t.name);

// ─── helpers ──────────────────────────────────────────────────────────────────

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function fetchPdf(pdfUrl) {
  // If it's a ResearchContent URL, try the local copy first
  const RC_PREFIX = 'https://stevenmdrucker.github.io/ResearchContent/';
  if (pdfUrl.startsWith(RC_PREFIX)) {
    const relativePath = pdfUrl.slice(RC_PREFIX.length); // e.g. "papers/2004_Agarwala_Photomontage.pdf"
    const localPath = path.join(LOCAL_CONTENT, relativePath);

    // Check for a _textproxy variant first (same stem, _textproxy suffix before .pdf)
    const textproxyPath = localPath.replace(/\.pdf$/i, '_textproxy.pdf');
    if (fs.existsSync(textproxyPath)) {
      console.log(`  [using text proxy: ${path.basename(textproxyPath)}]`);
      return fs.readFileSync(textproxyPath);
    }

    if (fs.existsSync(localPath)) {
      return fs.readFileSync(localPath);
    }
    // Not on disk yet — try the live URL anyway
  }

  // For arxiv and any other remote URL, fetch directly
  try {
    const res = await fetch(pdfUrl);
    if (!res.ok) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch { return null; }
}

async function ollamaChat(prompt) {
  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      stream: false,
      options: { temperature: 0.0, num_predict: 600 },
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Ollama ${res.status}: ${await res.text()}`);
  return (await res.json()).message.content.trim();
}

// ─── per-paper rating ─────────────────────────────────────────────────────────

async function ratePaper(text, title, pages) {
  // Use first 4000 chars — enough for abstract + intro, minimises token cost
  const excerpt = text.slice(0, 4000);

  const topicLines = TOPICS
    .map(t => `  "${t.name}": (${t.desc})`)
    .join('\n');

  const prompt = `Rate this academic paper against each research topic below.
Score 0.0 = not about this topic at all.
Score 1.0 = this paper is entirely about this topic.
Scores do NOT need to sum to 1.  A focused paper scores ~1.0 on one topic.
A cross-cutting paper may score 0.6 on several.

Paper title: "${title}"
Pages: ${pages}
Text excerpt:
${excerpt}

Topics to rate:
${topicLines}

Return ONLY a JSON object mapping each topic name to its score, e.g.:
${JSON.stringify(Object.fromEntries(TOPIC_NAMES.map((n, i) => [n, i === 0 ? 0.8 : i === 1 ? 0.3 : 0.0])))}`;


  const raw = await ollamaChat(prompt);
  const m = raw.match(/\{[\s\S]*\}/);
  if (!m) throw new Error(`No JSON: ${raw.slice(0, 120)}`);

  const parsed = JSON.parse(m[0]);

  // Validate and clamp; fill missing topics with 0
  const weights = {};
  for (const name of TOPIC_NAMES) {
    const v = parseFloat(parsed[name] ?? 0);
    weights[name] = isNaN(v) ? 0 : Math.max(0, Math.min(1, v));
  }
  return weights;
}

// ─── main ─────────────────────────────────────────────────────────────────────

async function main() {
  // Verify Ollama
  try {
    const ping = await fetch(`${OLLAMA_URL}/api/tags`);
    if (!ping.ok) throw new Error(`status ${ping.status}`);
    const { models } = await ping.json();
    const has = models.some(m => m.name.startsWith(OLLAMA_MODEL.split(':')[0]));
    if (!has) {
      console.warn(`Model "${OLLAMA_MODEL}" not found locally. Run: ollama pull ${OLLAMA_MODEL}`);
    } else {
      console.log(`Using Ollama model: ${OLLAMA_MODEL}`);
    }
  } catch (e) {
    console.error(`Cannot reach Ollama at ${OLLAMA_URL}: ${e.message}`);
    console.error('Run: brew services start ollama');
    process.exit(1);
  }

  // Fetch paper index — prefer local copy so unpushed URL edits are picked up
  const LOCAL_DATA = path.join(LOCAL_CONTENT, 'researchData.json');
  let allPapers;
  if (fs.existsSync(LOCAL_DATA)) {
    console.log(`Reading researchData.json from local: ${LOCAL_DATA}`);
    allPapers = JSON.parse(fs.readFileSync(LOCAL_DATA, 'utf8'));
  } else {
    console.log('Fetching researchData.json …');
    allPapers = await fetch(BASE_URL + 'researchData.json').then(r => r.json());
  }
  const withPdf   = allPapers.filter(p => p.pdf);
  console.log(`${withPdf.length} papers have PDF paths\n`);

  // Load cache
  let cache = {};
  if (fs.existsSync(CACHE_FILE)) {
    cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    console.log(`Loaded ${Object.keys(cache).length} cached entries\n`);
  }

  const results = [];   // { key, year, pages, weights }
  const skipped = [];

  for (let i = 0; i < withPdf.length; i++) {
    const paper = withPdf[i];
    const key   = paper.caption || paper.ID || `paper-${i}`;
    const year  = parseInt(paper.year ?? paper.tags?.year?.[0]) || null;

    if (cache[key]) {
      results.push({ key, year, ...cache[key] });
      process.stdout.write('.');
      continue;
    }

    console.log(`\n[${i + 1}/${withPdf.length}] ${key}`);

    try {
      const buf = await fetchPdf(paper.pdf);  // paper.pdf is now a full URL
      if (!buf) { console.log('  ✗ not reachable'); skipped.push(key); continue; }

      let parsed;
      try { parsed = await pdfParse(buf); }
      catch (e) { console.log(`  ✗ parse error: ${e.message}`); skipped.push(key); continue; }

      if (!parsed.text || parsed.text.length < 200) {
        console.log('  ✗ too little text'); skipped.push(key); continue;
      }

      const pages   = parsed.numpages || 1;
      const weights = await ratePaper(parsed.text, key, pages);

      const top = Object.entries(weights)
        .filter(([, v]) => v > 0)
        .sort((a, b) => b[1] - a[1])
        .map(([k, v]) => `${k}:${v}`)
        .join('  ');
      console.log(`  ✓ [${pages}pp] ${top}`);

      cache[key] = { pages, weights };
      fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
      results.push({ key, year, pages, weights });

    } catch (e) {
      console.error(`  ✗ ${e.message}`);
      skipped.push(key);
      await sleep(500);
    }
  }

  console.log(`\n\n── Done ──`);
  console.log(`Rated: ${results.length}  Skipped: ${skipped.length}`);

  if (!results.length) { console.error('Nothing to write.'); process.exit(1); }

  // Build output
  const papers = {};
  for (const { key, year, pages, weights } of results) {
    papers[key] = { year, pages, weights };
  }

  const output = { topics: TOPIC_NAMES, papers };
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`✓ Saved ${OUTPUT_FILE}  (${results.length} papers)`);
}

main().catch(e => { console.error(e); process.exit(1); });
