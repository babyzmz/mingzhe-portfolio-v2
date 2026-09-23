"""Real HTTP/Pages-subpath acceptance for integrated React Bits effects.
Default uses --serve (dist); PORTFOLIO_TEST_URL may select actual live site.
Fallback run uses --fallback to explicitly disable WebGL, not fake its status.
"""
from pathlib import Path
import os,sys,json,threading,http.server,functools
from playwright.sync_api import sync_playwright
from browser_support import launch_browser
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('ATMOSPHERE_TEST_OUTPUT',ROOT/'test-artifacts/atmosphere'));OUT.mkdir(parents=True,exist_ok=True)
URL=os.environ.get('PORTFOLIO_TEST_URL','');server=None
if not URL:
 class Handler(http.server.SimpleHTTPRequestHandler):
  def do_GET(self):
   if self.path.startswith('/mingzhe-portfolio-v2/'):self.path=self.path[len('/mingzhe-portfolio-v2'):]
   super().do_GET()
  def log_message(self,*args):pass
 server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Handler,directory=str(ROOT/'dist')))
 threading.Thread(target=server.serve_forever,daemon=True).start()
 URL=f'http://127.0.0.1:{server.server_port}/mingzhe-portfolio-v2/'
fallback='--fallback' in sys.argv
checks=[];errors=[];bad_requests=[];info={};complete=False

def check(name,value):
 checks.append({'name':name,'passed':bool(value)});print(('PASS ' if value else 'FAIL ')+name,flush=True)
 assert value,name

def jump(page,selector):
 page.evaluate('(s)=>{document.documentElement.style.scrollBehavior="auto";scrollTo(0,document.querySelector(s).getBoundingClientRect().top+scrollY)}',selector)
 page.wait_for_timeout(300)

def frames(page):return int(page.locator('#atmosphere-canvas').get_attribute('data-frames') or 0)

try:
 with sync_playwright() as p:
  b,info=launch_browser(p,['--disable-webgl'] if fallback else []);info['mode']='HTTP '+URL
  page=b.new_page(viewport={'width':1440,'height':960});page.set_default_timeout(20000)
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.on('requestfailed',lambda r:bad_requests.append({'url':r.url,'error':r.failure}))
  page.goto(URL,wait_until='load');page.wait_for_function("document.querySelector('#home h1').dataset.wordState==='revealed'")
  check('one persistent atmosphere canvas and one original model canvas',page.locator('#atmosphere-canvas').count()==1 and page.locator('#scene').count()==1)
  expected='css' if fallback else 'webgl'
  check('actual background backend '+expected,page.locator('#atmosphere').get_attribute('data-backend')==expected)
  check('light pillar behind story, pointer transparent',page.locator('#atmosphere').get_attribute('data-effect')=='pillar' and page.locator('#atmosphere').evaluate('(e)=>getComputedStyle(e).pointerEvents')=='none')
  check('both upstream fragment shaders compiled',fallback or frames(page)>0)
  check('circular text appears only in main nav',page.locator('.header [data-circular-mark]').count()==1 and page.locator('.footer [data-circular-mark]').count()==0)
  check('original MZ mark is preserved',page.locator('.header .nav-mark>svg').count()==1)
  ring=page.locator('.nav-orbit-letters');a=ring.evaluate('(e)=>getComputedStyle(e).transform');page.wait_for_timeout(250)
  check('circular letters rotate, not whole navigation',a!=ring.evaluate('(e)=>getComputedStyle(e).transform') and page.locator('.header').evaluate('(e)=>getComputedStyle(e).transform')=='none')
  page.screenshot(path=str(OUT/'home-desktop.png'))
  jump(page,'#fairy');page.wait_for_timeout(300);page.screenshot(path=str(OUT/'fairy-desktop.png'))
  check('pillar continues behind Fairy',page.locator('#atmosphere').get_attribute('data-effect')=='pillar')
  jump(page,'#work');page.wait_for_timeout(200);n=frames(page);page.wait_for_timeout(250)
  check('background draw loop stopped in project archive',frames(page)==n and page.locator('#atmosphere').get_attribute('data-running')=='false')
  check('all nine project cards have both spotlight and edge layers',page.locator('#work [data-card-light]>.card-edge-light').count()==9 and page.locator('#work [data-card-light]>.card-spotlight').count()==9)
  card=page.locator('[data-project-card="core"]');card.scroll_into_view_if_needed();rect=card.bounding_box()
  page.mouse.move(rect['x']+rect['width']/2,rect['y']+rect['height']/2);page.wait_for_timeout(200)
  center=float(card.evaluate('(e)=>e.style.getPropertyValue("--edge-proximity")') or -1)
  page.mouse.move(rect['x']+rect['width']-4,rect['y']+rect['height']*.65);page.wait_for_timeout(300)
  check('border glow strengthens toward the hovered edge',float(card.evaluate('(e)=>e.style.getPropertyValue("--edge-proximity")'))>center+.5)
  check('spotlight follows the cursor inside active card',card.get_attribute('data-light-active')=='true' and float(card.locator('.card-spotlight').evaluate('(e)=>getComputedStyle(e).opacity'))>.9)
  check('decorations never intercept clicking',card.locator('.card-edge-light').evaluate('(e)=>getComputedStyle(e).pointerEvents')=='none' and card.locator('.card-spotlight').evaluate('(e)=>getComputedStyle(e).pointerEvents')=='none')
  page.screenshot(path=str(OUT/'work-hover-desktop.png'))
  card.locator('h3 button').click();page.wait_for_function("document.querySelector('#case-dialog').dataset.phase==='open'")
  check('project case still opens from lit card',page.locator('#case-dialog').get_attribute('data-project')=='core')
  check('nav and backdrop pause behind modal',page.locator('html').get_attribute('data-ambient-motion')=='paused')
  check('no atmosphere/glow layers leak into case content',page.locator('#case-dialog [data-card-light],#case-dialog canvas').count()==0)
  page.keyboard.press('Escape');page.wait_for_function("!document.querySelector('#case-dialog').open")
  page.locator('[data-filter="ai"]').click();check('filter keeps four AI cards',page.locator('[data-project-card]:visible').count()==4)
  page.locator('[data-filter="archive"]').click();check('filter keeps five earlier cards',page.locator('[data-project-card]:visible').count()==5)
  page.locator('[data-filter="all"]').click()
  jump(page,'#about');page.wait_for_timeout(350);check('DarkVeil begins at about',page.locator('#atmosphere').get_attribute('data-effect')=='veil')
  page.screenshot(path=str(OUT/'about-desktop.png'));n=frames(page);page.wait_for_timeout(350)
  check('DarkVeil actually renders changing frames',fallback or frames(page)>n)
  jump(page,'#contact');page.wait_for_timeout(500)
  check('one continuous DarkVeil reaches contact and footer',page.locator('#atmosphere').get_attribute('data-effect')=='veil' and page.locator('#atmosphere-canvas').count()==1)
  check('corrected contact stream remains single',page.locator('[data-contact-stream]').count()==1 and page.locator('.footer [data-text-stream]').count()==0)
  page.screenshot(path=str(OUT/'contact-desktop.png'))
  page.locator('button[data-motion]').click();page.wait_for_timeout(200);n=frames(page);page.wait_for_timeout(350)
  check('global pause freezes background draw loop',frames(page)==n and page.locator('#atmosphere').get_attribute('data-running')=='false')
  paused_transform=ring.evaluate('(e)=>getComputedStyle(e).transform');page.wait_for_timeout(250)
  check('global pause freezes circular text',paused_transform==ring.evaluate('(e)=>getComputedStyle(e).transform') and ring.evaluate('(e)=>e.getAnimations().every(a=>a.playState!=="running")'))
  page.locator('button[data-motion]').click();page.wait_for_timeout(400)
  check('global resume restores veil',fallback or frames(page)>n)
  for width in [320,390,768,1440]:
   page.set_viewport_size({'width':width,'height':900})
   for lang in ['zh','en']:
    if page.locator('html').get_attribute('lang')!=('zh-CN' if lang=='zh' else 'en'):page.locator('[data-locale]').click()
    jump(page,'#work')
    check(f'filter and card layout fits {width}/{lang}',page.evaluate('document.documentElement.scrollWidth<=innerWidth') and page.locator('[data-project-card]:visible').count()==9)
    check(f'one ring after locale refresh {width}/{lang}',page.locator('[data-circular-mark]').count()==1)
    jump(page,'#contact');page.wait_for_timeout(120)
    check(f'contact and footer stay visible {width}/{lang}',page.locator('[data-contact-stream]').count()==1 and page.locator('.footer').bounding_box()['width']<=width)
    if width==390:page.screenshot(path=str(OUT/f'contact-mobile-{lang}.png'))
  # Preserve background context across locale renders and restore context loss.
  if not fallback:
   page.evaluate("window.__ext=document.querySelector('#atmosphere-canvas').getContext('webgl').getExtension('WEBGL_lose_context');window.__ext.loseContext()")
   page.wait_for_function("document.querySelector('#atmosphere').dataset.backend==='css'")
   check('context loss exposes static fallback and no blank content',page.locator('#contact').is_visible())
   page.evaluate('window.__ext.restoreContext()');page.wait_for_function("document.querySelector('#atmosphere').dataset.backend==='webgl'")
   check('context restoration reuses one canvas',page.locator('#atmosphere-canvas').count()==1)
  check('no JavaScript or network errors',not errors and not bad_requests)
  b.close()
  # Fresh preference context avoids accumulated scene work, exercises first load.
  b,_=launch_browser(p,['--disable-webgl'] if fallback else [])
  context=b.new_context(viewport={'width':390,'height':844},reduced_motion='reduce',has_touch=True,is_mobile=True)
  rp=context.new_page();rp.goto(URL,wait_until='load');rp.wait_for_timeout(300)
  check('system reduced motion freezes nav from first load',rp.locator('.nav-orbit-letters').evaluate('(e)=>getComputedStyle(e).animationName')=='none')
  check('reduced motion keeps text fully visible',rp.locator('#home h1').is_visible())
  rp.screenshot(path=str(OUT/'home-mobile-reduced.png'))
  jump(rp,'#contact');rp.wait_for_timeout(200);n=frames(rp);rp.wait_for_timeout(300)
  check('reduced motion draws at most a still background',frames(rp)==n)
  check('no stale old footer after reduced transition',rp.locator('.footer [data-text-stream]').count()==0)
  context.close();b.close();complete=True
finally:
 if server:server.shutdown()
 (OUT/'results.json').write_text(json.dumps({'complete':complete,'mode':'HTTP','url':URL,'fallback':fallback,'browser':info,'checks':checks,'errors':errors,'failed_requests':bad_requests},ensure_ascii=False,indent=2))
print(f'{len(checks)} atmosphere checks passed; HTTP; fallback={fallback}')
