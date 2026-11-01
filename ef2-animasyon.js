/* ef² → efefdev açılış animasyonu.
   ef çizilir, ² akıp ikinci "ef" olur, "dev" aynı çizgilerle yazılır; kamera ef²'den kelimenin tamamına çekilir.
   Bütün harfler işaretin geometrisiyle çizilir (19 birim çizgi, 41 birim yay, 158'de taban): font değişimi yok.
   ciz(t) her an için kareyi baştan kurar (deterministik): sitede requestAnimationFrame ile oynar,
   video çiziminde kare kare çağrılır; ikisi de aynı görüntüyü verir.

   Kullanım:
     const a = ef2Animasyon(kutu, { tema: "koyu" | "acik", oran: 0.7 });
     a.oynat();            // bir kez oynatır, sonda "efefdev"de kalır
     a.ciz(1.2);           // belirli bir anı çizer
   kutu: position:relative olan, boyutu belli bir öğe.
   Sitede menüdeki yazı (index.html .nav-logo .yazi) aynı yollarla çizilir: biri değişirse öteki de.
*/
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const MOR = [167, 139, 250];
  const SURE = 2.8;
  const EF_ARA = 161;                                 // ikinci "ef" birincinin bu kadar sağında
  const ef = (x) => [`M${27 + x} 108H${164 + x}`, `M${108.5 + x} 108A41 41 0 1 0 ${98 + x} 137`, `M${140 + x} 158V66A24 24 0 0 1 ${176 + x} 45`];
  // dev: d (yay + gövde), e (çizgi + yay), v (iki çizgi, üst ve alt düz kesik)
  const D = 389.5, E = 504.5, V = 603;
  const HARF = [
    // [yol, başlangıç, süre, katman]
    ...ef(0).map((d, i) => [d, [0, .1, .26][i], [.38, .5, .44][i], "A"]),
    ...ef(EF_ARA).map((d, i) => [d, [1.0, 1.06, 1.14][i], [.24, .34, .3][i], "B"]),
    [`M${D + 41} 108A41 41 0 1 0 ${D - 41} 108A41 41 0 1 0 ${D + 41} 108`, 1.36, .4, "dev"],
    [`M${D + 41} 32.5V158`, 1.46, .3, "dev"],
    [`M${E - 40.5} 108H${E + 50.5}`, 1.56, .2, "e"],     // yayın dış kenarına kadar, çemberle kırpılır
    [`M${E + 41} 108A41 41 0 1 0 ${E + 30.5} 137`, 1.62, .34, "dev"],
    [`M${V - 44} 40L${V} 176L${V + 44} 40`, 1.74, .36, "v"],
  ];
  const KARE = "M3 13A11 11 0 1 1 21 21L3 41H27";
  const KARE_M = [190 + 15 * 1.25, 24 + 22 * 1.25];   // ²'nin merkezi
  const BAS = [17, 228], SON = [17, 651];             // ef² ve efefdev'in yatay sınırları
  const ORTA_Y = 108;                                  // x yüksekliğinin ortası
  const TABAN = 158;                                   // taban çizgisi (f'nin dibi)

  const kl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const ilk = (t, a, d) => kl((t - a) / d);
  const cik = x => 1 - Math.pow(1 - x, 3);
  const ikiyan = x => x < .5 ? 8 * x ** 4 : 1 - Math.pow(-2 * x + 2, 4) / 2;
  const geri = x => { const c = 1.6; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  const kar = (a, b, x) => a + (b - a) * x;

  function svg(ad, oz, ust) {
    const e = document.createElementNS(NS, ad);
    for (const k in oz) e.setAttribute(k, oz[k]);
    if (ust) ust.appendChild(e);
    return e;
  }

  window.ef2Animasyon = function (kok, ayar = {}) {
    const koyu = (ayar.tema || "koyu") === "koyu";
    const ANA = ayar.ana || (koyu ? [255, 255, 255] : [10, 10, 11]);   // ayar.ana: [r, g, b] (sitede --ink)
    const renk = (a, b, x) => `rgb(${a.map((v, i) => Math.round(kar(v, b[i], x))).join(",")})`;
    const oran = ayar.oran || 0.7;
    kok.innerHTML = "";

    const kat = svg("svg", { style: "position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible" }, kok);
    const defs = svg("defs", {}, kat);
    const kes = svg("clipPath", { id: "ef2-v-" + Math.random().toString(36).slice(2) }, defs);
    svg("rect", { x: V - 80, y: 57.5, width: 160, height: 101 }, kes);   // v: üstü ve altı düz kesik
    const kesE = svg("clipPath", { id: "ef2-e-" + Math.random().toString(36).slice(2) }, defs);
    svg("circle", { cx: E, cy: 108, r: 50.5 }, kesE);   // e'nin çizgisi yayın dış çemberinde biter: ne boşluk ne taşma
    const kamera = svg("g", {}, kat);
    const gruplar = {
      A: svg("g", { fill: "none", stroke: renk(ANA, ANA, 0), "stroke-width": 19 }, kamera),
      B: svg("g", { fill: "none", "stroke-width": 19 }, kamera),
      dev: svg("g", { fill: "none", stroke: renk(ANA, ANA, 0), "stroke-width": 19 }, kamera),
      e: svg("g", { fill: "none", stroke: renk(ANA, ANA, 0), "stroke-width": 19, "clip-path": `url(#${kesE.id})` }, kamera),
      v: svg("g", { fill: "none", stroke: renk(ANA, ANA, 0), "stroke-width": 19, "stroke-linejoin": "miter", "stroke-miterlimit": 10, "clip-path": `url(#${kes.id})` }, kamera),
    };
    const yollar = HARF.map(([d, , , g]) => svg("path", { d, pathLength: 1, "stroke-dasharray": "1 2", "stroke-dashoffset": 1 }, gruplar[g]));
    const kareG = svg("g", {}, kamera);
    const kare = svg("path", { d: KARE, transform: "translate(190 24) scale(1.25)", fill: "none", stroke: renk(MOR, MOR, 0), "stroke-width": 8, "stroke-linejoin": "miter", pathLength: 1, "stroke-dasharray": "1 2", "stroke-dashoffset": 1 }, kareG);

    let O;
    function olc() {
      const W = kok.clientWidth, H = kok.clientHeight;
      const s = oran * W / (SON[1] - SON[0]);                        // son hâl: kelime genişliğin "oran"ı kadar
      const z0 = Math.min(W * (W > H ? .32 : .42), H * .5 * 1.42) / ((BAS[1] - BAS[0]) * s);  // başta ef² büyük
      O = { W, H, s, z0 };
    }

    // ayar.sabit: {x, ust, alt} → kamera oynamaz; kelimenin solu x'te, f/d'nin tepesi ust'te, tabanı alt'ta (px).
    //   (videodaki "@efefdev" yazısının yerine oturtmak için)
    // ayar.anaRenk(t): [r, g, b] → ef/dev rengi zamanla değişir (ör. mordan beyaza)
    function ciz(t) {
      if (!O) olc();
      const { W, H, s } = O;
      let k;
      if (ayar.sabit) {
        const { x, ust, alt } = ayar.sabit;
        k = (alt - ust) / (TABAN - 32.5);
        kamera.setAttribute("transform", `translate(${x - SON[0] * k} ${ust - 32.5 * k}) scale(${k})`);
      } else {
        // kamera: ef²'ye yakın başlar (hafif içe süzülerek), kelime yazılırken geri çekilir
        const gir = cik(ilk(t, 0, .9)), cek = ikiyan(ilk(t, .92, 1.2));
        const z = kar(O.z0 * kar(1.08, 1, gir), 1, cek);
        const cx = kar((BAS[0] + BAS[1]) / 2, (SON[0] + SON[1]) / 2, cek);
        k = s * z;
        kamera.setAttribute("transform", `translate(${W / 2 - cx * k} ${H / 2 - ORTA_Y * k}) scale(${k})`);
      }
      const ana = ayar.anaRenk ? ayar.anaRenk(t) : ANA;
      if (ayar.anaRenk) ["A", "dev", "e", "v"].forEach((g) => gruplar[g].setAttribute("stroke", renk(ana, ana, 0)));
      // harfler çizilir
      HARF.forEach(([, a, d], i) => yollar[i].setAttribute("stroke-dashoffset", 1 - cik(ilk(t, a, d))));
      // ikinci ef mor doğar, renge döner
      gruplar.B.setAttribute("stroke", renk(MOR, ana, ilk(t, 1.28, .3)));
      // ²: çizilir, parlar; sonra ikinci ef'in yerine süzülürken baştan silinir (çizgisi ikinci ef'e akar)
      const kc = ilk(t, .5, .32), nab = Math.sin(Math.PI * ilk(t, .78, .3)), uc = ikiyan(ilk(t, .95, .42));
      const hx = kar(KARE_M[0], EF_ARA + 98.5, uc), hy = kar(KARE_M[1], ORTA_Y, uc) - Math.sin(Math.PI * uc) * 30;
      const kb = ((kc < 1 ? kar(.5, 1, geri(kc)) : 1) + .12 * nab) * kar(1, 1.7, uc);
      kareG.setAttribute("transform", `translate(${hx} ${hy}) scale(${kb}) translate(${-KARE_M[0]} ${-KARE_M[1]})`);
      const bit = cik(ilk(t, 1.02, .3));
      kare.setAttribute("stroke-dasharray", `${1 - bit} 2`);
      kare.setAttribute("stroke-dashoffset", t < 1.02 ? 1 - cik(kc) : -bit);
      kare.style.filter = nab > .01 ? `drop-shadow(0 0 ${12 * nab / k}px rgb(${MOR}))` : "none";
      kareG.style.opacity = t < .5 || bit >= 1 ? 0 : 1;
    }

    let istek;
    function oynat(bitince) {
      cancelAnimationFrame(istek);
      const t0 = performance.now();
      const adim = () => { const t = (performance.now() - t0) / 1000; ciz(Math.min(t, SURE)); if (t < SURE) istek = requestAnimationFrame(adim); else if (bitince) bitince(); };
      adim();
    }
    olc();
    ciz(0);
    // son hâlde kelimenin yeri: ekranın ortasında, 1 işaret birimi = s piksel (menüye uçuş için)
    const son = () => ({ s: O.s, cx: (SON[0] + SON[1]) / 2, cy: ORTA_Y });
    return { ciz, oynat, olc, son, SURE, svg: kat };
  };
  window.ef2Animasyon.SURE = SURE;
})();
