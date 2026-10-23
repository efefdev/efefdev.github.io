// efef.dev — ortak kamera/VHS katmanı. Her sayfada çalışır; vizörü, efekt katmanlarını, menüyü kendisi ekler.
//   · vizör: REC, pil, canlı tarih/saat, sayaç, sahne adı, sürüklenebilir kaset çubuğu
//   · tarama çizgisi, kumlanma, hıza tepki veren bant bozulması (tracking)
//   · sahnelere ilk girişte bant kesilmesi, belirme
//   · kanal değiştirme (menü + 0–9 tuşları), otomatik odak imleci, PAUSE ekranı, ⏏ EJECT, başa sar
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const home = document.body.dataset.page === "home";
  const root = document.documentElement;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // ---------- katmanları ekle ----------
  // [bölüm, ad, kanal] — kanal numarası ana sayfadaki sahne sırasıyla ve 0–9 tuşlarıyla aynı
  const MENU = [["projelerim", "Projeler", 1], ["kareler", "Kareler", 2], ["deneyim", "Deneyim", 3], ["hakkimda", "Hakkımda", 4], ["iletisim", "İletişim", 6]];
  const href = (id) => (home ? "#" : "/#") + id;
  document.body.insertAdjacentHTML(
    "afterbegin",
    `<a class="skip" href="#icerik">İçeriğe geç</a>
    <div class="vf" aria-hidden="true">
      <span class="vf-c tl"></span><span class="vf-c tr"></span><span class="vf-c bl"></span><span class="vf-c br"></span>
      <span class="vf-rec"><i></i><b>REC</b></span>
      <span class="vf-bat">SP <svg viewBox="0 0 30 14"><rect x="1" y="1" width="25" height="12" rx="1.5"/><rect class="b" x="4" y="4" width="5" height="6"/><rect class="b" x="11" y="4" width="5" height="6"/><rect class="b" x="18" y="4" width="5" height="6"/><rect x="26.5" y="4.5" width="2.5" height="5"/></svg></span>
      <span class="vf-date"><b class="d"></b><b class="t"></b></span>
      <span class="vf-tc">0:00:00</span>
      <span class="vf-scene">▶ PLAY</span>
    </div>
    <div class="vf-bar" role="slider" tabindex="0" aria-label="Kaset konumu — sürükleyerek sayfada ileri geri sar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i class="track"></i><i class="head"></i></div>
    <div class="fx-scan" aria-hidden="true"></div>
    <div class="fx-grain" aria-hidden="true"></div>
    <div class="fx-vignette" aria-hidden="true"></div>
    <div class="fx-track" aria-hidden="true"><i></i><i></i><i></i></div>
    <canvas class="fx-static" width="160" height="90" aria-hidden="true"></canvas>
    <div class="ch-osd" aria-hidden="true"></div>
    <div class="af" aria-hidden="true"><i></i><i></i><i></i><i></i><b>AF</b></div>
    <div class="fx-off" aria-hidden="true"></div>
    <div class="eject" role="dialog" aria-modal="true" aria-labelledby="ejectTitle" hidden>
      <p class="osd">⏏ EJECT</p>
      <h2 class="rgb" id="ejectTitle" data-text="KASET ÇIKARILDI">KASET ÇIKARILDI</h2>
      <p class="eject-sub">Sinyal yok. Ne yapmak istersin?</p>
      <div class="eject-actions">
        <button class="vcr vcr-solid" type="button" data-eject="play">▶ Yeni kaseti oynat</button>
        <a class="vcr" href="/v2/">⏏ Eski kaseti tak</a>
      </div>
    </div>
    <nav class="menu" aria-label="Bölümler">
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menuList">MENU</button>
      <ol class="menu-list" id="menuList">
        ${MENU.map(([id, t, ch]) => `<li><a href="${href(id)}" data-ch="${ch}"><span class="ch">CH 0${ch}</span>${t}</a></li>`).join("")}
        <li class="menu-eject"><button type="button" data-eject="open">⏏ Eject</button></li>
      </ol>
    </nav>`
  );
  const vf = $(".vf"), sceneLabel = $(".vf-scene"), recLabel = $(".vf-rec b");

  // ---------- kumlanma: tek gürültü dokusu, CSS ile kaydırılır ----------
  const noiseTile = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 180;
    const g = c.getContext("2d"), img = g.createImageData(180, 180);
    for (let i = 0; i < img.data.length; i += 4) { const v = (Math.random() * 255) | 0; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
    g.putImageData(img, 0, 0);
    return c.toDataURL();
  })();
  root.style.setProperty("--noise", `url(${noiseTile})`);

  // ---------- canlı tarih/saat ----------
  const MON = ["JAN.", "FEB.", "MAR.", "APR.", "MAY", "JUN.", "JUL.", "AUG.", "SEP.", "OCT.", "NOV.", "DEC."];
  const clock = () => {
    const d = new Date(), h = d.getHours();
    $(".vf-date .d").textContent = `${MON[d.getMonth()]} ${String(d.getDate()).padStart(2, "0")} ${d.getFullYear()}`;
    $(".vf-date .t").textContent = `${h < 12 ? "AM" : "PM"} ${h % 12 || 12}:${String(d.getMinutes()).padStart(2, "0")}`;
  };
  clock();
  setInterval(clock, 15000);

  // ---------- sayaç + kaset çubuğu + hıza tepki veren tracking ----------
  const TAPE = 39; // Instagram'daki "ilerle." kadar
  const tc = $(".vf-tc"), bar = $(".vf-bar"), head = $(".vf-bar .head");
  const fmt = (s) => `0:${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  const maxScroll = () => Math.max(1, document.documentElement.scrollHeight - innerHeight);
  let lastY = scrollY, lastT = performance.now(), trk = 0, trkTarget = 0, raf = 0, scrubbing = false;
  // telefonda / dokunmatikte bant bozulması yok
  const noTrackMQ = matchMedia("(max-width: 760px), (pointer: coarse)");
  let noTrack = reduce || noTrackMQ.matches;
  noTrackMQ.addEventListener?.("change", (e) => { noTrack = reduce || e.matches; });
  const paint = () => {
    const p = Math.min(1, Math.max(0, scrollY / maxScroll()));
    tc.textContent = fmt(p * TAPE);
    head.style.left = `${p * 100}%`;
    bar.setAttribute("aria-valuenow", Math.round(p * 100));
  };
  const loop = (t) => {
    const dt = Math.max(16, t - lastT), dy = scrollY - lastY;
    lastT = t; lastY = scrollY;
    // eşik yüksek: yalnızca gerçekten hızlı kaydırmada (~9 px/ms) tam bozulma; telefonda tamamen kapalı
    const v = noTrack ? 0 : Math.min(1, Math.max(0, Math.abs(dy) / dt - 2) / 7);
    trkTarget = scrubbing && !noTrack ? 0.6 : v;
    trk += (trkTarget - trk) * (trkTarget > trk ? 0.35 : 0.16);
    if (trk < 0.003) trk = 0;
    root.style.setProperty("--trk", reduce ? 0 : trk.toFixed(3));
    root.classList.toggle("trk", !reduce && trk > 0);
    paint();
    raf = trk > 0 || scrubbing ? requestAnimationFrame(loop) : 0;
  };
  const kick = () => { if (!raf) { lastT = performance.now(); raf = requestAnimationFrame(loop); } };
  addEventListener("scroll", kick, { passive: true });
  addEventListener("resize", paint);
  paint();

  // kaset çubuğunu sürükleyerek sar
  const seek = (clientX) => {
    const r = bar.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    const before = scrollY;
    scrollTo({ top: p * maxScroll(), behavior: "instant" });
    sceneLabel.textContent = scrollY > before ? "▶▶ FF" : scrollY < before ? "◀◀ REW" : sceneLabel.textContent;
  };
  bar.addEventListener("pointerdown", (e) => {
    scrubbing = true; bar.setPointerCapture(e.pointerId); bar.classList.add("on"); document.body.classList.add("scrubbing");
    seek(e.clientX); kick();
  });
  bar.addEventListener("pointermove", (e) => scrubbing && seek(e.clientX));
  const endScrub = () => { if (!scrubbing) return; scrubbing = false; bar.classList.remove("on"); document.body.classList.remove("scrubbing"); spyNow(); };
  bar.addEventListener("pointerup", endScrub);
  bar.addEventListener("pointercancel", endScrub);
  bar.addEventListener("keydown", (e) => {
    const step = { ArrowRight: 0.05, ArrowLeft: -0.05, PageDown: 0.15, PageUp: -0.15 }[e.key];
    if (step === undefined) return;
    e.preventDefault();
    scrollTo({ top: scrollY + step * maxScroll(), behavior: reduce ? "instant" : "smooth" });
  });

  // ---------- sahneler: ad, menü vurgusu, bant kesilmesi ----------
  const scenes = $$(".scene");
  const links = $$(".menu-list a");
  const setScene = (s) => {
    if (scrubbing || !s) return;
    sceneLabel.textContent = s.dataset.name ? `▶ ${s.dataset.name}` : "▶ PLAY";
    links.forEach((a) => a.classList.toggle("active", home && a.getAttribute("href") === "#" + s.id));
  };
  const spy = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setScene(e.target)), { rootMargin: "-45% 0px -50% 0px" });
  scenes.forEach((s) => spy.observe(s));
  const spyNow = () => setScene(scenes.find((s) => { const r = s.getBoundingClientRect(); return r.top <= innerHeight * 0.5 && r.bottom >= innerHeight * 0.5; }));

  if (!reduce) {
    const cutIO = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("cut");
      cutIO.unobserve(e.target);
    }), { threshold: 0.18 });
    scenes.forEach((s) => cutIO.observe(s));
  }

  // ---------- belirme ----------
  const rvIO = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), rvIO.unobserve(e.target))), { threshold: 0.12 });
  window.revealAll = () => $$(".rv:not(.in)").forEach((el, i) => { el.style.transitionDelay = `${(i % 3) * 80}ms`; rvIO.observe(el); });
  window.revealAll();

  // ---------- kanal değiştirme: karlı parazit + "CH 03", sonra sahneye atla ----------
  const stat = $(".fx-static"), sg = stat.getContext("2d"), chOsd = $(".ch-osd");
  const staticBurst = (ms) => new Promise((done) => {
    if (reduce) return done();
    stat.classList.add("on");
    const img = sg.createImageData(160, 90), t0 = performance.now();
    const frame = (t) => {
      for (let i = 0; i < img.data.length; i += 4) { const v = (Math.random() * 255) | 0; img.data[i] = v; img.data[i + 1] = v; img.data[i + 2] = v + ((Math.random() * 40) | 0); img.data[i + 3] = 255; }
      sg.putImageData(img, 0, 0);
      if (t - t0 < ms) requestAnimationFrame(frame); else { stat.classList.remove("on"); done(); }
    };
    requestAnimationFrame(frame);
  });
  let chTimer = 0;
  const channel = async (n, target) => {
    chOsd.textContent = `CH ${String(n).padStart(2, "0")}${target?.dataset.name ? " ▸ " + target.dataset.name : ""}`;
    chOsd.classList.add("on");
    clearTimeout(chTimer);
    chTimer = setTimeout(() => chOsd.classList.remove("on"), 1500);
    await staticBurst(260);
    if (target) target.scrollIntoView({ behavior: "instant" });
    spyNow();
  };
  links.forEach((a) => a.addEventListener("click", (e) => {
    setMenu(false);
    if (!home) return; // diğer sayfalarda normal bağlantı
    const target = document.getElementById(a.getAttribute("href").slice(1));
    if (!target) return;
    e.preventDefault();
    history.replaceState(null, "", a.getAttribute("href"));
    channel(+a.dataset.ch, target);
  }));
  addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey || /input|textarea|select/i.test(e.target.tagName)) return;
    if (!/^[0-9]$/.test(e.key)) return;
    const n = +e.key, target = scenes[n];
    if (!target) return;
    channel(n, target);
  });

  // ---------- menü (telefonda kamera menüsü gibi tam ekran) ----------
  const menu = $(".menu"), menuBtn = $(".menu-btn");
  function setMenu(open) {
    menu.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", open);
    menuBtn.textContent = open ? "✕ KAPAT" : "MENU";
  }
  menuBtn.addEventListener("click", () => setMenu(!menu.classList.contains("open")));

  // ---------- otomatik odak imleci: karta gelince çerçeve oturur, "AF" yanar ----------
  if (fine && !reduce) {
    const af = $(".af");
    const TARGETS = ".project, .label, .tv, .vcr, .cut-photo, .links a, .mail-big, .sec > div, .cutout, .shots figure, .decision, .menu-list a, .vf-bar";
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y, cw = 44, ch = 44, locked = null, afRaf = 0;
    const tick = () => {
      let tx = x - 22, ty = y - 22, tw = 44, th = 44;
      if (locked) {
        const r = locked.getBoundingClientRect(), pad = 8;
        tx = r.left - pad; ty = r.top - pad; tw = r.width + pad * 2; th = r.height + pad * 2;
      }
      const k = locked ? 0.28 : 0.35;
      cx += (tx - cx) * k; cy += (ty - cy) * k; cw += (tw - cw) * k; ch += (th - ch) * k;
      af.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      af.style.width = `${cw}px`; af.style.height = `${ch}px`;
      afRaf = requestAnimationFrame(tick);
    };
    addEventListener("pointermove", (e) => {
      x = e.clientX; y = e.clientY;
      af.classList.add("show");
      if (!afRaf) afRaf = requestAnimationFrame(tick);
      const t = e.target.closest?.(TARGETS);
      if (t !== locked) {
        locked?.classList.remove("af-focus");
        locked = t;
        af.classList.toggle("locked", !!t);
        if (t) { t.classList.remove("af-focus"); void t.offsetWidth; t.classList.add("af-focus"); }
      }
    }, { passive: true });
    document.addEventListener("pointerleave", () => { af.classList.remove("show"); cancelAnimationFrame(afRaf); afRaf = 0; });
  }

  // ---------- PAUSE: sekmeden dönünce ya da bir süre hareketsiz kalınca ----------
  let idleTimer = 0, paused = false;
  const pause = () => {
    if (paused || document.querySelector(".eject:not([hidden])")) return;
    paused = true;
    document.body.classList.add("paused");
    recLabel.textContent = "❚❚ PAUSE";
  };
  const play = () => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(pause, 25000);
    if (!paused) return;
    paused = false;
    document.body.classList.remove("paused");
    recLabel.textContent = "▶ PLAY";
    setTimeout(() => { if (!paused) recLabel.textContent = "REC"; }, 1400);
  };
  ["pointermove", "pointerdown", "keydown", "scroll", "touchstart", "wheel"].forEach((ev) => addEventListener(ev, play, { passive: true }));
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pause();
    else setTimeout(play, 1100); // dönünce donmuş kareyi kısa bir an göster
  });
  play();

  // ---------- ⏏ EJECT: ekran tüplü TV gibi kapanır, "kaset çıkarıldı" ----------
  const eject = $(".eject"), off = $(".fx-off");
  const openEject = async () => {
    setMenu(false);
    if (!reduce) { off.classList.add("on"); await new Promise((r) => setTimeout(r, 650)); }
    eject.hidden = false;
    document.body.classList.add("ejected");
    recLabel.textContent = "⏏ EJECT";
    eject.querySelector("[data-eject=play]").focus();
    off.classList.remove("on");
  };
  const closeEject = async () => {
    eject.hidden = true;
    document.body.classList.remove("ejected");
    recLabel.textContent = "REC";
    await staticBurst(220);
  };
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-eject]");
    if (!b) return;
    e.preventDefault();
    b.dataset.eject === "open" ? openEject() : closeEject();
  });
  addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!eject.hidden) closeEject();
    setMenu(false);
  });

  // ---------- ◀◀ başa sar ----------
  document.addEventListener("click", (e) => {
    const r = e.target.closest(".rewind");
    if (!r || reduce) return;
    e.preventDefault();
    document.body.classList.add("rewinding");
    sceneLabel.textContent = "◀◀ REW";
    scrollTo({ top: 0, behavior: "smooth" });
    const t0 = performance.now();
    const done = () => {
      if (scrollY < 4 || performance.now() - t0 > 4000) { document.body.classList.remove("rewinding"); spyNow(); }
      else requestAnimationFrame(done);
    };
    requestAnimationFrame(done);
  });
})();
