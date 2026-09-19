from pathlib import Path
from playwright.sync_api import sync_playwright
import json, sys
sys.path.insert(0, str(Path(__file__).resolve().parent))
from browser_support import launch_browser, load_page, log_info
r=Path(__file__).resolve().parents[1];out=r/'test-artifacts-v21';out.mkdir(parents=True,exist_ok=True);results=[]
def check(name,val):
 results.append({'test':name,'pass':bool(val)});print(name,val,flush=True)
 (out/'detail-stress-results.json').write_text(json.dumps(results,indent=2))
 assert val,name
with sync_playwright() as p:
 # This test captures the Canvas2D software-3D fallback via toDataURL();
 # force WebGL off so it exercises the same renderer the suite was written for.
 b,binfo=launch_browser(p,extra_args=['--disable-webgl']);log_info(binfo)
 page=b.new_page(viewport={'width':1000,'height':760});load_page(page,settle_ms=200)
 page.locator('#fairy [data-case]').click();page.wait_for_timeout(850)
 first=page.locator('#scene').evaluate('(c)=>c.toDataURL()');page.wait_for_timeout(200)
 check('background rendering pauses while the reader is open',first==page.locator('#scene').evaluate('(c)=>c.toDataURL()'))
 page.keyboard.press('Shift+Tab');page.keyboard.press('Tab')
 check('keyboard navigation stays inside the native modal',page.evaluate('document.querySelector("#case-dialog").contains(document.activeElement)'))
 page.locator('[data-case-jump="build"]').click();page.wait_for_timeout(1000)
 toggle=page.locator('[data-glossary-toggle]');toggle.click();page.wait_for_timeout(400)
 # From expanded, request close/open/close without waiting. Older stale promise
 # handlers would hide the final closing panel before its animation finished.
 toggle.evaluate('(b)=>{b.click();b.click();b.click()}');page.wait_for_timeout(30)
 check('a superseded glossary callback cannot hide the active transition',page.locator('#case-glossary-body').is_visible())
 page.wait_for_timeout(430)
 check('rapid glossary reversal ends closed with accurate ARIA',page.locator('#case-glossary-body').is_hidden() and toggle.get_attribute('aria-expanded')=='false')
 page.keyboard.press('Escape');page.locator('#case-dialog').wait_for(state='hidden');page.wait_for_timeout(300)
 first=page.locator('#scene').evaluate('(c)=>c.toDataURL()');page.wait_for_timeout(250)
 check('background motion resumes after the reader closes',first!=page.locator('#scene').evaluate('(c)=>c.toDataURL()'))
 b.close()
