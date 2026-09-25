"""Mobile 3D text protection: real HTTP, Chromium/WebKit, optional pixel baseline.
READABILITY_ENGINE=webkit uses Playwright WebKit, not a physical iPhone.
PORTFOLIO_BASE_DIST enables exact desktop and mobile-layout comparisons.
READABILITY_LOCAL_OFFLINE=1 is a restricted-sandbox design check only.
"""
from pathlib import Path
import os, sys, json, functools, http.server, threading, io
from playwright.sync_api import sync_playwright
from PIL import Image, ImageChops
from browser_support import launch_browser

ROOT = Path(__file__).resolve().parents[1]
ENGINE = os.environ.get('READABILITY_ENGINE', 'chromium')
OFFLINE = os.environ.get('READABILITY_LOCAL_OFFLINE') == '1'
OUT = Path(os.environ.get('READABILITY_OUTPUT', str(ROOT/'test-artifacts'/'mobile-readability'/ENGINE)))
OUT.mkdir(parents=True, exist_ok=True)
SECTIONS = ['home', 'fairy', 'core', 'mojo', 'method']
checks, errors, servers = [], [], []
completed = False

def check(name, value):
    checks.append({'name': name, 'passed': bool(value)})
    print(('PASS ' if value else 'FAIL ') + name, flush=True)
    assert value, name

def serve(directory):
    class Handler(http.server.SimpleHTTPRequestHandler):
        def do_GET(self):
            prefix = '/mingzhe-portfolio-v2'
            if self.path.startswith(prefix + '/'):
                self.path = self.path[len(prefix):]
            super().do_GET()
        def log_message(self, *_): pass
    server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Handler, directory=str(directory)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    servers.append(server)
    return f'http://127.0.0.1:{server.server_port}/mingzhe-portfolio-v2/'

def copy(page, section):
    return page.locator(f'#{section}').locator('.hero-copy, .chapter-copy').first

def jump(page, section):
    page.evaluate('''s => {document.documentElement.style.scrollBehavior='auto';
      scrollTo(0,document.getElementById(s).getBoundingClientRect().top+scrollY)}''', section)
    page.wait_for_timeout(100)

def freeze(page):
    if page.locator('html').get_attribute('data-motion') != 'reduced':
        page.locator('button[data-motion]').click()
    page.wait_for_timeout(100)

def geometry(page, section):
    return copy(page, section).evaluate('''e => [e,...e.querySelectorAll('h1,h2,p,a,button')].map(n => {
      const b=n.getBoundingClientRect();return [b.x,b.y,b.width,b.height].map(v=>Math.round(v*100)/100)})''')

def stable_screenshot(page, label):
    # Paused scenes still need asynchronous scroll/paint to settle. Require
    # consecutive equal frames, then compare old/new with zero tolerance.
    previous = None
    equal_frames = 0
    for attempt in range(15):
        current = page.screenshot()
        if current == previous:
            equal_frames += 1
            if equal_frames >= 2:
                (OUT/(label+'.png')).write_bytes(current)
                return current
        else:
            equal_frames = 0
        previous = current
        page.wait_for_timeout(150)
    (OUT/(label+'-unstable.png')).write_bytes(current)
    raise AssertionError('Paused rendering did not settle: '+label)

def load(page, url):
    if OFFLINE:
        page.set_content((ROOT/'Mingzhe-Portfolio-Preview.html').read_text(), wait_until='load')
    else:
        page.goto(url, wait_until='load')
    page.wait_for_function("document.querySelector('#home h1') && ['revealed','static'].includes(document.querySelector('#home h1').dataset.wordState)")
    freeze(page)

info = {'engine': ENGINE, 'mode': 'offline set_content' if OFFLINE else 'real HTTP'}
try:
    url = '' if OFFLINE else os.environ.get('PORTFOLIO_TEST_URL') or serve(ROOT/'dist')
    base = os.environ.get('PORTFOLIO_BASE_DIST')
    base_url = serve(Path(base)) if base and not OFFLINE else None
    with sync_playwright() as p:
        if ENGINE == 'webkit':
            browser = p.webkit.launch()
        else:
            browser, launch = launch_browser(p)
            info['launch'] = launch
        context = browser.new_context(viewport={'width':430,'height':844}, device_scale_factor=1, has_touch=True)
        context.add_init_script("localStorage.setItem('mz.motion','off');localStorage.setItem('mz.locale','en')")
        page = context.new_page()
        page.on('pageerror', lambda e: errors.append(str(e)))
        load(page, url)
        info['renderer'] = page.locator('html').get_attribute('data-renderer')
        info['atmosphere'] = page.locator('#atmosphere').get_attribute('data-backend')
        if not OFFLINE and ENGINE == 'chromium':
            check('actual WebGL model and background', info['renderer']=='webgl' and info['atmosphere']=='webgl')
        for width in [320, 375, 390, 430, 600, 759]:
            page.set_viewport_size({'width':width,'height':844})
            for lang in ['en','zh']:
                if page.locator('html').get_attribute('lang') != ('en' if lang=='en' else 'zh-CN'):
                    page.locator('[data-locale]').click()
                for section in SECTIONS:
                    jump(page, section)
                    result = copy(page,section).evaluate('''e=>{const s=getComputedStyle(e,'::before'),c=getComputedStyle(e);
                      return {content:s.content,pointer:s.pointerEvents,z:s.zIndex,mask:s.maskImage||s.webkitMaskImage,
                      blur:s.backdropFilter||s.webkitBackdropFilter,filter:c.filter,opacity:c.opacity,
                      width:e.getBoundingClientRect().width,active:c.getPropertyValue('--mobile-reading-shield')}}''')
                    check(f'{width}/{lang}/{section}: local feathered layer; foreground not blurred',
                          result['content']=='""' and result['pointer']=='none' and result['z']=='-1'
                          and 'linear-gradient' in result['mask'] and '10px' in result['blur']
                          and result['filter']=='none' and result['opacity']=='1' and result['active'].strip()=='1')
                check(f'{width}/{lang}: no horizontal overflow', page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
        page.set_viewport_size({'width':430,'height':844})
        if page.locator('html').get_attribute('lang')!='en': page.locator('[data-locale]').click()
        for section in SECTIONS:
            jump(page,section)
            page.screenshot(path=str(OUT/f'{section}-mobile-en.png'))
        for section, project in [('fairy','fairy'),('core','core'),('mojo','claw'),('mojo','ax')]:
            jump(page,section)
            button=page.locator(f'#{section} [data-case="{project}"]')
            button.scroll_into_view_if_needed();button.tap()
            page.wait_for_function("document.querySelector('#case-dialog').dataset.phase==='open'")
            check(f'{project}: real touch opens case through reading layer', page.locator('#case-dialog').get_attribute('data-project')==project)
            page.locator('#case-dialog .case-close').tap()
            page.wait_for_function("!document.querySelector('#case-dialog').open")
        jump(page,'core')
        page.locator('[data-menu]').tap()
        check('mobile navigation remains above the reading layer',page.locator('.main-nav').get_attribute('class').endswith('open'))
        page.locator('[data-menu]').tap()
        page.locator('[data-locale]').tap();jump(page,'core')
        page.screenshot(path=str(OUT/'core-mobile-zh.png'))
        page.locator('[data-locale]').tap()
        page.locator('button[data-motion]').click()
        for section in ['fairy','core','mojo','core']:
            jump(page,section);page.wait_for_timeout(500)
            check(f'active/reverse scroll {section}: shield follows copy',copy(page,section).evaluate("e=>getComputedStyle(e,'::before').content")=='""')
        freeze(page)
        for width in [760, 900, 1440]:
            page.set_viewport_size({'width':width,'height':960})
            for section in SECTIONS:
                jump(page,section)
                check(f'desktop {width}/{section}: shield not instantiated',copy(page,section).evaluate("e=>getComputedStyle(e,'::before').content")=='none')
        for section in ['work','about','contact']:
            jump(page,section)
            check(f'{section}: no reading shield outside 3D journey',page.locator('#'+section).evaluate("e=>getComputedStyle(e).getPropertyValue('--mobile-reading-shield')")== '')
        check('corrected footer and all project cards preserved',page.locator('[data-contact-stream]').count()==1 and page.locator('[data-project-card]').count()==9)
        if base_url:
            old_context=browser.new_context(viewport={'width':1440,'height':960},device_scale_factor=1)
            new_context=browser.new_context(viewport={'width':1440,'height':960},device_scale_factor=1)
            for ctx in [old_context,new_context]:
                ctx.add_init_script("localStorage.setItem('mz.motion','off');localStorage.setItem('mz.locale','en')")
            old=old_context.new_page();new=new_context.new_page()
            load(old,base_url);load(new,url)
            for width in [760,1440]:
                for q in [old,new]:q.set_viewport_size({'width':width,'height':960})
                for section in SECTIONS:
                    for q in [old,new]:jump(q,section)
                    before=stable_screenshot(old,f'desktop-{width}-{section}-before')
                    after=stable_screenshot(new,f'desktop-{width}-{section}-after')
                    check(f'baseline {width}/{section}: identical copy and button geometry',geometry(old,section)==geometry(new,section))
                    diff=ImageChops.difference(Image.open(io.BytesIO(before)).convert('RGB'),Image.open(io.BytesIO(after)).convert('RGB'))
                    if diff.getbbox() is not None:
                        diff.save(OUT/f'desktop-{width}-{section}-diff.png')
                        (OUT/f'desktop-{width}-{section}-diagnostic.json').write_text(json.dumps({'bbox':diff.getbbox(),'before_scroll':old.evaluate('scrollY'),'after_scroll':new.evaluate('scrollY')}))
                    check(f'baseline {width}/{section}: pixel-identical desktop',diff.getbbox() is None)
            for q in [old,new]:q.set_viewport_size({'width':430,'height':844})
            for section in SECTIONS:
                for q in [old,new]:jump(q,section)
                check(f'mobile {section}: unchanged text/button positions',geometry(old,section)==geometry(new,section))
            for q in [old,new]:jump(q,'core')
            stable_screenshot(old,'core-before');stable_screenshot(new,'core-after')
            new.add_style_tag(content='#journey :is(.hero-copy,.chapter-copy)::before{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}')
            result=copy(new,'core').evaluate("e=>{const s=getComputedStyle(e,'::before');return {bg:s.backgroundImage,content:s.content}}")
            check('blur-disabled fallback retains gradient protection',result['content']=='""' and 'linear-gradient' in result['bg'])
            new.screenshot(path=str(OUT/'core-no-blur.png'))
            old_context.close();new_context.close()
        page.emulate_media(reduced_motion='reduce')
        page.set_viewport_size({'width':390,'height':844});jump(page,'core')
        check('reduced motion retains mobile readability',copy(page,'core').evaluate("e=>getComputedStyle(e,'::before').content")=='""')
        page.emulate_media(media='print')
        check('printing does not add a dark reading layer',copy(page,'core').evaluate("e=>getComputedStyle(e,'::before').content")=='none')
        check('no JavaScript errors',not errors)
        browser.close()
        completed = True
finally:
    for server in servers:server.shutdown()
    (OUT/'results.json').write_text(json.dumps({'info':info,'checks':checks,'errors':errors,'completed':completed,'passed':completed and all(x['passed'] for x in checks),'count':len(checks)},indent=2))
