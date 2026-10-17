/**
 * CUONGTV - PERSONAL PORTAL & HOME SERVER HUB
 * Features:
 * 1. Pinned Horizontal Scroll Section: Vertical mouse scroll glides cards horizontally across the screen.
 * 2. Active Card Highlighting & Progress Tracking.
 * 3. Dynamic Typing Effect for Hero Title.
 * 4. Live Server Telemetry & Status Polling.
 * 5. Theme Toggle (Light/Dark) & Mobile Navigation.
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
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % TYPING_PHRASES.length;
    delay = 400;
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
      if (data.lanIp && heroServerText) {
        heroServerText.textContent = `Home Server: ${data.lanIp} • Trực tuyến (${data.status || 'online'})`;
      }
      if (data.cloudUrl && hubTunnelTag) {
        hubTunnelTag.innerHTML = `<i class="fa-solid fa-cloud"></i> <a href="${data.cloudUrl}" target="_blank" style="color:inherit; text-decoration:underline;">Cloud Tunnel</a>`;
      }
    }
  } catch (err) {
    console.log("Using cached server telemetry");
  }
}

// ==========================================
// 5. PINNED HORIZONTAL SCROLL ON VERTICAL WHEEL
// ==========================================
const scrollSection = document.getElementById("services");
const horizontalViewport = document.getElementById("horizontalViewport");
const horizontalTrack = document.getElementById("horizontalTrack");
const scrollProgressFill = document.getElementById("scrollProgressFill");
const scrollCurrentCardText = document.getElementById("scrollCurrentCardText");
const trackPrevBtn = document.getElementById("trackPrevBtn");
const trackNextBtn = document.getElementById("trackNextBtn");

let allCards = Array.from(document.querySelectorAll("#horizontalTrack .hub-card"));
let visibleCards = [...allCards];
let currentCategory = "all";
let isTicking = false;

function updateHorizontalScroll() {
  if (!scrollSection || !horizontalTrack || !horizontalViewport) return;

  const rect = scrollSection.getBoundingClientRect();
  const totalScrollDist = scrollSection.offsetHeight - window.innerHeight;

  if (totalScrollDist <= 0) return;

  // Scroll progress from 0 (entry) to 1 (exit)
  const scrolled = -rect.top;
  const progress = Math.max(0, Math.min(1, scrolled / totalScrollDist));

  // Compute maximum horizontal translation
  const maxTranslate = Math.max(0, horizontalTrack.scrollWidth - horizontalViewport.clientWidth);
  const currentTranslateX = progress * maxTranslate;

  horizontalTrack.style.transform = `translateX(-${currentTranslateX.toFixed(1)}px)`;

  // Update progress bar
  if (scrollProgressFill) {
    scrollProgressFill.style.width = `${(progress * 100).toFixed(1)}%`;
  }

  // Detect which card is currently centered
  const viewportRect = horizontalViewport.getBoundingClientRect();
  const viewportCenter = viewportRect.left + viewportRect.width / 2;

  let closestCard = null;
  let minDistance = Infinity;
  let closestIndex = 0;

  visibleCards.forEach((card, idx) => {
    const cardRect = card.getBoundingClientRect();
    const cardCenter = cardRect.left + cardRect.width / 2;
    const dist = Math.abs(viewportCenter - cardCenter);

    if (dist < minDistance) {
      minDistance = dist;
      closestCard = card;
      closestIndex = idx;
    }
  });

  // Highlight closest card
  visibleCards.forEach((card, idx) => {
    if (idx === closestIndex) {
      card.style.borderColor = "var(--primary)";
      card.style.transform = "translateY(-4px) scale(1.02)";
      card.style.boxShadow = "var(--shadow-xl)";
    } else {
      card.style.borderColor = "";
      card.style.transform = "";
      card.style.boxShadow = "";
    }
  });

  if (closestCard && scrollCurrentCardText) {
    const title = closestCard.getAttribute("data-title") || "Tiện ích";
    scrollCurrentCardText.textContent = `Thẻ ${closestIndex + 1} / ${visibleCards.length}: ${title}`;
  }

  isTicking = false;
}

function requestScrollTick() {
  if (!isTicking) {
    requestAnimationFrame(updateHorizontalScroll);
    isTicking = true;
  }
}

window.addEventListener("scroll", requestScrollTick, { passive: true });
window.addEventListener("resize", requestScrollTick);

// Quick Jump Nav Buttons (Step 1 card forward/backward)
if (trackNextBtn && scrollSection) {
  trackNextBtn.addEventListener("click", () => {
    const totalScrollDist = scrollSection.offsetHeight - window.innerHeight;
    const step = totalScrollDist / Math.max(1, visibleCards.length - 1);
    window.scrollBy({ top: step, behavior: "smooth" });
  });
}

if (trackPrevBtn && scrollSection) {
  trackPrevBtn.addEventListener("click", () => {
    const totalScrollDist = scrollSection.offsetHeight - window.innerHeight;
    const step = totalScrollDist / Math.max(1, visibleCards.length - 1);
    window.scrollBy({ top: -step, behavior: "smooth" });
  });
}

// ==========================================
// 6. CATEGORY FILTERING (SLIDES REFRESH)
// ==========================================
const hubTabButtons = document.querySelectorAll(".hub-tab-btn");

hubTabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    hubTabButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    currentCategory = btn.getAttribute("data-category");

    allCards.forEach(card => {
      const match = currentCategory === "all" || card.getAttribute("data-category") === currentCategory;
      card.style.display = match ? "flex" : "none";
    });

    visibleCards = allCards.filter(c => c.style.display !== "none");
    requestScrollTick();
  });
});

// ==========================================
// 7. INITIALIZE
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  typeLoop();
  checkLiveServer();
  updateHorizontalScroll();
});
