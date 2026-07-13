const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf-8');
const css = fs.readFileSync(path.join(__dirname, '..', 'css', 'style.css'), 'utf-8');

test('index.html loads Space Grotesk from Google Fonts', () => {
  assert.ok(html.includes('Space+Grotesk'));
});

test('style.css defines a heading font variable using Space Grotesk', () => {
  assert.ok(css.includes('--font-heading:'));
  assert.ok(css.includes('Space Grotesk'));
});

test('style.css applies the heading font to headings and title elements', () => {
  const headingRuleMatch = css.match(/h1,\s*h2,\s*h3,[^{]*\{[^}]*\}/);
  assert.ok(headingRuleMatch, 'heading font rule not found');
  assert.ok(headingRuleMatch[0].includes('var(--font-heading)'));
});
