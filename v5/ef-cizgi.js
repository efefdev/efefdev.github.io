/* ef çizgi — ef² işaretinin geometrisinden türetilmiş yazı.
   19 birim çizgi, 41 birim yay; x yüksekliği 57.5–158.5 (dış kenar), çıkıntı 32.5, iniş 200.
   Her harf orta çizgi yollarından oluşur (pathLength=1), böylece kendini çizebilir.
   efCizgi.yaz(svg, "işler.") → svg'nin içine yazar, viewBox'ı ayarlar, yolları döndürür. */
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const R = 41, O = 108, T = 57.5, B = 158, U = 32.5, A = 9.5; // yarıçap, x ortası, x üstü, taban, çıkıntı, yarım çizgi
  const yay = (c) => `M${c + R} ${O}A${R} ${R} 0 1 0 ${c - R} ${O}A${R} ${R} 0 1 0 ${c + R} ${O}`;
  const kemer = (x0, x1, y) => { const r = (x1 - x0) / 2; return `M${x0} ${y + r}A${r} ${r} 0 0 1 ${x1} ${y + r}V${B}`; };
  const nokta = (x, y0 = 28, y1 = 45) => `M${x} ${y0}V${y1}`;
  // kırpmalar: "x" → x yüksekliği bandı; ["e", cx] → e'nin dış çemberi
  const G = {
    a: { w: 101, p: [[yay(50.5)], [`M91.5 ${T}V${B}`]] },
    b: { w: 101, p: [[yay(50.5)], [`M9.5 ${U}V${B}`]] },
    d: { w: 101, p: [[yay(50.5)], [`M91.5 ${U}V${B}`]] },
    p: { w: 101, p: [[yay(50.5)], [`M9.5 ${T}V200`]] },
    o: { w: 101, p: [[yay(50.5)]] },
    e: { w: 101, p: [[`M10 ${O}H101`, ["e", 50.5]], [`M91.5 ${O}A${R} ${R} 0 1 0 81 137`]] },
    f: { w: 46, p: [[`M0 ${O}H46`], [`M9.5 ${B}V66A24 24 0 0 1 45.5 45`]] },
    h: { w: 101, p: [[`M9.5 ${U}V${B}`], [kemer(9.5, 91.5, 67)]] },
    n: { w: 101, p: [[`M9.5 ${T}V${B}`], [kemer(9.5, 91.5, 67)]] },
    m: { w: 151, p: [[`M9.5 ${T}V${B}`], [kemer(9.5, 75.5, 67)], [kemer(75.5, 141.5, 67)]] },
    r: { w: 66, p: [[`M9.5 ${T}V${B}`], [`M9.5 ${O}A${R} ${R} 0 0 1 50.5 67H66`]] },
    i: { w: 19, p: [[`M9.5 ${T}V${B}`], [nokta(9.5)]] },
    "ı": { w: 19, p: [[`M9.5 ${T}V${B}`]] },
    j: { w: 19, p: [[`M9.5 ${T}V176A24 24 0 0 1 -14.5 200`], [nokta(9.5)]] },   // kanca soldaki harfin altına girer
    l: { w: 19, p: [[`M9.5 ${U}V${B}`]] },
    t: { w: 62, p: [[`M0 67H62`], [`M21 ${U}V134A24 24 0 0 0 45 ${B - A}H62`]] },
    k: { w: 86, p: [[`M9.5 ${U}V${B}`], [`M88 46L26 110L92 170`, "x"]] },          // kol ve bacak tek çizgi, köşesi gövdeye yaslanır
    v: { w: 96, p: [[`M4 40L48 176L92 40`, "x"]] },
    z: { w: 88, p: [[`M2 67H80L8 149H86`]] },
    s: { w: 80, p: [[`M78 67H40A20.5 20.5 0 0 0 40 ${O}H42A20.5 20.5 0 0 1 42 149H2`]] },
    "ş": { w: 80, p: [[`M78 67H40A20.5 20.5 0 0 0 40 ${O}H42A20.5 20.5 0 0 1 42 149H2`], [`M38 150L30 182`]] },
    ".": { w: 19, p: [[`M9.5 139V${B}`]] },
    "?": { w: 82, p: [[`M10 64A30.5 30.5 0 1 1 51 92.5V118`], [`M51 139V${B}`]] },
    " ": { w: 42, p: [] },
  };
  const ARA = 18;
  // r'nin omzu sağa uzanır, altı boş kalır: ardından gelen harf biraz yaklaşır
  const KERN = { r: -10 };

  function yaz(svg, metin, ayar = {}) {
    svg.innerHTML = "";
    const defs = document.createElementNS(NS, "defs");
    svg.appendChild(defs);
    const g = document.createElementNS(NS, "g");
    g.setAttribute("fill", "none");
    g.setAttribute("stroke", "currentColor");
    g.setAttribute("stroke-width", 19);
    g.setAttribute("stroke-miterlimit", 10);
    svg.appendChild(g);
    const kim = Math.random().toString(36).slice(2, 7);
    let x = 0;
    const yollar = [];
    [...metin].forEach((ch, i) => {
      const gl = G[ch] || G[" "];
      gl.p.forEach(([d, kes]) => {
        const p = document.createElementNS(NS, "path");
        p.setAttribute("d", d);
        p.setAttribute("transform", `translate(${x} 0)`);
        p.setAttribute("pathLength", 1);
        if (kes) {
          const c = document.createElementNS(NS, "clipPath");
          c.id = `c${kim}${yollar.length}`;
          const s = document.createElementNS(NS, kes === "x" ? "rect" : "circle");
          if (kes === "x") Object.entries({ x: -20, y: T, width: gl.w + 40, height: B - T + 0.5 }).forEach(([k, v]) => s.setAttribute(k, v));
          else Object.entries({ cx: kes[1], cy: O, r: R + A }).forEach(([k, v]) => s.setAttribute(k, v));
          c.appendChild(s);
          defs.appendChild(c);
          p.setAttribute("clip-path", `url(#${c.id})`);
        }
        p.dataset.harf = i;
        g.appendChild(p);
        yollar.push(p);
      });
      x += gl.w + ARA + (KERN[ch] || 0);
    });
    const ust = /[bdhklt?]/.test(metin) ? 28 : /[ij]/.test(metin) ? 28 : 55;
    const alt = /[pjş]/.test(metin) ? 202 : 160;
    svg.setAttribute("viewBox", `-2 ${ust} ${x - ARA + 4} ${alt - ust}`);
    svg.style.aspectRatio = `${x - ARA + 4} / ${alt - ust}`;
    return yollar;
  }
  window.efCizgi = { yaz, G };
})();
