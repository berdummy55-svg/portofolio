// Pastikan halaman selalu tampil (tidak stuck di fade-out)
document.body.classList.remove("fade-out");

// Toggle Menu
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const overlay = document.getElementById("menu-overlay");

// Toggle menu
menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  overlay.classList.toggle("active");
  menuToggle.classList.toggle("active"); // ⬅ tambahkan ini
});

// Tutup menu jika klik link
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
    overlay.classList.remove("active");
    menuToggle.classList.remove("active");
  });
});

// Tutup jika klik luar
overlay.addEventListener("click", () => {
  navLinks.classList.remove("active");
  overlay.classList.remove("active");
  menuToggle.classList.remove("active");
});

// AOS Init
AOS.init({
  duration: 1000,
  once: true
});

// Typing Animation
const texts = ["Editor", "Translator", "Freelancer"];
let count = 0;
let index = 0;
let currentText = "";
let letter = "";
(function type(){
  if(count === texts.length){
    count = 0;
  }
  currentText = texts[count];
  letter = currentText.slice(0, ++index);
  document.getElementById("typing").textContent = letter;
  if(letter.length === currentText.length){
    count++;
    index = 0;
  }
  setTimeout(type, 150);
})();

// Skill Animation
window.addEventListener("scroll", () => {
  document.querySelectorAll(".progress-bar").forEach(bar => {
    bar.style.width = bar.getAttribute("data-progress");
  });
});

// Particles
particlesJS("particles-js", {
  particles: {
    number: { value: 60 },
    color: { value: "#3b82f6" },
    size: { value: 3 },
    move: { speed: 2 }
  }
});

// ===== EMAILJS PROFESSIONAL VERSION =====
// GANTI DENGAN DATA KAMU
console.log("Script loaded");
emailjs.init("xXTWDV723kzcDGK1B");
const form = document.getElementById("contact-form");
const btn = document.getElementById("submit-btn");
const btnText = btn.querySelector(".btn-text");
const loader = btn.querySelector(".loader");
const statusDiv = document.getElementById("form-status");
form.addEventListener("submit", function(event) {
  event.preventDefault();
  btn.classList.remove("success", "error");
  statusDiv.classList.remove("show");

  // Loading state
  btn.disabled = true;
  btnText.textContent = "Mengirim...";
  loader.style.display = "inline-block";
  emailjs.sendForm("service_ynuxbpp", "template_hsrjkc8", this)
    .then(() => {
      btn.classList.add("success");
      statusDiv.textContent = "Pesan berhasil dikirim 🚀";
      statusDiv.classList.add("show");
      form.reset();
      setTimeout(() => {
        btn.classList.remove("success");
        btnText.textContent = "Kirim";
        btn.disabled = false;
      }, 3000);
    })
    .catch(() => {
      btn.classList.add("error");
      statusDiv.textContent = "Gagal mengirim pesan ❌";
      statusDiv.classList.add("show");
      btn.disabled = false;
      btnText.textContent = "Kirim";
    })
    .finally(() => {
      loader.style.display = "none";
    });
});

// Animasi klik untuk semua project card
document.querySelectorAll(".project-card, .back-area").forEach(card => {
  card.addEventListener("click", function () {
    card.classList.add("clicked");
    setTimeout(() => {
      card.classList.remove("clicked");
    }, 300);
  });
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function navigateWithDelay(url) {
  document.body.classList.add('project-card'​, 'back-area');
  await sleep(900); // Menunda 500ms
  window.location.href = url;
}/
