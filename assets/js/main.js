/* ===========================================================
   QUALIPHY — Shared JS (all pages)
   Include: <script src="js/main.js" defer></script>
   =========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Nav scroll shadow ───
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // ─── Mobile Menu — builds itself from existing nav ───
  const hamburger = document.querySelector('.hamburger');
  if (hamburger) {
    buildMobileMenu();
  }

  // ─── Scroll-triggered fade-in ───
  const animateEls = document.querySelectorAll('.animate-in');
  if (animateEls.length && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    animateEls.forEach(el => obs.observe(el));
  }

  // ─── Smooth scroll for anchor links ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});


/* =============================================================
   MOBILE MENU BUILDER
   Reads existing .nav-links and .nav-actions, builds a slide-out
   panel, injects CSS. Works on every page automatically.
   ============================================================= */
function buildMobileMenu() {
  // ── Inject styles (once) ──
  const style = document.createElement('style');
  style.textContent = `
    /* Overlay */
    .mm-overlay{position:fixed;inset:0;background:rgba(15,23,41,.5);z-index:200;opacity:0;visibility:hidden;transition:opacity .3s ease,visibility .3s ease;-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px)}
    .mm-overlay.open{opacity:1;visibility:visible}

    /* Panel */
    .mm-panel{position:fixed;top:0;right:0;bottom:0;width:min(340px,85vw);background:#fff;z-index:201;transform:translateX(100%);transition:transform .35s cubic-bezier(.16,1,.3,1);overflow-y:auto;-webkit-overflow-scrolling:touch;display:flex;flex-direction:column}
    .mm-panel.open{transform:translateX(0)}

    /* Header */
    .mm-header{display:flex;align-items:center;justify-content:space-between;padding:18px 20px;border-bottom:1px solid #edf0f7;flex-shrink:0}
    .mm-logo{display:flex;align-items:center;gap:8px;font-family:var(--font-h,'Plus Jakarta Sans',sans-serif);font-weight:800;font-size:1.1rem;color:#0f1729}
    .mm-logo-mark{width:28px;height:28px;background:#4D3D71;border-radius:7px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:12px}
    .mm-close{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#475569;background:transparent;border:none;cursor:pointer;transition:background .15s}
    .mm-close:hover{background:#f7f8fc}
    .mm-close svg{width:20px;height:20px}

    /* Links */
    .mm-body{flex:1;padding:12px 16px 24px;display:flex;flex-direction:column;gap:2px}
    .mm-link{display:block;padding:13px 16px;border-radius:8px;font-family:var(--font-h,'Plus Jakarta Sans',sans-serif);font-size:15px;font-weight:600;color:#1e293b;text-decoration:none;transition:background .15s}
    .mm-link:hover,.mm-link:active{background:#f7f8fc}

    /* Products accordion */
    .mm-accordion-trigger{display:flex;align-items:center;justify-content:space-between;width:100%;text-align:left;padding:13px 16px;border-radius:8px;font-family:var(--font-h,'Plus Jakarta Sans',sans-serif);font-size:15px;font-weight:600;color:#1e293b;cursor:pointer;border:none;background:none;transition:background .15s}
    .mm-accordion-trigger:hover{background:#f7f8fc}
    .mm-accordion-trigger svg{width:18px;height:18px;color:#7a849b;transition:transform .25s ease;flex-shrink:0}
    .mm-accordion-trigger.open svg{transform:rotate(180deg)}
    .mm-sub{max-height:0;overflow:hidden;transition:max-height .3s ease}
    .mm-sub.open{max-height:400px}
    .mm-sub-inner{padding:4px 0 8px 16px;display:flex;flex-direction:column;gap:2px}
    .mm-sub-link{display:block;padding:10px 16px;border-radius:8px;text-decoration:none;transition:background .15s}
    .mm-sub-link:hover{background:#f7f8fc}
    .mm-sub-link strong{display:block;font-family:var(--font-h,'Plus Jakarta Sans',sans-serif);font-size:14px;font-weight:600;color:#1e293b}
    .mm-sub-link span{display:block;font-size:12px;color:#7a849b;margin-top:1px}

    /* Divider */
    .mm-divider{height:1px;background:#edf0f7;margin:8px 16px}

    /* Footer actions */
    .mm-footer{padding:16px;border-top:1px solid #edf0f7;display:flex;flex-direction:column;gap:8px;flex-shrink:0}
    .mm-btn{display:flex;align-items:center;justify-content:center;gap:8px;padding:14px;border-radius:10px;font-family:var(--font-h,'Plus Jakarta Sans',sans-serif);font-size:14px;font-weight:600;text-decoration:none;transition:all .15s;text-align:center}
    .mm-btn-primary{background:#4D3D71;color:#fff}.mm-btn-primary:hover{background:#725F9D}
    .mm-btn-secondary{background:#f7f8fc;color:#1e293b;border:1px solid #edf0f7}.mm-btn-secondary:hover{border-color:#dfe3ed}
    .mm-btn-ghost{color:#475569;font-size:13px}.mm-btn-ghost:hover{color:#1e293b}

    /* Hamburger animation */
    .hamburger.is-open span:nth-child(1){transform:translateY(7px) rotate(45deg);background:#0f1729}
    .hamburger.is-open span:nth-child(2){opacity:0;transform:scaleX(0)}
    .hamburger.is-open span:nth-child(3){transform:translateY(-7px) rotate(-45deg);background:#0f1729}
  `;
  document.head.appendChild(style);

  // ── Build overlay ──
  const overlay = document.createElement('div');
  overlay.className = 'mm-overlay';
  document.body.appendChild(overlay);

  // ── Build panel ──
  const panel = document.createElement('div');
  panel.className = 'mm-panel';

  // Header
  panel.innerHTML = `
    <div class="mm-header">
      <div class="mm-logo"><div class="mm-logo-mark"><svg width="16" height="16" viewBox="0 0 800 800" fill="#fff" xmlns="http://www.w3.org/2000/svg"><circle cx="420.1" cy="40.1" r="40.1"/><circle cx="207.9" cy="40.1" r="40.1"/><path d="M88.5,189.1l127.6,221.1c17,29.4,45.2,48.9,77.7,54.5v106.6c0,126.1,79.3,228.6,176.8,228.6,97.5,0,176.8-102.6,176.8-228.6v-127c45.3-9.2,79.4-49.3,79.4-97.3,0-54.8-44.5-99.3-99.3-99.3s-99.3,44.5-99.3,99.3c0,48,34.2,88.1,79.4,97.3v127c0,104.2-61.5,188.9-137.1,188.9-75.6,0-137.1-84.7-137.1-188.9v-106.6c32.5-5.7,60.7-25.1,77.7-54.5l127.6-221.1c20.4-35.3,20.4-77.4,0-112.6-20.4-35.3-56.8-56.3-97.5-56.3v39.7c26.3,0,49.9,13.6,63.1,36.4s13.2,50.1,0,72.9l-127.6,221.1c-13.2,22.8-36.8,36.4-63.1,36.4-26.3,0-49.9-13.6-63.1-36.4l-127.6-221.1c-13.2-22.8-13.2-50.1,0-72.9,13.2-22.8,36.8-36.4,63.1-36.4V20.2c-40.7,0-77.2,21-97.5,56.3-20.4,35.3-20.4,77.4,0,112.6Z"/></svg></div>Quidget</div>
      <button class="mm-close" aria-label="Close menu"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>
    </div>
    <div class="mm-body"></div>
    <div class="mm-footer"></div>
  `;
  document.body.appendChild(panel);

  const body = panel.querySelector('.mm-body');
  const footer = panel.querySelector('.mm-footer');

  // ── Read existing nav and build links ──
  const dropdown = document.querySelector('.nav .dropdown');
  const navLinks = document.querySelectorAll('.nav .nav-links > a.nav-link');

  // Products accordion (if dropdown exists)
  if (dropdown) {
    const items = dropdown.querySelectorAll('.dropdown-item');
    const trigger = document.createElement('button');
    trigger.className = 'mm-accordion-trigger';
    trigger.innerHTML = 'Products <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>';
    body.appendChild(trigger);

    const sub = document.createElement('div');
    sub.className = 'mm-sub';
    const subInner = document.createElement('div');
    subInner.className = 'mm-sub-inner';
    items.forEach(item => {
      const a = document.createElement('a');
      a.className = 'mm-sub-link';
      a.href = item.href;
      const strong = item.querySelector('strong');
      const span = item.querySelector('span');
      a.innerHTML = `<strong>${strong ? strong.textContent : ''}</strong>${span ? '<span>' + span.textContent + '</span>' : ''}`;
      subInner.appendChild(a);
    });
    sub.appendChild(subInner);
    body.appendChild(sub);

    trigger.addEventListener('click', () => {
      trigger.classList.toggle('open');
      sub.classList.toggle('open');
    });
  }

  // Regular nav links
  navLinks.forEach(link => {
    const a = document.createElement('a');
    a.className = 'mm-link';
    a.href = link.href;
    a.textContent = link.textContent.trim();
    body.appendChild(a);
  });

  // Divider
  const div = document.createElement('div');
  div.className = 'mm-divider';
  body.appendChild(div);

  // Footer actions
  footer.innerHTML = `
    <a href="https://app.qualiphy.me/signup" class="mm-btn mm-btn-primary">Sign Up Free</a>
    <a href="https://app.qualiphy.me/login" class="mm-btn mm-btn-secondary">Log In</a>
  `;

  // ── Toggle logic ──
  const hamburger = document.querySelector('.hamburger');
  const closeBtn = panel.querySelector('.mm-close');

  function openMenu() {
    panel.classList.add('open');
    overlay.classList.add('open');
    hamburger.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    panel.classList.remove('open');
    overlay.classList.remove('open');
    hamburger.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    panel.classList.contains('open') ? closeMenu() : openMenu();
  });
  closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);

  // Close on any link click inside panel
  panel.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      // Small delay so navigation feels intentional
      setTimeout(closeMenu, 100);
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('open')) closeMenu();
  });
}

