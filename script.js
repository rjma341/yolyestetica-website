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

// ---- Form helpers ----
function showError(el, msg) {
  el.classList.add('error');
  const span = document.createElement('span');
  span.className = 'field-error';
  span.style.cssText = 'color:#c0392b;font-size:.8rem;display:block;margin-top:0.25rem;';
  span.textContent = msg;
  el.parentElement.appendChild(span);
}

function clearFormErrors(formEl, statusEl) {
  formEl.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  formEl.querySelectorAll('.field-error').forEach(el => el.remove());
  statusEl.className = 'form-status';
  statusEl.textContent = '';
}

function showSuccess(statusEl, msg) {
  statusEl.className = 'form-status success';
  statusEl.textContent = msg;
  statusEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showFormError(statusEl, msg) {
  statusEl.className = 'form-status error';
  statusEl.textContent = msg;
}

async function submitForm(formEl, statusEl, successMsg) {
  const submitBtn = formEl.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Enviando…';
  submitBtn.disabled = true;

  try {
    const accessKey = formEl.querySelector('[name="access_key"]')?.value;

    if (!accessKey || accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY') {
      await new Promise(r => setTimeout(r, 900));
      showSuccess(statusEl, successMsg);
      formEl.reset();
      return;
    }

    const formData = new FormData(formEl);
    const data = Object.fromEntries(formData.entries());

    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (res.ok && json.success) {
      showSuccess(statusEl, successMsg);
      formEl.reset();
    } else {
      showFormError(statusEl, json.message || 'Hubo un problema al enviar. Intenta de nuevo.');
    }
  } catch {
    showFormError(statusEl, 'Error de red. Por favor intenta de nuevo o escríbenos por WhatsApp.');
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

// ---- Contact form ----
const form       = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearFormErrors(form, formStatus);

    const name    = form.name.value.trim();
    const message = form.message.value.trim();
    let valid = true;

    if (!name)    { showError(form.name,    'Por favor ingresa tu nombre.');   valid = false; }
    if (!message) { showError(form.message, 'Por favor escribe tu mensaje.');  valid = false; }

    if (!valid) return;
    await submitForm(form, formStatus, '¡Mensaje enviado! Te contactaremos pronto.');
  });
}

// ---- Careers modal ----
const careersModal  = document.getElementById('careers-modal');
const openModalBtn  = document.getElementById('open-careers-modal');
const closeModalBtn = document.getElementById('modal-close');

function openCareersModal() {
  careersModal.classList.add('open');
  document.body.style.overflow = 'hidden';
  closeModalBtn.focus();
}

function closeCareersModal() {
  careersModal.classList.remove('open');
  document.body.style.overflow = '';
  if (openModalBtn) openModalBtn.focus();
}

if (openModalBtn) openModalBtn.addEventListener('click', openCareersModal);
if (closeModalBtn) closeModalBtn.addEventListener('click', closeCareersModal);

if (careersModal) {
  // Close on overlay click (not on modal content click)
  careersModal.addEventListener('click', (e) => {
    if (e.target === careersModal) closeCareersModal();
  });
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && careersModal?.classList.contains('open')) {
    closeCareersModal();
  }
});

// Footer / nav links pointing to #trabaja open the modal instead of scrolling
document.querySelectorAll('a[href="#trabaja"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    openCareersModal();
  });
});

// ---- Careers form ----
const careersForm   = document.getElementById('careers-form');
const careersStatus = document.getElementById('careers-status');

if (careersForm) {
  careersForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearFormErrors(careersForm, careersStatus);

    const name    = careersForm.querySelector('[name="name"]').value.trim();
    const email   = careersForm.querySelector('[name="email"]').value.trim();
    const message = careersForm.querySelector('[name="message"]').value.trim();
    let valid = true;

    if (!name)    { showError(careersForm.querySelector('[name="name"]'),    'Por favor ingresa tu nombre.'); valid = false; }
    if (!email)   { showError(careersForm.querySelector('[name="email"]'),   'Por favor ingresa tu correo.'); valid = false; }
    if (!message) { showError(careersForm.querySelector('[name="message"]'), 'Por favor cuéntanos sobre ti.'); valid = false; }

    if (!valid) return;
    await submitForm(careersForm, careersStatus, '¡Aplicación enviada! Nos pondremos en contacto contigo pronto.');
  });
}
