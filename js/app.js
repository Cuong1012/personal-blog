/**
 * DEVLOG - JAVASCRIPT APPLICATION LOGIC
 * Manages Theme toggle, Articles data, Filtering, Search, and Modal Reader.
 */

// ==========================================
// 1. SAMPLE ARTICLES DATA
// ==========================================
const BLOG_POSTS = [
  {
    id: 1,
    title: "Bắt đầu với AI Coding: Tăng tốc độ phát triển phần mềm gấp 3 lần",
    category: "ai",
    categoryName: "AI & Công cụ",
    date: "05 Tháng 9, 2026",
    readTime: "5 phút đọc",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=700&auto=format&fit=crop&q=80",
    excerpt: "Khám phá cách tận dụng các trợ lý AI thông minh để hỗ trợ viết mã nguồn, gỡ lỗi và tự động hóa các tác vụ lặp đi lặp lại một cách hiệu quả.",
    content: `
      <p>Trí tuệ nhân tạo (AI) đang thay đổi hoàn toàn cách các kỹ sư phần mềm làm việc mỗi ngày. Không còn là viễn cảnh xa xôi, việc tích hợp AI vào quy trình lập trình đang giúp các nhà phát triển tiết kiệm hàng chục giờ mỗi tuần.</p>
      
      <h3>Tại sao nên dùng AI hỗ trợ lập trình?</h3>
      <p>AI không thay thế tư duy logic và kiến trúc hệ thống của bạn, nhưng nó là người trợ lý đắc lực giúp xử lý các công việc mang tính thủ tục như:</p>
      <ul>
        <li>Tự động sinh boilerplate code, cấu trúc file ban đầu.</li>
        <li>Tìm kiếm và giải thích nhanh các lỗi cú pháp hoặc logic khó thấy.</li>
        <li>Viết unit test tự động với độ phủ cao.</li>
      </ul>

      <blockquote>"AI không thay thế lập trình viên, nhưng lập trình viên biết dùng AI sẽ thay thế những người không dùng."</blockquote>

      <h3>Đoạn mã ví dụ xử lý bất đồng bộ trong JavaScript:</h3>
      <pre><code>async function fetchTechNews() {
  try {
    const response = await fetch('https://api.example.com/posts');
    const data = await response.json();
    console.log("Đã tải dữ liệu thành công:", data);
  } catch (error) {
    console.error("Lỗi khi kết nối API:", error);
  }
}</code></pre>

      <p>Hãy bắt đầu tích hợp các công cụ AI vào quy trình làm việc hàng ngày của bạn ngay từ hôm nay để cảm nhận sự bứt phá về năng suất làm việc nhé!</p>
    `
  },
  {
    id: 2,
    title: "10 Kỹ thuật CSS hiện đại giúp bạn thiết kế Web nhanh và đẹp hơn",
    category: "frontend",
    categoryName: "Frontend & UI",
    date: "02 Tháng 9, 2026",
    readTime: "7 phút đọc",
    thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=700&auto=format&fit=crop&q=80",
    excerpt: "Những tính năng CSS tiên tiến như CSS Grid, Flexbox gap, CSS Variables và pseudo-classes hiện đại giúp giao diện của bạn đẹp mắt và dễ bảo trì.",
    content: `
      <p>CSS đã có những bước tiến vượt bậc trong những năm gần đây. Những thứ trước đây từng đòi hỏi thư viện JavaScript cồng kềnh giờ đây có thể hoàn thành chỉ với vài dòng CSS thuần túy.</p>

      <h3>1. CSS Variables (Biến tùy biến)</h3>
      <p>CSS Variables giúp việc quản lý màu sắc, khoảng cách và triển khai Dark Mode trở nên vô cùng dễ dàng mà không cần dùng Sass hay Less.</p>
      
      <h3>2. Tính năng Flexbox 'gap'</h3>
      <p>Thay vì phải dùng margin âm hay pseudo-selectors phức tạp, thuộc tính <code>gap</code> giờ đã được hỗ trợ rộng rãi trên toàn bộ trình duyệt hiện đại.</p>

      <blockquote>Một thiết kế tinh tế là khi người dùng cảm thấy mọi thứ tự nhiên, trực quan mà không cần phải suy nghĩ.</blockquote>

      <p>Hãy liên tục cập nhật các thuộc tính mới của CSS để giữ cho mã nguồn của bạn luôn sạch, gọn và tải nhanh nhất có thể.</p>
    `
  },
  {
    id: 3,
    title: "Hành trình xây dựng thói quen đọc sách và tự học công nghệ",
    category: "life",
    categoryName: "Góc đời sống",
    date: "28 Tháng 8, 2026",
    readTime: "4 phút đọc",
    thumbnail: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=700&auto=format&fit=crop&q=80",
    excerpt: "Làm thế nào để duy trì ngọn lửa đam mê học tập trong ngành công nghệ luôn thay đổi chóng mặt? Đây là những trải nghiệm thực tế của mình.",
    content: `
      <p>Trong ngành công nghệ, những gì bạn biết hôm nay có thể sẽ lỗi thời sau 2 đến 3 năm. Vì vậy, kỹ năng quan trọng nhất của một lập trình viên không phải là biết bao nhiêu ngôn ngữ, mà là khả năng tự học liên tục.</p>

      <h3>Chiến lược 30 phút mỗi ngày</h3>
      <p>Đừng đặt mục tiêu quá nặng nề như đọc hết 1 cuốn sách trong 2 ngày. Hãy bắt đầu bằng việc dành trọn vẹn 30 phút buổi sáng hoặc trước khi ngủ để đọc tài liệu, sách chuyên ngành hoặc viết mã thử nghiệm một công nghệ mới.</p>

      <blockquote>"Sự nhất quán nhỏ mỗi ngày sẽ tạo nên sự khác biệt khổng lồ sau một năm."</blockquote>

      <p>Hãy kiên nhẫn với hành trình của bản thân và tận hưởng từng bài học bạn tích lũy được nhé!</p>
    `
  },
  {
    id: 4,
    title: "Clean Code: Viết mã nguồn rõ ràng, dễ bảo trì cho dự án lớn",
    category: "dev",
    categoryName: "Lập trình & Tech",
    date: "20 Tháng 8, 2026",
    readTime: "6 phút đọc",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=700&auto=format&fit=crop&q=80",
    excerpt: "Nguyên tắc đặt tên biến, tách hàm đơn nhiệm (Single Responsibility) và tư duy viết mã để người khác (và chính bạn sau 6 tháng) có thể đọc hiểu dễ dàng.",
    content: `
      <p>Viết code cho máy tính chạy thì ai cũng có thể làm được sau vài tháng học lập trình. Nhưng viết code cho người khác đọc hiểu và bảo trì được mới là dấu ấn của một lập trình viên chuyên nghiệp.</p>

      <h3>Những nguyên tắc cốt lõi:</h3>
      <ul>
        <li><strong>Tên biến có ý nghĩa:</strong> Tránh các tên vô nghĩa như <code>x</code>, <code>temp</code>, <code>data1</code>. Hãy dùng <code>activeUserList</code>, <code>isPaymentSuccessful</code>.</li>
        <li><strong>Hàm ngắn và làm một việc duy nhất:</strong> Nếu một hàm vừa kiểm tra dữ liệu, vừa gọi API, vừa cập nhật giao diện, hãy tách nó ra!</li>
        <li><strong>Hạn chế comment thừa:</strong> Code sạch tự nó giải thích ý nghĩa. Chỉ viết comment khi bạn cần giải thích 'tại sao' (lý do thiết kế) chứ không phải 'cái gì'.</li>
      </ul>

      <p>Đầu tư thời gian viết code chỉn chu ngay từ đầu sẽ giúp bạn tiết kiệm vô số giờ gỡ lỗi trong tương lai.</p>
    `
  },
  {
    id: 5,
    title: "Tối ưu hóa hiệu năng Website (Web Performance Optimization)",
    category: "frontend",
    categoryName: "Frontend & UI",
    date: "15 Tháng 8, 2026",
    readTime: "8 phút đọc",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&auto=format&fit=crop&q=80",
    excerpt: "Cách cải thiện điểm Core Web Vitals, nén ảnh định dạng WebP/AVIF, lazy-loading và tối ưu JavaScript để trang web tải dưới 1 giây.",
    content: `
      <p>Tốc độ tải trang ảnh hưởng trực tiếp đến trải nghiệm người dùng và thứ hạng SEO của website trên Google. Một trang web chậm 1 giây có thể khiến bạn mất đi hàng nghìn khách hàng tiềm năng.</p>

      <h3>Các bước tối ưu nhanh:</h3>
      <ol>
        <li>Chuyển đổi toàn bộ ảnh sang định dạng <code>WebP</code> hoặc <code>AVIF</code> để giảm dung lượng đến 70%.</li>
        <li>Sử dụng thuộc tính <code>loading="lazy"</code> cho hình ảnh dưới khung nhìn.</li>
        <li>Giảm thiểu kích thước bundle JavaScript và trì hoãn (defer) các script không quan trọng.</li>
      </ol>
      <p>Luôn đo lường hiệu năng bằng Google PageSpeed Insights hoặc Chrome DevTools Lighthouse trước và sau khi tối ưu.</p>
    `
  },
  {
    id: 6,
    title: "Tại sao Git & GitHub là kỹ năng sống còn của mọi Lập trình viên",
    category: "dev",
    categoryName: "Lập trình & Tech",
    date: "10 Tháng 8, 2026",
    readTime: "5 phút đọc",
    thumbnail: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=700&auto=format&fit=crop&q=80",
    excerpt: "Từ quản lý phiên bản, làm việc nhóm qua Pull Request cho đến việc xây dựng portfolio uy tín trên GitHub để nhà tuyển dụng chú ý.",
    content: `
      <p>Git không chỉ là công cụ lưu trữ mã nguồn, nó là máy du hành thời gian cho toàn bộ dự án của bạn và là phương thức giao tiếp tiêu chuẩn giữa các kỹ sư phần mềm trên toàn cầu.</p>
      
      <h3>Lợi ích lớn nhất của GitHub:</h3>
      <ul>
        <li>Không bao giờ lo mất dữ liệu hay lỗi phiên bản: bạn có thể quay lại bất kỳ thời điểm nào trong quá khứ.</li>
        <li>Làm việc nhóm mượt mà nhờ Pull Request và Code Review.</li>
        <li>GitHub Pages: Miễn phí lưu trữ và triển khai trang web tĩnh cực kỳ nhanh chóng.</li>
      </ul>
      <p>Hãy biến trang cá nhân GitHub thành 'CV sống' của bạn bằng cách đẩy các dự án thực tế lên đó thường xuyên nhé!</p>
    `
  }
];

// ==========================================
// 2. DOM ELEMENTS
// ==========================================
const postsGrid = document.getElementById("postsGrid");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const categoriesFilter = document.getElementById("categoriesFilter");
const filterButtons = document.querySelectorAll(".filter-btn");
const resetFilterBtn = document.getElementById("resetFilterBtn");

const themeToggle = document.getElementById("themeToggle");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navMenu = document.getElementById("navMenu");

// Modal Elements
const articleModal = document.getElementById("articleModal");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const modalDoneBtn = document.getElementById("modalDoneBtn");
const modalShareBtn = document.getElementById("modalShareBtn");
const modalBody = document.getElementById("modalBody");

// Newsletter Form
const newsletterForm = document.getElementById("newsletterForm");
const newsletterEmail = document.getElementById("newsletterEmail");
const formFeedback = document.getElementById("formFeedback");

// State
let currentCategory = "all";
let searchQuery = "";
let currentOpenPost = null;

// ==========================================
// 3. THEME TOGGLE (LIGHT / DARK)
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

themeToggle.addEventListener("click", toggleTheme);

// ==========================================
// 4. RENDER POSTS
// ==========================================
function renderPosts() {
  // Filter by category and search text
  const filtered = BLOG_POSTS.filter(post => {
    const matchCategory = currentCategory === "all" || post.category === currentCategory;
    const matchSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (filtered.length === 0) {
    postsGrid.innerHTML = "";
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";
  postsGrid.innerHTML = filtered.map(post => `
    <article class="post-card" onclick="openArticleModal(${post.id})">
      <div class="post-thumb-wrapper">
        <img src="${post.thumbnail}" alt="${post.title}" class="post-thumb" loading="lazy" />
        <span class="post-category-tag">${post.categoryName}</span>
      </div>
      <div class="post-content">
        <div class="post-meta">
          <span><i class="fa-regular fa-calendar"></i> ${post.date}</span>
          <span><i class="fa-regular fa-clock"></i> ${post.readTime}</span>
        </div>
        <h3 class="post-title">${post.title}</h3>
        <p class="post-excerpt">${post.excerpt}</p>
        <div class="post-footer">
          <span>Đọc bài viết</span>
          <i class="fa-solid fa-arrow-right"></i>
        </div>
      </div>
    </article>
  `).join("");
}

// ==========================================
// 5. FILTER & SEARCH HANDLERS
// ==========================================
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.getAttribute("data-category");
    renderPosts();
  });
});

searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value.trim();
  clearSearchBtn.style.display = searchQuery ? "block" : "none";
  renderPosts();
});

clearSearchBtn.addEventListener("click", () => {
  searchInput.value = "";
  searchQuery = "";
  clearSearchBtn.style.display = "none";
  searchInput.focus();
  renderPosts();
});

resetFilterBtn.addEventListener("click", () => {
  currentCategory = "all";
  searchQuery = "";
  searchInput.value = "";
  clearSearchBtn.style.display = "none";
  filterButtons.forEach(b => {
    b.classList.toggle("active", b.getAttribute("data-category") === "all");
  });
  renderPosts();
});

// ==========================================
// 6. ARTICLE MODAL READER
// ==========================================
window.openArticleModal = function(id) {
  const post = BLOG_POSTS.find(p => p.id === id);
  if (!post) return;

  currentOpenPost = post;
  modalBody.innerHTML = `
    <div class="modal-header-meta">
      <span class="badge" style="margin-bottom:0;"><i class="fa-solid fa-tag"></i> ${post.categoryName}</span>
      <span>•</span>
      <span><i class="fa-regular fa-calendar"></i> ${post.date}</span>
      <span>•</span>
      <span><i class="fa-regular fa-clock"></i> ${post.readTime}</span>
    </div>
    <h1 class="modal-title">${post.title}</h1>
    <img src="${post.thumbnail}" alt="${post.title}" class="modal-banner-img" />
    <div class="modal-article-text">
      ${post.content}
    </div>
  `;

  articleModal.classList.add("active");
  articleModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden"; // Lock scroll
};

function closeArticleModal() {
  articleModal.classList.remove("active");
  articleModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = ""; // Unlock scroll
  currentOpenPost = null;
}

modalCloseBtn.addEventListener("click", closeArticleModal);
modalDoneBtn.addEventListener("click", closeArticleModal);
modalBackdrop.addEventListener("click", closeArticleModal);

// Close on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && articleModal.classList.contains("active")) {
    closeArticleModal();
  }
});

// Share button
modalShareBtn.addEventListener("click", async () => {
  if (!currentOpenPost) return;

  if (navigator.share) {
    try {
      await navigator.share({
        title: currentOpenPost.title,
        text: currentOpenPost.excerpt,
        url: window.location.href
      });
    } catch (err) {
      console.log("Share dismissed");
    }
  } else {
    // Copy link fallback
    navigator.clipboard.writeText(window.location.href).then(() => {
      const originalText = modalShareBtn.innerHTML;
      modalShareBtn.innerHTML = '<i class="fa-solid fa-check"></i> Đã sao chép link!';
      setTimeout(() => {
        modalShareBtn.innerHTML = originalText;
      }, 2000);
    });
  }
});

// ==========================================
// 7. NEWSLETTER FORM (MOCK)
// ==========================================
newsletterForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = newsletterEmail.value.trim();
  if (email) {
    formFeedback.className = "form-feedback success";
    formFeedback.innerHTML = `<i class="fa-solid fa-circle-check"></i> Cảm ơn bạn! Đã đăng ký thành công với email: <strong>${email}</strong>`;
    newsletterEmail.value = "";
    setTimeout(() => {
      formFeedback.innerHTML = "";
    }, 5000);
  }
});

// ==========================================
// 8. MOBILE MENU & NAVIGATION
// ==========================================
mobileMenuBtn.addEventListener("click", () => {
  navMenu.classList.toggle("open");
});

document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
  });
});

// Set current year in footer
document.getElementById("currentYear").textContent = new Date().getFullYear();

// ==========================================
// 9. INITIALIZE
// ==========================================
initTheme();
renderPosts();
