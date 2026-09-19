#!/usr/bin/env node
/**
 * Publication privacy gate (T5/T8). Scans the artifacts that could ever be
 * published (vite dist/, the offline preview/ tree and the standalone single
 * file) for private handoff references, local user paths, loopback URLs and
 * obvious secret material. Source working files are out of scope; this is a
 * gate on what a build would actually ship.
 *
 * Exit 0 = clean, exit 1 = forbidden tokens found (report printed, no secrets
 * are echoed beyond the matched pattern name and file location).
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKIP_DIRS = new Set(['node_modules', '.git']);
const TEXT_EXT = new Set(['.html', '.js', '.mjs', '.css', '.json', '.txt', '.svg', '.webmanifest', '.map']);

const RULES = [
  {name: 'handoff-private reference', re: /\.handoff-private/i},
  {name: 'Windows user profile path', re: /[A-Za-z]:\\Users\\[^\s"'`]+/i},
  {name: 'Chinese desktop absolute path', re: /[A-Za-z]:\\[^\s"'`]*桌面/},
  {name: 'loopback URL in shipped artifact', re: /https?:\/\/(?:127\.0\.0\.1|localhost|0\.0\.0\.0|\[::1\])(?::\d+)?/i},
  {name: 'private IP RFC1918 URL', re: /https?:\/\/(?:10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.)\d+\.\d+(?::\d+)?/},
  {name: 'OpenAI-style secret', re: /sk-(?:proj-)?[A-Za-z0-9_-]{20,}/},
  {name: 'bearer credential', re: /bearer\s+[A-Za-z0-9._-]{20,}/i},
  {name: 'inline API key assignment', re: /(?:api[_-]?key|secret|token|password)\s*[:=]\s*['"][A-Za-z0-9._\-/+=]{16,}['"]/i},
  {name: 'PEM private key block', re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/},
];

const targets = process.argv.slice(2).flatMap(a => a.split(','));
const roots = (targets.length ? targets : ['dist', 'preview', 'Mingzhe-Portfolio-Preview.html'])
  .map(p => path.resolve(project, p));

const findings = [];
function scanFile(file) {
  const ext = path.extname(file).toLowerCase();
  if (!TEXT_EXT.has(ext)) return;
  let text;
  try { text = fs.readFileSync(file, 'utf8'); } catch { return; }
  for (const rule of RULES) {
    if (rule.re.test(text)) findings.push({file: path.relative(project, file), rule: rule.name});
  }
}
function walk(target) {
  let stat;
  try { stat = fs.statSync(target); } catch { return; }
  if (stat.isFile()) { scanFile(target); return; }
  for (const entry of fs.readdirSync(target, {withFileTypes: true})) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(path.join(target, entry.name));
    } else if (entry.isFile()) {
      scanFile(path.join(target, entry.name));
    }
  }
}
for (const root of roots) walk(root);

if (findings.length) {
  console.error('[privacy-check] FAIL — forbidden content in publishable artifacts:');
  for (const f of findings) console.error(` - ${f.file} :: ${f.rule}`);
  process.exit(1);
}
console.log(`[privacy-check] PASS — scanned ${roots.map(r => path.relative(project, r)).join(', ')}`);
