import test from 'node:test';import assert from 'node:assert/strict';
import {renderSite}from '../.test-build/views.js';
for(const lang of ['en','zh'])test(`contact replaces title instead of appending footer (${lang})`,()=>{
 const html=renderSite(lang);assert.equal((html.match(/data-contact-stream /g)||[]).length,1);
 const contact=html.slice(html.indexOf('id="contact"'),html.indexOf('</main>'));
 assert.ok(contact.includes('contact-stream-heading'));assert.ok(contact.includes('data-contact-stream-toggle'));
 const footer=html.slice(html.indexOf('<footer'),html.indexOf('</footer>'));
 assert.ok(footer.includes('footer-bar'));assert.ok(!footer.includes('data-text-stream'));
 assert.ok(!html.includes('data-fill="cyan">'+(lang==='en'?"Let’s build":'一起')));
 assert.ok(html.includes('mailto:zmz1998@gmail.com'));assert.ok(html.includes('data-copy'));
});
