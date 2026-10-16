(() => {
  const S = window.SITE;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const PATHS = {
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/>',
    server: '<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01"/>',
    pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z"/>',
    ext: '<path d="M15 3h6v6M10 14L21 3M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/>',
    linkedin: '<path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>',
    instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.4A4 4 0 1112.6 8 4 4 0 0116 11.4zM17.5 6.5h.01"/>',
    x: '<path fill="currentColor" stroke="none" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M15.5 12.9L17 22l-5-3-5 3 1.5-9.1"/>',
    github: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 00-.9-2.6c3.1-.3 6.4-1.5 6.4-7A5.4 5.4 0 0020 4.8 5 5 0 0019.9 1S18.7.7 16 2.5a13.4 13.4 0 00-7 0C6.3.7 5.1 1 5.1 1A5 5 0 005 4.8a5.4 5.4 0 00-1.5 3.7c0 5.4 3.3 6.6 6.4 7a3.4 3.4 0 00-.9 2.6V22"/>',
  };
  const icon = (n, cls = "i") => `<svg class="${cls}" viewBox="0 0 24 24">${PATHS[n] || ""}</svg>`;
  const tags = (list) => `<div class="tags">${list.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>`;
  const CATS = { security: "Güvenlik", web: "Web", mobile: "macOS" };

  // giriş
  $("role").textContent = S.role;
  $("tagline").textContent = S.tagline;

  // hakkımda
  $("aboutText").innerHTML = S.about.map((p) => `<p>${esc(p)}</p>`).join("");
  $("focus").innerHTML = S.focus
    .map((f) => `<div class="focus-item"><span class="badge">${icon(f.icon)}</span><div><b>${esc(f.title)}</b><span>${esc(f.text)}</span></div></div>`)
    .join("");

  // deneyim
  const ongoing = (when) => /günümüz|devam/i.test(when);
  $("experience").innerHTML = S.experience
    .map(
      (e) => `<li class="${ongoing(e.when) ? "now" : ""}">
        <span class="dot" aria-hidden="true"></span>
        <span class="when">${esc(e.when)}</span>
        <div>
          <h3>${esc(e.role)} <span class="org">· ${esc(e.org)}</span></h3>
          ${e.text ? `<p>${esc(e.text)}</p>` : ""}
        </div>
      </li>`
    )
    .join("");

  // sertifikalar
  $("certs").innerHTML = S.certs
    .map(
      (c) => `<div class="glass cert">
        <span class="seal">${icon("award")}</span>
        <div><h3>${esc(c.title)}</h3><p class="cert-meta">${esc(c.text)}</p></div>
        <span class="year">${esc(c.when)}</span>
      </div>`
    )
    .join("");

  // projeler
  $("projects").innerHTML = S.projects
    .map(
      (p) => `<article class="glass project${p.featured ? " lg" : ""}">
        <span class="eyebrow">${esc(CATS[p.category] || p.category)} · ${esc(p.year)}</span>
        <h3>${esc(p.title)}</h3>
        <p class="summary">${esc(p.summary)}</p>
        ${p.points?.length ? `<ul>${p.points.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
        ${tags(p.stack)}
        ${p.links?.length ? `<div class="links">${p.links.map((l) => `<a class="more" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(l.label)} ${icon("ext")}</a>`).join("")}</div>` : ""}
      </article>`
    )
    .join("");

  // güvenlik
  const cards = (items) => items.map((i) => `<div class="glass sec-card"><h3>${esc(i.title)}</h3><p>${esc(i.text)}</p></div>`).join("");
  $("secIntro").textContent = S.security.intro;
  $("secItems").innerHTML = cards(S.security.items);

  // teknolojiler
  $("stackList").innerHTML = Object.entries(S.stack)
    .map(([g, items]) => `<div><dt>${esc(g)}</dt><dd>${tags(items)}</dd></div>`)
    .join("");

  // iletişim
  const mail = S.contact.email;
  $("emailBig").textContent = mail;
  $("emailBig").href = "mailto:" + mail;
  const copyBtn = $("copyBtn");
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(mail);
      copyBtn.textContent = "Kopyalandı ✓";
      copyBtn.classList.add("done");
      setTimeout(() => { copyBtn.textContent = "Kopyala"; copyBtn.classList.remove("done"); }, 1800);
    } catch {
      location.href = "mailto:" + mail;
    }
  });
  $("socials").innerHTML = S.contact.links
      .map((l) => `<a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${icon(PATHS[l.label.toLowerCase()] ? l.label.toLowerCase() : "ext")}<span>${esc(l.label)}</span>${icon("ext", "i ext")}</a>`)
      .join("");
  $("footer").textContent = `© ${new Date().getFullYear()} ${S.domain}`;

  // belirme
  const io = new IntersectionObserver(
    (es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))),
    { threshold: 0.08 }
  );
  document.querySelectorAll("main h2, main .glass, main > section > .lead").forEach((el) => { el.classList.add("reveal"); io.observe(el); });

  // menüde bulunulan bölümü vurgula
  const navLinks = [...document.querySelectorAll(".nav a")];
  const spy = new IntersectionObserver(
    (es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
    }),
    { rootMargin: "-45% 0px -50% 0px" }
  );
  navLinks.forEach((a) => { const sec = document.querySelector(a.getAttribute("href")); if (sec) spy.observe(sec); });
  new IntersectionObserver(([e]) => e.isIntersecting && navLinks.forEach((a) => a.classList.remove("active"))).observe($("top"));

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
  const canvas = $("flow");
  const ctx = canvas.getContext("2d");
  const COLOR = "#818cf8", TRAIL = 0.1, SPEED = 0.8;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
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
