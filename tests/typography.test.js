const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf-8');
const css = fs.readFileSync(path.join(__dirname, '..', 'css', 'style.css'), 'utf-8');

test('index.html no longer loads Space Grotesk from Google Fonts', () => {
  assert.ok(!html.includes('Space+Grotesk'));
  assert.ok(html.includes('family=Inter'));
});

test('style.css defines the heading font as a system monospace stack', () => {
  assert.ok(css.includes('--font-heading:'));
  const rootMatch = css.match(/:root\s*\{[^}]*\}/);
  assert.ok(rootMatch, ':root block not found');
  assert.ok(rootMatch[0].includes('ui-monospace'));
});

test('style.css applies the heading font to headings and title elements', () => {
  const headingRuleMatch = css.match(/h1,\s*h2,\s*h3,[^{]*\{[^}]*\}/);
  assert.ok(headingRuleMatch, 'heading font rule not found');
  assert.ok(headingRuleMatch[0].includes('var(--font-heading)'));
});

test('style.css defines the logo-derived blue/cyan accent palette', () => {
  const rootMatch = css.match(/:root\s*\{[^}]*\}/);
  assert.ok(rootMatch, ':root block not found');
  assert.ok(rootMatch[0].includes('#0dc0d2'));
  assert.ok(rootMatch[0].includes('--accent-dim:'));
});

test('style.css has no leftover references to the old green or amber accent colors', () => {
  assert.ok(!css.includes('#00e6a8'));
  assert.ok(!css.includes('rgba(0, 230, 168'));
  assert.ok(!css.includes('#ffb454'));
  assert.ok(!css.includes('rgba(255, 180, 84'));
});
