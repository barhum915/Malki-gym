// mobile nav
const burger = document.querySelector('.burger');
const navlinks = document.querySelector('.navlinks');
if (burger) {
  burger.addEventListener('click', () => {
    navlinks.classList.toggle('open');
    burger.textContent = navlinks.classList.contains('open') ? '✕' : '☰';
  });
  navlinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navlinks.classList.remove('open');
    burger.textContent = '☰';
  }));
}

// scroll reveal
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in'));
}

// booking form (no backend — shows a confirmation locally)
const bookingForm = document.querySelector('#bookingForm');
if (bookingForm) {
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = document.querySelector('#formMsg');
    const name = document.querySelector('#name').value.trim();
    msg.textContent = `تم استلام طلبك يا ${name || 'صديقنا'}! رح يتواصل معك فريق النادي قريباً على الرقم يلي تركته. لأي استعجال، اتصل فينا مباشرة على 011 371 9281.`;
    msg.classList.add('show', 'ok');
    bookingForm.reset();
  });
}

// ---- scroll progress bar + header shrink ----
const progressBar = document.querySelector('.scroll-progress');
const siteHeader = document.querySelector('header.site');
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
  if (progressBar) progressBar.style.width = scrolled + '%';
  if (siteHeader) siteHeader.classList.toggle('shrink', h.scrollTop > 30);
}, { passive: true });

// ---- forge sparks generator ----
document.querySelectorAll('.sparks').forEach(container => {
  const count = 22;
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    s.className = 'spark';
    const left = Math.random() * 100;
    const duration = 4 + Math.random() * 5;
    const delay = Math.random() * 8;
    const drift = (Math.random() * 60 - 30) + 'px';
    const size = 2 + Math.random() * 2;
    s.style.left = left + '%';
    s.style.width = size + 'px';
    s.style.height = size + 'px';
    s.style.setProperty('--drift', drift);
    s.style.animationDuration = duration + 's';
    s.style.animationDelay = delay + 's';
    container.appendChild(s);
  }
});

// ---- animated number counters ----
const counters = document.querySelectorAll('.count[data-target]');
if ('IntersectionObserver' in window && counters.length) {
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.target);
      const decimals = el.dataset.target.includes('.') ? 1 : 0;
      const duration = 1400;
      const start = performance.now();
      function tick(now) {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target.toFixed(decimals);
      }
      requestAnimationFrame(tick);
      cio.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => cio.observe(c));
}

// ================= ACCOUNT / DASHBOARD DEMO =================
// NOTE: this is a front-end demo only — no real Google sign-in and no
// real database. It simulates the experience so it's ready to wire up
// to real Google OAuth + a backend later.
const loginView = document.querySelector('#loginView');
const dashView = document.querySelector('#dashView');
const loginForm = document.querySelector('#loginForm');
const googleBtn = document.querySelector('#googleDemoBtn');
const logoutBtn = document.querySelector('#logoutBtn');

function enterDashboard(memberName) {
  if (!loginView || !dashView) return;
  loginView.classList.add('dash-hidden');
  dashView.classList.remove('dash-hidden');

  const nameEl = document.querySelector('#dashName');
  const avatarEl = document.querySelector('#dashAvatar');
  const finalName = memberName && memberName.trim() ? memberName.trim() : 'عضو Malki Gym';
  if (nameEl) nameEl.textContent = finalName;
  if (avatarEl) avatarEl.textContent = finalName.trim().charAt(0) || 'M';

  // demo subscription data — replace with real data from your backend
  const daysLeft = 18, totalDays = 30;
  const pct = Math.round((daysLeft / totalDays) * 100);
  const ring = document.querySelector('#daysRing');
  if (ring) {
    requestAnimationFrame(() => { ring.style.setProperty('--pct', pct); });
  }
  const ringNum = document.querySelector('#daysRingNum');
  if (ringNum) ringNum.textContent = daysLeft;

  const popEls = document.querySelectorAll('.mini-stat, .dash-card');
  popEls.forEach(el => el.classList.remove('show'));
  requestAnimationFrame(() => {
    popEls.forEach((el, i) => {
      el.style.transitionDelay = (i * 0.08) + 's';
      requestAnimationFrame(() => el.classList.add('show'));
    });
  });

  // re-trigger the number counters inside the dashboard now that it's visible
  const dashCounters = dashView.querySelectorAll('.count[data-target]');
  dashCounters.forEach(el => {
    const target = parseFloat(el.dataset.target);
    const duration = 1200;
    const start = performance.now();
    function tick(now) {
      const p = Math.min(1, (now - start) / duration);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.querySelector('#loginName').value;
    enterDashboard(name);
  });
}
if (googleBtn) {
  googleBtn.addEventListener('click', () => {
    enterDashboard('زائر تجريبي (جوجل)');
  });
}
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    dashView.classList.add('dash-hidden');
    loginView.classList.remove('dash-hidden');
    if (loginForm) loginForm.reset();
  });
}
