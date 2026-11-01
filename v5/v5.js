// efef.dev v5 prototip: 1) imleç ışık kaynağı, 2) ef çizgi başlıklar; işler bölümü eski sitedekiyle aynı.
(() => {
  /* ---------- 1 · ışık ---------- */
  // Tek WebGL sahnesi: portre → yazı (gölgesiyle) → baş kesiti. Üçü de aynı ışığı alır.
  const hero = document.querySelector(".hero");
  const stage = hero.querySelector(".stage");
  const cv = hero.querySelector(".kat-alt");
  const wordSvg = hero.querySelector(".word-svg");
  const ipucu = hero.querySelector(".ipucu-yazi");
  const q = new URLSearchParams(location.search);

  // yazının sahnedeki yeri (sahne uv'si). Geniş ekranda sahnenin %90'ı, başın arkasında (taban kesitin hemen üstünde, .385).
  // Telefonda baş ekranı kapladığından yazı arkada kaybolur: ekranın %92'si genişliğinde, göğsün önüne iner.
  const PAY = 40, WX0 = 17 - PAY, WY0 = 32 - PAY, WW = 634 + 2 * PAY, WH = 127 + 2 * PAY;
  const kelime = hero.querySelector(".word");
  let onde = 0;                                            // 1: yazı kişinin önünde (gölgesi gövdeye düşer)
  function yaziYeri() {
    const r = stage.getBoundingClientRect();
    const dar = r.width > innerWidth * 1.05;
    const w = Math.min(.9, .92 * innerWidth / r.width), x = .5 - w / 2, y = (dar ? .8 : .385) - w * 127 / 634, b = w / 634;
    onde = dar ? 1 : 0;
    Object.assign(kelime.style, { left: x * 100 + "%", top: y * 100 + "%", width: w * 100 + "%" });
    return [x - PAY * b, y - PAY * b, WW * b, WH * b];
  }

  const VS = `attribute vec2 p; varying vec2 uv; void main(){ uv = vec2(p.x*.5+.5, .5-p.y*.5); gl_Position = vec4(p,0.,1.); }`;
  // foto: portre · bas: baş kesiti (alfa) · nor: rgb yüzey yönü, a derinlik · yazi: r keskin, g geniş bulanık (gölge), b dar bulanık (kabartma)
  const FS = `precision highp float;
  varying vec2 uv; uniform sampler2D foto, bas, nor, yazi; uniform vec3 L; uniform float guc; uniform vec4 Y; uniform vec2 px; uniform float onde, taban, yayilma;
  vec3 Lp; float zayifF(vec2 q){ float u = length(Lp.xy - q); return 1./(1. + u*u*yayilma); }
  // ışık, fotoğrafı orijinal tonlarına geri getirir: aydınlanan yer = orijinal portre, ışık almayan yer kararır
  float isikla(float l, vec3 N, float d, float kisi, float kenar){
    vec3 P = vec3(uv.x, 1.-uv.y, d*.22), Ld = normalize(Lp - P);
    float z = zayifF(P.xy);
    float yay = max(dot(N, Ld), 0.);
    float yan = pow(1. - max(N.z, 0.), 2.) * max(dot(normalize(N.xy+1e-4), normalize(Ld.xy+1e-4)), 0.);
    float parla = pow(max(dot(N, normalize(Ld + vec3(0.,0.,1.))), 0.), 42.);
    float k = clamp((yay*1.25 + yan*.5) * z * 1.6, 0., 1.15) * guc;
    float c = l * mix(taban, 1., k) + parla * z * guc * l * .35;
    return c + (1.-kisi) * .035 * z * guc * kenar;
  }
  void main(){
    Lp = vec3(L.x, 1.-L.y, L.z);
    vec4 n4 = texture2D(nor, uv);
    vec3 N = n4.xyz*2.-1.; N.xy *= 1.35; N = normalize(N);
    float d = n4.a, kisi = smoothstep(.36, .47, d);
    float kenar = smoothstep(0., .18, uv.x)*smoothstep(1., .82, uv.x)*smoothstep(1., .8, uv.y);
    float c = isikla(texture2D(foto, uv).r, N, d, kisi, kenar);

    // yazının gölgesi: ışıktan uzağa düşer, arkadaki zemine ve gövdeye
    vec2 kac = (vec2(uv.x, 1.-uv.y) - Lp.xy); kac = normalize(kac + 1e-4) * .022 * guc;
    vec2 gy = (uv + vec2(kac.x, -kac.y) - Y.xy) / Y.zw;
    float golge = (gy.x > 0. && gy.x < 1. && gy.y > 0. && gy.y < 1.) ? texture2D(yazi, gy).g : 0.;
    c *= 1. - golge * .75 * (1. - kisi * (1. - onde));

    // yazı: kabartmalı çizgi, ışığa bakan kenar parlar
    vec2 wy = (uv - Y.xy) / Y.zw;
    if (wy.x > 0. && wy.x < 1. && wy.y > 0. && wy.y < 1.) {
      vec3 w = texture2D(yazi, wy).rgb;
      float bx = texture2D(yazi, wy + vec2(px.x, 0.)).b - texture2D(yazi, wy - vec2(px.x, 0.)).b;
      float by = texture2D(yazi, wy + vec2(0., px.y)).b - texture2D(yazi, wy - vec2(0., px.y)).b;
      vec3 Nw = normalize(vec3(-bx * 2.2, by * 2.2, 1.));
      vec3 Pw = vec3(uv.x, 1.-uv.y, .16), Lw = normalize(Lp - Pw);
      float z = zayifF(Pw.xy);
      float wc = .1 + (.25 + 1.25*max(dot(Nw, Lw), 0.)) * z * guc + pow(max(dot(Nw, normalize(Lw + vec3(0.,0.,1.))), 0.), 30.) * .9 * z * guc;
      c = mix(c, wc / (1. + wc*.3), w.r);
    }

    // baş kesiti yazının önünde
    vec4 b = texture2D(bas, uv);
    c = mix(c, isikla(b.r, N, d, kisi, kenar), b.a);
    gl_FragColor = vec4(vec3(c), 1.);
  }`;

  // yazı dokusu: svg yolları Path2D ile çizilir; çizim animasyonu sırasında her kare yenilenir
  const WK = 2048 / WW, wcv = document.createElement("canvas");
  wcv.width = 2048; wcv.height = Math.round(WH * WK);
  const wx = wcv.getContext("2d");
  const yollar = [...wordSvg.querySelectorAll("path")].map((p) => ({ yol: new Path2D(p.getAttribute("d")), boy: p.getTotalLength(), kes: p.getAttribute("clip-path") }));
  const kesV = new Path2D(); kesV.rect(523, 57.5, 160, 101);
  const kesE = new Path2D(); kesE.arc(504.5, 108, 50.5, 0, Math.PI * 2);
  function yaziCiz(t) {                                    // t: saniye; yollar sırayla çizilir
    wx.setTransform(1, 0, 0, 1, 0, 0);
    wx.globalCompositeOperation = "source-over";
    wx.fillStyle = "#000"; wx.fillRect(0, 0, wcv.width, wcv.height);
    wx.globalCompositeOperation = "lighter";
    [["#f00", "none"], ["#0f0", `blur(${9 * WK}px)`], ["#00f", `blur(${3.2 * WK}px)`]].forEach(([renk, filtre]) => {
      wx.filter = filtre;
      wx.setTransform(WK, 0, 0, WK, -WX0 * WK, -WY0 * WK);
      wx.strokeStyle = renk; wx.lineWidth = 19; wx.miterLimit = 10;
      yollar.forEach((y, i) => {
        const p = Math.min(1, Math.max(0, (t - .25 - i * .07) / .7)), e = p < .5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2;
        if (e <= 0) return;
        wx.save();
        if (y.kes) wx.clip(y.kes.includes("-v") ? kesV : kesE);
        wx.setLineDash([y.boy * e, y.boy * 2]);
        wx.stroke(y.yol);
        wx.restore();
      });
    });
    wx.filter = "none";
  }

  function sahne(foto, bas, nor) {
    const gl = cv.getContext("webgl", { alpha: false, antialias: false, preserveDrawingBuffer: q.has("isik") });
    if (!gl) return null;
    const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw gl.getShaderInfoLog(o); return o; };
    const pr = gl.createProgram();
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr); gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const ap = gl.getAttribLocation(pr, "p"); gl.enableVertexAttribArray(ap); gl.vertexAttribPointer(ap, 2, gl.FLOAT, false, 0, 0);
    const u = (n) => gl.getUniformLocation(pr, n);
    const doku = (kaynak, birim, ad) => {
      const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + birim); gl.bindTexture(gl.TEXTURE_2D, t);
      [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]].forEach(([k, v]) => gl.texParameteri(gl.TEXTURE_2D, k, v));
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, kaynak);
      gl.uniform1i(u(ad), birim);
      return t;
    };
    doku(foto, 0, "foto"); doku(bas, 1, "bas"); doku(nor, 2, "nor");
    const yt = doku(wcv, 3, "yazi");
    gl.uniform2f(u("px"), 1.5 / wcv.width, 1.5 / wcv.height);
    return {
      boyut(s) { cv.width = cv.height = s; gl.viewport(0, 0, s, s); gl.uniform4f(u("Y"), ...yaziYeri()); gl.uniform1f(u("onde"), onde);
        // masaüstünde portre büyük, imleç çoğu zaman yüzden uzak: ışık almayan yer de tanınır kalır, ışık geniş bir softbox gibi
        gl.uniform1f(u("taban"), onde ? .12 : .58); gl.uniform1f(u("yayilma"), onde ? 7. : 2.5); },
      yazi() { gl.activeTexture(gl.TEXTURE3); gl.bindTexture(gl.TEXTURE_2D, yt); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, wcv); },
      ciz(Lx, Ly, Lz, g) { gl.uniform3f(u("L"), Lx, Ly, Lz); gl.uniform1f(u("guc"), g); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); },
    };
  }

  const isik = { x: .2, y: .18, z: .42, hx: .2, hy: .18, guc: 0, hguc: 1, son: 0, egim: false };
  // ?isik=x,y → ışık sabit, yazı bitmiş (ekran görüntüsü ve deneme için)
  if (q.has("isik")) { const [x, y] = q.get("isik").split(",").map(Number); Object.assign(isik, { x, y, hx: x, hy: y, guc: 1, egim: true }); }
  let S, t0 = 0, yaziBitti = false;
  const olc = () => { const r = stage.getBoundingClientRect(); S.boyut(Math.round(Math.min(r.width * Math.min(devicePixelRatio || 1, 2), 1800))); };
  function kare(t) {
    if (!t0) t0 = t;
    // imleç durunca: masaüstünde ışık fotoğraftaki asıl yerine (sol üst) döner, telefonda yüzün çevresinde yavaşça gezer
    if (!isik.egim && t - isik.son > 2600) {
      if (!onde) { isik.hx = .24; isik.hy = .2; }
      else { const a = t / 2600; isik.hx = .5 + Math.cos(a) * .32; isik.hy = .34 + Math.sin(a * 1.3) * .2; }
    }
    isik.x += (isik.hx - isik.x) * .085; isik.y += (isik.hy - isik.y) * .085;
    isik.guc += (isik.hguc - isik.guc) * .03;
    if (!yaziBitti) { const s = q.has("isik") ? 9 : (t - t0) / 1000; yaziCiz(s); S.yazi(); yaziBitti = s > 2; }
    S.ciz(isik.x, isik.y, isik.z, isik.guc);
    requestAnimationFrame(kare);
  }
  function hedef(cx, cy) {
    const r = stage.getBoundingClientRect();
    isik.hx = (cx - r.left) / r.width; isik.hy = (cy - r.top) / r.height; isik.son = performance.now();
  }
  hero.addEventListener("pointermove", (e) => { if (!isik.egim) hedef(e.clientX, e.clientY); });
  hero.addEventListener("pointerleave", () => { isik.son = -1e9; });
  // dokunmatik: kaydırma sırasında da parmak ışığı taşır
  ["touchstart", "touchmove"].forEach((o) => hero.addEventListener(o, (e) => { if (!isik.egim) hedef(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true }));

  // telefonda: ışık telefonun eğimini izler (jiroskop). Android'de kendiliğinden başlar; iOS izni ilk dokunuşta ister.
  // İlk okunan duruş sıfır kabul edilir: telefonu nasıl tutarsan tut ışık önden başlar, eğdikçe kayar.
  if (matchMedia("(pointer: coarse)").matches && "DeviceOrientationEvent" in window) {
    ipucu.textContent = "ışık parmağında";
    let sifir = null;
    const egim = (e) => {
      if (e.beta == null || e.gamma == null) return;
      if (!sifir) { sifir = [e.beta, e.gamma]; isik.egim = true; ipucu.textContent = "telefonu eğ"; }
      const k = (v) => Math.max(-1, Math.min(1, v));
      isik.hx = .5 + k((e.gamma - sifir[1]) / 28) * .45;
      isik.hy = .32 + k((e.beta - sifir[0]) / 28) * .32;
    };
    const izinIste = async () => {
      try { if ((await DeviceOrientationEvent.requestPermission()) !== "granted") return; } catch { return; }
      addEventListener("deviceorientation", egim);
    };
    if (typeof DeviceOrientationEvent.requestPermission === "function") {
      ipucu.textContent = "dokun, ışık telefonu izlesin";
      hero.addEventListener("touchend", izinIste, { once: true });
    } else addEventListener("deviceorientation", egim);
  }

  const yukle = (src) => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });
  Promise.all([yukle("/img/v4/portre-1200.webp"), yukle("/img/v4/portre-on-1200.webp?v=7"), yukle("normal.png?v=1"), document.fonts.ready])
    .then(([foto, bas, nor]) => {
      S = sahne(foto, bas, nor);
      if (!S) throw 0;
      document.documentElement.classList.add("gl");
      olc(); addEventListener("resize", olc);
      requestAnimationFrame(kare);
    })
    .catch((e) => {
      console.warn("ışık sahnesi açılmadı", e);
      yaziYeri();
      document.documentElement.classList.add("no-gl");
      wordSvg.querySelectorAll("path").forEach((p) => (p.style.strokeDashoffset = 0));
    });

  /* ---------- 2 · ef çizgi başlıklar ---------- */
  const izle = new IntersectionObserver((ler) => ler.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("yazildi"); izle.unobserve(e.target);
  }), { threshold: .25 });
  document.querySelectorAll(".baslik[data-yaz]").forEach((h) => {
    const metin = h.dataset.yaz;
    h.innerHTML = `<span class="gizli">${metin}</span>`;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("aria-hidden", "true");
    h.appendChild(svg);
    const yollar = efCizgi.yaz(svg, metin);
    yollar.forEach((p) => (p.style.transitionDelay = `${+p.dataset.harf * 28}ms`));
    izle.observe(h);
  });

  /* ---------- işler: eski sitedekiyle aynı (belirme, gönderi büyütme) ---------- */
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  // belirme (içerik hep görünür; yalnızca yerine oturur)
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    io.unobserve(e.target);
  }), { threshold: 0.12 });
  document.querySelectorAll(".rv").forEach((el) => io.observe(el));

  // gönderi kareleri: tıklayınca büyür, büyükken de yana kaydırılır
  const lb = document.getElementById("lb");
  if (lb) {
    const track = lb.querySelector(".lb-track"), num = lb.querySelector(".lb-n");
    const prev = lb.querySelector(".lb-prev"), next = lb.querySelector(".lb-next");
    let figs = [];
    const at = () => Math.round(track.scrollLeft / track.clientWidth);
    const go = (i, smooth = true) => track.scrollTo({ left: i * track.clientWidth, behavior: smooth && !reduce ? "smooth" : "auto" });
    const sync = () => {
      const i = at();
      num.textContent = `${i + 1} / ${figs.length}`;
      prev.disabled = i === 0;
      next.disabled = i === figs.length - 1;
    };
    const open = (imgs, i) => {
      track.replaceChildren(...imgs.map((im) => {
        const f = document.createElement("figure"), big = document.createElement("img");
        big.src = im.dataset.full || im.src;
        big.alt = im.alt;
        big.width = im.width;
        big.height = im.height;
        f.append(big);
        return f;
      }));
      figs = [...track.children];
      lb.showModal();
      go(i, false);
      sync();
    };
    document.querySelectorAll(".slides").forEach((row) => {
      const imgs = [...row.querySelectorAll("img")];
      imgs.forEach((im, i) => {
        im.tabIndex = 0;
        im.setAttribute("role", "button");
        im.addEventListener("click", () => open(imgs, i));
        im.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(imgs, i); }
        });
      });
    });
    track.addEventListener("scroll", sync, { passive: true });
    prev.addEventListener("click", () => go(at() - 1));
    next.addEventListener("click", () => go(at() + 1));
    lb.querySelector(".lb-x").addEventListener("click", () => lb.close());
    // görselin dışına tıklamak kapatır
    track.addEventListener("click", (e) => { if (e.target.tagName !== "IMG") lb.close(); });
    lb.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); go(at() + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); go(at() - 1); }
    });
    lb.addEventListener("close", () => track.replaceChildren());
  }

})();
