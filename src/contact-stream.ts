/** Contact heading, not an additional footer section.
 * Visual reference: https://www.obsidianui.dev/docs/text-stream
 * Independent DOM/RAF implementation; does not require React or add a second
 * GSAP writer. Existing project data, media and chapter animations stay intact.
 */
const contactEscape = (value: string): string => value.replace(/[&<>"']/g,
  char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]!));

export function renderContactStream(prefix: string, first: string, lang: 'en'|'zh'): string {
  const items = lang === 'zh'
    ? [first, '有用的 AI 应用。', '可靠的智能体。', '能落地的工具。']
    : [first, 'AI applications.', 'agent systems.', 'useful tools.'];
  const label = lang === 'zh' ? `${prefix}${first}` : `${prefix} ${first}`;
  return `<div class="contact-stream" data-contact-stream data-stream-state="static">
    <h2 id="contact-heading" class="contact-stream-heading" aria-label="${contactEscape(label)}">
      <span class="contact-stream-prefix" aria-hidden="true">${contactEscape(prefix)}</span>
      <span class="contact-stream-viewport" data-contact-stream-viewport aria-hidden="true">
        <span class="contact-stream-fallback">${contactEscape(first)}</span>
        <span class="contact-stream-track"><span class="contact-stream-copy">${items.map(item => `<span class="contact-stream-item">${contactEscape(item)}</span>`).join('')}</span></span>
      </span>
    </h2>
    <button type="button" class="contact-stream-toggle" data-contact-stream-toggle aria-pressed="false">
      <span aria-hidden="true">Ⅱ</span><span data-contact-stream-toggle-label>${lang === 'zh' ? '暂停文字' : 'Pause text'}</span>
    </button>
  </div>`;
}

type ContactHandle = {sync: () => void; dispose: () => void};

function mountContactStream(host: HTMLElement, userPaused: () => boolean, toggle: () => void, parked: () => boolean): ContactHandle {
  const viewport = host.querySelector<HTMLElement>('[data-contact-stream-viewport]')!;
  const track = host.querySelector<HTMLElement>('.contact-stream-track')!;
  const copy = track.querySelector<HTMLElement>('.contact-stream-copy')!;
  const first = copy.firstElementChild as HTMLElement;
  const button = host.querySelector<HTMLButtonElement>('[data-contact-stream-toggle]')!;
  const pref = window.matchMedia('(prefers-reduced-motion: reduce)');
  let raf = 0, previous = 0, distance = 0, offset = 0, velocity = 0, target = 0;
  let visible = false, destroyed = false, lastScroll = window.scrollY, quietUntil = 0;
  let direction = -1, impulseUntil = 0;
  const baseSpeed = () => Math.max(19, Math.min(32, first.offsetHeight * .20));
  const forcedStatic = () => pref.matches || document.documentElement.dataset.motion === 'reduced';
  const staticMode = () => forcedStatic() || userPaused();
  const canRun = () => !destroyed && visible && !staticMode() && !document.hidden && !parked()
    && !document.body.classList.contains('case-is-open') && distance > 0;
  const wrap = (value: number) => ((value % distance) + distance) % distance - distance;

  function draw() { track.style.transform = `translate3d(0,${offset.toFixed(3)}px,0)`; }
  function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; previous = 0; }
  function schedule() { if (!raf && canRun()) raf = requestAnimationFrame(tick); }
  function centerFirst() {
    if (!distance) return;
    offset = wrap((viewport.clientHeight - first.offsetHeight) / 2);
    velocity = target = -baseSpeed(); direction = -1;
    quietUntil = performance.now() + 700;
    draw();
  }
  function measure() {
    if (destroyed || !host.isConnected) return;
    const oldDistance = distance;
    distance = copy.getBoundingClientRect().height;
    if (distance <= 0) { host.dataset.streamState = 'static'; stop(); return; }
    const copies = Math.max(3, Math.ceil(viewport.clientHeight / distance) + 2);
    while (track.childElementCount > copies) track.lastElementChild!.remove();
    while (track.childElementCount < copies) {
      const clone = copy.cloneNode(true) as HTMLElement;
      clone.setAttribute('aria-hidden', 'true'); track.append(clone);
    }
    if (!oldDistance || Math.abs(distance - oldDistance) > .5) centerFirst();
    sync();
  }
  function tick(now: number) {
    raf = 0;
    if (!canRun()) { previous = 0; return; }
    const dt = Math.min(.05, previous ? (now - previous) / 1000 : 1 / 60);
    previous = now;
    if (now >= quietUntil) {
      if (now >= impulseUntil) target = direction * baseSpeed();
      velocity += (target - velocity) * (1 - Math.exp(-10 * dt));
      offset = wrap(offset + velocity * dt); draw();
    }
    schedule();
  }
  function impulse(delta: number) {
    if (!delta || !canRun() || performance.now() < quietUntil) return;
    direction = delta > 0 ? -1 : 1;
    target = direction * Math.min(330, baseSpeed() + Math.pow(Math.abs(delta), .85) * 4);
    impulseUntil = performance.now() + 150;
    schedule();
  }
  function onScroll() { const y = window.scrollY; impulse(y - lastScroll); lastScroll = y; }
  function onWheel(event: WheelEvent) {
    // Scroll events drive movement normally; wheel adds momentum only at a page
    // boundary so the same gesture is not counted twice. Never prevent scrolling.
    if (event.defaultPrevented || !canRun()) return;
    const end = document.documentElement.scrollHeight - window.innerHeight;
    if ((event.deltaY > 0 && window.scrollY >= end - 2) || (event.deltaY < 0 && window.scrollY <= 1)) {
      const scale = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1;
      impulse(event.deltaY * scale);
    }
  }
  function sync() {
    if (destroyed) return;
    const isStatic = staticMode(), zh = document.documentElement.lang.startsWith('zh');
    const wasStatic = host.dataset.streamState !== 'running';
    host.dataset.streamState = isStatic ? 'static' : 'running';
    button.disabled = forcedStatic();
    button.setAttribute('aria-pressed', String(isStatic));
    const text = forcedStatic() ? (zh ? '动态效果已关闭' : 'Motion is reduced')
      : userPaused() ? (zh ? '播放文字' : 'Resume text') : (zh ? '暂停文字' : 'Pause text');
    button.setAttribute('aria-label', text);
    button.querySelector<HTMLElement>('[data-contact-stream-toggle-label]')!.textContent = text;
    button.querySelector<HTMLElement>('span[aria-hidden]')!.textContent = isStatic ? '▷' : 'Ⅱ';
    if (!isStatic && wasStatic) centerFirst();
    if (canRun()) schedule(); else stop();
  }
  const click = () => { if (!forcedStatic()) { toggle(); sync(); } };
  const visibility = () => { lastScroll = window.scrollY; sync(); };
  const intersection = new IntersectionObserver(entries => {
    const next = entries[0]?.isIntersecting ?? false;
    if (next && !visible) { lastScroll = window.scrollY; quietUntil = performance.now() + 700; }
    visible = next; sync();
  }, {threshold: 0});
  const resize = new ResizeObserver(measure);
  intersection.observe(viewport); resize.observe(viewport); resize.observe(copy);
  button.addEventListener('click', click);
  window.addEventListener('scroll', onScroll, {passive: true});
  window.addEventListener('wheel', onWheel, {passive: true});
  document.addEventListener('visibilitychange', visibility);
  pref.addEventListener('change', sync);
  measure(); document.fonts.ready.then(() => { if (!destroyed) measure(); });
  return {sync, dispose() {
    destroyed = true; stop(); intersection.disconnect(); resize.disconnect();
    button.removeEventListener('click', click);
    window.removeEventListener('scroll', onScroll); window.removeEventListener('wheel', onWheel);
    document.removeEventListener('visibilitychange', visibility); pref.removeEventListener('change', sync);
  }};
}

/** The site replaces #site on language changes. Observe only its direct children,
 * not animated styles or per-character fills, to rebind without mutation loops.
 * The native implementation also works in the existing offline build.
 */
export function installContactStream(): () => void {
  const site = document.getElementById('site');
  if (!site || typeof IntersectionObserver === 'undefined' || typeof ResizeObserver === 'undefined') return () => {};
  let host: HTMLElement | null = null, handle: ContactHandle | null = null;
  let pausedByUser = false, parked = false, disposed = false, pending = false;
  function sync() {
    pending = false; if (disposed) return;
    const next = site!.querySelector<HTMLElement>('[data-contact-stream]');
    if (next !== host) {
      handle?.dispose(); host = next;
      handle = host ? mountContactStream(host, () => pausedByUser, () => {pausedByUser = !pausedByUser;}, () => parked) : null;
    }
    handle?.sync();
  }
  function queue() { if (!pending && !disposed) { pending = true; queueMicrotask(sync); } }
  const siteObserver = new MutationObserver(queue);
  siteObserver.observe(site, {childList: true});
  const stateObserver = new MutationObserver(queue);
  stateObserver.observe(document.documentElement, {attributes: true, attributeFilter: ['lang','data-motion']});
  stateObserver.observe(document.body, {attributes: true, attributeFilter: ['class']});
  function dispose() {
    disposed = true; handle?.dispose(); handle = null;
    siteObserver.disconnect(); stateObserver.disconnect();
    window.removeEventListener('pagehide', hide); window.removeEventListener('pageshow', show);
  }
  function hide(event: PageTransitionEvent) { if (event.persisted) { parked = true; handle?.sync(); } else dispose(); }
  function show(event: PageTransitionEvent) { if (event.persisted) { parked = false; sync(); } }
  window.addEventListener('pagehide', hide); window.addEventListener('pageshow', show);
  sync(); return dispose;
}

// SSR-safe: imported by views.ts for both HTML rendering and browser enhancement.
if (typeof document !== 'undefined') installContactStream();
