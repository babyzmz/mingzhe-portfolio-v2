/** Independent DOM adaptation of RewampUI Word By Word Text's visual timing.
 * Keep the existing vanilla/GSAP architecture: no React runtime is introduced.
 * Words fade from 0, lift 12px and resolve 4px blur over 600ms, staggered 120ms.
 * Long paragraphs cap their total stagger so reading never waits several seconds.
 */
export function splitWords(input: string, locale: string): string[] {
  if (!input) return [];
  if (!locale.startsWith('zh')) return input.match(/\s+|\S+/gu) || [];
  type Segmenter = new (locale: string, options: {granularity: string}) => {segment: (s: string) => Iterable<{segment: string}>};
  const Ctor = (Intl as unknown as {Segmenter?: Segmenter}).Segmenter;
  const parts = Ctor ? Array.from(new Ctor('zh', {granularity: 'word'}).segment(input), x => x.segment)
    : input.split(/(\s+|[\p{Script=Han}])/u).filter(Boolean);
  const result: string[] = [];
  for (const part of parts) {
    if (/^[，。！？、；：,.!?;:）】”’]+$/u.test(part) && result.length && !/^\s+$/u.test(result.at(-1)!)) result[result.length - 1] += part;
    else result.push(part);
  }
  return result;
}

type Entry = {node: HTMLElement; words: HTMLElement[]; animations: Animation[]; done: boolean; visible: boolean; generation: number};
export type WordReveal = {refresh: () => void; setPaused: () => void; setSuspended: (v: boolean) => void; dispose: () => void};
export function createWordReveal(reduced: () => boolean): WordReveal {
  const entries = new Map<HTMLElement, Entry>();
  let disposed = false, suspended = false;
  const supported = typeof IntersectionObserver !== 'undefined' && typeof Element.prototype.animate === 'function';
  function finish(entry: Entry) {
    entry.generation++;
    entry.node.classList.remove('word-pending');
    entry.node.dataset.wordState = 'revealed';
    entry.done = true;
    entry.animations.forEach(a => a.cancel()); entry.animations = [];
  }
  function play(entry: Entry) {
    if (entry.done || entry.animations.length || !entry.visible || suspended || document.hidden) return;
    if (reduced()) {finish(entry); return;}
    const generation = ++entry.generation;
    const step = Math.min(120, 900 / Math.max(1, entry.words.length - 1));
    entry.node.dataset.wordState = 'revealing';
    try {
      entry.animations = entry.words.map((word, index) => word.animate([
        {opacity: 0, transform: 'translateY(12px)', filter: 'blur(4px)'},
        {opacity: 1, transform: 'translateY(0)', filter: 'blur(0px)'}
      ], {duration: 600, delay: index * step, easing: 'cubic-bezier(.25,.46,.45,.94)', fill: 'both'}));
      void Promise.all(entry.animations.map(a => a.finished)).then(() => {
        if (!disposed && entry.generation === generation) finish(entry);
      }).catch(() => {}); // cancellation during locale, pause or navigation is intentional
    } catch {finish(entry);}
  }
  const observer = supported ? new IntersectionObserver(items => {
    for (const item of items) {
      const entry = entries.get(item.target as HTMLElement); if (!entry) continue;
      entry.visible = item.isIntersecting;
      if (entry.visible) play(entry);
      else if (entry.animations.length) finish(entry); // never replay partially revealed text on reverse scroll
    }
  }, {threshold: 0, rootMargin: '0px 0px -5% 0px'}) : null;

  function refresh() {
    if (disposed) return;
    for (const [node, entry] of entries) if (!node.isConnected) {finish(entry); observer?.unobserve(node); entries.delete(node);}
    for (const node of document.querySelectorAll<HTMLElement>('#site [data-word-reveal]')) {
      if (entries.has(node) || node.closest('[data-contact-stream], dialog, [data-fill]')) continue;
      if (!supported || reduced()) {node.dataset.wordState = 'static'; continue;}
      const words: HTMLElement[] = [];
      // Preserve BRs, emphasis, colour spans, whitespace, selection and semantic text.
      const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
      const texts: Text[] = []; while (walker.nextNode()) texts.push(walker.currentNode as Text);
      for (const text of texts) {
        if (text.parentElement?.closest('.word-token')) continue;
        const fragment = document.createDocumentFragment();
        for (const token of splitWords(text.data, document.documentElement.lang)) {
          if (/^\s+$/u.test(token)) fragment.append(document.createTextNode(token));
          else {const span = document.createElement('span'); span.className = 'word-token'; span.textContent = token; fragment.append(span); words.push(span);}
        }
        text.replaceWith(fragment);
      }
      const entry: Entry = {node, words, animations: [], done: false, visible: false, generation: 0};
      entries.set(node, entry); node.classList.add('word-pending'); node.dataset.wordState = 'pending'; observer?.observe(node);
      const box = node.getBoundingClientRect(); entry.visible = box.top < innerHeight * .95 && box.bottom > 0;
      if (entry.visible) play(entry);
    }
    if (reduced()) for (const entry of entries.values()) finish(entry);
  }
  function sync() {
    for (const entry of entries.values()) {
      if (reduced()) finish(entry);
      else if (document.hidden || suspended) entry.animations.forEach(a => a.pause());
      else {entry.animations.forEach(a => a.play()); play(entry);}
    }
  }
  document.addEventListener('visibilitychange', sync);
  refresh();
  return {refresh, setPaused() {refresh(); sync();}, setSuspended(value) {suspended = value; sync();}, dispose() {
    disposed = true; observer?.disconnect(); for (const entry of entries.values()) finish(entry); entries.clear();
    document.removeEventListener('visibilitychange', sync);
  }};
}
