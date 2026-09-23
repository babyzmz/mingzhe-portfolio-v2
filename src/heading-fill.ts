/** Retains the owner's uploaded scroll-colour headings, fixing refresh/dispose.
 * These headings do not also receive Word Reveal: only one animation owns them.
 */
export function createHeadingFill(reduced: () => boolean) {
  type Entry = {node: HTMLElement; chars: HTMLElement[]; top: number; height: number};
  let entries: Entry[] = [], raf = 0, disposed = false, suspended = false;
  function update() {
    raf = 0; if (disposed || suspended || document.hidden) return;
    for (const {node, chars, top, height} of entries) {
      const start = innerHeight * .85, end = innerHeight * .47 - height * .5;
      const progress = reduced() ? 1 : Math.max(0, Math.min(1, (start - (top - scrollY)) / Math.max(1, start - end)));
      node.style.setProperty('--fill-progress', progress.toFixed(4));
      const threshold = Math.floor(progress * (chars.length + 2));
      chars.forEach((char, i) => char.classList.toggle('fill-in', reduced() || i < threshold));
    }
  }
  function schedule() {if (!raf && !disposed && !suspended && !document.hidden) raf = requestAnimationFrame(update);}
  function refresh() {
    if (disposed) return;
    entries = Array.from(document.querySelectorAll<HTMLElement>('#site [data-fill]')).map(node => {
      if (!node.dataset.fillSplit) {
        const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT); const texts: Text[] = [];
        while (walker.nextNode()) texts.push(walker.currentNode as Text);
        for (const text of texts) {
          const fragment = document.createDocumentFragment();
          for (const char of Array.from(text.data)) {
            if (/\s/u.test(char)) fragment.append(document.createTextNode(char));
            else {const span = document.createElement('span'); span.className = 'fill-char'; span.textContent = char; fragment.append(span);}
          }
          text.replaceWith(fragment);
        }
        node.dataset.fillSplit = '1';
      }
      const box = node.getBoundingClientRect();
      return {node, chars: Array.from(node.querySelectorAll<HTMLElement>('.fill-char')), top: box.top + scrollY, height: box.height};
    });
    schedule();
  }
  const visibility = () => {if (document.hidden) {cancelAnimationFrame(raf); raf = 0;} else refresh();};
  window.addEventListener('scroll', schedule, {passive: true}); window.addEventListener('resize', refresh, {passive: true});
  document.addEventListener('visibilitychange', visibility); refresh();
  return {refresh, setPaused: schedule, setSuspended(value: boolean) {
    suspended = value; if (value) {cancelAnimationFrame(raf); raf = 0;} else refresh();
  }, dispose() {
    disposed = true; cancelAnimationFrame(raf); entries.forEach(e => e.chars.forEach(c => c.classList.add('fill-in'))); entries = [];
    window.removeEventListener('scroll', schedule); window.removeEventListener('resize', refresh); document.removeEventListener('visibilitychange', visibility);
  }};
}
