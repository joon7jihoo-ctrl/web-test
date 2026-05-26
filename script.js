/* ============================================================
   한전KDN 홍보 페이지 JavaScript
   ============================================================ */

// ── 네비게이션 스크롤 효과 ──
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
    backToTop.classList.add('visible');
  } else {
    navbar.classList.remove('scrolled');
    backToTop.classList.remove('visible');
  }
});

// ── 맨 위로 버튼 ──
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── 모바일 햄버거 메뉴 ──
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// 메뉴 항목 클릭 시 닫기
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ── 숫자 카운터 애니메이션 ──
function animateCounter(el, target, duration = 1800) {
  const start = performance.now();
  const startVal = 0;

  function step(timestamp) {
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    // easeOutQuart
    const eased = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(startVal + (target - startVal) * eased);
    el.textContent = current.toLocaleString('ko-KR');
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString('ko-KR');
  }
  requestAnimationFrame(step);
}

// 1991 연도는 즉시 표시
const counterEls = document.querySelectorAll('.stat-num');
let counterStarted = false;

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !counterStarted) {
      counterStarted = true;
      counterEls.forEach(el => {
        const target = parseInt(el.dataset.target, 10);
        if (target === 1991) {
          el.textContent = '1991';
        } else {
          animateCounter(el, target);
        }
      });
    }
  });
}, { threshold: 0.5 });

const statsBanner = document.querySelector('.stats-banner');
if (statsBanner) statsObserver.observe(statsBanner);

// ── Scroll Reveal (Intersection Observer) ──
const revealEls = document.querySelectorAll(
  '.about-card, .biz-card, .tl-item, .pillar, .cinfo-item'
);

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = 'opacity .6s ease, transform .6s ease';
  revealObserver.observe(el);
});

// ── 연락처 폼 제출 ──
const contactForm = document.getElementById('contactForm');
const toast = createToast();

contactForm.addEventListener('submit', e => {
  e.preventDefault();
  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    showToast('❗ 필수 항목을 모두 입력해 주세요.', '#e74c3c');
    return;
  }

  // 실제 백엔드 연동 없이 UI 피드백만 제공
  contactForm.reset();
  showToast('✅ 문의가 접수되었습니다. 빠른 시일 내에 답변 드리겠습니다!', '#005fa3');
});

function createToast() {
  const el = document.createElement('div');
  el.className = 'toast';
  document.body.appendChild(el);
  return el;
}

function showToast(msg, bg = '#005fa3') {
  toast.textContent = msg;
  toast.style.background = bg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3800);
}

// ── 부드러운 네비게이션 앵커 스크롤 (navbar 높이 보정) ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 12;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
