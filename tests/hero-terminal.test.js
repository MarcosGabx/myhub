const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf-8');
const css = fs.readFileSync(path.join(__dirname, '..', 'css', 'style.css'), 'utf-8');

test('index.html hero renders a terminal shell with title bar and body', () => {
  assert.ok(html.includes('terminal__titlebar'));
  assert.ok(html.includes('terminal__body'));
});

test('index.html hero terminal has 3 title-bar dots', () => {
  const dotMatches = html.match(/terminal__dot--(red|yellow|green)/g) || [];
  assert.strictEqual(dotMatches.length, 3);
});

test('index.html hero terminal shows a whoami prompt and a blinking cursor', () => {
  assert.ok(html.includes('whoami'));
  assert.ok(html.includes('terminal__cursor'));
});

test('index.html preserves the original hero title and tagline inside the terminal', () => {
  assert.ok(html.includes('hero__title'));
  assert.ok(html.includes('hero__tagline'));
  assert.ok(html.includes('Marcos Guedes'));
  assert.ok(html.includes('Desenvolvedor Full Stack'));
});

test('index.html hero description is formatted as a code comment', () => {
  assert.ok(html.includes('# Crio landing pages'));
});

test('index.html no longer contains the old code-mockup markup', () => {
  assert.ok(!html.includes('code-mockup'));
  assert.ok(!html.includes('hero__visual'));
});

test('style.css gives the terminal cursor a blink animation that respects prefers-reduced-motion', () => {
  assert.ok(css.includes('.terminal__cursor'));
  assert.ok(css.includes('@keyframes'));
  const reducedMotionMatch = css.match(/@media \(prefers-reduced-motion: reduce\)\s*\{[^}]*\}/);
  assert.ok(reducedMotionMatch, 'prefers-reduced-motion override not found');
  assert.ok(reducedMotionMatch[0].includes('.terminal__cursor'));
});

test('style.css adds a scanline texture scoped to the hero section only', () => {
  const heroBeforeMatch = css.match(/\.hero::before\s*\{[^}]*\}/);
  assert.ok(heroBeforeMatch, '.hero::before rule not found');
  assert.ok(heroBeforeMatch[0].includes('repeating-linear-gradient'));
});

test('style.css removes the old code-mockup styles', () => {
  assert.ok(!css.includes('.code-mockup'));
});
