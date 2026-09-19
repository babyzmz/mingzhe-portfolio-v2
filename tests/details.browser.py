"""Exercise motion as rendered, not by checking that a CSS class exists.

Default: set_content against the standalone offline build.
Set PORTFOLIO_TEST_URL to a real served URL (dist/ or preview/) for real HTTP
acceptance — page.goto() instead of set_content(). See browser_support.py.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json, os, sys, time
sys.path.insert(0, str(Path(__file__).resolve().parent))
from browser_support import OUTPUT_DIR, http_mode, launch_browser, load_page, log_info
PART=sys.argv[1] if len(sys.argv)>1 else "core"
START=time.monotonic()
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('DETAIL_OUTPUT',OUTPUT_DIR));OUT.mkdir(parents=True,exist_ok=True)
RESULTS=[]
def check(name,value,detail=None):
 RESULTS.append({'test':name,'pass':bool(value),'detail':detail})
 (OUT/('detail-'+PART+'-results.json')).write_text(json.dumps(RESULTS,ensure_ascii=False,indent=2))
 print(f'{time.monotonic()-START:.2f}s {name}: {bool(value)}',flush=True)
 assert value,name+': '+str(detail)
def load(page):
 load_page(page,wait_until='load',settle_ms=350)
def settled(page):
 page.wait_for_function('document.querySelector("#case-dialog").dataset.phase==="open"',timeout=8000);page.wait_for_timeout(220)
def dismiss(page,method='escape'):
 if method=='escape':page.keyboard.press('Escape')
 else:page.locator('#case-dialog .case-close').click()
 page.locator('#case-dialog').wait_for(state='hidden')
def jump(page,section):
 page.locator('[data-case-jump="'+section+'"]').click();page.wait_for_timeout(1100)
with sync_playwright() as pw:
 browser,binfo=launch_browser(pw);log_info(binfo)
 page=browser.new_page(viewport={'width':1440,'height':1000})
 page.set_default_timeout(10000)
 errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
 load(page);page.locator('[data-locale]').click()
 if PART=="core":
  trigger=page.locator('#fairy [data-case="fairy"]');trigger.scroll_into_view_if_needed();page.wait_for_timeout(350)
  y=page.evaluate('scrollY');trigger.click()
  a=page.locator('#case-dialog').evaluate('(d)=>({phase:d.dataset.phase,active:d.getAnimations().filter(a=>a.playState==="running").length,matrix:getComputedStyle(d).transform})')
  check('story entry starts a real running opening animation',a['phase']=='opening' and a['active']>0,a)
  page.wait_for_timeout(100)
  b=page.locator('#case-dialog').evaluate('(d)=>getComputedStyle(d).transform')
  check('opening changes actual rendered transform over time',b!=a['matrix'],{'first':a['matrix'],'later':b})
  settled(page)
  check('five reading chapters are present',page.locator('[data-case-section]').count()==5)
  check('Fairy explains documents, tools and project purpose','文档' in page.locator('.case-body-lead').first.inner_text() and len(page.locator('.case-body-lead').first.inner_text())>90)
  check('page scroll is locked while reading',page.evaluate('document.body.style.overflow')=='hidden')
  page.screenshot(path=str(OUT/'01-fairy-top.png'))
  jump(page,'workflow')
  check('workflow navigation moves the dialog, not the background',page.locator('.case-scroll').evaluate('(e)=>e.scrollTop')>300 and abs(page.evaluate('scrollY')-y)<3)
  check('reading progress responds to internal scrolling',int(page.locator('[data-reading-label]').inner_text().strip('%'))>0)
  check('workflow TOC item identifies current section',page.locator('[data-case-jump="workflow"]').get_attribute('aria-current')=='location')
  check('flow is labelled illustrative','示意' in page.locator('.case-illustration-note').inner_text())
  check('workflow has a concrete input and four stages',page.locator('.case-flow-step').count()==4 and page.locator('.case-scenario blockquote').inner_text().startswith('“'))
  page.screenshot(path=str(OUT/'02-fairy-workflow.png'))
  jump(page,'features')
  check('six explanatory feature cards rather than only keywords',page.locator('.case-feature').count()==6 and all(len(s)>25 for s in page.locator('.case-feature p').all_inner_texts()))
  check('visible feature cards finish their section reveals',page.locator('.case-feature').first.evaluate('(e)=>e.dataset.revealed==="true" && Number(getComputedStyle(e).opacity)===1'))
  page.screenshot(path=str(OUT/'03-fairy-features.png'))
  jump(page,'build');glossary=page.locator('[data-glossary-toggle]');glossary.scroll_into_view_if_needed();page.wait_for_timeout(300);glossary.click()
  check('glossary expansion has a real running height animation',page.locator('#case-glossary-body').evaluate('(e)=>e.getAnimations().some(a=>a.playState==="running")'))
  h1=page.locator('#case-glossary-body').evaluate('(e)=>e.getBoundingClientRect().height');page.wait_for_timeout(140)
  h2=page.locator('#case-glossary-body').evaluate('(e)=>e.getBoundingClientRect().height')
  check('glossary visibly expands instead of instantly appearing',h2>h1,{'initial':h1,'later':h2})
  page.wait_for_timeout(350)
  check('glossary supplies plain-language definitions',page.locator('#case-glossary-body dd').count()==4)
  page.screenshot(path=str(OUT/'04-fairy-glossary.png'))
  glossary.click();page.wait_for_timeout(400)
  check('glossary closes with correct accessibility state',glossary.get_attribute('aria-expanded')=='false' and page.locator('#case-glossary-body').is_hidden())
  page.locator('.case-close').click()
  exit_state=page.locator('#case-dialog').evaluate('(d)=>({open:d.open,phase:d.dataset.phase,active:d.getAnimations().some(a=>a.playState==="running")})')
  check('close waits for its exit animation before native close',exit_state['open'] and exit_state['phase']=='closing' and exit_state['active'],exit_state)
  page.locator('#case-dialog').wait_for(state='hidden')
  check('closing restores page scroll and the original CTA focus',abs(page.evaluate('scrollY')-y)<3 and page.evaluate('document.activeElement?.dataset.case')=='fairy')
  check('body scroll lock is cleaned up',page.evaluate('document.body.style.overflow')=='')
  card=page.locator('[data-project-card="core"] .project-art');card.scroll_into_view_if_needed();page.wait_for_timeout(300);card.click()
  check('archive artwork uses the same opening animation',page.locator('#case-dialog').evaluate('(d)=>d.getAnimations().some(a=>a.playState==="running")'))
  settled(page)
  check('Core explains refresh recovery and is not called Fairy backend','刷新' in page.locator('.case-scenario').inner_text() and '自己的 Core' in page.locator('.case-relationship').inner_text())
  page.screenshot(path=str(OUT/'05-core-top.png'))
  page.locator('.case-toolbar [data-case-next="claw"]').click()
  switching=page.locator('#case-dialog').get_attribute('data-phase')
  check('next-project navigation has an animated transition',switching in ['switching','opening'],switching)
  settled(page)
  check('next-project content and reading position reset',page.locator('#dialog-title').inner_text()=='MojoClaw' and page.locator('.case-scroll').evaluate('(e)=>e.scrollTop')==0)
  page.locator('[data-case-locale]').click();settled(page)
  check('locale switch also updates the open case',page.locator('html').get_attribute('lang')=='en' and 'personal AI workbench' in page.locator('.case-tagline').inner_text())
  page.screenshot(path=str(OUT/'06-claw-english.png'))
  dismiss(page)
  check('focus returns after locale rebuilt the underlying site',page.evaluate('document.activeElement?.closest("[data-project-card]")?.dataset.projectCard')=='core')
 elif PART in ["cases-en","cases-zh"]:
  # All archive buttons, not only their artwork, use the same detail view.
  for lang in [PART.split('-')[-1]]:
   if page.locator('html').get_attribute('lang')!=('zh-CN' if lang=='zh' else 'en'):page.locator('[data-locale]').click()
   for ident in ['fairy','core','claw','ax','dreambound','webchange','goodnight','tarot','converter']:
    button=page.locator('[data-project-card="'+ident+'"] .project-bottom [data-case]');button.click();settled(page)
    copy=page.locator('.case-article').inner_text()
    check('complete readable case: '+lang+'/'+ident,page.locator('[data-case-section]').count()==5 and len(copy)>(650 if lang=='zh' else 1600),{'characters':len(copy)})
    check('case has source and limitation disclosure: '+lang+'/'+ident,('来源依据' if lang=='zh' else 'Source basis') in copy and ('当前限制' if lang=='zh' else 'Current limits') in copy)
    link_state=page.evaluate("""(id)=>{const d=document.querySelector('#case-dialog');return{
      buttons:d.querySelectorAll('.case-link-btn').length,
      quiet:d.querySelectorAll('.case-link-quiet').length,
      privateNotes:d.querySelectorAll('.case-proof-grid .private-note').length,
      sourceText:[...d.querySelectorAll('.case-link-btn')].map(a=>a.textContent.trim()).join('|'),
      recordText:[...d.querySelectorAll('.case-link-quiet')].map(a=>a.textContent.trim()).join('|')
    }}""",ident)
    if ident in ['core','claw','ax']:
     check('private project shows no external links: '+ident,link_state['buttons']==0 and link_state['quiet']==0 and link_state['privateNotes']==1,link_state)
    elif ident=='fairy':
     check('fairy shows one source link, no demo/download: '+lang,link_state['buttons']==1 and link_state['quiet']==0 and (('项目源码' if lang=='zh' else 'Source code') in link_state['sourceText']),link_state)
    elif ident=='dreambound':
     demo_label='在线演示' if lang=='zh' else 'Live demo'
     rec_label='原项目记录' if lang=='zh' else 'Project record'
     check('dreambound shows one hosted demo plus the record: '+lang+'/'+ident,link_state['buttons']==1 and demo_label in link_state['sourceText'] and link_state['quiet']>=1 and rec_label in link_state['recordText'],link_state)
    else:
     want='原项目记录' if lang=='zh' else 'Project record'
     check('archive shows record only, never source/demo: '+lang+'/'+ident,link_state['buttons']==0 and link_state['quiet']>=1 and want in link_state['recordText'],link_state)
    if ident=='ax' and lang=='zh':page.screenshot(path=str(OUT/'07-ax-top.png'))
    if ident=='dreambound' and lang=='zh':
     check('Dreambound copy keeps the 404 record and states the hosted playable demo','404' in copy and '记忆潮汐' in copy and '可玩演示' in copy)
     page.screenshot(path=str(OUT/'08-dreambound-top.png'))
    dismiss(page)
 elif PART=="edge":
  # Rapid cancellation during entry must not leave a modal or lock behind.
  page.locator('#fairy [data-case]').click();page.keyboard.press('Escape');page.locator('#case-dialog').wait_for(state='hidden')
  check('Escape during opening cleans up',page.evaluate('document.body.style.overflow')=='' and page.locator('#case-dialog').get_attribute('data-phase')=='closed')
  page.locator('#fairy [data-case]').click();settled(page)
  page.evaluate('''()=>{ const d=document.querySelector('#case-dialog'); for(let i=0;i<3;i++)d.querySelector('[data-case-next="core"]').click(); }''')
  settled(page)
  check('rapid next clicks leave one final case and no stale transition',page.locator('#dialog-title').inner_text()=='MojoCore' and page.locator('.case-sheet').count()==1)
  page.mouse.click(20,500);page.locator('#case-dialog').wait_for(state='hidden')
  check('backdrop click runs the close path',page.evaluate('document.body.style.overflow')=='')
  page.locator('[data-evidence]').first.click();settled(page)
  check('source notes still open and scroll inside the reusable sheet','私有源码' in page.locator('#case-dialog').inner_text())
  dismiss(page)
  check('no uncaught script errors in desktop interaction paths',not errors,errors)
 elif PART=="responsive":
  # Real render and keyboard checks at narrow sizes and landscape heights.
  for width,height in [(320,740),(390,844),(768,1024),(844,390)]:
   mobile=browser.new_page(viewport={'width':width,'height':height},is_mobile=True,has_touch=True)
   load(mobile);mobile.locator('[data-locale]').click();mobile.locator('#fairy [data-case]').click();settled(mobile)
   dimensions=mobile.locator('.case-scroll').evaluate('(e)=>({scroll:e.scrollWidth,visible:e.clientWidth})')
   check('case fits viewport '+str(width)+'x'+str(height),dimensions['scroll']<=dimensions['visible']+1,dimensions)
   check('close button remains reachable '+str(width)+'x'+str(height),mobile.locator('.case-close').is_visible())
   if width==390:mobile.screenshot(path=str(OUT/'09-mobile-top.png'))
   jump(mobile,'workflow')
   if width==390:mobile.screenshot(path=str(OUT/'10-mobile-workflow.png'))
   check('mobile internal reading scroll works '+str(width),mobile.locator('.case-scroll').evaluate('(e)=>e.scrollTop')>0)
   dismiss(mobile,method='button');mobile.close()
  reduced=browser.new_page(viewport={'width':1280,'height':900},reduced_motion='reduce');load(reduced)
  reduced.locator('#fairy [data-case]').click();settled(reduced)
  check('OS reduced motion skips the sheet animation',not reduced.locator('#case-dialog').evaluate('(d)=>d.getAnimations({subtree:true}).some(a=>a.playState==="running")'))
  check('reduced-motion content is never hidden for a reveal',all(float(v)==1 for v in reduced.locator('[data-reveal]').evaluate_all('(els)=>els.map(e=>getComputedStyle(e).opacity)')))
  jump(reduced,'build');reduced.locator('[data-glossary-toggle]').click()
  check('reduced motion still opens the glossary',reduced.locator('#case-glossary-body').is_visible())
  dismiss(reduced);reduced.close()
  fallback_ctx=browser.new_context(viewport={'width':1280,'height':900});fallback_ctx.add_init_script('HTMLCanvasElement.prototype.getContext=function(){return null}')
  fallback=fallback_ctx.new_page()
  load(fallback);fallback.locator('#fairy [data-case]').click()
  check('detail animation does not depend on WebGL',fallback.locator('html').get_attribute('data-renderer')=='static' and fallback.locator('#case-dialog').evaluate('(d)=>d.getAnimations().some(a=>a.playState==="running")'))
  settled(fallback);dismiss(fallback);fallback_ctx.close()
 else:
  raise ValueError(PART)
 browser.close()
print(json.dumps({'passed':len(RESULTS),'results':RESULTS},ensure_ascii=False,indent=2))
