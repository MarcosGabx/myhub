function filterProjects(projects, category) {
  if (category === 'all') return projects;
  return projects.filter((project) => project.category === category);
}

const categoryIcons = {
  landing: '<svg class="project-card__icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/></svg>',
  sistema: '<svg class="project-card__icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5"/><path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"/></svg>',
  ferramenta: '<svg class="project-card__icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.1 2.1-2-2z"/></svg>',
  integracao: '<svg class="project-card__icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 3v6M15 3v6M6 9h12l-1 5a5 5 0 0 1-10 0z"/><path d="M12 17v4"/></svg>',
};

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
