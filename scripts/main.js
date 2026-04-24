// ============================================
// William Zhang, Atelier
// Clock · Count-up · Works reveal · Constellation
// ============================================

(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Progressive enhancement: CSS animations only apply when .js is present
  if (!reduced) document.documentElement.classList.add('js');

  // Click pulses — shared between the click handler and the constellation draw loop
  const clickPulses = [];

  // Intro state (Milky Way loading animation on the home page)
  const introState = { active: false, start: 0, duration: 3000 };

  // ---------- Clock (Chicago) ----------
  const clock = document.getElementById('clock');
  if (clock) {
    const fmt = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Chicago',
      hour: 'numeric', minute: '2-digit', hour12: true
    });
    const tick = () => { clock.textContent = fmt.format(new Date()); };
    tick();
    setInterval(tick, 15000);
  }

  // ---------- Weather (Chicago) ----------
  const weather = document.getElementById('weather');
  if (weather) {
    // WMO weather code → short glyph
    const glyph = (c) => {
      if (c === 0) return '☀';
      if (c <= 2) return '⛅';
      if (c === 3) return '☁';
      if (c >= 45 && c <= 48) return '🌫';
      if (c >= 51 && c <= 67) return '🌧';
      if (c >= 71 && c <= 77) return '❄';
      if (c >= 80 && c <= 82) return '🌧';
      if (c >= 85 && c <= 86) return '❄';
      if (c >= 95) return '⛈';
      return '·';
    };
    const url = 'https://api.open-meteo.com/v1/forecast'
      + '?latitude=41.8781&longitude=-87.6298'
      + '&current=temperature_2m,weather_code'
      + '&temperature_unit=fahrenheit&timezone=America/Chicago';
    fetch(url)
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(d => {
        const t = Math.round(d.current.temperature_2m);
        weather.textContent = `${glyph(d.current.weather_code)} ${t}°F`;
      })
      .catch(() => { weather.textContent = '…'; });
  }

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
      // Intro progress: 0 at start, 1 at end, clamped. active=false outside intro.
      let introProgress = 1;
      if (introState.active) {
        introProgress = Math.min(1, (performance.now() - introState.start) / introState.duration);
        if (introProgress >= 1) introState.active = false;
      }

      ctx.clearRect(0, 0, w, h);

      // Slow inward swirl toward screen center during intro
      if (introState.active) {
        const cx = w / 2, cy = h / 2;
        const ease = Math.pow(1 - introProgress, 1.4);
        const inwardSpeed = 2.2 * ease;
        const spiral = 0.18;
        for (const s of stars) {
          const dx = cx - s.x, dy = cy - s.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 2) continue;
          const nx = dx / dist, ny = dy / dist;
          // Tangential perpendicular gives the gentle swirl quality
          s.x += inwardSpeed * (nx + spiral * -ny);
          s.y += inwardSpeed * (ny + spiral * nx);
        }
      }

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

        const totalBoost = boost + clickBoost;
        if (totalBoost > 0.1) {
          ctx.fillStyle = `rgba(232, 212, 162, ${totalBoost * 0.15})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      requestAnimationFrame(draw);
    };

    window.addEventListener('resize', init);
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

    init();
    requestAnimationFrame(draw);
  }

  // Click sound (satisfying tactile tick + thump, synthesized via Web Audio)
  let audioCtx = null;
  const getCtx = () => {
    if (audioCtx) return audioCtx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
    return audioCtx;
  };
  const playClick = () => {
    const ctx = getCtx();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.value = 0.4;
    master.connect(ctx.destination);

    // Typewriter keystroke: three noise voices stacked, no sine tone.
    // Reads as a mechanical "clack" with wooden body and a metallic edge.
    const makeNoise = (dur, curve) => {
      const b = ctx.createBuffer(1, Math.max(1, Math.floor(ctx.sampleRate * dur)), ctx.sampleRate);
      const d = b.getChannelData(0);
      for (let i = 0; i < d.length; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, curve);
      }
      return b;
    };
    const playNoise = (buf, freq, Q, peak, dur, filterType) => {
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const f = ctx.createBiquadFilter();
      f.type = filterType || 'bandpass';
      f.frequency.value = freq;
      f.Q.value = Q;
      const g = ctx.createGain();
      g.gain.setValueAtTime(peak, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + dur);
      src.connect(f).connect(g).connect(master);
      src.start(now);
      src.stop(now + dur + 0.005);
    };

    // 1. Metallic edge: tight high-frequency spark (key lever pivoting).
    playNoise(makeNoise(0.004, 3),  3500 + Math.random() * 400, 3,   0.14, 0.004);
    // 2. Main clack: broader mid-range percussive hit (key strike).
    playNoise(makeNoise(0.009, 2),  1400 + Math.random() * 250, 1.5, 0.5,  0.009);
    // 3. Wooden body: low-mid resonance (type bar impact).
    playNoise(makeNoise(0.016, 1.5), 240 + Math.random() * 50,   1,   0.22, 0.016);
  };
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
    playClick();
    spawnRipple(e.clientX, e.clientY);
    clickPulses.push({ x: e.clientX, y: e.clientY, life: 1 });
  }, { passive: true });

  // PS2-inspired synthesized intro audio (cinematic drone + chime at the peak).
  // Real Sony audio is copyrighted; this is a non-infringing tribute using the
  // same dramatic shape: sub-bass rise, glassy detuned pad, impact chime at ~2.5s.
  const playIntroSound = () => {
    const actx = getCtx();
    if (!actx) return;
    if (actx.state === 'suspended') actx.resume().catch(() => {});
    const now = actx.currentTime;
    const master = actx.createGain();
    master.gain.value = 0.28;
    master.connect(actx.destination);

    // Sub-bass drone rising from 55 Hz to 110 Hz
    const sub = actx.createOscillator();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(55, now);
    sub.frequency.exponentialRampToValueAtTime(110, now + 2.5);
    const subG = actx.createGain();
    subG.gain.setValueAtTime(0.0001, now);
    subG.gain.linearRampToValueAtTime(0.45, now + 1.8);
    subG.gain.linearRampToValueAtTime(0.0001, now + 3.1);
    sub.connect(subG).connect(master);
    sub.start(now); sub.stop(now + 3.15);

    // Mid triangle drone, octave + fifth up
    const mid = actx.createOscillator();
    mid.type = 'triangle';
    mid.frequency.setValueAtTime(165, now);
    mid.frequency.exponentialRampToValueAtTime(220, now + 2.5);
    const midG = actx.createGain();
    midG.gain.setValueAtTime(0.0001, now);
    midG.gain.linearRampToValueAtTime(0.18, now + 2.2);
    midG.gain.linearRampToValueAtTime(0.0001, now + 3);
    mid.connect(midG).connect(master);
    mid.start(now); mid.stop(now + 3.05);

    // Glassy detuned pad cluster (shimmer)
    [440, 554, 659, 880].forEach((f) => {
      const o = actx.createOscillator();
      o.type = 'sine';
      o.frequency.value = f + (Math.random() - 0.5) * 5;
      const g = actx.createGain();
      g.gain.setValueAtTime(0.0001, now);
      g.gain.linearRampToValueAtTime(0.05, now + 2);
      g.gain.linearRampToValueAtTime(0.0001, now + 2.8);
      o.connect(g).connect(master);
      o.start(now); o.stop(now + 2.85);
    });

    // Impact chime at 2.5s — the "landing" moment
    const chime = actx.createOscillator();
    chime.type = 'sine';
    chime.frequency.value = 1320;
    const chimeG = actx.createGain();
    const ct = now + 2.5;
    chimeG.gain.setValueAtTime(0.0001, ct);
    chimeG.gain.linearRampToValueAtTime(0.4, ct + 0.01);
    chimeG.gain.exponentialRampToValueAtTime(0.001, ct + 0.9);
    chime.connect(chimeG).connect(master);
    chime.start(ct); chime.stop(ct + 0.95);
  };

  // Home page intro trigger — detect via the #works element (home only).
  // Intro synth audio (playIntroSound) is defined above and kept in code;
  // it is currently disabled here. Uncomment the try/catch to re-enable.
  if (document.getElementById('works')) {
    document.body.classList.add('intro-loading');
    introState.active = true;
    introState.start = performance.now();
    // try { playIntroSound(); } catch (e) { /* autoplay blocked, silent fallback */ }
    // Start the content fade ~900ms before the intro visually ends so the two
    // transitions overlap instead of producing a hard cut at t = duration.
    setTimeout(() => {
      document.body.classList.remove('intro-loading');
      document.body.classList.add('intro-done');
    }, introState.duration - 900);
  }
})();
