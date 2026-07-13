const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf-8');
const css = fs.readFileSync(path.join(__dirname, '..', 'css', 'style.css'), 'utf-8');

test('index.html has at least one decorative orb in each main section', () => {
  const sections = ['hero', 'about', 'projects', 'contact'];
  for (const section of sections) {
    const regex = new RegExp(`orb--${section}`);
    assert.ok(regex.test(html), `expected an orb for section "${section}"`);
  }
});

test('orbs are marked aria-hidden so they are ignored by screen readers', () => {
  const orbTags = html.match(/<div class="orb[^"]*"[^>]*>/g) || [];
  assert.ok(orbTags.length > 0, 'no orb elements found');
  for (const tag of orbTags) {
    assert.ok(tag.includes('aria-hidden="true"'), `orb element missing aria-hidden: ${tag}`);
  }
});

test('style.css defines the .orb base styles as absolutely positioned, blurred and non-interactive', () => {
  const orbBlockMatch = css.match(/\.orb\s*\{[^}]*\}/);
  assert.ok(orbBlockMatch, '.orb base rule not found');
  assert.ok(orbBlockMatch[0].includes('position: absolute'));
  assert.ok(orbBlockMatch[0].includes('filter: blur'));
  assert.ok(orbBlockMatch[0].includes('pointer-events: none'));
});

test('style.css contains position: relative and overflow: hidden on the sections that host orbs', () => {
  const sectionBlockMatch = css.match(/\.hero,\s*\.about,\s*\.projects,\s*\.contact\s*\{[^}]*\}/);
  assert.ok(sectionBlockMatch, 'combined section rule for orb containers not found');
  assert.ok(sectionBlockMatch[0].includes('overflow: hidden'));
  assert.ok(sectionBlockMatch[0].includes('position: relative'));
});
