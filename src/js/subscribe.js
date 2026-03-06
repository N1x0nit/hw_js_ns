import { postSubscription } from './api.js';
import { showToast } from './toast.js';

const EMAIL_REGEX = /^\w+(\.\w+)?@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

export function initSubscribeForm() {
  const form = document.getElementById('subscribe-form');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const emailInput = document.getElementById('subscribe-email');
    const msgEl = document.getElementById('subscribe-msg');
    const email = emailInput.value.trim();

    if (!EMAIL_REGEX.test(email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    try {
      await postSubscription(email);
      emailInput.value = '';
      if (msgEl) {
        msgEl.textContent = 'Thank you for subscribing!';
        msgEl.className = 'footer__msg footer__msg--success';
        msgEl.classList.remove('hidden');
        setTimeout(() => msgEl.classList.add('hidden'), 4000);
      }
      showToast('Subscribed successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Subscription failed', 'error');
    }
  });
}
