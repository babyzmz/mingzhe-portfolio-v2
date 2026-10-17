#!/usr/bin/env node
/**
 * Generates the static Mojo product pages in public/mojo/ from src/mojo-view.ts.
 * Content lives in src/mojo-content.ts and src/mojo-shots.ts; never hand-edit
 * the generated HTML. `--check` exits 1 when the committed pages are stale.
 */
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync, execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {fileURLToPath, pathToFileURL} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(root);
const require = createRequire(import.meta.url);
let tsc;
try { tsc = require.resolve('typescript/bin/tsc'); } catch { tsc = path.join(execFileSync('npm', ['root', '-g'], {encoding: 'utf8'}).trim(), 'typescript/bin/tsc'); }
const compiled = spawnSync(process.execPath, [tsc, '-p', 'tsconfig.offline.json'], {stdio: 'inherit'});
if (compiled.status) process.exit(compiled.status);
const {renderMojoSite} = await import(pathToFileURL(path.join(root, '.test-build/mojo-view.js')).href + '?t=' + Date.now());
const pages = renderMojoSite();
const check = process.argv.includes('--check');
let stale = 0;
for (const [rel, html] of Object.entries(pages)) {
 const file = path.join(root, 'public/mojo', rel);
 const current = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
 if (current === html) continue;
 if (check) { console.error(`[mojo-pages] stale: public/mojo/${rel}`); stale++; continue; }
 fs.mkdirSync(path.dirname(file), {recursive: true});
 fs.writeFileSync(file, html);
 console.log(`[mojo-pages] wrote public/mojo/${rel}`);
}
if (check && stale) process.exit(1);
console.log(check ? '[mojo-pages] up to date' : '[mojo-pages] done');
