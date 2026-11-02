// efef.dev — ef çizgi başlıklar; iş kartlarında site kendini gezer.
(() => {
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
