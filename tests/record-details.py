"""Record actual Chromium frames and capture timestamps; does not simulate UI motion."""
from playwright.sync_api import sync_playwright
from pathlib import Path
import json,base64,os,sys
sys.path.insert(0, str(Path(__file__).resolve().parent))
from browser_support import launch_browser, load_page, log_info
root=Path(__file__).resolve().parents[1]
out=Path(os.environ.get('DETAIL_CAPTURE',root/'test-artifacts-v21'/'detail-capture'));out.mkdir(parents=True,exist_ok=True)
frames=[]
with sync_playwright() as p:
 b,binfo=launch_browser(p);log_info(binfo)
 page=b.new_page(viewport={'width':1440,'height':1000});load_page(page,settle_ms=400)
 page.locator('[data-locale]').click();page.locator('#fairy').evaluate('(el)=>scrollTo({top:el.offsetTop,behavior:"instant"})');page.wait_for_timeout(1000)
 session=page.context.new_cdp_session(page)
 def capture(ev):
  filename=f'frame-{len(frames):05d}.jpg';(out/filename).write_bytes(base64.b64decode(ev['data']))
  frames.append({'file':filename,'time':ev['metadata']['timestamp']})
  session.send('Page.screencastFrameAck',{'sessionId':ev['sessionId']})
 session.on('Page.screencastFrame',capture)
 session.send('Page.startScreencast',{'format':'jpeg','quality':86,'maxWidth':1280,'maxHeight':900,'everyNthFrame':1})
 page.wait_for_timeout(700)
 page.locator('#fairy [data-case]').click();page.wait_for_timeout(1350)
 page.locator('[data-case-jump="workflow"]').click();page.wait_for_timeout(1800)
 page.locator('[data-case-jump="features"]').click();page.wait_for_timeout(1600)
 page.locator('[data-case-jump="build"]').click();page.wait_for_timeout(1350)
 page.locator('[data-glossary-toggle]').evaluate('(el)=>el.scrollIntoView({block:"center",behavior:"smooth"})');page.wait_for_timeout(750)
 page.locator('[data-glossary-toggle]').click();page.wait_for_timeout(1200)
 page.locator('[data-glossary-toggle]').click();page.wait_for_timeout(650)
 page.locator('.case-close').click();page.wait_for_timeout(700)
 page.locator('#work').evaluate('(el)=>scrollTo({top:el.offsetTop+300,behavior:"instant"})');page.wait_for_timeout(850)
 page.locator('[data-project-card="core"] .project-art').click();page.wait_for_timeout(1250)
 page.locator('[data-case-jump="workflow"]').click();page.wait_for_timeout(1700)
 page.locator('.case-toolbar [data-case-next="claw"]').click();page.wait_for_timeout(1250)
 page.locator('.case-toolbar [data-case-next="ax"]').click();page.wait_for_timeout(1250)
 page.locator('[data-case-locale]').click();page.wait_for_timeout(1200)
 page.locator('.case-close').click();page.wait_for_timeout(600)
 session.send('Page.stopScreencast');page.wait_for_timeout(100)
 b.close()
(out/'frames.json').write_text(json.dumps(frames,indent=2))
lines=[]
for i,f in enumerate(frames):
 lines.append("file '"+f['file']+"'")
 duration=max(.01,frames[i+1]['time']-f['time']) if i+1<len(frames) else .15
 lines.append(f'duration {duration:.6f}')
if frames:lines.append("file '"+frames[-1]['file']+"'")
(out/'frames.txt').write_text('\n'.join(lines)+'\n')
print('Captured',len(frames),'actual frames;',round(frames[-1]['time']-frames[0]['time'],2),'seconds')
