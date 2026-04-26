#!/usr/bin/env node
/**
 * Extracts raw text from all research PDFs and caches it locally.
 *
 * Usage:
 *   npm run extract-text
 *
 * Output:
 *   scripts/.text-cache/<caption>.txt  — full extracted text per paper
 *   docs/src/data/topicData.json       — updated with wordcount field per paper
 *
 * Text proxies (e.g. 1987_Siegel_TactileSensor_textproxy.pdf) are preferred
 * over original PDFs when present in the local ResearchContent directory.
 */

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require   = createRequire(import.meta.url);
const pdfParse  = require('pdf-parse');

const __dirname      = path.dirname(fileURLToPath(import.meta.url));
const ROOT           = path.resolve(__dirname, '..');
const LOCAL_CONTENT  = process.env.RESEARCH_CONTENT_PATH
  || path.join(process.env.HOME, 'Documents/Projects/WebSite/ResearchContent');
const TEXT_CACHE_DIR = path.join(__dirname, '.text-cache');
const OUTPUT_FILE    = path.join(ROOT, 'docs/src/data/topicData.json');
const RC_PREFIX      = 'https://stevenmdrucker.github.io/ResearchContent/';

// ─── helpers ─────────────────────────────────────────────────────────────────

function safeName(caption) {
  return caption.replace(/[^\w\-]/g, '_').slice(0, 120);
}

function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

async function fetchPdf(pdfUrl) {
  if (pdfUrl.startsWith(RC_PREFIX)) {
    const rel          = pdfUrl.slice(RC_PREFIX.length);
    const localPath    = path.join(LOCAL_CONTENT, rel);
    const proxyPath    = localPath.replace(/\.pdf$/i, '_textproxy.pdf');

    if (fs.existsSync(proxyPath)) {
      process.stdout.write(` [proxy]`);
      return fs.readFileSync(proxyPath);
    }
    if (fs.existsSync(localPath)) {
      return fs.readFileSync(localPath);
    }
    // fall through to remote fetch
  }
  try {
    const res = await fetch(pdfUrl);
    if (!res.ok) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch { return null; }
}

// ─── main ────────────────────────────────────────────────────────────────────

async function main() {
  fs.mkdirSync(TEXT_CACHE_DIR, { recursive: true });

  // Prefer local researchData.json so URL edits are picked up before pushing
  const localDataPath = path.join(LOCAL_CONTENT, 'researchData.json');
  const allPapers = JSON.parse(fs.readFileSync(localDataPath, 'utf8'));
  const withPdf   = allPapers.filter(p => p.pdf);
  console.log(`${withPdf.length} papers have PDF paths\n`);

  // Load existing topicData.json to patch wordcounts
  const topicData = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));

  let nExtracted = 0, nCached = 0, nFailed = 0;

  for (let i = 0; i < withPdf.length; i++) {
    const paper   = withPdf[i];
    const caption = paper.caption || `paper-${i}`;
    const txtPath = path.join(TEXT_CACHE_DIR, `${safeName(caption)}.txt`);

    // ── already cached ────────────────────────────────────────────────────
    if (fs.existsSync(txtPath)) {
      if (topicData.papers[caption] && topicData.papers[caption].wordcount == null) {
        const text = fs.readFileSync(txtPath, 'utf8');
        topicData.papers[caption].wordcount = wordCount(text);
      }
      process.stdout.write('.');
      nCached++;
      continue;
    }

    // ── extract ───────────────────────────────────────────────────────────
    process.stdout.write(`\n[${i + 1}/${withPdf.length}] ${caption}`);

    try {
      const buf = await fetchPdf(paper.pdf);
      if (!buf) {
        console.log('\n  ✗ not reachable');
        nFailed++;
        continue;
      }

      let parsed;
      try   { parsed = await pdfParse(buf); }
      catch (e) { console.log(`\n  ✗ parse error: ${e.message}`); nFailed++; continue; }

      const text = (parsed.text || '').trim();
      if (text.length < 100) {
        console.log('\n  ✗ too little text');
        nFailed++;
        continue;
      }

      const wc = wordCount(text);
      fs.writeFileSync(txtPath, text, 'utf8');

      if (topicData.papers[caption]) {
        topicData.papers[caption].wordcount = wc;
      }

      console.log(`  ✓ ${wc.toLocaleString()} words`);
      nExtracted++;

    } catch (e) {
      console.error(`\n  ✗ ${e.message}`);
      nFailed++;
    }
  }

  console.log(`\n\n── Done ──`);
  console.log(`Extracted: ${nExtracted}  From cache: ${nCached}  Failed: ${nFailed}`);

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(topicData, null, 2));
  console.log(`✓ Updated ${OUTPUT_FILE} with wordcount`);
}

main().catch(e => { console.error(e); process.exit(1); });
