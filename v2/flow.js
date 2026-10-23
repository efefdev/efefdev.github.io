// Tüm sayfalarda ortak: akış alanı arka planı, belirme, kart ışığı, menü vurgusu.
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // belirme
  const io = new IntersectionObserver(
    (es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))),
    { threshold: 0.08 }
  );
  window.revealAll = () =>
    document.querySelectorAll("main h2, main .glass, main .lead, main .reveal-me").forEach((el) => {
      if (el.classList.contains("reveal")) return;
      el.classList.add("reveal");
      io.observe(el);
    });
  window.revealAll();

  // menüde bulunulan bölümü vurgula (yalnızca sayfa içi linkler)
  const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
  if (navLinks.length) {
    const spy = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (!e.isIntersecting) return;
        navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
      }),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    navLinks.forEach((a) => { const sec = document.querySelector(a.getAttribute("href")); if (sec) spy.observe(sec); });
    const top = document.getElementById("top");
    if (top) new IntersectionObserver(([e]) => e.isIntersecting && navLinks.forEach((a) => a.classList.remove("active"))).observe(top);
  }

  // kartlarda fareyi izleyen ışık
  if (matchMedia("(hover: hover)").matches) {
    document.addEventListener("pointermove", (e) => {
      const card = e.target.closest?.(".glass");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    }, { passive: true });
  }

  // akış alanı arka planı (efealtintas.com'daki NeuralBackground'un framework'süz hali)
  const canvas = document.getElementById("flow");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const COLOR = "#818cf8", TRAIL = 0.1, SPEED = 0.8;
  let width = 0, height = 0, particles = [];
  const mouse = { x: -1000, y: -1000 };

  const spawn = (p) => Object.assign(p, { x: Math.random() * width, y: Math.random() * height, vx: 0, vy: 0, age: 0, life: Math.random() * 200 + 100 });
  const size = () => {
    width = innerWidth; height = innerHeight;
    const dpr = devicePixelRatio || 1;
    canvas.width = width * dpr; canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const step = () => {
    ctx.globalAlpha = 1;
    ctx.fillStyle = `rgba(0,0,0,${TRAIL})`;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = COLOR;
    for (const p of particles) {
      const a = (Math.cos(p.x * 0.005) + Math.sin(p.y * 0.005)) * Math.PI;
      p.vx += Math.cos(a) * 0.2 * SPEED;
      p.vy += Math.sin(a) * 0.2 * SPEED;
      const dx = mouse.x - p.x, dy = mouse.y - p.y, d = Math.hypot(dx, dy);
      if (d < 150) { const f = (150 - d) / 150; p.vx -= dx * f * 0.05; p.vy -= dy * f * 0.05; }
      p.x += p.vx; p.y += p.vy; p.vx *= 0.95; p.vy *= 0.95;
      if (++p.age > p.life) spawn(p);
      if (p.x < 0) p.x = width; else if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height; else if (p.y > height) p.y = 0;
      ctx.globalAlpha = 1 - Math.abs(p.age / p.life - 0.5) * 2;
      ctx.fillRect(p.x, p.y, 1.5, 1.5);
    }
  };
  let raf = 0;
  const loop = () => { step(); raf = requestAnimationFrame(loop); };
  // sekme arkadayken animasyonu durdur
  document.addEventListener("visibilitychange", () => {
    if (reduce) return;
    if (document.hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(loop);
  });

  size();
  particles = Array.from({ length: width < 600 ? 450 : 800 }, () => spawn({}));
  if (reduce) { for (let i = 0; i < 60; i++) step(); } else loop();

  let t;
  addEventListener("resize", () => {
    clearTimeout(t);
    t = setTimeout(() => {
      if (Math.abs(innerWidth - width) < 2 && Math.abs(innerHeight - height) < 80) return; // iOS adres çubuğu
      size();
      if (reduce) for (let i = 0; i < 60; i++) step();
    }, 200);
  });
  addEventListener("pointermove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  document.addEventListener("pointerleave", () => { mouse.x = mouse.y = -1000; });
})();
