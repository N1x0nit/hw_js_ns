import { initHeader } from './header.js';
import { initQuote } from './quote.js';
import { initSubscribeForm } from './subscribe.js';
import { openExerciseModal } from './modal.js';
import { getFavorites, removeFavorite } from './storage.js';
import { renderPagination } from './pagination.js';

const PAGE_SIZE = 10;
let currentPage = 1;

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initQuote();
  initSubscribeForm();
  renderFavorites();
});

function renderFavorites() {
  const container = document.getElementById('favorites-content');
  if (!container) return;

  const all = getFavorites();

  if (!all.length) {
    container.innerHTML = `
      <div class="favorites-empty">
        <p class="favorites-empty__text">
          It appears that you haven't added any exercises to your favorites yet.
          To get started, you can add exercises that you like to your favorites for easier access in the future.
        </p>
      </div>
    `;
    return;
  }

  const totalPages = Math.ceil(all.length / PAGE_SIZE);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = all.slice(start, start + PAGE_SIZE);

  container.innerHTML = `
    <div class="favorites-grid" id="favorites-grid">
      ${pageItems.map(createFavCard).join('')}
    </div>
    <div class="pagination" id="favorites-pagination"></div>
  `;

  const paginationEl = container.querySelector('#favorites-pagination');
  renderPagination(paginationEl, {
    currentPage,
    totalPages,
    onPageClick: page => {
      currentPage = page;
      renderFavorites();
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
  });

  const grid = container.querySelector('#favorites-grid');

  grid.addEventListener('click', e => {
    const deleteBtn = e.target.closest('.fav-card__delete');
    if (deleteBtn) {
      e.stopPropagation();
      removeFavorite(deleteBtn.dataset.id);
      const remaining = getFavorites();
      const newTotalPages = Math.ceil(remaining.length / PAGE_SIZE);
      if (currentPage > newTotalPages && currentPage > 1) currentPage = newTotalPages || 1;
      renderFavorites();
      return;
    }

    const card = e.target.closest('.fav-card');
    if (card) {
      openExerciseModal(card.dataset.id);
    }
  });
}

function createFavCard(ex) {
  return `
    <div class="fav-card" data-id="${ex._id}" role="button" tabindex="0" aria-label="Open ${ex.name}">
      <div class="fav-card__top">
        <div class="fav-card__badge-wrap">
          <span class="exercise-card__badge">Workout</span>
          <button
            class="fav-card__delete"
            type="button"
            data-id="${ex._id}"
            aria-label="Remove ${ex.name} from favorites"
          >
            <svg width="16" height="16" aria-hidden="true"><use href="./images/icons.svg#icon-trash"></use></svg>
          </button>
        </div>
        <button class="fav-card__start" type="button" data-id="${ex._id}" aria-label="Start ${ex.name}">
          Start →
        </button>
      </div>
      <div class="fav-card__title-row">
        <div class="fav-card__icon" aria-hidden="true">
          <svg width="16" height="16"><use href="./images/icons.svg#icon-runner"></use></svg>
        </div>
        <span class="fav-card__name" title="${ex.name}">${ex.name}</span>
      </div>
      <p class="fav-card__meta">
        Burned calories: <span>${ex.burnedCalories || 0} / 3 min</span>
        &nbsp;&nbsp;Body part: <span>${ex.bodyPart || '—'}</span>
        &nbsp;&nbsp;Target: <span>${ex.target || '—'}</span>
      </p>
    </div>
  `;
}
