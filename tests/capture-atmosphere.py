"""Readability and settled screenshots from actual HTTP/WebGL, not mocked canvases."""
from pathlib import Path
import functools, http.server, json, os, threading
from playwright.sync_api import sync_playwright
from browser_support import launch_browser
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'test-artifacts/atmosphere-settled'
OUT.mkdir(parents=True, exist_ok=True)

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith('/mingzhe-portfolio-v2/'):
            self.path = self.path[len('/mingzhe-portfolio-v2'):]
        super().do_GET()
    def log_message(self, *args):
        pass

server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Handler, directory=str(ROOT / 'dist')))
threading.Thread(target=server.serve_forever, daemon=True).start()
url = os.environ.get('PORTFOLIO_CAPTURE_URL', f'http://127.0.0.1:{server.server_port}/mingzhe-portfolio-v2/')
results, errors, failed = [], [], []
completed = False
try:
    with sync_playwright() as p:
        browser, info = launch_browser(p)
        page = browser.new_page(viewport={'width': 1440, 'height': 960})
        page.set_default_timeout(30000)
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.on('requestfailed', lambda r: failed.append({'url': r.url, 'failure': r.failure}))
        page.goto(url, wait_until='load')
        page.wait_for_function('document.querySelector("#atmosphere")?.dataset.backend === "webgl"')
        for section in ['home', 'fairy', 'work', 'about', 'contact']:
            page.evaluate('(s)=>{document.documentElement.style.scrollBehavior="auto";scrollTo(0,document.getElementById(s).getBoundingClientRect().top+scrollY)}', section)
            if section in ['home', 'fairy']:
                station = 0 if section == 'home' else 1
                page.wait_for_function('(s)=>Math.abs(Number(document.querySelector("#scene").dataset.station)-s)<.015', arg=station)
            page.wait_for_function('''(s)=>[...document.querySelectorAll('#'+s+' [data-word-reveal]')].filter(e=>{const b=e.getBoundingClientRect();return b.top<innerHeight*.95&&b.bottom>0}).every(e=>['revealed','static'].includes(e.dataset.wordState))''', arg=section)
            page.wait_for_timeout(500)
            if section == 'work':
                card = page.locator('[data-project-card="core"]')
                card.scroll_into_view_if_needed()
                r = card.bounding_box()
                page.mouse.move(r['x'] + r['width'] - 4, r['y'] + r['height'] * .6)
                page.wait_for_timeout(350)
            if section == 'about':
                assert page.locator('.about-copy [data-word-reveal]').count() >= 2
                assert page.locator('.about-copy [data-word-reveal]').evaluate_all('(nodes)=>nodes.every(n=>[...n.querySelectorAll(".word-token")].every(w=>+getComputedStyle(w).opacity>.98))')
            page.screenshot(path=str(OUT / (section + '.png')))
            results.append({'section': section, 'settled': True})
            print('PASS settled actual WebGL screenshot:', section, flush=True)
        assert not errors and not failed, (errors, failed)
        browser.close()
        completed = True
finally:
    (OUT / 'results.json').write_text(json.dumps({'complete': completed, 'url': url, 'sections': results, 'errors': errors, 'failed_requests': failed}, indent=2))
    server.shutdown()
