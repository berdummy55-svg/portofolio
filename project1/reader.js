// Base URL dari cloudflare
const BASE_URL = "https://pub-e8931c5705eb48b4b09534f5efbeacb9.r2.dev";
const MANGA_JSON_URL = `${BASE_URL}/manga.json`;

let mangaData = {};
let chapterImageSrcs = [];
let ebookMode = false;
let currentEbookPage = 0;
let savedScrollY = 0;
let totalPages = 0;

fetch(MANGA_JSON_URL)
.then(res => res.json())
.then(data => {
mangaData = data;
initReader();
})

.catch(err => {
alert('Gagal memuat data manga.'); console.error(err);
});



function initReader() {
  
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const mangaId = getQueryParam('manga');
const chapterNum = getQueryParam('chapter');

if (!mangaId || !chapterNum) {
  alert('Parameter manga atau chapter tidak ditemukan.');
  window.location.href = 'index.html';
} 
else {
  const manga = mangaData[mangaId];
  if (!manga) {
    alert('Manga tidak dikenal.');
    window.location.href = 'index.html';
  } 
  else {
    const chapter = manga.chapters[chapterNum];
    if (!chapter) {
      alert('Chapter tidak ditemukan.');
      window.location.href = 'index.html';
    } 
    else {
      // Set judul halaman
      document.title = `${manga.title} - Chapter ${chapterNum}`;
      document.getElementById('chapter-title').textContent = `${manga.title} - Chapter ${chapterNum}`;

// Simpan chapter yang sedang dibaca ke localStorage
const readData = localStorage.getItem(`readChapters_${mangaId}`);
let readChapters = readData ? readData.split(',') : [];

// Tambahkan chapter ini jika belum ada
if (!readChapters.includes(chapterNum)) {
  readChapters.push(chapterNum);
  localStorage.setItem(`readChapters_${mangaId}`, readChapters.join(','));
  console.log(`💾 Chapter ${chapterNum} disimpan sebagai sudah dibaca`);
}

// Ubah teks logo di navbar menjadi judul chapter
const logoElement = document.querySelector('.logo');

      
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
      totalPages = chapter.pages;
window.totalEbookPages = chapter.pages;
updatePageIndicator(1);

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
      document.getElementById('nav-home').href = `manga1/manga.html?id=${mangaId}`;

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
window.addEventListener('scroll', () => {
    if (!ebookMode) {
        // 1. Update Progress Bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.getElementById('readingProgressBar').style.width = scrolled + '%';

        // 2. Deteksi Halaman (Gunakan IntersectionObserver untuk performa lebih baik di masa depan)
        const images = document.querySelectorAll('#chapter-images img');
        if (images.length > 0) {
            const viewportCenter = window.innerHeight / 2;
            let best = 0, minDist = Infinity;
            images.forEach((img, idx) => {
                const rect = img.getBoundingClientRect();
                if (rect.height === 0) return;
                const dist = Math.abs(rect.top + rect.height/2 - viewportCenter);
                if (dist < minDist) { minDist = dist; best = idx; }
            });
            updatePageIndicator(best + 1);
        }
    } else {
        // Progress bar ebook
        const progress = ((currentEbookPage + 1) / totalPages) * 100;
        document.getElementById('readingProgressBar').style.width = progress + '%';
    }
});

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
  localStorage.setItem('ebookMode', ebookMode.toString());
}

function enterEbookMode() {
  savedScrollY = window.scrollY;
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
  updatePageIndicator(currentEbookPage + 1);
  
  // ========================================================
  
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
 const headerHeight = document.querySelector('header').offsetHeight;
window.scrollTo({ top: headerHeight, behavior: 'instant' });
  
  // Tampilkan gambar halaman yang terdeteksi
  updateEbookImage();
  // Sembunyikan tampilan scroll
  imagesContainer.style.display = 'none';
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
    updatePageIndicator(currentEbookPage + 1);
  }

  // Kembalikan posisi scroll ke halaman yang sesuai
  const allImages = imagesContainer.querySelectorAll('img');
  if (allImages.length > currentEbookPage) {
    const targetImg = allImages[currentEbookPage];
    if (currentEbookPage > 0) {
      // Halaman pertama 
      targetImg.scrollIntoView({ behavior: 'instant', block: 'center'});
    } 
  }
  // Update progress bar
  updateReadingProgress();
}

function updateEbookImage() {
  const img = document.getElementById('ebook-img');
  if (img && chapterImageSrcs[currentEbookPage]) {
    img.src = chapterImageSrcs[currentEbookPage];
    img.alt = `Halaman ${currentEbookPage + 1}`;
    updatePageIndicator(currentEbookPage + 1);
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

function updatePageIndicator(pageNum) {
  const logo = document.querySelector('.logo');
  if (logo) logo.textContent = `${pageNum}/${totalPages}`;
}
}
