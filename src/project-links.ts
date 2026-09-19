/**
 * Registry of public project links plus URL-safety and visibility rules.
 *
 * Four distinct kinds (source / demo / download / record) are never merged
 * into one url field. A pushed GitHub repository is a "source" entry, never a
 * "demo". Only public + verified + approved demos render as live-demo buttons.
 */
import {PROJECT_IDS,type ProjectId,type ProjectLink,type LinkKind,type Localized} from './project-types.js';

export const LINK_KIND_LABELS: Record<LinkKind, Localized> = {
 source: {en: 'Source code', zh: '项目源码'},
 demo: {en: 'Live demo', zh: '在线演示'},
 download: {en: 'Download', zh: '安装包下载'},
 record: {en: 'Project record', zh: '原项目记录'}
};

/**
 * The only public links shown today.
 * verification starts unverified until a real fetch succeeds this round;
 * verifiedAt is then filled with the check date.
 */
export const projectLinks: Record<ProjectId, ProjectLink[]> = {
 fairy: [
  {
   kind: 'source',
   url: 'https://github.com/babyzmz/Fairy-LLM',
   label: {en: 'Fairy-LLM on GitHub', zh: 'GitHub 上的 Fairy-LLM'},
   verifiedAt: '2026-09-19T01:02:00Z',
   access: 'public',
   verification: 'verified',
   publication: 'approved'
  }
 ],
 core: [],
 claw: [],
 ax: [],
 dreambound: [
  {
   kind: 'record',
   url: 'https://github.com/babyzmz/mingzhe-portfolio/tree/main/demos/dreambound',
   label: {en: 'Original Dreambound record', zh: 'Dreambound 原始项目记录'},
   accessNote: {en: 'The public copy is missing js/core/game.js; the playable source was recovered locally.', zh: '公开副本缺少 js/core/game.js；可运行脚本已在本地找回。'},
   verifiedAt: '2026-09-19T01:02:00Z',
   access: 'public',
   verification: 'verified',
   publication: 'approved'
  }
 ],
 webchange: [
  {
   kind: 'record',
   url: 'https://github.com/babyzmz/mingzhe-portfolio/blob/main/script.js',
   label: {en: 'Original portfolio entry (Web Change)', zh: '旧作品集条目（Web Change）'},
   accessNote: {en: 'This is the old project listing, not the application source.', zh: '这是旧作品集条目，不是该应用的业务源码。'},
   verifiedAt: '2026-09-19T01:02:00Z',
   access: 'public',
   verification: 'verified',
   publication: 'approved'
  }
 ],
 goodnight: [
  {
   kind: 'record',
   url: 'https://github.com/babyzmz/mingzhe-portfolio/blob/main/script.js',
   label: {en: 'Original portfolio entry (Goodnight Store)', zh: '旧作品集条目（Goodnight Store）'},
   accessNote: {en: 'This is the old project listing, not the storefront source.', zh: '这是旧作品集条目，不是商店应用源码。'},
   verifiedAt: '2026-09-19T01:02:00Z',
   access: 'public',
   verification: 'verified',
   publication: 'approved'
  }
 ],
 tarot: [
  {
   kind: 'record',
   url: 'https://github.com/babyzmz/mingzhe-portfolio/blob/main/script.js',
   label: {en: 'Original portfolio entry (AI Tarot Reports)', zh: '旧作品集条目（AI Tarot Reports）'},
   accessNote: {en: 'This is the old project listing, not the report generator source.', zh: '这是旧作品集条目，不是报告生成器源码。'},
   verifiedAt: '2026-09-19T01:02:00Z',
   access: 'public',
   verification: 'verified',
   publication: 'approved'
  }
 ],
 converter: [
  {
   kind: 'record',
   url: 'https://github.com/babyzmz/mingzhe-portfolio/blob/main/script.js',
   label: {en: 'Original portfolio entry (Mi Format Converter)', zh: '旧作品集条目（Mi Format Converter）'},
   accessNote: {en: 'This is the old project listing, not the converter source.', zh: '这是旧作品集条目，不是转换工具源码。'},
   verifiedAt: '2026-09-19T01:02:00Z',
   access: 'public',
   verification: 'verified',
   publication: 'approved'
  }
 ]
};

/** Same-site routes that a relative public URL is allowed to point at. */
export const ALLOWED_RELATIVE_PREFIXES = ['media/', 'documents/', 'demos/', 'assets/'];

const CONTROL_CHARS = /[\u0000-\u001f\u007f]/;

function isPrivateHost(host: string): boolean {
 const h = host.toLowerCase().replace(/\.$/, '');
 if (h === 'localhost' || h.endsWith('.localhost') || h.endsWith('.local') || h === 'metadata.google.internal') return true;
 const ip = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
 if (ip) {
  const [a, b] = ip.slice(1).map(Number);
  if (a === 127 || a === 10 || a === 0) return true;
  if (a === 169 && b === 254) return true;             // link-local
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;  // CGNAT
 }
 const v6 = h;
 if (v6 === '::1' || v6.startsWith('fc') || v6.startsWith('fd') || v6.startsWith('fe80')) return true;
 return false;
}

/**
 * Validate a URL for the PUBLIC manifest.
 * Returns a list of issues; empty list means safe to ship.
 */
export function safeUrlIssues(raw: string, allowedPrefixes: string[] = ALLOWED_RELATIVE_PREFIXES): string[] {
 const issues: string[] = [];
 if (typeof raw !== 'string' || raw.trim() === '') return ['empty-url'];
 const value = raw.trim();
 if (CONTROL_CHARS.test(value)) issues.push('control-characters');
 if (value.includes('\\')) issues.push('backslash-not-allowed');
 const lower = value.toLowerCase();
 if (lower.startsWith('//')) issues.push('protocol-relative-url');
 // Same-site relative URL: normalise and keep it inside the allowed routes.
 if (value.startsWith('./') || value.startsWith('/')) {
  if (lower.includes('%2e%2e') || value.split('/').includes('..')) issues.push('path-traversal');
  const clean = value.replace(/^\.\//, '').replace(/^\/+/, '');
  if (!allowedPrefixes.some(prefix => clean === prefix || clean.startsWith(prefix))) {
   issues.push('relative-route-not-allowed');
  }
  return issues;
 }
 let url: URL;
 try {
  url = new URL(value);
 } catch {
  issues.push('not-a-valid-url');
  return issues;
 }
 if (url.username || url.password) issues.push('credentials-in-url');
 if (!['http:', 'https:'].includes(url.protocol)) issues.push('protocol-not-allowed');
 if (isPrivateHost(url.hostname)) issues.push('private-or-local-host');
 if (!url.hostname.includes('.') && url.protocol === 'http:') issues.push('bare-local-host');
 return issues;
}

export function isSafePublicUrl(raw: string, allowedPrefixes?: string[]): boolean {
 return safeUrlIssues(raw, allowedPrefixes).length === 0;
}

export function linksFor(id: ProjectId): ProjectLink[] {
 return projectLinks[id] ?? [];
}

/** Only approved links are ever rendered to the public. */
export function visibleLinks(id: ProjectId): ProjectLink[] {
 return linksFor(id).filter(link => link.publication === 'approved');
}

export function linksByKind(id: ProjectId): Record<LinkKind, ProjectLink[]> {
 const result: Record<LinkKind, ProjectLink[]> = {source: [], demo: [], download: [], record: []};
 for (const link of visibleLinks(id)) result[link.kind].push(link);
 return result;
}

/**
 * A live-demo button is allowed only for public, verified, approved demos.
 * Restricted demos never masquerade as open try-it links.
 */
export function publicDemo(id: ProjectId): ProjectLink | null {
 const demo = visibleLinks(id).find(link =>
  link.kind === 'demo' && link.access === 'public' && link.verification === 'verified');
 return demo ?? null;
}

export function validateProjectLink(link: ProjectLink): string[] {
 const issues = safeUrlIssues(link.url);
 if (!link.label?.en || !link.label?.zh) issues.push('missing-bilingual-label');
 if (link.access === 'restricted' && !link.accessNote?.en && !link.accessNote?.zh) {
  issues.push('restricted-link-needs-note');
 }
 if (link.kind === 'demo' && link.verification !== 'verified') issues.push('unverified-demo');
 if (link.kind === 'demo' && link.access === 'public' && !link.verifiedAt) issues.push('demo-missing-verified-at');
 return issues;
}

/** Validate the whole registry; used by tests and the build gate. */
export function validateLinkRegistry(): string[] {
 const issues: string[] = [];
 for (const id of PROJECT_IDS) {
  for (const link of linksFor(id)) {
   for (const issue of validateProjectLink(link)) issues.push(`${id}: ${issue} (${link.url})`);
  }
 }
 return issues;
}
