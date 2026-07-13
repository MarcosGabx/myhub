const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf-8');
const css = fs.readFileSync(path.join(__dirname, '..', 'css', 'style.css'), 'utf-8');

test('index.html hero has a two-column wrapper: hero__text and hero__visual', () => {
  assert.ok(html.includes('hero__text'));
  assert.ok(html.includes('hero__visual'));
});

test('index.html hero visual contains a decorative, non-executable code mockup', () => {
  assert.ok(html.includes('code-mockup'));
  assert.ok(html.includes('code-mockup__header'));
  assert.ok(html.includes('code-mockup__body'));
});

test('index.html hero visual is marked aria-hidden since it is purely decorative', () => {
  const visualMatch = html.match(/<div class="hero__visual"[^>]*>/);
  assert.ok(visualMatch, 'hero__visual element not found');
  assert.ok(visualMatch[0].includes('aria-hidden="true"'));
});

test('index.html preserves the original hero content inside hero__text', () => {
  assert.ok(html.includes('hero__title'));
  assert.ok(html.includes('hero__tagline'));
  assert.ok(html.includes('hero__description'));
});

test('style.css lays out hero__content as a 2-column grid on desktop', () => {
  const heroContentMatch = css.match(/\.hero__content\s*\{[^}]*\}/);
  assert.ok(heroContentMatch, '.hero__content rule not found');
  assert.ok(heroContentMatch[0].includes('grid-template-columns'));
});

test('style.css collapses hero__content to 1 column under the 768px breakpoint', () => {
  const mediaIndex = css.indexOf('@media (max-width: 768px)');
  assert.ok(mediaIndex !== -1, 'media query not found');
  const mediaBlock = css.slice(mediaIndex);
  assert.ok(mediaBlock.includes('.hero__content'));
  assert.ok(mediaBlock.includes('grid-template-columns: 1fr'));
});
