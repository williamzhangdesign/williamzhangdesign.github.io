// ============================================
// William Zhang, Atelier
// Count-up · Works reveal · Constellation
// ============================================

(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Progressive enhancement: CSS animations only apply when .js is present
  if (!reduced) document.documentElement.classList.add('js');

  // Click pulses — shared between the click handler and the constellation draw loop
  const clickPulses = [];

  // ---------- Count-up ----------
  const nodes = document.querySelectorAll('[data-count]');
  if (nodes.length) {
    if (reduced) {
      nodes.forEach(n => {
        const target = parseFloat(n.dataset.count);
        n.textContent = target % 1 === 0 ? Math.round(target).toString() : target.toFixed(1);
      });
    } else {
      // Reset to 0 so the count-up animation is visible
      nodes.forEach(n => {
        const target = parseFloat(n.dataset.count);
        n.textContent = target % 1 === 0 ? '0' : '0.0';
      });
      const start = performance.now();
      const dur = 1400;
      const frame = (t) => {
        const p = Math.min(1, (t - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        nodes.forEach(n => {
          const target = parseFloat(n.dataset.count);
          const val = target * eased;
          n.textContent = target % 1 === 0 ? Math.round(val).toString() : val.toFixed(1);
        });
        if (p < 1) requestAnimationFrame(frame);
      };
      setTimeout(() => requestAnimationFrame(frame), 700);
    }
  }

  // ---------- Works reveal ----------
  const works = document.getElementById('works');
  if (works) {
    window.addEventListener('load', () => works.classList.add('revealed'));
  }

  // ---------- Archive sort toggle ----------
  const sortToggle = document.querySelector('.sort-toggle');
  if (sortToggle) {
    const tbody = document.querySelector('table.archive tbody');
    const opts = sortToggle.querySelectorAll('.sort-opt');
    const apply = (mode) => {
      if (!tbody) return;
      const rows = Array.from(tbody.querySelectorAll('tr.row'));
      rows.sort((a, b) => mode === 'recency'
        ? Number(b.dataset.year) - Number(a.dataset.year)
        : Number(a.dataset.impact) - Number(b.dataset.impact));
      rows.forEach((r, i) => {
        const num = r.querySelector('.num');
        if (num) num.textContent = String(i + 1).padStart(2, '0');
        tbody.appendChild(r);
      });
    };
    opts.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.sort;
        if (sortToggle.dataset.active === mode) return;
        sortToggle.dataset.active = mode;
        opts.forEach(o => {
          const on = o === btn;
          o.classList.toggle('active', on);
          o.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        apply(mode);
      });
    });
  }

  // ---------- Constellation ----------
  const cv = document.getElementById('stars');
  if (cv) {
    const ctx = cv.getContext('2d');
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0, h = 0;
    let stars = [];
    let mouse = { x: -9999, y: -9999 };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      cv.width = w * DPR; cv.height = h * DPR;
      cv.style.width = w + 'px'; cv.style.height = h + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };

    const init = () => {
      resize();
      const count = Math.min(70, Math.floor((w * h) / 28000));
      stars = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
          r: Math.random() * 1.2 + 0.4,
          base: 0.12 + Math.random() * 0.22,
          phase: Math.random() * Math.PI * 2
        });
      }
    };

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);

      // Age click pulses: shrink life each frame, drop when dead
      for (let i = clickPulses.length - 1; i >= 0; i--) {
        clickPulses[i].life -= 0.025;
        if (clickPulses[i].life <= 0) clickPulses.splice(i, 1);
      }

      for (let i = 0; i < stars.length; i++) {
        const a = stars[i];
        for (let j = i + 1; j < stars.length; j++) {
          const b = stars[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 140 * 140) {
            const alpha = (1 - Math.sqrt(d2) / 140) * 0.05;
            ctx.strokeStyle = `rgba(232, 212, 162, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const s of stars) {
        s.x += s.vx; s.y += s.vy;
        if (s.x < 0) s.x = w; if (s.x > w) s.x = 0;
        if (s.y < 0) s.y = h; if (s.y > h) s.y = 0;

        const dx = s.x - mouse.x, dy = s.y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        let boost = 0;
        if (d < 180) boost = (1 - d / 180) * 0.6;

        // Click pulse contribution: each active pulse brightens nearby stars, decays over its life
        let clickBoost = 0;
        for (const p of clickPulses) {
          const pdx = s.x - p.x, pdy = s.y - p.y;
          const pd = Math.sqrt(pdx * pdx + pdy * pdy);
          if (pd < 220) {
            const contribution = (1 - pd / 220) * p.life * 0.9;
            if (contribution > clickBoost) clickBoost = contribution;
          }
        }

        const twinkle = Math.sin(t * 0.001 + s.phase) * 0.08;
        const alpha = Math.max(0, Math.min(1, s.base + twinkle + boost + clickBoost));

        ctx.fillStyle = `rgba(232, 212, 162, ${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(draw);
    };

    window.addEventListener('resize', init);
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

    init();
    requestAnimationFrame(draw);
  }

  // Gold ring ripple spawned at the cursor on each click
  const spawnRipple = (x, y) => {
    const r = document.createElement('div');
    r.className = 'click-ripple';
    r.style.left = x + 'px';
    r.style.top = y + 'px';
    document.body.appendChild(r);
    const anim = r.animate(
      [
        { transform: 'translate(-50%, -50%) scale(0.3)', opacity: 0.85 },
        { transform: 'translate(-50%, -50%) scale(4)',   opacity: 0 }
      ],
      { duration: 520, easing: 'cubic-bezier(0.2, 0, 0, 1)' }
    );
    anim.onfinish = () => r.remove();
  };

  document.addEventListener('pointerdown', (e) => {
    spawnRipple(e.clientX, e.clientY);
    clickPulses.push({ x: e.clientX, y: e.clientY, life: 1 });
  }, { passive: true });
})();
