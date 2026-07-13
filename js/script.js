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
