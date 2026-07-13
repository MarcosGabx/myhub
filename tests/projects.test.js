const test = require('node:test');
const assert = require('node:assert');
const projectsData = require('../js/projects.js');

test('projectsData has exactly 8 projects', () => {
  assert.strictEqual(projectsData.length, 8);
});

test('every project has all required fields', () => {
  const requiredFields = ['title', 'category', 'description', 'image', 'link', 'tags'];
  for (const project of projectsData) {
    for (const field of requiredFields) {
      assert.ok(field in project, `missing "${field}" on project "${project.title}"`);
    }
    assert.ok(Array.isArray(project.tags), `"tags" must be an array on "${project.title}"`);
  }
});

test('every project category is one of the four allowed values', () => {
  const allowed = ['landing', 'sistema', 'ferramenta', 'integracao'];
  for (const project of projectsData) {
    assert.ok(allowed.includes(project.category), `invalid category "${project.category}" on "${project.title}"`);
  }
});

test('each category has exactly 2 projects', () => {
  const allowed = ['landing', 'sistema', 'ferramenta', 'integracao'];
  for (const category of allowed) {
    const count = projectsData.filter((p) => p.category === category).length;
    assert.strictEqual(count, 2, `expected 2 projects in "${category}", got ${count}`);
  }
});
