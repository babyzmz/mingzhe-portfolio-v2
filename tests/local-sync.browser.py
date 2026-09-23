"""Real animation/layout regression. --serve tests dist over HTTP and a Pages subpath.
Without --serve/PORTFOLIO_TEST_URL, tests the self-contained edition via set_content.
"""
from pathlib import Path
import sys, os, json, threading, http.server, functools
from playwright.sync_api import sync_playwright
sys.path.insert(0,str(Path(__file__).resolve().parent))
from browser_support import launch_browser
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('PORTFOLIO_TEST_OUTPUT',ROOT/'test-artifacts/local-sync'));OUT.mkdir(parents=True,exist_ok=True)
URL=os.environ.get('PORTFOLIO_TEST_URL',''); server=None
if '--serve' in sys.argv:
 class Handler(http.server.SimpleHTTPRequestHandler):
  def do_GET(self):
   if self.path.startswith('/mingzhe-portfolio-v2/'):
    self.path=self.path[len('/mingzhe-portfolio-v2'):]
   super().do_GET()
  def log_message(self,*args): pass
 server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Handler,directory=str(ROOT/'dist')))
 threading.Thread(target=server.serve_forever,daemon=True).start()
 URL=f'http://127.0.0.1:{server.server_port}/mingzhe-portfolio-v2/'
HTML=(ROOT/'Mingzhe-Portfolio-Preview.html').read_text(encoding='utf8')
results=[];errors=[];failed=[];diagnostics=[];completed=False
def check(name,value):
 results.append({'name':name,'pass':bool(value)})
 print(('PASS ' if value else 'FAIL ')+name,flush=True)
 if not value: raise AssertionError(name)
def load(page):
 page.on('pageerror',lambda e:errors.append(str(e)))
 if URL:
  page.on('requestfailed',lambda r:failed.append({'url':r.url,'failure':r.failure}))
  page.goto(URL,wait_until='load')
 else:page.set_content(HTML,wait_until='load')
 page.wait_for_selector('#home h1 .word-token',state='attached')
def jump(page,selector):
 page.evaluate('(selector)=>{document.documentElement.style.scrollBehavior="auto";window.scrollTo(0,document.querySelector(selector).getBoundingClientRect().top+window.scrollY)}',selector)
 page.wait_for_timeout(180)
try:
 with sync_playwright() as p:
  b,info=launch_browser(p)
  page=b.new_page(viewport={'width':1440,'height':1000});page.set_default_timeout(10000);load(page)
  if not URL:
   # This container has no WebGL; stop CPU scene work to isolate text UI checks.
   page.evaluate("document.querySelector('#scene').dispatchEvent(new Event('webglcontextlost',{cancelable:true}))")
  page.wait_for_function("document.querySelector('#home h1').dataset.wordState === 'revealed'")
  check('all nine local-upload projects exist',page.locator('[data-project-card]').count()==9)
  check('reference effect only used on selected homepage copy',page.locator('[data-word-reveal]').count()==9)
  check('word splitting never enters contact title',page.locator('#contact .word-token').count()==0)
  check('word splitting never enters colour-fill headings',page.locator('[data-fill] .word-token').count()==0)
  # Start a new locale and sample a real in-progress Web Animation.
  initial=page.evaluate("""()=>{document.querySelector('[data-locale]').click();return [...document.querySelectorAll('#home h1 .word-token')].map(e=>({opacity:getComputedStyle(e).opacity,animations:e.getAnimations().map(a=>a.effect.getKeyframes())}))}""")
  check('word-by-word actually creates opacity, blur and lift keyframes',any(x['animations'] and x['animations'][0][0]['filter']=='blur(4px)' for x in initial))
  middle=page.locator('#home h1 .word-token').evaluate_all('(nodes)=>{for(const n of nodes)for(const a of n.getAnimations()){a.pause();a.currentTime=300;}return nodes.map(n=>+getComputedStyle(n).opacity)}')
  check('real word animation has staggered intermediate opacity at 300ms',any(0<x<1 for x in middle) and (max(middle)>min(middle)))
  page.locator('#home h1 .word-token').evaluate_all('(nodes)=>nodes.forEach(n=>n.getAnimations().forEach(a=>a.play()))')
  page.wait_for_function("document.querySelector('#home h1').dataset.wordState === 'revealed'")
  check('Chinese title remains intact',page.locator('#home h1').text_content()=='让想法，成为智能。')
  page.screenshot(path=str(OUT/'home-zh.png'))
  page.locator('[data-locale]').click();page.wait_for_function("document.querySelector('#home h1').dataset.wordState === 'revealed'")
  check('English title remains intact',page.locator('#home h1').text_content()=='Ideas intointelligence.')
  first_color=page.locator('#home h1 > .word-token').first.evaluate('(el)=>getComputedStyle(el).webkitTextFillColor')
  check('first hero line does not inherit gradient from split spans',first_color!='rgba(0, 0, 0, 0)')
  page.screenshot(path=str(OUT/'home-en.png'))
  jump(page,'#fairy');page.wait_for_timeout(600)
  check('new Fairy positioning is on home page','personal devices' in page.locator('#fairy .chapter-desc').inner_text())
  check('uploaded heading colour fill retained',page.locator('#fairy .fill-char').count()>5)
  count=page.locator('#fairy .fill-char.fill-in').count();page.evaluate('window.dispatchEvent(new Event("resize"))');page.wait_for_timeout(120)
  check('resize refresh retains colour-fill state',page.locator('#fairy .fill-char.fill-in').count()==count and count>0)
  page.locator('#fairy [data-case="fairy"]').click();page.wait_for_selector('dialog[open]');page.wait_for_timeout(600)
  check('Fairy detail has updated positioning','personal devices' in page.locator('#dialog-title').locator('..').inner_text() or 'personal devices' in page.locator('#case-dialog').inner_text())
  check('case-study text is not resplit by homepage effect',page.locator('#case-dialog .word-token').count()==0)
  page.keyboard.press('Escape');page.wait_for_selector('dialog[open]',state='hidden')
  jump(page,'#contact');page.wait_for_timeout(1000)
  check('one contact stream replaces the contact heading',page.locator('#contact [data-contact-stream]').count()==1 and page.locator('[data-text-stream]').count()==0)
  check('no extra footer animation strip',page.locator('footer .footer-bar').count()==1 and page.locator('footer .text-stream').count()==0)
  before=page.locator('.contact-stream-track').evaluate('(el)=>getComputedStyle(el).transform');page.wait_for_timeout(700)
  after=page.locator('.contact-stream-track').evaluate('(el)=>getComputedStyle(el).transform')
  check('contact text animates when visible',before!=after)
  page.locator('[data-contact-stream-toggle]').click();check('local stream pause works',page.locator('[data-contact-stream]').get_attribute('data-stream-state')=='static')
  check('paused phrase remains the original contact CTA',page.locator('.contact-stream-fallback').inner_text()=='something real.')
  page.locator('[data-contact-stream-toggle]').click();check('local stream resumes',page.locator('[data-contact-stream]').get_attribute('data-stream-state')=='running')
  page.locator('footer [data-evidence]').click();page.wait_for_selector('dialog[open]');page.wait_for_timeout(650)
  before=page.locator('.contact-stream-track').get_attribute('style');page.wait_for_timeout(300)
  check('contact rendering suspends behind dialog',page.locator('.contact-stream-track').get_attribute('style')==before)
  page.keyboard.press('Escape');page.wait_for_selector('dialog[open]',state='hidden')
  jump(page,'#home');page.locator('button[data-motion]').click();jump(page,'#contact');page.wait_for_timeout(150)
  check('global reduced motion disables stream',page.locator('[data-contact-stream]').get_attribute('data-stream-state')=='static')
  check('all word text visible when motion disabled',page.locator('[data-word-reveal].word-pending').count()==0)
  jump(page,'#home');page.locator('button[data-motion]').click();jump(page,'#contact')
  for i in range(4):page.locator('[data-locale]').click();page.wait_for_timeout(100)
  check('repeated locale changes leave one stream',page.locator('[data-contact-stream]').count()==1)
  check('no nested word or colour spans after refresh',page.locator('.word-token .word-token, .fill-char .fill-char').count()==0)
  check('contact and download links retained',page.locator('a[href="mailto:zmz1998@gmail.com"]').count()==1 and page.locator('a[download]').count()>=3)
  page.locator('[data-contact-stream-toggle]').click();page.screenshot(path=str(OUT/'contact-en.png'))
  # Both languages at common desktop, tablet and narrow mobile widths.
  for width in [320,390,768,1440]:
   page.set_viewport_size({'width':width,'height':900})
   for lang in ['en','zh']:
    if page.locator('html').get_attribute('lang').startswith('zh')!=(lang=='zh'):page.locator('[data-locale]').click()
    jump(page,'#contact');page.wait_for_timeout(200)
    check(f'contact layout fits {width}/{lang}',page.evaluate('document.documentElement.scrollWidth <= innerWidth'))
    check(f'contact title fits {width}/{lang}',page.locator('.contact-stream-fallback').evaluate('(e)=>e.scrollWidth <= e.clientWidth+2'))
    check(f'footer links stay visible {width}/{lang}',page.locator('footer [data-evidence]').is_visible())
    if width==390:page.screenshot(path=str(OUT/f'contact-390-{lang}.png'))
  # Real served build also retains required non-inline resources.
  if URL:
   for resource in ['documents/Mingzhe_Zhang_AI_Developer_Resume.pdf','demos/dreambound/index.html','assets/favicon.svg']:
    r=page.request.get(URL+resource);check('served resource '+resource,r.status==200)
   check('no network request failures',not failed)
  check('no page JavaScript errors',not errors)
  # Native prefers-reduced-motion from the first render.
  page.close();b.close()
  # Isolate first-render preference testing from the long-running WebGL/locale scenario.
  b,reduced_info=launch_browser(p)
  c=b.new_context(reduced_motion='reduce',viewport={'width':390,'height':900});rp=c.new_page();rp.set_default_timeout(30000)
  rp.on('pageerror',lambda e:errors.append(str(e)))
  rp.on('requestfailed',lambda r:failed.append({'url':r.url,'failure':r.failure}))
  rp.on('domcontentloaded',lambda:diagnostics.append('reduced:domcontentloaded'))
  rp.on('response',lambda r:diagnostics.append({'status':r.status,'url':r.url}))
  if URL:rp.goto(URL,wait_until='domcontentloaded',timeout=30000)
  else:rp.set_content(HTML,wait_until='domcontentloaded')
  rp.wait_for_selector('#contact',state='attached');jump(rp,'#contact');rp.wait_for_timeout(200)
  check('system reduced motion renders unanimated readable words',rp.locator('[data-word-reveal].word-pending').count()==0)
  check('system reduced motion has static contact and disabled pause',rp.locator('[data-contact-stream]').get_attribute('data-stream-state')=='static' and rp.locator('[data-contact-stream-toggle]').is_disabled())
  check('reduced-motion page has no script or network failures',not errors and not failed)
  rp.screenshot(path=str(OUT/'contact-initial-reduced.png'))
  c.close();b.close();completed=True
finally:
 (OUT/'results.json').write_text(json.dumps({'mode':'HTTP '+URL if URL else 'standalone set_content','checks':results,'page_errors':errors,'request_failures':failed,'completed':completed,'reduced_diagnostics':diagnostics},ensure_ascii=False,indent=2),encoding='utf8')
 if server:server.shutdown()
print(f'{len(results)} integration checks passed; mode: '+('HTTP' if URL else 'standalone set_content'))
