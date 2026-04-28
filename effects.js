/* =========================
   スクロール フェードイン
   ========================= */
const animatedElements = document.querySelectorAll(
  'section, .plan, .statement'
);

animatedElements.forEach((el, i) => {
  el.setAttribute('data-animate', '');
  el.style.transitionDelay = `${i * 80}ms`;
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

animatedElements.forEach(el => observer.observe(el));

/* =========================
   マウストレイル（波打ち・慣性・後端フェード）
   ========================= */
const TRAIL_LENGTH = 22;
const FOLLOW_EASE = 0.35;
const WAVE_AMPLITUDE = 5;
const WAVE_SPEED = 0.25;

const trail = document.createElement("div");
trail.className = "mouse-trail";
document.body.appendChild(trail);

const points = [];
let time = 0;

for (let i = 0; i < TRAIL_LENGTH; i++) {
  const el = document.createElement("span");
  trail.appendChild(el);
  points.push({ x: 0, y: 0, el });
}

let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateTrail() {
  time += WAVE_SPEED;

  /* 先頭は必ずマウス */
  points[0].x = mouseX;
  points[0].y = mouseY;

  /* 後続は慣性追従 */
  for (let i = 1; i < points.length; i++) {
    points[i].x += (points[i - 1].x - points[i].x) * FOLLOW_EASE;
    points[i].y += (points[i - 1].y - points[i].y) * FOLLOW_EASE;
  }

  /* 描画 */
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const next = points[i + 1] || p;

    const dx = next.x - p.x;
    const dy = next.y - p.y;
    const distance = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    const wave =
      Math.sin(time + i * 0.6) *
      WAVE_AMPLITUDE *
      (1 - i / points.length);

    const opacity = 1 - i / points.length;

    p.el.style.width = `${distance}px`;
    p.el.style.left = `${p.x}px`;
    p.el.style.top = `${p.y + wave}px`;
    p.el.style.opacity = opacity;
    p.el.style.transform = `rotate(${angle}deg)`;
  }

  requestAnimationFrame(animateTrail);
}

animateTrail();

/* =========================
   対応ジャンル hover 余韻
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.genre-list li').forEach(item => {
    let timer;

    item.addEventListener('mouseenter', () => {
      clearTimeout(timer);
      item.classList.add('is-hovered');
    });

    item.addEventListener('mouseleave', () => {
      timer = setTimeout(() => {
        item.classList.remove('is-hovered');
      }, 180);
    });
  });
});