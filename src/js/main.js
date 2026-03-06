import { fetchFilters, fetchExercises } from './api.js';
import { initHeader } from './header.js';
import { initQuote } from './quote.js';
import { initSubscribeForm } from './subscribe.js';
import { openExerciseModal } from './modal.js';
import { renderPagination } from './pagination.js';
import { createLoader, createEmptyState, renderExerciseCardStars } from './utils.js';

const CATEGORY_IMAGES = {

  abductors: 'https://ftp.goit.stud./images/power-pulse/gifs/0567.gif',
  abs: 'https://ftp.goit.stud./images/power-pulse/gifs/0003.gif',
  adductors: 'https://ftp.goit.stud./images/power-pulse/gifs/0011.gif',
  biceps: 'https://ftp.goit.stud./images/power-pulse/gifs/0031.gif',
  calves: 'https://ftp.goit.stud./images/power-pulse/gifs/0068.gif',
  'cardiovascular system': 'https://ftp.goit.stud./images/power-pulse/gifs/0080.gif',
  delts: 'https://ftp.goit.stud./images/power-pulse/gifs/0108.gif',
  forearms: 'https://ftp.goit.stud./images/power-pulse/gifs/0163.gif',
  glutes: 'https://ftp.goit.stud./images/power-pulse/gifs/0176.gif',
  hamstrings: 'https://ftp.goit.stud./images/power-pulse/gifs/0216.gif',
  lats: 'https://ftp.goit.stud./images/power-pulse/gifs/0007.gif',
  'levator scapulae': 'https://ftp.goit.stud./images/power-pulse/gifs/0309.gif',
  pectorals: 'https://ftp.goit.stud./images/power-pulse/gifs/0355.gif',
  quads: 'https://ftp.goit.stud./images/power-pulse/gifs/0404.gif',
  'serratus anterior': 'https://ftp.goit.stud./images/power-pulse/gifs/0460.gif',
  spine: 'https://ftp.goit.stud./images/power-pulse/gifs/0480.gif',
  traps: 'https://ftp.goit.stud./images/power-pulse/gifs/0505.gif',
  triceps: 'https://ftp.goit.stud./images/power-pulse/gifs/0522.gif',
  'upper back': 'https://ftp.goit.stud./images/power-pulse/gifs/0554.gif',

  back: 'https://ftp.goit.stud./images/power-pulse/gifs/0007.gif',
  cardio: 'https://ftp.goit.stud./images/power-pulse/gifs/0080.gif',
  chest: 'https://ftp.goit.stud./images/power-pulse/gifs/0355.gif',
  'lower arms': 'https://ftp.goit.stud./images/power-pulse/gifs/0163.gif',
  'lower legs': 'https://ftp.goit.stud./images/power-pulse/gifs/0068.gif',
  neck: 'https://ftp.goit.stud./images/power-pulse/gifs/0309.gif',
  shoulders: 'https://ftp.goit.stud./images/power-pulse/gifs/0108.gif',
  'upper arms': 'https://ftp.goit.stud./images/power-pulse/gifs/0031.gif',
  'upper legs': 'https://ftp.goit.stud./images/power-pulse/gifs/0404.gif',
  waist: 'https://ftp.goit.stud./images/power-pulse/gifs/0003.gif',

  assisted: 'https://ftp.goit.stud./images/power-pulse/gifs/0020.gif',
  band: 'https://ftp.goit.stud./images/power-pulse/gifs/0025.gif',
  barbell: 'https://ftp.goit.stud./images/power-pulse/gifs/0031.gif',
  'body weight': 'https://ftp.goit.stud./images/power-pulse/gifs/0003.gif',
  cable: 'https://ftp.goit.stud./images/power-pulse/gifs/0007.gif',
  dumbbell: 'https://ftp.goit.stud./images/power-pulse/gifs/0108.gif',
  kettlebell: 'https://ftp.goit.stud./images/power-pulse/gifs/0280.gif',
  'leverage machine': 'https://ftp.goit.stud./images/power-pulse/gifs/0297.gif',
  'olympic barbell': 'https://ftp.goit.stud./images/power-pulse/gifs/0355.gif',
  'resistance band': 'https://ftp.goit.stud./images/power-pulse/gifs/0430.gif',
  rope: 'https://ftp.goit.stud./images/power-pulse/gifs/0447.gif',
  'smith machine': 'https://ftp.goit.stud./images/power-pulse/gifs/0480.gif',
  'stability ball': 'https://ftp.goit.stud./images/power-pulse/gifs/0490.gif',
};

function getCategoryImg(item) {

  const apiImg = item.imgUrl || item.imgURL || '';

  if (apiImg && apiImg !== 'string' && apiImg.startsWith('http')) return apiImg;

  const key = item.name.toLowerCase();
  return CATEGORY_IMAGES[key] || '';
}

const state = {
  activeFilter: 'Muscles',
  activeCategory: null,
  activeCategoryName: '',
  keyword: '',
  page: 1,
  limit: 10,
  categoryPage: 1,
  categoryLimit: 12,
};

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initQuote();
  initSubscribeForm();
  initFilters();
  loadCategories();
});

function initFilters() {
  const list = document.getElementById('filters-list');
  if (!list) return;

  list.addEventListener('click', e => {
    const btn = e.target.closest('.filters__btn');
    if (!btn) return;

    list.querySelectorAll('.filters__btn').forEach(b => b.classList.remove('filters__btn--active'));
    btn.classList.add('filters__btn--active');

    state.activeFilter = btn.dataset.filter;
    state.activeCategory = null;
    state.activeCategoryName = '';
    state.keyword = '';
    state.categoryPage = 1;

    document.getElementById('exercises-title').textContent = 'Exercises';
    document.getElementById('search-wrap').classList.add('hidden');
    document.getElementById('category-grid').classList.remove('hidden');
    document.getElementById('exercise-list').classList.add('hidden');
    document.getElementById('pagination').innerHTML = '';

    loadCategories();
  });
}

async function loadCategories() {
  const grid = document.getElementById('category-grid');
  const paginationEl = document.getElementById('pagination');
  grid.innerHTML = createLoader();

  try {
    const data = await fetchFilters(state.activeFilter, state.categoryPage, state.categoryLimit);
    const items = data.results || [];
    const totalPages = data.totalPages || 1;

    if (!items.length) {
      grid.innerHTML = createEmptyState('No categories found');
      return;
    }

    grid.innerHTML = items.map(item => createCategoryCard(item)).join('');

    renderPagination(paginationEl, {
      currentPage: state.categoryPage,
      totalPages,
      onPageClick: page => {
        state.categoryPage = page;
        loadCategories();
        grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      },
    });

    document.getElementById('category-grid').addEventListener('click', onCategoryClick);
  } catch (err) {
    grid.innerHTML = createEmptyState('Failed to load categories');
  }
}

function createCategoryCard(item) {
  const imgSrc = getCategoryImg(item);
  return `
    <div
      class="category-card"
      role="button"
      tabindex="0"
      data-name="${item.name}"
      data-filter="${item.filter}"
      aria-label="Browse ${item.name}"
    >
      ${imgSrc
        ? `<img src="${imgSrc}" alt="${item.name}" class="category-card__img" width="300" height="300" loading="lazy" />`
        : `<div class="category-card__img category-card__img--placeholder"></div>`
      }
      <div class="category-card__overlay">
        <p class="category-card__name">${item.name}</p>
        <p class="category-card__filter">${item.filter}</p>
      </div>
    </div>
  `;
}

function onCategoryClick(e) {
  const card = e.target.closest('.category-card');
  if (!card) return;

  document.getElementById('category-grid').removeEventListener('click', onCategoryClick);

  state.activeCategory = card.dataset.name;
  state.activeCategoryName = card.dataset.name;
  state.page = 1;
  state.keyword = '';

  showExercisesView();
}

function showExercisesView() {
  const titleEl = document.getElementById('exercises-title');
  titleEl.innerHTML = `Exercises / <span class="exercises-section__subtitle">${state.activeCategoryName}</span>`;

  document.getElementById('category-grid').classList.add('hidden');
  document.getElementById('exercise-list').classList.remove('hidden');
  document.getElementById('search-wrap').classList.remove('hidden');

  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = '';

  const searchForm = document.getElementById('search-form');
  if (searchForm) {
    const newForm = searchForm.cloneNode(true);
    searchForm.parentNode.replaceChild(newForm, searchForm);
    newForm.addEventListener('submit', e => {
      e.preventDefault();
      state.keyword = newForm.querySelector('#search-input').value.trim();
      state.page = 1;
      loadExercises();
    });
  }

  loadExercises();
}

function buildExerciseParams() {
  const params = { page: state.page, limit: state.limit };
  if (state.keyword) params.keyword = state.keyword;

  if (state.activeFilter === 'Muscles')    params.muscles   = state.activeCategory;
  if (state.activeFilter === 'Body parts') params.bodypart  = state.activeCategory;
  if (state.activeFilter === 'Equipment')  params.equipment = state.activeCategory;

  return params;
}

async function loadExercises() {
  const list = document.getElementById('exercise-list');
  const paginationEl = document.getElementById('pagination');
  list.innerHTML = createLoader();
  paginationEl.innerHTML = '';

  try {
    const data = await fetchExercises(buildExerciseParams());
    const exercises = data.results || [];
    const totalPages = data.totalPages || 1;

    if (!exercises.length) {
      list.innerHTML = createEmptyState('No exercises found');
      return;
    }

    list.innerHTML = exercises.map(createExerciseCard).join('');

    list.addEventListener('click', e => {
      const btn = e.target.closest('.exercise-card__start');
      const card = e.target.closest('.exercise-card');
      const id = btn ? btn.dataset.id : card ? card.dataset.id : null;
      if (id) openExerciseModal(id);
    });

    renderPagination(paginationEl, {
      currentPage: state.page,
      totalPages,
      onPageClick: page => {
        state.page = page;
        loadExercises();
        list.scrollIntoView({ behavior: 'smooth', block: 'start' });
      },
    });
  } catch (err) {
    list.innerHTML = createEmptyState('Failed to load exercises');
  }
}

function createExerciseCard(ex) {
  return `
    <div class="exercise-card" data-id="${ex._id}" role="button" tabindex="0">
      <div class="exercise-card__top">
        <div class="exercise-card__top-left">
          <span class="exercise-card__badge">Workout</span>
          <span class="exercise-card__rating">${renderExerciseCardStars(ex.rating)}</span>
        </div>
        <button class="exercise-card__start" type="button" data-id="${ex._id}" aria-label="Start ${ex.name}">
          Start →
        </button>
      </div>
      <div class="exercise-card__title">
        <div class="exercise-card__icon" aria-hidden="true">
          <svg width="16" height="16"><use href="./images/icons.svg#icon-runner"></use></svg>
        </div>
        <span class="exercise-card__name" title="${ex.name}">${ex.name}</span>
      </div>
      <p class="exercise-card__meta">
        Burned calories: <span>${ex.burnedCalories || 0} / ${ex.time || 3} min</span>
        &nbsp;&nbsp;Body part: <span>${ex.bodyPart || '—'}</span>
        &nbsp;&nbsp;Target: <span>${ex.target || '—'}</span>
      </p>
    </div>
  `;
}
