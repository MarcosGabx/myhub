# Portfolio Terminal Amber Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current green/Space-Grotesk visual identity with the approved "Terminal Amber" identity — amber palette, monospace headings, a single terminal-shell Hero (replacing the 2-column Hero + code-mockup), and project cards reformatted with CAT/STACK labels and corner brackets (keeping the existing image thumbnail).

**Architecture:** Same static site, no build step. Three tasks, each touching a self-contained slice: (1) global color/typography tokens, (2) the Hero markup+styles, (3) the project-card markup+styles. Each task keeps the pre-existing 33 tests green (adjusting the specific tests whose asserted behavior this redesign intentionally changes) and adds its own tests.

**Tech Stack:** HTML5, CSS3 (custom properties, pseudo-elements, media queries), vanilla JS, Node.js `node:test` + `node:assert` (already in use).

## Global Constraints

- The 6 existing sections (Header, Hero, Sobre, Projetos, Contato, Footer) keep their content and meaning — only the visual skin, the Hero's internal structure, and the project card's internal structure change.
- No build step, no npm dependencies. The Space Grotesk Google Fonts family is removed (no longer needed — headings use a system monospace stack); Inter stays for body text.
- Filter buttons keep their current Portuguese text labels — do NOT turn them into command-flag style (explicit user decision).
- Project cards keep the existing image thumbnail (`project.image`) — do NOT remove it (explicit user decision). The category SVG icon (added in a prior redesign) IS removed — replaced by the `CAT · <label>` text line.
- The scanline texture is scoped to the Hero section only — do not add it globally.
- The terminal cursor's blink animation must respect `prefers-reduced-motion: reduce`.
- Every WhatsApp link (`https://wa.me/5538984216381?text=Ol%C3%A1%20Marcos%2C%20vi%20seu%20portf%C3%B3lio%20e%20gostaria%20de%20conversar!`, exactly 4 touchpoints) and the project category values (`landing`, `sistema`, `ferramenta`, `integracao`) do not change.
- All currently-passing tests must keep passing, except the specific assertions this redesign deliberately invalidates (Space Grotesk presence, code-mockup presence, category icon presence) — those get rewritten in the task that changes the behavior they tested, not silently deleted elsewhere.

---

### Task 1: Amber palette and monospace headings

**Files:**
- Modify: `index.html` (Google Fonts link, currently line 10)
- Modify: `css/style.css` (`:root` variables, two hardcoded shadow colors)
- Modify: `tests/typography.test.js` (full rewrite)

**Interfaces:**
- Consumes: nothing.
- Produces: `--accent: #ffb454`, `--accent-dim: #cc8c34`, `--font-heading: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace`. Task 2 and Task 3 both use `--accent`, `--accent-dim`, and `--font-heading` by these exact names — do not rename them.

- [ ] **Step 1: Write the failing test**

Replace the entire contents of `tests/typography.test.js` with:

```js
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

test('style.css defines the amber accent palette', () => {
  const rootMatch = css.match(/:root\s*\{[^}]*\}/);
  assert.ok(rootMatch, ':root block not found');
  assert.ok(rootMatch[0].includes('#ffb454'));
  assert.ok(rootMatch[0].includes('--accent-dim:'));
});

test('style.css has no leftover references to the old green accent color', () => {
  assert.ok(!css.includes('#00e6a8'));
  assert.ok(!css.includes('rgba(0, 230, 168'));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/typography.test.js`
Expected: FAIL — Space Grotesk is still present, `--accent-dim` and `#ffb454` don't exist yet

- [ ] **Step 3: Remove the Space Grotesk font link**

Modify `index.html`: replace this line (currently line 10):

```html
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
```

with:

```html
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
```

- [ ] **Step 4: Update the root color and font variables**

Modify `css/style.css`: replace the `:root` block (currently lines 1-10):

```css
:root {
  --bg: #0b0f14;
  --bg-alt: #121821;
  --text: #e6edf3;
  --text-muted: #8b949e;
  --accent: #00e6a8;
  --font-heading: 'Space Grotesk', sans-serif;
  --border: #21262d;
  --header-height: 64px;
}
```

with:

```css
:root {
  --bg: #0a0908;
  --bg-alt: #16130f;
  --text: #f2ece1;
  --text-muted: #8a8175;
  --accent: #ffb454;
  --accent-dim: #cc8c34;
  --font-heading: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  --border: #2a2419;
  --header-height: 64px;
}
```

- [ ] **Step 5: Fix the two hardcoded shadow colors**

Modify `css/style.css`: in the `.btn--primary:hover` rule, replace:

```css
  box-shadow: 0 8px 20px rgba(0, 230, 168, 0.3);
```

with:

```css
  box-shadow: 0 8px 20px rgba(255, 180, 84, 0.3);
```

In the `.whatsapp-float` rule, replace:

```css
  box-shadow: 0 8px 20px rgba(0, 230, 168, 0.35);
```

with:

```css
  box-shadow: 0 8px 20px rgba(255, 180, 84, 0.35);
```

- [ ] **Step 6: Run test to verify it passes**

Run: `node --test tests/typography.test.js`
Expected: PASS — 5 tests passing, 0 failing

- [ ] **Step 7: Run the full suite to confirm no unexpected regression**

Run: `node --test "tests/*.test.js"`
Expected: 33 pre-existing tests minus the 3 old typography tests, plus the 5 new ones = 35 tests passing. `tests/hero-mockup.test.js` may show failures at this point (it still checks for things unrelated to color/font, so it should be unaffected — if it fails, read the failure carefully: it must only be about content this task didn't touch, since Task 1 does not modify Hero markup or the code-mockup CSS).

- [ ] **Step 8: Commit**

```bash
git add index.html css/style.css tests/typography.test.js
git commit -m "feat: switch to amber palette and monospace heading font"
```

---

### Task 2: Hero terminal shell

**Files:**
- Modify: `index.html` (replace the Hero's inner content)
- Modify: `css/style.css` (replace Hero/code-mockup rules with terminal rules, add scanline texture)
- Delete: `tests/hero-mockup.test.js`
- Create: `tests/hero-terminal.test.js`

**Interfaces:**
- Consumes: `--accent`, `--accent-dim`, `--font-heading` from Task 1. Consumes the two pre-existing hero orb divs (`orb--hero-1`, `orb--hero-2`) and the pre-existing combined rule `.hero, .about, .projects, .contact { position: relative; overflow: hidden; }` — do not touch either.
- Produces: `.terminal`, `.terminal__titlebar`, `.terminal__dot(--red|--yellow|--green)`, `.terminal__path`, `.terminal__body`, `.terminal__line`, `.terminal__comment`, `.terminal__cursor`, `.terminal__btn`. No later task depends on these class names.

- [ ] **Step 1: Write the failing test**

Delete `tests/hero-mockup.test.js` entirely (it tests the 2-column code-mockup layout this task removes).

Create `tests/hero-terminal.test.js`:

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/hero-terminal.test.js`
Expected: FAIL — none of the `terminal__*` classes exist yet, `.code-mockup` still present

- [ ] **Step 3: Replace the Hero's inner markup**

Modify `index.html`: the Hero section currently looks like this (the two orb divs stay exactly as they are — only the `.hero__content` div and everything inside it changes):

```html
    <section id="hero" class="hero">
      <div class="orb orb--hero-1" aria-hidden="true"></div>
      <div class="orb orb--hero-2" aria-hidden="true"></div>
      <div class="hero__content">
        <div class="hero__text">
          <h1 class="hero__title">Marcos Guedes</h1>
          <p class="hero__tagline">Desenvolvedor Full Stack</p>
          <p class="hero__description">Crio landing pages, sistemas, ferramentas de gerenciamento e integrações sob medida para o seu negócio.</p>
          <a href="https://wa.me/5538984216381?text=Ol%C3%A1%20Marcos%2C%20vi%20seu%20portf%C3%B3lio%20e%20gostaria%20de%20conversar!" class="btn btn--primary" target="_blank" rel="noopener noreferrer">Falar no WhatsApp</a>
        </div>
        <div class="hero__visual" aria-hidden="true">
          <div class="code-mockup">
            <div class="code-mockup__header">
              <span class="code-mockup__dot code-mockup__dot--red"></span>
              <span class="code-mockup__dot code-mockup__dot--yellow"></span>
              <span class="code-mockup__dot code-mockup__dot--green"></span>
            </div>
            <pre class="code-mockup__body"><code><span class="code-mockup__keyword">function</span> <span class="code-mockup__fn">buildPortfolio</span>() {
  <span class="code-mockup__keyword">const</span> stack = [<span class="code-mockup__string">'JavaScript'</span>, <span class="code-mockup__string">'Node.js'</span>, <span class="code-mockup__string">'React'</span>];
  <span class="code-mockup__comment">// sempre pronto pro próximo projeto</span>
  <span class="code-mockup__keyword">return</span> stack.map(build);
}</code></pre>
          </div>
        </div>
      </div>
    </section>
```

Replace only the `.hero__content` div and everything inside it (keep the two `orb` divs above it exactly as they are, and keep the closing `</section>` tag) with:

```html
      <div class="hero__content">
        <div class="terminal">
          <div class="terminal__titlebar">
            <span class="terminal__dot terminal__dot--red"></span>
            <span class="terminal__dot terminal__dot--yellow"></span>
            <span class="terminal__dot terminal__dot--green"></span>
            <span class="terminal__path">marcos@portfolio — zsh</span>
          </div>
          <div class="terminal__body">
            <p class="terminal__line"><span class="terminal__prompt">➜</span> whoami</p>
            <h1 class="hero__title">Marcos Guedes<span class="terminal__cursor" aria-hidden="true"></span></h1>
            <p class="hero__tagline">Desenvolvedor Full Stack</p>
            <p class="terminal__comment"># Crio landing pages, sistemas, ferramentas de gerenciamento e integrações sob medida para o seu negócio.</p>
            <a href="https://wa.me/5538984216381?text=Ol%C3%A1%20Marcos%2C%20vi%20seu%20portf%C3%B3lio%20e%20gostaria%20de%20conversar!" class="terminal__btn" target="_blank" rel="noopener noreferrer">$ contact --whatsapp</a>
          </div>
        </div>
      </div>
```

- [ ] **Step 4: Replace the Hero CSS and remove the old code-mockup rules**

Modify `css/style.css`: replace the `.hero__content` rule (currently right after `.hero { ... }`):

```css
.hero__content {
  max-width: 1100px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  text-align: left;
}
```

with:

```css
.hero__content {
  max-width: 640px;
  width: 100%;
  text-align: center;
}

.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background-image: repeating-linear-gradient(
    0deg,
    rgba(255, 255, 255, 0.015) 0px,
    rgba(255, 255, 255, 0.015) 1px,
    transparent 1px,
    transparent 3px
  );
}
```

Then delete these rules entirely (they belonged to the removed 2-column layout and code mockup):

```css
.hero__text {
  max-width: 480px;
}

.hero__visual {
  display: flex;
  justify-content: center;
}

.code-mockup {
  width: 100%;
  max-width: 420px;
  background: var(--bg-alt);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  transform: rotate(-2deg);
}

.code-mockup__header {
  display: flex;
  gap: 6px;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid var(--border);
}

.code-mockup__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.code-mockup__dot--red { background: #ff5f56; }
.code-mockup__dot--yellow { background: #ffbd2e; }
.code-mockup__dot--green { background: #27c93f; }

.code-mockup__body {
  padding: 1.25rem;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  line-height: 1.7;
  color: var(--text-muted);
  overflow-x: auto;
}

.code-mockup__keyword { color: var(--accent); }
.code-mockup__fn { color: #7ee7ff; }
.code-mockup__string { color: #f4c95d; }
.code-mockup__comment { color: var(--text-muted); font-style: italic; }
```

In their place, add the new terminal rules:

```css
.terminal {
  width: 100%;
  background: var(--bg-alt);
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
  text-align: left;
}

.terminal__titlebar {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.7rem 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid var(--border);
}

.terminal__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.terminal__dot--red { background: #ff5f56; }
.terminal__dot--yellow { background: #ffbd2e; }
.terminal__dot--green { background: #27c93f; }

.terminal__path {
  margin-left: 0.75rem;
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.terminal__body {
  padding: 2rem 1.75rem 2.25rem;
}

.terminal__line {
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 0.95rem;
  color: var(--accent-dim);
  margin-bottom: 0.6rem;
}

.terminal__comment {
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  color: var(--text-muted);
  font-size: 0.9rem;
  margin: 1rem 0 0;
  line-height: 1.6;
}

.terminal__cursor {
  display: inline-block;
  width: 8px;
  height: 1.1em;
  background: var(--accent);
  vertical-align: text-bottom;
  margin-left: 4px;
  animation: terminal-blink 1.1s steps(1) infinite;
}

@keyframes terminal-blink {
  50% { opacity: 0; }
}

.terminal__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding: 0.65rem 1.1rem;
  background: rgba(255, 180, 84, 0.1);
  border: 1px solid var(--accent-dim);
  border-radius: 6px;
  color: var(--accent);
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 0.9rem;
}
```

Then, inside the existing `@media (max-width: 768px) { ... }` block, replace these lines (which referenced the now-removed 2-column layout):

```css
  .hero__content {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .hero__text {
    max-width: 100%;
    margin: 0 auto;
  }

  .hero__visual {
    margin-top: 2rem;
  }

  .code-mockup {
    max-width: 320px;
    transform: none;
  }
```

with:

```css
  .terminal__body {
    padding: 1.5rem 1.25rem 1.75rem;
  }
```

Finally, add the `prefers-reduced-motion` override anywhere after the `@keyframes terminal-blink` rule (not inside the existing 768px media query — this is a separate, unrelated media feature):

```css
@media (prefers-reduced-motion: reduce) {
  .terminal__cursor {
    animation: none;
  }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `node --test tests/hero-terminal.test.js`
Expected: PASS — 9 tests passing, 0 failing

- [ ] **Step 6: Run the full suite to confirm no regression**

Run: `node --test "tests/*.test.js"`
Expected: PASS — 38 tests passing (35 from Task 1, minus 6 deleted hero-mockup tests, plus 9 new hero-terminal tests), 0 failing

- [ ] **Step 7: Commit**

```bash
git add index.html css/style.css tests/hero-mockup.test.js tests/hero-terminal.test.js
git commit -m "feat: replace 2-column hero with a terminal shell"
```

---

### Task 3: Structured project cards (CAT/STACK labels)

**Files:**
- Modify: `js/script.js` (replace `categoryIcons` with `categoryLabels`, rewrite `createProjectCard`)
- Modify: `css/style.css` (replace project-card rules)
- Modify: `tests/script.test.js` (replace icon-related tests with CAT/STACK tests)
- Modify: `tests/style.test.js` (add one test for the new card label classes)

**Interfaces:**
- Consumes: `--accent`, `--font-heading` from Task 1.
- Produces: no change to `createProjectCard`'s exported name (still exported via `module.exports = { filterProjects, createProjectCard }`). `categoryLabels` replaces `categoryIcons` as the module-internal category lookup — nothing outside `js/script.js` references either by name.

- [ ] **Step 1: Write the failing test**

Replace the entire contents of `tests/script.test.js` with:

```js
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

test('createProjectCard includes title, description, category label and stack line', () => {
  const html = createProjectCard(sampleProjects[0]);
  assert.ok(html.includes('A'));
  assert.ok(html.includes('desc a'));
  assert.ok(html.includes('CAT · Landing Page'));
  assert.ok(html.includes('STACK · HTML'));
  assert.ok(html.includes('data-category="landing"'));
});

test('createProjectCard maps each of the four categories to a distinct human-readable label', () => {
  const categories = {
    landing: 'Landing Page',
    sistema: 'Sistema',
    ferramenta: 'Ferramenta',
    integracao: 'Integração',
  };
  for (const [category, label] of Object.entries(categories)) {
    const html = createProjectCard({ ...sampleProjects[0], category });
    assert.ok(html.includes(`CAT · ${label}`), `expected label "${label}" for category "${category}"`);
  }
});

test('createProjectCard no longer renders a category icon or tag pills', () => {
  const html = createProjectCard(sampleProjects[0]);
  assert.ok(!html.includes('project-card__icon'));
  assert.ok(!html.includes('project-card__tags'));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/script.test.js`
Expected: FAIL — `CAT · Landing Page` and `STACK · HTML` are not in the current output

- [ ] **Step 3: Rewrite categoryIcons/createProjectCard in script.js**

Modify `js/script.js`: replace the `categoryIcons` constant:

```js
const categoryIcons = {
  landing: '<svg class="project-card__icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/></svg>',
  sistema: '<svg class="project-card__icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5"/><path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"/></svg>',
  ferramenta: '<svg class="project-card__icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.1 2.1-2-2z"/></svg>',
  integracao: '<svg class="project-card__icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 3v6M15 3v6M6 9h12l-1 5a5 5 0 0 1-10 0z"/><path d="M12 17v4"/></svg>',
};
```

with:

```js
const categoryLabels = {
  landing: 'Landing Page',
  sistema: 'Sistema',
  ferramenta: 'Ferramenta',
  integracao: 'Integração',
};
```

Then replace the `createProjectCard` function body:

```js
function createProjectCard(project) {
  const tagsHtml = project.tags
    .map((tag) => `<span class="tag">${tag}</span>`)
    .join('');
  const iconHtml = categoryIcons[project.category] || '';

  return `
    <article class="project-card" data-category="${project.category}">
      <img src="${project.image}" alt="${project.title}" class="project-card__image">
      <div class="project-card__body">
        <div class="project-card__header">
          ${iconHtml}
          <h3 class="project-card__title">${project.title}</h3>
        </div>
        <p class="project-card__description">${project.description}</p>
        <div class="project-card__tags">${tagsHtml}</div>
        <a href="${project.link}" class="project-card__link" target="_blank" rel="noopener noreferrer">Ver projeto →</a>
      </div>
    </article>
  `;
}
```

with:

```js
function createProjectCard(project) {
  const catLabel = categoryLabels[project.category] || project.category;
  const stackLine = project.tags.join(' / ');

  return `
    <article class="project-card" data-category="${project.category}">
      <span class="project-card__corner--bl" aria-hidden="true"></span>
      <span class="project-card__corner--br" aria-hidden="true"></span>
      <img src="${project.image}" alt="${project.title}" class="project-card__image">
      <div class="project-card__body">
        <div class="project-card__cat">CAT · ${catLabel}</div>
        <h3 class="project-card__title">${project.title}</h3>
        <p class="project-card__description">${project.description}</p>
        <div class="project-card__stack">STACK · ${stackLine}</div>
        <a href="${project.link}" class="project-card__link" target="_blank" rel="noopener noreferrer">Ver projeto →</a>
      </div>
    </article>
  `;
}
```

`filterProjects`, `renderProjects`, `initFilterButtons`, `initMobileMenu`, `init`, and the `DOMContentLoaded`/`module.exports` guards are untouched by this task.

- [ ] **Step 4: Replace the project-card CSS**

Modify `css/style.css`: replace this whole block (from `.project-card {` through the closing brace of `.project-card__link { ... }`, right before `.contact {`):

```css
.project-card {
  background: var(--bg-alt);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.project-card__image {
  width: 100%;
  display: block;
}

.project-card__body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.project-card__header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.project-card__header .project-card__title {
  margin-bottom: 0;
}

.project-card__icon {
  flex-shrink: 0;
  color: var(--accent);
}

.project-card__title {
  font-size: 1.1rem;
}

.project-card__description {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-bottom: 1rem;
  flex: 1;
}

.project-card__tags {
  margin-bottom: 1rem;
}

.project-card__link {
  color: var(--accent);
  font-weight: 600;
  font-size: 0.9rem;
}
```

with:

```css
.project-card {
  position: relative;
  background: var(--bg-alt);
  border: 1px solid var(--border);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.project-card::before,
.project-card::after {
  content: '';
  position: absolute;
  width: 10px;
  height: 10px;
  border-color: var(--accent);
  border-style: solid;
  z-index: 1;
}

.project-card::before { top: -1px; left: -1px; border-width: 1.5px 0 0 1.5px; }
.project-card::after { top: -1px; right: -1px; border-width: 1.5px 1.5px 0 0; }

.project-card__corner--bl,
.project-card__corner--br {
  position: absolute;
  width: 10px;
  height: 10px;
  border-color: var(--accent);
  border-style: solid;
  z-index: 1;
}

.project-card__corner--bl { bottom: -1px; left: -1px; border-width: 0 0 1.5px 1.5px; }
.project-card__corner--br { bottom: -1px; right: -1px; border-width: 0 1.5px 1.5px 0; }

.project-card__image {
  width: 100%;
  display: block;
}

.project-card__body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.project-card__cat {
  font-family: var(--font-heading);
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 0.4rem;
}

.project-card__title {
  font-size: 1.05rem;
  margin-bottom: 0.5rem;
}

.project-card__description {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-bottom: 1rem;
  flex: 1;
}

.project-card__stack {
  font-family: var(--font-heading);
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
}

.project-card__link {
  color: var(--accent);
  font-weight: 600;
  font-size: 0.9rem;
}
```

Note: `.project-card__title` no longer needs an explicit `font-family` — it's an `<h3>` element, already covered by the existing global rule `h1, h2, h3, .hero__title, .section__title, .header__logo { font-family: var(--font-heading); }`.

- [ ] **Step 5: Add the card-label CSS test**

Modify `tests/style.test.js`: add this test after the existing `style.css styles the project card structure produced by createProjectCard` test:

```js
test('style.css styles the new CAT/STACK labels on project cards', () => {
  assert.ok(css.includes('.project-card__cat'));
  assert.ok(css.includes('.project-card__stack'));
});
```

- [ ] **Step 6: Run test to verify it passes**

Run: `node --test tests/script.test.js`
Expected: PASS — 6 tests passing, 0 failing

Run: `node --test tests/style.test.js`
Expected: PASS — 6 tests passing, 0 failing

- [ ] **Step 7: Run the full suite to confirm no regression**

Run: `node --test "tests/*.test.js"`
Expected: PASS — 39 tests passing (38 from Task 2, script.test.js stays at 6 tests net, style.test.js gains 1), 0 failing

- [ ] **Step 8: Manual browser check**

Run: open `index.html` in a browser.

Verify:
- The Hero renders as a single terminal window (title bar with 3 dots, `whoami` prompt, blinking cursor after the name, amber-colored role line, comment-style description, `$ contact --whatsapp` button).
- All 8 project cards show square corner brackets, a `CAT · <categoria>` line, the image thumbnail still on top, and a `STACK · ...` line instead of pill tags.
- Everything that used to be teal/green (buttons, active filter, floating WhatsApp button, bolhas de fundo) is now amber.
- Headings (site title, hero name, section titles, card titles) render in a monospace typeface.
- The terminal cursor blinks subtly; if you have "reduce motion" enabled at the OS level, it should stay static instead.

If no GUI browser is available in your environment, say so explicitly in your report and instead do a static trace: run `node -c js/script.js` to confirm valid syntax, and confirm by reading the files that every class referenced in the new HTML (`terminal__*`, `project-card__corner--*`, `project-card__cat`, `project-card__stack`) has a matching CSS rule.

- [ ] **Step 9: Commit**

```bash
git add js/script.js css/style.css tests/script.test.js tests/style.test.js
git commit -m "feat: restyle project cards with CAT/STACK labels and corner brackets"
```

---

## Plan Self-Review Notes

- **Spec coverage:** amber palette + monospace headings + Space Grotesk removal → Task 1; terminal Hero + scanline + reduced-motion cursor → Task 2; CAT/STACK cards with image kept and icon removed → Task 3. Filter-button labels and image-thumbnail retention (both explicit user decisions to NOT change) are covered by omission — no task touches `projects__filters` button text or removes `project.image`/`project-card__image`.
- **Placeholder scan:** no TBD/TODO; every step has complete code or an exact command with expected output.
- **Type/name consistency:** `categoryLabels` (Task 3) replaces `categoryIcons` cleanly — no leftover references. `--accent`, `--accent-dim`, `--font-heading` (Task 1) are consumed by name in Tasks 2 and 3 without renaming. `createProjectCard`/`filterProjects` exports unchanged throughout.
