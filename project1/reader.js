// Ambil parameter dari URL (misal: ?manga=manga1&chapter=53)
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Base URL dari cloudflare
const BASE_URL = "https://pub-e8931c5705eb48b4b09534f5efbeacb9.r2.dev";

let chapterImageSrcs = [];
let ebookMode = false;
let currentEbookPage = 0;

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
} 
else {
  const manga = mangaData[mangaId];
  if (!manga) {
    alert('Manga tidak dikenal.');
    window.location.href = 'index.html#portfolio';
  } 
  else {
    const chapter = manga.chapters[chapterNum];
    if (!chapter) {
      alert('Chapter tidak ditemukan.');
      window.location.href = 'index.html#portfolio';
    } 
    else {
      // Set judul halaman
      document.title = `${manga.title} - Chapter ${chapterNum}`;
      document.getElementById('chapter-title').textContent = `${manga.title} - Chapter ${chapterNum}`;
      
      // Generate gambar chapter (dinamis)
      const imagesContainer = document.getElementById('chapter-images');
      imagesContainer.innerHTML = ''; // kosongkan konten sebelumnya

      for (let i = 1; i <= chapter.pages; i++) {
        const img = document.createElement('img');
        // Path dinamis sesuai mangaId, chapterNum, dan nomor halaman
        img.src = `${BASE_URL}/${mangaId}/chapter${chapterNum}/${manga.prefix} ${chapterNum}_${i}.jpg`;
        img.alt = `Halaman ${i}`;
        // Prioritas tinggi untuk halaman pertama
        img.src = img.src.replace(/\s+/g, ' '); // Normalize spasi
        img.alt = `Halaman ${i}`;
        if (i === 1) img.fetchPriority = 'high';
        img.onerror = () => { img.src = 'placeholder.jpg'; }; // gambar cadangan
        imagesContainer.appendChild(img);
        chapterImageSrcs.push(img.src);  // simpan URL
      }

// Tampilkan tombol ebook
const toggleEbookBtn = document.getElementById('toggle-ebook');
if (toggleEbookBtn) {
  toggleEbookBtn.style.display = 'inline-flex'; // karena kita pakai flex
  // Hapus event listener lama (bisa dengan clone, tapi lebih simpel:)
  const newBtn = toggleEbookBtn.cloneNode(true);
  toggleEbookBtn.parentNode.replaceChild(newBtn, toggleEbookBtn);
  // Tambahkan event listener ke tombol baru
  document.getElementById('toggle-ebook').addEventListener('click', toggleEbookMode);
  
   // Cek localStorage untuk mode ebook yang tersimpan
if (localStorage.getItem('ebookMode') === 'true') {
  // Pastikan array gambar sudah terisi
  if (chapterImageSrcs.length > 0) {
    // Masuk mode ebook tanpa animasi klik
    ebookMode = false; // sementara false agar fungsi berjalan benar
    toggleEbookMode(); // akan mengaktifkan mode ebook dan memperbarui tombol
    } 
  }
}

window.totalEbookPages = chapter.pages; // simpan untuk navigasi ebook

      // Link kembali ke halaman detail manga (dinamis)
      document.getElementById('nav-home').href = `${mangaId}/${mangaId}.html`;

      // Navigasi prev
      const prevLink = document.getElementById('prev-chapter');
      if (chapter.prev) {
        prevLink.href = `reader.html?manga=${mangaId}&chapter=${chapter.prev}`;
        prevLink.style.opacity = '1';
        prevLink.style.pointerEvents = 'auto';
      } 
      else {
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

        // --- PRELOAD CHAPTER BERIKUTNYA ---
        // Preload gambar pertama chapter berikutnya agar lebih cepat saat navigasi
        const preloadImg = new Image();
        preloadImg.src = `${BASE_URL}/${mangaId}/chapter${chapter.next}/${manga.prefix} ${chapter.next}_1.jpg`;
        preloadImg.src = preloadImg.src.replace(/\s+/g, ' ');
        preloadImg.loading = 'eager'; // muat segera
      } 
      else {
        nextLink.href = '#';
        nextLink.style.opacity = '0.5';
        nextLink.style.pointerEvents = 'none';
      }
    }
  }
}

// Fungsi untuk menghitung dan mengupdate progress bar
function updateReadingProgress() {
  const progressBar = document.getElementById('readingProgressBar');
  if (!progressBar) return;

  if (ebookMode && window.totalEbookPages > 0) {
    // Progress berdasarkan halaman ebook
    const progress = ((currentEbookPage + 1) / window.totalEbookPages) * 100;
    progressBar.style.width = progress + '%';
  } else {
    // Progress berdasarkan scroll vertikal (default)
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  }
}
// Panggil fungsi saat scroll
window.addEventListener('scroll', updateReadingProgress);
// Panggil sekali saat halaman dimuat untuk mengatur posisi awal
window.addEventListener('load', updateReadingProgress);

// Efek delay 100ms saat klik Prev, Next, atau Home
document.addEventListener("click", function(e) {
  // Targetkan tombol navigasi reader berdasarkan ID
  const clicked = e.target.closest("#prev-chapter, #next-chapter, #nav-home");
  
  // Hanya proses jika elemen ditemukan, memiliki href, dan bukan tautan mati (#)
  if (clicked && clicked.getAttribute('href') && clicked.getAttribute('href') !== '#') {
    e.preventDefault();          // batalkan navigasi langsung
    e.stopPropagation();        // hentikan propagasi event
    setTimeout(() => {
      window.location.href = clicked.getAttribute('href');
    }, 100);                    // pindah setelah 100ms
  }
});

// ========== MODE E-BOOK ==========
function toggleEbookMode() {
  const btn = document.getElementById('toggle-ebook');
  if (!ebookMode) {
    enterEbookMode();
    btn.classList.add('active');   // tampilkan ikon ebook
    btn.setAttribute('title', 'Mode Scroll');  // tooltip
  } else {
    exitEbookMode();
    btn.classList.remove('active'); // tampilkan ikon scroll
    btn.setAttribute('title', 'Mode E-Book');
  }
  localStorage.setItem('ebookMode', ebookMode);
}

function enterEbookMode() {
  ebookMode = true;
  const imagesContainer = document.getElementById('chapter-images');

  // === Deteksi halaman saat ini berdasarkan posisi scroll ===
  const allImages = imagesContainer.querySelectorAll('img');
  let bestPage = 0; // fallback halaman pertama
  if (allImages.length > 0) {
    const viewportCenter = window.innerHeight / 2;
    let minDistance = Infinity;
    allImages.forEach((img, index) => {
      const rect = img.getBoundingClientRect();
      // Abaikan gambar yang tingginya 0 (mungkin tersembunyi)
      if (rect.height === 0) return;
      const imgCenter = rect.top + rect.height / 2;
      const distance = Math.abs(imgCenter - viewportCenter);
      if (distance < minDistance) {
        minDistance = distance;
        bestPage = index;
      }
    });
  }
  currentEbookPage = bestPage;
  // ========================================================
  // Sembunyikan tampilan scroll
  imagesContainer.style.display = 'none';
  // Buat atau tampilkan viewer ebook
  let viewer = document.getElementById('ebook-viewer');
  if (!viewer) {
    viewer = document.createElement('div');
    viewer.id = 'ebook-viewer';
    viewer.innerHTML = '<img id="ebook-img" src="" alt="Halaman">';
    const nav = document.querySelector('.chapter-navigation');
    nav.parentNode.insertBefore(viewer, nav);
  }
  viewer.style.display = 'block';

  // Tampilkan gambar halaman yang terdeteksi
  updateEbookImage();

  // Pasang event klik
  viewer.addEventListener('click', handleEbookClick);
}

function exitEbookMode() {
  ebookMode = false;
  // Tampilkan kembali container scroll
  const imagesContainer = document.getElementById('chapter-images');
  imagesContainer.style.display = '';
  // Sembunyikan viewer ebook
  const viewer = document.getElementById('ebook-viewer');
  if (viewer) {
    viewer.style.display = 'none';
    viewer.removeEventListener('click', handleEbookClick);
  }
  // Kembalikan posisi scroll ke halaman yang sesuai dengan currentEbookPage
  const allImages = imagesContainer.querySelectorAll('img');
  if (allImages.length > currentEbookPage) {
    const targetImg = allImages[currentEbookPage];
    // Scroll agar gambar target berada di tengah layar (atau di atas)
    targetImg.scrollIntoView({ behavior: 'instant', block: 'center' });
  }
  // Update progress bar (agar segera menyesuaikan)
  updateReadingProgress();
}

function updateEbookImage() {
  const img = document.getElementById('ebook-img');
  if (img && chapterImageSrcs[currentEbookPage]) {
    img.src = chapterImageSrcs[currentEbookPage];
    img.alt = `Halaman ${currentEbookPage + 1}`;
  }
  updateReadingProgress();
}

function handleEbookClick(e) {
  if (!ebookMode) return;
  
  const viewer = document.getElementById('ebook-viewer');
  const rect = viewer.getBoundingClientRect();
  const x = e.clientX - rect.left; // posisi horizontal klik
  const half = rect.width / 2;
  
  if (x < half) {
    // Klik kiri → halaman sebelumnya
    if (currentEbookPage > 0) {
      currentEbookPage--;
      updateEbookImage();
    } else {
      // opsional: bisa beri efek getar atau abaikan
      console.log('Halaman pertama');
    }
  } else {
    // Klik kanan → halaman berikutnya
    if (currentEbookPage < window.totalEbookPages - 1) {
      currentEbookPage++;
      updateEbookImage();
    } else {
      console.log('Halaman terakhir');
    }
  }
}

// Keyboard navigation (opsional) ← →
document.addEventListener('keydown', function(e) {
  if (!ebookMode) return;
  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    if (currentEbookPage > 0) {
      currentEbookPage--;
      updateEbookImage();
    }
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    if (currentEbookPage < window.totalEbookPages - 1) {
      currentEbookPage++;
      updateEbookImage();
    }
  }
});
