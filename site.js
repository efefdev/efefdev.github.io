// efef.dev — küçük davranışlar: belirme, video önizleme, gece notu, kartvizit karşılaması.
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
