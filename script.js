/* =============================================
   YOLY ESTETICA SALON & SPA — Main Script
   ============================================= */

'use strict';

// ---- Dynamic year in footer ----
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const header = document.getElementById('site-header');

// ---- Mobile nav toggle ----
const navToggle = document.getElementById('nav-toggle');
const navMenu   = document.getElementById('nav-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  });

  // Close menu when a link is clicked
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Abrir menú');
    });
  });

  // Close on click outside
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// ---- Active nav link on scroll ----
const sections  = document.querySelectorAll('main > section[id]');
const navLinks  = document.querySelectorAll('.nav-link:not(.nav-cta)');

function setActiveLink() {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 100;
    if (window.scrollY >= top) current = section.id;
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}
window.addEventListener('scroll', setActiveLink, { passive: true });

// ---- Scroll-triggered fade-in animations ----
const fadeEls = document.querySelectorAll(
  '.service-card, .gallery-item, .testimonial-card, .about-content, .about-image, .contact-info, .contact-form-wrap'
);

fadeEls.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Stagger siblings
        const siblings = entry.target.parentElement.querySelectorAll('.fade-in');
        let delay = 0;
        siblings.forEach((sib, idx) => {
          if (sib === entry.target) delay = idx * 80;
        });
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

fadeEls.forEach(el => observer.observe(el));

// ---- Contact form handling ----
const form       = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    // Simple client-side validation
    const name    = form.name.value.trim();
    const message = form.message.value.trim();

    let valid = true;

    if (!name) { showError(form.name, 'Por favor ingresa tu nombre.'); valid = false; }
    if (!message) { showError(form.message, 'Por favor escribe tu mensaje.'); valid = false; }

    if (!valid) return;

    // Submit button loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando…';
    submitBtn.disabled = true;

    try {
      /* ---------------------------------------------------------
         Web3Forms — https://web3forms.com
         The access_key is set as a hidden input in the HTML form.
         To activate: replace YOUR_WEB3FORMS_ACCESS_KEY in index.html
         with the key you receive after signing up at web3forms.com.
         --------------------------------------------------------- */
      const accessKey = form.querySelector('[name="access_key"]')?.value;

      if (!accessKey || accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY') {
        // Demo mode — no key set yet, simulate success
        await new Promise(r => setTimeout(r, 900));
        showSuccess('¡Mensaje enviado! Te contactaremos pronto. 🌸');
        form.reset();
        return;
      }

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        showSuccess('¡Mensaje enviado! Te contactaremos pronto. 🌸');
        form.reset();
      } else {
        showFormError(json.message || 'Hubo un problema al enviar. Intenta de nuevo.');
      }
    } catch {
      showFormError('Error de red. Por favor intenta de nuevo o escríbenos por WhatsApp.');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

function showError(el, msg) {
  el.classList.add('error');
  const span = document.createElement('span');
  span.className = 'field-error';
  span.style.cssText = 'color:#c0392b;font-size:.8rem;display:block;margin-top:0.25rem;';
  span.textContent = msg;
  el.parentElement.appendChild(span);
}

function clearErrors() {
  form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  form.querySelectorAll('.field-error').forEach(el => el.remove());
  formStatus.className = 'form-status';
  formStatus.textContent = '';
}

function showSuccess(msg) {
  formStatus.className = 'form-status success';
  formStatus.textContent = msg;
  formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showFormError(msg) {
  formStatus.className = 'form-status error';
  formStatus.textContent = msg;
}
