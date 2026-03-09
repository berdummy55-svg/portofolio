// Ambil parameter dari URL (misal: ?manga=manga1&chapter=53)
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

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
    }
  },
  manga2: {
    title: "Judul Manga 2",
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
        img.src = `${mangaId}/chapter${chapterNum}/${manga.prefix} ${chapterNum}_${i}.jpg`;
        img.alt = `Halaman ${i}`;
        // Prioritas tinggi untuk halaman pertama
        if (i === 1) img.fetchPriority = 'high';
        img.onerror = () => { img.src = 'placeholder.jpg'; }; // gambar cadangan
        imagesContainer.appendChild(img);
      }

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
        preloadImg.src = `${mangaId}/chapter${chapter.next}/${manga.prefix} ${chapter.next}_1.jpg`;
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