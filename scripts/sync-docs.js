#!/usr/bin/env node
/**
 * Self-evolving docs — stamps version, build, and date into docs/*.md headers.
 * Run on pre-commit (via husky) or manually: npm run docs:sync
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf-8'));
let buildMeta = { buildNumber: 0, lastUpdated: new Date().toISOString() };
const metaPath = path.join(root, 'build-metadata.json');
if (fs.existsSync(metaPath)) {
  buildMeta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
}

const stamp = {
  version: pkg.version,
  build: buildMeta.buildNumber,
  date: new Date().toISOString().slice(0, 10),
  live: 'https://satohash.giveabit.io',
  github: 'https://github.com/kitsboy/satohash',
};

const HEADER = `<!-- AUTO-GENERATED HEADER — do not edit manually -->
> **Live:** ${stamp.live} · **Version:** ${stamp.version} (Build ${stamp.build}) · **Updated:** ${stamp.date}
> **GitHub:** ${stamp.github} · Synced by \`npm run docs:sync\`

`;

const DOC_FILES = [
  'docs/EXECUTIVE-SUMMARY.md',
  'docs/MARKETING.md',
  'docs/FINANCIALS.md',
  'docs/PITCH.md',
  'docs/DESIGN-CONTEXT.md',
  'docs/DESIGN-TOKENS.md',
  'docs/DEPLOY-PLAYBOOK.md',
  'docs/ROLLBACK.md',
];

for (const rel of DOC_FILES) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) continue;
  let content = fs.readFileSync(full, 'utf-8');
  content = content.replace(/<!-- AUTO-GENERATED HEADER[\s\S]*?-->\n*/m, '');
  content = content.replace(/^> \*\*Live:\*\*[\s\S]*?Synced by.*\n\n/m, '');
  fs.writeFileSync(full, HEADER + content.trimStart() + '\n');
  console.log(`Synced ${rel}`);
}

// Write machine-readable manifest for pitch page API
const manifest = {
  ...stamp,
  docs: DOC_FILES.filter((f) => fs.existsSync(path.join(root, f))).map((f) => ({
    slug: path.basename(f, '.md').toLowerCase(),
    path: f,
  })),
};
fs.writeFileSync(path.join(root, 'docs/manifest.json'), JSON.stringify(manifest, null, 2));
console.log('Wrote docs/manifest.json');