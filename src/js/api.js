const BASE_URL = 'https://your-energy.b.goit.study/api';

export async function fetchQuote() {
  const res = await fetch(`${BASE_URL}/quote`);
  if (!res.ok) throw new Error('Failed to fetch quote');
  return res.json();
}

export async function fetchFilters(filter, page = 1, limit = 12) {
  const params = new URLSearchParams({ filter, page, limit });
  const res = await fetch(`${BASE_URL}/filters?${params}`);
  if (!res.ok) throw new Error('Failed to fetch filters');
  return res.json();
}

export async function fetchExercises({ bodypart, muscles, equipment, keyword, page = 1, limit = 10 } = {}) {
  const params = new URLSearchParams({ page, limit });
  if (bodypart) params.set('bodypart', bodypart);
  if (muscles) params.set('muscles', muscles);
  if (equipment) params.set('equipment', equipment);
  if (keyword) params.set('keyword', keyword);
  const res = await fetch(`${BASE_URL}/exercises?${params}`);
  if (!res.ok) throw new Error('Failed to fetch exercises');
  return res.json();
}

export async function fetchExerciseById(id) {
  const res = await fetch(`${BASE_URL}/exercises/${id}`);
  if (!res.ok) throw new Error('Failed to fetch exercise');
  return res.json();
}

export async function patchExerciseRating(id, rating, email, comment) {
  const res = await fetch(`${BASE_URL}/exercises/${id}/rating`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rate: rating, email, review: comment }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to submit rating');
  }
  return res.json();
}

export async function postSubscription(email) {
  const res = await fetch(`${BASE_URL}/subscription`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Subscription failed');
  }
  return res.json();
}
