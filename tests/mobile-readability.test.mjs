import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('mobile reading layer ships through both source and offline stylesheets', () => {
  const css = fs.readFileSync('styles/mobile-readability.css', 'utf8');
  const index = fs.readFileSync('index.html', 'utf8');
  assert.equal(index.split('href="./styles/mobile-readability.css"').length - 1, 1);
  assert.match(css, /@media screen and \(max-width: 759px\)/);
  assert.match(css, /#journey :is\(\.hero-copy, \.chapter-copy\)::before/);
  assert.match(css, /pointer-events: none/);
  assert.match(css, /-webkit-backdrop-filter: blur\(10px\)/);
  assert.match(css, /mask-composite: intersect/);
  assert.doesNotMatch(css, /will-change|requestAnimationFrame|animation:/);
});
