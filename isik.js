// efef.dev — giriş ekranında imleç (telefonda eğim) ışık kaynağı; ef çizgi başlıklar; iş kartlarında site kendini gezer.
// Işık: portrenin derinlik haritasından (img/v4/portre-normal.png: rgb yüzey yönü, a derinlik) tek WebGL sahnesi.
// Portre, efefdev yazısı (gölgesiyle) ve baş kesiti aynı ışığı alır. WebGL yoksa sayfadaki img ve svg olduğu gibi kalır.
(() => {
  const html = document.documentElement;
  const hero = document.querySelector(".hero"), stage = hero && hero.querySelector(".stage");
  const wordSvg = stage && stage.querySelector(".word-svg");
  const azHareket = matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (stage && wordSvg) {
    const cv = document.createElement("canvas");
    cv.className = "isik-sahne"; cv.setAttribute("aria-hidden", "true");
    const ipucuKutu = document.createElement("div");
    ipucuKutu.className = "isik-ipucu"; ipucuKutu.setAttribute("aria-hidden", "true");
    ipucuKutu.innerHTML = '<span class="nokta"></span><span class="ipucu-yazi">ışık imleçte</span>';
    const ipucu = ipucuKutu.querySelector(".ipucu-yazi");

    // yazının sahnedeki yeri: sayfadaki .word-svg nerede ise orası (giriş animasyonu da oraya iner).
    // Telefonda CSS yazıyı göğsün önüne alır (başın arkasında kaybolmasın); o zaman yazı kişinin önündedir.
    const PAY = 40, WX0 = 17 - PAY, WY0 = 32 - PAY, WW = 634 + 2 * PAY, WH = 127 + 2 * PAY;
    let onde = 0;
    function yaziYeri() {
      const s = stage.getBoundingClientRect(), r = wordSvg.getBoundingClientRect();
      const b = r.width / 634 / s.width, x = (r.left - s.left) / s.width, y = (r.top - s.top) / s.height;
      onde = (r.bottom - s.top) / s.height > .5 ? 1 : 0;
      return [x - PAY * b, y - PAY * b * s.width / s.height, WW * b, WH * b * s.width / s.height];
    }

    const VS = `attribute vec2 p; varying vec2 uvc; void main(){ uvc = vec2(p.x*.5+.5, .5-p.y*.5); gl_Position = vec4(p,0.,1.); }`;
    // foto: portre · bas: baş kesiti (alfa) · nor: rgb yüzey yönü, a derinlik · yazi: r keskin, g geniş bulanık (gölge), b dar bulanık (kabartma)
    const FS = `precision highp float;
    varying vec2 uvc; vec2 uv; uniform vec4 St; uniform sampler2D foto, bas, nor, yazi; uniform vec3 L; uniform float guc; uniform vec4 Y; uniform vec2 px; uniform float onde, taban, yayilma;
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
      // tuval bütün giriş ekranını kaplar (yazı portreden taşar); hesaplar portrenin kare sahnesinin uv'sinde
      uv = (uvc - St.xy) / St.zw;
      float icerde = step(0., uv.x) * step(uv.x, 1.) * step(0., uv.y) * step(uv.y, 1.);
      Lp = vec3(L.x, 1.-L.y, L.z);
      vec2 q = uv;
      vec4 n4 = mix(vec4(.5, .5, 1., 0.), texture2D(nor, q), icerde);
      vec3 N = n4.xyz*2.-1.; N.xy *= 1.35; N = normalize(N);
      float d = n4.a, kisi = smoothstep(.36, .47, d);
      float kenar = smoothstep(0., .18, uv.x)*smoothstep(1., .82, uv.x)*smoothstep(1., .8, uv.y);
      float yumusak = icerde * smoothstep(0., .07, uv.x) * smoothstep(1., .93, uv.x);   // fotoğrafın kenarı sayfanın siyahına erir
      float c = isikla(texture2D(foto, q).r * yumusak, N, d, kisi, kenar), cFoto = c;

      // yazının gölgesi: ışıktan uzağa düşer, arkadaki zemine (telefonda gövdeye)
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

      // baş kesiti yazının önünde (masaüstü)
      // kesit portrenin kendisi: rengi zaten cFoto'da, kesitten yalnızca alfa alınır
      c = mix(c, cFoto, texture2D(bas, q).a * icerde);
      gl_FragColor = vec4(vec3(c), 1.);
    }`;

    // yazı dokusu: svg yolları Path2D ile bir kez çizilir (giriş animasyonu yazıyı zaten çiziyor)
    const WK = 2048 / WW, wcv = document.createElement("canvas");
    wcv.width = 2048; wcv.height = Math.round(WH * WK);
    const wx = wcv.getContext("2d");
    const yollar = [...wordSvg.querySelectorAll("path")].map((p) => ({ yol: new Path2D(p.getAttribute("d")), kes: p.getAttribute("clip-path") }));
    const kesV = new Path2D(); kesV.rect(523, 57.5, 160, 101);
    const kesE = new Path2D(); kesE.arc(504.5, 108, 50.5, 0, Math.PI * 2);
    function yaziCiz() {
      wx.setTransform(1, 0, 0, 1, 0, 0);
      wx.globalCompositeOperation = "source-over";
      wx.fillStyle = "#000"; wx.fillRect(0, 0, wcv.width, wcv.height);
      wx.globalCompositeOperation = "lighter";
      [["#f00", "none"], ["#0f0", `blur(${9 * WK}px)`], ["#00f", `blur(${3.2 * WK}px)`]].forEach(([renk, filtre]) => {
        wx.filter = filtre;
        wx.setTransform(WK, 0, 0, WK, -WX0 * WK, -WY0 * WK);
        wx.strokeStyle = renk; wx.lineWidth = 19; wx.miterLimit = 10;
        yollar.forEach((y) => {
          wx.save();
          if (y.kes) wx.clip(y.kes.includes("-v") ? kesV : kesE);
          wx.stroke(y.yol);
          wx.restore();
        });
      });
      wx.filter = "none";
    }

    function sahne(foto, bas, nor) {
      const gl = cv.getContext("webgl", { alpha: false, antialias: false, preserveDrawingBuffer: false });
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
        boyut(w, h, st) { cv.width = w; cv.height = h; gl.viewport(0, 0, w, h); gl.uniform4f(u("St"), ...st); gl.uniform4f(u("Y"), ...yaziYeri()); gl.uniform1f(u("onde"), onde);
          // masaüstünde portre büyük, imleç çoğu zaman yüzden uzak: ışık almayan yer de tanınır kalır, ışık geniş bir softbox gibi
          gl.uniform1f(u("taban"), onde ? .12 : .58); gl.uniform1f(u("yayilma"), onde ? 7. : 2.5); },
        ciz(Lx, Ly, Lz, g) {
          gl.uniform3f(u("L"), Lx, Ly, Lz); gl.uniform1f(u("guc"), g);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        },
      };
    }


    // giriş animasyonu oynuyorsa ışık tam güçte başlar (iniş bitince yazı birebir aynı yerde, aynı parlaklıkta kalır)
    const isik = { x: .24, y: .2, z: .42, hx: .24, hy: .2, guc: html.classList.contains("giris-oynuyor") ? 1 : 0, hguc: 1, son: 0, egim: false };
    let S;
    const olc = () => {
      const h = hero.getBoundingClientRect(), r = stage.getBoundingClientRect();
      const k = Math.min(devicePixelRatio || 1, 2, 2600 / h.width);
      S.boyut(Math.round(h.width * k), Math.round(h.height * k), [(r.left - h.left) / h.width, (r.top - h.top) / h.height, r.width / h.width, r.height / h.height]);
    };
    function kare(t) {
      // imleç durunca: masaüstünde ışık fotoğraftaki asıl yerine (sol üst) döner, telefonda yüzün çevresinde yavaşça gezer
      if (!isik.egim && t - isik.son > 2600) {
        if (!onde || azHareket) { isik.hx = .24; isik.hy = .2; }
        else { const a = t / 2600; isik.hx = .5 + Math.cos(a) * .32; isik.hy = .34 + Math.sin(a * 1.3) * .2; }
      }
      isik.x += (isik.hx - isik.x) * .085; isik.y += (isik.hy - isik.y) * .085;
      isik.guc += (isik.hguc - isik.guc) * .03;
      if (hero.getBoundingClientRect().bottom > 0) S.ciz(isik.x, isik.y, isik.z, isik.guc);
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
    Promise.all([yukle("/img/v4/portre-1200.webp"), yukle("/img/v4/portre-on-1200.webp?v=7"), yukle("/img/v4/portre-normal.png?v=1")])
      .then(([foto, bas, nor]) => {
        yaziCiz();
        S = sahne(foto, bas, nor);
        if (!S) return;
        hero.prepend(cv); hero.append(ipucuKutu);
        html.classList.add("isik");
        olc(); addEventListener("resize", olc);
        requestAnimationFrame(kare);
      })
      .catch((e) => console.warn("ışık sahnesi açılmadı", e));
  }

  /* ---------- ef çizgi başlıklar: bölüme gelince kendini çizer ---------- */
  const izle = new IntersectionObserver((ler) => ler.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("yazildi"); izle.unobserve(e.target);
  }), { threshold: .25 });
  document.querySelectorAll(".sec-title").forEach((h) => {
    const metin = h.textContent.trim();
    if (!window.efCizgi || ![...metin].every((ch) => efCizgi.G[ch])) return;   // yazıda olmayan harf varsa metin kalır
    h.classList.add("baslik");
    h.innerHTML = `<span class="gizli">${metin}</span>`;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("aria-hidden", "true");
    h.appendChild(svg);
    const yollar = efCizgi.yaz(svg, metin);
    yollar.forEach((p) => (p.style.transitionDelay = `${+p.dataset.harf * 28}ms`));
    izle.observe(h);
  });

  /* ---------- işler: kartın üzerine gelince site kendini gezer ---------- */
  // Kartta sitenin tam sayfa görüntüsü durur; üst kısmı eski küçük resimle aynı. Üzerine gelince (telefonda kart
  // ekranın ortasına gelince) görüntü sabit hızla en alta iner, çıkınca hızla başa döner.
  const TAM = { unihm: "/img/v4/isler/tam/unihm.webp", mahzen: "/img/v4/isler/tam/mahzen.webp", nobetci: "/img/v4/isler/tam/nobetci.webp" };
  document.querySelectorAll(".works .work").forEach((kart) => {
    const img = kart.querySelector("img"), ad = (img.getAttribute("src").match(/isler\/(\w+)\./) || [])[1];
    if (!TAM[ad]) return;
    const tam = new Image();
    tam.src = TAM[ad];
    tam.decode().then(() => {
      img.src = tam.src; img.removeAttribute("srcset");
      kart.classList.add("gezer");
      const sure = () => { const yol = img.clientWidth * tam.naturalHeight / tam.naturalWidth - img.clientHeight; kart.style.setProperty("--gez", `${Math.max(2, yol / 260).toFixed(1)}s`); };
      sure(); addEventListener("resize", sure);
    }).catch(() => {});
  });
  if (matchMedia("(hover: none)").matches) {
    const io = new IntersectionObserver((ler) => ler.forEach((e) => e.target.classList.toggle("gez", e.isIntersecting)), { rootMargin: "-30% 0px -30% 0px" });
    document.querySelectorAll(".works .work").forEach((k) => io.observe(k));
  }

})();
