/* ==========================================
   STARFIELD + INTERACTIVITY
   ========================================== */

// ─── Starfield ───────────────────────────────────────────────
(function () {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');

  let W, H, stars;

  const STAR_COUNT = 160;
  const TWINKLE_SPEED = 0.005;

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function initStars() {
    stars = Array.from({ length: STAR_COUNT }, () => ({
      x: rand(0, W),
      y: rand(0, H),
      r: rand(0.3, 1.6),
      alpha: rand(0.1, 0.7),
      dAlpha: rand(TWINKLE_SPEED * 0.5, TWINKLE_SPEED) * (Math.random() > 0.5 ? 1 : -1),
      speed: rand(0.02, 0.06),
    }));
  }

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initStars();
  }

  function drawStars() {
    ctx.clearRect(0, 0, W, H);

    for (const s of stars) {
      // Twinkle
      s.alpha += s.dAlpha;
      if (s.alpha <= 0.05 || s.alpha >= 0.75) s.dAlpha *= -1;
      s.alpha = Math.max(0.05, Math.min(0.75, s.alpha));

      // Subtle upward drift
      s.y -= s.speed;
      if (s.y < -2) s.y = H + 2;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
      ctx.fill();
    }

    requestAnimationFrame(drawStars);
  }

  window.addEventListener('resize', resize);
  resize();
  drawStars();
})();


// ─── Parallax on mouse move (desktop only) ───────────────────
(function () {
  // Skip entirely on touch/mobile devices
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const orbs = document.querySelectorAll('.orb');
  const container = document.querySelector('.container');

  window.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;  // -1 to 1
    const dy = (e.clientY - cy) / cy;

    orbs.forEach((orb, i) => {
      const factor = (i + 1) * 10;
      orb.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
    });

    // Subtle container tilt
    const maxTilt = 3;
    container.style.transform = `
      perspective(1000px)
      rotateX(${-dy * maxTilt}deg)
      rotateY(${dx * maxTilt}deg)
    `;
  });

  window.addEventListener('mouseleave', () => {
    orbs.forEach(orb => { orb.style.transform = ''; });
    container.style.transform = '';
  });
})();


// ─── Link card ripple effect ──────────────────────────────────
(function () {
  document.querySelectorAll('.link-card').forEach(card => {
    card.addEventListener('pointerdown', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(155, 135, 245, 0.18);
        transform: translate(-50%, -50%);
        pointer-events: none;
        animation: ripple-expand 0.55s cubic-bezier(0.4,0,0.2,1) forwards;
      `;
      card.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  // Inject ripple keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple-expand {
      to {
        width: 400px;
        height: 400px;
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
})();
