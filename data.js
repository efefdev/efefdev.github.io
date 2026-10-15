// efef.dev — tüm site içeriği bu dosyada.
// Yeni bilgi eklemek için sadece burayı düzenle; index.html / main.js'e dokunmana gerek yok.

window.SITE = {
  name: "Efe Altıntaş",
  domain: "efef.dev",
  role: "Backend & Siber Güvenlik Geliştiricisi",
  tagline:
    "Sistemleri önce nasıl kırılabileceklerini düşünerek inşa ediyorum — web'den sunucuya, altyapıdan markaya.",

  about: [
    "Merhaba, ben Efe. Samsun'da Ondokuz Mayıs Üniversitesi'nde okuyorum. Teknolojiye olan merakım beni backend geliştirme ve siber güvenlikle tanıştırdı; her sistemi önce nasıl kırılabileceğini düşünerek tasarlıyorum. Yaratıcı, güvenli ve performanslı çözümler üretmek en büyük motivasyonum.",
    "Akca Network'te Founding Engineer (Security) olarak çalışıyor, OMÜ Siber Güvenlik Topluluğu'nda Başkan Yardımcısı olarak görev yapıyorum. Çoğunlukla TypeScript, Node.js ve Python ile backend tarafında üretiyorum; SOC AI Telegram Bot gibi açık kaynak araçlar geliştiriyorum.",
    "Apple ekosisteminin minimalist yaklaşımından ilham alıyorum. Yazılımla grafik tasarımı bir araya getirebilmek projeleri uçtan uca hayata geçirmemi sağlıyor.",
  ],

  focus: [
    {
      icon: "shield",
      title: "Siber Güvenlik",
      text: "Web uygulama güvenliği, pentest ve raporlama, SOC otomasyonu, log analizi, CTF.",
    },
    {
      icon: "server",
      title: "Backend & Mimari",
      text: "REST/WebSocket API'ler, PostgreSQL, Redis, Docker, VPS ve sıfır güven dağıtımları.",
    },
    {
      icon: "pen",
      title: "Tasarım",
      text: "Topluluk görselleri, roll-up ve stant tasarımları, logo, marka kimliği ve taraftar materyalleri.",
    },
  ],

  experience: [
    {
      when: "Aralık 2025 – günümüz",
      role: "Founding Engineer, Security",
      org: "Akca Network",
      text: "Kurucu ekipte güvenlik odaklı mühendis: web altyapısı, sızma testi ve raporlama, ürünlerin güvenlik mimarisi.",
    },
    {
      when: "Mayıs 2026 – günümüz",
      role: "Başkan Yardımcısı",
      org: "OMÜ Siber Güvenlik Topluluğu",
      text: "Topluluk yönetimi ve teknik altyapı. Topluluğun sunucularının kurulumunu, altyapısını ve güvenliğini sağlıyorum.",
    },
    {
      when: "Nisan 2026 – günümüz",
      role: "Yönetim, Sosyal Medya & Temsilci",
      org: "UNİHM — Üniversite Hodri Meydan",
      text: "unihm.org'u sıfırdan tasarlayıp hayata geçirdim.",
    },
    {
      when: "2025 – devam ediyor",
      role: "Lisans öğrencisi",
      org: "Ondokuz Mayıs Üniversitesi",
      text: "",
    },
  ],

  certs: [
    { when: "2026", title: "Hackviser CWSE", text: "Certified Web Security Expert" },
    { when: "Aralık 2025", title: "Hackviser CAPT", text: "Certified Associate Penetration Tester" },
  ],

  // category: security | web | mobile
  projects: [
    {
      title: "omusiber.org",
      category: "web",
      year: "2026",
      featured: true,
      summary: "OMÜ Siber Güvenlik Topluluğu'nun resmi web sitesi — sunucu kurulumu, altyapısı ve güvenliği.",
      points: ["VPS kurulumu ve sertleştirme", "Docker üzerinde, Caddy arkasında yayın", "Cloudflare ile koruma ve yayın"],
      stack: ["Docker", "Caddy", "Linux", "Cloudflare"],
      links: [{ label: "omusiber.org", url: "https://omusiber.org" }],
    },
    {
      title: "unihm.org",
      category: "web",
      year: "2026",
      featured: true,
      summary:
        "Üniversite Hodri Meydan taraftar grubunun dijital evi: duyuruların, organizasyonların ve taraftar kimliğinin tek adreste buluştuğu platform.",
      points: ["Sıfırdan tasarım ve geliştirme", "Grubun görsel kimliğiyle bütünleşik arayüz", "Domain ve yayın yönetimi"],
      stack: ["Next.js"],
      links: [{ label: "unihm.org", url: "https://unihm.org" }],
    },
    {
      title: "AkcaVPN",
      category: "security",
      year: "2026",
      featured: true,
      summary: "AkcaVPN'in VPN altyapısı için yapılan güvenlik testleri ve raporlama.",
      points: ["Sunucu ve ağ altyapısı sızma testi", "Bulguların kurumsal formatta raporlanması", "Sertleştirme önerileri"],
      stack: ["Pentest", "Linux", "Network Security"],
      links: [{ label: "akcavpn.com", url: "https://akcavpn.com" }],
    },
    {
      title: "SOC AI Telegram Bot",
      category: "security",
      year: "2026",
      summary:
        "Linux sunucuları gerçek zamanlı izleyen, tehditleri AI ile tespit edip otomatik engelleyen açık kaynak SOC sistemi.",
      points: [
        "Log akışından gerçek zamanlı tehdit tespiti",
        "Groq AI ile olay sınıflandırma ve açıklama",
        "Telegram üzerinden alarm ve tek tıkla engelleme",
      ],
      stack: ["Python", "Groq AI", "Telegram Bot API", "Linux"],
      links: [{ label: "GitHub", url: "https://github.com/efefdev/soc-ai-telegram-bot" }],
    },
    {
      title: "Mahzen",
      category: "mobile",
      year: "2026",
      summary:
        "macOS için yerel, şifreli kasa uygulaması. Şifreleme çekirdeği arayüzden bağımsız ve test edilebilir şekilde ayrıldı.",
      points: [
        "Resmî Argon2 referans uygulaması ile anahtar türetme",
        "Ayrı, test edilebilir MahzenCore kasa formatı",
        "Türkçe yerelleştirme, SwiftUI arayüz",
      ],
      stack: ["Swift", "SwiftUI", "Argon2", "macOS 14"],
      links: [],
    },
  ],

  security: {
    intro:
      "Güvenliği bir özellik olarak değil, tasarımın başlangıç noktası olarak görüyorum. Yazdığım her sistemde tehdit modeli, en az yetki ve denetlenebilirlik var.",
    items: [
      {
        title: "CTF",
        text: "RSA kriptanalizi, PCAP trafik analizi, spektrogram üzerinden sinyal/steganografi çözümleri.",
      },
      {
        title: "Sunucu Sertleştirme",
        text: "Port knocking, SSH tünelleri, Cloudflare Tunnel, izole Docker ağları ve audit log ile sıfır güven yaklaşımı.",
      },
    ],
  },

  stack: {
    "Diller": ["TypeScript", "JavaScript", "Python", "Swift", "PHP", "C++", "SQL", "Bash"],
    "Backend": ["Node.js", "Fastify", "FastAPI", "Socket.io", "Prisma", "REST", "WebSocket"],
    "Frontend": ["Next.js", "React", "Tailwind CSS", "Vite", "PWA"],
    "Veri": ["PostgreSQL", "Redis", "SQLite", "Supabase", "Meilisearch"],
    "Altyapı": ["Docker", "Kubernetes", "Nginx", "Caddy", "Linux / Ubuntu", "Cloudflare", "GitHub Actions"],
    "Güvenlik": ["Web uygulama güvenliği", "Pentest", "Burp Suite", "Log analizi", "Argon2id", "JWT / JOSE", "TOTP", "Port knocking"],
    "Tasarım": ["Affinity Designer", "Affinity Photo", "Procreate", "Photoshop"],
  },


  contact: {
    email: "hi@efef.dev",
    links: [
      { label: "GitHub", url: "https://github.com/efefdev" },
      { label: "LinkedIn", url: "https://www.linkedin.com/in/efealtintas" },
      { label: "Instagram", url: "https://www.instagram.com/efefaltintas" },
      { label: "X", url: "https://x.com/efefdev" },
    ],
  },
};
