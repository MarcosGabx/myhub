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
