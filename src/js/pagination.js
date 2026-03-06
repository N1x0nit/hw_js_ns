export function renderPagination(container, { currentPage, totalPages, onPageClick }) {
  container.innerHTML = '';
  if (totalPages <= 1) return;

  const pages = getPagesToShow(currentPage, totalPages);

  pages.forEach(page => {
    if (page === '...') {
      const span = document.createElement('span');
      span.className = 'pagination__ellipsis';
      span.textContent = '...';
      container.appendChild(span);
    } else {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `pagination__btn ${page === currentPage ? 'pagination__btn--active' : ''}`;
      btn.textContent = page;
      btn.setAttribute('aria-label', `Page ${page}`);
      if (page === currentPage) btn.setAttribute('aria-current', 'page');
      btn.addEventListener('click', () => onPageClick(page));
      container.appendChild(btn);
    }
  });
}

function getPagesToShow(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = [];
  if (current <= 4) {
    for (let i = 1; i <= 5; i++) pages.push(i);
    pages.push('...', total);
  } else if (current >= total - 3) {
    pages.push(1, '...');
    for (let i = total - 4; i <= total; i++) pages.push(i);
  } else {
    pages.push(1, '...', current - 1, current, current + 1, '...', total);
  }
  return pages;
}
