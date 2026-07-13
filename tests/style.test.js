const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const css = fs.readFileSync(path.join(__dirname, '..', 'css', 'style.css'), 'utf-8');

test('style.css defines the dark theme custom properties', () => {
  assert.ok(css.includes('--bg:'));
  assert.ok(css.includes('--accent:'));
  assert.ok(css.includes('--text:'));
});

test('style.css has a 768px responsive breakpoint', () => {
  assert.ok(css.includes('@media (max-width: 768px)'));
});

test('style.css styles the interactive state classes toggled by JS', () => {
  assert.ok(css.includes('.filter-btn--active'));
  assert.ok(css.includes('.header__nav--open'));
});

test('style.css styles the project card structure produced by createProjectCard', () => {
  assert.ok(css.includes('.project-card'));
  assert.ok(css.includes('.project-card__image'));
  assert.ok(css.includes('.project-card__title'));
});

test('style.css styles the new CAT/STACK labels on project cards', () => {
  assert.ok(css.includes('.project-card__cat'));
  assert.ok(css.includes('.project-card__stack'));
});

test('style.css positions the floating WhatsApp button as fixed', () => {
  const floatBlockMatch = css.match(/\.whatsapp-float\s*\{[^}]*\}/);
  assert.ok(floatBlockMatch, '.whatsapp-float rule not found');
  assert.ok(floatBlockMatch[0].includes('position: fixed'));
});
