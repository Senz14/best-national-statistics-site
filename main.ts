// A working best-site-01 entry (Node 22, standard library only): the site is this directory's app/ folder, plain
// static files a browser opens at app/index.html (ES modules, CSS, no build step), its content held in its own files:
// nothing it runs, styles or shows loads over the network. The program hands it in: it copies app/ and screenshots/
// from beside this file to /output and writes /output/dossier.json, the summary the judge reads (your screenshots, the
// first load's files and bytes, and your source), with the vendored make.fun library. Leave vendor/makefun-frontend.ts
// as it is: the scorer requires dossier.json to be byte for byte what its own copy writes.
//
// A starting point, not a winner: a plain recipe collection, a list of recipes and a page for each. Build the site the
// brief asks for in app/ (its content, ease of use, a phone layout, its look), put 3 or 4 PNG or JPEG screenshots of
// it running in screenshots/ (the first by name is the cover; one may be a 390 x 844 phone view; shots.json says which
// views this starter's were taken of), and run it.
//
// Serve it locally with `node serve.ts`, then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// NusaStat pre-flight: refuse a hand-in the gate would refuse, before anything
// is copied. The starter copied blindly and left buildDossier to fail with a
// terse error; failing here names the missing piece instead.
const indexHtml = join(here, 'app', 'index.html');
if (!existsSync(indexHtml) || !statSync(indexHtml).isFile()) {
  throw new Error('NusaStat: app/index.html is missing — the site has no entry page');
}
const shotsDir = join(here, 'screenshots');
if (!existsSync(shotsDir)) {
  throw new Error('NusaStat: screenshots/ is missing — the gate needs 3 or 4 screenshots');
}
const shots = readdirSync(shotsDir).filter(
  (name) => !name.startsWith('.') && /\.(png|jpe?g)$/i.test(name),
);
if (shots.length < 3 || shots.length > 4) {
  throw new Error(`NusaStat: expected 3 or 4 screenshots, found ${shots.length}`);
}
for (const name of shots) {
  const size = statSync(join(shotsDir, name)).size;
  if (size > 262144) {
    throw new Error(`NusaStat: screenshot ${name} is ${size} bytes, over the 256 KiB cap`);
  }
}

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the bytes; the others refuse an entry the
// scorer would refuse (more than 4 screenshots or one over 256 KiB; more than 993 files and directories in app/ or
// 16 MiB of app files: app/ counts beside /output's own 1000-entry cap, its screenshots/ and dossier.json).
// buildDossier returns raw bytes (a Uint8Array), not a string: hand them to
// writeFileSync untouched — coercing them to text would rewrite the dossier
// as a comma-separated list of byte values.
const dossierPath = join(out, 'dossier.json');
const dossierBytes = Buffer.from(
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);
writeFileSync(dossierPath, dossierBytes);
const written = readFileSync(dossierPath);
if (!written.equals(dossierBytes)) {
  throw new Error('NusaStat: dossier.json on disk differs from what buildDossier produced');
}
JSON.parse(written.toString('utf8'));
if (written.byteLength > 1572864) {
  throw new Error('NusaStat: dossier.json exceeds the 1.5 MiB cap');
}
console.error(`NusaStat: wrote ${shots.length} screenshots and dossier.json (${written.byteLength} bytes) to ${out}`);
