# Portfolio Visual Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the existing portfolio site (`index.html`, `css/style.css`, `js/script.js`) to match the approved visual redesign spec — decorative background orbs, a two-column Hero with a static code-window mockup, category icons on project cards, and a second heading font — without changing any existing section, data, or the WhatsApp contact flow.

**Architecture:** Same as before — plain HTML/CSS/JS, no build step. Each task is an additive, self-contained visual change layered onto the already-implemented, already-tested site (18 passing tests from the prior plan). Every task keeps those 18 tests green and adds its own new/updated tests.

**Tech Stack:** HTML5, CSS3 (Grid, custom properties, media queries), vanilla JS, Node.js `node:test` + `node:assert` (already in use, no new dependency).

## Global Constraints

- The 6 existing sections (Header, Hero, Sobre, Projetos, Contato, Footer) are unchanged in content and meaning — this is a visual restyle only.
- No build step, no npm dependencies. The only new external resource is the Space Grotesk Google Fonts family, added alongside the existing Inter link.
- Project data, categories (`landing`, `sistema`, `ferramenta`, `integracao`), and the WhatsApp URL (`https://wa.me/5538984216381?text=Ol%C3%A1%20Marcos%2C%20vi%20seu%20portf%C3%B3lio%20e%20gostaria%20de%20conversar!`, exactly 4 touchpoints) must not change.
- Background orbs are static decoration — no animation, no JS, `aria-hidden="true"`, `pointer-events: none`.
- The code mockup in the Hero is static, non-executable decorative markup, `aria-hidden="true"`.
- Project cards keep their existing image — the category icon is added alongside it, not a replacement.
- The `{palavra}` curly-brace headline highlight style from the reference image is explicitly out of scope — do not add it.
- All 18 existing tests (`tests/projects.test.js`, `tests/script.test.js`, `tests/index.test.js`, `tests/style.test.js`) must keep passing after every task.

---

### Task 1: Space Grotesk heading font

**Files:**
- Modify: `index.html` (Google Fonts link, currently line 10)
- Modify: `css/style.css` (add `--font-heading` and apply it to headings)
- Test: `tests/typography.test.js`

**Interfaces:**
- Consumes: nothing.
- Produces: CSS custom property `--font-heading` (value `'Space Grotesk', sans-serif`) applied to `h1, h2, h3, .hero__title, .section__title, .header__logo`. No later task depends on this directly, but Task 3's new hero markup will inherit it automatically through `.hero__title`.

- [ ] **Step 1: Write the failing test**

Create `tests/typography.test.js`:

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/typography.test.js`
Expected: FAIL — `ENOENT` (css/html read still works, but assertions fail since Space Grotesk isn't referenced yet)

- [ ] **Step 3: Add the Google Fonts link**

Modify `index.html`: replace this line (currently line 10):

```html
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
```

with:

```html
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
```

- [ ] **Step 4: Add the heading font variable and rule**

Modify `css/style.css`: in the `:root` block, add `--font-heading` after `--accent`:

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

Then add this new rule directly after the existing `a { ... }` rule (before `.section__title`):

```css
h1, h2, h3,
.hero__title,
.section__title,
.header__logo {
  font-family: var(--font-heading);
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `node --test tests/typography.test.js`
Expected: PASS — 3 tests passing, 0 failing

- [ ] **Step 6: Run the full suite to confirm no regression**

Run: `node --test "tests/*.test.js"`
Expected: PASS — 21 tests passing (18 existing + 3 new), 0 failing

- [ ] **Step 7: Commit**

```bash
git add index.html css/style.css tests/typography.test.js
git commit -m "feat: add Space Grotesk heading font"
```

---

### Task 2: Decorative background orbs

**Files:**
- Modify: `index.html` (add orb `<div>` elements inside `.hero`, `.about`, `.projects`, `.contact`)
- Modify: `css/style.css` (`.orb` base styles, per-section positioning, `overflow: hidden` on host sections)
- Test: `tests/orbs.test.js`

**Interfaces:**
- Consumes: nothing.
- Produces: `.orb` class and per-orb modifier classes (`orb--hero-1`, `orb--hero-2`, `orb--about-1`, `orb--projects-1`, `orb--contact-1`, `orb--contact-2`) that Task 3 must not remove when it restructures the Hero — it only wraps `.hero__content`'s existing children, the two hero orb `<div>`s stay as direct children of `<section id="hero">` alongside `.hero__content`.

- [ ] **Step 1: Write the failing test**

Create `tests/orbs.test.js`:

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/orbs.test.js`
Expected: FAIL — none of the `orb--*` classes or `.orb` rule exist yet

- [ ] **Step 3: Add the orb elements to index.html**

Modify `index.html`. Insert orb `<div>`s as the first children of each of the four sections, immediately after the opening section tag:

```html
    <section id="hero" class="hero">
      <div class="orb orb--hero-1" aria-hidden="true"></div>
      <div class="orb orb--hero-2" aria-hidden="true"></div>
      <div class="hero__content">
```

```html
    <section id="sobre" class="about">
      <div class="orb orb--about-1" aria-hidden="true"></div>
      <h2 class="section__title">Sobre</h2>
```

```html
    <section id="projetos" class="projects">
      <div class="orb orb--projects-1" aria-hidden="true"></div>
      <h2 class="section__title">Projetos</h2>
```

```html
    <section id="contato" class="contact">
      <div class="orb orb--contact-1" aria-hidden="true"></div>
      <div class="orb orb--contact-2" aria-hidden="true"></div>
      <h2 class="section__title">Vamos conversar?</h2>
```

Do not change anything else in these sections — only insert the orb `<div>`s at the top of each, leaving every other line (including the closing tags) exactly as they are.

- [ ] **Step 4: Add orb styles to style.css**

Modify `css/style.css`: add this block immediately before the closing `@media (max-width: 768px) { ... }` block at the end of the file:

```css
.hero,
.about,
.projects,
.contact {
  position: relative;
  overflow: hidden;
}

.hero__content,
.about > *,
.projects > *,
.contact > * {
  position: relative;
  z-index: 1;
}

.orb {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, var(--accent) 0%, transparent 70%);
  filter: blur(80px);
  opacity: 0.2;
  pointer-events: none;
  z-index: 0;
}

.orb--hero-1 {
  width: 420px;
  height: 420px;
  top: -120px;
  right: -100px;
}

.orb--hero-2 {
  width: 320px;
  height: 320px;
  bottom: -80px;
  left: -80px;
}

.orb--about-1 {
  width: 300px;
  height: 300px;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
}

.orb--projects-1 {
  width: 360px;
  height: 360px;
  bottom: -140px;
  right: -100px;
}

.orb--contact-1 {
  width: 280px;
  height: 280px;
  top: -80px;
  left: -60px;
}

.orb--contact-2 {
  width: 280px;
  height: 280px;
  bottom: -100px;
  right: -60px;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `node --test tests/orbs.test.js`
Expected: PASS — 4 tests passing, 0 failing

- [ ] **Step 6: Run the full suite to confirm no regression**

Run: `node --test "tests/*.test.js"`
Expected: PASS — 25 tests passing (21 from Task 1 + 4 new), 0 failing

- [ ] **Step 7: Commit**

```bash
git add index.html css/style.css tests/orbs.test.js
git commit -m "feat: add decorative background orbs to main sections"
```

---

### Task 3: Hero two-column layout with code mockup

**Files:**
- Modify: `index.html` (restructure the Hero's `.hero__content` into `.hero__text` + `.hero__visual`)
- Modify: `css/style.css` (grid layout for `.hero__content`, `.code-mockup` styles, mobile stacking)
- Test: `tests/hero-mockup.test.js`

**Interfaces:**
- Consumes: the two hero orb `<div>`s from Task 2 (`orb--hero-1`, `orb--hero-2`), which stay untouched as siblings of `.hero__content`.
- Produces: `.hero__text`, `.hero__visual`, `.code-mockup` (and its child classes) — no later task depends on these.

- [ ] **Step 1: Write the failing test**

Create `tests/hero-mockup.test.js`:

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/hero-mockup.test.js`
Expected: FAIL — `hero__text`/`hero__visual`/`code-mockup` don't exist yet

- [ ] **Step 3: Restructure the Hero markup**

Modify `index.html`: replace the Hero section's inner content (the `.hero__content` div and everything inside it — leave the two `orb` divs from Task 2 immediately above it untouched) with:

```html
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
```

- [ ] **Step 4: Update Hero and add code-mockup styles**

Modify `css/style.css`: replace the existing `.hero` and `.hero__content` rules with:

```css
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--header-height) 1.5rem 2rem;
}

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

Keep the existing `.hero__title`, `.hero__tagline`, `.hero__description` rules as they are, and add these new rules right after `.hero__description`:

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

Then, inside the existing `@media (max-width: 768px) { ... }` block, add these rules (anywhere inside the block, before its closing `}`):

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

- [ ] **Step 5: Run test to verify it passes**

Run: `node --test tests/hero-mockup.test.js`
Expected: PASS — 6 tests passing, 0 failing

- [ ] **Step 6: Run the full suite to confirm no regression**

Run: `node --test "tests/*.test.js"`
Expected: PASS — 31 tests passing (25 from Task 2 + 6 new), 0 failing

- [ ] **Step 7: Commit**

```bash
git add index.html css/style.css tests/hero-mockup.test.js
git commit -m "feat: restructure hero into 2 columns with a code mockup"
```

---

### Task 4: Category icons on project cards

**Files:**
- Modify: `js/script.js` (add `categoryIcons` map, update `createProjectCard`)
- Modify: `css/style.css` (`.project-card__header`, `.project-card__icon` styles)
- Modify: `tests/script.test.js` (add icon assertions)

**Interfaces:**
- Consumes: `project.category` (one of `landing`, `sistema`, `ferramenta`, `integracao`, already validated by Task 1 of the original plan).
- Produces: no change to `createProjectCard`'s exported signature — same function name, same export. `categoryIcons` is a module-internal constant, not exported (nothing outside `js/script.js` needs it directly).

- [ ] **Step 1: Write the failing test**

Modify `tests/script.test.js`: add these two tests after the existing `createProjectCard includes title, description and tags` test:

```js
test('createProjectCard includes the category icon svg', () => {
  const html = createProjectCard(sampleProjects[0]);
  assert.ok(html.includes('project-card__icon'));
  assert.ok(html.includes('<svg'));
});

test('createProjectCard renders a different icon markup for each of the four categories', () => {
  const categories = ['landing', 'sistema', 'ferramenta', 'integracao'];
  const icons = categories.map((category) =>
    createProjectCard({ ...sampleProjects[0], category })
  );
  const uniqueIcons = new Set(icons.map((html) => html.match(/<svg[\s\S]*?<\/svg>/)[0]));
  assert.strictEqual(uniqueIcons.size, 4, 'expected 4 distinct icon markups, one per category');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/script.test.js`
Expected: FAIL — `project-card__icon` not found in the generated HTML

- [ ] **Step 3: Add the category icon map and update createProjectCard**

Modify `js/script.js`: add this constant directly above the existing `function createProjectCard(project) {` line:

```js
const categoryIcons = {
  landing: '<svg class="project-card__icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/></svg>',
  sistema: '<svg class="project-card__icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5"/><path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"/></svg>',
  ferramenta: '<svg class="project-card__icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.1 2.1-2-2z"/></svg>',
  integracao: '<svg class="project-card__icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 3v6M15 3v6M6 9h12l-1 5a5 5 0 0 1-10 0z"/><path d="M12 17v4"/></svg>',
};
```

Then replace the existing `createProjectCard` function body with:

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

- [ ] **Step 4: Add card header/icon styles**

Modify `css/style.css`: replace the existing `.project-card__title` rule with:

```css
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
```

- [ ] **Step 5: Run test to verify it passes**

Run: `node --test tests/script.test.js`
Expected: PASS — 6 tests passing, 0 failing (4 existing + 2 new)

- [ ] **Step 6: Run the full suite to confirm no regression**

Run: `node --test "tests/*.test.js"`
Expected: PASS — 33 tests passing (31 from Task 3 + 2 new), 0 failing

- [ ] **Step 7: Manual browser check**

Run: open `index.html` in a browser.

Verify:
- Each of the 8 project cards shows a small icon next to its title, and the icon differs by category (4 distinct shapes across the 4 categories).
- The Hero shows two columns on desktop (text left, tilted code window right) and stacks to one column on narrow widths.
- The background orbs are visible but subtle, don't cause horizontal scrolling, and don't sit on top of readable text.
- Headings (site title in header, "Marcos Guedes" in Hero, section titles) render in a visibly different, more geometric typeface than the body text.

If no GUI browser is available in your environment, say so explicitly in your report and instead do a static trace: confirm `.project-card__icon` styles exist, confirm no CSS `overflow-x` issue by checking the orbs' widths against typical viewport sizes, and run `node -c js/script.js` to confirm valid syntax.

- [ ] **Step 8: Commit**

```bash
git add js/script.js css/style.css tests/script.test.js
git commit -m "feat: add category icons to project cards"
```

---

## Plan Self-Review Notes

- **Spec coverage:** Space Grotesk heading font → Task 1; background orbs on all 4 sections → Task 2; Hero 2-column layout + code mockup → Task 3; project card category icons alongside existing image → Task 4. All 4 spec requirements have a corresponding task. Out-of-scope items (`{palavra}` highlight, client logo strip, multi-column footer, animated orbs) are not implemented anywhere in this plan.
- **Placeholder scan:** no TBD/TODO; every step has complete code or an exact command with expected output.
- **Type/name consistency:** `createProjectCard` keeps its existing name and export; `categoryIcons` is introduced once (Task 4) and used only there; `.orb`/`orb--*` classes introduced in Task 2 are referenced correctly (untouched) in Task 3's brief; CSS custom property `--font-heading` introduced in Task 1 is not redefined elsewhere.
