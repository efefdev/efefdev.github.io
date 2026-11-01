// efef.dev — ilk giriş: ef² → efefdev animasyonu (hızlandırılmış) tam ekranda oynar, sonra yazı
// portrenin arkasındaki büyük yazının yerine iner. Her yüklemede (bir bölüme bağlantıyla gelinmediyse; head'deki
// satır html'e "giris" sınıfını koyar, sayfa en üstten açılır); tıklama, tuş ya da kaydırma atlatır.
(() => {
  const html = document.documentElement;
  const hedef = document.querySelector(".word-svg"), kafa = document.querySelector(".ph-top");
  if (!html.classList.contains("giris") || !hedef || !window.ef2Animasyon) { html.classList.remove("giris"); return; }

  const kutu = document.createElement("div");
  kutu.id = "giris";
  kutu.setAttribute("aria-hidden", "true");
  const ortu = document.createElement("div"), sahne = document.createElement("div");
  ortu.className = "ortu";
  sahne.style.cssText = "position:absolute;inset:0";
  kutu.append(ortu, sahne);
  // başın saydam kopyası: yazı inerken başın arkasından geçsin (sayfadakiyle aynı yer, aynı görüntü)
  const bas = kafa && new Image();
  if (bas) { bas.src = kafa.currentSrc || kafa.src; bas.alt = ""; bas.style.opacity = 0; kutu.append(bas); }
  document.body.append(kutu);
  html.classList.replace("giris", "giris-oynuyor");
  const a = ef2Animasyon(sahne, { tema: "koyu", ana: [232, 232, 232], oran: innerWidth > innerHeight ? 0.42 : 0.72 });

  const HIZ = 1.6;                                 // sitede videodakinden hızlı
  const VB = [17, 32, 634];                        // büyük yazının viewBox'ı (x, y, genişlik)
  const UC = (a.SURE - 0.6) / HIZ, INIS = 0.7;     // kelime tamamlanınca iniş başlar
  const yum = (x) => 1 - Math.pow(1 - x, 4);
  let t0 = performance.now(), atla = false;
  // kaydırma kapatılmaz (overflow:hidden kaydırma çubuğunu gizler, bitince sayfa yana kayar);
  // animasyon sürerken kaydırma hareketi yutulur ve animasyonu atlatır
  const KAYDIRAN = ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "];
  const atlat = (e) => {
    atla = true;
    if (e.type === "wheel" || e.type === "touchmove" || (e.type === "keydown" && KAYDIRAN.includes(e.key))) e.preventDefault();
  };
  const olaylar = ["pointerdown", "keydown", "wheel", "touchmove"];
  olaylar.forEach((e) => addEventListener(e, atlat, { passive: false }));

  // p: 0 → 1; kelime ekranın ortasından büyük yazının üstüne taşınır (aynı yollar: birebir oturur), örtü kalkar
  function inis(p) {
    const W = sahne.clientWidth, H = sahne.clientHeight, son = a.son(), r = hedef.getBoundingClientRect();
    const kn = r.width / VB[2], f = kn / son.s;
    const nx = r.left + (son.cx - VB[0]) * kn, ny = r.top + (son.cy - VB[1]) * kn;
    const sc = Math.exp(Math.log(f) * p);          // ölçek oranla değişir: büyüme/küçülme düzgün görünür
    const ax = W / 2 + (nx - W / 2) * p, ay = H / 2 + (ny - H / 2) * p;
    a.svg.style.transform = `translate(${ax - sc * W / 2}px,${ay - sc * H / 2}px) scale(${sc})`;
    ortu.style.opacity = 1 - p;
    if (bas) {
      const k = kafa.getBoundingClientRect();
      Object.assign(bas.style, { left: k.left + "px", top: k.top + "px", width: k.width + "px", height: k.height + "px", opacity: p });
    }
  }
  function bitir() {
    olaylar.forEach((e) => removeEventListener(e, atlat));
    html.classList.remove("giris-oynuyor");
    kutu.remove();
  }
  function adim(simdi) {
    let t = (simdi - t0) / 1000;
    if (atla && t < UC) { t0 = simdi - UC * 1000; t = UC; }
    a.ciz(Math.min(t * HIZ, a.SURE));
    if (t >= UC) inis(yum(Math.min(1, (t - UC) / INIS)));
    if (t < UC + INIS) requestAnimationFrame(adim); else bitir();
  }
  requestAnimationFrame(adim);
})();
