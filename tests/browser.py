"""Exercise the site in a real Chromium browser.

Default: set_content against the standalone offline build.
Set PORTFOLIO_TEST_URL to a real served URL (dist/ or preview/) for real HTTP
acceptance. Tests report the renderer actually available (GPU vs software).
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json, os, sys
sys.path.insert(0, str(Path(__file__).resolve().parent))
from browser_support import OUTPUT_DIR, http_mode, launch_browser, load_page, log_info, webgl_renderer
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('PORTFOLIO_TEST_OUTPUT',OUTPUT_DIR));OUT.mkdir(parents=True,exist_ok=True)
results=[]
def check(name,ok,detail=''):
    results.append({'test':name,'pass':bool(ok),'detail':detail})
    OUT.joinpath('browser-results.json').write_text(json.dumps(results,indent=2,ensure_ascii=False))
    assert ok, name+': '+str(detail)
def load(page):
    load_page(page,wait_until='load',settle_ms=700)
def jump(page,ident):
    page.locator('#'+ident).evaluate('(el)=>scrollTo({top:el.offsetTop,behavior:"instant"})');page.wait_for_timeout(800)
with sync_playwright() as p:
    browser,binfo=launch_browser(p);log_info(binfo)
    page=browser.new_page(viewport={'width':1440,'height':1000},device_scale_factor=1)
    page.set_default_timeout(8000)
    errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    load(page)
    mode=page.locator('html').get_attribute('data-renderer')
    scroll_backend=page.locator('html').get_attribute('data-scroll-backend')
    gl_renderer=webgl_renderer(page)
    print(f'[browser] renderer={mode} scrollBackend={scroll_backend} gl={gl_renderer}')
    check('identity and first heading visible',page.locator('h1').is_visible() and 'Mingzhe' in page.locator('.hero-description').inner_text())
    check('all nine projects rendered',page.locator('[data-project-card]').count()==9)
    check('no desktop overflow',page.evaluate('document.documentElement.scrollWidth <= innerWidth'))
    check('actual 3D renderer initialized',mode in ['webgl','software-3d'],mode)
    check('document is not bound as a motion button',page.locator('html').get_attribute('aria-pressed') is None)
    z0=float(page.locator('canvas').get_attribute('data-camera-z'))
    # Disable continuous time animation for repeatable screenshot capture.
    page.locator('button[data-motion]').click();page.wait_for_timeout(250)
    page.screenshot(path=str(OUT/'01-hero-desktop.png'))
    for ident,name in [('fairy','02-fairy-desktop'),('core','03-core-desktop'),('mojo','04-mojo-desktop'),('method','05-process-desktop'),('work','06-projects-desktop'),('about','07-about-desktop')]:
        jump(page,ident);page.screenshot(path=str(OUT/(name+'.png')))
    # Resume to exercise continuous camera motion, not chapter snapping.
    jump(page,'core');page.locator('button[data-motion]').click();page.wait_for_timeout(300)
    z2=float(page.locator('canvas').get_attribute('data-camera-z'))
    check('camera advances in world Z',z2<z0-20,f'{z0} -> {z2}')
    jump(page,'home')
    z_back=float(page.locator('canvas').get_attribute('data-camera-z'))
    check('camera reverses to start',abs(z_back-z0)<.1,f'{z_back}')
    page.locator('[data-locale]').first.click();page.wait_for_timeout(350)
    check('Chinese locale applied',page.locator('html').get_attribute('lang')=='zh-CN')
    check('Chinese heading rendered','让想法' in page.locator('h1').inner_text())
    page.locator('button[data-motion]').click();page.wait_for_timeout(200)
    page.screenshot(path=str(OUT/'08-hero-chinese.png'))
    page.locator('[data-case="fairy"]').first.click();page.wait_for_timeout(200)
    check('case dialog opens',page.locator('#case-dialog').is_visible())
    check('case limitations are present','Beta' in page.locator('#case-dialog').inner_text())
    page.screenshot(path=str(OUT/'12-project-case.png'))
    page.keyboard.press('Escape');page.locator('#case-dialog').wait_for(state='hidden');page.wait_for_timeout(100)
    check('dialog closes with Escape',not page.locator('#case-dialog').is_visible())
    check('dialog returns keyboard focus',page.evaluate('document.activeElement?.dataset.case')=='fairy')
    cv_href=page.locator('a[download]').first.get_attribute('href')
    if http_mode():
        cv_status=page.evaluate("async(h)=> (await fetch(h,{method:'GET'})).status", cv_href)
        check('CV download link resolves over HTTP (200)', cv_status==200, {'href':cv_href,'status':cv_status})
    else:
        check('CV is embedded in standalone file', (ROOT/'public/documents/Mingzhe_Zhang_AI_Developer_Resume.pdf').is_file() and cv_href.startswith('data:application/pdf;base64,'))
    paused=page.locator('button[data-motion]').get_attribute('aria-pressed')
    page.locator('button[data-motion]').click();page.wait_for_timeout(200)
    check('motion button changes actual state',page.locator('button[data-motion]').get_attribute('aria-pressed')!=paused)
    page.locator('[data-filter="archive"]').click();check('archive filter shows five',page.locator('[data-project-card]:visible').count()==5)
    page.locator('[data-filter="ai"]').click();check('AI filter shows four',page.locator('[data-project-card]:visible').count()==4)
    page.locator('[data-filter="all"]').click();check('all filter restores nine',page.locator('[data-project-card]:visible').count()==9)
    # Every case must actually open and include evidence, not only exist in data.
    for ident in ['fairy','core','claw','ax','dreambound','webchange','goodnight','tarot','converter']:
        page.locator('[data-project-card] [data-case="'+ident+'"]').first.click()
        copy=page.locator('#case-dialog').inner_text()
        check('case readable: '+ident,'来源依据' in copy and '当前限制' in copy)
        page.keyboard.press('Escape');page.locator('#case-dialog').wait_for(state='hidden')
    page.locator('[data-evidence]').first.click();check('source disclosure opens','私有源码' in page.locator('#case-dialog').inner_text());page.keyboard.press('Escape');page.locator('#case-dialog').wait_for(state='hidden')
    check('no uncaught JS errors',not errors,errors)
    mobile=browser.new_page(viewport={'width':390,'height':844},device_scale_factor=1,is_mobile=True,has_touch=True)
    load(mobile)
    mobile.locator('button[data-motion]').click();mobile.wait_for_timeout(150)
    check('no mobile overflow',mobile.evaluate('document.documentElement.scrollWidth <= innerWidth'))
    mobile.screenshot(path=str(OUT/'09-mobile-hero.png'))
    jump(mobile,'fairy');mobile.screenshot(path=str(OUT/'10-mobile-fairy.png'))
    mobile.locator('[data-menu]').click();check('mobile navigation opens',mobile.locator('[data-menu]').get_attribute('aria-expanded')=='true')
    mobile.locator('.main-nav a[href="#work"]').click();mobile.wait_for_timeout(200)
    check('mobile navigation closes after selection',mobile.locator('[data-menu]').get_attribute('aria-expanded')=='false')
    jump(mobile,'work');mobile.screenshot(path=str(OUT/'11-mobile-projects.png'))
    mobile.locator('[data-locale]').click();mobile.wait_for_timeout(100)
    check('Chinese mobile content stays within viewport',mobile.evaluate('document.documentElement.scrollWidth <= innerWidth') and mobile.locator('html').get_attribute('lang')=='zh-CN')
    reduced=browser.new_page(viewport={'width':1280,'height':800},reduced_motion='reduce');load(reduced)
    check('reduced motion respected',reduced.locator('html').get_attribute('data-motion')=='reduced')
    check('reduced motion preserves all content',reduced.locator('[data-project-card]').count()==9)
    # Simulates a renderer initialization failure, not a success.
    # add_init_script survives real HTTP navigation; a pre-goto evaluate would not.
    disabled_ctx=browser.new_context(viewport={'width':1280,'height':800})
    disabled_ctx.add_init_script('HTMLCanvasElement.prototype.getContext=function(){return null}')
    disabled=disabled_ctx.new_page()
    load(disabled)
    check('renderer failure keeps text accessible',disabled.locator('html').get_attribute('data-renderer')=='static' and disabled.locator('h1').is_visible())
    disabled.screenshot(path=str(OUT/'13-static-fallback.png'))
    disabled_ctx.close()
    browser.close()
print(json.dumps({'count':len(results),'passed':sum(r['pass'] for r in results),'renderer':mode,'scrollBackend':scroll_backend,'glRenderer':gl_renderer,'loadMode':('http' if http_mode() else 'offline-set-content'),'browser':binfo,'results':results},indent=2,ensure_ascii=False))
