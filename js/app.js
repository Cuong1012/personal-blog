/**
 * CUONGTV - PERSONAL PORTAL & HOME SERVER HUB
 * Manages Theme toggle, Dynamic Hero Typing, Live Server Polling, Hub Filtering & 3D Tilt.
 */

// ==========================================
// 1. THEME TOGGLE (LIGHT / DARK)
// ==========================================
function initTheme() {
  const savedTheme = localStorage.getItem("devlog-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme ? savedTheme : (prefersDark ? "dark" : "light");

  document.documentElement.setAttribute("data-theme", initialTheme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  const nextTheme = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", nextTheme);
  localStorage.setItem("devlog-theme", nextTheme);
}

const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
  themeToggle.addEventListener("click", toggleTheme);
}

// ==========================================
// 2. MOBILE MENU & NAVIGATION
// ==========================================
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navMenu = document.getElementById("navMenu");

if (mobileMenuBtn && navMenu) {
  mobileMenuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("open");
  });

  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
    });
  });
}

const currentYearEl = document.getElementById("currentYear");
if (currentYearEl) {
  currentYearEl.textContent = new Date().getFullYear();
}

// ==========================================
// 3. DYNAMIC HERO TYPING EFFECT
// ==========================================
const TYPING_PHRASES = [
  "Home Server & IoT",
  "Công Cụ & Tiện Ích Số",
  "Tự Động Hóa Hệ Thống",
  "Lập Trình & Sáng Tạo"
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingTextEl = document.getElementById("typingText");

function typeLoop() {
  if (!typingTextEl) return;

  const currentPhrase = TYPING_PHRASES[phraseIndex];
  
  if (isDeleting) {
    charIndex--;
    typingTextEl.textContent = currentPhrase.substring(0, charIndex);
  } else {
    charIndex++;
    typingTextEl.textContent = currentPhrase.substring(0, charIndex);
  }

  let delay = isDeleting ? 40 : 80;

  if (!isDeleting && charIndex === currentPhrase.length) {
    delay = 2000; // Pause at full word
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % TYPING_PHRASES.length;
    delay = 400; // Pause before typing next word
  }

  setTimeout(typeLoop, delay);
}

// ==========================================
// 4. LIVE SERVER STATUS POLLING
// ==========================================
async function checkLiveServer() {
  const heroServerText = document.getElementById("heroServerText");
  const hubTunnelTag = document.getElementById("hubTunnelTag");

  try {
    const res = await fetch(`server-status.json?t=${Date.now()}`);
    if (res.ok) {
      const data = await res.json();
      if (data.lanIp) {
        if (heroServerText) {
          heroServerText.textContent = `Home Server: ${data.lanIp} • Trực tuyến (${data.status || 'online'})`;
        }
      }
      if (data.cloudUrl && hubTunnelTag) {
        hubTunnelTag.innerHTML = `<i class="fa-solid fa-cloud"></i> <a href="${data.cloudUrl}" target="_blank" style="color:inherit; text-decoration:underline;">Cloud Tunnel</a>`;
      }
    }
  } catch (err) {
    console.log("Using cached/default server telemetry");
  }
}

// ==========================================
// 5. INTERACTIVE HUB TABS FILTER
// ==========================================
const hubTabButtons = document.querySelectorAll(".hub-tab-btn");
const hubCards = document.querySelectorAll(".hub-card");

hubTabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    hubTabButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const category = btn.getAttribute("data-category");

    hubCards.forEach(card => {
      const cardCategory = card.getAttribute("data-category");
      const shouldShow = category === "all" || cardCategory === category;

      if (shouldShow) {
        card.style.display = "flex";
        requestAnimationFrame(() => {
          card.style.opacity = "1";
          card.style.transform = "scale(1)";
        });
      } else {
        card.style.opacity = "0";
        card.style.transform = "scale(0.96)";
        setTimeout(() => {
          if (btn.classList.contains("active") && btn.getAttribute("data-category") !== "all" && card.getAttribute("data-category") !== btn.getAttribute("data-category")) {
            card.style.display = "none";
          }
        }, 250);
      }
    });
  });
});

// ==========================================
// 6. 3D TILT EFFECT ON CARDS (RESPECT REDUCED MOTION)
// ==========================================
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion && window.innerWidth > 768) {
  hubCards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px) scale(1.01)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)";
    });
  });
}

// ==========================================
// 7. INITIALIZE
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  typeLoop();
  checkLiveServer();
});
