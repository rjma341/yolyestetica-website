/* =============================================
   YOLY ESTÉTICA — Main Script
   ============================================= */

'use strict';

// ---- Dynamic year in footer ----
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---- Sticky header on scroll ----
const header = document.getElementById('site-header');
function handleScroll() {
  if (window.scrollY > 40) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll(); // run on load

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
    entries.forEach((entry, i) => {
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
    const phone   = form.phone.value.trim();
    const service = form.service.value;

    let valid = true;

    if (!name) { showError(form.name, 'Por favor ingresa tu nombre.'); valid = false; }
    if (!phone) { showError(form.phone, 'Por favor ingresa tu teléfono.'); valid = false; }
    if (!service) { showError(form.service, 'Por favor selecciona un servicio.'); valid = false; }

    if (!valid) return;

    // Submit button loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando…';
    submitBtn.disabled = true;

    try {
      /* ---------------------------------------------------------
         OPTION A: Formspree (recommended — see README)
         Replace YOUR_FORM_ID with your Formspree form ID.
         Sign up free at https://formspree.io
         --------------------------------------------------------- */
      const formspreeId = 'YOUR_FORM_ID'; // ← replace this

      if (formspreeId === 'YOUR_FORM_ID') {
        // Demo mode — simulate success after 1s
        await new Promise(r => setTimeout(r, 1000));
        showSuccess('¡Mensaje enviado! Te contactaremos pronto. 🌸');
        form.reset();
      } else {
        const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(form),
        });

        if (res.ok) {
          showSuccess('¡Mensaje enviado! Te contactaremos pronto. 🌸');
          form.reset();
        } else {
          const data = await res.json();
          const msg = data?.errors?.map(err => err.message).join(', ') || 'Error al enviar.';
          showFormError(`Hubo un problema: ${msg}`);
        }
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
