"""Verify the Shixu integration and capture desktop/mobile evidence."""
from pathlib import Path
from functools import partial
from urllib.parse import urljoin
import http.server, threading, os, json
from playwright.sync_api import sync_playwright
from browser_support import launch_browser

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'test-artifacts/shixu'
OUT.mkdir(parents=True,exist_ok=True)
URL=os.environ.get('PORTFOLIO_TEST_URL','')
server=None
if not URL:
 class Handler(http.server.SimpleHTTPRequestHandler):
  def do_GET(self):
   if self.path.startswith('/mingzhe-portfolio-v2/'):
    self.path=self.path[len('/mingzhe-portfolio-v2'):]
   super().do_GET()
  def log_message(self,*args): pass
 server=http.server.ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT/'dist')))
 threading.Thread(target=server.serve_forever,daemon=True).start()
 URL=f'http://127.0.0.1:{server.server_port}/mingzhe-portfolio-v2/'
checks=[]
errors=[]
def check(name,value):
 checks.append({'name':name,'pass':bool(value)})
 print(('PASS ' if value else 'FAIL ')+name,flush=True)
 assert value,name
try:
 with sync_playwright() as p:
  browser,info=launch_browser(p)
  for width in [320,390,768,1440]:
   context=browser.new_context(viewport={'width':width,'height':960},reduced_motion='reduce')
   page=context.new_page()
   page.set_default_timeout(20000)
   page.on('pageerror',lambda error:errors.append(str(error)))
   page.goto(URL,wait_until='networkidle')
   page.wait_for_selector('[data-project-card="shixu"]')
   for lang in ['en','zh']:
    if lang=='zh':
     page.locator('[data-locale]').click()
     page.wait_for_function("document.documentElement.lang==='zh-CN'")
    card=page.locator('[data-project-card="shixu"]')
    card.scroll_into_view_if_needed()
    check(f'{width}/{lang} single formal card',card.count()==1 and page.locator('.shixu-launch').count()==0)
    check(f'{width}/{lang} ten projects',page.locator('[data-project-card]').count()==10)
    check(f'{width}/{lang} three visitor routes',card.locator('.shixu-card-links a').count()==3)
    page.wait_for_function("document.querySelector('[data-project-card=\"shixu\"] img[src$=\"/today.jpg\"]').naturalWidth===1425")
    check(f'{width}/{lang} real screenshot',card.locator('img[src$="/today.jpg"]').evaluate('(i)=>i.complete&&i.naturalWidth===1425'))
    check(f'{width}/{lang} no page overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
    page.locator('[data-filter="ai"]').click()
    check(f'{width}/{lang} active projects filter',page.locator('[data-project-card]:visible').count()==5)
    page.locator('[data-filter="all"]').click()
    card.locator('h3 button').click()
    page.wait_for_selector('#case-dialog[open] [data-case-id="shixu"]')
    details=page.locator('#case-dialog')
    check(f'{width}/{lang} real screenshot gallery',details.locator('[data-media-open]').count()==4)
    check(f'{width}/{lang} stable Windows download',details.locator('a[href="./shixu/download/"]').count()==1)
    check(f'{width}/{lang} no private source link',details.locator('a[href*="Shixu-WinUI3"]').count()==0)
    check(f'{width}/{lang} capability boundaries','local rules' in details.inner_text() if lang=='en' else '本地规则' in details.inner_text())
    check(f'{width}/{lang} dialog fits',details.evaluate('(d)=>d.getBoundingClientRect().width<=innerWidth'))
    if width in [390,1440]:
     page.screenshot(path=str(OUT/f'case-{width}-{lang}.png'))
    details.locator('[data-shixu-preview] summary').click()
    frame=page.frame_locator('[data-shixu-preview] iframe')
    frame.locator('#quick-input').wait_for()
    # Use a disposable browser context; no existing user account or workspace is touched.
    sample=f'Portfolio preview sample task {lang}'
    frame.locator('#quick-input').fill(sample)
    frame.locator('#quick-input').press('Enter')
    frame.get_by_role('button',name=sample,exact=True).wait_for()
    check(f'{width}/{lang} real workbench interaction',frame.get_by_role('button',name=sample,exact=True).count()>=1)
    if width in [390,1440]:
     page.screenshot(path=str(OUT/f'workbench-{width}-{lang}.png'))
    details.locator('.case-close').click()
    page.wait_for_selector('#case-dialog',state='hidden')
   context.close()
  context=browser.new_context()
  for route in ['shixu/','shixu/workbench/','shixu/download/','shixu/changelog/','shixu/help/','shixu/privacy/']:
   response=context.request.get(urljoin(URL,route))
   check(f'route {route}',response.status==200)
  for asset in ['icon.svg','today.jpg','today-light.jpg','calendar.jpg','assistant.jpg','widgets.jpg']:
   response=context.request.get(urljoin(URL,'shixu/assets/'+asset))
   check(f'asset {asset}',response.status==200 and len(response.body())>200)
  context.close()
  browser.close()
 check('no browser script errors',not errors)
finally:
 (OUT/'result.json').write_text(json.dumps({'url':URL,'checks':checks,'errors':errors},ensure_ascii=False,indent=2),encoding='utf8')
 if server:server.shutdown()
