import { fetchExerciseById, patchExerciseRating } from './api.js';
import { addFavorite, removeFavorite, isFavorite } from './storage.js';
import { showToast } from './toast.js';
import { renderStars } from './utils.js';

const EMAIL_REGEX = /^\w+(\.\w+)?@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

let currentExerciseId = null;

export function openExerciseModal(exerciseId) {
  currentExerciseId = exerciseId;
  const overlay = document.getElementById('modal-exercise');
  const body = document.getElementById('modal-exercise-body');

  body.innerHTML = '<div class="loader"><div class="loader__spinner"></div></div>';
  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  fetchExerciseById(exerciseId)
    .then(data => renderExerciseModal(data))
    .catch(err => {
      body.innerHTML = '<p style="padding:32px;text-align:center">Failed to load exercise.</p>';
    });

  setupModalClose('modal-exercise', closeExerciseModal);
}

function renderExerciseModal(ex) {
  const body = document.getElementById('modal-exercise-body');
  const favActive = isFavorite(ex._id);

  const imgSrc = ex.gifUrl || '';

  body.innerHTML = `
    <div class="modal-exercise__inner">
      ${imgSrc
        ? `<img src="${imgSrc}" alt="${ex.name}" class="modal-exercise__img" width="260" height="200" />`
        : `<div class="modal-exercise__img modal-exercise__img--empty" aria-hidden="true"></div>`
      }
      <div class="modal-exercise__info">
        <h2 class="modal-exercise__title" id="modal-exercise-title">${ex.name}</h2>
        <div class="modal-exercise__rating-row">
          <span class="modal-exercise__rating-val">${Number(ex.rating || 0).toFixed(1)}</span>
          <div class="modal-exercise__stars">${renderStars(ex.rating)}</div>
        </div>
        <div class="modal-exercise__params">
          <div class="modal-exercise__param">
            Target<strong>${ex.target || '—'}</strong>
          </div>
          <div class="modal-exercise__param">
            Body Part<strong>${ex.bodyPart || '—'}</strong>
          </div>
          <div class="modal-exercise__param">
            Equipment<strong>${ex.equipment || '—'}</strong>
          </div>
          <div class="modal-exercise__param">
            Popular<strong>${ex.popularity || 0}</strong>
          </div>
        </div>
        <p class="modal-exercise__calories">
          Burned Calories: <strong>${ex.burnedCalories || 0}/${ex.time || 3} min</strong>
        </p>
        <p class="modal-exercise__desc">${ex.description || ''}</p>
        <div class="modal-exercise__actions">
          <button
            class="btn-fav ${favActive ? 'btn-fav--active' : ''}"
            id="btn-add-fav"
            type="button"
            data-id="${ex._id}"
          >
            ${favActive ? 'Remove from favorites' : 'Add to favorites'}
            <svg width="16" height="16" aria-hidden="true"><use href="./images/icons.svg#icon-heart"></use></svg>
          </button>
          <button class="btn-rating" id="btn-give-rating" type="button" data-id="${ex._id}">
            Give a rating
          </button>
        </div>
      </div>
    </div>
  `;

  body.querySelector('#btn-add-fav').addEventListener('click', e => {
    const btn = e.currentTarget;
    const id = btn.dataset.id;
    if (isFavorite(id)) {
      removeFavorite(id);
      btn.classList.remove('btn-fav--active');
      btn.childNodes[0].textContent = 'Add to favorites ';
      showToast('Removed from favorites', 'error');
    } else {
      addFavorite(ex);
      btn.classList.add('btn-fav--active');
      btn.childNodes[0].textContent = 'Remove from favorites ';
      showToast('Added to favorites!', 'success');
    }
  });

  body.querySelector('#btn-give-rating').addEventListener('click', () => {
    closeExerciseModal();
    openRatingModal(ex._id);
  });
}

export function closeExerciseModal() {
  const overlay = document.getElementById('modal-exercise');
  overlay.classList.add('hidden');
  document.body.style.overflow = '';
  removeModalClose('modal-exercise');
}

let ratingValue = 0;
let ratingExerciseId = null;

export function openRatingModal(exerciseId) {
  ratingExerciseId = exerciseId;
  ratingValue = 0;

  const overlay = document.getElementById('modal-rating');
  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  const emailInput = document.getElementById('rating-email');
  const commentInput = document.getElementById('rating-comment');
  if (emailInput) emailInput.value = '';
  if (commentInput) commentInput.value = '';

  renderRatingStars(0);
  setupRatingForm();
  setupModalClose('modal-rating', closeRatingModal);
}

function renderRatingStars(selected) {
  const container = document.getElementById('rating-stars');
  const valueEl = document.getElementById('rating-value');
  if (!container) return;

  container.querySelectorAll('.rating-star-btn').forEach(el => el.remove());

  for (let i = 1; i <= 5; i++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `rating-star-btn ${i <= selected ? 'active' : ''}`;
    btn.textContent = '★';
    btn.setAttribute('aria-label', `Rate ${i} star${i > 1 ? 's' : ''}`);
    btn.addEventListener('click', () => {
      ratingValue = i;
      if (valueEl) valueEl.textContent = `${i}.0`;
      renderRatingStars(i);
    });
    container.appendChild(btn);
  }
}

function setupRatingForm() {
  const oldForm = document.getElementById('rating-form');
  if (!oldForm) return;

  const form = oldForm.cloneNode(true);
  oldForm.parentNode.replaceChild(form, oldForm);

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const email = form.querySelector('#rating-email').value.trim();
    const comment = form.querySelector('#rating-comment').value.trim();

    if (!ratingValue) {
      showToast('Please select a rating (1–5 stars)', 'error');
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    const submitBtn = form.querySelector('.rating-form__submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      await patchExerciseRating(ratingExerciseId, ratingValue, email, comment);
      showToast('Rating submitted! Thank you.', 'success');
      closeRatingModal();
      openExerciseModal(ratingExerciseId);
    } catch (err) {
      showToast(err.message || 'Failed to submit rating', 'error');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send';
    }
  });
}

export function closeRatingModal() {
  const overlay = document.getElementById('modal-rating');
  overlay.classList.add('hidden');
  document.body.style.overflow = '';
  removeModalClose('modal-rating');
}

const closeHandlers = {};

function setupModalClose(modalId, closeFn) {
  const overlay = document.getElementById(modalId);
  const closeBtn = overlay.querySelector('.modal__close');

  const onOverlayClick = e => { if (e.target === overlay) closeFn(); };
  const onKeydown = e => { if (e.key === 'Escape') closeFn(); };

  closeHandlers[modalId] = { overlay, onOverlayClick, onKeydown, closeBtn };

  overlay.addEventListener('click', onOverlayClick);
  document.addEventListener('keydown', onKeydown);
  if (closeBtn) closeBtn.addEventListener('click', closeFn);
}

function removeModalClose(modalId) {
  const h = closeHandlers[modalId];
  if (!h) return;
  h.overlay.removeEventListener('click', h.onOverlayClick);
  document.removeEventListener('keydown', h.onKeydown);
  if (h.closeBtn) {

    const newBtn = h.closeBtn.cloneNode(true);
    h.closeBtn.parentNode.replaceChild(newBtn, h.closeBtn);
  }
  delete closeHandlers[modalId];
}
