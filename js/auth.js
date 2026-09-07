/**
 * DEVLOG - AUTHENTICATION & PRIVATE PORTAL LOGIC
 * Client-side secure portal with LocalStorage persistence.
 */

const AUTH_CONFIG = {
  DEFAULT_USER: "admin",
  DEFAULT_PASS: "cuong1012",
  SESSION_KEY: "devlog_auth_session",
  REMEMBER_KEY: "devlog_auth_remember",
  CUSTOM_USER_KEY: "devlog_custom_user",
  CUSTOM_PASS_KEY: "devlog_custom_pass",
  NOTES_KEY: "devlog_private_notes"
};

// ==========================================
// 1. CREDENTIALS & SESSION MANAGEMENT
// ==========================================
function getStoredCredentials() {
  const user = localStorage.getItem(AUTH_CONFIG.CUSTOM_USER_KEY) || AUTH_CONFIG.DEFAULT_USER;
  const pass = localStorage.getItem(AUTH_CONFIG.CUSTOM_PASS_KEY) || AUTH_CONFIG.DEFAULT_PASS;
  return { user, pass };
}

function isAuthenticated() {
  const isSession = sessionStorage.getItem(AUTH_CONFIG.SESSION_KEY) === "true";
  const isRemembered = localStorage.getItem(AUTH_CONFIG.REMEMBER_KEY) === "true";
  return isSession || isRemembered;
}

function login(username, password, rememberMe) {
  const creds = getStoredCredentials();
  if (username.trim() === creds.user && password === creds.pass) {
    if (rememberMe) {
      localStorage.setItem(AUTH_CONFIG.REMEMBER_KEY, "true");
    } else {
      sessionStorage.setItem(AUTH_CONFIG.SESSION_KEY, "true");
    }
    return { success: true };
  }
  return { success: false, message: "Tên đăng nhập hoặc mật khẩu không chính xác!" };
}

function logout() {
  sessionStorage.removeItem(AUTH_CONFIG.SESSION_KEY);
  localStorage.removeItem(AUTH_CONFIG.REMEMBER_KEY);
  window.location.href = "login.html";
}

function updatePassword(newPassword) {
  if (!newPassword || newPassword.length < 4) {
    return { success: false, message: "Mật khẩu mới phải có ít nhất 4 ký tự!" };
  }
  localStorage.setItem(AUTH_CONFIG.CUSTOM_PASS_KEY, newPassword);
  return { success: true };
}

// ==========================================
// 2. DEFAULT PRIVATE DATA
// ==========================================
const DEFAULT_NOTES = [
  {
    id: 1,
    title: "Nhật ký: Ngày đầu tiên đưa blog lên GitHub Pages",
    category: "diary",
    categoryName: "Nhật ký",
    date: "07/09/2026",
    content: "Hôm nay mình đã xây dựng hoàn chỉnh trang Blog cá nhân hiện đại và đưa lên GitHub thành công. Giao diện Dark/Light mode hoạt động rất mượt mà. Sẽ tiếp tục cập nhật thêm các bài viết về công nghệ và AI!"
  },
  {
    id: 2,
    title: "Kế hoạch & Ý tưởng dự án cá nhân quý tới",
    category: "idea",
    categoryName: "Ý tưởng mật",
    date: "07/09/2026",
    content: "- Xây dựng một mini tool tra cứu thông tin tự động bằng AI.\n- Học thêm về Docker và Cloud Deployment.\n- Viết 2 bài chia sẻ kinh nghiệm trên blog cá nhân mỗi tháng."
  },
  {
    id: 3,
    title: "Ghi chú cấu hình & Khóa API dự phòng",
    category: "account",
    categoryName: "Tài khoản",
    date: "07/09/2026",
    content: "Server Backup IP: 192.168.1.100\nCấu hình GitHub Token có hạn sử dụng đến cuối năm.\n(Lưu ý: Luôn đổi mật khẩu định kỳ để đảm bảo an toàn tối đa)."
  }
];

function getPrivateNotes() {
  const data = localStorage.getItem(AUTH_CONFIG.NOTES_KEY);
  if (!data) {
    localStorage.setItem(AUTH_CONFIG.NOTES_KEY, JSON.stringify(DEFAULT_NOTES));
    return DEFAULT_NOTES;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return DEFAULT_NOTES;
  }
}

function savePrivateNotes(notes) {
  localStorage.setItem(AUTH_CONFIG.NOTES_KEY, JSON.stringify(notes));
}

// Export functions for HTML pages
window.DevLogAuth = {
  isAuthenticated,
  login,
  logout,
  updatePassword,
  getPrivateNotes,
  savePrivateNotes,
  getStoredCredentials
};
