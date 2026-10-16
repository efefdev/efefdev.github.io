// Proje kartlarındaki canlı demolar. Tamamen tarayıcıda çalışan simülasyonlardır; hiçbir sunucuya bağlanmaz.
// IP'ler RFC 5737 dokümantasyon aralıklarındandır (gerçek kişilere ait değildir).
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // Görünürken çalışan, görünmezken duraklayan döngü
  function runWhileVisible(el, tick, interval) {
    let timer = 0, visible = false;
    const start = () => { if (!timer) timer = setInterval(tick, interval); };
    const stop = () => { clearInterval(timer); timer = 0; };
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible && !document.hidden ? start() : stop(); }).observe(el);
    document.addEventListener("visibilitychange", () => (visible && !document.hidden ? start() : stop()));
  }

  // ---------- Nöbetçi: nginx log akışı → kural motoru → Telegram ----------
  const TRAFFIC = [
    { ip: "198.51.100.7", req: "GET /", code: 200 },
    { ip: "198.51.100.7", req: "GET /style.css", code: 200 },
    { ip: "203.0.113.24", req: "GET /.env", code: 404, hit: "trap" },
    { ip: "192.0.2.55", req: "GET /projeler", code: 200 },
    { ip: "198.51.100.91", req: "GET /urun?id=1' OR '1'='1", code: 403, hit: "sqli" },
    { ip: "192.0.2.55", req: "GET /favicon.ico", code: 200 },
    { ip: "198.51.100.12", req: "GET /ara?q=<script>alert(1)</script>", code: 200, hit: "xss" },
    { ip: "192.0.2.80", req: "GET /iletisim", code: 200 },
    { ip: "203.0.113.61", req: "GET /.git/config", code: 404, hit: "trap" },
    { ip: "198.51.100.7", req: "POST /api/form", code: 201 },
  ];
  const HITS = {
    trap: { tag: "TUZAK URL", cls: "ban", msg: (e) => `🚨 <b>Tuzak URL</b> · <code>${esc(e.req.split(" ")[1])}</code><br>${e.ip} banlandı.`, buttons: ["Geri al"] },
    sqli: { tag: "SQL INJECTION", cls: "ban", msg: (e) => `🚨 <b>SQL injection</b><br>${e.ip} banlandı.`, buttons: ["Geri al"] },
    xss: { tag: "ONAY BEKLİYOR", cls: "ask", msg: (e) => `⚠️ <b>Olası XSS</b> · düşük güven<br>${e.ip} banlansın mı?`, buttons: ["Onayla", "Reddet"] },
  };

  function nobetci(el) {
    el.innerHTML = `
      <div class="demo-bar"><span>nginx · access.log</span><span class="live"><i></i>canlı</span></div>
      <ol class="log" aria-hidden="true"></ol>
      <div class="tg" aria-hidden="true">
        <div class="tg-head"><span class="tg-avatar">N</span><b>Nöbetçi</b><span class="tg-time">şimdi</span></div>
        <div class="tg-body"></div>
        <div class="tg-buttons"></div>
      </div>
      <p class="sr-only">Canlı demo: nginx loglarından gelen istekler akıyor; kural motoru tuzak URL ve SQL injection denemelerini yakalayıp IP'yi banlıyor, düşük güvenli bir XSS denemesi için Telegram'dan onay istiyor.</p>`;
    const log = el.querySelector(".log"), tg = el.querySelector(".tg");
    let i = 0;
    const push = (e) => {
      const hit = e.hit && HITS[e.hit];
      const li = document.createElement("li");
      if (hit) li.className = hit.cls;
      li.innerHTML = `<span class="ip">${e.ip}</span><span class="req">${esc(e.req)}</span><span class="code">${e.code}</span>${hit ? `<span class="flag">${hit.tag}</span>` : ""}`;
      log.appendChild(li);
      while (log.children.length > 7) log.firstElementChild.remove();
      if (hit) {
        tg.querySelector(".tg-body").innerHTML = hit.msg(e);
        tg.querySelector(".tg-buttons").innerHTML = hit.buttons.map((b) => `<span>${b}</span>`).join("");
        tg.classList.remove("show");
        void tg.offsetWidth;
        tg.classList.add("show");
      }
    };
    if (reduce) { TRAFFIC.slice(0, 7).forEach(push); return; }
    TRAFFIC.slice(0, 3).forEach(push);
    i = 3;
    runWhileVisible(el, () => { push(TRAFFIC[i % TRAFFIC.length]); i++; }, 1500);
  }

  // ---------- Mahzen: dosyalar kasaya girerken şifrelenir ----------
  const FILES = ["tatil-2026.jpg", "sözleşme.pdf", "notlar.txt", "wifi-parolası", "pasaport.png"];
  const HEX = "0123456789abcdef";
  const rid = (n) => Array.from({ length: n }, () => HEX[(Math.random() * 16) | 0]).join("");

  function mahzen(el) {
    el.innerHTML = `
      <div class="demo-bar"><span>Mahzen Kasası/</span><span class="lock" aria-hidden="true">
        <svg viewBox="0 0 24 24"><rect x="4" y="11" width="16" height="10" rx="2"/><path class="shackle" d="M8 11V7a4 4 0 018 0v4"/></svg></span></div>
      <div class="vault" aria-hidden="true">
        <ul class="files"></ul>
        <div class="kdf"><span class="kdf-label">Argon2id · 1 GB bellek · 3 geçiş</span><span class="bar"><i></i></span><span class="kdf-label aes">AES-256-GCM · 1 MB parçalar</span></div>
      </div>
      <p class="sr-only">Canlı demo: dosyalar kasaya eklenirken önce paroladan Argon2id ile anahtar türetiliyor, sonra her dosya AES-256-GCM ile şifrelenip adı rastgele bir kimliğe dönüşüyor ve kasa kilitleniyor.</p>`;
    const list = el.querySelector(".files"), bar = el.querySelector(".bar i"), lock = el.querySelector(".lock");
    const render = () => {
      list.innerHTML = FILES.map((f) => `<li><span class="name">${esc(f)}</span><span class="state">açık</span></li>`).join("");
      bar.style.width = "0%"; el.classList.remove("locked", "kdf-on", "aes-on");
    };
    const scramble = async (li) => {
      const name = li.querySelector(".name"), target = `blobs/${rid(2)}/${rid(10)}.mhz`;
      for (let k = 0; k <= 12; k++) {
        const keep = Math.round((k / 12) * target.length);
        name.textContent = target.slice(0, keep) + rid(Math.max(0, Math.min(14, target.length - keep)));
        await sleep(35);
      }
      name.textContent = target;
      li.classList.add("enc");
      li.querySelector(".state").textContent = "şifreli";
    };
    let running = false;
    const cycle = async () => {
      if (running) return;
      running = true;
      render();
      await sleep(900);
      el.classList.add("kdf-on");
      bar.style.width = "100%";
      await sleep(1300);
      el.classList.add("aes-on");
      for (const li of list.children) await scramble(li);
      await sleep(300);
      el.classList.add("locked");
      await sleep(2600);
      running = false;
    };
    if (reduce) {
      render();
      el.classList.add("kdf-on", "aes-on", "locked");
      bar.style.width = "100%";
      [...list.children].forEach((li) => { li.classList.add("enc"); li.querySelector(".name").textContent = `blobs/${rid(2)}/${rid(10)}.mhz`; li.querySelector(".state").textContent = "şifreli"; });
      return;
    }
    render();
    runWhileVisible(el, cycle, 7600);
    new IntersectionObserver(([e], o) => { if (e.isIntersecting) { cycle(); o.disconnect(); } }).observe(el);
  }

  const DEMOS = { nobetci, mahzen };
  window.mountDemos = (root = document) =>
    root.querySelectorAll("[data-demo]").forEach((el) => {
      if (el.dataset.mounted) return;
      el.dataset.mounted = "1";
      DEMOS[el.dataset.demo]?.(el);
    });
  window.mountDemos();
})();
