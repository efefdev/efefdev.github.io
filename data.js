// efef.dev — tüm site içeriği bu dosyada.
// Yeni bilgi eklemek için sadece burayı düzenle; index.html / main.js'e dokunmana gerek yok.

window.SITE = {
  name: "Efe Altıntaş",
  domain: "efef.dev",
  role: "Backend & Siber Güvenlik Geliştiricisi",
  tagline:
    "Sistemleri önce nasıl kırılabileceklerini düşünerek inşa ediyorum — web'den sunucuya, altyapıdan markaya.",

  about: [
    "Samsun'da Ondokuz Mayıs Üniversitesi'nde okuyorum; Akca Network'te Founding Engineer (Security), OMÜ Siber Güvenlik Topluluğu'nda Başkan Yardımcısıyım.",
    "Her sistemi önce nasıl kırılabileceğini düşünerek tasarlıyorum. Kod yazmadığım zamanlarda tasarım yapıyorum; projelerimin kimliğini de kendim kuruyorum.",
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
    { when: "2025", title: "Hackviser CAPT", text: "Certified Associate Penetration Tester" },
  ],

  // category: security | web | mobile
  // hook: kartın tek cümlelik girişi · demo: "nobetci" | "mahzen" · story: "nasıl yaptım" sayfası
  projects: [
    {
      title: "Mahzen",
      category: "mobile",
      year: "2026",
      featured: true,
      hook: "Sırların, kendi mahzeninde.",
      summary:
        "Dosyaların, notların ve parolaların için macOS ve Linux'ta çalışan şifreli, taşınabilir bir kasa. İnternete hiçbir şey gönderilmez, hesap gerekmez.",
      points: [
        "AES-256-GCM ve Argon2id (1 GB bellek); dosya adları dahil her şey şifreli",
        "Uygulama ve kasa yan yana bir SSD'de taşınabilir",
        "macOS (SwiftUI) ve Linux (GTK 4) aynı kasayı açar",
      ],
      stack: ["Swift", "SwiftUI", "Python", "GTK 4", "Argon2id"],
      demo: "mahzen",
      story: "/projeler/mahzen/",
      links: [
        { label: "mahzen.efef.dev", url: "https://mahzen.efef.dev" },
        { label: "GitHub", url: "https://github.com/efefdev/Mahzen" },
      ],
    },
    {
      title: "Nöbetçi",
      category: "security",
      year: "2026",
      featured: true,
      hook: "Banı asla yapay zekâ tetiklemez.",
      summary:
        "nginx çalışan Linux sunucular için kendi sunucunda çalışan, Telegram'dan yönetilen nöbetçi: kural motoru saldırıyı yakalayıp banlar, yapay zekâ kalanı inceler.",
      points: [
        "IP bazlı kural motoru ve tuzak URL'lerle anında ban",
        "Prompt injection'a karşı çitlenmiş yapay zekâ; banı asla AI tetiklemez",
        "Komut değil sabit eylem taşıyan Telegram onay butonları",
      ],
      stack: ["Python", "nginx", "Telegram Bot API", "Groq / Ollama", "systemd"],
      demo: "nobetci",
      story: "/projeler/nobetci/",
      links: [
        { label: "nobetci.efef.dev", url: "https://nobetci.efef.dev" },
        { label: "GitHub", url: "https://github.com/efefdev/nobetci" },
      ],
    },
    {
      title: "AkcaVPN",
      category: "security",
      year: "2026",
      hook: "Bir VPN altyapısını saldırgan gözüyle test ettim.",
      summary: "AkcaVPN'in VPN altyapısı için yapılan güvenlik testleri ve raporlama.",
      points: ["Sunucu ve ağ altyapısı sızma testi", "Bulguların kurumsal formatta raporlanması", "Sertleştirme önerileri"],
      stack: ["Pentest", "Linux", "Network Security"],
      links: [{ label: "akcavpn.com", url: "https://akcavpn.com" }],
    },
    {
      title: "omusiber.org",
      category: "web",
      year: "2026",
      hook: "Topluluğun sitesini ayakta ve güvende tutan altyapı.",
      summary: "OMÜ Siber Güvenlik Topluluğu'nun resmi web sitesi — sunucu kurulumu, altyapısı ve güvenliği.",
      points: ["VPS kurulumu ve sertleştirme", "Docker üzerinde, Caddy arkasında yayın", "Cloudflare ile koruma ve yayın"],
      stack: ["Docker", "Caddy", "Linux", "Cloudflare"],
      links: [{ label: "omusiber.org", url: "https://omusiber.org" }],
    },
    {
      title: "unihm.org",
      category: "web",
      year: "2026",
      hook: "Bir taraftar grubunun dijital evi, sıfırdan.",
      summary:
        "Üniversite Hodri Meydan taraftar grubunun dijital evi: duyuruların, organizasyonların ve taraftar kimliğinin tek adreste buluştuğu platform.",
      points: ["Sıfırdan tasarım ve geliştirme", "Grubun görsel kimliğiyle bütünleşik arayüz", "Domain ve yayın yönetimi"],
      stack: ["Next.js"],
      links: [{ label: "unihm.org", url: "https://unihm.org" }],
    },
  ],


  // Kareler: tasarım/kurgu işleri. type: "video" | "image". Videolar sessiz yüklenir (ses dosyadan çıkarıldı).
  kareler: {
    intro: "Kod yazmadığım zamanlarda kurgu ve görsel tasarım yapıyorum.",
    items: [
      {
        type: "video",
        src: "/img/kareler/ilerle.mp4",
        poster: "/img/kareler/ilerle.jpg",
        width: 960,
        height: 540,
        kind: "Kurgu",
        when: "Ekim 2026",
        caption: "ilerle.",
        alt: "Kamera kaydı görünümlü kısa video kurgusu: bir etkinlikten kareler",
        link: { label: "Sesli izle: Instagram", url: "https://www.instagram.com/p/DevqLV_s8tg/" },
      },
    ],
  },

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
      { label: "X", url: "https://x.com/efefdev0" },
    ],
  },
};
