// Ana sayfa: data.js'teki içeriği sayfaya yerleştirir. Arka plan ve animasyonlar flow.js'te.
(() => {
  const S = window.SITE;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const PATHS = {
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/>',
    server: '<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01"/>',
    pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z"/>',
    ext: '<path d="M15 3h6v6M10 14L21 3M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    chevron: '<path d="M6 9l6 6 6-6"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M15.5 12.9L17 22l-5-3-5 3 1.5-9.1"/>',
    linkedin: '<path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>',
    instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.4A4 4 0 1112.6 8 4 4 0 0116 11.4zM17.5 6.5h.01"/>',
    x: '<path fill="currentColor" stroke="none" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>',
    github: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 00-.9-2.6c3.1-.3 6.4-1.5 6.4-7A5.4 5.4 0 0020 4.8 5 5 0 0019.9 1S18.7.7 16 2.5a13.4 13.4 0 00-7 0C6.3.7 5.1 1 5.1 1A5 5 0 005 4.8a5.4 5.4 0 00-1.5 3.7c0 5.4 3.3 6.6 6.4 7a3.4 3.4 0 00-.9 2.6V22"/>',
  };
  const icon = (n, cls = "i") => `<svg class="${cls}" viewBox="0 0 24 24">${PATHS[n] || ""}</svg>`;
  const tags = (list) => `<div class="tags">${list.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>`;
  // HTML olarak basılır: "Linux" Türkçe büyük harfe çevrilince "LİNUX" olmasın diye lang="en"
  const CATS = { security: "Güvenlik", web: "Web", mobile: 'macOS · <span lang="en">Linux</span>' };

  // giriş
  $("role").textContent = S.role;
  $("tagline").textContent = S.tagline;

  // projeler: kanca cümlesi → (demo) → etiketler → linkler → açılır detaylar
  $("projects").innerHTML = S.projects
    .map((p, n) => {
      const id = `p${n}`;
      return `<article class="glass project${p.featured ? " lg" : ""}">
        <span class="eyebrow">${CATS[p.category] || esc(p.category)} · ${esc(p.year)}</span>
        <h3>${esc(p.title)}</h3>
        <p class="hook">${esc(p.hook || p.summary)}</p>
        ${p.demo ? `<div class="demo demo-${esc(p.demo)}" data-demo="${esc(p.demo)}"></div>` : ""}
        ${tags(p.stack)}
        <div class="details" id="${id}" hidden>
          <p class="summary">${esc(p.summary)}</p>
          ${p.points?.length ? `<ul>${p.points.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
        </div>
        <div class="links">
          ${p.story ? `<a class="story" href="${esc(p.story)}">Nasıl yaptım ${icon("arrow")}</a>` : ""}
          ${(p.links || []).map((l) => `<a class="more" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(l.label)} ${icon("ext")}</a>`).join("")}
          <button class="toggle" type="button" aria-expanded="false" aria-controls="${id}">Detaylar ${icon("chevron")}</button>
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

  // deneyim: zaman çizelgesi
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

  // hakkımda
  $("aboutText").innerHTML = S.about.map((p) => `<p>${esc(p)}</p>`).join("");
  $("focus").innerHTML = S.focus
    .map((f) => `<div class="focus-item"><span class="badge">${icon(f.icon)}</span><div><b>${esc(f.title)}</b><span>${esc(f.text)}</span></div></div>`)
    .join("");

  // yetkinlikler: güvenlik yaklaşımı + teknolojiler
  $("secIntro").textContent = S.security.intro;
  $("secItems").innerHTML = S.security.items.map((i) => `<div class="glass sec-card"><h3>${esc(i.title)}</h3><p>${esc(i.text)}</p></div>`).join("");
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

  window.revealAll?.();
})();
