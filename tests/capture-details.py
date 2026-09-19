from playwright.sync_api import sync_playwright
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).resolve().parent))
from browser_support import launch_browser, load_page, log_info
root=Path(__file__).resolve().parents[1]
(root/'test-artifacts-v21').mkdir(exist_ok=True)
with sync_playwright() as p:
 b,binfo=launch_browser(p);log_info(binfo)
 page=b.new_page(viewport={'width':1440,'height':1000})
 errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
 load_page(page,settle_ms=400)
 page.locator('[data-locale]').click();page.locator('[data-case="fairy"]').first.click()
 print('motion',page.locator('#case-dialog').evaluate('(d)=>({phase:d.dataset.phase,animations:d.getAnimations().map(a=>a.playState)})'))
 page.wait_for_timeout(950);page.screenshot(path=str(root/'test-artifacts-v21/fairy-detail-top.png'))
 page.locator('[data-case-jump="workflow"]').click();page.wait_for_timeout(1100)
 page.screenshot(path=str(root/'test-artifacts-v21/fairy-workflow.png'))
 page.locator('[data-case-jump="build"]').click();page.wait_for_timeout(1100)
 page.locator('[data-glossary-toggle]').click();page.wait_for_timeout(500)
 page.screenshot(path=str(root/'test-artifacts-v21/fairy-build.png'))
 page.keyboard.press('Escape');page.wait_for_timeout(350)
 print('closed',not page.locator('#case-dialog').is_visible(),'errors',errs)
 mobile=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
 load_page(mobile,settle_ms=300);mobile.locator('[data-locale]').click();mobile.locator('[data-case="fairy"]').first.click();mobile.wait_for_timeout(1000)
 mobile.screenshot(path=str(root/'test-artifacts-v21/mobile-detail-top.png'))
 print('mobile sizes',mobile.evaluate('({screen:innerWidth,body:document.documentElement.scrollWidth,dialog:document.querySelector(".case-scroll").scrollWidth})'))
 b.close()
