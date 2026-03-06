const FAVORITES_KEY = 'yourEnergy_favorites';
const QUOTE_KEY = 'yourEnergy_quote';

export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  } catch {
    return [];
  }
}

export function addFavorite(exercise) {
  const favs = getFavorites();
  if (!favs.find(e => e._id === exercise._id)) {
    favs.push(exercise);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
  }
}

export function removeFavorite(id) {
  const favs = getFavorites().filter(e => e._id !== id);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
}

export function isFavorite(id) {
  return getFavorites().some(e => e._id === id);
}

export function getCachedQuote() {
  try {
    const data = JSON.parse(localStorage.getItem(QUOTE_KEY));
    if (!data) return null;
    const today = new Date().toDateString();
    if (data.date !== today) return null;
    return data.quote;
  } catch {
    return null;
  }
}

export function setCachedQuote(quote) {
  const today = new Date().toDateString();
  localStorage.setItem(QUOTE_KEY, JSON.stringify({ date: today, quote }));
}
