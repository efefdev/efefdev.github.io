// efef.dev — küçük davranışlar: belirme, video önizleme, gönderi büyütme, gece notu, kartvizit karşılaması.
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const note = document.getElementById("note");
  const params = new URLSearchParams(location.search);

  // belirme (içerik hep görünür; yalnızca yerine oturur)
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    io.unobserve(e.target);
  }), { threshold: 0.12 });
  document.querySelectorAll(".rv").forEach((el) => io.observe(el));

  // video yalnızca görünürken (ve hareket azaltılmamışsa) sessiz oynar
  const video = document.querySelector(".reel video");
  if (video && !reduce) {
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) video.play().catch(() => {});
      else video.pause();
    }, { threshold: 0.35 }).observe(video);
  }

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

  const h = new Date().getHours();
  const notes = [];
  // gece gelenlere küçük selam
  if (h >= 23 || h < 6) notes.push("☾ gece vardiyası");
  if (notes.length) {
    note.textContent = notes.join(" · ");
    note.hidden = false;
  }

  // kartvizitteki QR'dan gelen (efef.dev/?k)
  if (params.has("k")) {
    history.replaceState(null, "", location.pathname + location.hash);
    const toast = document.getElementById("toast");
    toast.textContent = "kartvizitten geldin, hoş geldin.";
    toast.hidden = false;
    setTimeout(() => toast.classList.add("out"), 3600);
    setTimeout(() => { toast.hidden = true; }, 4100);
  }
})();
