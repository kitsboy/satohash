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
  'docs/marketing/EXECUTIVE-SUMMARY.md',
  'docs/marketing/MARKETING.md',
  'docs/marketing/FINANCIALS.md',
  'docs/marketing/PITCH.md',
  'docs/DESIGN-CONTEXT.md',
  'docs/DESIGN-TOKENS.md',
  'docs/deploy.md',
  'docs/DEPLOY-SERVER.md',
  'docs/MVP-READINESS.md',
  'docs/ROLLBACK.md',
  'docs/architecture.md',
];

const PUBLIC_COPY = {
  'docs/DEPLOY-SERVER.md': 'public/docs/deploy-server.md',
  'docs/MVP-READINESS.md': 'public/docs/mvp-readiness.md',
};

for (const rel of DOC_FILES) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) continue;
  let content = fs.readFileSync(full, 'utf-8');
  content = content.replace(/<!-- AUTO-GENERATED HEADER[\s\S]*?-->\n*/m, '');
  content = content.replace(/^> \*\*Live:\*\*[\s\S]*?Synced by.*\n\n/m, '');
  // trim both ends so repeated syncs don't pile blank lines at EOF
  const body = HEADER + content.trim() + '\n';
  fs.writeFileSync(full, body);
  console.log(`Synced ${rel}`);
  const publicDest = PUBLIC_COPY[rel];
  if (publicDest) {
    fs.mkdirSync(path.dirname(path.join(root, publicDest)), { recursive: true });
    fs.writeFileSync(path.join(root, publicDest), body);
    console.log(`Copied → ${publicDest}`);
  }
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