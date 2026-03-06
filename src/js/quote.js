import { fetchQuote } from './api.js';
import { getCachedQuote, setCachedQuote } from './storage.js';

export async function initQuote() {
  const textEl = document.getElementById('quote-text');
  const authorEl = document.getElementById('quote-author');
  if (!textEl) return;

  let quote = getCachedQuote();

  if (!quote) {
    try {
      quote = await fetchQuote();
      setCachedQuote(quote);
    } catch {
      textEl.textContent = 'Stay focused and push through!';
      if (authorEl) authorEl.textContent = '';
      return;
    }
  }

  textEl.textContent = quote.quote || quote.text || '';
  if (authorEl) authorEl.textContent = quote.author || '';
}
