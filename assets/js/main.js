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
    .mm-logo-mark{width:28px;height:28px;background:#5b50ff;border-radius:7px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:12px}
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
    .mm-btn-primary{background:#5b50ff;color:#fff}.mm-btn-primary:hover{background:#7b73ff}
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
      <div class="mm-logo"><div class="mm-logo-mark">Q</div>Qualiphy</div>
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
    <button onclick="openDemoModal()" class="mm-btn mm-btn-primary demo-trigger">Book a Demo</button>
    <a href="https://app.qualiphy.me/signup" class="mm-btn mm-btn-secondary">Sign Up Free</a>
    <a href="https://app.qualiphy.me/login" class="mm-btn mm-btn-ghost">Log In</a>
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


/* =============================================================
   DEMO PRE-SCREEN MODAL
   4-question qualifier before routing to Calendly.
   Triggered by any element with class "demo-trigger".
   ============================================================= */
(function() {
  const DEMO_QUESTIONS = [
    { id: 'hasAccount', q: 'Do you have a Qualiphy account?', options: [
      { value: 'yes', label: 'Yes, I have an account' },
      { value: 'no', label: 'No, not yet' },
    ]},
    { id: 'practiceType', q: 'What type of practice do you run?', options: [
      { value: 'medspa', label: 'Med Spa / Aesthetics' },
      { value: 'weightloss', label: 'Weight Loss Clinic' },
      { value: 'wellness', label: 'Wellness / IV Therapy' },
      { value: 'virtual', label: 'Virtual Practice' },
      { value: 'multi', label: 'Multi-Location Group' },
      { value: 'other', label: 'Other' },
    ]},
    { id: 'hasWordPress', q: 'Is your website built on WordPress?', options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'unsure', label: 'Not sure' },
    ]},
    { id: 'hasDev', q: 'Do you have a web developer or technical team?', options: [
      { value: 'yes', label: 'Yes, we have a developer' },
      { value: 'no', label: 'No' },
      { value: 'self', label: 'I handle it myself' },
    ]},
  ];

  const CALENDLY_BASE = 'https://calendly.com/d/cxgt-8tr-sd5/qualiphy-gfe-rx-fulfillment-solution';
  let demoAnswers = {};
  let demoStep = 0;
  let overlay, modal;

  function injectStyles() {
    const s = document.createElement('style');
    s.textContent = `
      .dm-overlay{position:fixed;inset:0;background:rgba(15,23,41,.55);z-index:300;opacity:0;visibility:hidden;transition:opacity .25s ease,visibility .25s ease;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:20px}
      .dm-overlay.open{opacity:1;visibility:visible}
      .dm-modal{background:#fff;border-radius:16px;width:100%;max-width:440px;box-shadow:0 20px 60px rgba(0,0,0,.2);transform:translateY(12px) scale(.97);transition:transform .25s ease;overflow:hidden}
      .dm-overlay.open .dm-modal{transform:translateY(0) scale(1)}
      .dm-header{padding:24px 24px 0;display:flex;justify-content:space-between;align-items:flex-start}
      .dm-close{width:32px;height:32px;border-radius:8px;border:none;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#78716c;transition:background .15s}
      .dm-close:hover{background:#f5f3f0}
      .dm-body{padding:8px 24px 24px}
      .dm-progress{display:flex;gap:4px;margin-bottom:20px}
      .dm-progress-bar{flex:1;height:3px;border-radius:2px;background:#e7e5e4;transition:background .3s}
      .dm-progress-bar.active{background:#4D3D71}
      .dm-label{font-family:'Plus Jakarta Sans',sans-serif;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:#a8a29e;margin-bottom:8px}
      .dm-question{font-family:'Plus Jakarta Sans',sans-serif;font-size:17px;font-weight:700;color:#1B1B1B;margin:0 0 18px;line-height:1.3}
      .dm-options{display:flex;flex-direction:column;gap:6px}
      .dm-opt{display:block;width:100%;padding:12px 16px;border-radius:10px;border:1.5px solid #e7e5e4;background:#fff;cursor:pointer;text-align:left;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;font-weight:600;color:#1B1B1B;transition:all .15s}
      .dm-opt:hover{border-color:#4D3D71;background:rgba(77,61,113,.04)}
      .dm-back{display:inline-flex;align-items:center;gap:4px;padding:8px 10px;border:none;background:transparent;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:600;color:#78716c;margin-top:10px;border-radius:6px;transition:background .15s}
      .dm-back:hover{background:#f5f3f0}
    `;
    document.head.appendChild(s);
  }

  function buildModal() {
    overlay = document.createElement('div');
    overlay.className = 'dm-overlay';
    overlay.innerHTML = '<div class="dm-modal"><div class="dm-header"><div></div><button class="dm-close" aria-label="Close"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button></div><div class="dm-body"></div></div>';
    document.body.appendChild(overlay);
    modal = overlay.querySelector('.dm-modal');
    overlay.querySelector('.dm-close').addEventListener('click', closeDemo);
    overlay.addEventListener('click', function(e) { if (e.target === overlay) closeDemo(); });
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape' && overlay.classList.contains('open')) closeDemo(); });
  }

  function renderStep() {
    const q = DEMO_QUESTIONS[demoStep];
    const body = overlay.querySelector('.dm-body');
    let html = '<div class="dm-progress">';
    for (let i = 0; i < DEMO_QUESTIONS.length; i++) {
      html += '<div class="dm-progress-bar' + (i <= demoStep ? ' active' : '') + '"></div>';
    }
    html += '</div>';
    html += '<div class="dm-label">Question ' + (demoStep + 1) + ' of ' + DEMO_QUESTIONS.length + '</div>';
    html += '<div class="dm-question">' + q.q + '</div>';
    html += '<div class="dm-options">';
    q.options.forEach(function(opt) {
      html += '<button class="dm-opt" data-value="' + opt.value + '">' + opt.label + '</button>';
    });
    html += '</div>';
    if (demoStep > 0) html += '<button class="dm-back">← Back</button>';
    body.innerHTML = html;

    body.querySelectorAll('.dm-opt').forEach(function(btn) {
      btn.addEventListener('click', function() {
        demoAnswers[q.id] = btn.getAttribute('data-value');
        if (demoStep < DEMO_QUESTIONS.length - 1) {
          demoStep++;
          renderStep();
        } else {
          finishDemo();
        }
      });
    });
    var backBtn = body.querySelector('.dm-back');
    if (backBtn) backBtn.addEventListener('click', function() { demoStep--; renderStep(); });
  }

  function finishDemo() {
    var params = new URLSearchParams();
    params.set('utm_source', 'quidget_site');
    params.set('utm_medium', 'demo_modal');
    params.set('utm_content', demoAnswers.hasAccount === 'yes' ? 'quidget_demo' : 'platform_demo');
    params.set('utm_campaign', demoAnswers.practiceType || '');
    // Prefill name fields aren't available, but pass context via UTM
    var url = CALENDLY_BASE + '?' + params.toString();
    window.open(url, '_blank', 'noopener');
    closeDemo();
  }

  function openDemo() {
    demoStep = 0;
    demoAnswers = {};
    renderStep();
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDemo() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Init on DOM ready
  document.addEventListener('DOMContentLoaded', function() {
    injectStyles();
    buildModal();
    // Bind all demo triggers
    document.querySelectorAll('.demo-trigger').forEach(function(el) {
      el.addEventListener('click', function(e) {
        e.preventDefault();
        openDemo();
      });
    });
  });

  // Expose globally for inline onclick if needed
  window.openDemoModal = openDemo;
})();
