const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf-8');

test('index.html includes all required sections', () => {
  assert.ok(html.includes('id="hero"'));
  assert.ok(html.includes('id="sobre"'));
  assert.ok(html.includes('id="projetos"'));
  assert.ok(html.includes('id="contato"'));
});

test('index.html links css and js files', () => {
  assert.ok(html.includes('css/style.css'));
  assert.ok(html.includes('js/projects.js'));
  assert.ok(html.includes('js/script.js'));
});

test('index.html contains exactly 4 WhatsApp links with the correct number and message', () => {
  const matches = html.match(/https:\/\/wa\.me\/5538984216381\?text=Ol%C3%A1%20Marcos%2C%20vi%20seu%20portf%C3%B3lio%20e%20gostaria%20de%20conversar!/g) || [];
  assert.strictEqual(matches.length, 4, `expected 4 WhatsApp links, found ${matches.length}`);
});

test('index.html has the projects grid, filter container and all 5 filter buttons', () => {
  assert.ok(html.includes('projects__grid'));
  assert.ok(html.includes('projects__filters'));
  assert.ok(html.includes('data-category="all"'));
  assert.ok(html.includes('data-category="landing"'));
  assert.ok(html.includes('data-category="sistema"'));
  assert.ok(html.includes('data-category="ferramenta"'));
  assert.ok(html.includes('data-category="integracao"'));
});

test('index.html has mobile menu toggle and floating WhatsApp button hooks', () => {
  assert.ok(html.includes('header__toggle'));
  assert.ok(html.includes('header__nav'));
  assert.ok(html.includes('whatsapp-float'));
});
