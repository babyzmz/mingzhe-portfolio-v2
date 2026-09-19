"""Regression: a persisted pagehide must not permanently destroy rendering.
Dispatches lifecycle events in a real page; not a browser-cache navigation test.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import sys
sys.path.insert(0, str(Path(__file__).resolve().parent))
from browser_support import launch_browser, load_page, log_info
with sync_playwright() as p:
 b,binfo=launch_browser(p);log_info(binfo)
 page=b.new_page(viewport={'width':1280,'height':800})
 load_page(page,wait_until='load',settle_ms=500)
 z=float(page.locator('canvas').get_attribute('data-camera-z'))
 page.evaluate("dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true}));dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}))")
 page.locator('#core').evaluate('(el)=>scrollTo({top:el.offsetTop,behavior:"instant"})');page.wait_for_timeout(1200)
 after=float(page.locator('canvas').get_attribute('data-camera-z'))
 assert after<z-20, f'restored page must continue rendering: {z} -> {after}'
 b.close()
print('Persisted lifecycle event handling: passed')
