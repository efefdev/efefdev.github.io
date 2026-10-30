// Ana sayfa: /data.js'teki içeriği yerleştirir, giriş kolajını kurar (sürüklenip fırlatılabilir).
// Ortak efektler fx.js'te; bu dosya fx.js'ten sonra yüklenir.
(() => {
  const S = window.SITE;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const PATHS = {
    ext: '<path d="M15 3h6v6M10 14L21 3M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>',
    linkedin: '<path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>',
    instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.4A4 4 0 1112.6 8 4 4 0 0116 11.4zM17.5 6.5h.01"/>',
    x: '<path fill="currentColor" stroke="none" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>',
    github: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 00-.9-2.6c3.1-.3 6.4-1.5 6.4-7A5.4 5.4 0 0020 4.8 5 5 0 0019.9 1S18.7.7 16 2.5a13.4 13.4 0 00-7 0C6.3.7 5.1 1 5.1 1A5 5 0 005 4.8a5.4 5.4 0 00-1.5 3.7c0 5.4 3.3 6.6 6.4 7a3.4 3.4 0 00-.9 2.6V22"/>',
  };
  const icon = (n) => `<svg class="i" viewBox="0 0 24 24">${PATHS[n] || PATHS.ext}</svg>`;
  const tags = (list) => `<div class="tags">${list.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>`;
  // "Linux" Türkçe büyük harfe çevrilince "LİNUX" olmasın diye lang="en"
  const CATS = { security: "Güvenlik", web: "Web", mobile: 'macOS · <span lang="en">Linux</span>' };

  // ---------- giriş ----------
  $("role").textContent = S.role;
  $("tagline").textContent = S.tagline;

  // ---------- projeler ----------
  $("projects").innerHTML = S.projects
    .map((p, n) => {
      const id = `p${n}`;
      return `<article class="project rv${p.featured ? " lg" : ""}">
        <span class="eyebrow">REC ${String(n + 1).padStart(2, "0")} · ${CATS[p.category] || esc(p.category)} · ${esc(p.year)}</span>
        <h3>${esc(p.title)}</h3>
        <p class="hook">${esc(p.hook || p.summary)}</p>
        ${p.demo ? `<div class="demo demo-${esc(p.demo)}" data-demo="${esc(p.demo)}"></div>` : ""}
        ${tags(p.stack)}
        <div class="details" id="${id}" hidden>
          <p class="summary">${esc(p.summary)}</p>
          ${p.points?.length ? `<ul>${p.points.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
        </div>
        <div class="links">
          ${p.story ? `<a class="story" href="${esc(p.story)}">▶ Nasıl yaptım</a>` : ""}
          ${(p.links || []).map((l) => `<a class="more" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">↗ ${esc(l.label)}</a>`).join("")}
          <button class="toggle" type="button" aria-expanded="false" aria-controls="${id}">Detay</button>
        </div>
      </article>`;
    })
    .join("");
  $("projects").addEventListener("click", (e) => {
    const btn = e.target.closest(".toggle");
    if (!btn) return;
    const open = btn.getAttribute("aria-expanded") !== "true";
    btn.setAttribute("aria-expanded", open);
    $(btn.getAttribute("aria-controls")).hidden = !open;
  });

  // ---------- deneyim + sertifikalar ----------
  const ongoing = (when) => /günümüz|devam/i.test(when);
  $("experience").innerHTML = S.experience
    .map(
      (e) => `<li class="rv">
        <span class="when">${esc(e.when)}${ongoing(e.when) ? ' <span class="now-tag">● REC</span>' : ""}</span>
        <div><h3>${esc(e.role)}</h3><span class="org">${esc(e.org)}</span>${e.text ? `<p>${esc(e.text)}</p>` : ""}</div>
      </li>`
    )
    .join("");
  $("certs").innerHTML = S.certs
    .map((c) => `<div class="label rv"><span class="stripe"></span><h3>${esc(c.title)}</h3><p>${esc(c.text)}</p><span class="yr">${esc(c.when)}</span></div>`)
    .join("");

  // ---------- hakkımda ----------
  $("aboutText").innerHTML = S.about.map((p) => `<p>${esc(p)}</p>`).join("");
  $("focus").innerHTML = S.focus.map((f, i) => `<li><span class="n">0${i + 1}</span><b>${esc(f.title)}</b><span>${esc(f.text)}</span></li>`).join("");

  // ---------- yetkinlikler ----------
  $("secIntro").textContent = S.security.intro;
  $("secItems").innerHTML = S.security.items.map((i) => `<div class="rv"><h3>${esc(i.title)}</h3><p>${esc(i.text)}</p></div>`).join("");
  $("stackList").innerHTML = Object.entries(S.stack).map(([g, items]) => `<div><dt>${esc(g)}</dt><dd lang="en">${tags(items)}</dd></div>`).join("");

  // ---------- iletişim ----------
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
    } catch { location.href = "mailto:" + mail; }
  });
  $("socials").innerHTML = S.contact.links
    .map((l) => `<a class="vcr" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${icon(l.label.toLowerCase())}${esc(l.label)}</a>`)
    .join("");
  $("footer").textContent = `© ${new Date().getFullYear()} ${S.domain}`;

  window.revealAll?.();

  // ---------- kolaj: kesikler tek tek düşer; masadaki fotoğraflar gibi sürüklenip fırlatılabilir ----------
  const PHOTOS = [
    // [dosya, sol%, üst%, genişlik%, açı, derinlik, telefonda göster]
    ["lamps", 52, 6, 30, 2.5, 0.6, true],
    ["screen", 70, 30, 26, -3, 1.2, false],
    ["dusk", 4, 8, 34, -2, 0.8, true],
    ["laptop", 34, 2, 22, 4, 1.4, false],
    ["siber", 78, 4, 20, -5, 1.6, true],
    ["hood", 20, 34, 24, 3, 1.0, false],
    ["arches", 56, 46, 28, -1.5, 0.9, true],
    ["panel", 2, 48, 20, 5, 1.3, false],
    ["selfie", 36, 26, 26, -4, 1.8, true],
  ];
  const MOBILE = [[-6, 4, 64], [40, 10, 62], [-4, 28, 58], [44, 30, 60], [10, 16, 70]];
  const small = innerWidth < 640;
  const collage = $("collage");
  collage.innerHTML = PHOTOS.filter((p) => !small || p[6])
    .map(([f, x, y, w, r, d], i) => {
      const [mx, my, mw] = small ? MOBILE[i % MOBILE.length] : [x, y, w];
      return `<figure class="cut-photo" data-depth="${d}" style="left:${mx}%;top:${my}%;width:${mw}%;--r:${r}deg;z-index:${i + 1}"><img src="/img/v3/${f}.webp" alt="" width="760" height="406" draggable="false"></figure>`;
    })
    .join("");
  const cuts = [...collage.children];
  cuts.forEach((c, i) => (reduce ? c.classList.add("on") : setTimeout(() => c.classList.add("on"), 250 + i * 160)));

  // fareyle derinlik (paralaks)
  if (!reduce && fine) {
    addEventListener("pointermove", (e) => {
      if (scrollY > innerHeight) return;
      const dx = e.clientX / innerWidth - 0.5, dy = e.clientY / innerHeight - 0.5;
      cuts.forEach((c) => {
        const d = +c.dataset.depth;
        c.style.setProperty("--px", `${(-dx * 26 * d).toFixed(1)}px`);
        c.style.setProperty("--py", `${(-dy * 18 * d).toFixed(1)}px`);
      });
    }, { passive: true });
  }

  // sürükle-fırlat (yalnızca fareyle; dokunmatikte sayfa kaydırmasını engellememek için kapalı)
  if (fine) {
    const hint = $("collageHint");
    let z = cuts.length + 1;
    const hero = $("top");
    cuts.forEach((c) => {
      let ox = 0, oy = 0, sx = 0, sy = 0, vx = 0, vy = 0, lx = 0, ly = 0, lt = 0, drag = false, inertia = 0;
      const apply = () => { c.style.setProperty("--dx", `${ox}px`); c.style.setProperty("--dy", `${oy}px`); };
      const clamp = () => {
        const h = hero.getBoundingClientRect(), r = c.getBoundingClientRect();
        const minX = h.left - r.width * 0.6, maxX = h.right - r.width * 0.4, minY = h.top - r.height * 0.4, maxY = h.bottom - r.height * 0.6;
        if (r.left < minX) { ox += minX - r.left; vx = Math.abs(vx) * 0.5; }
        if (r.left > maxX) { ox -= r.left - maxX; vx = -Math.abs(vx) * 0.5; }
        if (r.top < minY) { oy += minY - r.top; vy = Math.abs(vy) * 0.5; }
        if (r.top > maxY) { oy -= r.top - maxY; vy = -Math.abs(vy) * 0.5; }
      };
      c.addEventListener("pointerdown", (e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        cancelAnimationFrame(inertia);
        drag = true; c.setPointerCapture(e.pointerId); c.classList.add("dragging");
        c.style.zIndex = ++z;
        sx = e.clientX - ox; sy = e.clientY - oy; lx = e.clientX; ly = e.clientY; lt = performance.now(); vx = vy = 0;
        hint?.classList.add("gone");
      });
      c.addEventListener("pointermove", (e) => {
        if (!drag) return;
        const t = performance.now(), dt = Math.max(8, t - lt);
        vx = (e.clientX - lx) / dt * 16; vy = (e.clientY - ly) / dt * 16;
        lx = e.clientX; ly = e.clientY; lt = t;
        ox = e.clientX - sx; oy = e.clientY - sy;
        apply();
      });
      const release = () => {
        if (!drag) return;
        drag = false; c.classList.remove("dragging");
        if (reduce) return;
        const step = () => {
          vx *= 0.93; vy *= 0.93; ox += vx; oy += vy;
          clamp(); apply();
          if (Math.abs(vx) + Math.abs(vy) > 0.3) inertia = requestAnimationFrame(step);
        };
        inertia = requestAnimationFrame(step);
      };
      c.addEventListener("pointerup", release);
      c.addEventListener("pointercancel", release);
    });
  }
})();
