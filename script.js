(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progress = document.getElementById('progress-line');
  let progressPending = false;
  function updateProgress() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0) + '%';
    progressPending = false;
  }
  window.addEventListener('scroll', () => {
    if (!progressPending) {
      progressPending = true;
      requestAnimationFrame(updateProgress);
    }
  }, { passive: true });
  updateProgress();

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          instance.unobserve(entry.target);
        }
      });
    }, { threshold: 0.11, rootMargin: '0px 0px -25px 0px' });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('visible'));
  }

  const answers = {
    yes: {
      title: '¿De verdad? Me harías muy feliz. ♡',
      description: 'Si esto es lo que sientes, puedes decírmelo. Este mensaje es sólo una idea: cámbialo como quieras.',
      message: 'Rodrigo, leí tu carta y quiero decirte que sí, quiero estar contigo. Me gustaría que lo intentáramos bonito. ❤️'
    },
    talk: {
      title: 'Me encantaría escucharte.',
      description: 'Podemos hablar con calma, sin expectativas ni presiones. Tú eliges cómo decírmelo.',
      message: 'Rodrigo, leí tu carta. Me gustaría que platiquemos con calma de lo que sentimos. 💌'
    },
    time: {
      title: 'Tómate el tiempo que necesites.',
      description: 'No hace falta apresurarse. Gracias por ser sincera con lo que necesitas.',
      message: 'Rodrigo, gracias por tu carta. Necesito un poco más de tiempo para pensar en todo y en cómo me siento. 🌷'
    },
    no: {
      title: 'Gracias por decírmelo con sinceridad.',
      description: 'Tu decisión merece respeto, y no tienes obligación de dar explicaciones.',
      message: 'Rodrigo, gracias por tus palabras y por tu cariño. Prefiero que lo nuestro quede aquí. Te deseo cosas muy bonitas.'
    }
  };
  const responseBox = document.getElementById('reply-card');
  const title = document.getElementById('reply-title');
  const description = document.getElementById('reply-description');
  const message = document.getElementById('reply-message');
  const share = document.getElementById('whatsapp-send');
  const status = document.getElementById('copy-status');
  const options = document.getElementById('answer-options');
  const container = document.getElementById('hearts-container');

  function refreshShareLink() {
    share.href = 'https://wa.me/527225123478?text=' + encodeURIComponent(message.value.trim());
    share.setAttribute('aria-label', 'Abrir el chat de Rodrigo en WhatsApp con el mensaje preparado. Tú decides si lo envías.');
  }
  function floatHearts() {
    if (reducedMotion) return;
    for (let i = 0; i < 28; i++) {
      const el = document.createElement('span');
      el.className = 'flying-heart';
      el.textContent = i % 5 === 0 ? '✦' : '♥';
      el.style.setProperty('--x', (4 + Math.random() * 92) + '%');
      el.style.setProperty('--drift', (-160 + Math.random() * 320) + 'px');
      el.style.setProperty('--rotate', (-70 + Math.random() * 140) + 'deg');
      el.style.setProperty('--size', (16 + Math.random() * 22) + 'px');
      el.style.setProperty('--hue', ['#ffc6d1', '#f4a4b4', '#fce1ce', '#f2d2d5'][i % 4]);
      el.style.setProperty('--duration', (3 + Math.random() * 2.4) + 's');
      el.style.setProperty('--delay', (Math.random() * 1.1) + 's');
      container.appendChild(el);
      el.addEventListener('animationend', () => el.remove(), { once: true });
    }
  }
  document.querySelectorAll('[data-answer]').forEach((button) => {
    button.addEventListener('click', () => {
      const selected = answers[button.dataset.answer];
      if (!selected) return;
      title.textContent = selected.title;
      description.textContent = selected.description;
      message.value = selected.message;
      status.textContent = '';
      refreshShareLink();
      options.hidden = true;
      responseBox.hidden = false;
      if (button.dataset.answer === 'yes') floatHearts();
      responseBox.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
    });
  });
  message.addEventListener('input', refreshShareLink);
  document.getElementById('choose-again').addEventListener('click', () => {
    responseBox.hidden = true;
    options.hidden = false;
    status.textContent = '';
    options.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
  });
  document.getElementById('copy-reply').addEventListener('click', async () => {
    if (!message.value.trim()) {
      status.textContent = 'Escribe un mensaje antes de copiarlo.';
      return;
    }
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(message.value);
      } else {
        message.focus();
        message.select();
        if (!document.execCommand('copy')) throw new Error('No fue posible copiar');
        message.setSelectionRange(message.value.length, message.value.length);
      }
      status.textContent = 'Mensaje copiado. Puedes pegarlo donde quieras. ♡';
    } catch (error) {
      status.textContent = 'Selecciona el texto de arriba y cópialo manualmente.';
    }
  });
  share.addEventListener('click', (event) => {
    if (!message.value.trim()) {
      event.preventDefault();
      status.textContent = 'Escribe un mensaje antes de abrir WhatsApp.';
    }
  });
})();
