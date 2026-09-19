from pathlib import Path
from playwright.sync_api import sync_playwright
import sys
sys.path.insert(0, str(Path(__file__).resolve().parent))
from browser_support import launch_browser, load_page, log_info
with sync_playwright() as p:
 b,binfo=launch_browser(p);log_info(binfo)
 page=b.new_page(viewport={'width':1440,'height':1000})
 load_page(page,wait_until='load',settle_ms=300)
 assert page.locator('html').get_attribute('aria-pressed') is None, 'motion control must not bind to the root state attribute'
 state=page.locator('html').get_attribute('data-motion')
 page.locator('.hero-description').click()
 assert page.locator('html').get_attribute('data-motion')==state, 'ordinary page clicks must not toggle motion'
 page.locator('button[data-motion]').click()
 assert page.locator('html').get_attribute('data-motion')!=state, 'motion button must toggle the real state'
 b.close()
print('Motion control scope: 3 assertions passed')
