export function renderStars(rating = 0) {
  const rounded = Math.round(rating);
  return Array.from({ length: 5 }, (_, i) =>
    `<span class="modal-exercise__star" aria-hidden="true">${i < rounded ? '★' : '☆'}</span>`
  ).join('');
}

export function renderExerciseCardStars(rating = 0) {
  return `<span class="exercise-card__rating-star">★</span> ${Number(rating).toFixed(1)}`;
}

export function createLoader() {
  return '<div class="loader"><div class="loader__spinner"></div></div>';
}

export function createEmptyState(msg = 'Nothing found') {
  return `<p class="empty-state">${msg}</p>`;
}

export function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
