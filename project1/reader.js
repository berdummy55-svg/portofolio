// Ambil parameter dari URL (misal: ?manga=manga1&chapter=53)
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Base URL dari cloudflare
const BASE_URL = "https://pub-e8931c5705eb48b4b09534f5efbeacb9.r2.dev";

// Data manga
const mangaData = {
  manga1: {
    title: "New Normal",
    prefix: "NN",
    chapters: {
      53: { prev: null, next: 54, pages: 24 },
      54: { prev: 53, next: 55, pages: 24 },
      55: { prev: 54, next: 56, pages: 26 },
      56: { prev: 55, next: 57, pages: 26 },
      57: { prev: 56, next: 58, pages: 26 },
      58: { prev: 57, next: 59, pages: 26 },
      59: { prev: 58, next: 60, pages: 26 },
      60: { prev: 59, next: 61, pages: 25 },
      61: { prev: 60, next: 62, pages: 26 },
      62: { prev: 61, next: 63, pages: 26 },
      63: { prev: 62, next: 64, pages: 26 },
      64: { prev: 63, next: 65, pages: 26 },
    }
  },
  manga2: {
    title: "Renkinjutsushi no Henkyou Saisei Slow Life",
    prefix: "ALCHE",
    chapters: {
      1: { prev: null, next: 2, pages: 3 },
      2: { prev: 1, next: 3, pages: 3 },
      3: { prev: 2, next: null, pages: 3 }
    }
  }
};

const mangaId = getQueryParam('manga');
const chapterNum = getQueryParam('chapter');

if (!mangaId || !chapterNum) {
  alert('Parameter manga atau chapter tidak ditemukan.');
  window.location.href = 'index.html#portfolio';
} else {
  const manga = mangaData[mangaId];
  if (!manga) {
    alert('Manga tidak dikenal.');
    window.location.href = 'index.html#portfolio';
  } else {
    const chapter = manga.chapters[chapterNum];
    if (!chapter) {
      alert('Chapter tidak ditemukan.');
      window.location.href = 'index.html#portfolio';
    } else {
      // Set judul halaman
      document.title = `${manga.title} - Chapter ${chapterNum}`;
      document.getElementById('chapter-title').textContent = `${manga.title} - Chapter ${chapterNum}`;

      // --- LAZY LOADING DENGAN INTERSECTION OBSERVER ---
      const imagesContainer = document.getElementById('chapter-images');
      imagesContainer.innerHTML = ''; // kosongkan konten sebelumnya

      // Opsi observer: mulai muat gambar saat jarak 300px sebelum masuk viewport
      const observerOptions = { rootMargin: '300px', threshold: 0 };
      const imageObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.dataset.src;
            if (src) {
              img.src = src;
              img.removeAttribute('data-src');
            }
            obs.unobserve(img); // berhenti amati setelah dimuat
            }
        });
      }, observerOptions);

      // Loop untuk membuat elemen gambar
      for (let i = 1; i <= chapter.pages; i++) {
        const img = document.createElement('img');
        img.alt = `Halaman ${i}`;
        img.className = 'manga-page';
        
        // URL asli gambar
        const originalSrc = `${BASE_URL}/${mangaId}/chapter${chapterNum}/${manga.prefix} ${chapterNum}_${i}.jpg`.replace(/\s+/g, ' ');
        
        // Simpan URL asli ke dataset.src (belum dimuat)
        img.dataset.src = originalSrc;
        
        // Tampilkan placeholder kecil (opsional, bisa base64 atau gambar tipis)
        // Gunakan placeholder transparan agar layout stabil
        img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1200"%3E%3Crect width="100%25" height="100%25" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999"%3ELoading...%3C/text%3E%3C/svg%3E';
        
        // Halaman pertama diprioritaskan tinggi (meskipun via lazy, tetap akan cepat karena observer)
        if (i === 1) {
          img.fetchPriority = 'high';
          // Untuk halaman pertama, kita bisa langsung muat tanpa menunggu observer
          // Tapi biarkan observer tetap bekerja, namun rootMargin=300px sudah cukup
        }
        
        // Decoding async agar tidak memblokir rendering
        img.decoding = 'async';
        
        // Fallback jika gagal load
        img.onerror = () => {
          img.src = 'placeholder.jpg';
          img.dataset.src = ''; // hindari percobaan ulang
        };
        
        imagesContainer.appendChild(img);
        imageObserver.observe(img); // mulai amati
      }

      // --- PRELOAD CHAPTER BERIKUTNYA (Lebih agresif) ---
      if (chapter.next) {
        // Preload 2 halaman pertama chapter berikutnya
        const preloadCount = Math.min(2, manga.chapters[chapter.next]?.pages || 2);
        for (let i = 1; i <= preloadCount; i++) {
          const preloadLink = document.createElement('link');
          preloadLink.rel = 'preload';
          preloadLink.as = 'image';
          preloadLink.href = `${BASE_URL}/${mangaId}/chapter${chapter.next}/${manga.prefix} ${chapter.next}_${i}.jpg`.replace(/\s+/g, ' ');
          document.head.appendChild(preloadLink);
        }
      }

      // --- PRELOAD CHAPTER SEBELUMNYA (opsional, antisipasi navigasi mundur) ---
      if (chapter.prev) {
        const prevPreload = new Image();
        prevPreload.src = `${BASE_URL}/${mangaId}/chapter${chapter.prev}/${manga.prefix} ${chapter.prev}_1.jpg`.replace(/\s+/g, ' ');
        prevPreload.decoding = 'async';
      }

      // Link kembali ke halaman detail manga
      document.getElementById('nav-home').href = `${mangaId}/${mangaId}.html`;

      // Navigasi prev
      const prevLink = document.getElementById('prev-chapter');
      if (chapter.prev) {
        prevLink.href = `reader.html?manga=${mangaId}&chapter=${chapter.prev}`;
        prevLink.style.opacity = '1';
        prevLink.style.pointerEvents = 'auto';
      } else {
        prevLink.href = '#';
        prevLink.style.opacity = '0.5';
        prevLink.style.pointerEvents = 'none';
      }

      // Navigasi next
      const nextLink = document.getElementById('next-chapter');
      if (chapter.next) {
        nextLink.href = `reader.html?manga=${mangaId}&chapter=${chapter.next}`;
        nextLink.style.opacity = '1';
        nextLink.style.pointerEvents = 'auto';
      } else {
        nextLink.href = '#';
        nextLink.style.opacity = '0.5';
        nextLink.style.pointerEvents = 'none';
      }
    }
  }
}

// --- PROGRESS BAR (tanpa perubahan) ---
function updateReadingProgress() {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  const progressBar = document.getElementById('readingProgressBar');
  if (progressBar) {
    progressBar.style.width = scrolled + '%';
  }
}
window.addEventListener('scroll', updateReadingProgress);
window.addEventListener('load', updateReadingProgress);
