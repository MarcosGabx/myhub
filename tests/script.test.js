const test = require('node:test');
const assert = require('node:assert');
const { filterProjects, createProjectCard } = require('../js/script.js');

const sampleProjects = [
  { title: 'A', category: 'landing', description: 'desc a', image: 'a.svg', link: '#', tags: ['HTML'] },
  { title: 'B', category: 'sistema', description: 'desc b', image: 'b.svg', link: '#', tags: ['Node.js'] },
];

test('filterProjects returns all projects when category is "all"', () => {
  const result = filterProjects(sampleProjects, 'all');
  assert.strictEqual(result.length, 2);
});

test('filterProjects returns only matching category', () => {
  const result = filterProjects(sampleProjects, 'landing');
  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].title, 'A');
});

test('filterProjects returns empty array when no project matches', () => {
  const result = filterProjects(sampleProjects, 'ferramenta');
  assert.strictEqual(result.length, 0);
});

test('createProjectCard includes title, description and tags', () => {
  const html = createProjectCard(sampleProjects[0]);
  assert.ok(html.includes('A'));
  assert.ok(html.includes('desc a'));
  assert.ok(html.includes('HTML'));
  assert.ok(html.includes('data-category="landing"'));
});
