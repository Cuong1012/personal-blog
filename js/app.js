/**
 * CUONGTV - PERSONAL PORTAL & HOME SERVER HUB
 * Features: Horizontal Stacked Card Deck (Coverflow), Grid Mode Toggle,
 * Dynamic Typing, Live Server Polling, Theme Toggle & Keyboard/Touch Gestures.
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
// 5. HORIZONTAL STACKED CARD DECK (COVERFLOW)
// ==========================================
const hubDeckWrapper = document.getElementById("hubDeckWrapper");
const allHubCards = Array.from(document.querySelectorAll(".hub-card"));
const deckPrevBtn = document.getElementById("deckPrevBtn");
const deckNextBtn = document.getElementById("deckNextBtn");
const deckDotsContainer = document.getElementById("deckDots");
const deckCurrentIndexEl = document.getElementById("deckCurrentIndex");
const deckTotalCardsEl = document.getElementById("deckTotalCards");
const deckCardTitleEl = document.getElementById("deckCardTitle");
const btnDeckMode = document.getElementById("btnDeckMode");
const btnGridMode = document.getElementById("btnGridMode");

let currentCategory = "all";
let visibleCards = [...allHubCards];
let activeDeckIndex = 0;
let isDeckMode = true;

// Build pagination dots
function renderDeckDots() {
  if (!deckDotsContainer) return;
  deckDotsContainer.innerHTML = "";
  visibleCards.forEach((card, idx) => {
    const dot = document.createElement("button");
    dot.className = `deck-dot ${idx === activeDeckIndex ? "active" : ""}`;
    dot.setAttribute("aria-label", `Xem thẻ ${idx + 1}`);
    dot.addEventListener("click", () => {
      activeDeckIndex = idx;
      updateDeckPositions();
    });
    deckDotsContainer.appendChild(dot);
  });
}

// Position cards horizontally in 3D perspective
function updateDeckPositions() {
  if (!isDeckMode) return;

  if (visibleCards.length === 0) return;

  if (activeDeckIndex >= visibleCards.length) {
    activeDeckIndex = 0;
  }

  // Update card classes
  allHubCards.forEach(card => {
    const visibleIdx = visibleCards.indexOf(card);

    // Remove all deck state classes
    card.classList.remove(
      "card-active",
      "card-next-1",
      "card-next-2",
      "card-prev-1",
      "card-prev-2",
      "card-hidden"
    );

    if (visibleIdx === -1) {
      card.style.display = "none";
      return;
    }

    card.style.display = "flex";
    const delta = visibleIdx - activeDeckIndex;

    if (delta === 0) {
      card.classList.add("card-active");
    } else if (delta === 1) {
      card.classList.add("card-next-1");
    } else if (delta === 2) {
      card.classList.add("card-next-2");
    } else if (delta === -1) {
      card.classList.add("card-prev-1");
    } else if (delta === -2) {
      card.classList.add("card-prev-2");
    } else {
      card.classList.add("card-hidden");
    }
  });

  // Update Dots
  if (deckDotsContainer) {
    const dots = deckDotsContainer.querySelectorAll(".deck-dot");
    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === activeDeckIndex);
    });
  }

  // Update Label
  if (deckCurrentIndexEl) deckCurrentIndexEl.textContent = activeDeckIndex + 1;
  if (deckTotalCardsEl) deckTotalCardsEl.textContent = visibleCards.length;
  if (deckCardTitleEl && visibleCards[activeDeckIndex]) {
    deckCardTitleEl.textContent = visibleCards[activeDeckIndex].getAttribute("data-title") || "";
  }
}

// Next / Previous Navigation
function nextCard() {
  if (visibleCards.length <= 1) return;
  activeDeckIndex = (activeDeckIndex + 1) % visibleCards.length;
  updateDeckPositions();
}

function prevCard() {
  if (visibleCards.length <= 1) return;
  activeDeckIndex = (activeDeckIndex - 1 + visibleCards.length) % visibleCards.length;
  updateDeckPositions();
}

if (deckNextBtn) deckNextBtn.addEventListener("click", nextCard);
if (deckPrevBtn) deckPrevBtn.addEventListener("click", prevCard);

// Click directly on stacked cards to bring them to front
allHubCards.forEach(card => {
  card.addEventListener("click", (e) => {
    if (!isDeckMode) return;

    // If clicking an action link/button inside the active card, let it trigger
    if (e.target.closest("a") || e.target.closest("button")) {
      return;
    }

    const cardIdx = visibleCards.indexOf(card);
    if (cardIdx !== -1 && cardIdx !== activeDeckIndex) {
      e.preventDefault();
      activeDeckIndex = cardIdx;
      updateDeckPositions();
    }
  });
});

// Keyboard Navigation (ArrowLeft / ArrowRight)
window.addEventListener("keydown", (e) => {
  if (!isDeckMode) return;
  if (e.key === "ArrowRight") {
    nextCard();
  } else if (e.key === "ArrowLeft") {
    prevCard();
  }
});

// Touch Swipe on Deck Stage
let touchStartX = 0;
let touchEndX = 0;
const deckStage = document.getElementById("hubDeckStage");

if (deckStage) {
  deckStage.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  deckStage.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
}

function handleSwipe() {
  const diffX = touchEndX - touchStartX;
  if (Math.abs(diffX) > 40) {
    if (diffX < 0) {
      nextCard(); // Swiped left -> next
    } else {
      prevCard(); // Swiped right -> prev
    }
  }
}

// View Mode Toggle (Deck vs Grid)
if (btnDeckMode && btnGridMode && hubDeckWrapper) {
  btnDeckMode.addEventListener("click", () => {
    isDeckMode = true;
    hubDeckWrapper.classList.remove("grid-mode");
    hubDeckWrapper.classList.add("deck-mode");
    btnDeckMode.classList.add("active");
    btnGridMode.classList.remove("active");
    updateDeckPositions();
  });

  btnGridMode.addEventListener("click", () => {
    isDeckMode = false;
    hubDeckWrapper.classList.remove("deck-mode");
    hubDeckWrapper.classList.add("grid-mode");
    btnGridMode.classList.add("active");
    btnDeckMode.classList.remove("active");

    // In grid mode, display cards normally
    allHubCards.forEach(card => {
      const match = currentCategory === "all" || card.getAttribute("data-category") === currentCategory;
      card.style.display = match ? "flex" : "none";
      card.classList.remove(
        "card-active",
        "card-next-1",
        "card-next-2",
        "card-prev-1",
        "card-prev-2",
        "card-hidden"
      );
    });
  });
}

// ==========================================
// 6. CATEGORY FILTERING (DECK & GRID COMPATIBLE)
// ==========================================
const hubTabButtons = document.querySelectorAll(".hub-tab-btn");

hubTabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    hubTabButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    currentCategory = btn.getAttribute("data-category");

    if (currentCategory === "all") {
      visibleCards = [...allHubCards];
    } else {
      visibleCards = allHubCards.filter(card => card.getAttribute("data-category") === currentCategory);
    }

    activeDeckIndex = 0;
    renderDeckDots();

    if (isDeckMode) {
      updateDeckPositions();
    } else {
      allHubCards.forEach(card => {
        const match = currentCategory === "all" || card.getAttribute("data-category") === currentCategory;
        card.style.display = match ? "flex" : "none";
      });
    }
  });
});

// ==========================================
// 7. INITIALIZE
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  typeLoop();
  checkLiveServer();
  renderDeckDots();
  updateDeckPositions();
});
