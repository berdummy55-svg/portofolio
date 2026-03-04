// ===============================
// SAFE GLOBAL SCRIPT
// ===============================

document.addEventListener("DOMContentLoaded", function () {

  // ===============================
  // MENU TOGGLE
  // ===============================
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const overlay = document.getElementById("menu-overlay");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      menuToggle.classList.toggle("active");
      if (overlay) overlay.classList.toggle("active");
    });
  }

  if (overlay) {
    overlay.addEventListener("click", () => {
      navLinks.classList.remove("active");
      overlay.classList.remove("active");
      if (menuToggle) menuToggle.classList.remove("active");
    });
  }

  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
      if (navLinks) navLinks.classList.remove("active");
      if (overlay) overlay.classList.remove("active");
      if (menuToggle) menuToggle.classList.remove("active");
    });
  });


  // ===============================
  // TYPING ANIMATION (SAFE)
  // ===============================
  const typingElement = document.getElementById("typing");

  if (typingElement) {
    const texts = ["Web Developer", "UI/UX Designer", "Freelancer"];
    let count = 0;
    let index = 0;

    function type() {
      if (count === texts.length) count = 0;

      const currentText = texts[count];
      const letter = currentText.slice(0, ++index);

      typingElement.textContent = letter;

      if (letter.length === currentText.length) {
        count++;
        index = 0;
      }

      setTimeout(type, 150);
    }

    type();
  }


  // ===============================
  // SKILL ANIMATION
  // ===============================
  window.addEventListener("scroll", () => {
    document.querySelectorAll(".progress-bar").forEach(bar => {
      const value = bar.getAttribute("data-progress");
      if (value) bar.style.width = value;
    });
  });


  // ===============================
  // PARTICLES (SAFE CHECK)
  // ===============================
  if (document.getElementById("particles-js") && typeof particlesJS !== "undefined") {
    particlesJS("particles-js", {
      particles: {
        number: { value: 60 },
        color: { value: "#3b82f6" },
        size: { value: 3 },
        move: { speed: 2 }
      }
    });
  }


  // ===============================
  // EMAILJS (SAFE)
  // ===============================
  const form = document.getElementById("contact-form");

  if (form && typeof emailjs !== "undefined") {

    emailjs.init("i6uk0Pr54h0CPLOCq");

    const btn = document.getElementById("submit-btn");
    const btnText = btn?.querySelector(".btn-text");
    const loader = btn?.querySelector(".loader");
    const statusDiv = document.getElementById("form-status");

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      btn?.classList.remove("success", "error");
      statusDiv?.classList.remove("show");

      if (btn) btn.disabled = true;
      if (btnText) btnText.textContent = "Mengirim...";
      if (loader) loader.style.display = "inline-block";

      emailjs.sendForm("service_ynuxbpp", "template_hsrjkc8", this)
        .then(() => {

          btn?.classList.add("success");
          if (statusDiv) {
            statusDiv.textContent = "Pesan berhasil dikirim 🚀";
            statusDiv.classList.add("show");
          }

          form.reset();

          setTimeout(() => {
            btn?.classList.remove("success");
            if (btnText) btnText.textContent = "Kirim";
            if (btn) btn.disabled = false;
          }, 3000);

        })
        .catch(() => {

          btn?.classList.add("error");
          if (statusDiv) {
            statusDiv.textContent = "Gagal mengirim pesan ❌";
            statusDiv.classList.add("show");
          }

          if (btn) btn.disabled = false;
          if (btnText) btnText.textContent = "Kirim";

        })
        .finally(() => {
          if (loader) loader.style.display = "none";
        });

    });
  }


  // ===============================
  // PAGE TRANSITION
  // ===============================
  document.querySelectorAll("a[href$='.html']").forEach(link => {
    link.addEventListener("click", function (e) {

      if (this.target === "_blank") return;

      e.preventDefault();
      const href = this.getAttribute("href");

      document.body.classList.add("fade-out");

      setTimeout(() => {
        window.location.href = href;
      }, 300);

    });
  });

});
