# Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static one-page portfolio site for Marcos Guedes showcasing development projects (landing pages, systems, management tools, integrations) with WhatsApp as the sole contact channel.

**Architecture:** Plain HTML/CSS/JS, no build step, no runtime dependencies. Project data lives in a single JS array (`js/projects.js`) consumed by pure rendering/filtering functions in `js/script.js`, which are unit-tested with Node's built-in test runner (`node --test`) since they have no DOM dependency. HTML structure and CSS are verified with lightweight string-based structural tests (reading the file and asserting on required substrings/selectors), plus a manual browser checklist for visual/interactive behavior that can't be reasonably automated without adding a testing framework.

**Tech Stack:** HTML5, CSS3 (custom properties, Grid, Flexbox, media queries), vanilla JS (ES2017+), Node.js `node:test` + `node:assert` for unit/structural tests (Node is already available in this environment — confirmed `v24.14.0`, no install needed).

## Global Constraints

- No build step, no npm dependencies. The only external resource allowed is the Google Fonts stylesheet link for "Inter" (per spec), with a system-font fallback.
- Mobile-first responsive design; breakpoint at 768px.
- Every contact touchpoint (header, hero, floating button, contact section) must link to exactly: `https://wa.me/5538984216381?text=Ol%C3%A1%20Marcos%2C%20vi%20seu%20portf%C3%B3lio%20e%20gostaria%20de%20conversar!`
- No contact form, no backend, no multi-page navigation — everything lives in `index.html` with anchor links.
- Valid project categories are exactly: `landing`, `sistema`, `ferramenta`, `integracao`.
- Dark tech visual style: dark background, one vibrant accent color, modern sans-serif type.

---

### Task 1: Project data and placeholder asset

**Files:**
- Create: `js/projects.js`
- Create: `assets/placeholder.svg`
- Test: `tests/projects.test.js`

**Interfaces:**
- Consumes: nothing.
- Produces: `projectsData` — an array of 8 objects, each shaped `{ title: string, category: 'landing'|'sistema'|'ferramenta'|'integracao', description: string, image: string, link: string, tags: string[] }`. Exported via `module.exports` for Node/testing; available as a global `const projectsData` in the browser (classic `<script>` tag, no bundler). Exactly 2 objects per category. Later tasks (Task 5) read this global directly.

- [ ] **Step 1: Write the failing test**

Create `tests/projects.test.js`:

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/projects.test.js`
Expected: FAIL — `Cannot find module '../js/projects.js'`

- [ ] **Step 3: Create the placeholder asset**

Create `assets/placeholder.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240">
  <rect width="400" height="240" fill="#121821"/>
  <rect x="1" y="1" width="398" height="238" fill="none" stroke="#21262d" stroke-width="2"/>
  <text x="200" y="128" font-family="sans-serif" font-size="20" fill="#8b949e" text-anchor="middle">Preview do projeto</text>
</svg>
```

- [ ] **Step 4: Write the projects data**

Create `js/projects.js`:

```js
const projectsData = [
  {
    title: 'Landing Page — Lançamento de Produto',
    category: 'landing',
    description: 'Página de alta conversão para lançamento de produto, com seções de benefícios, depoimentos e chamada para ação.',
    image: 'assets/placeholder.svg',
    link: '#',
    tags: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    title: 'Landing Page — Captura de Leads',
    category: 'landing',
    description: 'Landing page otimizada para captura de leads via formulário integrado a serviço de e-mail marketing.',
    image: 'assets/placeholder.svg',
    link: '#',
    tags: ['HTML', 'CSS', 'Formspree'],
  },
  {
    title: 'Sistema de Gestão de Estoque',
    category: 'sistema',
    description: 'Sistema web para controle de entrada, saída e níveis de estoque, com relatórios e alertas automáticos.',
    image: 'assets/placeholder.svg',
    link: '#',
    tags: ['Node.js', 'Express', 'PostgreSQL'],
  },
  {
    title: 'Sistema de Agendamento Online',
    category: 'sistema',
    description: 'Plataforma de agendamento de horários com confirmação automática e notificações por e-mail.',
    image: 'assets/placeholder.svg',
    link: '#',
    tags: ['React', 'Node.js', 'MongoDB'],
  },
  {
    title: 'Painel de Controle Financeiro',
    category: 'ferramenta',
    description: 'Dashboard para acompanhamento de receitas, despesas e fluxo de caixa em tempo real.',
    image: 'assets/placeholder.svg',
    link: '#',
    tags: ['React', 'Chart.js', 'Node.js'],
  },
  {
    title: 'Ferramenta de Gerenciamento de Tarefas',
    category: 'ferramenta',
    description: 'Aplicação estilo Kanban para organização de tarefas em equipe, com quadros e prazos.',
    image: 'assets/placeholder.svg',
    link: '#',
    tags: ['React', 'Firebase'],
  },
  {
    title: 'Integração com API de Pagamentos',
    category: 'integracao',
    description: 'Integração de checkout com gateway de pagamentos, incluindo webhooks para confirmação automática.',
    image: 'assets/placeholder.svg',
    link: '#',
    tags: ['Node.js', 'Stripe API'],
  },
  {
    title: 'Integração entre CRM e WhatsApp',
    category: 'integracao',
    description: 'Automação que sincroniza conversas do WhatsApp Business com o CRM da empresa em tempo real.',
    image: 'assets/placeholder.svg',
    link: '#',
    tags: ['Node.js', 'WhatsApp API', 'Webhooks'],
  },
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = projectsData;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `node --test tests/projects.test.js`
Expected: PASS — 4 tests passing, 0 failing

- [ ] **Step 6: Commit**

```bash
git add js/projects.js assets/placeholder.svg tests/projects.test.js
git commit -m "feat: add project data and placeholder asset"
```

---

### Task 2: Pure filter and card-rendering logic

**Files:**
- Create: `js/script.js`
- Test: `tests/script.test.js`

**Interfaces:**
- Consumes: nothing (test uses inline sample data, not `projectsData`, to stay isolated from Task 1).
- Produces: `filterProjects(projects, category)` → returns filtered array (`'all'` returns input unchanged). `createProjectCard(project)` → returns an HTML string. Both exported via `module.exports = { filterProjects, createProjectCard }`. Task 5 will import/use these by name (both in Node tests and, implicitly, by defining them in the same script.js the browser loads).

- [ ] **Step 1: Write the failing test**

Create `tests/script.test.js`:

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

test('createProjectCard includes title, description and tags', () => {
  const html = createProjectCard(sampleProjects[0]);
  assert.ok(html.includes('A'));
  assert.ok(html.includes('desc a'));
  assert.ok(html.includes('HTML'));
  assert.ok(html.includes('data-category="landing"'));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/script.test.js`
Expected: FAIL — `Cannot find module '../js/script.js'`

- [ ] **Step 3: Write the minimal implementation**

Create `js/script.js`:

```js
function filterProjects(projects, category) {
  if (category === 'all') return projects;
  return projects.filter((project) => project.category === category);
}

function createProjectCard(project) {
  const tagsHtml = project.tags
    .map((tag) => `<span class="tag">${tag}</span>`)
    .join('');

  return `
    <article class="project-card" data-category="${project.category}">
      <img src="${project.image}" alt="${project.title}" class="project-card__image">
      <div class="project-card__body">
        <h3 class="project-card__title">${project.title}</h3>
        <p class="project-card__description">${project.description}</p>
        <div class="project-card__tags">${tagsHtml}</div>
        <a href="${project.link}" class="project-card__link" target="_blank" rel="noopener noreferrer">Ver projeto →</a>
      </div>
    </article>
  `;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { filterProjects, createProjectCard };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/script.test.js`
Expected: PASS — 4 tests passing, 0 failing

- [ ] **Step 5: Commit**

```bash
git add js/script.js tests/script.test.js
git commit -m "feat: add pure project filter and card rendering logic"
```

---

### Task 3: HTML page structure

**Files:**
- Create: `index.html`
- Test: `tests/index.test.js`

**Interfaces:**
- Consumes: nothing (references `css/style.css`, `js/projects.js`, `js/script.js` by path only — their contents aren't required for this task's tests).
- Produces: page markup with these exact hooks that later tasks depend on: section ids `#hero`, `#sobre`, `#projetos`, `#contato`; `.projects__grid` (empty container Task 5 fills), `.projects__filters` with `.filter-btn[data-category]` for `all`, `landing`, `sistema`, `ferramenta`, `integracao`; `.header__toggle` and `.header__nav` (mobile menu, styled in Task 4, wired in Task 5); `.whatsapp-float` (floating button). Exactly 4 links to the WhatsApp URL (header, hero, contact section, floating button).

- [ ] **Step 1: Write the failing test**

Create `tests/index.test.js`:

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/index.test.js`
Expected: FAIL — `ENOENT: no such file or directory, open '.../index.html'`

- [ ] **Step 3: Write the HTML structure**

Create `index.html`:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Marcos Guedes — Desenvolvedor</title>
  <meta name="description" content="Portfólio de Marcos Guedes: landing pages, sistemas, ferramentas de gerenciamento e integrações.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <header class="header">
    <div class="header__inner">
      <a href="#hero" class="header__logo">Marcos Guedes</a>
      <nav class="header__nav">
        <a href="#hero">Início</a>
        <a href="#sobre">Sobre</a>
        <a href="#projetos">Projetos</a>
        <a href="#contato">Contato</a>
        <a href="https://wa.me/5538984216381?text=Ol%C3%A1%20Marcos%2C%20vi%20seu%20portf%C3%B3lio%20e%20gostaria%20de%20conversar!" class="header__whatsapp" target="_blank" rel="noopener noreferrer">WhatsApp</a>
      </nav>
      <button class="header__toggle" aria-label="Abrir menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>

  <main>
    <section id="hero" class="hero">
      <div class="hero__content">
        <h1 class="hero__title">Marcos Guedes</h1>
        <p class="hero__tagline">Desenvolvedor Full Stack</p>
        <p class="hero__description">Crio landing pages, sistemas, ferramentas de gerenciamento e integrações sob medida para o seu negócio.</p>
        <a href="https://wa.me/5538984216381?text=Ol%C3%A1%20Marcos%2C%20vi%20seu%20portf%C3%B3lio%20e%20gostaria%20de%20conversar!" class="btn btn--primary" target="_blank" rel="noopener noreferrer">Falar no WhatsApp</a>
      </div>
    </section>

    <section id="sobre" class="about">
      <h2 class="section__title">Sobre</h2>
      <p class="about__bio">Desenvolvedor com experiência em construir soluções web completas, do front-end ao back-end, incluindo integrações entre sistemas e ferramentas de gerenciamento sob medida.</p>
      <div class="about__stack">
        <span class="tag">JavaScript</span>
        <span class="tag">Node.js</span>
        <span class="tag">React</span>
        <span class="tag">HTML/CSS</span>
        <span class="tag">APIs REST</span>
        <span class="tag">Bancos de Dados</span>
      </div>
    </section>

    <section id="projetos" class="projects">
      <h2 class="section__title">Projetos</h2>
      <div class="projects__filters">
        <button class="filter-btn filter-btn--active" data-category="all">Todos</button>
        <button class="filter-btn" data-category="landing">Landing Pages</button>
        <button class="filter-btn" data-category="sistema">Sistemas</button>
        <button class="filter-btn" data-category="ferramenta">Ferramentas</button>
        <button class="filter-btn" data-category="integracao">Integrações</button>
      </div>
      <div class="projects__grid"></div>
    </section>

    <section id="contato" class="contact">
      <h2 class="section__title">Vamos conversar?</h2>
      <p class="contact__text">Tem um projeto em mente? Fale comigo diretamente pelo WhatsApp.</p>
      <a href="https://wa.me/5538984216381?text=Ol%C3%A1%20Marcos%2C%20vi%20seu%20portf%C3%B3lio%20e%20gostaria%20de%20conversar!" class="btn btn--primary" target="_blank" rel="noopener noreferrer">Falar no WhatsApp</a>
    </section>
  </main>

  <footer class="footer">
    <p>&copy; 2026 Marcos Guedes. Todos os direitos reservados.</p>
  </footer>

  <a href="https://wa.me/5538984216381?text=Ol%C3%A1%20Marcos%2C%20vi%20seu%20portf%C3%B3lio%20e%20gostaria%20de%20conversar!" class="whatsapp-float" target="_blank" rel="noopener noreferrer" aria-label="Falar no WhatsApp">
    <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor" aria-hidden="true"><path d="M16 0C7.16 0 0 7.16 0 16c0 2.82.74 5.47 2.03 7.76L0 32l8.46-2.22A15.9 15.9 0 0 0 16 32c8.84 0 16-7.16 16-16S24.84 0 16 0zm0 29.09c-2.49 0-4.83-.68-6.84-1.87l-.49-.29-5.02 1.32 1.34-4.9-.32-.5A13.03 13.03 0 0 1 2.91 16C2.91 8.78 8.78 2.91 16 2.91S29.09 8.78 29.09 16 23.22 29.09 16 29.09zm7.17-9.8c-.39-.2-2.31-1.14-2.67-1.27-.36-.13-.62-.2-.88.2-.26.39-1.01 1.27-1.24 1.53-.23.26-.46.29-.85.1-.39-.2-1.63-.6-3.11-1.92-1.15-1.02-1.92-2.29-2.15-2.68-.23-.39-.02-.6.17-.8.18-.18.39-.46.59-.69.2-.23.26-.39.39-.65.13-.26.07-.49-.03-.69-.1-.2-.88-2.12-1.21-2.9-.32-.76-.64-.66-.88-.67-.23-.01-.49-.01-.75-.01-.26 0-.69.1-1.05.49-.36.39-1.37 1.34-1.37 3.26 0 1.92 1.4 3.78 1.6 4.04.2.26 2.76 4.21 6.69 5.9.94.4 1.67.65 2.24.83.94.3 1.8.26 2.48.16.76-.11 2.31-.94 2.63-1.85.33-.91.33-1.69.23-1.85-.1-.16-.36-.26-.75-.46z"/></svg>
  </a>

  <script src="js/projects.js"></script>
  <script src="js/script.js"></script>
</body>
</html>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/index.test.js`
Expected: PASS — 5 tests passing, 0 failing

- [ ] **Step 5: Commit**

```bash
git add index.html tests/index.test.js
git commit -m "feat: add portfolio page HTML structure"
```

---

### Task 4: Dark tech styling and responsive layout

**Files:**
- Create: `css/style.css`
- Test: `tests/style.test.js`

**Interfaces:**
- Consumes: class/id hooks from Task 3 (`.header`, `.header__nav`, `.header__toggle`, `.hero`, `.about`, `.projects`, `.projects__grid`, `.filter-btn`, `.contact`, `.footer`, `.whatsapp-float`, `.btn--primary`, `.tag`).
- Produces: `--accent`, `--bg`, `--bg-alt`, `--text`, `--text-muted`, `--border` custom properties; `.filter-btn--active` and `.header__nav--open` state classes that Task 5's JS toggles; `@media (max-width: 768px)` responsive rules; `.project-card`, `.project-card__image`, `.project-card__body`, `.project-card__title`, `.project-card__description`, `.project-card__tags`, `.project-card__link` classes matching the markup `createProjectCard` (Task 2) generates.

- [ ] **Step 1: Write the failing test**

Create `tests/style.test.js`:

```js
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

test('style.css positions the floating WhatsApp button as fixed', () => {
  const floatBlockMatch = css.match(/\.whatsapp-float\s*\{[^}]*\}/);
  assert.ok(floatBlockMatch, '.whatsapp-float rule not found');
  assert.ok(floatBlockMatch[0].includes('position: fixed'));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/style.test.js`
Expected: FAIL — `ENOENT: no such file or directory, open '.../css/style.css'`

- [ ] **Step 3: Write the stylesheet**

Create `css/style.css`:

```css
:root {
  --bg: #0b0f14;
  --bg-alt: #121821;
  --text: #e6edf3;
  --text-muted: #8b949e;
  --accent: #00e6a8;
  --border: #21262d;
  --header-height: 64px;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
}

a {
  color: inherit;
  text-decoration: none;
}

.section__title {
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
}

.btn {
  display: inline-block;
  padding: 0.85rem 1.75rem;
  border-radius: 8px;
  font-weight: 600;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn--primary {
  background: var(--accent);
  color: var(--bg);
}

.btn--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 230, 168, 0.3);
}

.tag {
  display: inline-block;
  padding: 0.3rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0.25rem;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  background: rgba(11, 15, 20, 0.9);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border);
  z-index: 100;
}

.header__inner {
  max-width: 1100px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
}

.header__logo {
  font-weight: 700;
  font-size: 1.1rem;
}

.header__nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.header__nav a:hover {
  color: var(--accent);
}

.header__whatsapp {
  border: 1px solid var(--accent);
  border-radius: 6px;
  padding: 0.4rem 0.9rem;
  color: var(--accent) !important;
}

.header__toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
}

.header__toggle span {
  width: 24px;
  height: 2px;
  background: var(--text);
}

.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--header-height) 1.5rem 2rem;
}

.hero__content {
  max-width: 640px;
}

.hero__title {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.hero__tagline {
  font-size: 1.25rem;
  color: var(--accent);
  margin-bottom: 1rem;
}

.hero__description {
  color: var(--text-muted);
  margin-bottom: 2rem;
}

.about {
  max-width: 800px;
  margin: 0 auto;
  padding: 5rem 1.5rem;
  text-align: center;
}

.about__bio {
  color: var(--text-muted);
  margin-bottom: 1.5rem;
}

.about__stack {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.projects {
  max-width: 1100px;
  margin: 0 auto;
  padding: 5rem 1.5rem;
}

.projects__filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 2.5rem;
}

.filter-btn {
  background: var(--bg-alt);
  border: 1px solid var(--border);
  color: var(--text-muted);
  padding: 0.5rem 1.25rem;
  border-radius: 999px;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  color: var(--text);
}

.filter-btn--active {
  background: var(--accent);
  color: var(--bg);
  border-color: var(--accent);
}

.projects__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

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

.project-card__title {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
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

.contact {
  max-width: 640px;
  margin: 0 auto;
  padding: 5rem 1.5rem;
  text-align: center;
}

.contact__text {
  color: var(--text-muted);
  margin-bottom: 2rem;
}

.footer {
  text-align: center;
  padding: 2rem 1.5rem;
  border-top: 1px solid var(--border);
  color: var(--text-muted);
  font-size: 0.85rem;
}

.whatsapp-float {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  width: 56px;
  height: 56px;
  background: var(--accent);
  color: var(--bg);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(0, 230, 168, 0.35);
  z-index: 100;
}

@media (max-width: 768px) {
  .header__nav {
    position: fixed;
    top: var(--header-height);
    left: 0;
    right: 0;
    background: var(--bg);
    border-bottom: 1px solid var(--border);
    flex-direction: column;
    align-items: flex-start;
    padding: 1.5rem;
    gap: 1rem;
    transform: translateY(-150%);
    transition: transform 0.25s ease;
  }

  .header__nav--open {
    transform: translateY(0);
  }

  .header__toggle {
    display: flex;
  }

  .hero__title {
    font-size: 2.2rem;
  }

  .projects__grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/style.test.js`
Expected: PASS — 5 tests passing, 0 failing

- [ ] **Step 5: Commit**

```bash
git add css/style.css tests/style.test.js
git commit -m "feat: add dark tech responsive stylesheet"
```

---

### Task 5: Wire up rendering, filtering and mobile menu

**Files:**
- Modify: `js/script.js` (add DOM-wiring functions above the existing `module.exports` guard)

**Interfaces:**
- Consumes: `projectsData` (global, from Task 1's `js/projects.js`), `filterProjects`/`createProjectCard` (same-file, from Task 2), DOM hooks `.projects__grid`, `.projects__filters`, `.filter-btn[data-category]`, `.header__toggle`, `.header__nav` (from Task 3), state classes `.filter-btn--active`/`.header__nav--open` (styled in Task 4).
- Produces: a working page — no further tasks depend on this one's internals.

- [ ] **Step 1: Add DOM-wiring functions to script.js**

Modify `js/script.js`: insert the following block after `createProjectCard`'s closing brace and before the existing `if (typeof module !== 'undefined' && module.exports) { ... }` guard, so the final file reads:

```js
function filterProjects(projects, category) {
  if (category === 'all') return projects;
  return projects.filter((project) => project.category === category);
}

function createProjectCard(project) {
  const tagsHtml = project.tags
    .map((tag) => `<span class="tag">${tag}</span>`)
    .join('');

  return `
    <article class="project-card" data-category="${project.category}">
      <img src="${project.image}" alt="${project.title}" class="project-card__image">
      <div class="project-card__body">
        <h3 class="project-card__title">${project.title}</h3>
        <p class="project-card__description">${project.description}</p>
        <div class="project-card__tags">${tagsHtml}</div>
        <a href="${project.link}" class="project-card__link" target="_blank" rel="noopener noreferrer">Ver projeto →</a>
      </div>
    </article>
  `;
}

function renderProjects(projects, container) {
  container.innerHTML = projects.map(createProjectCard).join('');
}

function initFilterButtons(projects, container, filtersContainer) {
  const buttons = filtersContainer.querySelectorAll('.filter-btn');
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('filter-btn--active'));
      button.classList.add('filter-btn--active');
      const category = button.dataset.category;
      renderProjects(filterProjects(projects, category), container);
    });
  });
}

function initMobileMenu() {
  const toggle = document.querySelector('.header__toggle');
  const nav = document.querySelector('.header__nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('header__nav--open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
}

function init() {
  const grid = document.querySelector('.projects__grid');
  const filters = document.querySelector('.projects__filters');

  if (grid && filters && typeof projectsData !== 'undefined') {
    renderProjects(projectsData, grid);
    initFilterButtons(projectsData, grid, filters);
  }

  initMobileMenu();
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', init);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { filterProjects, createProjectCard };
}
```

- [ ] **Step 2: Run the existing unit tests to confirm no regression**

Run: `node --test tests/`
Expected: PASS — all tests from Tasks 1-4 still pass (the new DOM-wiring code is guarded by `typeof document !== 'undefined'`, so it doesn't execute under Node and can't break the pure-function tests).

- [ ] **Step 3: Manual browser integration check**

Run: open `index.html` directly in a browser (double-click the file, or `start index.html` on Windows).

Verify, checking each item:
- All 8 project cards render under the "Todos" filter on page load.
- Clicking "Landing Pages" shows exactly 2 cards; same for "Sistemas", "Ferramentas", "Integrações"; clicking "Todos" again restores all 8.
- The clicked filter button visually highlights as active (accent background) and the previous one un-highlights.
- Resize the browser (or open DevTools device toolbar) to under 768px width: the nav links disappear behind the hamburger icon, and clicking the hamburger slides the menu open/closed.
- The round floating WhatsApp button is visible in the bottom-right corner on both desktop and mobile widths, and clicking any WhatsApp link (header, hero, contact, floating button) opens `https://wa.me/5538984216381` with the pre-filled message in a new tab.
- Open the browser DevTools console: confirm there are no errors logged.

- [ ] **Step 4: Commit**

```bash
git add js/script.js
git commit -m "feat: wire up project rendering, category filter and mobile menu"
```

---

## Plan Self-Review Notes

- **Spec coverage:** header/hero/about/projects+filter/contact/footer/floating button → Tasks 3-5; data model → Task 1; WhatsApp link (exact URL, 4 touchpoints) → Task 3 test; dark tech style + responsive breakpoint → Task 4; testing approach (manual + automated where feasible) → every task's test step + Task 5 Step 3. All spec sections have a corresponding task.
- **Placeholder scan:** no TBD/TODO markers; every step has complete, runnable code or an exact command with expected output.
- **Type/name consistency:** `projectsData`, `filterProjects`, `createProjectCard`, `renderProjects`, `initFilterButtons`, `initMobileMenu`, `init` are spelled identically everywhere they're defined, exported, tested, and consumed across Tasks 1, 2, and 5.
