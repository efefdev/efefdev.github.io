// efef.dev v3 — "ilerle." kurgusunun dili. İçerik /data.js'ten gelir (eski siteyle aynı kaynak).
(() => {
  const S = window.SITE;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const PATHS = {
    ext: '<path d="M15 3h6v6M10 14L21 3M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/>',
    linkedin: '<path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>',
    instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.4A4 4 0 1112.6 8 4 4 0 0116 11.4zM17.5 6.5h.01"/>',
    x: '<path fill="currentColor" stroke="none" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>',
    github: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 00-.9-2.6c3.1-.3 6.4-1.5 6.4-7A5.4 5.4 0 0020 4.8 5 5 0 0019.9 1S18.7.7 16 2.5a13.4 13.4 0 00-7 0C6.3.7 5.1 1 5.1 1A5 5 0 005 4.8a5.4 5.4 0 00-1.5 3.7c0 5.4 3.3 6.6 6.4 7a3.4 3.4 0 00-.9 2.6V22"/>',
  };
  const icon = (n) => `<svg class="i" viewBox="0 0 24 24">${PATHS[n] || PATHS.ext}</svg>`;
  const tags = (list) => `<div class="tags">${list.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>`;
  // "Linux" Türkçe büyük harfe çevrilince "LİNUX" olmasın diye lang="en"
  const CATS = { security: "Güvenlik", web: "Web", mobile: 'macOS · <span lang="en">Linux</span>' };

  // ---------- içerik ----------
  $("role").textContent = S.role;
  $("tagline").textContent = S.tagline;

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

  // kareler
  $("karelerIntro").textContent = S.kareler?.intro || "";
  $("karelerList").innerHTML = (S.kareler?.items || [])
    .map((k) => {
      const media =
        k.type === "video"
          ? `<video muted loop playsinline preload="none" poster="${esc(k.poster)}" data-src="${esc(k.src)}" width="${k.width}" height="${k.height}" aria-label="${esc(k.alt)}"></video>
             <button class="play" type="button">▶ Play</button>`
          : `<img src="${esc(k.src)}" width="${k.width}" height="${k.height}" loading="lazy" alt="${esc(k.alt)}">`;
      return `<figure class="kare rv">
        <div class="tv"><div class="frame">${media}</div></div>
        <figcaption>
          <div><span class="eyebrow">${esc(k.kind)} · ${esc(k.when)}</span><p class="caption">${esc(k.caption)}</p></div>
          ${k.link ? `<a class="more" href="${esc(k.link.url)}" target="_blank" rel="noopener noreferrer">↗ ${esc(k.link.label)}</a>` : ""}
        </figcaption>
      </figure>`;
    })
    .join("");
  document.querySelectorAll(".kare video").forEach((v) => {
    const btn = v.parentElement.querySelector(".play");
    let userPaused = reduce, visible = false;
    const load = () => { if (!v.src) v.src = v.dataset.src; };
    const sync = () => { btn.textContent = v.paused ? "▶ Play" : "❚❚ Pause"; btn.setAttribute("aria-label", v.paused ? "Oynat" : "Durdur"); };
    const update = () => { if (visible && !userPaused && !document.hidden) { load(); v.play().catch(() => {}); } else v.pause(); };
    v.addEventListener("play", sync);
    v.addEventListener("pause", sync);
    btn.addEventListener("click", () => { userPaused = !v.paused; update(); if (!userPaused) { load(); v.play().catch(() => {}); } });
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; update(); }, { threshold: 0.4 }).observe(v);
    document.addEventListener("visibilitychange", update);
    sync();
  });

  // deneyim + sertifikalar
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

  // hakkımda
  $("aboutText").innerHTML = S.about.map((p) => `<p>${esc(p)}</p>`).join("");
  $("focus").innerHTML = S.focus
    .map((f, i) => `<li><span class="n">0${i + 1}</span><b>${esc(f.title)}</b><span>${esc(f.text)}</span></li>`)
    .join("");

  // yetkinlikler
  $("secIntro").textContent = S.security.intro;
  $("secItems").innerHTML = S.security.items.map((i) => `<div class="rv"><h3>${esc(i.title)}</h3><p>${esc(i.text)}</p></div>`).join("");
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
    } catch { location.href = "mailto:" + mail; }
  });
  $("socials").innerHTML = S.contact.links
    .map((l) => `<a class="vcr" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${icon(l.label.toLowerCase())}${esc(l.label)}</a>`)
    .join("");
  $("footer").textContent = `© ${new Date().getFullYear()} ${S.domain}`;

  // ---------- kolaj: kesikler videodaki gibi tek tek düşer ----------
  const PHOTOS = [
    // [dosya, sol%, üst%, genişlik%, açı, derinlik, mobilde göster]
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
  const small = innerWidth < 640;
  const collage = $("collage");
  collage.innerHTML = PHOTOS.filter((p) => !small || p[6])
    .map(([f, x, y, w, r, d], i) => {
      const [mx, my, mw] = small ? [[-6, 4, 64], [40, 10, 62], [-4, 28, 58], [44, 30, 60], [10, 16, 70]][i % 5] : [x, y, w];
      return `<figure class="cut-photo" data-depth="${d}" style="left:${mx}%;top:${my}%;width:${mw}%;aspect-ratio:760/406;--r:${r}deg"><img src="img/${f}.webp" alt="" width="760" height="406"></figure>`;
    })
    .join("");
  const cuts = [...collage.children];
  cuts.forEach((c, i) => (reduce ? c.classList.add("on") : setTimeout(() => c.classList.add("on"), 250 + i * 160)));
  if (!reduce && matchMedia("(hover: hover)").matches) {
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

  // ---------- vizör: canlı tarih/saat, kaydırmayla ilerleyen sayaç, sahne adı ----------
  const MON = ["JAN.", "FEB.", "MAR.", "APR.", "MAY", "JUN.", "JUL.", "AUG.", "SEP.", "OCT.", "NOV.", "DEC."];
  const clock = () => {
    const d = new Date(), h = d.getHours();
    $("vfDate").textContent = `${MON[d.getMonth()]} ${String(d.getDate()).padStart(2, "0")} ${d.getFullYear()}`;
    $("vfTime").textContent = `${h < 12 ? "AM" : "PM"} ${h % 12 || 12}:${String(d.getMinutes()).padStart(2, "0")}`;
  };
  clock();
  setInterval(clock, 15000);

  const TAPE = 58; // kaset uzunluğu: "ilerle." videosu kadar (saniye)
  const tc = $("vfTc");
  const fmt = (s) => `0:${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - innerHeight;
      tc.textContent = fmt((max > 0 ? scrollY / max : 0) * TAPE);
      ticking = false;
    });
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const sceneLabel = $("vfScene");
  const links = [...document.querySelectorAll(".menu-list a")];
  const scenes = [...document.querySelectorAll(".scene")];
  const spy = new IntersectionObserver(
    (es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      sceneLabel.textContent = e.target.id === "top" ? "▶ PLAY" : `▶ ${e.target.dataset.name}`;
      links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
    }),
    { rootMargin: "-45% 0px -50% 0px" }
  );
  scenes.forEach((s) => spy.observe(s));

  // ---------- bant kesilmesi: her sahneye ilk girişte siyah → gri → sahne ----------
  if (!reduce) {
    const cutIO = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("cut");
        cutIO.unobserve(e.target);
      }),
      { threshold: 0.18 }
    );
    scenes.forEach((s) => cutIO.observe(s));
  }

  // ---------- belirme ----------
  const rvIO = new IntersectionObserver(
    (es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), rvIO.unobserve(e.target))),
    { threshold: 0.12 }
  );
  document.querySelectorAll(".rv").forEach((el, i) => { el.style.transitionDelay = `${(i % 3) * 80}ms`; rvIO.observe(el); });

  // ---------- film kumlanması: tek bir gürültü dokusu üretip CSS ile kaydırıyoruz ----------
  (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 180;
    const g = c.getContext("2d"), img = g.createImageData(180, 180);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    document.documentElement.style.setProperty("--noise", `url(${c.toDataURL()})`);
  })();

  // ---------- telefon menüsü: kamera menüsü gibi açılır ----------
  const menu = document.querySelector(".menu"), menuBtn = menu.querySelector(".menu-btn");
  const setMenu = (open) => {
    menu.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", open);
    menuBtn.textContent = open ? "✕ KAPAT" : "MENU";
  };
  menuBtn.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
  links.forEach((a) => a.addEventListener("click", () => setMenu(false)));
  addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

  // ---------- başa sar: sayaç geri sayarken bant geri sarılır ----------
  $("rewind").addEventListener("click", (e) => {
    if (reduce) return;
    e.preventDefault();
    document.body.classList.add("rewinding");
    sceneLabel.textContent = "◀◀ REW";
    scrollTo({ top: 0, behavior: "smooth" });
    const t0 = performance.now();
    const done = () => {
      if (scrollY < 4 || performance.now() - t0 > 4000) { document.body.classList.remove("rewinding"); sceneLabel.textContent = "▶ PLAY"; }
      else requestAnimationFrame(done);
    };
    requestAnimationFrame(done);
  });
})();
